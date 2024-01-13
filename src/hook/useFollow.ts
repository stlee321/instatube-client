import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  amIFollowing,
  follow,
  getFollowers,
  getFollowersCount,
  getFollowings,
  getFollowingsCount,
  unfollow,
} from "../fetch/followFetch";
import { FollowResponse } from "../types/res/FollowResponse";

export function getFollowersCountKey(handle: string) {
  return ["follow", handle, "follower", "count"];
}

export function useFollowersCount(handle: string) {
  return useQuery({
    queryKey: getFollowersCountKey(handle),
    queryFn: async ({ signal }) => {
      const result = await getFollowersCount(handle, signal);
      return result.success ? result.data.count : 0;
    },
  });
}

export function getFollowersKey(handle: string) {
  return ["follow", handle, "follower"];
}

export function useFollowers(handle: string) {
  return useInfiniteQuery({
    queryKey: getFollowersKey(handle),
    queryFn: async ({ signal }) => {
      const result = await getFollowers(handle, signal);
      if (result.success) {
        const followers = result.data.message.split(",");
        if (followers[0] === "") {
          return {
            followers: [],
            nextIdx: 0,
          };
        }
        return {
          followers,
          nextIdx: followers.length,
        };
      }
      return undefined;
    },
    getNextPageParam: (lastPage) => (lastPage ? lastPage.nextIdx : undefined),
  });
}

export function getFollowingsCountKey(handle: string) {
  return ["follow", handle, "following", "count"];
}

export function useFollowingsCount(handle: string) {
  return useQuery({
    queryKey: getFollowingsCountKey(handle),
    queryFn: async ({ signal }) => {
      const result = await getFollowingsCount(handle, signal);
      return result.success ? result.data.count : 0;
    },
  });
}

export function getFollowingsKey(handle: string) {
  return ["follow", handle, "following"];
}

export function useFollowings(handle: string) {
  return useInfiniteQuery({
    queryKey: getFollowingsKey(handle),
    queryFn: async ({ signal }) => {
      const result = await getFollowings(handle, signal);
      if (result.success) {
        const followings = result.data.message.split(",");
        if (followings[0] === "") {
          return {
            followings: [],
            nextIdx: 0,
          };
        }
        return {
          followings,
          nextIdx: followings.length,
        };
      }
      return undefined;
    },
    getNextPageParam: (lastPage) => (lastPage ? lastPage.nextIdx : undefined),
  });
}

export function getAmIFollowingKey(from: string, to: string) {
  return ["follow", from, to];
}

export function useAmIFollowing(
  accessToken: string,
  me: string,
  handle: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: getAmIFollowingKey(me, handle),
    queryFn: async ({ signal }) => {
      const result = await amIFollowing(accessToken, handle, signal);
      return result.success ? result.data.result : false;
    },
    enabled: enabled,
  });
}

type FollowProps = {
  accessToken: string;
  me: string;
  handle: string;
  isFollowing: boolean;
};

export function useFollow() {
  const queryClient = useQueryClient();
  return useMutation<FollowResponse, Error, FollowProps>({
    mutationFn: async ({ accessToken, handle, isFollowing }) => {
      const result = isFollowing
        ? await unfollow(accessToken, handle)
        : await follow(accessToken, handle);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
    onSuccess: (data, { me, handle }) => {
      data;
      queryClient.invalidateQueries({
        queryKey: getAmIFollowingKey(me, handle),
      });
      queryClient.invalidateQueries({
        queryKey: getFollowersCountKey(handle),
      });
      queryClient.invalidateQueries({
        queryKey: getFollowersKey(handle),
      });
      queryClient.invalidateQueries({
        queryKey: getFollowingsCountKey(handle),
      });
      queryClient.invalidateQueries({
        queryKey: getFollowingsKey(handle),
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
