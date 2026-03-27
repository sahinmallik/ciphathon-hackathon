export class ScoringService {
  static calculate(data: any) {
    const tlsScore = this.tlsScore(data.tls);
    const emailScore = this.emailScore(data.email);

    const total = tlsScore + emailScore;

    return {
      total,
      level: this.getLevel(total),
      breakdown: {
        tls: tlsScore,
        email: emailScore,
      },
    };
  }

  private static tlsScore(tls: any) {
    if (!tls?.data) return 0;

    const t = tls.data;

    let score = 0;

    const isValid = t.valid === "Valid" || t.valid === true;

    if (isValid) score += 10;
    if (t.daysRemaining > 30) score += 5;
    if (["TLSv1.2", "TLSv1.3"].includes(t.protocol)) score += 5;
    if (t.issuer) score += 5;

    return score;
  }

  private static emailScore(email: any) {
    if (!email) return 0;

    let score = 0;

    if (email.spf?.exists) score += 8;

    score += this.getDKIMScore(email.dkim, email.domain);

    if (email.dmarc?.exists) score += 5;

    const policy = this.extractDMARCPolicy(email.dmarc?.record);

    if (policy === "reject" || policy === "quarantine") score += 4;

    return score;
  }

  private static getDKIMScore(dkim: any, domain: string) {
    if (!dkim) return 0;

    // strong signal
    if (dkim.exists === true) return 8;

    // inferred (like Google, Microsoft, etc.)
    if (dkim.exists === "likely") {
      if (this.isTrustedProvider(domain)) return 7;
      return 6;
    }

    return 0;
  }

  private static isTrustedProvider(domain: string) {
    if (!domain) return false;

    const providers = [
      "google.com",
      "gmail.com",
      "outlook.com",
      "microsoft.com",
      "yahoo.com",
    ];

    return providers.some((p) => domain.endsWith(p));
  }

  private static extractDMARCPolicy(record: string | null) {
    if (!record) return null;

    const match = record.match(/p=(none|quarantine|reject)/);
    return match ? match[1] : null;
  }

  private static getLevel(score: number) {
    if (score >= 45) return "Secure";
    if (score >= 35) return "Moderate";
    if (score >= 25) return "Warning";
    return "Critical";
  }
}
