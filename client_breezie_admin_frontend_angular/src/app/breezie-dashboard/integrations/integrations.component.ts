import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VisitorService } from 'src/app/services/visitor.service';
declare var Razorpay: any; 
@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.css']
})
export class IntegrationsComponent implements OnInit {
  integrationForm:FormGroup
  id;
  customCard = '';
  outletDetail;
  payment_creation_id=null;
  spinner:boolean=true;
  obj = {
    reciepient_name: '',
    reciepient_email: '',
    your_name: '',
    your_email: '',
    radioValue: 500,
    couponCount: 1,
    radioValueCustom: ''
  };

  constructor(
    private fb:FormBuilder,
    private apiService: VisitorService  
  ) { }
 
  ngOnInit(): void {
    this.integrationForm= this.fb.group({
      employee: [''],
     adminRole:['']
  })
  }
  onSubmit(){
  }
  razorPayOptions = {
    "key": '', // Enter the Key ID generated from the Dashboard
    "amount": '', // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
    "currency": "INR",
    "name": "Favouright",
    "description": "favouright bill payment",
    "order_id":"ORDERID_FROM_BACKEND",
    "image": "https://example.com/your_logo",
    "handler": function (response) {
    },
    "notes": {
        "address": "Thank you for saving people in need"
    },
    "theme": {
        "color": "#8bf7a8"
    },
    // http_post:this.apiService
};

Procedure() {
  // this.obj.radioValue = ( this.obj.radioValue - ((this.obj.radioValue/100)*10) )
  // if(this.obj.radioValueCustom != ''){
  //  let radioCustom =  +this.obj.radioValueCustom;
  //  this.obj.radioValue = ( radioCustom- ((radioCustom/100)*10) )
  // }
this.spinner=true;
  let finalObject = {
    "user_id":"5e7a6fcd3cd6e61c5059ca62",
    "business_id":"this.outletDetail._id",
    "amount": 500,
    "recipient_name":"Harshith",
    "recipient_email":"harshichin@gmail.com",
    "user_email":"harshichin@gmail.com",
    "user_name":"Harshi",
    "plan":{
      "planId":"plan-enterprise"
    }
  }


  this.apiService.http_post(finalObject)
  .subscribe((response) => {
    this.spinner=false;
    let res= response
    let payload = res.payload;
    // let payload = res

      this.razorPayOptions.key = res.key;
      this.razorPayOptions.order_id = res.id
      this.razorPayOptions.amount =  res.amount
      this.razorPayOptions.handler =  this.razorPayResponseHandler;
      // this.payment_creation_id = payload["dbRes"]["_id"];
      // finalObject["_id"] =payload["dbRes"]["_id"]
      sessionStorage.setItem("temp",JSON.stringify(finalObject))


    var rzp1 = new Razorpay(this.razorPayOptions);
    rzp1.open();

    
  }, (error) => {
    this.spinner=false;
  });


}



// call(event: MatRadioChange){
//   let result = +event.value
//   this.discounted_value = ( result - ((result/100)*this.outletDetail.discount))
//   if(this.obj.radioValueCustom != ''){
//   
//   }
//  }

//  apply(event: any) {
//   let result = event.target.value;
//   this.discounted_value = ( result - ((result/100)*this.outletDetail.discount))
//  }


razorPayResponseHandler(response){
  this.spinner=false;
  let storage_data =sessionStorage.getItem('temp') 
  let sess =  JSON.parse(storage_data);
  let paymentObject= {
    _id:sess._id,
    payment:response,
    user_name:sess.user_email,
    amount: sess.amount,
    recipient_email:sess.recipient_email,
    user_email:sess.user_name,
  }
  this.apiService.payment(paymentObject)
  // BuyGiftCardComponent.API_SERVICE.http_put(CommonURL.URL_PURCHASE_GIFT_CARD_SUCCESS,paymentObject).subscribe(success=>{
  //   alert("payment success send to success page");
  //   sessionStorage.removeItem('temp');
  //  },error=>{
  //   BuyGiftCardComponent.API_SERVICE.http_delete(CommonURL.URL_PURCHASE_GIFT_CARD_ERROR,{_id:paymentObject._id}).subscribe(success_delete=>{
      
  //   },error=>{
  //   })
  //  })
 }
}
