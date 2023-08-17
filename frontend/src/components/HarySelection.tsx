import useHary from "@hooks/useHary";

const HarySelection = () => {
  const harys = [
    {
      name: "Hary harynen",
      text: "Hary on hyvä häry. Hary on hyvä häry.Hary on hyvä häry.Hary on hyvä häry. Tässä on paljon pitkiä sanoja servinmaijantie aalto-yliopisto tuotantotalous valkohaalarihattusitsit",
    },
    {
      name: "Pekka prodekolainen",
      text: "Pekka on jees",
    },
  ];

  return (
    <div className="md:w-[60vw] w-[90vw] rounded-xl bg-base-200">
      {harys?.map((hary, i) => (
        <>
          <div className="flex items-center py-1 px-2 md:py-4 md:px-6">
            <div className="collapse">
              <input type="checkbox" />
              <div className="collapse-title md:text-xl text-lg font-medium flex items-center p-0">
                <div className="avatar placeholder mr-6">
                  <div className="md:w-16 w-12 rounded-full bg-neutral-focus text-neutral-content">
                    <span className="md:text-3xl text-lg">
                      {hary.name
                        .split(" ")
                        .map((e) => e[0])
                        .join("")}
                    </span>
                  </div>
                </div>
                {hary.name}
              </div>
              <div className="collapse-content p-0">
                <p className="break-words pl-1">{hary.text}</p>
              </div>
            </div>
            <input type="checkbox" className="checkbox mx-2" />
          </div>
          {i === 0 && <div className="divider p-0 m-0 -my-2"></div>}
        </>
      ))}
    </div>
  );
};

export default HarySelection;
