import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAvatarImage,
  getPostImage,
  updateMyAvatarImage,
  uploadImage,
  uploadMyAvatarImage,
} from "../fetch/imageFetch";
import { ImageResponse } from "../types/res/ImageResponse";
import { getMeKey } from "./useUser";

export function getPostImageKey(imageId: string) {
  return ["post", "image", imageId];
}

export function usePostImage(imageId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: getPostImageKey(imageId),
    queryFn: async ({ signal }) => {
      const result = await getPostImage(imageId, signal);
      return result.success ? result.data : "";
    },
    enabled: enabled,
  });
}

export function getAvatarImageKey(avatarId: string) {
  return ["avatar", avatarId];
}

export function useAvatarImage(avatarId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: getAvatarImageKey(avatarId),
    queryFn: async ({ signal }) => {
      const result = await getAvatarImage(avatarId, signal);
      return result.success ? result.data : "";
    },
    enabled: enabled,
  });
}

type UploadImageProps = {
  accessToken: string;
  image: File;
};

export function useUploadImage() {
  const queryClient = useQueryClient();
  return useMutation<ImageResponse, Error, UploadImageProps>({
    mutationFn: async ({ accessToken, image }) => {
      const result = await uploadImage(accessToken, image);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
    onSuccess: (data) => {
      data;
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
}

type UpdateMyAvatarProps = {
  accessToken: string;
  avatar: File;
};

export function useUpdateMyAvatar() {
  const queryClient = useQueryClient();
  return useMutation<ImageResponse, Error, UpdateMyAvatarProps>({
    mutationFn: async ({ accessToken, avatar }) => {
      const result = await updateMyAvatarImage(accessToken, avatar);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getMeKey() });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}

type UploadAvatarProps = {
  avatar: File;
};

export function useUploadAvatar() {
  return useMutation<ImageResponse, Error, UploadAvatarProps>({
    mutationFn: async ({ avatar }) => {
      const result = await uploadMyAvatarImage(avatar);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
  });
}
