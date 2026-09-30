import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
// Original Sites source revision 71d2c58bcb9f6105c39c77f8fdf3236962257c83.
// These baselines intentionally catch accidental design or behavior changes.
const sourceHashes = {
  "index.html": "c7e1b8aba9a42d8775b25914419a6f1919e87ca483091d7b1e0c7856b5e433be",
  "styles.css": "288f18ff4fd2fa325a1560fd43dd0ecba9c3e47a0b51c9bdd75f97a742832d54",
  "app.js": "8c8dcc29852487f2f4b8dda654e2a90a5815ffe245771678db88616a99f21919",
  "assets/brand-mark.png": "53733d9a48f7163608675c438c3278363cdf41cf18eefa341dfe720ef1a0545c",
  "assets/interior-hero.webp": "ccb75e05199cc59b29c2a787eb8b215c8b5b1cfabb62abd2b1a1cda0027bcc60",
};
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const html = await readFile(path.join(root, "site/index.html"), "utf8");
let canonicalHtml = html;
const emailContacts = [
  ["Presupuestos por email", "presupuestos@remodelaya.com.ar"],
  ["Consultas generales", "contacto@remodelaya.com.ar"],
];
const mailIcon = '    <symbol id="mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol>\n';
const emailStyles = '\n/* Email contact links keep long addresses within narrow screens. */\n.contact-details{min-width:0}.contact-links>a.contact-email>span{min-width:0;font-size:16px}.contact-links>a.contact-email small{font-size:13px;overflow-wrap:anywhere}\n';
const authorizedAdditions = [mailIcon, ...emailContacts.map(([label, email]) =>
  `<a class="contact-email" href="mailto:${email}"><svg class="icon" aria-hidden="true"><use href="#mail"/></svg><span>${label}<small>${email}</small></span><svg class="icon" aria-hidden="true"><use href="#arrow"/></svg></a>`,
)];
for (const addition of authorizedAdditions) {
  assert.equal(canonicalHtml.split(addition).length - 1, 1, "Expected one approved email contact addition");
  canonicalHtml = canonicalHtml.replace(addition, "");
}
assert.equal((html.match(/href="mailto:/g) ?? []).length, 2, "Only the two public contact emails should be shown");
const authorizedSubstitutions = [
  ['href="tel:+5493758550237"', 'href="tel:+541127792932"'],
  ['<span>+54 9 3758 55-0237<small>Llamar</small></span>', '<span>11 2779 2932<small>Llamar</small></span>'],
  ['https://wa.me/5491127792932?text=Hola%2C%20quisiera%20consultar%20por%20un%20presupuesto%20de%20Remodelaya.', 'https://wa.me/5493758550237?text=Hola%2C%20quisiera%20consultar%20por%20un%20presupuesto%20de%20Remodelaya.'],
  ['<span>11 2779 2932<small>WhatsApp alternativo</small></span>', '<span>+54 9 3758 55-0237<small>WhatsApp alternativo</small></span>'],
];
for (const [current, original] of authorizedSubstitutions) {
  assert.equal(canonicalHtml.split(current).length - 1, 1, `Expected one contact value: ${current}`);
  canonicalHtml = canonicalHtml.replace(current, original);
}
const seoLines = [
  '  <meta property="og:title" content="Remodelaya · Construcción integral y refacciones">\n',
  '  <meta property="og:description" content="Remodelaya. Construcción integral y refacciones en CABA y Gran Buenos Aires. Albañilería, plomería, electricidad y más. Pedí tu presupuesto sin cargo.">\n',
  '  <meta property="og:type" content="website">\n',
  '  <meta property="og:locale" content="es_AR">\n',
  '  <link rel="canonical" href="https://remodelaya.com.ar/">\n',
];
for (const line of seoLines) {
  assert.equal(canonicalHtml.split(line).length - 1, 1, `Expected preserved SEO metadata: ${line.trim()}`);
  canonicalHtml = canonicalHtml.replace(line, "");
}
assert.equal(sha256(canonicalHtml), sourceHashes["index.html"], "HTML differs beyond approved contact/SEO substitutions");

for (const [file, expectedHash] of Object.entries(sourceHashes)) {
  const source = await readFile(path.join(root, "site", file));
  if (file === "styles.css") {
    const styles = source.toString("utf8");
    assert.equal(styles.split(emailStyles).length - 1, 1, "Expected approved responsive email styles");
    assert.equal(sha256(styles.replace(emailStyles, "")), expectedHash, "CSS changed beyond approved email styles");
  } else if (file !== "index.html") {
    assert.equal(sha256(source), expectedHash, `Original source changed: ${file}`);
  }
  const built = await readFile(path.join(root, "dist", file));
  assert.deepEqual(built, source, `Build transformed ${file}`);
}

async function filesIn(directory, prefix = "") {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await filesIn(path.join(directory, entry.name), relative));
    else result.push(relative);
  }
  return result.sort();
}
assert.deepEqual(await filesIn(path.join(root, "site")), Object.keys(sourceHashes).sort());
assert.deepEqual(await filesIn(path.join(root, "dist")), Object.keys(sourceHashes).sort());
for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
  assert.ok(Object.hasOwn(sourceHashes, match[1].slice(1)), `Unknown local asset: ${match[1]}`);
}
assert.equal((html.match(/class="service-card"/g) ?? []).length, 10);
assert.ok(!html.includes("__CF$cv$params") && !html.includes("/cdn-cgi/"), "Captured hosting injection must not ship");
console.log("PASS: original HTML/CSS (approved contact, email and SEO changes only), JS, both images, asset paths, 10 services and byte-identical static build.");
