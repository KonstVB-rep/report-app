export type ActionResponse<T> = {
  success: boolean;
  message: string;
  errors?: {
    errors: string[];
    properties?: {
      [K in keyof T]?: {
        errors: string[];
      };
    };
  };
  inputs?: {
    [K in keyof T]?: string;
  };
};
