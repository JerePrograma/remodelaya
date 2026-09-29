import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceUrl =
  process.env.SITES_URL ?? "https://remodelaya.jereprograma.chatgpt.site/";

const outputRoot = path.resolve("reference", "sites-original");
const sourceOrigin = new URL(sourceUrl).origin;

const viewports = [
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "mobile-390", width: 390, height: 844 },
];

const styleProperties = [
  "display",
  "position",
  "width",
  "height",
  "minWidth",
  "maxWidth",
  "minHeight",
  "maxHeight",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "gap",
  "rowGap",
  "columnGap",
  "gridTemplateColumns",
  "gridTemplateRows",
  "alignItems",
  "justifyContent",
  "background",
  "backgroundColor",
  "backgroundImage",
  "backgroundPosition",
  "backgroundSize",
  "color",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "lineHeight",
  "letterSpacing",
  "textTransform",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRadius",
  "boxShadow",
  "opacity",
  "overflow",
  "objectFit",
  "zIndex",
];

function safeAssetPath(urlString) {
  const url = new URL(urlString);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === "/" || pathname.endsWith("/")) {
    pathname += "index";
  }

  pathname = pathname.replace(/^\/+/, "");
  pathname = pathname.replace(/[^a-zA-Z0-9._/\-]/g, "_");

  return path.join(outputRoot, "resources", pathname);
}

async function captureViewport(browser, viewport) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });

  const observedResources = new Set();

  page.on("response", (response) => {
    try {
      const url = new URL(response.url());
      if (url.origin === sourceOrigin) {
        observedResources.add(url.href);
      }
    } catch {
      // Ignore non-URL response identifiers.
    }
  });

  await page.goto(sourceUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
  await page.evaluate(async () => {
    if ("fonts" in document) {
      await document.fonts.ready;
    }
  });

  await page.screenshot({
    path: path.join(outputRoot, `${viewport.name}.png`),
    fullPage: true,
    animations: "disabled",
  });

  const html = await page.content();
  await writeFile(
    path.join(outputRoot, `${viewport.name}.html`),
    html,
    "utf8",
  );

  const audit = await page.evaluate(({ styleProperties }) => {
    const pickStyles = (element) => {
      const computed = getComputedStyle(element);
      return Object.fromEntries(
        styleProperties.map((property) => [property, computed[property] ?? ""]),
      );
    };

    const describe = (element, index = 0) => {
      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();

      return {
        index,
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        className:
          typeof element.className === "string" ? element.className : null,
        text:
          element.textContent
            ?.replace(/\s+/g, " ")
            .trim()
            .slice(0, 500) || null,
        rect: {
          x: rect.x,
          y: rect.y,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        styles: pickStyles(element),
      };
    };

    const selectorAudit = (selector) =>
      Array.from(document.querySelectorAll(selector)).map((element, index) =>
        describe(element, index),
      );

    const styleSheets = Array.from(document.styleSheets).map((sheet) => {
      let cssText = null;
      let cssRulesError = null;

      try {
        cssText = Array.from(sheet.cssRules ?? [])
          .map((rule) => rule.cssText)
          .join("\n");
      } catch (error) {
        cssRulesError =
          error instanceof Error ? error.message : String(error);
      }

      return {
        href: sheet.href,
        disabled: sheet.disabled,
        media: sheet.media?.mediaText ?? "",
        ownerNode:
          sheet.ownerNode instanceof Element
            ? sheet.ownerNode.outerHTML.slice(0, 2000)
            : null,
        cssText,
        cssRulesError,
      };
    });

    const domAssets = Array.from(
      document.querySelectorAll(
        "img[src], source[src], source[srcset], link[href], script[src]",
      ),
    ).map((element) => ({
      tag: element.tagName.toLowerCase(),
      src: element.getAttribute("src"),
      srcset: element.getAttribute("srcset"),
      href: element.getAttribute("href"),
      rel: element.getAttribute("rel"),
      type: element.getAttribute("type"),
    }));

    const resources = performance
      .getEntriesByType("resource")
      .map((entry) => ({
        name: entry.name,
        initiatorType: entry.initiatorType,
        duration: entry.duration,
        transferSize: entry.transferSize,
      }));

    const semanticStructure = Array.from(
      document.querySelectorAll(
        "header, nav, main, section, article, aside, figure, footer",
      ),
    ).map((element, index) => describe(element, index));

    return {
      capturedAt: new Date().toISOString(),
      url: location.href,
      title: document.title,
      viewport: {
        innerWidth,
        innerHeight,
        devicePixelRatio,
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
      },
      bodyClass: document.body.className,
      htmlClass: document.documentElement.className,
      selectors: {
        header: selectorAudit("header"),
        headerContainers: selectorAudit("header > *, header .container, header [class*='container']"),
        nav: selectorAudit("nav"),
        hero: selectorAudit("#inicio, [class*='hero']"),
        heroHeadings: selectorAudit("#inicio h1, [class*='hero'] h1"),
        heroImages: selectorAudit("#inicio img, [class*='hero'] img, #inicio figure"),
        services: selectorAudit("#servicios, #servicios article, [class*='service-card']"),
        about: selectorAudit("#nosotros, [class*='about']"),
        contact: selectorAudit("#contacto, [class*='contact']"),
        footer: selectorAudit("footer, footer > *"),
        buttonsAndLinks: selectorAudit("a, button"),
        headings: selectorAudit("h1, h2, h3"),
      },
      semanticStructure,
      styleSheets,
      domAssets,
      resources,
    };
  }, { styleProperties });

  await writeFile(
    path.join(outputRoot, `${viewport.name}.audit.json`),
    JSON.stringify(audit, null, 2),
    "utf8",
  );

  for (const resource of audit.resources) {
    try {
      const url = new URL(resource.name);
      if (url.origin === sourceOrigin) {
        observedResources.add(url.href);
      }
    } catch {
      // Ignore.
    }
  }

  for (const asset of audit.domAssets) {
    for (const candidate of [asset.src, asset.href]) {
      if (!candidate) continue;

      try {
        const url = new URL(candidate, sourceUrl);
        if (url.origin === sourceOrigin) {
          observedResources.add(url.href);
        }
      } catch {
        // Ignore.
      }
    }
  }

  await page.close();
  return { audit, observedResources };
}

async function downloadResources(resourceUrls) {
  const manifest = [];

  for (const url of [...resourceUrls].sort()) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": "Remodelaya migration capture",
        },
      });

      if (!response.ok) {
        manifest.push({
          url,
          status: response.status,
          saved: false,
        });
        continue;
      }

      const bytes = Buffer.from(await response.arrayBuffer());
      const destination = safeAssetPath(url);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, bytes);

      manifest.push({
        url,
        status: response.status,
        contentType: response.headers.get("content-type"),
        bytes: bytes.length,
        saved: true,
        path: path.relative(process.cwd(), destination),
      });
    } catch (error) {
      manifest.push({
        url,
        saved: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  await writeFile(
    path.join(outputRoot, "resource-manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );

  return manifest;
}

await mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
  const allResources = new Set();
  const summary = [];

  for (const viewport of viewports) {
    console.log(
      `Capturando Site original en ${viewport.width}x${viewport.height}...`,
    );

    const result = await captureViewport(browser, viewport);

    for (const resource of result.observedResources) {
      allResources.add(resource);
    }

    summary.push({
      viewport,
      title: result.audit.title,
      documentHeight: result.audit.viewport.documentHeight,
      styleSheetCount: result.audit.styleSheets.length,
      resourceCount: result.audit.resources.length,
    });
  }

  console.log("Descargando recursos same-origin observados...");
  const manifest = await downloadResources(allResources);

  await writeFile(
    path.join(outputRoot, "capture-summary.json"),
    JSON.stringify(
      {
        sourceUrl,
        sourceOrigin,
        summary,
        downloadedResources: manifest.filter((entry) => entry.saved).length,
        failedResources: manifest.filter((entry) => !entry.saved).length,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log("");
  console.log("Captura terminada.");
  console.log(`Salida: ${outputRoot}`);
  console.log("Archivos principales:");
  console.log("  desktop-1440.png");
  console.log("  desktop-1440.html");
  console.log("  desktop-1440.audit.json");
  console.log("  mobile-390.png");
  console.log("  mobile-390.html");
  console.log("  mobile-390.audit.json");
  console.log("  resource-manifest.json");
  console.log("  resources/");
} finally {
  await browser.close();
}
