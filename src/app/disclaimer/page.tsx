import type { Metadata } from "next";
import { LegalPageShell } from "@/components/site/legal-page-shell";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important information about StudySetu content, board affiliations and external links.",
};

export default function DisclaimerPage() {
  return (
    <LegalPageShell
      title="Disclaimer"
      description="Important information about StudySetu content, board affiliations and external links."
    >
      <h2>1. General Information Only</h2>
      <p>
        All content on StudySetu — revision notes, practice questions, PYQ guides and exam tips —
        is published <strong>for general educational purposes only</strong>. It is designed to
        support revision and concept clarity for Class 9–12 students, not to replace official
        textbooks, classroom teaching or your teachers&rsquo; guidance.
      </p>

      <h2>2. No Affiliation with Boards or Schools</h2>
      <p>
        StudySetu is an <strong>independent study platform</strong>. We are{" "}
        <strong>not affiliated with, sponsored by, endorsed by or officially connected to</strong>{" "}
        CBSE, HBSE (BSEH), BSEB, Kerala DHSE, SCERT, NCERT or any school, coaching institute or
        education department — in India or anywhere else.
      </p>
      <p>
        Where we mention school names (for example, schools in Noida, Delhi, Haryana, Kerala or
        Bihar) or board names, they are used <strong>only descriptively</strong> — to indicate
        which regions, syllabi and boards our original study material serves. Students of those
        schools follow the same NCERT / state syllabus that our notes are written around, but no
        school or board has reviewed, approved or endorsed our content.
      </p>

      <h2>3. Accuracy of Content</h2>
      <p>
        We work hard to keep StudySetu accurate and useful. Every note and question is{" "}
        <strong>written in original wording by our AI study engine</strong> and reviewed before
        publication — we never copy textbook text, guide books or board papers. However, education
        content can contain errors, and syllabi change. Therefore:
      </p>
      <ul>
        <li>Always cross-check important facts and definitions with your prescribed NCERT / state-board textbook;</li>
        <li>Treat our notes as revision aids, not as the final authority;</li>
        <li>For the exact exam pattern, blueprints and sample papers, rely on official board sources;</li>
        <li>If you spot a mistake, tell us — see Section 5 — and we will fix it quickly.</li>
      </ul>

      <h2>4. External Links Disclaimer</h2>
      <p>
        Our PYQ section links directly to the <strong>official board portals</strong> where
        previous-year question papers are published by the boards themselves:
      </p>
      <ul>
        <li>CBSE — cbse.gov.in</li>
        <li>HBSE (BSEH) Haryana — bseh.org.in</li>
        <li>BSEB Bihar — biharboardonline.bihar.gov.in</li>
        <li>Kerala DHSE — dhsekerala.gov.in</li>
      </ul>
      <p>
        <strong>We do not host any copyrighted question papers on StudySetu.</strong> We only
        provide links and metadata (year, subject, class). These official portals are owned and
        operated by the respective boards; we cannot control their content, availability or
        changes. If a link stops working, check the board&rsquo;s homepage or{" "}
        <a href={`mailto:${SITE.contactEmail}`}>tell us</a> so we can update it.
      </p>

      <h2>5. Copyright Notice</h2>
      <p>
        All notes, explanations, practice questions and other original content on StudySetu are{" "}
        <strong>&copy; StudySetu</strong> and may not be copied, resold or republished without
        permission. We respect the intellectual property of others just as firmly:
      </p>
      <ul>
        <li>
          If you believe any content on StudySetu infringes your copyright, email{" "}
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> with the page URL and a
          short description of the concern;
        </li>
        <li>
          We commit to <strong>reviewing and acting on every genuine copyright report within 48
          hours</strong> — either removing the content or resolving the issue with you directly.
        </li>
      </ul>

      <h2>6. Fair Use Note</h2>
      <p>
        StudySetu refers to <strong>syllabus structures, chapter names, subject names and
        examination patterns</strong> (such as NCERT chapter titles or board exam schemes) purely
        for identification and descriptive reference. These are factual, functional references
        made in the spirit of fair use / fair dealing for education — students need to know which
        chapter a note belongs to. No original expression from any textbook is reproduced: every
        explanation, summary and question is written fresh by us.
      </p>

      <h2>7. Contact</h2>
      <p>
        Anything on this page unclear, or a concern to raise? Email{" "}
        <strong>
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        </strong>{" "}
        or use our <a href="/contact">Contact page</a> — we respond within 48 hours.
      </p>
    </LegalPageShell>
  );
}
