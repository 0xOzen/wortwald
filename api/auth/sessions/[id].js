const {
  safeHandle,
  handleDeleteSession,
  extractTrailingPath,
} = require("../../_lib/wortwald-cloud");

module.exports = async function deleteSession(request, response) {
  await safeHandle(response, async () => {
    if (request.method !== "DELETE") {
      response.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Method not allowed." }));
      return;
    }
    const pathname = extractTrailingPath(request);
    const sessionId = decodeURIComponent(pathname.slice("/api/auth/sessions/".length));
    await handleDeleteSession(request, response, sessionId);
  });
};
