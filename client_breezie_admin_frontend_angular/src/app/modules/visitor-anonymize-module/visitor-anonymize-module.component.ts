import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VisitorsComponent } from 'src/app/breezie-dashboard/visitors/visitors.component';
import { VisitorResponse } from 'src/app/models/visitor';
import { VisitorService } from 'src/app/services/visitor.service';

@Component({
  selector: 'app-visitor-anonymize-module',
  templateUrl: './visitor-anonymize-module.component.html',
  styleUrls: ['./visitor-anonymize-module.component.css']
})
export class VisitorAnonymizeModuleComponent implements OnInit {
  employeeForm:FormGroup
  apiaResponse: any = [];
  visitors: VisitorResponse[];
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogss: MatDialog,
    private visitorService: VisitorService,
    private toastr: ToastrService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public editData:any,
    private dialogRef:MatDialogRef<VisitorsComponent>) { }

  ngOnInit( ): void {
    this.employeeForm = this.fb.group({
      delete: ['', [Validators.required,Validators.pattern('^(DELETE)$')]],
    })
    // this.getAllVisitors()
  }

  TotalVisitor: number = 0
  visitor = []

  anonymize(){
    this.dialogRef.close(true);
  }

  
  addEmployee(){

  }

  // getAllVisitors() {
  //   var start = 'All'
  //   var end = 'All'
  //   this.visitorService.getVisitor(start, end).subscribe(res => {
  //     this.apiaResponse = res.visitorArray
  //     this.visitors = res.visitorArray;
  //     this.visitor = res.visitorArray;
  //     this.TotalVisitor = res.visitorArray.length
  //     this.visitors.forEach((ele, i) => {
  //       ele.SlNo = i + 1
  //     })
  //     this.visitor.forEach((ele, i) => {
  //       if (ele.isAnonymized) {
  //         ele.FullName = "Anonymized Visitor"
  //         ele.CompanyName = ""
  //       }
  //     })
      
      
  //   }, err => {
  //     if (err.status) {
  //       this.toastr.error(err.error.message);
  //     } else {
  //       this.toastr.error("CONNECTION_ERROR");
  //     }
  //   });
  // }
}
