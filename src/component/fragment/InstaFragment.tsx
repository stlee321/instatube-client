import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function InstaFragment({ url }: { url: string }) {
  return (
    <Link to={url}>
      <span>
        <FontAwesomeIcon icon={faInstagram} color={"#d62976"} size={"sm"} />
        <span className="ml-2 text-[#3EAEFF]">{url}</span>
      </span>
    </Link>
  );
}
