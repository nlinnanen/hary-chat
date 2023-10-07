import { generateKeys, storeKey } from "@utils/crypto/keys";
import { useMemo } from "react";
import { HaryListResponseDataItem } from "src/api/documentation.schemas";
import { useGetHarys, usePostHarys } from "src/api/hary/hary";

export default function useHary() {
  const userId = parseInt(localStorage.getItem("userId") ?? "");
  const { data: haryData, isLoading } = useGetHarys(undefined, {
    axios: {
      params: {
        populate: {
          user: {
            populate: "picture",
          },
        },
      },
    },
  });
  const { mutate: mutateHary } = usePostHarys();
  const harys = haryData?.data?.data;

  const createHary = async (user: number, passphrase: string) => {
    const { privateKey, publicKey } = await generateKeys(passphrase);
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
    () => harys?.find((hary: any) => hary.attributes?.user?.data?.id == userId),
    [harys, userId]
  );

  const harysMap = useMemo(
    () =>
      new Map(
        harys?.map((hary: HaryListResponseDataItem) => [
          hary.id!,
          hary.attributes!,
        ]) ?? []
      ),
    [harys]
  );

  return {
    harys,
    harysMap,
    isLoading,
    createHary,
    currentHary,
  };
}
