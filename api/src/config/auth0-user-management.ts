import { ManagementClient } from "auth0";
import dotenv from "dotenv";

dotenv.config();
const { AUTH0_API_TOKEN, AUTH0_DOMAIN } = process.env;

// Only check for Auth0 credentials if not in test environment
if (process.env.NODE_ENV !== "test" && (!AUTH0_API_TOKEN || !AUTH0_DOMAIN)) {
  throw new Error("Auth0 API token or domain is missing");
}

export const management = new ManagementClient({
  token: AUTH0_API_TOKEN || "test-token", // Provide dummy token for tests
  domain: AUTH0_DOMAIN || "test.auth0.com", // Provide dummy domain for tests
});
