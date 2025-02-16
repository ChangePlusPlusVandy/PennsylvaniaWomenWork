import { ManagementClient } from "auth0";

const AUTH0_API_TOKEN = process.env.AUTH0_TOKEN || "";
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "";

console.log(
  "key/domain is ",
  AUTH0_API_TOKEN.substring(0, 10),
  " and ",
  AUTH0_DOMAIN,
);

if (!AUTH0_API_TOKEN || !AUTH0_DOMAIN) {
  throw new Error("Auth0 API token or domain is missing");
}

export const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!,
  token: AUTH0_API_TOKEN,
});
