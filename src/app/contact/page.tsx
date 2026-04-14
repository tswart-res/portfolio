import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch - send me a message and I'll get back to you soon.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs text-[var(--accent)] mb-2 tracking-widest uppercase">
          get in touch
        </p>
        <h1 className="text-4xl font-bold text-[var(--fg)] mb-4">Contact</h1>
        <p className="text-[var(--muted)] leading-relaxed">
          Have a project in mind, a question, or just want to say hello? Fill
          out the form and I&apos;ll get back to you as soon as possible.
        </p>
      </div>

      {/* Form */}
      <ContactForm />
    </div>
  );
}
