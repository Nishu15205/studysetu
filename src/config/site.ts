export const SITE = {
  name: "StudySetu",
  tagline: "Free Study Material & PYQs for Class 9-12",
  description:
    "Free original study notes, previous year question paper guides and practice questions for Class 9-12 students of CBSE (Delhi/Noida), HBSE Haryana, BSEB Bihar and Kerala boards. No login, no sign-up — 100% free forever.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://studysetu.vercel.app",
  contactEmail: "hello@studysetu.example.com",
  // Google AdSense — put your publisher id here (e.g. "ca-pub-1234567890123456")
  // or set NEXT_PUBLIC_ADSENSE_CLIENT_ID env var. Leave empty to hide ads.
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  // ads.txt publisher line, e.g. "pub-1234567890123456"
  adsensePubId: process.env.ADSENSE_PUB_ID || "",
  boards: {
    CBSE: { region: "Delhi · Noida · UP", website: "https://cbse.gov.in/cbsenew/question-paper.html" },
    HBSE: { region: "Haryana", website: "https://bseh.org.in" },
    BSEB: { region: "Bihar", website: "https://biharboardonline.bihar.gov.in" },
    KERALA: { region: "Kerala (DHSE + SCERT)", website: "https://dhsekerala.gov.in" },
  },
} as const;

export type ViewKey = "home" | "study" | "pyq" | "practice" | "about";
