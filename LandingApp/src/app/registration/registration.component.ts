import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from '../services/dataservice';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private data: DataService) {     
  }

  ngOnInit(): void {
    // настраиваю правила валидации на форме
    this.registerForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('[a-zA-Zа-яА-Я0-9]+')]],
      password1: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(26), Validators.pattern('[a-zA-Zа-яА-Я0-9]+')]],
      password2: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(26), Validators.pattern('[a-zA-Zа-яА-Я0-9]+')]]
    }, {
      validator: MustMatch('password1', 'password2')
    });
  }
   
   get f() { return this.registerForm.controls; }

   onSubmit() {
       this.submitted = true;
      // Увеличение блока 
      let block = document.getElementById('form_container') as HTMLElement;
      block.style.height = '700px';
       
       if (this.registerForm.invalid) {
           return;
       }

       const login = this.registerForm.value.login;
       const password = this.registerForm.value.password1;       

       this.data.addUser(login, password).subscribe((res) => {                               
          this.router.navigate(['home/account', res.Id]) });
   }   
}

// функция проверки двух значений контролов на совпадение
function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {       
          return;
      }

      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}
