import { ManagementClient } from "auth0";
import axios from "axios";
import generatePassword from "generate-password";

const {
  AUTH0_TOKEN,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE,
} = process.env;

if (!AUTH0_TOKEN) throw new Error("Auth0 API token is missing");
if (!AUTH0_DOMAIN) throw new Error("Auth0 domain is missing");
if (!AUTH0_CLIENT_ID) throw new Error("Auth0 client ID is missing");
if (!AUTH0_CLIENT_SECRET) throw new Error("Auth0 client secret is missing");
if (!AUTH0_AUDIENCE) throw new Error("Auth0 client audience is missing");

interface Auth0TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let Auth0ManagementClient = new ManagementClient({
  domain: AUTH0_DOMAIN!,
  token: AUTH0_TOKEN!,
});

/**
 * Gets a new token for auth0 - Our tokens expire every 30 days so this refreshes it if the one in .env
 * has expired. Auth0 only allows 1K tokens per month
 * @returns Auth0 access token
 */
const getToken = async (): Promise<Auth0TokenResponse> => {
  const options = {
    method: "POST",
    url: `https://${AUTH0_DOMAIN}/oauth/token`,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      client_id: AUTH0_CLIENT_ID!,
      client_secret: AUTH0_CLIENT_SECRET!,
      audience: AUTH0_AUDIENCE!,
      grant_type: "client_credentials",
    },
  };

  try {
    const response = await axios.request<Auth0TokenResponse>(options);

    if (response.status !== 200) {
      throw new Error("Failed to fetch token");
    }
    return response.data;
  } catch (error: any) {
    throw new Error("Failed to fetch token");
  }
};

/**
 * Retrieves an auth0 management client. Uses a fresh token if renewToken is set
 * @param renewToken whether to renew token or not. Renew only if 401(Unauthorized) from Auth0
 * @param token
 */
const getManagementClient = async (
  renewToken: boolean = false,
  token: string = AUTH0_TOKEN!,
) => {
  if (renewToken) {
    const newToken = await getToken();
    token = newToken.access_token;
  }

  const options = {
    domain: AUTH0_DOMAIN!,
    token: token,
  };

  Auth0ManagementClient = new ManagementClient(options);
};

/**
 * Creates the password reset link
 * @param userId user's auth0 id
 * @returns
 */
export const createUserLink = async (userId: string) => {
  try {
    const response = await Auth0ManagementClient.tickets.changePassword({
      user_id: userId,
      client_id: AUTH0_CLIENT_ID,
    });

    if (response.status !== 201) {
      throw new Error("Failed to create user link");
    }

    return response.data.ticket;
  } catch (error: any) {
    throw new Error("Failed to create user link");
  }
};

/**
 * Creates an Auth0 user
 * @param email user's email
 * @param managementClient instance of Auth0 ManagementClient
 * @returns the created user object
 */
export const createAuthUser = async (
  email: string,
  managementClient: ManagementClient = Auth0ManagementClient,
): Promise<{ [key: string]: any }> => {
  const dummy_password = generatePassword.generate({
    length: 15,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    strict: true,
  });

  try {
    const newUser = await managementClient.users.create({
      email: email,
      connection: "Username-Password-Authentication",
      password: dummy_password,
      email_verified: true,
    });

    return newUser;
  } catch (error: any) {
    console.error("Error occurred while creating user:", error.message);
    if (error.statusCode === 409) {
      console.warn(`User with email ${email} already exists`);
      throw new Error("User already exists");
    } else if (error.statusCode === 401) {
      console.info("Token expired or unauthorized. Refreshing token...");
      await getManagementClient(true);
      return await createAuthUser(email);
    } else {
      throw new Error(`Failed to create new user: ${error.message}`);
    }
  }
};
