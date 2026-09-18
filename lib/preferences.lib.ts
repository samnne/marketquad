import { authHeaders, BASE_URL } from "@/constants/constants";
import { getUserSupabase } from "@/utils/functions";

export type PreferencesPayload = {
  defaultCategory?: string | null;
  defaultCondition?: string | null;
  defaultLocation?: string | null;
  defaultLat?: number | null;
  defaultLng?: number | null;
};

export async function getPreferences(userId: string) {
  try {
    const { session } = await getUserSupabase();
    if (!session) return { success: false, preferences: null };
    const preferences = await fetch(`${BASE_URL}/api/account/prefs`, {
      headers: authHeaders(session.access_token),
    }).then(
      (res) => res.json(),
    );
    return { success: true, preferences: preferences.preferences };
  } catch (err) {
    console.error("Error fetching preferences:", err);
    return { success: false, preferences: null };
  }
}

export async function upsertPreferences(
  userId: string,
  data: PreferencesPayload,
) {
  try {
    const preferences = await fetch(`${BASE_URL}/api/account/prefs`, {
        method: "put"
    }).then(
      (res) => res.json(),
    );
    return { success: true, preferences };
  } catch (err) {
    console.error("Error upserting preferences:", err);
    return { success: false, preferences: null };
  }
}
