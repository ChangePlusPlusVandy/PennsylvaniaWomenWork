import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const useCurrentUser = (username: string) => {
  const [user, setUser] = useState<{
    _id: string;
    username: string;
    role: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/user/current-user?username=${encodeURIComponent(username)}`,
        );
        setUser(response.data); // store full user object including _id (for backend retrieval)
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError("Failed to fetch user information");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  return { user, error, loading };
};
