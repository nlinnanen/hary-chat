import { HaryUser } from "src/api/documentation.schemas";
import { useGetHarysId } from "src/api/hary/hary";
import { useGetUsersId } from "src/api/users-permissions-users-roles/users-permissions-users-roles";

const HaryAvatar = ({ haryId }: { haryId: number }) => {
  const { data, isLoading } = useGetHarysId(haryId, {
    axios: {
      params: { "populate[user][populate][0]": "picture" },
    },
  });

  if (isLoading) return null;

  const url =
    data?.data.data?.attributes?.user?.data?.attributes?.picture?.data
      ?.attributes?.url;

  return (
    <>
      {url ? (
        <img src={import.meta.env.VITE_APP_BASE_URL + url} alt="avatar" />
      ) : (
        <span className="text-lg">
          {(data?.data?.data?.attributes?.user?.data?.attributes
            ?.firstName?.[0] ?? "") +
            (data?.data?.data?.attributes?.user?.data?.attributes
              ?.lastName?.[0] ?? "")}
        </span>
      )}
    </>
  );
};

export default HaryAvatar;
