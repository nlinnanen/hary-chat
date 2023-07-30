interface WithId {
  id: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ConversationInput {
  publicKey?: string;
  messages: Message[];
  harys: Hary[];
}

export interface Conversation extends WithId, ConversationInput {}

export interface MessageInput {
  contentSender: string;
  contentReceiver: string;
}

export interface Message extends WithId, MessageInput {}

export interface MessageFrontend {
  content: string;
  timestamp: Date;
  sentByMe: boolean;
}

export interface Hary {
  id: string;
  publicKey: string;
}