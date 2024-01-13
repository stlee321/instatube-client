import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function YoutubeFragment({ url }: { url: string }) {
  return (
    <Link to={url}>
      <span>
        <FontAwesomeIcon icon={faYoutube} color={"#b2071d"} size={"sm"} />
        <span className="ml-2 text-[#3EAEFF]">{url}</span>
      </span>
    </Link>
  );
}
