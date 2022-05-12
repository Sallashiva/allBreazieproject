import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OtpService } from 'src/app/services/otp.service';
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})

export class EmailComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  spinner:boolean=false;
  constructor(
    private router: Router,
    private mail: OtpService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      emailId: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/),
        Validators.email
      ]),
    })
  }
  get loginFormControl() {
    return this.loginForm.controls;
  }

  loginFormSubmit() {
    this.spinner=true;
    this.mail.changeMessage(this.loginForm.value['emailId']);
    this.mail.email(this.loginForm.value).subscribe((res) => {
      if (!res.error) {
        this.spinner=false;
        this.router.navigate(['/otp']);
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    }, (err) => {
      if (err.status) {
        this.toastr.error(err.error.message);
      } else {
        this.toastr.error('CONNECTION_ERROR');
      }
    });
  }
  
  back() {
    this.router.navigate(['/auth/login']);
  }
}
