import { useAuth } from "./useAuth";

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