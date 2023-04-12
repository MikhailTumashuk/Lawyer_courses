import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { DataService } from '../services/dataservice';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  loginForm!: FormGroup;
  submitted = false;

  constructor (
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService) {
  }

  ngOnInit(): void {
    // настраиваю правила валидации на форме
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]      
    }, {});

  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    if (this.loginForm.invalid) {
        return;
    }

    const login = this.loginForm.value.login;
    const password = this.loginForm.value.password;       
    
    this.auth.login(login, password).subscribe((res) => {      
      if (res.error) {
        alert(res.message)
        return;
      }

      console.log(res.jwt)      
      const payload = this.auth.parsePayload(res.jwt);
      this.auth.setUser(payload)
      this.router.navigate(['home/account', this.auth.userId ]) });          
  }

}
