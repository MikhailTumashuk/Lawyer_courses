import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DataService } from "./dataservice";

@Injectable({
    providedIn: 'root'}
)
export class AuthService {
     
    private user: object | undefined

    constructor(private data: DataService) {        
    }
      
    login(login:string, password:string ): Observable<any> {
        return this.data.login(login, password);
    }
    
    get isAuthenticated(): boolean { return this.user !== undefined }

    get userId(): number {
        if (!this.user) {
            throw new Error('Пользователь неавторизован')
        }
        return this.user['userId' as keyof object]
    }
    
    parsePayload(token: string): object {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
          
        return JSON.parse(jsonPayload);
    }          

    setUser(user: object) {
        this.user = user
    }
}