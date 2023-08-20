import { Conversation, Hary } from "./api/documentation.schemas";

export interface MessageFrontend {
  content: string;
  timestamp: Date;
  sentByMe: boolean;
  sender: number | "user";
}

export interface ConversationFrontend {
  messages: MessageFrontend[];
  myPublicKey: string;
  publicKey: string;
  conversation: Conversation & {
    messages: undefined;
    harys: Array<Hary & { id: number }>;
  };
  conversationDbId: number;
}
