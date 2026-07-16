/** Jednorázově vygeneruje statický QR kód platby (SPAYD) pro sbírku
 *  „Seno pro Louku" do public/assets/seno-qr.png.
 *
 *  Spuštění: npm run campaign:qr
 *  Přegeneruj po každé změně účtu, VS nebo zprávy v lib/campaign.ts.
 */
import QRCode from "qrcode";
import { buildSpaydString } from "../lib/campaign";

const payload = buildSpaydString();

await QRCode.toFile("public/assets/seno-qr.png", payload, {
  errorCorrectionLevel: "M",
  margin: 2,
  width: 600,
});

console.log("Vygenerováno public/assets/seno-qr.png pro:", payload);
