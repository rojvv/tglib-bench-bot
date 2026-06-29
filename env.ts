import "@std/dotenv/load";
import { cleanEnv, num, str } from "envalid";

export default cleanEnv(Deno.env.toObject(), {
  API_ID: num(),
  API_HASH: str(),
  BOT_TOKEN: str(),
});
