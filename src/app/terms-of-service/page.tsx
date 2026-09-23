import type { Metadata } from "next";
import { LegalPageShell } from "@/components/site/legal-page-shell";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The simple rules for using StudySetu — free study notes, practice questions and PYQ links for Class 9-12.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      description="The simple rules for using StudySetu — free study notes, practice questions and PYQ links for Class 9-12."
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using StudySetu, you agree to these Terms of Service. If you do not agree
        with any part of these terms, please do not use the website. Because StudySetu requires no
        registration, these terms apply simply by visiting and reading the content.
      </p>
      <p>
        If you are a student under 18, please use StudySetu with the knowledge of your parents or
        guardians — these terms apply to them as well.
      </p>

      <h2>2. Description of the Service</h2>
      <p>
        StudySetu is a <strong>free educational platform</strong> for Class 9–12 students in India.
        We provide:
      </p>
      <ul>
        <li>Original, chapter-wise revision notes for CBSE, HBSE (BSEH), BSEB and Kerala (DHSE / SCERT) syllabi;</li>
        <li>Original practice questions and daily MCQ challenges;</li>
        <li>Previous-year-question (PYQ) guides with direct links to official board portals.</li>
      </ul>
      <p>
        There is no login, no sign-up and no fee — the service is free forever and is supported by
        advertising. We may add, change or remove features as the site evolves.
      </p>

      <h2>3. Acceptable Use</h2>
      <p>StudySetu is built for learning. When using the site, you agree <strong>not</strong> to:</p>
      <ul>
        <li>
          <strong>Scrape or mass-download</strong> the site using bots, crawlers or automated tools
          (normal personal browsing and search-engine indexing are welcome);
        </li>
        <li>
          <strong>Resell or republish</strong> our notes, questions or other content as your own,
          whether in paid apps, coaching material, Telegram channels, PDF bundles or any other
          commercial product;
        </li>
        <li>
          <strong>Misuse the service</strong> — no attempts to hack, overload, deface or disrupt
          the site, no injecting malicious code, and no using StudySetu for any unlawful purpose;
        </li>
        <li>
          <strong>Copy to cheat.</strong> The content is meant for learning and revision, not for
          copying answers during examinations.
        </li>
      </ul>

      <h2>4. Intellectual Property</h2>
      <p>
        All original notes, explanations, practice questions and other written content on StudySetu
        are <strong>&copy; StudySetu</strong>. They were written originally for this platform and
        may not be reproduced, redistributed or used commercially without our written permission.
        Personal, non-commercial study use is exactly what the site is for — enjoy it freely.
      </p>
      <p>
        <strong>Board question papers are different:</strong> previous-year question papers belong
        to their respective boards (CBSE, HBSE/BSEH, BSEB, Kerala DHSE and others). StudySetu does
        not host, store or reproduce these papers — we only provide <em>links</em> to the official
        portals where the boards themselves publish the papers for free.
      </p>

      <h2>5. Educational Disclaimer</h2>
      <p>
        StudySetu notes and questions are <strong>study aids</strong>, written to help you revise
        faster and understand concepts clearly. They are <strong>not a substitute</strong> for your
        prescribed NCERT / state-board textbooks, your teachers, or your school&rsquo;s own
        guidance. Always cross-check with your official textbook and syllabus, and use official
        board sample papers for the exact exam pattern.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        StudySetu is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis,
        without warranties of any kind. To the maximum extent permitted by law:
      </p>
      <ul>
        <li>We do not guarantee that content is free of errors at all times — see our Disclaimer page;</li>
        <li>We are not liable for exam results, academic outcomes or decisions made based on the content;</li>
        <li>We are not liable for any indirect, incidental or consequential damages arising from use of the site;</li>
        <li>We are not responsible for the content or availability of third-party websites we link to.</li>
      </ul>

      <h2>7. Third-Party Links</h2>
      <p>
        Our PYQ section links to official board websites such as cbse.gov.in, bseh.org.in,
        biharboardonline.bihar.gov.in and dhsekerala.gov.in. These are independent government
        portals — we do not control them and are not responsible for their content, availability or
        practices. Please read their own terms and policies when you visit them.
      </p>
      <p>
        Advertisements shown via Google AdSense may also contain links to third-party sites; such
        links are chosen by the advertising network, not by StudySetu.
      </p>

      <h2>8. Changes to These Terms</h2>
      <p>
        We may update these Terms of Service from time to time. The &ldquo;Last updated&rdquo; date
        at the top of this page shows the current version. Continuing to use StudySetu after
        changes are published means you accept the updated terms. The rules will always stay simple
        and student-friendly.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These terms are governed by the <strong>laws of India</strong>. Any dispute relating to
        StudySetu will be subject to the exclusive jurisdiction of the courts of India.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these terms, permission requests or anything else? Email us at{" "}
        <strong>
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        </strong>{" "}
        or visit our <a href="/contact">Contact page</a>. We reply to genuine messages, usually
        within 48 hours.
      </p>
    </LegalPageShell>
  );
}
