import { useState } from "react";
import { HaryListResponseDataItem, HaryUser } from "src/api/documentation.schemas";
import HarySelection from "./HarySelection";
import { FiSend } from "react-icons/fi";

interface Props {
  createConversation: (message: string, selectedHarys: HaryListResponseDataItem[]) => void;
}

const NewConversation = ({ createConversation }: Props) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedHarys, setSelectedHarys] = useState<HaryListResponseDataItem[]>([]);

  const handleSendMessage = () => {
    console.log(selectedHarys)
    createConversation(newMessage, selectedHarys);
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full items-center justify-center">
        <HarySelection setSelectedHarys={setSelectedHarys} />
      </div>
      <div className="h-30 fixed bottom-0 z-20 flex w-full items-end space-x-2 bg-gradient-to-t from-base-100 from-60% p-5">
        <input
          type="text"
          className="input input-bordered flex-grow"
          placeholder={
            !selectedHarys.length
              ? "Select harys to start messaging"
              : "Type a message..."
          }
          disabled={!selectedHarys.length}
          onKeyUp={handleKeyUp}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn btn-accent" onClick={handleSendMessage} disabled={!selectedHarys.length}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default NewConversation;
