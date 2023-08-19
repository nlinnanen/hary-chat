import useHary from "@hooks/useHary";
import { useState } from "react";
import { HaryUser } from "src/api/documentation.schemas";

const HarySelection = () => {
  const { harys, isLoading } = useHary();
  const [selectedHarys, setSelectedHarys] = useState<HaryUser[]>([]);

  const handleSelect = (hary: HaryUser) => {
    if (selectedHarys.includes(hary)) {
      setSelectedHarys((prev: HaryUser[]) => prev.filter((e) => e !== hary));
    } else {
      setSelectedHarys((prev: HaryUser[]) => [...prev, hary]);
    }
  }

  const users = harys?.map((hary) => hary.attributes?.user!);

  const getPicUrl = (hary: HaryUser) => hary?.data?.attributes?.picture?.data?.attributes?.url

  if (isLoading)
    return <span className="loading loading-ring loading-lg"></span>;

  return (
    <div className="md:w-[60vw] w-[90vw] rounded-xl bg-base-200">
      {users?.map((hary, i) => (
        <>
          <div className="flex items-center py-1 px-2 md:py-4 md:px-6">
            <div className="collapse">
              <input type="checkbox" />
              <div className="collapse-title md:text-xl text-lg font-medium flex items-center p-0">
                <div className="avatar placeholder mr-6">
                  <div className="md:w-16 w-12 rounded-full bg-neutral-focus text-neutral-content">
                    {
                      getPicUrl(hary) ? <img src={import.meta.env.VITE_APP_BASE_URL + getPicUrl(hary)} alt="avatar" /> :
                    <span className="md:text-3xl text-lg">
                      {(hary.data?.attributes?.firstName?.[0] ?? '') + (hary.data?.attributes?.lastName?.[0] ?? '')}
                    </span>
                    }
                  </div>
                </div>
                {hary.data?.attributes?.firstName} {hary.data?.attributes?.lastName}
              </div>
              <div className="collapse-content p-0">
                <p className="break-words pl-1">{hary.data?.attributes?.description}</p>
              </div>
            </div>
            <input type="checkbox" className="checkbox mx-2" onChange={() => handleSelect(hary)}/>
          </div>
          {i < users.length - 1 && <div className="divider p-0 m-0 -my-2"></div>}
        </>
      ))}
    </div>
  );
};

export default HarySelection;
