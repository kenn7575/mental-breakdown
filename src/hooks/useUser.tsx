import { useState, useEffect, useCallback } from "react";
import { getTokenPayload } from "@/app/actions/getTokenPayload"; // Adjust the import path as necessary
import { User } from "@/lib/types";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const tokenPayload = await getTokenPayload();
      if (!tokenPayload) {
        setUser(null);
        return;
      }
      setUser({
        id: tokenPayload.id,
        firstname: tokenPayload.firstname,
        lastname: tokenPayload.lastname,
        email: tokenPayload.email,
        email_notifications: tokenPayload.email_notifications,
        email_verified: tokenPayload.email_verified,
        color_theme: tokenPayload.color_theme,
        xp: tokenPayload.xp,
        username: tokenPayload.username,
        last_active: tokenPayload.last_active,
        bio: tokenPayload.bio,
        profile_picture: tokenPayload.profile_picture,
        type: "node",
        joined_date: tokenPayload.joined_date,
        password: tokenPayload.password,
      });
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(() => {
    // Implement your logout logic here, e.g., clear tokens, redirect to login, etc.
    setUser(null);
  }, []);

  return { user, loading, logout, checkUser };
};
