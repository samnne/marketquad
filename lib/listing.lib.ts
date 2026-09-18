import { authHeaders, BASE_URL } from "@/constants/constants";
import { getUserSupabase } from "@/utils/functions";

export const safeJson = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  if (!text || text.trim() === "") return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Failed to parse JSON response: "${text.slice(0, 100)}"`);
  }
};

export const getClientListings = async () => {
  const response = await fetch(`${BASE_URL}/api/listings`, {});

  return safeJson(response);
};
export const getUserListings = async (uid: string) => {
  const { session } = await getUserSupabase();
  if (!session) return;
 
  const response = await fetch(`${BASE_URL}/api/account`, {
    method: "POST",
    headers: authHeaders(session.access_token),
  });

  return safeJson(response);
};
export const getClientListingsWithCategory = async (cat: string) => {
  const response = await fetch(
    `${BASE_URL}/api/listings/search?cat=${cat}`,
    {},
  );

  return safeJson(response);
};
export const getClientListingsNotUsers = async (uid: string) => {
  const { session } = await getUserSupabase();
  if (!session) return;
  const response = await fetch(`${BASE_URL}/api/listings`, {
    headers: authHeaders(session.access_token),
    method: "GET",
  });

  return safeJson(response);
};
export const newListingAction = async (
  newListing: listingFormData,
  sellerId: string,
) => {
  if (!sellerId) throw new Error("No seller ID provided");
  const { session } = await getUserSupabase();
  if (!session) throw new Error("User is not authenticated");

  const response = await fetch(`${BASE_URL}/api/listings`, {
    method: "POST",
    headers: authHeaders(session.access_token),
    body: JSON.stringify({ ...newListing, sellerId }),
  });

  return safeJson(response);
};
export const editListingAction = async (
  listingToEdit: listingFormData & {lid: string},
  sellerId: string,
) => {
  const { session } = await getUserSupabase();
  if (!session) throw new Error("User is not authenticated");
  const response = await fetch(
    `${BASE_URL}/api/listings/${listingToEdit?.lid}`,
    {
      headers: authHeaders(session.access_token),
      method: "PUT",
      body: JSON.stringify({ ...listingToEdit, sellerId }),
    },
  );

  return safeJson(response);
};

export const deleteListingAction = async (lid: string, sellerId: string) => {
  if (!sellerId) return;
  const { session } = await getUserSupabase();
  if (!session) return;
  const response = await fetch(`${BASE_URL}/api/listings/${lid}`, {
    headers: authHeaders(session.access_token),
    method: "DELETE",
  });

  return safeJson(response);
};
