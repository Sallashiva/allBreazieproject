import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  modal:boolean=false;
  constructor(private fb:FormBuilder,private ContactService:ContactService, private toastr:ToastrService) { 
    this.contactForm=this.fb.group({
      name:new FormControl('',[Validators.required,Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]),
      email:new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/), Validators.email]),
      phone:new FormControl('',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      message:new FormControl('',[Validators.required])
    })
   
  }

  ngOnInit(): void {
  }
  contactSubmit(){
    this.modal=true;
     this.ContactService.contactDetails(this.contactForm.value).subscribe((res)=>{
       if(!res.error){
       }else{
         this.toastr.error("kjhvcxzcv");
       }
     }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    }); 
  }
}
