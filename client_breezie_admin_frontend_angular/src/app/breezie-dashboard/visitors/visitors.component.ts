import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { VisitorDialogComponent } from '../visitor-dialog/visitor-dialog.component'
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { VisitorService } from 'src/app/services/visitor.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VisitorResponse } from 'src/app/models/visitor';
import { MatPaginator } from '@angular/material/paginator';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VisitorUpdatediologComponent } from '../visitor-updatediolog/visitor-updatediolog.component';
import * as XLSX from 'xlsx';
import { VisitorAnonymizeModuleComponent } from 'src/app/modules/visitor-anonymize-module/visitor-anonymize-module.component';
import { VisitorSignOutModuleComponent } from 'src/app/modules/visitor-sign-out-module/visitor-sign-out-module.component';
import { VisitorApprovalModuleComponent } from 'src/app/modules/visitor-approval-module/visitor-approval-module.component';
import { VisitorRemoveModuleComponent } from 'src/app/modules/visitor-remove-module/visitor-remove-module.component';
import { I } from '@angular/cdk/keycodes';
import { VisitorSignoutAllComponent } from 'src/app/modules/visitor-signout-all/visitor-signout-all.component';
import { VisitorSignInModuleComponent } from 'src/app/modules/visitor-sign-in-module/visitor-sign-in-module.component';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})
export class VisitorsComponent implements OnInit, AfterViewInit {

  anonymizeForm: FormGroup;
  signOutForm: FormGroup;
  guests: boolean = true;
  pendings: boolean = false;
  remembers: boolean = false;
  spinner: boolean = true;
  table: boolean = false;
  exportSelected = false;
  disabledbutton = true;
  apiaResponse: any = [];
  uniqueArr: any = []
  checkBoxdataTimeline: any = [];
  disabledButtonTimeline = true;
  exportFiltered = false
  contractTrace = false
  customStartDate: any
  customEndDate: any
  today1 = new Date();
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginatorPending') paginatorPendings!: MatPaginator;
  @ViewChild('paginatorRemembered') paginatorRemembered!: MatPaginator;


  @ViewChild(MatSort) sort: MatSort;



  obj1: any
  checkBoxId: any = [];
  loactaionDetails: any;
  archiveSelected = false;
  archivePendingSelected = false
  exportPendingSelected = false
  signOutSelected = false
  // disabledbutton=false;
  fileName = 'visitorExcelSheet.xlsx';
  visitors: VisitorResponse[]
  pendingVisitors: VisitorResponse[]
  rememberedVisitors: VisitorResponse[]

  displayedColumns: string[] = ['select', 'image', 'FullName', 'Host', 'Visit', 'Location', 'CustomField', 'SignOut'];
  displayedColumns2: string[] = ['SlNo', 'image', 'FullName', 'Location', 'CustomField', 'accept'];
  displayedColumns3: string[] = [ 'FullName', 'Host', 'Visit', 'Location', 'CustomField', 'SignOut'];
  dataSource = new MatTableDataSource([])
  pendingDataSource = new MatTableDataSource([]);
  rememberedDataSource = new MatTableDataSource([]);
  selection = new SelectionModel<VisitorResponse>(true, []);
  selectionPending = new SelectionModel<VisitorResponse>(true, []);
  selectionRemaining = new SelectionModel<VisitorResponse>(true, []);
  constructor(
    public dialog: MatDialog,
    public dialogss: MatDialog,
    private visitorService: VisitorService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    const users = [];
    this.dataSource = new MatTableDataSource(users);

  }



  ngOnInit(): void {
    this.anonymizeForm = this.fb.group({
      delete: ['', Validators.required],
    }),
      this.signOutForm = this.fb.group({
        finalDate: ['']
      })
    this.getAllVisitors();
    this.getPendingVisitor();
    this.getRememberedVisitor();
    this.today1.setDate(this.today1.getDate() + 0);
    
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.pendingDataSource.sort = this.sort;
    this.rememberedDataSource.sort = this.sort
  }

  openDialog() {
    const dialogRef = this.dialog.open(VisitorDialogComponent, {
      maxWidth: '25vw',
      width: '100%',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.getAllVisitors();
        this.getPendingVisitor();
        this.getRememberedVisitor();
      }
    });
  }

  Dialog(row: any) {
    if (!row.isAnonymized) {
      const dialogRef = this.dialogss.open(VisitorUpdatediologComponent, {
        height: '80%',
        width: '35%',
        data: row,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result === 'update') {
            this.getAllVisitors();
            this.getPendingVisitor();
            this.getRememberedVisitor();
          }
        }
      })
    }
  }

  data = []
  openAnonymize(row: any) {
    const dialogRef = this.dialog.open(VisitorAnonymizeModuleComponent, {
      maxWidth: '30vw',
      width: '100%',
      disableClose: true,
      data: this.checkBoxId
      // data:row
    });
    dialogRef.afterClosed().subscribe(result => {
     
      this.selection.clear();
      this.exportSelected = false;
      this.archiveSelected = false;
      this.disabledbutton = true
      // this.checkBoxId = []
      if (result) {
        this.checkBoxId.forEach(ele => {
          this.data.push(ele._id);
          let visitorId = [...new Set(this.data)];
          this.visitorService.anonymizeVisitor(visitorId).subscribe(res => {
            this.getAllVisitors();
            this.getPendingVisitor();
            this.getRememberedVisitor();
            this.selection.clear();
            this.exportSelected = false;
            this.archiveSelected = false;
            this.disabledbutton = true
            this.checkBoxId = []
          })
        })
      }
    });
  }


  openSignInVisitor(row: any) {
    const dialogRef = this.dialog.open(VisitorSignInModuleComponent, {
      width: '20%',
      disableClose: true,
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllVisitors();
        this.getPendingVisitor();
        this.getRememberedVisitor();
      }
    });
  }
  signOutList=[];
  openSignOutVisitor(row: any) {
   
    const dialogRef = this.dialog.open(VisitorSignOutModuleComponent, {
      width: '20%',
      disableClose: true,
      // data: this.moduleDataSignOut
      data: row
      
    });
    dialogRef.afterClosed().subscribe(result => {
      
       
      if (result) {
        this.getAllVisitors();
        this.getPendingVisitor();
        this.getRememberedVisitor();
        this.signOutList.push(row);
       
        
        this.selection.clear();
        this.exportSelected = false;
        this.archiveSelected = false;
        this.disabledbutton = true
        this.checkBoxId = []
      }
    });
  }

  checkBoxdataAnonymize: any
  openSignOutVisitorModel(row: any) {
    const dialogRef = this.dialog.open(VisitorSignoutAllComponent, {
      maxWidth: '25vw',
      width: '100%',
      disableClose: true,
      data: this.checkBoxId
    });

    dialogRef.afterClosed().subscribe(result => {
      this.selection.clear();
      this.exportSelected = false;
      this.archiveSelected = false;
      this.disabledbutton = true
      // this.checkBoxId = []

      if (result) {

        this.checkBoxId.forEach(ele => {
          this.data.push(ele._id);
          let visitorId = [...new Set(this.data)];
          this.visitorService.SignOutAllVisitor(visitorId).subscribe(res => {
            this.getAllVisitors();
            this.selection.clear();
            this.exportSelected = false;
            this.archiveSelected = false;
            this.disabledbutton = true
            this.checkBoxId = []

          })
        })
      }

      // if (result === 'signOuts') {
      // }
    });
  }

  openApproveDialog(element) {
    const dialogRef = this.dialog.open(VisitorApprovalModuleComponent, {
      width: '20%',
      disableClose: true,
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllVisitors();
        this.getPendingVisitor();
      }
    });
  }

  openRejectDialog(element) {
    const dialogRef = this.dialog.open(VisitorRemoveModuleComponent, {
      width: '20%',
      disableClose: true,
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.getAllVisitors();
        this.getPendingVisitor();
      }
    });
  }

  guest() {
    this.guests = true;
    this.pendings = false;
    this.remembers = false;
  }

  pending() {
    this.guests = false;
    this.pendings = true;
    this.remembers = false;
  }

  remember() {
    this.guests = false;
    this.pendings = false;
    this.remembers = true;
  }
  // selection = new SelectionModel ();
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelected1() {
    const numSelected2 = this.selectionPending.selected.length;
    const numRows2 = this.pendingDataSource.data.length;
    return numSelected2 === numRows2;
  }

  // isAllSelected2() {
  //   const numSelected3 = this.selectionRemaining.selected.length;
  //   const numRows3 = this.remeningDataSource.data.length;
  //   return numSelected3 === numRows3;
  // }

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

  masterToggle1() {
    if (this.isAllSelected1()) {
      this.selectionPending.clear();
      return;
    }

    this.selectionPending.select(...this.pendingDataSource.data);

  }

  signin() {
  }

  checkboxLabel(row?: VisitorResponse): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.fullName + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // this.dataSource.filteredData.forEach(ele => {
    //   if (ele.FullName.trim().toLowerCase() === filterValue.trim().toLowerCase()) {
    //     (event.target as HTMLInputElement).value = null
    //   }
    // })
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  applyFilterPending(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.pendingDataSource.filter = filterValue.trim().toLowerCase();
    this.pendingDataSource.filteredData.forEach(ele => {
      if (ele.FullName.trim().toLowerCase() === filterValue.trim().toLowerCase()) {
        (event.target as HTMLInputElement).value = null
      }
    })
  }

  applyFilterRember(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.rememberedDataSource.filter = filterValue.trim().toLowerCase();
    this.rememberedDataSource.filteredData.forEach(ele => {
      if (ele.FullName.trim().toLowerCase() === filterValue.trim().toLowerCase()) {
        (event.target as HTMLInputElement).value = null
      }
    })
  }






  TotalVisitor: number = 0
  visitor = []
  pendingVisitor = []
  rememberedVisitor = []


  getAllVisitors() {
    var start = 'All'
    var end = 'All'
    this.visitorService.getVisitor(start, end).subscribe(res => {
      this.apiaResponse = res.visitorArray
      this.spinner = false
      this.table = true;
      this.visitors = res.visitorArray;
      this.visitor = res.visitorArray;
      this.TotalVisitor = res.visitorArray.length
      this.dataSource.sort = this.sort;
      // this.dataSource.sort = null;
      this.dataSource = new MatTableDataSource([
        ...this.visitor
      ]);
      this.visitors.forEach((ele, i) => {
        ele.SlNo = i + 1
      })
      this.visitor.forEach((ele, i) => {
        if (ele.isAnonymized) {
          ele.FullName = "Anonymized Visitor"
          ele.CompanyName = ""
        }
      })

      setInterval(() => {
        this.dataSource.paginator = this.paginator;

      })
      setTimeout(() => this.dataSource.sort = this.sort);

    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut();
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
  TotalPendingVisitor: Number = 0
  getPendingVisitor() {
    var start = 'All'
    var end = 'All'
    this.visitorService.getPendingVisitor(start, end).subscribe(res => {
      if (!res.error) {
        this.TotalPendingVisitor = res.response.length
        // this.apiaResponse = res.response
        this.spinner = false
        this.table = true;
        this.pendingVisitors = res.response;
        this.pendingVisitor = res.response;
        this.pendingDataSource.sort = this.sort;
        this.pendingDataSource.paginator = this.paginatorPendings;
        this.pendingVisitors.forEach((ele, i) => {
          ele.SlNo = i + 1
        })
        this.pendingDataSource = new MatTableDataSource([
          ...this.pendingVisitor
        ]);
        setInterval(() => {
          this.pendingDataSource.paginator = this.paginatorPendings;
          this.pendingDataSource.sort = this.sort;
        })

      }
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut();
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }


  TotalRememberedVisitor: Number = 0
  getRememberedVisitor() {
    this.visitorService.getRememberedVisitor().subscribe(res => {
      if (!res.error) {
        this.TotalRememberedVisitor = res.response.length
        // this.apiaResponse = res.response
        this.spinner = false
        this.table = true;
        this.rememberedVisitors = res.response;
        this.rememberedVisitor = res.response;
        this.rememberedDataSource.sort = this.sort;
        this.rememberedDataSource.paginator = this.paginatorRemembered;
        this.rememberedVisitors.forEach((ele, i) => {
          ele.SlNo = i + 1
        })
        this.rememberedDataSource = new MatTableDataSource([
          ...this.rememberedVisitor
        ]);
        setInterval(() => {
          this.rememberedDataSource.paginator = this.paginatorRemembered;
          this.rememberedDataSource.sort = this.sort;
        })

      }
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut();
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }


  onChangeSelect($event: any) {
    if ($event.value.toLowerCase() == 'all') {
      let filterData = _.filter(this.apiaResponse, (iteam) => {
        return iteam
      })
      this.dataSource = new MatTableDataSource(filterData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    } else if ($event.value.toLowerCase() == 'visitor1') {
      let filterData = _.filter(this.apiaResponse, (iteam) => {
        if (!iteam.logoutTime) {
          return iteam.loginTime
        }
      })
      this.dataSource = new MatTableDataSource(filterData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    } else if ($event.value.toLowerCase() == 'visitor2') {
      let filterData = _.filter(this.apiaResponse, (iteam) => {
        if ((iteam.loginTime && iteam.logoutTime)) {
          return iteam.logoutTime
        }
      })
      this.dataSource = new MatTableDataSource(filterData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onChangeDuration($event: any) {
    if ($event.value.toLowerCase() == 'all') {
      let start = 'All'
      let end = 'All'
      this.visitorService.getVisitor(start, end).subscribe(res => {
        this.apiaResponse = res.visitorArray
        this.dataSource = new MatTableDataSource(this.apiaResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
    } else if ($event.value.toLowerCase() == 'visitors1') {
      let start = new Date();
      let start1 = new Date()
      let numberOfDaysToAdd = -1;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1)
      let year = end.getFullYear()
      let month = end.getMonth()
      let date = end.getDate() + 1;
      let dateFilter = new Date(year, month, date, 0, 1, 50, 50)
      this.visitorService.getVisitor(start, dateFilter).subscribe(res => {
        this.apiaResponse = res.visitorArray
        this.dataSource = new MatTableDataSource(this.apiaResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
    } else if ($event.value.toLowerCase() == 'visitors2') {
      let start = new Date();
      let start1 = new Date()
      let numberOfDaysToAdd = -7;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1)
      this.visitorService.getVisitor(start, end).subscribe(res => {
        this.apiaResponse = res.visitorArray
        this.dataSource = new MatTableDataSource(this.apiaResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
    } else if ($event.value.toLowerCase() == 'visitors3') {
      let start = new Date();
      let start1 = new Date()
      let numberOfDaysToAdd = -30;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1)
      this.visitorService.getVisitor(start, end).subscribe(res => {
        this.apiaResponse = res.visitorArray
        this.dataSource = new MatTableDataSource(this.apiaResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
    } else if ($event.value.toLowerCase() == 'visitors4') {
      let start = new Date();
      let start1 = new Date()
      let numberOfDaysToAdd = -30;
      let numberOfDaysToAdd1 = -60;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1)
      let over1 = start.setDate(start.getDate() + numberOfDaysToAdd1);
      let over = new Date(over1)
      this.visitorService.getVisitor(end, over).subscribe(res => {
        this.apiaResponse = res.visitorArray
        this.dataSource = new MatTableDataSource(this.apiaResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
    } else if ($event.value.toLowerCase() == 'visitors5') {
      let start = new Date(this.customStartDate)
      let end = new Date(this.customEndDate)
      let year = end.getFullYear()
      let month = end.getMonth()
      let date = end.getDate();
      let dateFilter = new Date(year, month, date, 23, 59, 50, 50)
      let year1 = start.getFullYear()
      let month1 = start.getMonth()
      let date1 = start.getDate();
      let dateFilter1 = new Date(year1, month1, date1, 0, 1, 5, 5)
      this.visitorService.getVisitor(dateFilter, dateFilter1).subscribe(res => {
        this.apiaResponse = res.visitorArray
        this.dataSource = new MatTableDataSource(this.apiaResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
    }
  }

  onChangeCategories($event: any) {
    if ($event.value.toLowerCase() == 'all') {
      let start = 'All'
      let end = 'All'
      this.visitorService.getVisitor(start, end).subscribe(res => {
        this.apiaResponse = res.visitorArray
        this.dataSource = new MatTableDataSource(this.apiaResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
    } else if ($event.value.toLowerCase() == 'role') {
      let start = 'All'
      let end = 'All'
      this.visitorService.getVisitor(start, end).subscribe(res => {
        this.apiaResponse = res.visitorArray
        let filterData = _.filter(this.apiaResponse, (iteam) => {
          if (iteam.role) {
            return iteam.role
          }
        })
        this.dataSource = new MatTableDataSource(filterData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
    }
  }

  getCheckboxValuesAll(ev, data) {
    this.checkBoxId = [];
    data.forEach(ele => {   
      if (ev.checked) {
        this.exportSelected = true;
        this.disabledbutton = false
        this.archiveSelected = true;
        this.signOutSelected = true
        this.checkBoxId.push(ele);
      } else {
        this.exportSelected = false;
        this.disabledbutton = true
        this.archiveSelected = false;
        this.signOutSelected = false
        this.checkBoxId = []
      }
    });
  }
  signOutBtnSelected: boolean;
  moduleDataSignOut: any=[]
  checkboxValuesRow(ev, data) {   
    this.moduleDataSignOut = data
   
    if(data._id){  
        if(data.logoutTime){
          if(ev.checked){
          this.signOutBtnSelected = true;
           
        }
      }else if(data.logoutTime===undefined){
        if(ev.checked){
          this.signOutBtnSelected = false;
              
        }else{
          this.signOutBtnSelected = true;
         
        }
      }
    }
    
  
    
    if (ev.checked) {
      this.exportSelected = true;
      this.archiveSelected = true;
      this.disabledbutton = false
      this.signOutSelected = true
      this.checkBoxId.push(data);
      // if (data.logoutTime) {
      //   this.signOutBtnSelected = true;
      // }else{
      //   this.signOutBtnSelected=false;
      // }
    } else {
      if (this.checkBoxId.length == 1) {
        this.exportSelected = false;
        this.archiveSelected = false;
        this.disabledbutton = true
        this.signOutSelected = false
      }
     
      let removeIndex = this.checkBoxId.findIndex(itm => itm === data);
      if (removeIndex !== -1)
        this.checkBoxId.splice(removeIndex, 1);
    }

  }

  getCheckboxValuesPending(event, data) {
    this.checkBoxId = [];
    data.forEach(ele => {
      if (event.checked) {
        this.exportPendingSelected = true;
        this.disabledbutton = false
        this.archivePendingSelected = true;
        this.signOutSelected = true
        this.checkBoxId.push(ele);
      } else {
        this.exportPendingSelected = false;
        this.disabledbutton = true
        this.archivePendingSelected = false;
        this.signOutSelected = false
        this.checkBoxId = []
      }
    });
  }
  moduleDataAccept: any
  checkboxValuesPendingRow(event, data) {
    this.moduleDataAccept = data
    if (event.checked) {
      this.exportPendingSelected = true;
      this.archivePendingSelected = true;
      this.disabledbutton = false
      this.checkBoxId.push(data);
    } else {
      this.exportPendingSelected = false;
      this.archivePendingSelected = false;
      this.disabledbutton = true
      let removeIndex = this.checkBoxId.findIndex(itm => itm === data);
      if (removeIndex !== -1)
        this.checkBoxId.splice(removeIndex, 1);
    }
  }

  getCheckboxValuesRemainder(ev, data) {
    this.checkBoxId = [];
    data.forEach(ele => {
      if (ev.checked) {
        this.exportSelected = true;
        this.archiveSelected = true;
        this.signOutSelected = true
        this.disabledbutton = false
        this.checkBoxId.push(ele);
      } else {
        this.exportSelected = false;
        this.archiveSelected = false;
        this.signOutSelected = false
        this.disabledbutton = true
        this.checkBoxId = []
      }
    });
  }

  checkboxValuesReminderRow(ev, data) {
    if (ev.checked) {
      this.exportSelected = true;
      this.archiveSelected = true;
      this.signOutSelected = true;
      this.disabledbutton = false
      this.checkBoxId.push(data);
    } else {
      this.exportSelected = false;
      this.archiveSelected = false;
      this.signOutSelected = false;
      this.disabledbutton = true
      let removeIndex = this.checkBoxId.findIndex(itm => itm === data);
      if (removeIndex !== -1)
        this.checkBoxId.splice(removeIndex, 1);
    }
  }

  anonymize() { }

  signOutId: string
  signOutvisitor(id) {
    this.signOutId = id
  }

  convertexel() {
    let nonDuplicateCheckBoxValue = [...new Set(this.checkBoxId)];
    this.uniqueArr = nonDuplicateCheckBoxValue
    this.uniqueArr.forEach((ele) => {
      delete ele.SlNo,
        delete ele.Extrafields,

        delete ele.refreshmentData,
        delete ele.userId,
        delete ele.__v
      delete ele._id
      delete ele.created_at
      // delete ele.isAnonymized
      delete ele.isPending
      delete ele.reject
      delete ele.rememberMe
      delete ele.locationId
    });
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var MM = today.getMinutes();
    var ampm = hh + MM >= 12 ? 'AM' : 'PM';
    hh = hh % 12;
    hh = hh ? hh : 12; // the hour '0' should be '12'
    // minutes = minutes < 10 ? '0' + minutes : minutes;

    const fileName = "Breazie_Export_Guest_" + mm + '-' + dd + '-' + yyyy + '-' + hh + '-' + MM + '-' + ampm + '-' + ".xlsx"
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uniqueArr);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "test");

    XLSX.writeFile(wb, fileName);
    this.toastr.success("downloaded successfuly")
    this.selection.clear();
    this.exportSelected = false;
    this.archiveSelected = false;
    this.disabledbutton = true;
    this.checkBoxId = []
     
  }



  onDelete() {
    //   this.visitorService.deletevisitor(localStorage.getItem('dataBaseID')).subscribe(res => {
    // })
  }
}
