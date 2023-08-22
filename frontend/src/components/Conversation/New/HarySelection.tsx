import HaryAvatar from "@components/Hary/HaryAvatar";
import useHary from "@hooks/useHary";
import { Dispatch, SetStateAction, useState } from "react";
import {
  HaryListResponseDataItem,
  HaryUser,
} from "src/api/documentation.schemas";

interface Props {
  setSelectedHarys: Dispatch<SetStateAction<HaryListResponseDataItem[]>>;
}

const HarySelection = ({ setSelectedHarys }: Props) => {
  const { harys, isLoading } = useHary();

  const handleSelect = (hary: HaryListResponseDataItem) => {
    setSelectedHarys((prev: HaryListResponseDataItem[]) => {
      if (prev.includes(hary)) {
        return prev.filter((e) => e !== hary);
      } else {
        return [...prev, hary];
      }
    });
  };

  if (isLoading)
    return <span className="loading loading-ring loading-lg"></span>;

  return (
    <div className="w-full rounded-xl bg-base-200">
      {harys?.map((hary, i) => {
        const haryUser = hary.attributes?.user!;
        return (
          <div key={hary.id}>
            <div className="flex items-center px-2 py-1 md:px-6 md:py-4">
              <div className="collapse collapse-arrow">
                <input type="checkbox" />
                <div className="collapse-title flex items-center p-0 text-lg font-medium break-words pr-8">
                  <div className="avatar placeholder mr-4">
                    <div className="w-12 rounded-full bg-neutral-focus text-neutral-content md:w-16">
                      <HaryAvatar haryId={hary.id!} />
                    </div>
                  </div>
                  {haryUser.data?.attributes?.firstName}{" "}
                  {haryUser.data?.attributes?.lastName}
                </div>
                <div className="collapse-content p-0">
                  <p className="break-words pl-1">
                    {haryUser.data?.attributes?.description}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                className="checkbox mx-2"
                onChange={() => handleSelect(hary)}
              />
            </div>
            {i < harys.length - 1 && (
              <div className="divider m-0 -my-2 p-0"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HarySelection;
