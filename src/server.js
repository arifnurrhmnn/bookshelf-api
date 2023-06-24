const hapi = require("@hapi/hapi");
const routes = require("./books/routes");

const config = {
  port: 9000,
  host: "localhost",
};

const init = async (config) => {
  const server = hapi.server({
    port: config.port,
    host: config.host,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server run at ${server.info.uri}\n`);
};

init(config);
