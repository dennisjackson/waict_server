export async function onRequest(context) {
  const html = await context.env.ASSETS.fetch(new URL("/nav-page2.html", context.request.url));
  const response = new Response(html.body, html);
  response.headers.set(
    "Integrity-Policy-WAICT-v1",
    'manifest="/waict-manifest-page2.json", blocked-destinations=(image), mode=enforce, max-age=0'
  );
  return response;
}
