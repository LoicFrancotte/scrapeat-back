import path, { join } from "path";
import url from "url";
import dotenv from "dotenv";

const configureDotenv = () => {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: join(__dirname, "../../.env") });
  } else {
    dotenv.config({ path: join(__dirname, "../../.env.development") });
  }

  console.log(process.env.ENV, "env");
};

export default configureDotenv;
