import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.staging") });

const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;

try {
  if (!auth0Domain || !auth0Audience) {
    throw new Error("AUTH0_DOMAIN or AUTH0_AUDIENCE is not set");
  }
} catch (error) {
  console.error(error);
}

export const validateAccessToken = auth({
  issuerBaseURL: `https://${auth0Domain}`,
  audience: auth0Audience,
});
