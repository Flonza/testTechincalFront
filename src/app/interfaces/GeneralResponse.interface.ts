export interface GeneralResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
