import { faAt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function HandleFragment({ handle }: { handle: string }) {
  return (
    <Link to={"/u/" + handle}>
      <span className="text-[#3EAEFF]">
        <FontAwesomeIcon icon={faAt} />
        {handle}
      </span>
    </Link>
  );
}
