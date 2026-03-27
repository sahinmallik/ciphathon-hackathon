import tls from "node:tls";
import { TlsModel } from "./model";

export abstract class TlsService {
  static async getSSLStatus(
    domainName: string,
  ): Promise<{ connection: boolean; data?: TlsModel.tlsResponseSchema }> {
    return new Promise((resolve) => {
      const socket = tls.connect({
        host: domainName,
        port: 443,
        servername: domainName,
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
      });

      let resolved = false;

      const done = (result: {
        connection: boolean;
        data?: TlsModel.tlsResponseSchema;
      }) => {
        if (!resolved) {
          resolved = true;
          resolve(result);
          socket.destroy();
        }
      };

      socket.on("secureConnect", () => {
        try {
          const cert = socket.getPeerCertificate(true);

          if (!cert || Object.keys(cert).length === 0) {
            return done({ connection: false });
          }

          const validTo = new Date(cert.valid_to).getTime();
          const now = Date.now();

          const daysRemaining = Math.round(
            (validTo - now) / (1000 * 60 * 60 * 24),
          );

          const issuerValue =
            cert.issuer?.O || cert.issuer?.CN || "Unknown Issuer";

          const issuer = Array.isArray(issuerValue)
            ? issuerValue[0]
            : issuerValue;

          return done({
            connection: true,
            data: {
              valid: daysRemaining < 0 ? "invalid" : "Valid",
              daysRemaining,
              issuer,
              protocol: socket.getProtocol() || "Unknown",
            },
          });
        } catch {
          return done({ connection: false });
        }
      });

      socket.on("error", () => {
        done({ connection: false });
      });

      socket.setTimeout(8000, () => {
        done({ connection: false });
      });
    });
  }
}
