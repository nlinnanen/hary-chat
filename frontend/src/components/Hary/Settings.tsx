import ImportKey from "@components/ExportKey/ImportKey";
import useDownloadJson from "@hooks/useDownloadJson";
import { getPrivateKey } from "@utils/crypto/keys";
import React, { useRef } from "react";
import { IoArrowBack } from "react-icons/io5";
import { PiDownloadSimple, PiUploadSimple } from "react-icons/pi";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

const Settings: React.FC = () => {
  const { data, isLoading } = useQuery(
    ["get-private-key"],
    () => getPrivateKey('hary')
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  useDownloadJson(buttonRef, "harychat-secrets", {
    privateKey: data,
    conversationId: 'hary',
  });

  if (isLoading || !data) return null;

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Link to="/hary" className="btn btn-ghost fixed left-4 top-4 text-2xl">
          <IoArrowBack />
      </Link>
      <h1 className="mb-4 text-2xl font-bold">Avainten hallinnointi</h1>
      <p className="mb-4 text-lg">
        Tästä voit ladata ja tallentaa salausavaimesi. Pidä huoli, että sailytät
        avaimen turvallisessa paikassa!
      </p>
      <p className="mb-4 text-lg">
        Avaimella ja antamallasi salasanalla pystyy purkamaan kaikki
        keskustelusi.
      </p>
      <div className="flex items-center justify-between space-x-4">
        <button className="btn" ref={buttonRef}>
          Export
        </button>
        <ImportKey text="Import" onSuccess={(_) => window.alert("Salausavain ladattu onnistuneesti!")}/>
      </div>
    </div>
  );
};

export default Settings;
