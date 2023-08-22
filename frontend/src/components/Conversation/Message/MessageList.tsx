import { Hary } from "src/api/documentation.schemas";
import { MessageFrontend } from "src/types";
import Message from "./Message";

interface Props {
  messages: MessageFrontend[] | undefined;
  harysMap: Map<number, Hary>;
}

function MessageList({ messages, harysMap }: Props) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-center">
        <span className="loading loading-lg"></span>
      </div>
    );
  }
  return messages.map((message) => (
    <Message key={message.timestamp.valueOf()} message={message} harysMap={harysMap} />
  ));
}

export default MessageList;