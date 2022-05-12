
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from '../../services/auth-service.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  // @ViewChild('triggerForm', {
  //   static: false
  // })
  triggerForm: NgForm;
  loginForm: FormGroup;
  submitted = false;
  passwords;
  show = false;

  constructor(
    private empl: AuthServiceService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      emailId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/),
      Validators.email,
      ]),
      password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$")])
    });
  }
  hide = true;
  get passwordInput() {
    return this.loginForm.get('password');
  }
  get loginFormControl() {
    return this.loginForm.controls;
  }

  // triggerSubmit() {
  //   if (!this.triggerForm) {
  //     console.warn('triggerForm not assigned a value');
  //   } else {
  //     if (this.triggerForm.valid) {
  //       this.triggerForm.ngSubmit.emit();
  //     }
  //   }
  // }

  loginFormSubmit() {
    this.empl.setEmail(this.loginForm.value.emailId)
    this.empl.loginUser(this.loginForm.value).subscribe((res) => {
      if (!res.error) {
        this.toastr.success(res.message);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/auth/otp']);
      } else {
        this.toastr.error(res.message)
      }
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }
  forgotPassword() {
    this.router.navigate(['/email'])
  }
}
