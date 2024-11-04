import { createServer } from "./server";
import { log } from "@repo/logger";

const port = process.env.PORT || 3000;
const server = createServer();

server.listen(port, () => {
  log(`api running on ${port}`);
});
