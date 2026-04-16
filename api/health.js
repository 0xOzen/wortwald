const { safeHandle, handleHealth } = require("./_lib/wortwald-cloud");

module.exports = async function health(request, response) {
  await safeHandle(response, async () => {
    await handleHealth(request, response);
  });
};
