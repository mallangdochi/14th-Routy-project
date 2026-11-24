// Both login and /me return the same profile fields.
export const AUTH_PROFILE_COLUMNS = `
  id, login_id, username, avatar_url, first_name, last_name, full_name,
  birth, phone, agree_terms, agree_privacy, agree_marketing, agree_location,
  invite_notifications, itinerary_notifications, trip_start_notifications,
  default_itinerary_view, agreed_at, created_at
` as const;

type Profile = {
  id: string;
  login_id: string | null;
  username: string | null;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  birth: string | null;
  phone: string | null;
  agree_terms: boolean | null;
  agree_privacy: boolean | null;
  agree_marketing: boolean | null;
  agree_location: boolean | null;
  invite_notifications: boolean | null;
  itinerary_notifications: boolean | null;
  trip_start_notifications: boolean | null;
  default_itinerary_view: string | null;
  agreed_at: string | null;
  created_at: string | null;
};

export function toAuthUser(user: { id: string; email?: string }, profile: Profile) {
  const nickname = typeof profile.username === "string" ? profile.username.trim() : "";
  const avatarUrl = typeof profile.avatar_url === "string" ? profile.avatar_url : null;
  return {
    id: user.id,
    email: user.email,
    loginId: profile.login_id,
    username: nickname || null,
    avatarUrl,
    profileCompleted: nickname.length >= 2 && nickname.length <= 12 && Boolean(avatarUrl),
    firstName: profile.first_name,
    lastName: profile.last_name,
    fullName: typeof profile.full_name === "string" && profile.full_name.trim()
      ? profile.full_name
      : `${profile.last_name ?? ""}${profile.first_name ?? ""}`,
    birth: profile.birth,
    phone: profile.phone,
    agreeTerms: profile.agree_terms,
    agreePrivacy: profile.agree_privacy,
    agreeMarketing: profile.agree_marketing,
    agreeLocation: profile.agree_location,
    settings: {
      inviteNotifications: profile.invite_notifications === true,
      itineraryNotifications: profile.itinerary_notifications === true,
      tripStartNotifications: profile.trip_start_notifications === true,
      locationServiceAllowed: profile.agree_location === true,
      marketingAllowed: profile.agree_marketing === true,
      defaultItineraryView: profile.default_itinerary_view === "map" ? "map" : "schedule",
    },
    agreedAt: profile.agreed_at,
    createdAt: profile.created_at,
  };
}
