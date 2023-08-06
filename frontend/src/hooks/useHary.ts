import { createUserId, generateKeys, getUserId, storeKey } from "@utils/crypto/keys";
import { useGetHarys, usePostHarys } from "src/api/hary/hary";

export default function useHary() {
  const userId = parseInt(localStorage.getItem("userId") ?? '');
  const { mutate: mutateHary } = usePostHarys();
  const { data: haryData, isLoading } = useGetHarys({ populate: "*" });

  const harys = haryData?.data?.data;

  const createHary = async (user: number) => {
    await createUserId( "Hary")
    const { privateKey, publicKey } = await generateKeys();
    await storeKey("hary", privateKey);
    mutateHary({
      data: {
        data: {
          publicKey,
          user
        },
      },
    });
  };

  const currentHary = harys?.find(
    (hary) => hary.attributes?.user?.data?.id === userId
  )?.attributes;
  
  return {
    harys,
    isLoading,
    createHary,
    currentHary
  };
}
