import { authHeaders, BASE_URL } from "@/constants/constants";
import { getUserSupabase } from "@/utils/functions";
import { sendListingLikeNotification } from "@/utils/notifications";
import { useState } from "react";

export function useLike(
  listing: Listing | null | undefined,
  initialLiked: boolean | undefined | object,
  initialCount: number,
) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!listing) {
      return
    }
    if (loading) return;
    // optimistic update
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    setLoading(true);

    try {
      const { user, session } = await getUserSupabase();
      if (!user || !session) throw new Error("User is not authenticated");
      const res = await fetch(`${BASE_URL}/api/listings/${listing.lid}/like`, {
        method: "POST",
        headers: authHeaders(session.access_token),
      });
      const data = await res.json();
      if (data.liked === true){

        sendListingLikeNotification(listing, count);
        
      } 
      // reconcile with server truth
      setLiked(data.liked);
    } catch {
      // rollback on failure
      setLiked((prev) => !prev);
      setCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  };

  return { liked, count, toggle, loading };
}
