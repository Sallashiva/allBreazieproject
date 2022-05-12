import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { OtpService } from 'src/app/services/otp.service';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})

export class OtpComponent implements OnInit, OnDestroy {
  emailId;
  otpForm: FormGroup;
  subscription: Subscription;
  spinner:boolean=false;
  @ViewChild('ngOtpInput') ngOtpInputRef: any;

  constructor(
    private otpService: OtpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}

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
    this.spinner=true;
    this.subscription = this.otpService.currentEmail.subscribe(email => {
      this.emailId = email
    });
    this.otpForm.get('emailId').setValue(this.emailId);
    this.otpService.sendOtp(this.otpForm.value).subscribe((res) => {
      this.ngOtpInputRef.otpForm.reset();
      this.toastr.success(res.message)
      if (!res.error) {
        this.spinner=false
        this.router.navigate(['/reset-password'])
      }
    }, err => {
      this.ngOtpInputRef.otpForm.reset()
      this.toastr.error(err.error.message)
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
