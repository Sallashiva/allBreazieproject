import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResponse } from 'src/app/models/employeeResponse';
import { DeliveryModelTrialComponent } from 'src/app/modules/delivery-model-trial/delivery-model-trial.component';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { RegisterService } from 'src/app/services/register.service';
import { SettingDeliveriesService } from 'src/app/services/setting-deliveries.service';
import { WelcomeScreenService } from 'src/app/services/welcome-screen.service';

@Component({
  selector: 'app-setting-deliveries',
  templateUrl: './setting-deliveries.component.html',
  styleUrls: ['./setting-deliveries.component.css']
})
export class SettingDeliveriesComponent implements OnInit,AfterViewInit {
  signInform: FormGroup
  spinner: boolean = true;
  checboxform: FormGroup
  nodata: boolean = false;
  employee: EmployeeResponse[] = [];
  fullName: string;
  filteredOptions;
  freeTrialForm:FormGroup

  constructor(private fb: FormBuilder,
     private employeeService: EmployeeService,
     private setupService: SettingDeliveriesService,
     private welcomeScree: WelcomeScreenService,
     private toastr:ToastrService,
     private registerService: RegisterService,
    public dialog: MatDialog,
    private deliveryService: DeliveriesService,
    private router:Router

     ) { }

  ngOnInit(): void {
    this.signInform = this.fb.group({
      noSignature: ['The recipient has been notified'],
      signature: ['Please wait-the recipient will collect the delivery from you ....'],
      signOut: ['Please wait-a member of our team will collect the delivery ...'],
      noSignature1: ['Our team has been notified'],
      signature1: ['Please wait-a member of our team will collect the delivery ...'],
      recipient:['']

    })
    this.checboxform = this.fb.group({
      empId: new FormControl('', [Validators.required])
    });
    this.freeTrialForm = new FormGroup({
      'finalDate': new FormControl()
    })
    this.getUserData()
    this.getSettings()
    this.getInfo()
    this.getEmployee()
    this.getImage()
    this.getDeliveryData()
    this.getAllDeliveryData()

  }

  ngAfterViewInit() {
    this.checboxform.get('empId').valueChanges.subscribe((v) => {
      if(this.checboxform.get('empId').valid) {
        this.disableButton = false;
      } else {
        this.disableButton = true;
      }
 });
  }

  FreeTrial: Boolean = false
  activeStatus: Boolean = false
  getUserData() {
    this.registerService.getRegister().subscribe((res) => {
      if (!res.error) {

        if (res.registeredData.deliveryAddOn.endDate) {
          let lastDay = res.registeredData.deliveryAddOn.endDate
          let lastDate: any = new Date(lastDay);
          let todayDate: any = new Date()
          var difference = (lastDate - todayDate)
          let days = Math.ceil(difference / (1000 * 3600 * 24))
          if (days >= 0) {
            this.activeStatus = true
          } else {
            this.activeStatus = false
          }
        }
        else {
          this.activeStatus = false
        }
        if (res.registeredData.deliveryAddOn.deliveryFreeTrialUsed) {
          this.FreeTrial = res.registeredData.deliveryAddOn.deliveryFreeTrialUsed
        }
        if(!res.registeredData.deliveryAddOn.deliveryFreeTrialUsed && !this.activeStatus){
          this.FreeTrial = res.registeredData.deliveryAddOn.deliveryFreeTrialUsed
          this.openDeliveryModel();
        }
      }
    })
  }


  openDeliveryModel(){
    const dialogRef = this.dialog.open(DeliveryModelTrialComponent, {
      maxWidth: '25vw',
      width: '100%',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let date = new Date();
        this.freeTrialForm.get('finalDate').setValue(date);
          this.deliveryService.addFreeTrial(this.freeTrialForm.value).subscribe(res => {
            this.getUserData()
          })
        // this.getAllVisitors();
      }
    });
  }

  getInfo(){
    this.checboxform = this.fb.group({
      scanLabel: [false],
      generalsDeliveries: [false],
      empId: [''],
      email: [''],
      phoneNumber: [''],

    })

    this.checboxform.get('empId').valueChanges.subscribe(response => {
      this.spinner=false;
      if (response && response.length > 2) {
        this.filterData(response);
      } else {
        this.filteredOptions = [];
      }
    })
  }


  empIds:any
  disableButton:boolean = true;
  filterData(enterData){
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
    this.setupService.getDeliverdEmployee().subscribe(res => {
      this.employee = res.employeeData;
    });
  }


  getSettings() {
    this.spinner=true;
    this.welcomeScree.getWelcomScreen().subscribe(res => {
      if(!res.error){
        this.spinner=false
        res.settings[0].deliverySetup.deliveriesContacts.forEach(ele=>{
          this.setupService.getEmployee(ele).subscribe(res => {
            this.employeesArray.push(res.employeeData[0])
          })
          this.deliveriesContacts.push(ele);
        })
      }
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut();
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    })
  }


  deliveriesContacts:any=[]
  employeesArray=[]
  onCheckboxSubmit() {
      this.deliveriesContacts.push(this.empIds)
      this.setupService.getEmployee(this.empIds).subscribe(res => {
        this.employeesArray.push(res.employeeData[0])
      })
      this.setupService.editEmployee(this.empIds).subscribe(res => {
      })
      this.addDeliverdEployee(this.deliveriesContacts)

    this.checboxform.reset()
    this.disableButton = true
  }


  addDeliverdEployee(deliveriesContacts){
    this.spinner=true
    this.setupService.upadeSetup(this.checboxform.value.scanLabel,this.checboxform.value.generalsDeliveries,deliveriesContacts).subscribe(res => {
      if(!res.error){
        this.spinner=false
        // this.toastr.success(res.message);
        this.getInfo()
        this.getEmployee()
        this.getAllDeliveryData()
      }else{
        this.toastr.error(res.message)
      }
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut();
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    })
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
  getEmployees() {
    this.setupService.getCateringAded().subscribe(res => {

      this.employeesArray =res.employeeData
    });
  }

  deleteEmployee(id){

    this.setupService.removeDeliverdEmployee(id).subscribe(res=>{
      this.getAllDeliveryData()
      this.getEmployee()
      this.getEmployees()
    })

    this.employeesArray.forEach((employee,i)=>{

      if (employee._id===id) {

        this.employeesArray.splice(i,1);
      }
    })
    this.deliveriesContacts.forEach((ele,i)=>{

      if (ele===id) {
        this.deliveriesContacts.splice(i,1)
      }
    })
    this.addDeliverdEployee(this.deliveriesContacts)
    this.getEmployee()
    

  }

  deliveryDataArray = [];
  getDeliveryData(){
    this.setupService.getGeneralDelivery().subscribe(res=>{
      this.deliveryDataArray=res.generalDeliveryData

    })
  }



  addEmployee(){
    let obj = {
      fullName:"General contact",
      email:this.checboxform.value.email,
      phoneNumber:this.checboxform.value.phoneNumber
    }
    this.setupService.addGeneralDelivery(obj).subscribe(data=>{
      if (!data.error) {
        this.getDeliveryData()
        this.getAllDeliveryData()
        this.checboxform.reset()
      }

    })
    // this.employeesArray.push(obj)
  }

  deleteDelivery(id){
this.setupService.deleteGeneralDelivery(id).subscribe(res=>{
   if (!res.error) {
     this.getDeliveryData()
     this.getAllDeliveryData()
   }else{

   }
})

  }

  disableSelect:boolean = false
  getAllDeliveryData(){
    this.setupService.getAllDelivery().subscribe(res=>{
      if (res.finalResponse.length >= 3) {
        this.disableSelect=true
      }else {
        this.disableSelect= false
      }
    })
  }

  //instruction
recipient:string="The recipient has been notified"

  noSignature(){
    this.recipient =this.signInform.value.noSignature
    this.signInform.get('recipient').setValue('noSignature1')
  }

  signature(){
    this.recipient =this.signInform.value.signature
    this.signInform.get('recipient').setValue('signature')
  }

  signOut(){
    this.recipient =this.signInform.value.signOut
    this.signInform.get('recipient').setValue('signOut')
  }

  signature1(){
    this.recipient =this.signInform.value.signature1
    this.signInform.get('recipient').setValue('signature1')
  }

  noSignature1(){
    this.recipient =this.signInform.value.noSignature1
    this.signInform.get('recipient').setValue('noSignature1')
  }


  imagesPath:any
  getImage(){
    this.spinner=true;
    this.welcomeScree.getImage().subscribe(res => {
      this.spinner=false;
      this.imagesPath=res.response
    })
  }

  onFormSubmit() {
  }
  telInputObject(obj) {
    obj.setCountry('india');
  }
  onCountryChange(event: any) {
  }


}
