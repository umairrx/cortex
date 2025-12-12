import { useAuth } from "./useAuth";

/**
 * Custom hook that extracts and formats user data from the authentication context
 * for use in sidebar components and other user-related UI elements.
 *
 * @returns An object containing the user's name, email, and avatar URL,
 * or undefined if no user is authenticated.
 */
export function useUserData() {
  const { user } = useAuth();

  return user
    ? {
        name: user.email.split("@")[0],
        email: user.email,
        avatar: "/avatars/default.jpg",
      }
    : undefined;
}