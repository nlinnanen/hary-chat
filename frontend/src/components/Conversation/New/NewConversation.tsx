import { useRef, useState } from "react";
import { HaryListResponseDataItem } from "src/api/documentation.schemas";
import MessageInput from "../Message/MessageInput";
import HarySelection from "./HarySelection";
import { useGetConversationPage } from "src/api/conversation-page/conversation-page";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import PassphraseModal from "../PassphraseModal";

interface Props {
  createConversation: (
    message: string,
    selectedHarys: HaryListResponseDataItem[],
    passphrase: string
  ) => void;
}

const NewConversation = ({ createConversation }: Props) => {
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedHarys, setSelectedHarys] = useState<
    HaryListResponseDataItem[]
  >([]);
  const { data: pageData } = useGetConversationPage();

  const handleSendMessage = () => {
    setModalOpen(true);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const newPassphrase = (e.target as HTMLInputElement).value;
    if (e.key === "Enter" && newPassphrase) {
      createConversation(newMessage, selectedHarys, newPassphrase);
    }
  };

  if (modalOpen) {
    return (
      <PassphraseModal
        handleKeyUp={handleKeyUp}
        message={
          "Store it somewhere safe, the conversation cannot be accessed without it."
        }
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-around">
      <div className="flex h-full w-[90vw] flex-col items-center justify-evenly md:w-[60vw]">
        <ReactMarkdown className="max-h-1/3 overflow-auto text-center">
          {pageData?.data.data?.attributes?.emptyConversationText ?? ""}
        </ReactMarkdown>
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
