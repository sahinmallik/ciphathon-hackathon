import dns from "dns/promises";

type SubdomainResult = {
  subdomain: string;
  status: "active" | "dangling" | "takeover-risk";
  reason?: string;
};

export class SubdomainService {
  static async enumerate(domain: string): Promise<string[]> {
    try {
      const res = await fetch(`https://crt.sh/?q=%25.${domain}&output=json`);
      const data = await res.json();

      const subs = new Set<string>();

      for (const entry of data) {
        const names = entry.name_value.split("\n");
        for (const name of names) {
          if (name.endsWith(domain)) subs.add(name.trim());
        }
      }

      return Array.from(subs);
    } catch {
      return [];
    }
  }

  static async checkDNS(subdomain: string) {
    try {
      await dns.resolve(subdomain);
      return true;
    } catch {
      return false;
    }
  }

  static async checkHTTP(subdomain: string) {
    try {
      const res = await fetch(`http://${subdomain}`, { method: "GET" });
      const text = await res.text();

      const patterns = [
        "NoSuchBucket",
        "There isn't a GitHub Pages site here",
        "Project not found",
        "domain not configured",
      ];

      for (const pattern of patterns) {
        if (text.includes(pattern)) {
          return { takeover: true, reason: pattern };
        }
      }

      return { takeover: false };
    } catch {
      return { takeover: false };
    }
  }

  static async scan(domain: string) {
    const subs = await this.enumerate(domain);

    const results: SubdomainResult[] = [];

    for (const sub of subs) {
      const exists = await this.checkDNS(sub);

      if (!exists) {
        results.push({
          subdomain: sub,
          status: "dangling",
          reason: "DNS does not resolve",
        });
        continue;
      }

      const http = await this.checkHTTP(sub);

      if (http.takeover) {
        results.push({
          subdomain: sub,
          status: "takeover-risk",
          reason: http.reason,
        });
      } else {
        results.push({
          subdomain: sub,
          status: "active",
        });
      }
    }

    const summary = {
      total: results.length,
      active: results.filter((r) => r.status === "active").length,
      dangling: results.filter((r) => r.status === "dangling").length,
      takeover: results.filter((r) => r.status === "takeover-risk").length,
    };

    return { summary, results };
  }
}
