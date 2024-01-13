import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LightButtonLoading() {
  return (
    <div className={"rounded-full px-4 border-2 bg-white border-[#3EAEFF]"}>
      <div className="animate-spin">
        <FontAwesomeIcon icon={faCircleNotch} color={"#3EAEFF"} />
      </div>
    </div>
  );
}
