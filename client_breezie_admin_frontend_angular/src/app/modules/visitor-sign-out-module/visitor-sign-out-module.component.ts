import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { VisitorsComponent } from 'src/app/breezie-dashboard/visitors/visitors.component';
import { VisitorResponse } from 'src/app/models/visitor';
import { VisitorService } from 'src/app/services/visitor.service';

@Component({
  selector: 'app-visitor-sign-out-module',
  templateUrl: './visitor-sign-out-module.component.html',
  styleUrls: ['./visitor-sign-out-module.component.css']
})
export class VisitorSignOutModuleComponent implements OnInit {
  signOutForm:FormGroup
  spinner: boolean = true;
  table: boolean = false;
  apiaResponse: any = [];
  uniqueArr: any = []
  visitors: VisitorResponse[]
  dataSource = new MatTableDataSource([])
  paginator: any;
  sort: any;
  constructor(private fb:FormBuilder,
    private visitorService: VisitorService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData:any ,
    private dialogRef:MatDialogRef<VisitorsComponent>,
    ) {
      
     }

    visitorName
  ngOnInit(): void {
    this.signOutForm = this.fb.group({
      finalDate:['']
    })
    this.visitorName=this.editData.FullName
  }

  signOutId: string
  signOutvisitor(id) {
    this.signOutId = id
    
  }

  onSubmit() {
    const date = new Date().toString()
    this.signOutForm.get('finalDate').setValue(date);
    if (this.editData.visitorId) {
      this.visitorService.signOutVisitors(this.editData.visitorId,this.signOutForm.value).subscribe(res => {
        
        if(!res.error){
          this.dialogRef.close(true)
        }
      })
    } else {
      
      this.visitorService.signOutVisitors(this.editData._id,this.signOutForm.value).subscribe(res => {
        
        if(!res.error){
          this.getAllVisitors()
          this.dialogRef.close(true)
        }
      })
    }
    // this.dialogRef.close(false);
  }


  getAllVisitors() {
    var start = 'All'
    var end = 'All'
    this.visitorService.getVisitor(start, end).subscribe(res => {
      this.apiaResponse = res.visitorArray
      this.spinner = false
      this.table = true;
      this.visitors = res.visitorArray;
      this.visitors.forEach((ele, i) => {
        ele.SlNo = i + 1
      })
      this.dataSource = new MatTableDataSource([
        ...res.visitorArray
      ]);
      // this.selection = new SelectionModel([
      //   ...res.visitorData
      // ])
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }

}
