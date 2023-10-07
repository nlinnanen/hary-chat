import { FunctionComponent } from "react";
import { PiWarning } from "react-icons/pi";

interface WarningProps {
  text: string;
}

const Warning: FunctionComponent<WarningProps> = ({ text }) => {
  return (
    <div className="alert alert-warning w-full text-center">
      <PiWarning className="inline-block mr-2" />
      <span>
        {text}
      </span>
    </div>
  );
};

export default Warning;
