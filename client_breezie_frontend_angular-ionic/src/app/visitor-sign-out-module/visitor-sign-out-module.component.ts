import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NavController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { VisitorLogoutPage } from '../visitor-logout/visitor-logout.page';
import { VisitorResponse } from '../visitor-logout/visitor-response';
import { VistorService } from '../vistor.service';

@Component({
  selector: 'app-visitor-sign-out-module',
  templateUrl: './visitor-sign-out-module.component.html',
  styleUrls: ['./visitor-sign-out-module.component.scss'],
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
  constructor(
    private fb:FormBuilder,
    private visitorService: VistorService,
    private navController: NavController,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData:any ,
    private dialogRef:MatDialogRef<VisitorLogoutPage>,
    ) { }

  ngOnInit(): void {
    this.signOutForm = this.fb.group({
      finalDate:['']
    })
  }

  signOutId: string
  signOutvisitor(id) {
    this.signOutId = id
  }
  cancle() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    const date = new Date().toString()
    this.signOutForm.get('finalDate').setValue(date);
    this.visitorService.signOutVisitors(this.editData,this.signOutForm.value).subscribe(res => {
      if(!res.error){
        this.dialogRef.close('signOut')
        this.navController.navigateRoot(['empsignout-thanks']);
      }
    })
  }


  getAllVisitors() {
    this.visitorService.getAllVisitors().subscribe(res => {
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
