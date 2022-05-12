import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResponse } from 'src/app/models/employeeResponse';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-deliveries-model',
  templateUrl: './deliveries-model.component.html',
  styleUrls: ['./deliveries-model.component.css']
})

export class DeliveriesModelComponent implements OnInit {
  deliveryForm: FormGroup;
  nodata: boolean = false;
  employee: EmployeeResponse[] = [];
  fullName: string;
  display: boolean = true;
  filteredOptions;
  spinner:boolean=false;
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private deliveryService: DeliveriesService,
    private toastr: ToastrService,
    private router:Router,
    private dialogRef: MatDialogRef<DeliveriesModelComponent>
  ) { }

  ngOnInit(): void {
    this.deliveryForm = this.fb.group({
      empId: new FormControl('', [Validators.required]),
      emailNote: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/), Validators.email]),

    });
    this.getEmployee();
    this.initForm();
  }


  isTrue = false
  addDelivery() {
    let finalDate = new Date();
    this.deliveryForm.get('deliveryTime').setValue(finalDate);
    // this.deliveryForm.get('empId').setValue(this.empIds);

    if (this.deliveryForm.get('signatureRequired').value === true) {
      this.isTrue = true
    } else {
      this.isTrue = false
    }
    let data = {
      empId: this.empIds,
      emailNote: this.deliveryForm.get('emailNote').value,
      deliveryTime: this.deliveryForm.get('deliveryTime').value,
      signatureRequired: this.isTrue
    }
  this.spinner=true;
    this.deliveryService.addDelivery(data).subscribe((res) => {
      if (!res.error) {
        this.toastr.success(res.message);
        this.spinner=false
        this.spinner=false;
        this.deliveryForm.reset();
        this.dialogRef.close('save');
      } else {
        this.toastr.error(res.message);
        this.spinner=false;
      }
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.spinner=false;
        this.logOut();
      } else {
        this.toastr.error("CONNECTION_ERROR");
        this.spinner=false;
      }
    });
  }


  _id: string
  initForm() {
    this.spinner=true;
    this.deliveryForm = this.fb.group({
      empId: ['', Validators.required],
      emailNote: ['', Validators.required],
      deliveryTime: [''],
      signatureRequired: [false]
    })
    this.deliveryForm.get('empId').valueChanges.subscribe(response => {
      if (response && response.length) {
        this.spinner=false;
        this.filterData(response);
      } else {
        this.filteredOptions = [];
      }
    })
  }

  disableButton:Boolean=true
  empIds: any
  filterData(enterData) {
    this.filteredOptions = this.employee.filter(item => {
      // this.empIds = item._id
      if (item.fullName.toLowerCase().indexOf(enterData.toLowerCase()) > -1) {
        this.empIds = item._id
      }
      return item.fullName.toLowerCase().indexOf(enterData.toLowerCase()) > -1
    });
    this.nodata = true;
    if (this.filteredOptions.length <= 0) {
      this.disableButton= true
    }else{
      this.disableButton= false;
    }
  }

  getEmployee() {
    this.spinner=true;
    this.employeeService.getEmployee().subscribe(res => {
      this.spinner=false;
      this.employee = res.employeeData;
    });
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
}
