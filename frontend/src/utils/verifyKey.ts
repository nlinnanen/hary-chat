import { signText } from "@utils/crypto/messages";
import axios from "axios";

export async function verifyKey(
  conversationId: string,
  dataBaseKey: string,
  deviceId: string
) {
  if (axios.defaults.headers.common["X-Conversation-Uuid"] !== conversationId) {
    const {
      data: { challenge },
    } = await axios.get(`/verify`, { withCredentials: true });
    const signedChallenge = await signText(challenge, dataBaseKey, deviceId);
    const {
      data: { token },
    } = await axios.post(
      `/verify`,
      { signedChallenge, uuid: conversationId },
      { withCredentials: true }
    );
    axios.defaults.headers.common["X-Conversation-Token"] = token;
    axios.defaults.headers.common["X-Conversation-Uuid"] = conversationId;
  }
}
