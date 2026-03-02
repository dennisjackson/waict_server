export async function onRequestPost(context) {
  const body = await context.request.text();
  try {
    const parsed = JSON.parse(body);
    console.log("WAICT violation:", parsed.message);
  } catch {
    // ignore malformed body
  }
  return new Response(null, { status: 204 });
}
