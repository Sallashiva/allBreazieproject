import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  emailId;
  otpForm: FormGroup;
  subscription: Subscription;
  @ViewChild('ngOtpInput') ngOtpInputRef: any;

  constructor(
    private authService: AuthServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required])
    }, {
      validator: this.checkLength('otp')
    });
  }

  checkLength(otp: string) {
    return (formGroup: FormGroup) => {
      const otpLength = formGroup.controls[otp]
      if ((otpLength.value.length && otpLength.value.length < 6)) {
        otpLength.setErrors({
          length: true
        })
      } else {
        otpLength.setErrors({
          length: false
        })
      }
    }
  }

  onOtpChange(event) {
    this.otpForm.get('otp').setValue(event);
  }

  getOpt() {
    this.subscription = this.authService.currentEmail.subscribe(email => {
      this.emailId = email;
    });
    this.otpForm.get('emailId').setValue(this.emailId);
    this.authService.sendOtp(this.otpForm.value).subscribe((res) => {
      this.ngOtpInputRef.otpForm.reset();
      this.toastr.success(res.message);
      if (!res.error) {
        this.router.navigate(['/dashboard']);
      }
    }, err => {
      this.ngOtpInputRef.otpForm.reset();
      this.toastr.error(err.error.message);
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  resendOtp() {
    this.subscription = this.authService.currentEmail.subscribe(email => {
      this.emailId = email;
    });
    let data = {
      emailId: this.emailId
    }
    this.authService.reSendOtp(data).subscribe((res) => {
      this.ngOtpInputRef.otpForm.reset();
      this.toastr.success(res.message);
      if (!res.error) {
        this.router.navigate(['/auth/otp']);
      }
    }, err => {
      this.ngOtpInputRef.otpForm.reset();
      this.toastr.error(err.error.message);
    });
  }
}
