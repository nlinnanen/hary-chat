import { generateKeys, storeKey } from "@utils/crypto/keys";
import { useGetHarys, usePostHarys } from "../api";

export default function useHary() {
  const { mutate: mutateHary } = usePostHarys();
  const { data: haryData } = useGetHarys();

  const harys = haryData?.data?.data;

  const createHary = async () => {
    const { privateKey, publicKey } = await generateKeys();
    await storeKey(privateKey, "hary");
    await mutateHary({
      data: {
        data: {
          publicKey,
        },
      },
    });
  };

  return {
    harys,
    createHary,
  };
}
