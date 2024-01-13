import GithubFragment from "../component/fragment/GithubFragment";
import HandleFragment from "../component/fragment/HandleFragment";
import InstaFragment from "../component/fragment/InstaFragment";
import LinkFragment from "../component/fragment/LinkFragment";
import XFragment from "../component/fragment/XFragment";
import YoutubeFragment from "../component/fragment/YoutubeFragment";
import { isValidHandle } from "./validator";

function isHandle(word: string): boolean {
  if (word.length <= 1) return false;
  return word[0] === "@" && isValidHandle(word.substring(1));
}

export function isLink(word: string): boolean {
  if (word.length === 0) return false;
  const regex = new RegExp(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
  );
  const result = word.match(regex);
  return !!result;
}
export function isDomainWith(word: string, domain: string): boolean {
  if (!isLink(word)) return false;
  if (word.startsWith(`https://${domain}`)) return true;
  if (word.startsWith(`http://${domain}`)) return true;
  if (word.startsWith(`https://www.${domain}`)) return true;
  if (word.startsWith(`http://www.${domain}`)) return true;
  if (word.startsWith(domain)) return true;
  if (word.startsWith(`www.${domain}`)) return true;
  return false;
}
function buildContent(content: string) {
  return (
    <>
      {...content.split(/(\r\n|\n)/).map((line, idx) => {
        if (line === "") {
          return <br key={idx} />;
        }
        return (
          <div key={idx}>
            {...line.split(" ").map((word, subidx) => {
              if (isHandle(word))
                return (
                  <span key={subidx}>
                    {" "}
                    <HandleFragment handle={word.substring(1)} />
                  </span>
                );
              if (isDomainWith(word, "instagram.com"))
                return (
                  <span key={subidx}>
                    {" "}
                    <InstaFragment url={word} />
                  </span>
                );
              if (
                isDomainWith(word, "twitter.com") ||
                isDomainWith(word, "x.com")
              )
                return (
                  <span key={subidx}>
                    {" "}
                    <XFragment url={word} />
                  </span>
                );
              if (isDomainWith(word, "youtube.com"))
                return (
                  <span key={subidx}>
                    {" "}
                    <YoutubeFragment url={word} />
                  </span>
                );
              if (isDomainWith(word, "github.com"))
                return (
                  <span key={subidx}>
                    {" "}
                    <GithubFragment url={word} />
                  </span>
                );
              if (isLink(word))
                return (
                  <span key={subidx}>
                    {" "}
                    <LinkFragment url={word} />
                  </span>
                );
              return <span key={subidx}>{idx >= 0 ? " " + word : word}</span>;
            })}
          </div>
        );
      })}
    </>
  );
}

export { buildContent };
