const reports = [];

export async function onRequestPost(context) {
  const body = await context.request.text();
  try {
    const parsed = JSON.parse(body);
    const incoming = Array.isArray(parsed) ? parsed : [parsed];
    incoming.forEach((r) => console.log("violation report:", JSON.stringify(r)));
    reports.push(...incoming);
  } catch {
    // ignore malformed body
  }
  return new Response(null, { status: 204 });
}

export async function onRequestGet() {
  return new Response(JSON.stringify(reports), {
    headers: { "Content-Type": "application/json" },
  });
}
