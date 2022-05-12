import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitorSignOutModuleComponent } from '../visitor-sign-out-module/visitor-sign-out-module.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { VistorService } from '../vistor.service';
import { VisitorResponse } from './visitor-response';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-visitor-logout',
  templateUrl: './visitor-logout.page.html',
  styleUrls: ['./visitor-logout.page.scss'],
})



export class VisitorLogoutPage implements OnInit {



  spinner = true;
  url: string = "home"

  anonymizeForm: FormGroup;
  signOutForm: FormGroup;
  // spinner: boolean = true;
  table: boolean = false;
  apiaResponse: any = [];
  uniqueArr: any = []
  customStartDate: any
  customEndDate: any
  @ViewChild(MatSort) sort: MatSort
  @ViewChild('paginator') paginator!: MatPaginator;
  obj1: any
  checkBoxId: any = [];
  loactaionDetails: any;
  archiveSelected=false;
  disabledbutton=false;
  fileName = 'visitorExcelSheet.xlsx';
  visitors: VisitorResponse[]
  displayedColumns: string[] = ['SlNO', 'Visitor',  'Visit',  'SignOut'];
  dataSource = new MatTableDataSource([])
  selection = new SelectionModel<VisitorResponse>(true, []);
  constructor(
    public dialog: MatDialog,
    public dialogss: MatDialog,
    private visitorService: VistorService,
    private navController: NavController,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    // @Inject(MAT_DIALOG_DATA) public editData:any ,
  ) { }



  ngOnInit(): void {
    this.anonymizeForm = this.fb.group({
      delete: ['', Validators.required],
    }),
      this.signOutForm = this.fb.group({
        finalDate: ['']
      })

    this.getAllVisitors();
    // this.onDelete();
    this.dataSource.sort = this.sort;

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort
  }








  openSignOutVisitor(row:any){
    const date = new Date().toString()
    this.signOutForm.get('finalDate').setValue(date);
    this.visitorService.signOutVisitors(row,this.signOutForm.value).subscribe(res => {
      if(!res.error){
        this.navController.navigateRoot(['cafeteria/thankyou']);
      }
    })
    // const dialogRef = this.dialog.open(VisitorSignOutModuleComponent, {
    //   maxWidth: '25vw',
    //   width: '100%',
    //   disableClose:true,
    //   data:row
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 'signOut') {
    //     this.getAllVisitors();
    //   }
    // });
  }



  // openSignOutVisitorModel(){
  //   const dialogRef = this.dialog.open(VisitorSignOutModuleComponent, {
  //     maxWidth: '25vw',
  //     width: '100%',
  //     disableClose:true,
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 'signOuts') {
  //       this.getAllVisitors();
  //     }
  //   });
  // }



  // selection = new SelectionModel ();

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  OnDateStartChange(event) {
    this.customStartDate = event
  }
  OnDatEndChange(event) {
    this.customEndDate = event
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  signin() {
    
  }

  checkboxLabel(row?: VisitorResponse): string {
    if (!row) {
      return `${this.isAllSelected()? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row)? 'deselect' : 'select'} row ${row.fullName + 1}`;
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
        ... res.visitorArray
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




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCheckboxValuesAll(ev, data) {
    this.checkBoxId = [];
    data.forEach(ele => {
      if (ev.checked) {
        this.checkBoxId.push(ele);
      } else {
        this.checkBoxId = []
      }
    });
  }

  checkboxValuesRow(ev, data) {
    if (ev.checked) {
      this.archiveSelected=true;
      this.disabledbutton=false
      this.checkBoxId.push(data);
    } else {
      this.archiveSelected=false;
      this.disabledbutton=true
      let removeIndex = this.checkBoxId.findIndex(itm => itm === data);
      if (removeIndex !== -1)
        this.checkBoxId.splice(removeIndex, 1);
    }
  }



  signOutId: string
  signOutvisitor(id) {
    this.signOutId = id
  }

  // confirmSignOut() {
  //   const date = new Date().toString()
  //   this.signOutForm.get('finalDate').setValue(date);
  //   this.visitorService.signOutVisitors(this.signOutId, this.signOutForm.value).subscribe(res => {
  //     this.getAllVisitors();
  //   })
  // }



  onDelete() {
    //   this.visitorService.deletevisitor(localStorage.getItem('dataBaseID')).subscribe(res => {
    // })
  }


}
