"use client";

import { useState } from "react";
import { certifications, achievements, education, profile, socials } from "@/content/data";
import { scrollToId } from "@/lib/scene";
import { useTilt } from "@/lib/hooks";
import { Glyph } from "../ui/Glyph";
import { Button, SectionTitle } from "../ui/Primitives";

export function Resume() {
  const frame = useTilt<HTMLAnchorElement>(6);
  const rows = [
    { k: "Education", v: `${education[0].title} · ${education[0].place.split(",")[0]} · CGPA 8.27` },
    { k: "Projects", v: "Cloud Image Rainfall Prediction · Smart Railway Navigator · Ripples Solutions Website" },
    { k: "Skills", v: "C · C++ · Java · Python · MySQL · MongoDB · HTML · CSS · JavaScript · React · Node.js · GraphQL · DSA · OOP · Cryptography · Operating Systems" },
    { k: "Certifications", v: `${certifications.length} — AWS, OpenAI, Anthropic + PayPal, LinkedIn, IIT Kharagpur, Coursera, IEEE` },
    { k: "Achievements", v: `${achievements.length} — hackathon podium, IEEE presentation, national hackathon build` },
    { k: "Contact", v: profile.email },
  ];
  return (
    <section id="resume" data-scene="far-right" className="section" aria-labelledby="resume-title">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionTitle id="resume-title" index="07" kicker="Resume" lines={["The journey.", <span key="r" className="ice-edge">Documented<span className="blue-dot">.</span></span>]} />
          <dl className="mt-14 flex flex-col" data-stagger>
            {rows.map((r) => (
              <div key={r.k} className="grid gap-2 border-t border-white/[0.07] py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="label text-ice">{r.k}</dt>
                <dd className="text-[0.98rem] text-soft/85">{r.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal>
            <Button variant="primary" icon="download" href={profile.resumePdf} download="Santhosh_Kumar_K_Resume.pdf" testId="resume-download">
              Download PDF
            </Button>
            <Button variant="glass" icon="arrow-up-right" href={profile.resumePdf} external testId="resume-open">
              Open PDF
            </Button>
          </div>
        </div>
        <div className="lg:col-span-5 lg:pt-10" data-reveal>
          <a ref={frame} href={profile.resumePdf} target="_blank" rel="noopener noreferrer" className="tile block" aria-label="Open the resume PDF in a new tab">
            <span className="tile-plate" aria-hidden />
            <span className="tile-face block p-4">
              <span className="relative block overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.resumePreview} alt="Preview of the first page of Santhosh Kumar K's resume" className="w-full" loading="lazy" width={935} height={1210} />
                <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(3,4,6,.85))" }} />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
                  <span className="label text-white">Resume · PDF · 1 page</span>
                  <Glyph name="arrow-up-right" size={20} strokeWidth={3} />
                </span>
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

type Errors = Partial<Record<"name" | "email" | "message", string>>;

function copyText(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
  return Promise.resolve();
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");

  const onCopy = async () => {
    try {
      await copyText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setStatus("Copy failed — the address is " + profile.email);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const next: Errors = {};
    if (name.length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = "Please enter a valid email address.";
    if (message.length < 20) next.message = "Please write at least 20 characters.";
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("");
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    setStatus("Your email app is opening with the message ready to send.");
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const field = (name: keyof Errors, label: string, props: React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>, area = false) => (
    <div>
      <label htmlFor={`f-${name}`} className="label mb-2 block">
        {label}
      </label>
      {area ? (
        <textarea id={`f-${name}`} name={name} rows={5} className="field resize-y" aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `e-${name}` : undefined} {...props} />
      ) : (
        <input id={`f-${name}`} name={name} className="field" aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `e-${name}` : undefined} {...props} />
      )}
      {errors[name] && (
        <p id={`e-${name}`} className="mt-2 flex items-center gap-2 text-[0.85rem] text-ice" role="alert">
          <span className="h-1.5 w-1.5 rotate-45 bg-ice" aria-hidden /> {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" data-scene="right" className="section pb-0" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionTitle id="contact-title" index="08" kicker="Contact" lines={["Let's build", <span key="c" className="ice-edge">what&apos;s next<span className="blue-dot">.</span></span>]} />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6" data-reveal>
            <p className="label">Email</p>
            <a href={`mailto:${profile.email}`} className="display mt-4 block text-[clamp(1.25rem,5.6vw,2.9rem)] leading-none text-white transition-colors [overflow-wrap:anywhere] hover:text-ice lg:text-[clamp(1.25rem,2.6vw,2.9rem)]" data-testid="email-link">
              {profile.email}
            </a>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" icon="mail" href={`mailto:${profile.email}`}>
                Write an email
              </Button>
              <Button variant="glass" icon={copied ? "check" : "copy"} onClick={onCopy} testId="copy-email">
                {copied ? "Copied" : "Copy email"}
              </Button>
            </div>
            <p className="sr-only" aria-live="polite">
              {copied ? "Email address copied to clipboard" : ""}
            </p>

            <p className="label mt-16">Elsewhere</p>
            <ul className="mt-5 grid grid-cols-2 gap-3" data-testid="socials">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="tile flex h-full items-center gap-4 p-4" aria-label={`${s.label} — ${s.handle} (opens in a new tab)`}>
                    <span className="tile-plate" aria-hidden />
                    <span className="tile-face flex items-center gap-4">
                      <span className="tile-well h-12 w-12 shrink-0">
                        <Glyph name={s.glyph} size={26} />
                      </span>
                      <span className="min-w-0">
                        <span className="head block text-[0.95rem]">{s.label}</span>
                        <span className="label block truncate text-[0.55rem] normal-case tracking-[0.08em]">{s.handle}</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6" data-reveal>
            <form className="glass flex flex-col gap-5 p-6 sm:p-9" onSubmit={onSubmit} noValidate aria-describedby="form-note" data-testid="contact-form">
              <div className="corner-ticks" />
              <div className="flex items-center justify-between">
                <p className="head text-[1.15rem]">Send a message</p>
                <span className="label text-ice">Opens your mail app</span>
              </div>
              {field("name", "Name", { autoComplete: "name", placeholder: "Your name" })}
              {field("email", "Email", { type: "email", autoComplete: "email", placeholder: "you@company.com" })}
              {field("message", "Message", { placeholder: "What would you like to build or discuss?" }, true)}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <p id="form-note" className="max-w-[30ch] text-[0.82rem] text-steel">
                  No data is stored. The form drafts an email in your own mail app.
                </p>
                <Button variant="primary" type="submit" icon="arrow-right" testId="form-submit">
                  Send message
                </Button>
              </div>
              <p className="text-[0.9rem] text-ice" role="status" data-testid="form-status">
                {status}
              </p>
            </form>
          </div>
        </div>
      </div>

      <footer className="relative mt-32">
        <div className="rule-blue" aria-hidden />
        <div className="wrap overflow-hidden pt-10">
          <p className="display chrome-text whitespace-nowrap text-[clamp(3rem,11.2vw,14.5rem)] leading-[0.8] opacity-90" aria-hidden>
            Santhosh Kumar K
          </p>
          <div className="flex flex-col gap-6 border-t border-white/[0.06] py-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="label">© 2026 Santhosh Kumar K</span>
              <span className="label hidden sm:inline">Madurai, India</span>
            </div>
            <span className="label">Built with Next.js · Three.js · GSAP</span>
            <button type="button" onClick={() => scrollToId("top")} className="btn btn-glass btn-sm self-start md:self-auto">
              <span>Back to top</span>
              <span className="btn-ico" aria-hidden>
                <Glyph name="arrow-up" size={14} strokeWidth={3} />
              </span>
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}
