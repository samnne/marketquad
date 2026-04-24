import { BASE_URL } from "@/constants/constants";
import { safeJson } from "@/lib/listing.lib";
import { ListingStore, UserState } from "@/store/zustand";
import { supabase } from "@/supabase/authHelper";
import * as Sentry from "@sentry/react-native";
import {Filter} from "bad-words"

export function reportError(
  error: Error | string,
  context?: Record<string, any>,
) {
  const errorToReport = typeof error === "string" ? new Error(error) : error;

  Sentry.captureException(errorToReport, {
    extra: context || {},
  });
}

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
  if (email === testerEmail) {
    return true;
  }
  return email.includes("@uvic");
}

export async function fetchConvos({ setter }: { setter: Function }) {
  const user = await getUserSupabase();
  if (!user) {
    return false;
  } else {
    const temp = await fetch(`${BASE_URL}/api/conversations`, {
      method: "get",
      headers: { Authorization: user.user?.id! },
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
      headers: { Authorization: user.user?.id ? user.user.id : "" },
    }).then((res) => res.json());

    setter(temp?.listings);

    return temp;
  }
};

export async function getUserSupabase() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return { user: null, error, app_user: null };
  }
  const res = await fetch(`${BASE_URL}/api/account`, {
    method: "GET",
    headers: { Authorization: data.user.id },
  }).then(res => res.json());
  const supa_user = data.user;
  return { user: supa_user, app_user: res?.user };
}

export const deleteConvo = async (cid: string, userId: string) => {
  const response = await fetch(`${BASE_URL}/api/conversations/${cid}`, {
    method: "DELETE",
    headers: {
      Authorization: userId,
    },
  });

  return safeJson(response);
};
const filter = new Filter();

export function sanitizeText(text: string): { clean: string; flagged: boolean } {
  
  const clean = filter.clean(text)
  return { clean, flagged: clean === text };
}