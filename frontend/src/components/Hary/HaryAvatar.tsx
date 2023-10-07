import useHary from "@hooks/useHary";

const HaryAvatar = ({ haryId }: { haryId: number }) => {
  const { harysMap } = useHary();

  const hary = harysMap.get(haryId);
  const user = hary?.user?.data?.attributes;
  const url = user?.picture?.data?.attributes?.url;

  return (
    <>
      {url ? (
        <img src={import.meta.env.VITE_APP_BASE_URL + url} alt="avatar" />
      ) : (
        <span className="text-lg">
          {(user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")}
        </span>
      )}
    </>
  );
};

export default HaryAvatar;
