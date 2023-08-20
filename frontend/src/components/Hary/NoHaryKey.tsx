import useHary from "@hooks/useHary";

const NoHaryKey = () => {
  const userId = parseInt(localStorage.getItem("userId")!);
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
        <button
          className="btn btn-neutral m-8"
          onClick={() => createHary(userId)}
        >
          Create Hary
        </button>
      )}
    </div>
  );
};

export default NoHaryKey;
