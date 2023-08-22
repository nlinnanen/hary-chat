import { useRef, useState } from "react";
import {
  HaryListResponseDataItem
} from "src/api/documentation.schemas";
import MessageInput from "../Message/MessageInput";
import HarySelection from "./HarySelection";
import { useGetConversationPage } from "src/api/conversation-page/conversation-page";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

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
  const {data: pageData } = useGetConversationPage()

  const handleSendMessage = () => {
    createConversation(newMessage, selectedHarys);
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex w-[90vw] md:w-[60vw] h-full items-center flex-col justify-evenly">
        <ReactMarkdown className="max-h-1/3 overflow-auto text-center">{pageData?.data.data?.attributes?.emptyConversationText ?? ""}</ReactMarkdown>
        <HarySelection setSelectedHarys={setSelectedHarys} />
        <div></div>
      </div>
        <MessageInput
          handleSendMessage={handleSendMessage}
          isSendMessageLoading={false}
          value={newMessage}
          setNewMessage={setNewMessage}
          areaRef={areaRef}
          disabled={!selectedHarys.length}
        />
    </div>
  );
};

export default NewConversation;
