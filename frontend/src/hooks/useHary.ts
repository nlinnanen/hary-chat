import { useGetHarys, usePostHarys } from "../api";
import { generateAndStoreHaryKeys } from "../utils/crypto/keys";

export default function useHary() {
  const { mutate: mutateHary } = usePostHarys()
  const { data: haryData } = useGetHarys();

  const harys = haryData?.data?.data;

  const createHary = async () => {
    const publicKey = await generateAndStoreHaryKeys();
    await mutateHary({
      data: {
        data: {
          publicKey
        }
      }
    });
  }


  return {
    harys,
    createHary
  }
}