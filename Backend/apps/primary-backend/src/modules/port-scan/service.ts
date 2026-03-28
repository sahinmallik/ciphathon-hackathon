import net from "node:net";

export abstract class PortService {
  /**
   * Checks a single port
   */
  static async checkPort(
    host: string,
    port: number,
    timeout = 1500,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(timeout);

      socket.on("connect", () => {
        socket.destroy();
        resolve(true);
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve(false);
      });

      socket.on("error", () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(port, host);
    });
  }

  /**
   * Scans a predefined list of high-risk ports
   */
  static async scanCommonPorts(host: string) {
    // Critical ports for SMEs: Web, Remote Access, Databases, Email
    const criticalPorts = [
      21, 22, 23, 25, 53, 80, 110, 123, 139, 143, 161, 443, 445, 465, 587, 993,
      995, 1433, 1521, 1723, 2375, 2376, 3000, 3306, 3389, 5432, 5601, 5900,
      6379, 6443, 8000, 8008, 8080, 8443, 9090, 9200, 27017,
    ];

    const results = await Promise.all(
      criticalPorts.map(async (port) => ({
        port,
        status: (await this.checkPort(host, port)) ? "open" : "closed",
      })),
    );

    return results.filter((r) => r.status === "open");
  }
}
