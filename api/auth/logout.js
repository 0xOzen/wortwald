const { safeHandle, handleLogout } = require("../_lib/wortwald-cloud");

module.exports = async function logout(request, response) {
  await safeHandle(response, async () => {
    if (request.method !== "POST") {
      response.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Method not allowed." }));
      return;
    }
    await handleLogout(request, response);
  });
};
