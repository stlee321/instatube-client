import { Link } from "react-router-dom";
import { usePostImage } from "../../hook/useImage";
import { usePost } from "../../hook/usePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { usePostLike } from "../../hook/useLike";
import { useCommentCount } from "../../hook/useComment";

export default function Thumbnail({ postId }: { postId: string }) {
  const { data: post } = usePost(postId, !!postId);
  const { data: imageUrl } = usePostImage(post?.imageId || "", !!post);
  const { data: like } = usePostLike(postId);
  const { data: count } = useCommentCount(postId);
  return (
    <Link to={"/p/" + postId}>
      <div className="relative aspect-square bg-[#EDEDED]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full absolute top-0 left-0 object-cover"
          />
        ) : null}
        <div className="z-10 w-full h-full absolute top-0 left-0 bg-transparent hover:bg-slate-600/30 text-transparent hover:text-white flex justify-center items-center">
          <div className="mr-4">
            <FontAwesomeIcon icon={faHeart} />
            <span className="ml-2">{like || 0}</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faComment} />
            <span className="ml-2">{count || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
