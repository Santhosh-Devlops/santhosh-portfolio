import { expect, test, type Page } from "@playwright/test";

// Emoji-presentation characters, or any pictograph forced to emoji style with VS16.
// (Plain text symbols such as the copyright sign are allowed.)
const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/u;

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  return errors;
}

/** Bring an element into view and let the 1s reveal animation settle before interacting. */
async function reach(page: Page, testId: string) {
  const el = page.getByTestId(testId);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  await el.scrollIntoViewIfNeeded();
  return el;
}

async function openSite(page: Page) {
  await page.goto("/?intro=0");
  await expect(page.locator("#top h1")).toHaveText(/Santhosh Kumar K/i);
}

test.describe("title sequence", () => {
  test("plays, can be skipped, and reveals the site", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/?intro=1");
    const intro = page.getByTestId("intro");
    await expect(intro).toBeVisible();
    await expect(page.locator(".site-main")).toBeHidden();
    await page.getByTestId("skip-intro").click();
    await expect(intro).toBeHidden({ timeout: 5000 });
    await expect(page.locator(".site-main")).toBeVisible();
    expect(await page.evaluate(() => sessionStorage.getItem("skk-intro"))).toBe("1");
    expect(errors).toEqual([]);
  });

  test("reaches Enter experience on its own in under 9 seconds", async ({ page }) => {
    await page.goto("/?intro=1");
    await expect(page.getByText("Beyond code", { exact: false })).toBeVisible({ timeout: 4000 });
    const enter = page.getByTestId("enter-experience");
    await expect(enter).toBeVisible({ timeout: 9000 });
    await enter.click();
    await expect(page.getByTestId("intro")).toBeHidden({ timeout: 5000 });
  });

  test("Escape skips", async ({ page }) => {
    await page.goto("/?intro=1");
    await expect(page.getByTestId("intro")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("intro")).toBeHidden({ timeout: 5000 });
  });
});

test.describe("content integrity", () => {
  test("no emojis anywhere in text, labels or alt text", async ({ page }) => {
    await openSite(page);
    const text = await page.evaluate(() => document.body.innerText);
    expect(EMOJI.test(text)).toBe(false);
    const attrs = await page.evaluate(() =>
      [...document.querySelectorAll("[aria-label],[alt],[title]")].map((e) => (e.getAttribute("aria-label") || "") + (e.getAttribute("alt") || "") + (e.getAttribute("title") || "")).join(" "),
    );
    expect(EMOJI.test(attrs)).toBe(false);
  });

  test("street address and phone number are not published", async ({ page }) => {
    await openSite(page);
    // Generic patterns, so the private values themselves never live in the repo.
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).not.toMatch(/(\+91[-\s]?)?\b[6-9]\d{9}\b/); // Indian mobile number
    expect(text).not.toMatch(/\b\d+(st|nd|rd|th)\s+Street\b/i); // street line
    expect(text).not.toMatch(/\bNo-\d+,/); // door number
  });

  test("all images load", async ({ page }) => {
    await openSite(page);
    await page.evaluate(async () => {
      for (const img of document.images) img.loading = "eager";
      await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => ((i.onload = r), (i.onerror = r))))));
    });
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.naturalWidth === 0).map((i) => i.src));
    expect(broken).toEqual([]);
  });

  test("no console errors while scrolling the whole page", async ({ page, isMobile }) => {
    const errors = watchErrors(page);
    await openSite(page);
    for (let y = 0; y < 40; y++) {
      // Wheel on desktop (exercises Lenis); native scroll on touch emulation.
      if (isMobile) await page.evaluate(() => scrollBy(0, 900));
      else await page.mouse.wheel(0, 900);
      await page.waitForTimeout(120);
    }
    await expect(page.locator("footer")).toBeInViewport({ timeout: 10_000 });
    expect(errors).toEqual([]);
  });

  test("four project exhibits with repository links", async ({ page }) => {
    await openSite(page);
    for (const id of ["multidoc-rag", "oracle", "recruitai", "dymeter"]) {
      await expect(page.getByTestId(`exhibit-${id}`)).toBeAttached();
    }
    const repos = await page.locator('[data-testid^="exhibit-"] a[href*="github.com/Santhosh-Devlops/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
    expect(repos).toEqual(
      expect.arrayContaining([
        "https://github.com/Santhosh-Devlops/Multi-Modal-RAG-1",
        "https://github.com/Santhosh-Devlops/BI-Forecast-AI",
        "https://github.com/Santhosh-Devlops/Resume-Screener-AI",
        "https://github.com/Santhosh-Devlops/OAD-",
      ]),
    );
  });
});

test.describe("interactions", () => {
  test("skills: category, selection and project link", async ({ page }) => {
    await openSite(page);
    await (await reach(page, "cat-programming")).click();
    await (await reach(page, "skill-java")).click();
    const detail = page.getByTestId("skill-detail");
    await expect(detail.getByRole("heading", { name: "Java" })).toBeVisible();
    await expect(page.getByTestId("skill-java")).toHaveAttribute("aria-pressed", "true");
    await detail.getByRole("button", { name: /DyMETER/ }).click();
    await expect(page.getByTestId("project-detail")).toBeVisible();
    await expect(page.locator("#detail-title")).toHaveText("DyMETER");
  });

  test("project case study opens with every required section and closes with Escape", async ({ page }) => {
    await openSite(page);
    await (await reach(page, "open-oracle")).click();
    const dlg = page.getByTestId("project-detail");
    await expect(dlg).toBeVisible();
    for (const h of ["Problem", "Solution", "Key features", "Technology stack", "Architecture", "My contribution", "Links"]) {
      await expect(dlg.getByRole("heading", { name: h, exact: true })).toBeVisible();
    }
    await expect(dlg.getByRole("link", { name: /GitHub repository/ })).toHaveAttribute("href", "https://github.com/Santhosh-Devlops/BI-Forecast-AI");
    await page.keyboard.press("Escape");
    await expect(dlg).toBeHidden();
  });

  test("resume PDF is served and downloadable", async ({ page, request }) => {
    await openSite(page);
    const dl = page.getByTestId("resume-download");
    await expect(dl).toHaveAttribute("download", "Santhosh_Kumar_K_Resume.pdf");
    const href = await dl.getAttribute("href");
    const res = await request.get(href!);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/pdf");
    await expect(page.getByTestId("resume-open")).toHaveAttribute("target", "_blank");
  });

  test("contact: copy email and validated form", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openSite(page);
    await (await reach(page, "copy-email")).click();
    await expect(page.getByTestId("copy-email")).toContainText("Copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("santhoshkumark7680@gmail.com");

    // "Write to Santhosh" leads into the form, starting at the visitor's own address.
    await page.getByTestId("start-message").click();
    await expect(page.locator("#f-email")).toBeFocused();

    await page.getByTestId("form-submit").click();
    await expect(page.locator("#e-name")).toBeVisible();
    await expect(page.locator("#e-email")).toBeVisible();
    await expect(page.locator("#e-message")).toBeVisible();
    await expect(page.locator("#f-name")).toBeFocused();

    await page.fill("#f-name", "Recruiter");
    await page.fill("#f-email", "not-an-email");
    await page.fill("#f-message", "We would like to talk about an AI internship role.");
    await page.getByTestId("form-submit").click();
    await expect(page.locator("#e-email")).toBeVisible();
    await expect(page.locator("#e-name")).toBeHidden();
    await expect(page.locator("#f-email")).toBeFocused();
  });

  test("contact: opens Gmail for the visitor's address with a draft to Santhosh", async ({ page, isMobile }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __gmail: { url: string; via: string }[]; __skkOpenGmail: (url: string, via: string) => void };
      w.__gmail = [];
      w.__skkOpenGmail = (url, via) => w.__gmail.push({ url, via });
    });
    await openSite(page);
    await reach(page, "form-submit");
    await page.fill("#f-name", "Priya Recruiter");
    await page.fill("#f-email", "priya.recruiter@example.com");
    await page.fill("#f-subject", "AI internship");
    await page.fill("#f-message", "We would like to talk about an AI engineering internship.");
    await page.getByTestId("form-submit").click();
    await expect(page.getByTestId("form-status")).toContainText("priya.recruiter@example.com");

    const calls = await page.evaluate(() => (window as unknown as { __gmail: { url: string; via: string }[] }).__gmail);
    expect(calls).toHaveLength(1);
    const { url, via } = calls[0];

    // The Gmail compose window for the visitor's own account, addressed to Santhosh.
    const checkCompose = (composeUrl: string) => {
      const c = new URL(composeUrl);
      expect(c.origin + c.pathname).toBe("https://mail.google.com/mail/");
      expect(c.searchParams.get("authuser")).toBe("priya.recruiter@example.com");
      expect(c.searchParams.get("view")).toBe("cm");
      expect(c.searchParams.get("to")).toBe("santhoshkumark7680@gmail.com");
      expect(c.searchParams.get("su")).toBe("AI internship");
      expect(c.searchParams.get("body")).toBe("We would like to talk about an AI engineering internship.\n\n— Priya Recruiter");
    };
    // Google's account chooser for that address, continuing to the compose window.
    const checkWeb = (webUrl: string) => {
      const u = new URL(webUrl);
      expect(u.origin + u.pathname).toBe("https://accounts.google.com/AccountChooser");
      expect(u.searchParams.get("Email")).toBe("priya.recruiter@example.com");
      checkCompose(u.searchParams.get("continue")!);
    };

    if (isMobile) {
      // Pixel 7 emulation → Gmail app intent for that account, browser route as fallback.
      expect(via).toBe("app");
      expect(url).toMatch(/^intent:santhoshkumark7680@gmail\.com\?subject=AI%20internship&body=/);
      expect(url).toContain("package=com.google.android.gm");
      expect(url).toContain("S.fromAccountString=priya.recruiter%40example.com;");
      checkWeb(decodeURIComponent(url.split("S.browser_fallback_url=")[1].replace(/;end$/, "")));
    } else {
      expect(via).toBe("web");
      checkWeb(url);
    }
  });

  test("social links point to the right profiles", async ({ page }) => {
    await openSite(page);
    const hrefs = await page.getByTestId("socials").locator("a").evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
    expect(hrefs).toEqual([
      "https://github.com/Santhosh-Devlops",
      "https://www.linkedin.com/in/santhosh-kumar-k-60237a384",
      "https://leetcode.com/u/SanthoshK_2k6",
      "https://www.hackerrank.com/profile/krishya2005_bit1",
    ]);
  });
});

test.describe("accessibility modes", () => {
  test("reduced motion shows a static title card", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto("/?intro=1");
    await expect(page.getByTestId("enter-experience")).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId("skip-intro")).toHaveCount(0);
    await page.getByTestId("enter-experience").click();
    await expect(page.locator("#top h1")).toBeVisible();
    await ctx.close();
  });

  test("no-WebGL fallback renders the SVG sculpture", async ({ page }) => {
    await page.goto("/?intro=0&nowebgl");
    await expect(page.getByTestId("webgl-fallback")).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
  });
});

test.describe("responsive", () => {
  test("no horizontal overflow and navigation works", async ({ page, isMobile }) => {
    await openSite(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    if (isMobile) {
      await page.getByTestId("menu-open").click();
      const menu = page.locator("#mobile-menu");
      await expect(menu).toBeVisible();
      await menu.getByRole("link", { name: /Contact/ }).click();
      await expect(menu).toBeHidden();
      await expect(page.locator("#contact-title")).toBeInViewport({ timeout: 8000 });
    } else {
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /Work/ }).click();
      await expect(page.locator("#work-title")).toBeInViewport({ timeout: 8000 });
    }
  });
});
