import { storeKey } from "@utils/crypto/keys";
import React, { useRef, useState, ChangeEvent } from "react";

interface JsonData {
  [key: string]: any;
}

const ImportKey: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const { conversationId, privateKey } = JSON.parse(
            event?.target?.result! as string
          ) as JsonData;
          storeKey(conversationId, privateKey);
          window.location.replace(`/conversation/${conversationId}`);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(file);
    } else {
      console.error("Please select a JSON file.");
    }
  };

  return (
    <>
      <button onClick={handleOpenFileInput} className="btn mt-4 align-middle">
        Import conversation
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="application/json"
      />
    </>
  );
};

export default ImportKey;
