import dns from "dns/promises";

type ReputationResult = {
  score: number;
  level: "good" | "moderate" | "poor";
  issues: string[];
  blacklistHits: string[];
};

export class ReputationService {
  // Common DKIM selectors used by major providers (Google, Outlook, Mailchimp, etc.)
  private static readonly COMMON_SELECTORS = [
    "selector1",
    "selector2",
    "google",
    "default",
    "mail",
    "dkim",
    "k1",
    "s1",
  ];

  static async getIP(domain: string): Promise<string | null> {
    try {
      const res = await dns.resolve4(domain);
      return res[0];
    } catch {
      return null;
    }
  }

  static reverseIP(ip: string) {
    return ip.split(".").reverse().join(".");
  }

  static async checkBlacklist(ip: string) {
    const reversed = this.reverseIP(ip);
    const blacklists = [
      "zen.spamhaus.org",
      "bl.spamcop.net",
      "dnsbl.sorbs.net",
    ];
    const hits: string[] = [];

    await Promise.all(
      blacklists.map(async (bl) => {
        try {
          await dns.resolve(`${reversed}.${bl}`);
          hits.push(bl);
        } catch {}
      }),
    );
    return hits;
  }

  /**
   * Attempts to find a DKIM record by brute-forcing common selectors
   */
  static async bruteForceDKIM(domain: string): Promise<boolean> {
    const results = await Promise.allSettled(
      this.COMMON_SELECTORS.map((selector) =>
        dns.resolveTxt(`${selector}._domainkey.${domain}`),
      ),
    );
    return results.some((r) => r.status === "fulfilled");
  }

  static calculateScore(params: {
    blacklistHits: string[];
    hasSPF: boolean;
    hasDKIM: boolean;
    hasDMARC: boolean;
    sslValid: boolean;
  }) {
    let score = 100;
    const issues: string[] = [];

    if (params.blacklistHits.length > 0) {
      score -= 60;
      issues.push("Domain is blacklisted");
    }
    if (!params.sslValid) {
      score -= 15;
      issues.push("SSL certificate issue");
    }
    if (!params.hasSPF) {
      score -= 5;
      issues.push("Missing SPF");
    }
    if (!params.hasDKIM) {
      score -= 10;
      issues.push("Missing DKIM (No common selectors found)");
    }
    if (!params.hasDMARC) {
      score -= 10;
      issues.push("Missing DMARC");
    }
    if (!params.hasSPF && !params.hasDKIM && !params.hasDMARC) {
      issues.push("Email authentication is completely missing");
    }

    if (score < 0) score = 0;
    let level: "good" | "moderate" | "poor" = "good";
    if (params.blacklistHits.length > 0 || score <= 50) {
      level = "poor";
    } else if (score < 90) {
      level = "moderate";
    }

    return { score, level, issues };
  }

  static async scan(domain: string, emailData?: any, tlsData?: any) {
    const ip = await this.getIP(domain);
    if (!ip) {
      return {
        score: 0,
        level: "poor",
        issues: ["Domain does not resolve"],
        blacklistHits: [],
      };
    }

    const blacklistHits = await this.checkBlacklist(ip);

    // Initial values from provided data
    let hasSPF = emailData?.spf?.exists;
    let hasDMARC = emailData?.dmarc?.exists;
    let hasDKIM = emailData?.dkim?.exists === true;

    // 1. Resolve SPF and DMARC
    try {
      const txtRecords = (await dns.resolveTxt(domain)).flat();
      if (hasSPF === undefined) {
        hasSPF = txtRecords.some((rec) => rec.startsWith("v=spf1"));
      }
      if (hasDMARC === undefined) {
        try {
          const dmarcTxt = (await dns.resolveTxt(`_dmarc.${domain}`)).flat();
          hasDMARC = dmarcTxt.some((rec) => rec.startsWith("v=DMARC1"));
        } catch {
          hasDMARC = false;
        }
      }
    } catch {
      hasSPF = !!hasSPF;
      hasDMARC = !!hasDMARC;
    }

    // 2. Brute-force DKIM if not provided or found false
    if (!hasDKIM) {
      hasDKIM = await this.bruteForceDKIM(domain);
    }

    const sslValid = tlsData?.data ? tlsData.data.valid === true : true;

    const result = this.calculateScore({
      blacklistHits,
      hasSPF: !!hasSPF,
      hasDKIM,
      hasDMARC: !!hasDMARC,
      sslValid,
    });

    return { ...result, blacklistHits };
  }
}
