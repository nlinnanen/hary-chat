import { useEffect } from "react";

const useDownloadJson = (
  buttonRef: React.RefObject<HTMLButtonElement>,
  filename: string,
  data: Object
) => {
  useEffect(() => {
    if (!buttonRef.current) {
      return;
    }

    const button = buttonRef.current;
    const handleDownload = () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}.json`);
      document.body.appendChild(link);
      link.click();
      link?.parentNode?.removeChild(link);
    };

    button.addEventListener("click", handleDownload);

    return () => {
      button.removeEventListener("click", handleDownload);
    };
  }, [buttonRef, data]);
};

export default useDownloadJson;
