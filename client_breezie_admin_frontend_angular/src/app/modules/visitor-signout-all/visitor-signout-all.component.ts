import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { VisitorsComponent } from 'src/app/breezie-dashboard/visitors/visitors.component';
import { VisitorResponse } from 'src/app/models/visitor';
import { VisitorService } from 'src/app/services/visitor.service';

@Component({
  selector: 'app-visitor-signout-all',
  templateUrl: './visitor-signout-all.component.html',
  styleUrls: ['./visitor-signout-all.component.css']
})
export class VisitorSignoutAllComponent implements OnInit {

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
    ) { }

  ngOnInit(): void {
    this.signOutForm = this.fb.group({
      finalDate:['']
    })
   
  }

  
  // userId
  data:any
  checkBoxdataSignOut :any
  onSubmit() {
    this.dialogRef.close(true) 
  }

  // if (result) {
  //   this.checkBoxdataAnonymize.forEach(ele => {
  //     this.data.push(ele._id);
  //     let nonDuplicateCheckBoxValueEmployee = [...new Set(this.data)];
  //     this.visitorService.SignOutAllVisitor(nonDuplicateCheckBoxValueEmployee).subscribe(res => {
  //       this.getAllVisitors();
  //     })
  //   })
  // }
  

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
