import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitorsComponent } from 'src/app/breezie-dashboard/visitors/visitors.component';
import { VisitorService } from 'src/app/services/visitor.service';

@Component({
  selector: 'app-visitor-approval-module',
  templateUrl: './visitor-approval-module.component.html',
  styleUrls: ['./visitor-approval-module.component.css']
})
export class VisitorApprovalModuleComponent implements OnInit {

  
  approvelForm:FormGroup
  constructor(private fb:FormBuilder,private visitorService:VisitorService , 
    @Inject(MAT_DIALOG_DATA) public editData:any ,
  private dialogRef:MatDialogRef<VisitorApprovalModuleComponent>) {
    this.approvelForm=this.fb.group({
      approval:new FormControl(''),
      finalDate:new FormControl('')
    })
    
   }


  ngOnInit(): void {
  }
  onSubmit(){

  }

  

  onApprove(){
    
    let date = new Date();
    this.approvelForm.get('approval').setValue(true)
    this.approvelForm.get('finalDate').setValue(date)
    this.dialogRef.close(true)

    this.visitorService.checkApprovel(this.editData._id,this.approvelForm.value).subscribe(res => {
      
      if(!res.error){
        this.dialogRef.close(true)
      }
    })
  }

}
