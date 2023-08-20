import { useRef, useState } from "react";
import {
  HaryListResponseDataItem
} from "src/api/documentation.schemas";
import MessageInput from "../Message/MessageInput";
import HarySelection from "./HarySelection";

interface Props {
  createConversation: (
    message: string,
    selectedHarys: HaryListResponseDataItem[]
  ) => void;
}

const NewConversation = ({ createConversation }: Props) => {
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedHarys, setSelectedHarys] = useState<
    HaryListResponseDataItem[]
  >([]);

  const handleSendMessage = () => {
    createConversation(newMessage, selectedHarys);
  };

  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full items-center justify-center">
        <HarySelection setSelectedHarys={setSelectedHarys} />
      </div>
      <div className="h-30 fixed bottom-0 z-20 flex w-full items-end space-x-2 bg-gradient-to-t from-base-100 from-60% p-5">
        <MessageInput
          handleSendMessage={handleSendMessage}
          isSendMessageLoading={false}
          value={newMessage}
          setNewMessage={setNewMessage}
          ref={areaRef}
          disabled={!newMessage}
        />
      </div>
    </div>
  );
};

export default NewConversation;
