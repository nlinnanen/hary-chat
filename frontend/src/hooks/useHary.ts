import { createUserId, generateKeys, storeKey } from "@utils/crypto/keys";
import axios from "axios";
import { useQuery } from "react-query";
import { getHarys, useGetHarys, usePostHarys } from "src/api/hary/hary";
import { useGetUsers } from "src/api/users-permissions-users-roles/users-permissions-users-roles";


export default function useHary() {
  const userId = parseInt(localStorage.getItem("userId") ?? "");
  const {data} = useGetUsers({axios: {params: {"populate[0]": "picture"}}})
  const { data: haryData, isLoading } = useGetHarys(undefined, {axios: {params: {"populate[user][populate][0]": "picture"}}});
  const { mutate: mutateHary } = usePostHarys();
  const harys = haryData?.data?.data;

  const createHary = async (user: number) => {
    await createUserId("Hary");
    const { privateKey, publicKey } = await generateKeys();
    await storeKey("hary", privateKey);
    mutateHary({
      data: {
        data: {
          publicKey,
          user,
        },
      },
    });
  };

  const currentHary = harys?.find(
    (hary: any) => hary.attributes?.user?.data?.id === userId
  )?.attributes;

  return {
    harys,
    isLoading,
    createHary,
    currentHary,
  };
}
