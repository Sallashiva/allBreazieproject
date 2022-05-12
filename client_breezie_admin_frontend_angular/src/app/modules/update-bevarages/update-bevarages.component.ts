import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SettingVisitorService } from 'src/app/services/setting-visitor.service';

@Component({
  selector: 'app-update-bevarages',
  templateUrl: './update-bevarages.component.html',
  styleUrls: ['./update-bevarages.component.css']
})
export class UpdateBevaragesComponent implements OnInit {
  updateBevaragesForm:FormGroup
  constructor(private fb:FormBuilder,
    private toastr: ToastrService,
    private bevarageService: SettingVisitorService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<UpdateBevaragesComponent>) {
    this.updateBevaragesForm=this.fb.group({
      bevergesName:new FormControl('',[Validators.required,Validators.maxLength(50)]),
      price:new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10)]),
      imagePath:new FormControl('',Validators.required)
    })
    if (this.editData) {
      this.updateBevaragesForm.controls['bevergesName'].setValue(this.editData.bevergesName);
      this.updateBevaragesForm.controls['price'].setValue(this.editData.price);
      this.updateBevaragesForm.controls['imagePath'].setValue(this.editData.imagePath);
    }
   }

  ngOnInit(): void {
  }
  urls: any = [];
  file;
  onselect(event) {
    this.file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.urls.push(reader.result as string);
    };
    reader.readAsDataURL(this.file);
    this.updateBevaragesForm.get('imagePath').setValue(this.file);

  }
  updateBevarages(){
    this.bevarageService.updateBevaragesmenu(this.editData._id,this.updateBevaragesForm.value.bevergesName,
      this.updateBevaragesForm.value.price,this.file)
      .subscribe((res) => {
        if (!res.error) {
          this.toastr.success(res.message);
          this.dialogRef.close('update');
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
}
