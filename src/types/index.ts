export type CurrentUser = {
  id: number;
  email: string;
};

  

export type ITokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
  userId: number;
};

export type Unpromisify<T> = T extends Promise<infer R> ? R : T;

export type AnyObject = Record<string, any>;
export type AnyArray = unknown[];
export type AnyObjectOrArray = AnyObject | AnyArray;

export type ApiResponse<T = any> = {
  payload: T;
  statusCode: number;
  message: string;
  success: boolean;
  error:any
};
