import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function LinkFragment({ url }: { url: string }) {
  return (
    <Link to={url}>
      <span>
        <FontAwesomeIcon icon={faLink} />
        <span className="ml-2 text-[#3EAEFF]">{url}</span>
      </span>
    </Link>
  );
}
