import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../env/environments.dev';
import { GeneralResponse } from '../interfaces/GeneralResponse.interface';
import { Observable } from 'rxjs';
import { BasicResponseModel } from '../interfaces/BasicResponseModel.interface';


@Injectable({
  providedIn: 'root'
})
export class BasicDataService {
  private readonly COUNTRIES_ENDPOINT = '/countries';
  private readonly COUNTRIES_URL = `${environment.apiUrl}${this.COUNTRIES_ENDPOINT}`;
  private readonly GENDERS_ENDPOINT = '/genders';
  private readonly GENDERS_URL = `${environment.apiUrl}${this.GENDERS_ENDPOINT}`;

  constructor(private readonly http: HttpClient) { }


  getAllCountries(): Observable<GeneralResponse<BasicResponseModel[]>> {
    return this.http.get<GeneralResponse<BasicResponseModel[]>>(
      `${this.COUNTRIES_URL}/all-countries`
    );
  }

  getAllGenders(): Observable<GeneralResponse<BasicResponseModel[]>> {
    return this.http.get<GeneralResponse<BasicResponseModel[]>>(
      `${this.GENDERS_URL}/all-genders`
    );
  }
}
