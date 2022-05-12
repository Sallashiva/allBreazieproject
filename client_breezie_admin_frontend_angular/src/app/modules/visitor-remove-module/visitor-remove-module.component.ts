import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitorsComponent } from 'src/app/breezie-dashboard/visitors/visitors.component';
import { VisitorService } from 'src/app/services/visitor.service';

@Component({
  selector: 'app-visitor-remove-module',
  templateUrl: './visitor-remove-module.component.html',
  styleUrls: ['./visitor-remove-module.component.css']
})
export class VisitorRemoveModuleComponent implements OnInit {
  rejectForm:FormGroup
  constructor(private fb:FormBuilder,private visitorService:VisitorService,@Inject(MAT_DIALOG_DATA) public editData:any ,
  private dialogRef:MatDialogRef<VisitorRemoveModuleComponent>,) {
    this.rejectForm = this.fb.group({
      approval:new FormControl(''),
      finalDate:new FormControl('')

    })
   }

  ngOnInit(): void {
  }

  onSubmit(){

  }
  rejectButton(){
    let date = new Date();
    this.rejectForm.get('approval').setValue(false)
    this.rejectForm.get('finalDate').setValue(date)
    
    this.visitorService.checkApprovel(this.editData._id,this.rejectForm.value).subscribe(res => {
      
      if(!res.error){
        this.dialogRef.close(true)
      }
    })
  } 
  }



