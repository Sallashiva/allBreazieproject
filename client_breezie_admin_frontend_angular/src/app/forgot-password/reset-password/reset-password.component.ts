import { AfterViewChecked, Component, OnDestroy, OnInit,  } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { OtpService } from 'src/app/services/otp.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy, AfterViewChecked {
  loginForm: FormGroup;
  emailId: string;
  subscription: Subscription;
spinner:boolean=false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private otpService: OtpService,
    private toast: ToastrService
  ) {}

  ngAfterViewChecked() {
    for (let el in this.loginForm.controls) {
      if (this.loginForm.controls[el].errors) {
      }
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      emailId: [''],
      password: ['', Validators.compose([Validators.required, this.patternValidator()])],
      confirmedPassword: ['', [Validators.required]],
    }, {
      validator: this.MatchPassword('password', 'confirmedPassword'),
    });
  }
  hide = true;
  get passwordInput() {
    return this.loginForm.get('password');
  }
  hide2 = true;
  get confirmedPasswordInput() {
    return this.loginForm.get('confirmedPasswordpassword');
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }
      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({
          passwordMismatch: true
        });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  patternValidator() {
    return (control: AbstractControl): {
      [key: string]: any
    } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$');
      const valid = regex.test(control.value);
      return valid ? null : {
        invalidPassword: true
      };
    };
  }

  loginFormSubmit() {
    this.spinner=true;
    this.subscription = this.otpService.currentEmail.subscribe(email => {
      this.emailId = email
    });
    this.loginForm.get('emailId').setValue(this.emailId);
    this.otpService.resetPassword(this.loginForm.value).subscribe((res) => {
      if (!res.error) {
        this.toast.success(res.message);
        this.spinner=false;
        this.router.navigate(['/login'])
      } else {
        this.toast.error(res.message)
      }
    }, err => {
      this.toast.error(err.error.message)
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
