"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { contactSchema, type ContactFormData } from "@/lib/schema";

type SubmitState = "idle" | "submitting" | "success" | "error" | "rate-limited";

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setSubmitState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 429) {
        const json = await res.json();
        setSubmitState("rate-limited");
        setErrorMsg(json.error ?? "Too many requests. Please wait.");
        return;
      }

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setSubmitState("error");
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitState("success");
      reset();
    } catch {
      setSubmitState("error");
      setErrorMsg("Network error. Please check your connection.");
    }
  }

  const inputClass =
    "w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--accent)] focus:outline-none";

  const labelClass = "block text-xs font-mono text-[var(--muted)] mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          name *
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Tom Swart"
          {...register("name")}
          className={inputClass}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-mono">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          email *
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          className={inputClass}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-mono">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          message *
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="What's on your mind?"
          {...register("message")}
          className={`${inputClass} resize-none`}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-mono">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md border border-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-all hover:bg-[var(--accent-dim)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {/* Feedback messages */}
      <AnimatePresence mode="wait">
        {submitState === "success" && (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-green-700 dark:text-green-400 font-mono text-center"
          >
            ✓ Message sent. I&apos;ll get back to you soon.
          </motion.p>
        )}
        {(submitState === "error" || submitState === "rate-limited") && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-600 dark:text-red-400 font-mono text-center"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
