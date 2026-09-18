import { authHeaders, BASE_URL } from "@/constants/constants";
import { safeJson } from "@/lib/listing.lib";

import { supabase } from "@/supabase/supabase";
import { Session, User } from "@supabase/supabase-js";

import {Filter} from "bad-words"


type ImageLoaderProps = {
  src: string,
  width: string,
  quality: string
}

export const cloudinaryLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const transforms = `c_fill,w_${width},q_${quality ?? 75},f_auto`;
  return src.replace("/upload/", `/upload/${transforms}/`);
};

export function cleanUP(
  listingStore: {reset: ()=>void},
  userStore: {reset: ()=>void},
  convoStore: {reset: ()=>void},
) {
  userStore.reset();
  listingStore.reset();
  convoStore.reset();
}

export function matchUVIC(email: string) {
  const testerEmail = process.env.EXPO_PUBLIC_EMAIL_TESTER;
  if (email === testerEmail || email === process.env.EXPO_PUBLIC_EMAIL_TESTER_2) {
    return true;
  }
  return email.includes("@uvic");
}

export async function fetchConvos({ setter }: { setter: Function }) {
  const user = await getUserSupabase();
  if (!user || !user.session) {
    return false;
  } else {
    const temp = await fetch(`${BASE_URL}/api/conversations`, {
      method: "get",
      headers: authHeaders(user.session.access_token),
    }).then((res) => res.json());
    setter(temp.convos);

    return temp;
  }
}

export const fetchListings = async ({ setter }: { setter: Function }) => {
  const user = await getUserSupabase();

  if (!user) {
    const temp = await fetch(`${BASE_URL}/api/listings`).then((res) =>
      res.json(),
    );
    setter(temp?.listings);
    return temp;
  } else {
    const temp = await fetch(`${BASE_URL}/api/listings`, {
      method: "get",
      headers: user.session ? authHeaders(user.session.access_token) : {},
    }).then((res) => res.json());

    setter(temp?.listings);

    return temp;
  }
};

export async function getUserSupabase() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user) {
    return { user: null, error, app_user: null };
  }
  
  const res = await fetch(`${BASE_URL}/api/account`, {
    method: "GET",
    headers: authHeaders(data.session.access_token),
  }).then(res => res.json());
  const session: Session = data.session
  const supa_user: User = session?.user;
  return { user: supa_user, app_user: res?.user, session };
}

export const deleteConvo = async (cid: string, userId: string) => {
  const { session } = await getUserSupabase();
  if (!session) return;
  const response = await fetch(`${BASE_URL}/api/conversations/${cid}`, {
    method: "DELETE",
    headers: authHeaders(session.access_token),
  });

  return safeJson(response);
};
const filter = new Filter();

export function sanitizeText(text: string): { clean: string; flagged: boolean } {
  
  const clean = filter.clean(text)
  return { clean, flagged: clean !== text };
}
