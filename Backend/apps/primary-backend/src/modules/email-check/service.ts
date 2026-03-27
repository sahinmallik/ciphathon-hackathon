import dns from "dns/promises";

type RecordResult = {
  exists: boolean | "likely";
  record: string | null;
  selector: string | null;
  note?: string;
};

export class EmailSecurityService {
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

  private static async getHistoricalSelectors(
    domain: string,
  ): Promise<string[]> {
    try {
      return [];
    } catch {
      return [];
    }
  }

  static async resolveTXTSafe(domain: string): Promise<string[]> {
    try {
      const res = await Promise.race([
        dns.resolveTxt(domain),
        new Promise<string[][]>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 2500),
        ),
      ]);
      return (res as string[][]).map((r) => r.join("").trim());
    } catch {
      return [];
    }
  }

  private static detectProvider(spf: string | null) {
    if (!spf) return null;
    if (spf.includes("_spf.google.com")) return "google";
    if (spf.includes("spf.protection.outlook.com")) return "microsoft";
    if (spf.includes("zoho.com")) return "zoho";
    if (spf.includes("sendgrid.net")) return "sendgrid";
    return null;
  }

  static async checkDKIM(
    domain: string,
    manualSelector?: string,
  ): Promise<RecordResult> {
    if (manualSelector) {
      const records = await this.resolveTXTSafe(
        `${manualSelector}._domainkey.${domain}`,
      );
      const found = records.find(
        (r) => r.includes("p=") || r.includes("v=DKIM1"),
      );
      if (found)
        return { exists: true, record: found, selector: manualSelector };
    }

    const historical = await this.getHistoricalSelectors(domain);
    const allToTry = Array.from(
      new Set([...historical, ...this.COMMON_SELECTORS]),
    );

    const results = await Promise.allSettled(
      allToTry.map(async (s) => {
        const records = await this.resolveTXTSafe(`${s}._domainkey.${domain}`);
        const found = records.find(
          (r) => r.includes("p=") || r.includes("v=DKIM1"),
        );
        return found ? { selector: s, record: found } : null;
      }),
    );

    for (const res of results) {
      if (res.status === "fulfilled" && res.value) {
        return {
          exists: true,
          record: res.value.record,
          selector: res.value.selector,
        };
      }
    }

    return { exists: false, record: null, selector: null };
  }

  static async fullCheck(domain: string, manualSelector?: string) {
    const spfRecords = await this.resolveTXTSafe(domain);
    const spfRecord = spfRecords.find((r) => r.startsWith("v=spf1")) || null;

    const spf = {
      exists: !!spfRecord,
      record: spfRecord,
    };

    const dmarcRecords = await this.resolveTXTSafe(`_dmarc.${domain}`);
    const dmarcRecord =
      dmarcRecords.find((r) => r.startsWith("v=DMARC1")) || null;

    const dmarc = {
      exists: !!dmarcRecord,
      record: dmarcRecord,
    };

    let dkim = await this.checkDKIM(domain, manualSelector);

    const provider = this.detectProvider(spf.record);

    if (!dkim.exists && dmarc.exists) {
      if (provider === "google") {
        dkim = {
          ...dkim,
          exists: "likely",
          note: "Google uses private rotating DKIM selectors.",
        };
      } else if (provider === "microsoft") {
        dkim = {
          ...dkim,
          exists: "likely",
          note: "Microsoft uses selector1/selector2 or custom DKIM.",
        };
      } else {
        dkim = {
          ...dkim,
          exists: "likely",
          note: "DKIM likely exists but selector not discoverable.",
        };
      }
    }

    return { domain, spf, dmarc, dkim };
  }
}
