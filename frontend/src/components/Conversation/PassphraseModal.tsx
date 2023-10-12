import { FunctionComponent, useEffect, useRef } from "react";
import { IoLockClosed, IoLockOpen, IoSend } from "react-icons/io5";
import Message from "./Message/Message";
import Warning from "@components/Warning";

interface PassphraseModalProps {
  handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  message?: string;
}

const PassphraseModal: FunctionComponent<PassphraseModalProps> = ({
  handleKeyUp,
  message,
  errorMessage,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-2/5 rounded-md bg-neutral p-8">
        <h1 className="ml-2 text-xl">Syötä salauslause</h1>
        {message && <p className="ml-2 mt-2">{message}</p>}
        <div className="mt-4 flex w-full items-center ">
          <input
            className="input input-bordered w-full"
            placeholder="Salauslause"
            onKeyUp={handleKeyUp}
            ref={ref}
          />
          <button className="btn btn-neutral">
            <IoLockOpen />
          </button>
        </div>
      </div>
      {errorMessage && (
        <div className="toast">
          <Warning text={errorMessage} />
        </div>
      )}
    </div>
  );
};

export default PassphraseModal;
