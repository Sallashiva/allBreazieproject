import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/services/employee.service';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register-password',
  templateUrl: './register-password.component.html',
  styleUrls: ['./register-password.component.css']
})
export class RegisterPasswordComponent implements OnInit {

  passwordForm: FormGroup;
  spinner:boolean=false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private registerService: RegisterService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private router: Router
  ) {}

employeeShown: boolean = false;
  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      emailId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/)]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/)])
    })
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data.role!==undefined) {
        this.employeeShown=true;
      }else{
        this.employeeShown=false;
      }
      this.passwordForm.patchValue({
        emailId: data.emailId
      })
    })
  }

  setPassword() {
    this.spinner=true;
   if (!this.employeeShown) {
    this.registerService.setPasswordService(this.passwordForm.value).subscribe(res => {
      if (!res.error) {
        this.toastr.success(res.message)
        this.spinner=false;
        this.router.navigate(['/auth/login'])
      } else {
        this.toastr.error(res.message)
      }
    }, err => {
      if (err.status) {
        this.spinner=false;
        this.toastr.error(err.error.message);
      } else {
        this.toastr.error("CONNECTION_ERROR");
        this.spinner=false;
      }
    });
   }else{
     this.spinner=true;
    this.employeeService.setEmployeePassword(this.passwordForm.value).subscribe(res => {
      if (!res.error) {
        this.spinner=false;
        this.toastr.success(res.message)
        this.router.navigate(['/auth/login'])
      } else {
        this.spinner=false;
        this.toastr.error(res.message)
      }
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.spinner=false;
      } else {
        this.toastr.error("CONNECTION_ERROR");
        this.spinner=false;
      }
    });
   }
  }
}
