
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { RegisterService } from 'src/app/services/register.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @ViewChild('triggerForm', {
    static: false
  })
  triggerForm: NgForm;
  loginForm: FormGroup;
  submitted = false;
  passwords;
  show = false;
  spinner:boolean=false;
  constructor(
    private empl: RegisterService,
    private toastr: ToastrService,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      emailId: new FormControl('', [Validators.required,  Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/),
      Validators.email,
      ]),
      password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$")])
    });
    this.checkLogin();
  }
  hide = true;
  get passwordInput() {
    return this.loginForm.get('password');
  }
  get loginFormControl() {
    return this.loginForm.controls;
  }

  triggerSubmit() {
    if (!this.triggerForm) {
      console.warn('triggerForm not assigned a value');
    } else {
      if (this.triggerForm.valid) {
        this.triggerForm.ngSubmit.emit();
      }
    }
  }

  loginFormSubmit() {
    this.submitted = true;
    this.spinner=true;
    this.empl.loginUser(this.loginForm.value).subscribe((res) => {
      if (!res.error) {
        this.toastr.success(res.message);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userName', res.companyName)
        localStorage.setItem('dataBaseID', res.employee.userId)
        localStorage.setItem('employeeRole', res.employee.role)
        // localStorage.setItem('emailId', res.admin._id)
        this.spinner=false;
        this.router.navigate(['/breezie-dashboard/dashboards'])
       
      } else {
        this.toastr.error(res.message)
        this.spinner=false;
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

  checkLogin(){
    // this.adminService.checkUser().subscribe((res)=>{
    //   if (!res.error) {
    //       this.router.navigate(['/breezie-dashboard/dashboards']);
    //   }
    // });
  }

  forgotPassword() {
    this.router.navigate(['/email'])
  }
}
