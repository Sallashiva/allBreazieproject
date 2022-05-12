import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { DeliveryService } from '../delivery.service';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-general-delivery',
  templateUrl: './general-delivery.page.html',
  styleUrls: ['./general-delivery.page.scss'],
})
export class GeneralDeliveryPage implements OnInit {

  deliveryForm: FormGroup;
  nodata: boolean = false;
  employee:any
  fullName: string;
  display: boolean = true;
  filteredOptions;
  initialValue = 0;
  disabled = true
  url = 'delivery'

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private deliveryService: DeliveryService,
    private toastr: ToastrService,
    private navController: NavController,
  ) {}

  ngOnInit(): void {
    this.deliveryForm = this.fb.group({
      quantity: new FormControl('', [Validators.required]),
    });
    this.deliveryForm.setValue({
      quantity : 0
    });

  }
  signatureValue:boolean =false
  ionCheckbox(event: any){
    this.signatureValue=event.target.checked
    this.deliveryForm.get('signatureRequired').setValue(event.target.checked);

  }

  increment() {

   let increment =this.deliveryForm.get('quantity').value + 1
   this.deliveryForm.get('quantity').setValue(increment);
   this.Buttons=false;
  }
  Buttons:boolean=true
  decrement() {
    let decrement =this.deliveryForm.get('quantity').value - 1
    this.deliveryForm.get('quantity').setValue(decrement);

    if (this.deliveryForm.get("quantity").value > 0) {
        this.Buttons=false;
      }else{
        this.Buttons=true;
      }

  }

  addDelivery() {
    let finalDate = new Date();
    let obj = {
      noOfPackages: this.deliveryForm.get('quantity').value,
      deliveryTime: finalDate,
      signatureRequired:this.signatureValue
    }
    this.deliveryService.addGeneralDelivery(obj).subscribe(res =>{
      if(!res.error) {
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
      } else {
        this.toastr.error(res.message);
      }
    })


}

}
