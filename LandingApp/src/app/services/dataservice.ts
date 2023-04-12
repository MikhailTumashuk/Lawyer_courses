import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './configservice';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private http: HttpClient, private config: ConfigService) {    
   }

   // добавить пользователя
   addUser(login: string, password: string): Observable<any>  {
    const url = `${this.config.settings.backend}/users/add/${login}/${password}`
    return this.http.post<any>(url, {}).pipe(catchError(this.errorHandler))
   }

   // получить данные профиля
   getProfile(accountId: number): Observable<any> {
    const url = `${this.config.settings.backend}/users/profile/${accountId}`
    return this.http.get<any>(url, {}).pipe(catchError(this.errorHandler))    
   }

   // обновить данные по пользователю
   updateUser(accountId: number, user: any): Observable<any> {
    const url = `${this.config.settings.backend}/users/profile/${accountId}`
    const body =  JSON.stringify(user)
    return this.http.put<any>(url, body, { headers: { 'Content-Type': 'application/json' } }).pipe(catchError(this.errorHandler))    
   }

   // обновить данные по пользователю
   login(login: string, password: string): Observable<any> {
    const url = `${this.config.settings.backend}/users/login/${login}/${password}`    
    return this.http.get<any>(url, {}).pipe(catchError(this.errorHandler))    
   }

   // обновить пароль пользователю
   updateUserPassword(accountId: number, passwordCurrent: string, newPassword: string) {
    const url = `${this.config.settings.backend}/users/password/${accountId}`
    const body =  JSON.stringify({ passwordCurrent, newPassword})
    return this.http.put<any>(url, body, { headers: { 'Content-Type': 'application/json' } }).pipe(catchError(this.errorHandler))
   }

   errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // ошибка обращения по сети
      alert('An error occurred:\r\n' + error.error.message);
    } else {
      // ошибка на сервере
      alert(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }    
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}