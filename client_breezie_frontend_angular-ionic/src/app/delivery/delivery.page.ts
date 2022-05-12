import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { DeliveryService } from '../delivery.service';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {
  deliveryForm: FormGroup;
  nodata: boolean = false;
  employee:any
  fullName: string;
  display: boolean = true;
  filteredOptions;
  url: string = "home"

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private deliveryService: DeliveryService,
    private toastr: ToastrService,
    private navController: NavController,
  ) {}

  ngOnInit(): void {
    this.deliveryForm = this.fb.group({
      empId: new FormControl('', [Validators.required]),
      emailNote: new FormControl('',[Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/), Validators.email]),
    });
    this.getEmployee();
    this.initForm();
  }
  signatureValue:boolean =false
  ionCheckbox(event: any){
    this.signatureValue=event.target.checked
    this.deliveryForm.get('signatureRequired').setValue(event.target.checked);
  }

  addDelivery() {
    let finalDate = new Date();
    this.deliveryForm.get('deliveryTime').setValue(finalDate);
    // this.deliveryForm.get('empId').setValue(this.empIds);
    let data= {
      empId:this.empIds ,
      emailNote: this.deliveryForm.get('emailNote').value,
      deliveryTime:this.deliveryForm.get('deliveryTime').value,
      signatureRequired:this.deliveryForm.get('signatureRequired').value
    }
    this.deliveryService.addDelivery(data).subscribe((res) => {
      if (!res.error) {
        if (this.signatureValue) {
          this.navController.navigateRoot(['delivery-data'],{
            queryParams: {
              Recipient : "Please wait-the recipient will collect the delivery from you ...",
            }
          });
        }else{
          this.navController.navigateRoot(['delivery-data'],{
            queryParams: {
              Recipient : "The recipient has been notified",
            }
          });
        }
        this.toastr.success(res.message);
        this.deliveryForm.reset();
      } else {
        this.toastr.error(res.message);
      }

    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
}


  _id: string
  initForm() {
    this.deliveryForm = this.fb.group({
      empId: ['', Validators.required],
      emailNote: ['', Validators.required],
      deliveryTime: [''],
      signatureRequired:[false]
    })
    this.deliveryForm.get('empId').valueChanges.subscribe(response => {
      if (response && response.length > 2) {
        this.filterData(response);
      } else {
        this.filteredOptions = [];
      }
    })
  }

  empIds: any
  disableButton:boolean = true;
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
      this.disableButton= true;
    }else{
      this.disableButton= false;
    }
  }

  getEmployee() {
    this.employeeService.getEmployee().subscribe(res => {
      this.employee = res.employeeData;
    });
  }

  navigatetoGeneral() {
    this.navController.navigateRoot(['general-delivery'])
  }
}
