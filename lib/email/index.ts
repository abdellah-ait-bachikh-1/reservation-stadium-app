import fs from "fs";

import path from "path";
// Convert logo to base64 (run once and cache it)
let logoBase64: string | null = null;

export function getLogoBase64(): string {
  if (!logoBase64) {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const imageBuffer = fs.readFileSync(logoPath);
    logoBase64 = imageBuffer.toString("base64");
  }
  return logoBase64;
}

