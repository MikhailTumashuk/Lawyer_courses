import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppConfig } from '../models/config.model'

@Injectable({
  providedIn: 'root',
})
export class ConfigService {

  constructor(private http: HttpClient) {    
  }

  static settings: IAppConfig;

  get settings(): IAppConfig {
    return ConfigService.settings;
  } 

  // прочитать конфигурацию
  load() {    
    return new Promise((resolve, reject) => {
      this.http.get('assets/config/config.json').subscribe((res) => {
        ConfigService.settings = res as IAppConfig 
        resolve(true);          
      })
    })
   }
}