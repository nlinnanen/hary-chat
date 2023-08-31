import { createUserId, generateKeys, storeKey } from "@utils/crypto/keys";
import axios from "axios";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { HaryListResponseDataItem } from "src/api/documentation.schemas";
import { getHarys, useGetHarys, usePostHarys } from "src/api/hary/hary";
import { useGetUsers } from "src/api/users-permissions-users-roles/users-permissions-users-roles";

export default function useHary() {
  const userId = parseInt(localStorage.getItem("userId") ?? "");
  const { data: haryData, isLoading } = useGetHarys(undefined, {
    axios: { params: { populate: { user: {
      populate: "picture"
    }}, } },
  });
  const { mutate: mutateHary } = usePostHarys();
  const harys = haryData?.data?.data;

  const createHary = async (user: number) => {
    await createUserId("Hary");
    const { privateKey, publicKey } = await generateKeys();
    await storeKey("hary", privateKey);
    mutateHary(
      {
        data: {
          data: {
            publicKey,
            user,
          },
        },
      },
      {
        onSuccess() {
          window.location.reload();
        },
      }
    );
  };

  const currentHary = useMemo(
    () =>
      harys?.find((hary: any) => hary.attributes?.user?.data?.id == userId),
    [harys, userId]
  );

  const harysMap = useMemo(
    () => 
    new Map(harys?.map((hary: HaryListResponseDataItem) => [hary.id!, hary.attributes!]) ?? [])
  , [harys]);

  return {
    harys,
    harysMap,
    isLoading,
    createHary,
    currentHary,
  };
}
