"use client";

import { profile } from "@/content/data";
import { scrollToId } from "@/lib/scene";
import { Badge, Button } from "../ui/Primitives";

export default function Hero() {
  return (
    <section id="top" data-scene="right" className="relative z-[2] flex min-h-[100svh] flex-col overflow-hidden pt-[5.5rem]" aria-labelledby="hero-name">
      <div className="wrap flex flex-1 flex-col justify-center pb-8">
        <div className="mb-7 flex flex-wrap gap-2.5" data-reveal>
          <Badge>AI Enthusiast</Badge>
          <Badge quiet>Software Developer</Badge>
          <Badge quiet>Independent Builder</Badge>
        </div>

        <p className="display max-w-[16ch] text-[clamp(3rem,min(6.6vw,11.5vh),8.6rem)] leading-[0.86]" aria-label="I don't just follow technology. I explore what's next.">
          <span className="mask-line"><span data-line>I don&apos;t just</span></span>
          <span className="mask-line"><span data-line className="outline-text">follow technology.</span></span>
          <span className="mask-line"><span data-line>I explore</span></span>
          <span className="mask-line"><span data-line className="ice-edge">what&apos;s next<span className="blue-dot">.</span></span></span>
        </p>

        <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,30rem)_auto] xl:items-end xl:gap-12">
          <p className="lead text-[clamp(1.05rem,1.35vw,1.3rem)] text-soft/85" data-reveal>
            I&apos;m Santhosh Kumar K, an independent developer passionate about Artificial Intelligence, software engineering and building meaningful technology.
          </p>

        <div className="flex flex-wrap gap-3" data-reveal>
          <Button variant="primary" icon="arrow-down" onClick={() => scrollToId("work")} testId="cta-work">
            Explore my work
          </Button>
          <Button variant="glass" icon="document" href={profile.resumePdf} external testId="cta-resume">
            View resume
          </Button>
          <Button variant="glass" icon="mail" onClick={() => scrollToId("contact")} testId="cta-contact">
            Connect with me
          </Button>
        </div>
        </div>
      </div>

      {/* monumental name band */}
      <div className="relative">
        <div className="rule-blue" aria-hidden />
        <div className="wrap flex items-end justify-between gap-6 pb-5 pt-4">
          <h1 id="hero-name" className="display display-xl sweep whitespace-nowrap" data-sweep>
            Santhosh Kumar K
          </h1>
          <button
            type="button"
            onClick={() => scrollToId("about")}
            className="mb-3 hidden shrink-0 flex-col items-center gap-3 md:flex"
            aria-label="Scroll to about"
          >
            <span className="scroll-capsule" />
            <span className="label text-[0.55rem] [writing-mode:vertical-rl]">Scroll</span>
          </button>
        </div>
      </div>
    </section>
  );
}
