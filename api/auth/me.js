const { safeHandle, handleMe } = require("../_lib/wortwald-cloud");

module.exports = async function me(request, response) {
  await safeHandle(response, async () => {
    if (request.method !== "GET") {
      response.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Method not allowed." }));
      return;
    }
    await handleMe(request, response);
  });
};
