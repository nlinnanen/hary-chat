import { FunctionComponent } from "react";

interface PassphraseModalProps {
  handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const PassphraseModal: FunctionComponent<PassphraseModalProps> = ({
  handleKeyUp
}) => {

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="bg-neutral p-8 rounded-md w-2/5">
        <h1 className="ml-2">Enter passphrase</h1>
        <input
          type="text"
          className="input input-bordered w-full mt-4"
          placeholder="Passphrase"
          onKeyUp={handleKeyUp}
        />
      </div>
    </div>
  );
};

export default PassphraseModal;
