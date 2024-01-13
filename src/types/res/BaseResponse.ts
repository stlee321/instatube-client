export type BaseResponse<T> =
  | {
      success: true;
      error?: string;
      data: T;
    }
  | {
      success: false;
      error: string;
      data?: T;
    };

export type ApiResponse<T> = Promise<BaseResponse<T>>;
