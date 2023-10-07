import useDownloadJson from "@hooks/useDownloadJson";
import { getPrivateKey } from "@utils/crypto/keys";
import { useRef } from "react";
import { PiDownloadSimple } from "react-icons/pi";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

function ExportKey() {
  const { conversationId } = useParams();
  const { data, isLoading } = useQuery(
    ["get-private-key", conversationId],
    () => getPrivateKey(conversationId!)
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  useDownloadJson(buttonRef, conversationId!, {
    privateKey: data,
    conversationId,
  });

  if (isLoading || !data) return null;
  return (
    <button ref={buttonRef} className="btn btn-ghost ml-4">
      <PiDownloadSimple className="text-lg" />
    </button>
  );
}

export default ExportKey;
