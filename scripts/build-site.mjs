/**
 * Lit content/site.yaml + src/index.hbs → écrit index.html à la racine.
 * Usage : npm run build (ex. sur Netlify après chaque déploiement / commit Decap).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import Handlebars from "handlebars";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const site = yaml.load(fs.readFileSync(path.join(root, "content", "site.yaml"), "utf8"));
const base = String(site.site_url || "").replace(/\/+$/, "");
const ogPath = String(site.og?.image_path || "").replace(/^\/+/, "");
site.canonical = base ? `${base}/` : "/";
site.og_image_full = base && ogPath ? `${base}/${ogPath}` : ogPath || "";

site.jsonLd = JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.schema?.name || "",
    description: site.schema?.description || "",
    url: site.canonical,
    email: site.schema?.email || "",
    sameAs: site.schema?.instagram ? [site.schema.instagram] : [],
    areaServed: { "@type": "Country", name: "France" },
  },
  null,
  2
);

const tplPath = path.join(root, "src", "index.hbs");
if (!fs.existsSync(tplPath)) {
  console.error("Missing", tplPath);
  process.exit(1);
}

const tpl = fs.readFileSync(tplPath, "utf8");
const render = Handlebars.compile(tpl);
const html = render(site);
fs.writeFileSync(path.join(root, "index.html"), html, "utf8");
console.log("Built index.html from content/site.yaml + src/index.hbs");
