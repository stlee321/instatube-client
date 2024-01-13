import { useEffect, useState } from "react";
import { InfiniteQueryObserverResult } from "@tanstack/react-query";

interface IuseIntersectionObserverProps {
  threshold?: number;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => Promise<InfiniteQueryObserverResult>;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  hasNextPage,
  fetchNextPage,
}: IuseIntersectionObserverProps) => {
  const [target, setTarget] = useState<HTMLDivElement | null | undefined>(null);

  useEffect(() => {
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        });
      },
      {
        threshold,
      }
    );

    observer.observe(target);

    return () => observer.unobserve(target);
  }, [threshold, target, fetchNextPage, hasNextPage]);

  return { setTarget };
};
