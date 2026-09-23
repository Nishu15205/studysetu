/**
 * Central SEO engine — school keyword database, master keywords,
 * shared FAQ data and JSON-LD structured-data builder.
 *
 * School names are used descriptively (students of these schools follow the
 * same NCERT / state syllabus that our original notes are based on).
 * StudySetu is NOT affiliated with any school or board.
 */
import { SITE } from "@/config/site";

export type RegionSeo = {
  id: string;
  name: string;
  area: string;
  boardLine: string;
  schools: string[];
};

// ---------- Region-wise school keyword database ----------
export const REGIONS: RegionSeo[] = [
  {
    id: "noida",
    name: "Noida & Greater Noida",
    area: "Delhi NCR · Gautam Buddha Nagar (UP)",
    boardLine: "CBSE schools — NCERT syllabus",
    schools: [
      "DPS Noida (Delhi Public School Sector 30)",
      "Amity International School Noida",
      "Lotus Valley International School Noida",
      "Apeejay School Noida Sector 16A",
      "Step by Step School Noida",
      "Somerville School Noida",
      "Bal Bharati Public School Noida",
      "Cambridge School Noida",
      "Ryan International School Noida",
      "Vishwa Bharati Public School Noida",
      "Army Public School Noida",
      "Kendriya Vidyalaya Noida",
      "Father Agnel School Noida",
      "Ramagya School Noida",
      "Kothari International School Noida",
      "The Millennium School Noida",
      "Sapphire International School Noida",
      "Gyanshree School Noida",
      "Delhi Public School Greater Noida",
      "GD Goenka Public School Greater Noida",
      "Pragyan School Greater Noida",
      "St. Joseph's School Greater Noida",
    ],
  },
  {
    id: "delhi",
    name: "Delhi",
    area: "New Delhi & all 11 zones",
    boardLine: "CBSE schools — NCERT syllabus",
    schools: [
      "DPS R.K. Puram",
      "DPS Dwarka",
      "DPS Vasant Kunj",
      "DPS Mathura Road",
      "St. Columba's School Delhi",
      "Modern School Barakhamba Road",
      "Modern School Vasant Vihar",
      "Springdales School Pusa Road",
      "Sanskriti School Chanakyapuri",
      "Sardar Patel Vidyalaya",
      "The Air Force School Subroto Park",
      "Bal Bharati Public School Ganga Ram Hospital Marg",
      "Convent of Jesus and Mary Delhi",
      "St. Mary's School Safdarjung Enclave",
      "St. Xavier's School Raj Niwas Marg",
      "Greenfields Public School Shahdara",
      "Tagore International School Vasant Vihar",
      "Apeejay School Pitampura",
      "Ahlcon Public School Mayur Vihar",
      "DAV Public School Sreshtha Vihar",
      "Lancers Convent Delhi",
      "Lovely Public School Delhi",
      "Mount Carmel School Anand Niketan",
      "Kendriya Vidyalaya Delhi",
    ],
  },
  {
    id: "haryana",
    name: "Haryana",
    area: "Gurugram · Faridabad · Sonipat · Panipat · Panchkula · Karnal",
    boardLine: "CBSE + HBSE (BSEH) schools",
    schools: [
      "DPS Gurugram Sector 45",
      "The Shri Ram School Moulsari Gurugram",
      "The Shri Ram School Aravali",
      "Pathways World School Aravali Gurugram",
      "GD Goenka World School Sohna Road",
      "Scottish High International School Gurugram",
      "Heritage Xperiential Learning School Gurugram",
      "Suncity School Gurugram",
      "Amity Global School Gurugram",
      "St. Xavier's High School Gurugram",
      "DPS Sonepat",
      "Little Angels School Sonipat",
      "Yadavindra Public School Panchkula",
      "Sainik School Kunjpura Karnal",
      "Manav Rachna International School Faridabad",
      "Apeejay School Faridabad",
      "DAV Public School Faridabad Sector 14",
      "Modern Delhi Public School Faridabad",
      "Kendriya Vidyalaya Gurugram",
      "HBSE government schools Haryana",
    ],
  },
  {
    id: "kerala",
    name: "Kerala",
    area: "Thiruvananthapuram · Kochi · Kozhikode · Thrissur · Kannur · Kottayam",
    boardLine: "CBSE + DHSE Kerala / SCERT schools",
    schools: [
      "Kendriya Vidyalaya Pattom Thiruvananthapuram",
      "St. Thomas Residential School Thiruvananthapuram",
      "Loyola School Thiruvananthapuram",
      "Sarvodaya Central Vidyalaya Thiruvananthapuram",
      "Christ Nagar School Thiruvananthapuram",
      "Bhavans Vidya Mandir Elamakkara Kochi",
      "Rajagiri Christu Jayanthi Public School Kochi",
      "Chinmaya Vidyalaya Vaduthala Kochi",
      "Gregorian Public School Kochi",
      "Devagiri CMI Public School Kozhikode",
      "Silver Hills Public School Kozhikode",
      "St. Joseph's Boys Higher Secondary School Kozhikode",
      "St. Mary's Residential Public School Thiruvalla",
      "Chinmaya Vidyalaya Kannur",
      "Kendriya Vidyalaya Adoor",
      "Nirmala Public School Muvattupuzha",
      "SCERT Kerala schools",
      "DHSE Kerala higher secondary schools",
      "KBPE SSLC schools Kerala",
    ],
  },
  {
    id: "bihar",
    name: "Bihar",
    area: "Patna · Gaya · Muzaffarpur · Bhagalpur · Darbhanga · Bihar Sharif",
    boardLine: "CBSE + BSEB (Bihar Board) schools",
    schools: [
      "Notre Dame Academy Patna",
      "St. Joseph's Convent High School Patna",
      "Don Bosco Academy Patna",
      "St. Karen's High School Patna",
      "Loyola High School Patna",
      "St. Michael's High School Patna",
      "St. Xavier's High School Patna",
      "Patna Central School",
      "Radiant International School Patna",
      "DAV Public School BSEB Colony Patna",
      "Baldwin Academy Patna",
      "Krishna Niketan Patna",
      "Gyan Niketan Patna",
      "Delhi Public School Bihar Sharif",
      "Sainik School Gopalganj",
      "Simultala Awasiya Vidyalaya Jamui",
      "Jawahar Navodaya Vidyalaya Bihar",
      "BSEB government schools Bihar",
    ],
  },
];

export const ALL_SCHOOLS: string[] = REGIONS.flatMap((r) => r.schools);
export const SCHOOL_COUNT = ALL_SCHOOLS.length;

// ---------- Master meta keywords ----------
const GENERIC_KEYWORDS = [
  // class-level
  "class 9 study material",
  "class 10 study material",
  "class 11 study material",
  "class 12 study material",
  "class 9 notes free",
  "class 10 notes free",
  "class 11 notes free",
  "class 12 notes free",
  "cbse class 10 notes",
  "cbse class 12 notes",
  // pyq / papers
  "pyq class 9",
  "pyq class 10",
  "pyq class 11",
  "pyq class 12",
  "previous year question paper cbse",
  "cbse previous year questions",
  "hbse previous year question paper",
  "bseb previous year question paper",
  "kerala dhse previous year paper",
  "cbse sample paper 2026",
  "bseb model paper",
  "hbse sample paper",
  // boards
  "cbse board",
  "hbse board haryana",
  "bseh haryana board",
  "bseb bihar board",
  "kerala board dhse",
  "scert kerala",
  "ncert syllabus",
  "ncert notes",
  // study intent
  "free study material india",
  "board exam preparation",
  "board exam 2026",
  "class 10 board exam preparation",
  "class 12 board exam preparation",
  "chapter wise notes",
  "mcq practice online free",
  "online quiz for students",
  "revision notes",
  "study notes online",
  "hindi medium notes",
  // regions
  "noida school notes",
  "delhi school notes",
  "haryana board notes",
  "bihar board notes",
  "kerala board notes",
  "delhi ncr study material",
  "study material for cbse schools",
  "free education website india",
];

export const SEO_KEYWORDS: string[] = [
  ...GENERIC_KEYWORDS,
  ...ALL_SCHOOLS,
  // realistic long-tail combos for the biggest schools
  "DPS Noida study material",
  "DPS RK Puram notes",
  "Amity International School Noida notes",
  "Lotus Valley Noida study material",
  "BSEB 10th objective question",
  "BSEB 12th model set question",
  "Kerala Plus One study material",
  "Kerala Plus Two notes",
];

// ---------- Shared FAQ (visible page + FAQPage schema stay in sync) ----------
export const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Is StudySetu completely free for Class 9-12 students?",
    a: "Yes. All revision notes, PYQ guides and practice questions are 100% free forever. The site is supported by non-intrusive ads, so students never pay anything.",
  },
  {
    q: "Which boards and schools does StudySetu cover?",
    a: "Classes 9 to 12 for CBSE schools across Noida, Greater Noida and Delhi (including DPS, Amity International, Lotus Valley, Apeejay, Bal Bharati and Kendriya Vidyalaya), CBSE and HBSE schools in Haryana (Gurugram, Faridabad, Sonipat), CBSE and BSEB schools in Bihar (Patna and beyond), and CBSE plus DHSE/SCERT schools in Kerala. Our notes follow the NCERT syllabus used by these schools and boards. StudySetu is not affiliated with any school or board — we are an independent, original study companion.",
  },
  {
    q: "Is the content copyright-safe?",
    a: "Absolutely. Every note and question on StudySetu is originally written by our AI study engine in fresh words — we never reproduce NCERT textbook text, guide books or board question papers. For previous year papers, we give direct links to official board portals (CBSE, HBSE, BSEB, Kerala DHSE) where boards themselves publish papers for free.",
  },
  {
    q: "How often is new content added?",
    a: "The complete syllabus is already covered — every chapter of every subject has its own revision note, and every subject has an original practice set. A new Daily Challenge question appears every day, and we keep expanding notes and question banks with each new syllabus update, all without you having to do anything.",
  },
  {
    q: "Can I rely on these notes for CBSE Class 10 and Class 12 board exams?",
    a: "Yes — the notes are written chapter-wise exactly along the NCERT syllabus that CBSE Class 10 and Class 12 board exams follow. They are designed for fast revision and concept clarity. Always cross-check with your prescribed textbook and solve official board sample papers (linked in our PYQ section) for the exact exam pattern.",
  },
  {
    q: "Does StudySetu provide previous year question papers (PYQs)?",
    a: "We provide a complete PYQ guide: year-wise paper details (2021-2025) for CBSE, HBSE, BSEB and Kerala DHSE, plus direct links to the official board websites where the actual papers can be downloaded free — keeping everything copyright-safe.",
  },
];

// ---------- JSON-LD structured data ----------
export function buildJsonLd(): string {
  const org = {
    "@type": "EducationalOrganization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.svg`,
    description:
      "Free original study notes, previous year question paper guides and daily MCQ practice for Class 9-12 students of CBSE schools in Noida, Greater Noida and Delhi, HBSE Haryana, BSEB Bihar and Kerala DHSE/SCERT boards. No login needed — 100% free forever.",
    areaServed: [
      { "@type": "City", name: "Noida" },
      { "@type": "City", name: "Greater Noida" },
      { "@type": "City", name: "New Delhi" },
      { "@type": "State", name: "Haryana" },
      { "@type": "State", name: "Bihar" },
      { "@type": "State", name: "Kerala" },
    ],
    knowsAbout: [
      "CBSE Class 9-12 syllabus",
      "NCERT revision notes",
      "CBSE previous year question papers",
      "HBSE question papers",
      "BSEB previous year papers",
      "Kerala DHSE study material",
      "Class 10 board exam preparation",
      "Class 12 board exam preparation",
    ],
    sameAs: Object.values(SITE.boards).map((b) => b.website),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${SITE.url}/#webpage`,
    url: SITE.url,
    name: "StudySetu — Free Class 9-12 Notes, PYQs & Practice Questions",
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#organization` },
    inLanguage: "en-IN",
    datePublished: "2025-01-01",
  };

  const courses = [9, 10, 11, 12].map((grade) => ({
    "@type": "Course",
    name: `Class ${grade} Study Material & PYQs — CBSE, HBSE, BSEB & Kerala Board`,
    description: `Free chapter-wise original revision notes, previous year question paper guides and practice MCQs for Class ${grade} students following the NCERT / state board syllabus (CBSE Delhi-Noida, HBSE Haryana, BSEB Bihar, Kerala DHSE).`,
    inLanguage: ["en", "hi"],
    isAccessibleForFree: true,
    provider: { "@id": `${SITE.url}/#organization` },
    url: `${SITE.url}/#classes`,
  }));

  const faq = {
    "@type": "FAQPage",
    "@id": `${SITE.url}/#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [org, website, webPage, faq, ...courses],
  };

  return JSON.stringify(graph).replace(/</g, "\\u003c");
}
