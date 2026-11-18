"use client";

import type { ReactNode, MouseEventHandler } from "react";
import { Glyph, type GlyphName } from "./Glyph";
import { useMagnetic } from "@/lib/hooks";

type BtnProps = {
  children: ReactNode;
  variant?: "primary" | "glass" | "ghost";
  size?: "md" | "sm";
  icon?: GlyphName;
  href?: string;
  external?: boolean;
  download?: boolean | string;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
  testId?: string;
};

export function Button({
  children,
  variant = "glass",
  size = "md",
  icon,
  href,
  external,
  download,
  onClick,
  type = "button",
  className = "",
  ariaLabel,
  testId,
}: BtnProps) {
  const ref = useMagnetic<HTMLAnchorElement & HTMLButtonElement>(0.18);
  const cls = `btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="btn-ico" aria-hidden>
          <Glyph name={icon} size={16} strokeWidth={3} flat={variant === "primary"} tone={variant === "primary" ? "dark" : "metal"} />
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={cls}
        onClick={onClick}
        aria-label={ariaLabel}
        data-testid={testId}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: typeof download === "string" ? download : "" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref} type={type} className={cls} onClick={onClick} aria-label={ariaLabel} data-testid={testId}>
      {inner}
    </button>
  );
}

export function Badge({ children, quiet, small, className = "" }: { children: ReactNode; quiet?: boolean; small?: boolean; className?: string }) {
  return (
    <span className={`badge ${quiet ? "quiet" : ""} ${small ? "badge-sm" : ""} ${className}`}>
      {!small && <span className="diode" aria-hidden />}
      {children}
    </span>
  );
}

/** Eyebrow index + masked display lines. Lines animate via MotionLayer. */
export function SectionTitle({
  index,
  kicker,
  lines,
  id,
  size = "l",
  className = "",
}: {
  index: string;
  kicker: string;
  lines: ReactNode[];
  id?: string;
  size?: "l" | "m";
  className?: string;
}) {
  return (
    <header className={className}>
      <div className="mb-6 flex items-center gap-4" data-reveal>
        <span className="label tabular-nums text-ice">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-blue to-transparent" aria-hidden />
        <span className="eyebrow">{kicker}</span>
      </div>
      <h2 id={id} className={`display display-${size}`}>
        {lines.map((line, i) => (
          <span className="mask-line" key={i}>
            <span data-line>{line}</span>
          </span>
        ))}
      </h2>
    </header>
  );
}
