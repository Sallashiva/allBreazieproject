import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/employee.service';
import { VistorService } from 'src/app/vistor.service';
import { CafetrriaServiceService } from '../cafetrria-service.service';

@Component({
  selector: 'app-durationpage',
  templateUrl: './durationpage.component.html',
  styleUrls: ['./durationpage.component.scss'],
})
export class DurationpageComponent implements OnInit {

  durationForm : FormGroup;
  path: string;

  constructor( private navController: NavController ,
               private cafeteriaService: CafetrriaServiceService,
               private employeeServices: EmployeeService,
               private platform: Platform,
               private toastr: ToastrService,
               private visitorService: VistorService ) { }

  ngOnInit() {
    this.durationForm = new FormGroup({
      duration : new FormControl('')
    })
    // this.getFoodsData();
    this.getVisitorData();
    this.path = `cafeteria/foods`;
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack(this.path);
    });
  }


  // foodsData:any;
  // getFoodsData() {
  //   this.cafeteriaService.serviceData.subscribe(res =>{
  //     this.foodsData = res;
  //   })
  // }
  visitorId:any
  getVisitorData() {
    this.employeeServices.serviceData.subscribe(res =>{
      this.visitorId = res;
    })
  }

  durationData =[
    {
      label:"With in 10 Minutes"
    },
    {
      label:"With in 20 Minutes"
    },
    {
      label:"With in 30 Minutes"
    },
    {
      label:"With in 45 Minutes"
    },
  ]

  selectedTime:any
  selectTime(data) {
    this.selectedTime = data
  }
  foodsPrice :any
  beveragePrice: any;
  totalPrice = []
  cateringFood = []
  getFoods = []
  navigatetoThanksPage() {

    let beverage = localStorage.getItem('Beverages');
    let getBeverages = JSON.parse(beverage);
    let caterBeverage = getBeverages?.cateringBeverages

    this.beveragePrice = getBeverages?.totalPrice;
    if(this.beveragePrice !== undefined) {
    this.totalPrice.push(getBeverages?.totalPrice);
    }

    let food = localStorage.getItem('food');
    this.getFoods = JSON.parse(food);
    if(food !== null) {
      this.getFoods.forEach(element => {
      this.foodsPrice = element.price;
      this.totalPrice.push(this.foodsPrice)
    });
}
    const initialValue = 0;
    let totalSum = this.totalPrice.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      initialValue
      );

    let obj = {refreshmentData: {
        cateringBeverages: caterBeverage,
        cateringFood: this.getFoods,
        totalPrice: totalSum,
        duration: this.selectedTime
    }}
    let id = this.visitorId

    this.cafeteriaService.postOrderedItems(id,obj).subscribe(res =>{
      if(!res.error) {
        this.toastr.success(res.message);
        if(localStorage.getItem('Beverages')){
          localStorage.removeItem('Beverages');
        }
        if(localStorage.getItem('food')){
        localStorage.removeItem('food');
        }
      }
      this.navController.navigateRoot(['/cafeteria/thankyou']);
    }, err=>{ {
      if(localStorage.getItem('Beverages')){
        localStorage.removeItem('Beverages');
      }
      if(localStorage.getItem('food')){
      localStorage.removeItem('food');
      }
        this.toastr.error(err.error.message)
      }
    })

  }
}
