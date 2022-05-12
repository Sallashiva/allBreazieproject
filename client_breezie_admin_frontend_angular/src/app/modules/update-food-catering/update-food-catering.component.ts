import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SettingVisitorService } from 'src/app/services/setting-visitor.service';

@Component({
  selector: 'app-update-food-catering',
  templateUrl: './update-food-catering.component.html',
  styleUrls: ['./update-food-catering.component.css']
})
export class UpdateFoodCateringComponent implements OnInit {
  updateFoodForm: FormGroup
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private bevarageService: SettingVisitorService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<UpdateFoodCateringComponent>) {
    this.updateFoodForm = this.fb.group({
      foodName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-z]+([\s][a-zA-Z]+)*$/), Validators.maxLength(50)]),
      price: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      notes: new FormControl('', [Validators.maxLength(50)]),
      imagePath: new FormControl('', Validators.required)
    })
    if (this.editData) {
      this.updateFoodForm.controls['foodName'].setValue(this.editData.foodName);
      this.updateFoodForm.controls['price'].setValue(this.editData.price);
      this.updateFoodForm.controls['notes'].setValue(this.editData.notes);
      this.updateFoodForm.controls['imagePath'].setValue(this.editData.imagePath);
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
    this.updateFoodForm.get('imagePath').setValue(this.file);

  }
  updateFood() {
    this.bevarageService.updateFoodmenu(this.editData._id, this.updateFoodForm.value.foodName, this.updateFoodForm.value.price, this.file, this.updateFoodForm.value.notes)
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
