import type { Metadata } from "next";
import { LegalPageShell } from "@/components/site/legal-page-shell";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How StudySetu collects, uses and protects your information — Google AdSense and cookies explained in plain language.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description="How StudySetu collects, uses and protects your information — Google AdSense and cookies explained in plain language."
    >
      <h2>1. Introduction</h2>
      <p>
        StudySetu is a free educational website for Class 9–12 students in India. We publish
        original revision notes, practice questions and previous-year-question (PYQ) guides for
        students of CBSE (Noida, Delhi and across India), HBSE (BSEH) Haryana, BSEB Bihar and the
        Kerala board (DHSE / SCERT) — with <strong>no login and no sign-up required</strong>.
      </p>
      <p>
        Because there are no accounts on StudySetu, we collect{" "}
        <strong>almost no personal information</strong>. This policy explains, in plain language,
        the small amount of data that does reach us (and our advertising partners) when you use the
        site, and the choices you have.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We have deliberately kept data collection to a minimum:</p>
      <ul>
        <li>
          <strong>No accounts, no sign-up.</strong> We never ask you to create an account, so we do
          not collect your name, phone number, address, school name or any profile details. There
          is no registration form anywhere on the site.
        </li>
        <li>
          <strong>Basic anonymous analytics.</strong> Like most websites, we may use aggregated,
          privacy-respecting analytics to count page views and learn which subjects and classes
          students find most useful. This information is statistical and cannot identify you
          personally.
        </li>
        <li>
          <strong>Email only if you choose to write to us.</strong> If you email us about a content
          correction, a copyright concern or general feedback, we receive whatever you choose to
          include — typically your email address and name. We use it only to read and reply to your
          message.
        </li>
      </ul>

      <h2>3. Cookies</h2>
      <p>
        Cookies are small text files that a website or its partners store in your browser. They are
        widely used to make websites work, to remember preferences and to measure how a site is
        used.
      </p>
      <ul>
        <li>
          StudySetu itself does not require cookies to work — you can browse all notes, PYQ guides
          and practice questions without logging in.
        </li>
        <li>
          We (and the third parties described below) may use cookies and similar technologies such
          as local storage for basic analytics and to serve and measure advertising.
        </li>
        <li>
          You can control or delete cookies through your browser settings at any time. Blocking
          cookies will not stop you from using StudySetu.
        </li>
      </ul>

      <h2>4. Google AdSense &amp; Third-Party Advertising</h2>
      <p>
        StudySetu is 100% free for students and is supported by advertising. We use{" "}
        <strong>Google AdSense</strong> to show ads on the site. This is the most important part of
        this policy:
      </p>
      <ul>
        <li>
          Google, as a third-party vendor, uses cookies to serve ads on this site.
        </li>
        <li>
          Google&rsquo;s use of advertising cookies (including the{" "}
          <strong>DoubleClick DART cookie</strong>) enables it and its partners to serve ads to you
          based on your visit to this and other sites on the Internet.
        </li>
        <li>
          You may <strong>opt out of personalized advertising</strong> by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          , and you can opt out of third-party vendor cookies used for personalized advertising at{" "}
          <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">
            www.aboutads.info
          </a>
          .
        </li>
        <li>
          Third-party vendors and ad networks may also serve ads on StudySetu. These vendors and ad
          networks may use cookies to serve ads based on your prior visits to this website or other
          websites. We do not control these third-party cookies, and their use is governed by each
          vendor&rsquo;s own privacy policy.
        </li>
        <li>
          We follow Google&rsquo;s program policies. You can read how Google uses data from sites
          or apps that use its advertising services on the{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads policies page
          </a>
          .
        </li>
        <li>
          Visitors from the EEA, UK and other regions with consent rules are shown personalized ads
          only where the required consent is respected, and can change their choice at any time via
          Google Ads Settings.
        </li>
      </ul>

      <h2>5. How We Use Information</h2>
      <p>The limited information described above is used only to:</p>
      <ul>
        <li>Operate, maintain and improve StudySetu — for example, deciding which chapters and subjects to expand next;</li>
        <li>Reply to your emails (corrections, copyright concerns, feedback);</li>
        <li>Keep the site free by displaying advertising and measuring how it performs;</li>
        <li>Keep StudySetu safe from misuse, spam and abuse.</li>
      </ul>
      <p>
        We do not use your information to build advertising profiles ourselves, and we never send
        promotional emails — we have no mailing list.
      </p>

      <h2>6. Data Sharing</h2>
      <p>
        <strong>We do not sell your personal data. Ever.</strong> We have no personal data to sell:
        no accounts, no profiles, no phone numbers. The only sharing that happens is:
      </p>
      <ul>
        <li>Aggregated, anonymous analytics data with our analytics provider (if in use);</li>
        <li>Standard advertising cookies handled by Google and ad networks as described in Section 4;</li>
        <li>Information you voluntarily put in an email to us, which stays with us.</li>
      </ul>
      <p>
        We may disclose information if required by Indian law or a valid legal process, and only to
        the extent necessary.
      </p>

      <h2>7. Children&rsquo;s Privacy</h2>
      <p>
        StudySetu is aimed at school students, and we care deeply about their safety. The site is
        designed so that students can use it <strong>without giving any personal information</strong>.
      </p>
      <ul>
        <li>We do not knowingly collect personal information from children under 13.</li>
        <li>There are no chat features, no user profiles and no public posting anywhere on StudySetu.</li>
        <li>
          If you are a parent or guardian and believe your child has sent us personal information
          (for example in an email), please <a href={`mailto:${SITE.contactEmail}`}>contact us</a>{" "}
          and we will promptly delete it.
        </li>
      </ul>

      <h2>8. Your Rights</h2>
      <p>
        Even though we collect almost nothing, you still have full control over the little data
        that exists. Consistent with privacy principles such as GDPR and CCPA:
      </p>
      <ul>
        <li><strong>Access:</strong> ask us what information we hold about you (usually just an email, if you wrote to us);</li>
        <li><strong>Deletion:</strong> ask us to delete any email correspondence with you;</li>
        <li><strong>Opt-out:</strong> turn off personalized advertising via Google Ads Settings (Section 4);</li>
        <li><strong>Cookies:</strong> clear or block cookies in your browser at any time.</li>
      </ul>
      <p>
        To exercise any of these rights, simply email{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. We respond to every
        genuine request, usually within 48 hours.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time — for example if we add a new
        advertising partner or analytics tool. The &ldquo;Last updated&rdquo; date at the top of
        this page will always show when it was last revised. Continued use of StudySetu after a
        change means you accept the updated policy. Material changes will be reflected clearly on
        this page rather than hidden in fine print.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about this policy or anything else on StudySetu? We would genuinely love to hear
        from you:
      </p>
      <p>
        <strong>
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        </strong>
        <br />
        You can also use our <a href="/contact">Contact page</a> for the full list of topics we can
        help with.
      </p>
    </LegalPageShell>
  );
}
