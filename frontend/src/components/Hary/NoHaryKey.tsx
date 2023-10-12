import ImportKey from "@components/ExportKey/ImportKey";
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
          ? "Tämä käyttäjä on jo konfiguroitu toisella laitteella. Vie salausavain tiedostoon ja lataa se tähän."
          : "Tämä käyttäjä ei ole vielä konfiguroitu. Aseta salasana ja luo uusi salausavain"}
      </div>
      {publicKeyExists ? (
        <ImportKey text="Lataa salausavain tiedostosta" onSuccess={(_) => window.location.reload()}/>
      ) : (
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
