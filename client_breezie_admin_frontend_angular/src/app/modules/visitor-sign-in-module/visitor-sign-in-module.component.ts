import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VisitorsComponent } from 'src/app/breezie-dashboard/visitors/visitors.component';
import { VisitorService } from 'src/app/services/visitor.service';

@Component({
  selector: 'app-visitor-sign-in-module',
  templateUrl: './visitor-sign-in-module.component.html',
  styleUrls: ['./visitor-sign-in-module.component.css']
})
export class VisitorSignInModuleComponent implements OnInit {

  signInForm:FormGroup
  constructor(private fb:FormBuilder,
    private visitorService: VisitorService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData:any ,
    private dialogRef:MatDialogRef<VisitorsComponent>,
    ) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      finalDate:['']
    })
   
  }
  
  onSubmit() {
    const date = new Date().toString()
    this.signInForm.get('finalDate').setValue(date);
    
    this.visitorService.signInVisitors(this.editData._id,this.signInForm.value).subscribe(res => {
      if(!res.error){
        this.dialogRef.close(true)
      }
    })
    // this.dialogRef.close(false);
  }

}
