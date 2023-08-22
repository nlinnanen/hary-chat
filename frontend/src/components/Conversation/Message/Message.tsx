import HaryAvatar from "@components/Hary/HaryAvatar";
import { FunctionComponent } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Hary } from "src/api/documentation.schemas";
import { MessageFrontend } from "src/types";

interface MessageProps {
  message: MessageFrontend;
  harysMap: Map<number, Hary>;
}

const Message: FunctionComponent<MessageProps> = ({ message, harysMap }) => {
  const senderIsHary = typeof message.sender === "number";
  console.log(message.content);
  return (
    <div
      key={message.timestamp.valueOf()}
      className={`chat ${message.sentByMe ? "chat-end" : "chat-start"}`}
    >
      {senderIsHary && (
        <div className="avatar placeholder chat-image">
          <div className="w-10 rounded-full bg-base-200">
            <HaryAvatar haryId={message.sender as number} />
          </div>
        </div>
      )}
      <div className="chat-header opacity-50">
        {senderIsHary && (
          <>
            {
              harysMap.get(message.sender as number)?.user?.data?.attributes
                ?.firstName
            }{" "}
            {
              harysMap.get(message.sender as number)?.user?.data?.attributes
                ?.lastName
            }
            &nbsp;&nbsp;
          </>
        )}
      </div>
      <div
        className={`chat-bubble break-words ${
          !senderIsHary && "chat-bubble-accent"
        }`}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
      <div className="chat-footer">
        <time className="text-xs opacity-50">
          {message.timestamp.toLocaleTimeString("fi", {
            timeStyle: "short",
          })}
        </time>
      </div>
    </div>
  );
};

export default Message;
