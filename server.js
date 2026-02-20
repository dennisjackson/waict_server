const http = require("http");
const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "public");

const WAICT_HEADERS = {
  "/enforce":   'manifest="/waict-manifest.json", blocked-destinations=(image script), mode=enforce, max-age=0, endpoints=(default)',
  "/report":    'manifest="/waict-manifest-report.json", blocked-destinations=(image script), mode=report, max-age=0, endpoints=(default)',
  "/nav/page1": 'manifest="/waict-manifest-page1.json", blocked-destinations=(image), mode=enforce, max-age=0',
  "/nav/page2": 'manifest="/waict-manifest-page2.json", blocked-destinations=(image), mode=enforce, max-age=0',
};

const ROUTES = {
  "/":          "index.html",
  "/enforce":   "enforce.html",
  "/report":    "report.html",
  "/nav/page1": "nav-page1.html",
  "/nav/page2": "nav-page2.html",
};

function contentType(p) {
  if (p.endsWith(".html")) return "text/html; charset=utf-8";
  if (p.endsWith(".json")) return "application/json; charset=utf-8";
  if (p.endsWith(".js"))   return "text/javascript; charset=utf-8";
  if (p.endsWith(".png"))  return "image/png";
  if (p.endsWith(".webp")) return "image/webp";
  if (p.endsWith(".svg"))  return "image/svg+xml";
  return "application/octet-stream";
}

const reports = [];

const server = http.createServer((req, res) => {
  const urlPath = (req.url || "/").split("?")[0];

  if (urlPath === "/log" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try { console.log("  WAICT violation:", JSON.parse(body).message); } catch {}
      res.writeHead(204);
      res.end();
    });
    return;
  }

  if (urlPath === "/reports" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        const incoming = Array.isArray(parsed) ? parsed : [parsed];
        incoming.forEach(r => console.log("  violation report:", JSON.stringify(r)));
        reports.push(...incoming);
      } catch {}
      res.writeHead(204);
      res.end();
    });
    return;
  }

  if (urlPath === "/reports" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(reports));
  }

  const routedFile = ROUTES[urlPath];
  const filePath = routedFile
    ? path.join(PUBLIC_DIR, routedFile)
    : path.join(PUBLIC_DIR, urlPath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Bad path");
  }

  const headers = { "Content-Type": contentType(filePath) };
  if (routedFile && WAICT_HEADERS[urlPath]) {
    headers["Integrity-Policy-WAICT-v1"] = WAICT_HEADERS[urlPath];
  }
  if (urlPath === "/report") {
    headers["Reporting-Endpoints"] = 'default="http://localhost:8080/reports"';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Not found");
    }
    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(8080, () => {
  console.log("Listening on http://localhost:8080");
});
