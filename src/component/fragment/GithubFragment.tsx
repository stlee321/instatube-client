import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function GithubFragment({ url }: { url: string }) {
  return (
    <Link to={url}>
      <span>
        <FontAwesomeIcon icon={faGithub} size={"sm"} />
        <span className="ml-2 text-[#3EAEFF]">{url}</span>
      </span>
    </Link>
  );
}
