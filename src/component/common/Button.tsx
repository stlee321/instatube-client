import { MouseEventHandler } from "react";

type ButtonStyle = "solid" | "light" | "naked";

export default function Button({
  name,
  buttonStyle,
  onClick,
}: {
  name: string;
  buttonStyle: ButtonStyle;
  onClick: MouseEventHandler;
}) {
  let style =
    "px-4 rounded-full hover:cursor-pointer select-none whitespace-nowrap flex justify-center items-center ";
  switch (buttonStyle) {
    case "solid":
      style += "bg-[#3EAEFF] text-white border-2 border-[#3EAEFF]";
      break;
    case "light":
      style += "text-[#3EAEFF] border-2 border-[#3EAEFF]";
      break;
    case "naked":
      style += "text-[#3EAEFF] border-2 border-white";
      break;
  }
  return (
    <div className={style} onClick={onClick}>
      {name}
    </div>
  );
}
