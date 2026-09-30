/**
 * Build first: npm run build && npm run verify:sites
 * Install the browser once: npx playwright install chromium
 * Optional: PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH and SITES_CHECK_OUTPUT.
 * Screenshots are for visual review; this script does not claim pixel identity.
 */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { preview } from "vite";

const output = path.resolve(
  process.env.SITES_CHECK_OUTPUT ?? "reference/sites-current",
);
const tolerance = 1;
const selectors = {
  header: "header",
  headerContainers:
    "header > *, header .container, header [class*='container']",
  nav: "nav",
  hero: "#inicio, [class*='hero']",
  heroHeadings: "#inicio h1, [class*='hero'] h1",
  heroImages: "#inicio img, [class*='hero'] img, #inicio figure",
  services: "#servicios, #servicios article, [class*='service-card']",
  about: "#nosotros, [class*='about']",
  contact: "#contacto, [class*='contact']",
  footer: "footer, footer > *",
  buttonsAndLinks: "a, button",
  headings: "h1, h2, h3",
};
const visualProperties = [
  "display",
  "position",
  "gridTemplateColumns",
  "gap",
  "backgroundColor",
  "color",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "borderRadius",
  "objectFit",
  "overflow",
];
const report = { geometry: [], responsive: [], functional: [], errors: [] };
await mkdir(output, { recursive: true });
let server;
let browser;

function watchErrors(page) {
  page.on("pageerror", (error) => report.errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") report.errors.push(message.text());
  });
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
}

try {
  server = await preview({
    preview: { host: "127.0.0.1", port: 4173, strictPort: true },
  });
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {}),
  });
  const baseUrl = "http://127.0.0.1:4173";

  for (const viewport of [
    { name: "desktop-1440", width: 1440, height: 1000 },
    { name: "mobile-390", width: 390, height: 844 },
  ]) {
    const reference = JSON.parse(
      await readFile(
        path.resolve("reference/sites-original", `${viewport.name}.audit.json`),
        "utf8",
      ),
    );
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    watchErrors(page);
    await page.goto(baseUrl, { waitUntil: "load" });
    await settle(page);
    // Capture the current design, then remove only the approved email additions
    // to compare the unchanged original layout with the canonical Sites audits.
    await page.screenshot({
      path: path.join(output, `${viewport.name}.png`),
      fullPage: true,
      animations: "disabled",
    });
    assert.equal(await page.locator(".contact-email").count(), 2);
    await page.locator(".contact-email").evaluateAll((links) =>
      links.forEach((link) => link.remove()),
    );
    const actual = await page.evaluate(
      ({ selectors, properties }) => ({
        viewport: {
          documentWidth: document.documentElement.scrollWidth,
          documentHeight: document.documentElement.scrollHeight,
        },
        selectors: Object.fromEntries(
          Object.entries(selectors).map(([key, selector]) => [
            key,
            [...document.querySelectorAll(selector)].map((element) => ({
              tag: element.tagName.toLowerCase(),
              rect: element.getBoundingClientRect().toJSON(),
              styles: Object.fromEntries(
                properties.map((property) => [
                  property,
                  getComputedStyle(element)[property],
                ]),
              ),
            })),
          ]),
        ),
      }),
      { selectors, properties: visualProperties },
    );
    const differences = [];
    for (const [group, expectedElements] of Object.entries(
      reference.selectors,
    )) {
      const actualElements = actual.selectors[group];
      if (actualElements.length !== expectedElements.length) {
        differences.push(
          `${group}: element count ${actualElements.length}, expected ${expectedElements.length}`,
        );
      }
      expectedElements.forEach((expected, index) => {
        const element = actualElements[index];
        if (!element) return;
        for (const dimension of ["x", "y", "width", "height"]) {
          if (
            Math.abs(element.rect[dimension] - expected.rect[dimension]) >
            tolerance
          ) {
            differences.push(
              `${group}[${index}].${dimension}: ${element.rect[dimension]} vs ${expected.rect[dimension]}`,
            );
          }
        }
        for (const property of visualProperties) {
          // Track dimensions numerically above; fractional track rounding is browser-specific.
          if (property === "gridTemplateColumns") continue;
          if (element.styles[property] !== expected.styles[property]) {
            differences.push(
              `${group}[${index}].${property}: ${element.styles[property]} vs ${expected.styles[property]}`,
            );
          }
        }
      });
    }
    if (actual.viewport.documentWidth !== viewport.width)
      differences.push("Horizontal document overflow");
    if (
      Math.abs(
        actual.viewport.documentHeight - reference.viewport.documentHeight,
      ) > tolerance
    ) {
      differences.push(
        `Document height: ${actual.viewport.documentHeight} vs ${reference.viewport.documentHeight}`,
      );
    }
    await writeFile(
      path.join(output, `${viewport.name}.audit.json`),
      JSON.stringify(actual, null, 2),
    );
    report.geometry.push({
      viewport: viewport.name,
      comparison: "Original layout with approved email additions removed; screenshot shows current design",
      differences,
    });
    await page.close();
  }

  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  watchErrors(page);
  await page.goto(baseUrl, { waitUntil: "load" });
  await settle(page);
  for (const width of [
    320, 360, 380, 390, 700, 701, 768, 980, 981, 1200, 1440, 1600,
  ]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      columns: getComputedStyle(
        document.querySelector(".service-grid"),
      ).gridTemplateColumns.split(" ").length,
      desktopNav: getComputedStyle(document.querySelector(".desktop-nav"))
        .display,
      headerCta: getComputedStyle(document.querySelector(".header-cta"))
        .display,
      heroColumns: getComputedStyle(
        document.querySelector(".hero-grid"),
      ).gridTemplateColumns.split(" ").length,
      lastCardColumn: getComputedStyle(
        document.querySelector(".service-card:last-child"),
      ).gridColumnStart,
    }));
    assert.equal(layout.documentWidth, width, `Overflow at ${width}px`);
    assert.equal(layout.columns, width <= 700 ? 2 : width <= 980 ? 3 : 5);
    assert.equal(layout.heroColumns, width <= 700 ? 1 : 2);
    assert.equal(layout.desktopNav === "none", width <= 980);
    assert.equal(layout.headerCta === "none", width <= 700);
    assert.equal(
      layout.lastCardColumn,
      width > 700 && width <= 980 ? "span 3" : "auto",
    );
    const emails = await page.locator(".contact-email").evaluateAll((links) =>
      links.map((link) => {
        const address = link.querySelector("small");
        const rect = link.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(address);
        return {
          href: link.getAttribute("href"),
          width: link.clientWidth,
          scrollWidth: link.scrollWidth,
          addressFits: [...range.getClientRects()].every((line) =>
            line.left >= rect.left - 1 && line.right <= rect.right + 1,
          ),
          lineCount: range.getClientRects().length,
        };
      }),
    );
    assert.equal(emails.length, 2);
    for (const email of emails) {
      assert.ok(email.scrollWidth <= email.width + 1, `Email link overflow at ${width}px: ${email.href}`);
      assert.ok(email.addressFits, `Email address clipped at ${width}px: ${email.href}`);
    }
    layout.emails = emails;
    report.responsive.push(layout);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole("button", { name: "Abrir menú" });
  const nav = page.locator("#mobile-nav");
  for (let repeat = 0; repeat < 3; repeat++) {
    await toggle.click();
    assert.equal(await nav.isVisible(), true);
    assert.equal(
      await page.locator(".menu-toggle").getAttribute("aria-expanded"),
      "true",
    );
    await page.keyboard.press("Escape");
    assert.equal(await nav.isVisible(), false);
    assert.equal(
      await page.locator(".menu-toggle").getAttribute("aria-expanded"),
      "false",
    );
    assert.equal(
      await page
        .locator(".menu-toggle")
        .evaluate((button) => button === document.activeElement),
      true,
    );
  }
  await toggle.click();
  await nav.getByRole("link", { name: "Servicios" }).click();
  assert.equal(await nav.isVisible(), false);
  assert.equal(new URL(page.url()).hash, "#servicios");
  await toggle.click();
  await nav.getByRole("link", { name: "Contacto" }).click();
  assert.equal(new URL(page.url()).hash, "#contacto");
  await page.goBack();
  assert.equal(new URL(page.url()).hash, "#servicios");
  await page.goForward();
  assert.equal(new URL(page.url()).hash, "#contacto");
  assert.equal(await nav.isVisible(), false);
  report.functional.push(
    "Repeated menu open/close, Escape/focus, navigation dismissal and Back/Forward",
  );

  await toggle.click();
  await page.setViewportSize({ width: 981, height: 900 });
  await page.waitForFunction(
    () =>
      document.querySelector(".menu-toggle").getAttribute("aria-expanded") ===
      "false",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await nav.isVisible(), false);
  report.functional.push("Menu reset across the 981px desktop breakpoint");

  // A shorter viewport lets the final section reach the observer's active area.
  // At 1000px tall, scroll clamping can legitimately leave Nosotros dominant.
  await page.setViewportSize({ width: 1440, height: 700 });
  for (const id of ["inicio", "servicios", "nosotros", "contacto"]) {
    await page.locator(`.desktop-nav a[href="#${id}"]`).click();
    await page.waitForFunction(
      (section) =>
        document
          .querySelector(`.desktop-nav a[href="#${section}"]`)
          .getAttribute("aria-current") === "location",
      id,
    );
  }
  report.functional.push(
    "Active desktop navigation and aria-current follow sections",
  );

  const links = await page
    .locator(
      ".header-cta, .hero-actions .button, .service-link, .contact-copy > .button, .contact-links > a:nth-child(2)",
    )
    .evaluateAll((elements) =>
      elements.map((a) => ({
        href: a.href,
        rel: a.rel,
        target: a.target,
        service: a.dataset.service,
      })),
    );
  assert.equal(links.length, 14, "All expected WhatsApp calls to action");
  for (const link of links) {
    assert.equal(link.target, "_blank");
    const url = new URL(link.href);
    assert.equal(url.origin, "https://wa.me");
    assert.equal(url.pathname, "/5491127792932");
    assert.ok(link.rel.includes("noopener") && link.rel.includes("noreferrer"));
    if (link.service)
      assert.equal(
        url.searchParams.get("text"),
        `Hola, quisiera pedir un presupuesto para: ${link.service}. Mi zona es: `,
      );
  }
  assert.equal(links.filter((link) => link.service).length, 10);
  assert.equal(
    await page.locator(".contact-links a").first().getAttribute("href"),
    "tel:+5493758550237",
  );
  assert.ok(
    (await page.locator(".contact-links a").first().textContent()).includes(
      "+54 9 3758 55-0237",
    ),
  );
  assert.ok(
    (await page.locator(".contact-links a").nth(1).textContent()).includes(
      "11 2779 2932",
    ),
  );
  assert.equal(
    await page.locator("#year").textContent(),
    String(new Date().getFullYear()),
  );
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  report.functional.push(
    "WhatsApp destinations/encoding, preserved phone correction, dynamic year and reduced motion",
  );
  for (const [label, email] of [
    ["Presupuestos por email", "presupuestos@remodelaya.com.ar"],
    ["Consultas generales", "contacto@remodelaya.com.ar"],
  ]) {
    const link = page.getByRole("link", { name: `${label} ${email}`, exact: true });
    assert.equal(await link.getAttribute("href"), `mailto:${email}`);
    assert.equal(await link.locator("small").textContent(), email);
    await link.focus();
    assert.equal(await link.evaluate((a) => a === document.activeElement), true);
    assert.equal(await link.evaluate((a) => getComputedStyle(a).outlineStyle), "solid");
  }
  report.functional.push("Labeled mailto links, exact public addresses and visible keyboard focus");
  await page.goto(baseUrl, { waitUntil: "load" });
  await page.keyboard.press("Tab");
  assert.equal(
    await page
      .locator(".skip-link")
      .evaluate((link) => link === document.activeElement),
    true,
  );
  await page.keyboard.press("Enter");
  assert.equal(new URL(page.url()).hash, "#contenido");
  report.functional.push("Keyboard skip link");
  await page.close();

  assert.deepEqual(report.errors, [], "Browser console/runtime errors");
  assert.ok(
    report.geometry.every((item) => item.differences.length === 0),
    "Reference geometry/style differences found; inspect report.json and screenshots. Font/browser differences may require the original capture environment.",
  );
  console.log(
    `Visual geometry and interaction checks passed. Review screenshots in ${output}`,
  );
} catch (error) {
  report.failure = String(error);
  throw error;
} finally {
  await writeFile(
    path.join(output, "report.json"),
    JSON.stringify(report, null, 2),
  );
  await browser?.close();
  if (server)
    await new Promise((resolve, reject) =>
      server.httpServer.close((error) => (error ? reject(error) : resolve())),
    );
}
