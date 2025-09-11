import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralResponse } from '../interfaces/GeneralResponse.interface';
import { UserModel } from '../interfaces/User.interface';
import { environment } from '../../env/environments.dev';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly USERS_ENDPOINT = '/users';
  private readonly USERS_URL = `${environment.apiUrl}${this.USERS_ENDPOINT}`;

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllUsers():Observable<GeneralResponse<UserModel[]>> {
    return this.http.get<GeneralResponse<UserModel[]>>(`${this.USERS_URL}/all-users`);
  }

  getUserById(id: number):Observable<GeneralResponse<UserModel>> {
    return this.http.get<GeneralResponse<UserModel>>(`${this.USERS_URL}/${id}`);
  }


  createUser(request: any): Observable<GeneralResponse<UserModel>> {
    return this.http.post<GeneralResponse<UserModel>>(`${this.USERS_URL}/create-user`, request);
  }

  /** Actualizar usuario */
  updateUser(request: any): Observable<GeneralResponse<UserModel>> {
    return this.http.put<GeneralResponse<UserModel>>(`${this.USERS_URL}/update-user`, request);
  }

  deleteUsers(userIds: number[]): Observable<GeneralResponse<number[]>> {
    return this.http.delete<GeneralResponse<number[]>>(`${this.USERS_URL}/delete-users`, {
      headers: { 'Content-Type': 'application/json' },
      body: userIds
    });
  }

}
