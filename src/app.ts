import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import createServer from "./utils/server";
import {speedLimiter, limiter} from "./middleware/limit"

const port = config.get<number>("port");

const app = createServer();
app.use(speedLimiter)
app.use(limiter)

app.listen(port, async () => {
  logger.info(`App is running on port:${port}`);

  await connect();
});
