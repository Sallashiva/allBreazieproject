import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { bevaragesResponce } from 'src/app/models/bevaragesResponse';
import { EmployeeResponse } from 'src/app/models/employeeResponse';
import { CateringModelTrialComponent } from 'src/app/modules/catering-model-trial/catering-model-trial.component';
import { UpdateBevaragesComponent } from 'src/app/modules/update-bevarages/update-bevarages.component';
import { UpdateFoodCateringComponent } from 'src/app/modules/update-food-catering/update-food-catering.component';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { RegisterService } from 'src/app/services/register.service';
import { SettingDeliveriesService } from 'src/app/services/setting-deliveries.service';
import { SettingVisitorService } from 'src/app/services/setting-visitor.service';
import { WelcomeScreenService } from 'src/app/services/welcome-screen.service';

@Component({
  selector: 'app-catering',
  templateUrl: './catering.component.html',
  styleUrls: ['./catering.component.css'],
})
export class CateringComponent implements OnInit {
  contactDetailForm: FormGroup;
  spinner: boolean = false;
  thankqform: FormGroup;
  beavragesresponce: bevaragesResponce[];
  menuBevaragesForm: FormGroup;
  menuFoodForm: FormGroup;
  freeTrialForm: FormGroup;
  checboxform: FormGroup;
  filteredOptions;
  employee: EmployeeResponse[] = [];
  nodata: boolean = false;
  today = new Date();

  @ViewChild('add') add: ElementRef
  constructor(
    private fb: FormBuilder,
    private menuService: SettingVisitorService,
    private setupService: SettingDeliveriesService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private registerService: RegisterService,
    private deliveryService: DeliveriesService,
    private welcomeScree: WelcomeScreenService,
    private employeeService: EmployeeService,
    private router:Router
  ) {
    this.contactDetailForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\+(?:[1-9] ?){6,14}[0-9]$'),
      ]),
    });
    this.menuBevaragesForm = this.fb.group({
      bevergesName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-z]+([\s][a-zA-Z]+)*$/), Validators.maxLength(50)]),
      price: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      imagePath: [''],
    });
    this.menuFoodForm = this.fb.group({
      foodName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-z]+([\s][a-zA-Z]+)*$/), Validators.maxLength(50)]),
      price: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      notes: new FormControl('', [Validators.maxLength(50)]),
      imagePath: new FormControl('')
    })
    this.deliveryForm = this.fb.group({
      empId: new FormControl('')
    });
    this.initForm()
  }
  telInputObject(obj) {
    obj.setCountry('in');
  }
  onCountryChange(e: any) {
  }
  ngOnInit(): void {
    this.thankqform = this.fb.group({
      title: ['Have a great visit'],
      messages: ['Thank you for signing in'],
    });
    this.freeTrialForm = new FormGroup({
      'finalDate': new FormControl()
    })
    this.getBevaragesMenu();
    this.getFoodMenu();
    this.getUserData();
    // this.getInfo()
    this.getEmployee();
    this.getEmployees()
    // this.getSettings()
    this.getGeneralCatering()
    this.getAllCateringData()
    // this.getImage()
    this.today.setDate(this.today.getDate() + 0);

  }

  FreeTrial: Boolean = false
  activeStatus: Boolean = true
  getUserData() {
    this.registerService.getRegister().subscribe((res) => {
      if (!res.error) {

        if (res.registeredData.CateringAddOn.endDate) {
          let lastDay = res.registeredData.CateringAddOn.endDate
          let lastDate: any = new Date(lastDay);
          let todayDate: any = new Date()
          var difference = (lastDate - todayDate)
          let days = Math.ceil(difference / (1000 * 3600 * 24))
          if (days >= 0) {
            this.activeStatus = true
          } else {
            this.activeStatus = false
          }
        } else {
          this.activeStatus = false
        }
        if (res.registeredData.CateringAddOn.cateringFreeTrialUsed) {
          this.FreeTrial = res.registeredData.CateringAddOn.cateringFreeTrialUsed
        }
        if (!res.registeredData.CateringAddOn.cateringFreeTrialUsed && !this.activeStatus) {
          this.FreeTrial = res.registeredData.CateringAddOn.cateringFreeTrialUsed
          this.openCateringModel();
        }
      }
    })
  }


  openCateringModel() {
    const dialogRef = this.dialog.open(CateringModelTrialComponent, {
      maxWidth: '25vw',
      width: '100%',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let date = new Date();
        this.freeTrialForm.get('finalDate').setValue(date);
        this.menuService.addFreeTrial(this.freeTrialForm.value).subscribe(res => {
          this.getUserData()
        })
        // this.getAllVisitors();
      }
    });
  }

  title: string = "Have a great visit"
  message: string = "Thank you for signing in"
  tankqSubmit() {
    this.title = this.thankqform.value.title
    this.message = this.thankqform.value.messages
  }
  field: boolean = false;
  addItem() {
    this.field = !this.field;
  }


  onselect(event) {
    File = null;
    this.file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.urls.push(reader.result as string);
    };
    reader.readAsDataURL(this.file);
    this.menuBevaragesForm.get('imagePath').setValue(this.file);

  }
  urls2: any = []
  image;
  onselectFood(event) {
    this.image = (event.target as HTMLInputElement).files[0];
    const readers = new FileReader();
    readers.onload = () => {
      this.urls2.push(readers.result as string);
    };
    readers.readAsDataURL(this.image);
    this.menuFoodForm.get('imagePath').setValue(this.image);

  }
  cancel() {
    this.menuBevaragesForm.reset()
    this.field = false
  }
  cancelFood() {
    this.menuFoodForm.reset();
    this.food = false
  }

  addBevarages() {
    this.spinner = true
    this.menuService
      .bevaragesmenu(
        this.menuBevaragesForm.value.bevergesName,
        this.menuBevaragesForm.value.price,
        this.file
      )
      .subscribe(
        (res) => {
          if (!res.error) {
            this.spinner = false
            this.menuBevaragesForm.reset();
            this.toastr.success(res.message);
            this.getBevaragesMenu();
            this.field = false
          } else {
            this.toastr.error(res.message);
          }
        },
        (err) => {
          if (err.status) {
            this.toastr.error(err.error.message);
            this.logOut();
          } else {
            this.toastr.error('connection error');
          }
        }
      );
  }

  urls: any = [];
  file;

  BevaragesItem: any = [];
  getBevaragesMenu() {
    this.spinner = true
    this.menuService.getBevaragesmenu().subscribe((res) => {
      this.spinner = false
      this.BevaragesItem = res.catering;
    });
  }

  deleteBevaragesMenu(id) {
    this.spinner = true;
    this.menuService.deleteBevaragesmenu(id).subscribe((res) => {
      if (!res.error) {
        this.spinner = false
        this.toastr.success(res.message)
        this.getBevaragesMenu()
      } else {
        this.toastr.error(res.message)
      }
    })
  }
  updateBeavarageMenu(bevaragesItem: any) {
    const dialogRef = this.dialog.open(UpdateBevaragesComponent, {
      maxWidth: '25vw',
      width: '100%',
      disableClose: true,
      data: bevaragesItem
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'update') {
        this.getBevaragesMenu();
      }
    });
  }
  food: boolean = false
  addFoodItem() {
    this.food = !this.food
  }
  addFood() {
    this.spinner = true
    this.menuService.FoodMenu(
      this.menuFoodForm.value.foodName,
      this.menuFoodForm.value.price,
      this.image,
      this.menuFoodForm.value.notes
    )
      .subscribe(
        (res) => {
          if (!res.error) {
            this.toastr.success(res.message);
            this.getFoodMenu();
            this.spinner = false;
            this.menuFoodForm.reset()
            this.food = false


          } else {
            this.toastr.error(res.message);
          }
        },
        (err) => {
          if (err.status) {
            this.toastr.error(err.error.message);
            this.logOut();
          } else {
            this.toastr.error('connection error');
          }
        }
      );
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
  foodItem: any = []
  getFoodMenu() {
    this.spinner = true;
    this.menuService.getFoodmenu().subscribe((res) => {
      this.foodItem = res.catering;
      this.spinner = false
    });
  }
  deleteFoodMenu(id) {
    this.spinner = true
    this.menuService.deleteFoodmenu(id).subscribe((res) => {
      if (!res.error) {
        this.toastr.success(res.message)
        this.getFoodMenu()
        this.spinner = false
      } else {
        this.toastr.error(res.message)
      }
    })
  }
  updateFoodItem(foodItemMenu: any) {
    this.spinner = true
    const dialogRef = this.dialog.open(UpdateFoodCateringComponent, {
      maxWidth: '25vw',
      width: '100%',
      disableClose: true,
      data: foodItemMenu
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'update') {
        this.getFoodMenu();
        this.spinner = false
      }
    });
  }


  //delivery
  deliveryForm: FormGroup;
  _id: string
  initForm() {
    this.deliveryForm = this.fb.group({
      empId: [''],
    })
    this.deliveryForm.get('empId').valueChanges.subscribe(response => {
      if (response && response.length) {
        this.filterData(response);
      } else {
        this.filteredOptions = [];
      }
    })
  }
  empIds: any
  disableButton: boolean = true;
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
      this.disableButton = true
    } else {
      this.disableButton = false;
    }
  }

  getEmployees() {
    this.setupService.getCateringAded().subscribe(res => {

      this.employeesArray = res.employeeData
    });
  }

  getEmployee() {
    this.setupService.getCateringEmployee().subscribe(res => {
      this.employee = res.employeeData;
    });
  }



  deleteEmployee(id) {
    this.setupService.removeCateringEmployee(id).subscribe(res => {
      this.getEmployee()
      this.getEmployees()
      this.getAllCateringData()
    })

    this.employeesArray.forEach((employee, i) => {

      if (employee._id === id) {

        this.employeesArray.splice(i, 1);
      }
    })
    this.cateringDataArray.forEach((ele, i) => {

      if (ele === id) {
        this.cateringDataArray.splice(i, 1)
      }
    })
    this.getEmployee()

  }

  deliveriesContacts: any = []
  employeesArray = []
  addDelivery() {
    this.deliveriesContacts.push(this.empIds)
    this.setupService.getEmployee(this.empIds).subscribe(res => {
      this.employeesArray.push(res.employeeData[0])
      this.getAllCateringData()
    })
    this.setupService.cateringEditEmployee(this.empIds).subscribe(res => {
      this.getEmployee()
      this.getEmployees()
      this.getAllCateringData()
    })
    this.deliveryForm.reset();
    this.disableButton = true;
  }

  cateringDataArray = []
  getGeneralCatering() {
    this.employeeService.getGeneralCatering().subscribe(res => {
      this.cateringDataArray = res.generalData
    });
  }

  submit() {
    let obj = {
      fullName: "General contact",
      email: this.contactDetailForm.value.email,
      phoneNumber: this.contactDetailForm.value.phoneNumber
    }
    this.employeeService.addGeneralCatering(obj).subscribe(res => {
      if (!res.error) {
        this.getGeneralCatering()
        this.getAllCateringData()
        this.contactDetailForm.reset()
      } else {

      }
    })
  }

  deleteCatering(id) {
    this.employeeService.deleteCateringData(id).subscribe(res => {
      if (!res.error) {
        this.cateringDataArray.forEach((ele, i) => {

          if (ele === id) {
            this.cateringDataArray.splice(i, 1)
          }
        })
        this.getGeneralCatering()
        this.getAllCateringData()
      } else {
      }
    })

  }
  disableSelect: boolean = false
  getAllCateringData() {
    this.setupService.getAllCatering().subscribe(res => {
      if (res.finalResponse.length >= 3) {
        this.disableSelect = true
        // this.deliveryForm.get('empId').disable()
      } else {
        this.disableSelect = false
      }
    })
  }


}


