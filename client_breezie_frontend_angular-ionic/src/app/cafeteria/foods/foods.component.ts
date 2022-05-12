import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { CafetrriaServiceService } from '../cafetrria-service.service';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.scss'],
})
export class FoodsComponent implements OnInit {
  path: string;
  spinner: boolean = true;
  skipDisabled: boolean = false;

  constructor(  private navController: NavController,
                private platform: Platform,
                private cafeteriaService: CafetrriaServiceService ) { }

  ngOnInit() {
    this.getBeverage();
    // this.getBeveragesData();
    this.path = `cafeteria/cafeteria-item`;
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack(this.path);
    });
  }

  // foodsData:any
  // foodsDataAll:any
  // getBeveragesData() {
  //   this.spinner = true;
  //   this.cafeteriaService.serviceData.subscribe(res => {
  //     this.spinner = false;
  //     this.foodsData = res;
  //    this.foodsDataAll = this.foodsData.cateringBeverages

  //   })
  // }

  beverages:any
   getBeverage() {
     this.cafeteriaService.getFoods().subscribe(res=>{
       this.spinner = false
       this.beverages = res.catering;
     })
   }

   selectedFoodItems = [];
   btnDisabled: boolean = true;

   selectFood(food,index) {
    this.selectedFoodItems.push(food);
    this.beverages[index].select = true;
    if(this.selectedFoodItems.length > 0) {
      this.btnDisabled = false;
      this.skipDisabled = true;

    }
   }

  selectedFood(food,index) {
    if(this.selectedFoodItems.length !== 0 ) {
    this.selectedFoodItems.forEach((item,index)=>{
      if(item === food) {
        this.selectedFoodItems.splice(index,1)
      }
    })
  }
    this.beverages[index].select = false;
    if(this.selectedFoodItems.length == 0) {
      this.btnDisabled = true;
      this.skipDisabled = false;
    }
  }

  goToThankYou() {
    let beverage = localStorage.getItem('Beverages');
    let beverageData = JSON.parse(beverage)
    let checkLength = beverageData?.cateringBeverages
    if(checkLength) {
    if(checkLength.length > 0 ) {
      this.btnDisabled = false;
      this.navController.navigateRoot(['cafeteria/duration']);
    } else {
      this.navController.navigateRoot(['cafeteria/thankyou']);
    }
  } else {
    this.navController.navigateRoot(['cafeteria/thankyou']);
  }
  }

  stringData:any
  foodPrice:any
  foodsDataArray = []
  foodPricesData = []
  totalSum:any
navigatetoDurationPage() {
  if(this.selectedFoodItems.length !== 0) {
  this.selectedFoodItems.forEach(ele=>{
    let obj = {
      name:ele.foodName,
      notes:ele.notes,
      price:ele.price
    }
    this.foodPrice = ele.price
    this.foodsDataArray.push(obj)
    this.foodPricesData.push(this.foodPrice)
  })
}
    localStorage.setItem('food',JSON.stringify(this.foodsDataArray));
    this.navController.navigateRoot(['/cafeteria/duration']);
  }
}
