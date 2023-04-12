import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/authService';
import { DataService } from '../services/dataservice';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit{

  pipe = new DatePipe('en-US');
  accountId: number = 0;
  accountForm!: FormGroup;
  passwordForm!: FormGroup;
  submitted = false;
  submittedPassword = false;

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private data: DataService,
    private auth: AuthService) {
    
      this.route.params.subscribe((params: any) => {
        this.accountId = params['id'];
        this.loadProfile(this.accountId);
      })    

      // форма сброса пароля
      this.passwordForm = this.formBuilder.group({
        passwordCurrent: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(26), Validators.pattern('[a-zA-Zа-яА-Я0-9]+')]],
        password1: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(26), Validators.pattern('[a-zA-Zа-яА-Я0-9]+')]],
        password2: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(26), Validators.pattern('[a-zA-Zа-яА-Я0-9]+')]]
      }, {
        validator: MustMatch('password1', 'password2')
      });
  }

  get a() { return this.auth }

  // загрузка данных профиля
  loadProfile(accountId: number) {
    this.data.getProfile(accountId).subscribe((res) => {                                     

      // настраиваю правила валидации на форме
      this.accountForm = this.formBuilder.group({
        firstName: [res.FirstName, [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('[a-zA-Zа-яА-Я]+')]],
        lastName: [res.LastName, [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('[a-zA-Zа-яА-Я]+')]],
        city: [res.City, [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('[a-zA-Zа-яА-Я]+')]],
        phone: [res.Phone, [Validators.pattern('\\+[0-9]{10,11}')]],
        birthDate: [res.BirthDate, []],
        gender: [res.Gender, []],
      }, {});

      this.accountForm.get('birthDate')?.patchValue(this.formatDate(res.BirthDate));      
    });           
  }

  get f() { return this.accountForm.controls; }

  get p() { return this.passwordForm.controls; }

  private formatDate(date: string): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  ngOnInit(): void {
    const today: Date = new Date();
    const maxDate: string = today.toISOString().split('T')[0];
    
    const dateInput: HTMLInputElement | null = document.querySelector('input[type="date"]') as HTMLInputElement;
    if (dateInput !== null) {
      dateInput.setAttribute('max', maxDate);
    } else {
      console.error('Input element not found');
    }
  }

  onSubmit() {    
    this.submitted = true;        
    if (this.accountForm.invalid) {
        return;
    }

    let formObj = this.accountForm.getRawValue();    
    this.data.updateUser(this.accountId, formObj).subscribe(() => {
      alert('Профиль сохранён!')
    });   
  }   

  onPasswordSubmit() {    
    this.submittedPassword = true;        
    if (this.passwordForm.invalid) {
        return;
    }

    let formObj = this.passwordForm.getRawValue();    
    this.data.updateUserPassword(this.accountId, formObj.passwordCurrent, formObj.password1).subscribe(() => {
      alert('Пароль обновлён!')
    });    
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
