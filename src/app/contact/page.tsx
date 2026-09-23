import type { Metadata } from "next";
import { Mail, Clock3, ListChecks, MessageCircleQuestion } from "lucide-react";
import { LegalPageShell } from "@/components/site/legal-page-shell";
import { Button } from "@/components/ui/button";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions, feedback, content concerns or advertising enquiries — we'd love to hear from you.",
};

const CONTACT_FAQS = [
  {
    q: "Do you have a phone number or office address?",
    a: "No — StudySetu is a small, fully online team, so email is the only channel we use. It also keeps a written record of every request, which helps us fix content faster.",
  },
  {
    q: "Can I request notes or questions for a specific chapter?",
    a: "Yes! Send us the class, subject and chapter name. Our study engine covers every chapter already, but if something feels thin or unclear, your request pushes it up our improvement queue.",
  },
  {
    q: "How do I report a copyright concern?",
    a: "Email us the page URL and a short description of the issue. All original notes and questions on StudySetu are written by us, and PYQ papers are only linked from official board portals — but if anything looks wrong, we review and act within 48 hours.",
  },
];

export default function ContactPage() {
  return (
    <LegalPageShell
      title="Contact Us"
      description="Questions, feedback, content concerns or advertising enquiries — we'd love to hear from you."
    >
      {/* Contact card */}
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center md:p-8 dark:border-stone-800 dark:bg-stone-900/60">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
          <Mail className="size-6 text-emerald-700 dark:text-emerald-400" aria-hidden />
        </div>
        <h2 className="mt-4!">Email us — it&rsquo;s the fastest way</h2>
        <p className="mx-auto max-w-md text-sm text-stone-500 dark:text-stone-400">
          One simple inbox for everything: content corrections, copyright concerns, advertising
          enquiries, collaboration ideas and general feedback.
        </p>
        <div className="mt-5 flex justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full px-6 text-base text-primary-foreground! no-underline!"
          >
            <a href={`mailto:${SITE.contactEmail}?subject=StudySetu%20enquiry`}>
              <Mail className="size-5" aria-hidden />
              {SITE.contactEmail}
            </a>
          </Button>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
          <Clock3 className="size-4 text-emerald-700 dark:text-emerald-400" aria-hidden />
          We reply to every genuine email — usually within <strong>48 hours</strong>.
        </p>
      </div>

      <h2>What to include in your email</h2>
      <p>Three small details help us help you much faster:</p>
      <ul className="list-none! space-y-3 pl-0!">
        <li className="flex gap-3">
          <ListChecks className="mt-0.5 size-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden />
          <span>
            <strong>Topic</strong> — tell us which one it is: content correction, copyright
            concern, advertising enquiry or general feedback.
          </span>
        </li>
        <li className="flex gap-3">
          <ListChecks className="mt-0.5 size-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden />
          <span>
            <strong>Your name</strong> — a first name is enough; it just tells us how to address
            you in the reply.
          </span>
        </li>
        <li className="flex gap-3">
          <ListChecks className="mt-0.5 size-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden />
          <span>
            <strong>Page URL</strong> — copy the link of the page you are writing about (for
            example the chapter note or PYQ page), so we can jump straight to it.
          </span>
        </li>
      </ul>

      <h2>Before you write — quick answers</h2>
      <div className="space-y-4">
        {CONTACT_FAQS.map((f) => (
          <div
            key={f.q}
            className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900/40"
          >
            <p className="flex items-start gap-2 font-medium text-stone-800 dark:text-stone-100">
              <MessageCircleQuestion
                className="mt-0.5 size-4 shrink-0 text-emerald-700 dark:text-emerald-400"
                aria-hidden
              />
              {f.q}
            </p>
            <p className="mt-1.5 pl-6 text-sm text-stone-600 dark:text-stone-300">{f.a}</p>
          </div>
        ))}
      </div>

      <h2>Advertising &amp; business enquiries</h2>
      <p>
        If you are a publisher, education company or advertiser who wants to work with StudySetu,
        use the same email address with the word <strong>&ldquo;Advertising&rdquo;</strong> in the
        subject line. Please note that all ad serving is handled through Google AdSense — direct
        sponsorships are considered case by case.
      </p>
    </LegalPageShell>
  );
}
