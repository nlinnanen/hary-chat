import useHary from "@hooks/useHary";
import { useState } from "react";

const NoHaryKey = () => {
  const userId = parseInt(localStorage.getItem("userId")!);
  const [passphrase, setPassphrase] = useState<string>("");
  const { createHary, currentHary } = useHary();

  const publicKeyExists = currentHary?.attributes?.publicKey !== undefined;

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <div className="m-8 w-1/3">
        {publicKeyExists
          ? "This account already has been configured on another device. Please use that device to send messages from this account."
          : "This account has not been configured yet. Please create a new key pairs to encrypt and decrypt messages"}
      </div>
      {publicKeyExists ? null : (
        <>
          <input
            type="text"
            className="input input-bordered mt-4 w-2/3"
            placeholder="Passphrase"
            onKeyUp={(e) => setPassphrase((e.target as HTMLInputElement).value)}
          />
          <button
            className="btn btn-neutral m-8"
            onClick={() => createHary(userId, passphrase)}
          >
            Create Hary
          </button>
        </>
      )}
    </div>
  );
};

export default NoHaryKey;
