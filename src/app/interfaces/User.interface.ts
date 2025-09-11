export interface UserModel {
  id: number;
  country: string;
  email: string;
  gender: string;
  isActive: boolean;
  userName: string;
  birthDate: string | null;
  cellphone: string | null;
}
