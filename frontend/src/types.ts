import { Conversation } from "./api/documentation.schemas";

export interface MessageFrontend {
  content: string;
  timestamp: Date;
  sentByMe: boolean;
}

export interface ConversationFrontend {
  messages: MessageFrontend[];
  myPublicKey: string;
  publicKey: string;
  conversation: any;
  conversationDbId: number;
}