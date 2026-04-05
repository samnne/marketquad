import { supabase } from "./authHelper";

export async function signUpUser(
  email: string,
  password: string,
  name: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name,
      },
    },
  });

  return {data, error}
}
