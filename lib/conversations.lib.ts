import { authHeaders, BASE_URL } from "@/constants/constants";
import { getUserSupabase } from "@/utils/functions";

interface NewConvo {
  listingId: string;
  buyerId: string;
  sellerId: string;
  initialMessage: string; // just pass the text
}

export async function getConvo(cid: string) {
  const { user, session } = await getUserSupabase();

  if (!user || !session) return;
  const response = await fetch(`${BASE_URL}/api/conversations/${cid}`, {
    headers: authHeaders(session.access_token),
    method: "GET",
  }).then((res) => res.json());

  if (!response) return false;
  return response.convo;
}

export async function createConvo(
  { listingId, buyerId, sellerId, initialMessage }: NewConvo,
  existing: Conversation | null,
) {
  const { session } = await getUserSupabase();
  if (!session) return;

  const convo = await fetch(`${BASE_URL}/api/conversations`, {
    headers: authHeaders(session.access_token),
    body: JSON.stringify({
      listingId,
      buyerId,
      sellerId,
      initialMessage,
      existing,
    }),
    method: "POST",
  }).then((res) => res.json());
  
  return convo;
}

export async function getConvos(uid: string) {
  const { session } = await getUserSupabase();
  if (!session) return;
  const convos = await fetch(`${BASE_URL}/api/conversations`, {
    headers: authHeaders(session.access_token),
  }).then((res) => res.json());

  if (!convos) return false;
  return convos.convos;
}
