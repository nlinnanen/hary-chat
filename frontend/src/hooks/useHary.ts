import { generateKeys, storeKey } from "@utils/crypto/keys";
import { useGetHarys, usePostHarys } from "src/api/hary/hary";

export default function useHary() {
  const { mutate: mutateHary } = usePostHarys();
  const { data: haryData, isLoading } = useGetHarys({ populate: "*" });

  const harys = haryData?.data?.data;

  const createHary = async (user: number) => {
    const { privateKey, publicKey } = await generateKeys();
    await storeKey("hary", privateKey);
    await mutateHary({
      data: {
        data: {
          publicKey,
          user
        },
      },
    });
  };

  return {
    harys,
    isLoading,
    createHary,
  };
}
