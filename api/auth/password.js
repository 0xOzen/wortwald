const { safeHandle, handleChangePassword } = require("../_lib/wortwald-cloud");

module.exports = async function password(request, response) {
  await safeHandle(response, async () => {
    if (request.method !== "POST") {
      response.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Method not allowed." }));
      return;
    }
    await handleChangePassword(request, response);
  });
};
