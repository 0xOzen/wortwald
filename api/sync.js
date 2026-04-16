const { safeHandle, handleGetSync, handlePutSync } = require("./_lib/wortwald-cloud");

module.exports = async function sync(request, response) {
  await safeHandle(response, async () => {
    if (request.method === "GET") {
      await handleGetSync(request, response);
      return;
    }
    if (request.method === "PUT") {
      await handlePutSync(request, response);
      return;
    }
    response.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Method not allowed." }));
  });
};
