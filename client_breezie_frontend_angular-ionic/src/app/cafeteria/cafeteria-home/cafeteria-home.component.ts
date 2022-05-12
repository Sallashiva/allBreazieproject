import {Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CafeteriaResponse } from '../model/cafeteriaresponce';
import { RefreshmentService } from '../refreshment.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ModalPage } from 'src/app/modal/modal.page';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/register/register.service';
import { CafetrriaServiceService } from '../cafetrria-service.service';
@Component({
  selector: 'app-cafeteria-home',
  templateUrl: './cafeteria-home.component.html',
  styleUrls: ['./cafeteria-home.component.scss'],
})


export class CafeteriaHomeComponent implements OnInit {
  Cafeteriarefreshments: CafeteriaResponse[] = [];
  @ViewChild('Coffee') coffee: ElementRef;
  @ViewChild('Tea') tea: ElementRef;
  @ViewChild('Water') water: ElementRef;

  isCoffee: boolean = false;
  isTea: boolean = false;
  isWater: boolean = false;
  addOnValue = 'Hello';
  RefreshmentForm: FormGroup;
  visitorId;
  selectedDay: [];
  selectedCategory = [];
  btnDisabled: boolean = true;
  continueDisabled: boolean = true;
  skipDisabled: boolean = false;
  path: string;
  subscription: Subscription;
  spinner: boolean = true;


  constructor(
    private refreshment: RefreshmentService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private navController: NavController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private renderer: Renderer2,
    private registerService: RegisterService,
    private cafeteriaService: CafetrriaServiceService
  ) {}

  ngOnInit() {
    this.registerService.changeVisitorId()
    this.subscription = this.registerService.currentVisitorId.subscribe(email => {
      this.visitorId = email;
    });
    this.RefreshmentForm = this.fb.group({
      refreshmentData: ['', Validators.required],
    });
    this.path = `/cafeteria`;
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack(this.path);
    });
    this.getBeverage();
    this.getFoodsData();
  }

  foods:any
   getFoodsData() {
     this.cafeteriaService.getFoods().subscribe(res=>{
       this.foods = res.catering;
     })
   }

  beverages:any
   getBeverage() {
     this.spinner = true;
     this.cafeteriaService.getBeverages().subscribe(res=>{
       this.spinner = false;
       this.beverages = res.catering;
     })
   }

  goToThankYou() {
    this.navController.navigateRoot(['cafeteria/foods']);
    this.continueDisabled = !this.continueDisabled
  }

  coffeeAddon: any
  coffeeBtn = false
  selectChangeHandlerCoffee(event: any) {
    this.coffeeAddon = event.target.value;
    let coffee = {
      Category: 'Coffee',
      addOn: this.coffeeAddon,
    };
    if (this.selectedCategory.length <= 0) {
      this.selectedCategory.push(coffee);
      this.coffeeBtn = true
    } else if (this.selectedCategory.length > 0) {
      for (let i = 0; i < this.selectedCategory.length; i++) {
        if (this.selectedCategory[i].Category === 'Coffee') {
          this.selectedCategory.splice(i, 1, coffee);
          this.coffeeBtn = true
        } else {
          if (this.selectedCategory[i].Category != 'Coffee') {
            this.selectedCategory.push(coffee);
            this.coffeeBtn = true
          }
        }
      }
    }
    this.renderer.addClass(this.coffee.nativeElement, "selected");
    this.btnDisabled = false;
    if (this.coffeeAddon === "Cancel Order") {
      this.coffeeBtn = false
      this.renderer.removeClass(this.coffee.nativeElement, "selected")
    }
    if ((this.waterAddon == undefined || this.waterAddon == "Cancel Order") && (this.teaAddon == "Cancel Order" || this.teaAddon == undefined) && (this.coffeeAddon == undefined || this.coffeeAddon == "Cancel Order")) {
      this.btnDisabled = true;
    } else if (this.teaAddon !== "Cancel Order" || this.teaAddon != undefined || this.waterAddon != "Cancel Order" || this.waterAddon != undefined || this.coffeeAddon != "Cancel Order" || this.coffeeAddon != undefined) {
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
  }
  teaAddon: any
  teaBtn = false
  selectChangeHandlerTea(event: any) {
    this.teaAddon = event.target.value;
    let Tea = {
      Category: 'Tea',
      addOn: this.teaAddon,
    };
    if (this.selectedCategory.length <= 0) {
      this.selectedCategory.push(Tea);
      this.teaBtn = true;
    } else if (this.selectedCategory.length > 0) {
      for (let i = 0; i < this.selectedCategory.length; i++) {
        if (this.selectedCategory[i].Category === 'Tea') {
          this.selectedCategory.splice(i, 1, Tea);
          this.teaBtn = true;
        } else {
          if (this.selectedCategory[i].Category != 'Tea')
            this.selectedCategory.push(Tea);
          this.teaBtn = true;
        }
      }
    }
    this.renderer.addClass(this.tea.nativeElement, "selected");
    this.btnDisabled = false;
    if (this.teaAddon == "Cancel Order") {
      this.teaBtn = false;
      this.renderer.removeClass(this.tea.nativeElement, "selected")
    }
    if ((this.waterAddon == undefined || this.waterAddon == "Cancel Order") && (this.teaAddon == "Cancel Order" || this.teaAddon == undefined) && (this.coffeeAddon == undefined || this.coffeeAddon == "Cancel Order")) {
      this.btnDisabled = true;
    } else if (this.teaAddon !== "Cancel Order" || this.teaAddon != undefined || this.waterAddon != "Cancel Order" || this.waterAddon != undefined || this.coffeeAddon != "Cancel Order" || this.coffeeAddon != undefined) {
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
  }

  waterAddon: any
  waterBtn = false;
  selectChangeHandlerWater(event: any) {
    this.waterAddon = event.target.value;
    let water = {
      Category: 'Water',
      addOn: this.waterAddon,
    };
    if (this.selectedCategory.length <= 0) {
      this.selectedCategory.push(water);
      this.waterBtn = true;
    } else if (this.selectedCategory.length > 0) {
      for (let i = 0; i < this.selectedCategory.length; i++) {
        if (this.selectedCategory[i].Category === 'Water') {
          this.selectedCategory.splice(i, 1, water);
          this.waterBtn = true;
        } else {
          this.selectedCategory.push(water);
          this.waterBtn = true;
        }
      }
    }
    this.renderer.addClass(this.water.nativeElement, "selected");
    this.btnDisabled = false;
    if (this.waterAddon == "Cancel Order") {
      this.renderer.removeClass(this.water.nativeElement, "selected");
      this.waterBtn = false;
    }
    if ((this.waterAddon == undefined || this.waterAddon == "Cancel Order") && (this.teaAddon == "Cancel Order" || this.teaAddon == undefined) && (this.coffeeAddon == undefined || this.coffeeAddon == "Cancel Order")) {
      this.btnDisabled = true;
    } else if (this.teaAddon != "Cancel Order" || this.teaAddon != undefined || this.waterAddon != "Cancel Order" || this.waterAddon != undefined || this.coffeeAddon != "Cancel Order" || this.coffeeAddon != undefined) {
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
  }

  notifyCafe() {
    const seen = new Set();
    const filteredArr = this.selectedCategory.filter((el, i) => {
      const duplicate = seen.has(el.Category);
      seen.add(el.Category);
      return !duplicate;
    });
    filteredArr.forEach((ele, i) => {
      if (ele.addOn === "Cancel Order") {
        filteredArr.splice(i, 1)
      }
    })
    this.RefreshmentForm.patchValue({
      refreshmentData: filteredArr
    });
    this.refreshment.notifyCafe(this.visitorId, this.RefreshmentForm.value).subscribe(res => {
      if (!res.error) {
        this.navController.navigateRoot(['cafeteria/thankyou']);
      } else {
        this.toastr.error("Something went wrong")
      }
    })
    this.selectedCategory = [];
  }
  onClickedOutside(e: Event) {
    this.isCoffee = false;
  }

  normalCoffee() {
    this.isCoffee = !this.isCoffee;
    this.isTea = false;
    this.isWater = false;
  }

  onClickedOutsideTea(e: Event) {
    this.isTea = false;
  }

  normalTea() {
    this.isCoffee = false;
    this.isTea = !this.isTea;
    this.isWater = false;

  }
  onClickedOutsideWater(e: Event) {
    this.isWater = false;
  }

  normalWater() {
    this.isCoffee = false;
    this.isTea = false;
    this.isWater = !this.isWater;
  }

  qrCodeOpen() {
    this.modalCtrl
      .create({
        component: ModalPage,
        backdropDismiss: false,
      })
      .then((modalres) => {
        modalres.present();
      });
  }
  itemsArray=[]
  finalData = []
  select:boolean = false;
  onClickSelect(food,index) {
    this.itemsArray.push(food);
    this.beverages[index].select = true
    if(this.itemsArray.length > 0) {
      this.continueDisabled = false;
      this.skipDisabled = true;
    }
  }

  onClickSelected(food,index){
    this.itemsArray.forEach((item, index) => {
      if (item===food) {
        this.itemsArray.splice(index, 1)
      }
    })
    this.beverages[index].select = false;
    if(this.itemsArray.length == 0) {
      this.continueDisabled = true;
      this.skipDisabled = false;
    }
  }

  stringData:any
  itemsPrice:any
  selectFood = [];
  selectedFoodPrice = []
  totalSum:any;

  navigatetoFoodPage() {
    this.itemsArray.forEach((ele,i) =>{
      this.stringData = ele.bevergesName
      this.itemsPrice = ele.price
      this.selectFood.push(this.stringData);
      this.selectedFoodPrice.push(this.itemsPrice);
    })
    const initialValue = 0;
    this.totalSum = this.selectedFoodPrice.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      initialValue
    );
    let transferData = {
      cateringBeverages:this.selectFood,
      totalPrice:this.totalSum
    }

    // this.cafeteriaService.setData(transferData);
    localStorage.setItem('Beverages',JSON.stringify(transferData));
    if( this.foods.length > 0 ) {
    this.navController.navigateRoot(['/cafeteria/foods']);
    } else {
      this.navController.navigateRoot(['/cafeteria/duration']);
    }
  }


}
