export default function CommentSkeleton() {
  return (
    <div className="my-4 flex justify-start items-center">
      <div className="mr-4">
        <div className="w-12 h-12 rounded-full bg-[#EDEDED] animate-pulse"></div>
      </div>
      <div className="w-full">
        <div className="w-16 h-4 my-2 rounded-sm bg-[#EDEDED] animate-pulse"></div>
        <div className="w-64 h-4 my-2 rounded-sm bg-[#EDEDED] animate-pulse"></div>
      </div>
    </div>
  );
}
