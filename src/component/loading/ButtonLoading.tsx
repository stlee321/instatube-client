import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ButtonLoading() {
  return (
    <div className={"rounded-full px-4 border-2 bg-[#3EAEFF] border-[#3EAEFF]"}>
      <div className="animate-spin">
        <FontAwesomeIcon icon={faCircleNotch} color={"#FFFFFF"} />
      </div>
    </div>
  );
}
