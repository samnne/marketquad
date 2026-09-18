import { authHeaders, BASE_URL } from "@/constants/constants";
import { getUserSupabase, sanitizeText } from "@/utils/functions";

interface NewMessageProps {
  conversationId: string;
  text: string;
  senderId: string;
}

export async function sendMessage(
  newMessage: NewMessageProps,
  user: ProfileData,
) {
  if (!newMessage.conversationId) throw new Error("conversationId is required");

  if (user) {
    const { session } = await getUserSupabase();
    if (!session) return { error: "User not authenticated", new_message: null };
    // newMessage.text = btoa(newMessage.text)
    const message = await fetch(
      `${BASE_URL}/api/message/${newMessage.conversationId}`,
      {
        method: "POST",
        headers: authHeaders(session.access_token),
        body: JSON.stringify({
          ...newMessage,
        }),
      },
    ).then((res) => res.json());

    if (!message) {
      console.error("Error sending message:");
      return {
        error: "Failed to send message",
        success: false,
        new_message: null,
        message_text: newMessage.text,
      };
    }

    return {
      success: true,
      message: "Message Sent",
      new_message: message.new_message,
    };
  }

  return { error: "User not authenticated", new_message: null };
}

export async function getMessagesForConvo(cid: string) {
  const { user, session } = await getUserSupabase();
  if (!user || !session) return;
  const messages = await fetch(`${BASE_URL}/api/message?cid=${cid}`, {
    headers: authHeaders(session.access_token),
  }).then((res) => res.json());


  if (!messages) {
    return false;
  }

  return messages.messages;
}
