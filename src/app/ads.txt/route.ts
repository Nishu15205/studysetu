/**
 * /ads.txt — required by Google AdSense so advertisers can verify inventory.
 * Set ADSENSE_PUB_ID in .env (e.g. "pub-1234567890123456") after AdSense approval.
 */
export const dynamic = "force-static";

export function GET() {
  const pubId = process.env.ADSENSE_PUB_ID || "";
  const body = pubId
    ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`
    : "# Add your AdSense publisher id in ADSENSE_PUB_ID to activate ads.txt\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
