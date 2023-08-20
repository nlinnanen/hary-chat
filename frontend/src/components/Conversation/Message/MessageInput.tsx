import { FunctionComponent } from "react";
import { FiSend } from "react-icons/fi";

interface MessageInputProps {
  handleSendMessage: () => any;
  isSendMessageLoading: boolean;
  value: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  ref: React.RefObject<HTMLTextAreaElement>;
  disabled: boolean;
  placeholder?: string;
}

const MessageInput: FunctionComponent<MessageInputProps> = ({
  handleSendMessage,
  isSendMessageLoading,
  setNewMessage,
  ...props
}) => {

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSendMessage().catch(console.error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.height = `${Math.min(
      e.target.scrollHeight,
      window.outerHeight / 3
    )}px`;

    setNewMessage(e.target.value);
  };

  return (
    <div className="h-18 fixed bottom-0 z-20 flex w-full items-end space-x-2 bg-gradient-to-t from-base-100 from-85% p-5 lg:w-[calc(100vw-20em)]">
      <textarea
        className={`h-min-18 h-18 input input-bordered box-border flex-grow`}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        {...props}
      />
      <button className="btn btn-accent" onClick={handleSendMessage} disabled={props.disabled}>
        {isSendMessageLoading ? (
          <span className="loading loading-lg"></span>
        ) : (
          <FiSend />
        )}
      </button>
    </div>
  );
};

export default MessageInput;
