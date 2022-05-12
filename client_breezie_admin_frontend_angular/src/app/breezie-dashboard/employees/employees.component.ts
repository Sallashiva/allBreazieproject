import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeModuleComponent } from '../../modules/add-employee-module/add-employee-module.component';
import { AddBulkModuleComponent } from '../../modules/add-bulk-module/add-bulk-module.component';
import { EmployeeSigninComponent } from 'src/app/modules/employee-signin/employee-signin.component';
import { EmployeeRestoreComponent } from 'src/app/modules/employee-restore/employee-restore.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeResponse } from 'src/app/models/employeeResponse';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeSignoutComponent } from 'src/app/modules/employee-signout/employee-signout.component';
import { TimelineService } from 'src/app/services/timeline.service';
import { TimelineResponse } from 'src/app/models/timeline';
import { AddEmployeeUpdateDialogComponent } from 'src/app/modules/add-employee-update-dialog/add-employee-update-dialog.component';
import { MatSort } from '@angular/material/sort';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeArchiveComponent } from 'src/app/modules/employee-archive/employee-archive.component';
import { EmployeeTimelineUpdateComponent } from 'src/app/modules/employee-timeline-update/employee-timeline-update.component';
import { EmployeeAnonymizeComponent } from 'src/app/modules/employee-anonymize/employee-anonymize.component';
import { ArchievedResponse } from 'src/app/models/archievedResponse';
import { RemotelySignInComponent } from 'src/app/modules/remotely-sign-in/remotely-sign-in.component';
import { NodeWithI18n } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit {
  employees: boolean = true;
  timelines: boolean = false;
  archives: boolean = false;
  spinner: boolean = true;
  table: boolean = false;
  dataSource = new MatTableDataSource([]);
  dataSource2 = new MatTableDataSource([]);
  dataSource3 = new MatTableDataSource([]);
  employe: EmployeeResponse[];
  time: TimelineResponse[];
  archievedEmploye: ArchievedResponse[];
  signInButton: boolean = true;
  signOutButton: boolean = false;
  exform: FormGroup;
  apiaResponse: any = [];
  exportSelected = false;
  exportFiltered = false;
  archiveSelected = false;
  anonymizeSelected = false;
  contractTrace = false;
  customTimelineStartDate: any;
  customTimelineEndDate: any;
  apiaTimelineResponse: any = [];
  apiaArchiveResponse: any = [];
  ArchiveStartDate: any;
  ArchiveEndDate: any;
  checkBoxdataEmployee: any = [];
  uniqueArrEmployee: any = [];
  checkBoxdataTimeline: any = [];
  checkBoxdataAnonymize: any = [];
  uniqueArrTimeline: any = [];
  disabledbutton = true;
  disabledButtonTimeline = true;
  selectButtonAnonymize = true;
  disabledbuttonAnonymize = true;
  today = new Date();
  today1 = new Date();

  fileName = 'Breeze_Employee.xlsx';
  fileNameTimeline = 'Breeze_employee_Timeline.xlsx';

  displayedColumns: string[] = [
    'select',
    'fullName',
    'contact',
    'employeeFields',
    'lastActivity',
    'locationName',
    'signinbutton',
  ];
  displayedColumns2: string[] = [
    'select',
    'employeeName',
    'signin',
    'loginTime',
    'locationName',
    'signoutmessage',
    'signinbutton',
  ];
  displayedColumns3: string[] = [
    'select',
    'fullName',
    'lastName',
    'archivedate',
    'signinbutton',
  ];
  uploadForm: FormGroup;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginatorTimeline') paginatorTimeline!: MatPaginator;
  @ViewChild('paginatoAarchive') paginatoAarchive!: MatPaginator;

  @ViewChild('employeeSort') employeeSort: MatSort;
  @ViewChild('timelineSort') timelineSort: MatSort;
  @ViewChild('archiveSort') archiveSort: MatSort;

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private timelineService: TimelineService,
    public dialogss: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllEmployee();
    this.getAllTimeline();
    this.getArchievedEmployee();
    this.today.setDate(this.today.getDate() + 0);
    this.today1.setDate(this.today1.getDate() + 0);
    this.exform = new FormGroup({
      type: new FormControl(),
      employeeId: new FormControl(),
      time: new FormControl(),
      signedOutMessage: new FormControl(),
      isRemoteSignedIn: new FormControl(),
    });
    this.uploadForm = new FormGroup({
      employeeArray: new FormControl('', [Validators.required]),
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.employeeSort;
    this.dataSource2.sort = this.timelineSort;
    this.dataSource3.sort = this.archiveSort;
  }

  selection = new SelectionModel<EmployeeResponse>(true, []);
  selection1 = new SelectionModel<TimelineResponse>(true, []);
  selection2 = new SelectionModel<ArchievedResponse>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelected1() {
    const numSelected2 = this.selection1.selected.length;
    const numRows2 = this.dataSource2.data.length;
    return numSelected2 === numRows2;
  }

  isAllSelected2() {
    const numSelected3 = this.selection2.selected.length;
    const numRows3 = this.dataSource3.data.length;
    return numSelected3 === numRows3;
  }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  masterToggle1() {
    if (this.isAllSelected1()) {
      this.selection1.clear();
      return;
    }
    this.selection1.select(...this.dataSource2.data);
  }
  masterToggle2() {
    if (this.isAllSelected2()) {
      this.selection2.clear();
      return;
    }
    this.selection2.select(...this.dataSource3.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EmployeeResponse): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.fullName + 1
      }`;
  }
  checkboxLabel1(row?: TimelineResponse): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'} row ${row.employeeName + 1
      }`;
  }

  checkboxLabel2(row?: ArchievedResponse): string {
    if (!row) {
      return `${this.isAllSelected2() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection2.isSelected(row) ? 'deselect' : 'select'} row ${row.lastName + 1
      }`;
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddEmployeeModuleComponent, {
      maxWidth: '25vw',
      width: '100%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'add') {
        this.getAllEmployee();
      }
    });
  }

  openAnonymize() {
    const dialogRef = this.dialog.open(EmployeeAnonymizeComponent, {
      maxWidth: '30vw',
      width: '100%',
      data: this.checkBoxdataAnonymize,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.selection2.clear()
      this.anonymizeSelected = false
      this.disabledbuttonAnonymize = true
      this.checkBoxdataAnonymize = []
      if (result) {
        this.checkBoxdataAnonymize.forEach((ele) => {
          this.data.push(ele._id);
          let nonDuplicateCheckBoxValueEmployee = [...new Set(this.data)];
          this.employeeService
            .anonymizeEmployee(nonDuplicateCheckBoxValueEmployee)
            .subscribe((res) => {
              this.getAllEmployee();
              this.getArchievedEmployee();

              this.selection2.clear();
              this.anonymizeSelected = false;
              this.disabledbuttonAnonymize = true;
              this.checkBoxdataAnonymize = [];
            });
        });
      }
    });
  }

  addBulk() {
    const dialogRef = this.dialog.open(AddBulkModuleComponent, {
      maxWidth: '30vw',
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllEmployee();
      }
    });
  }
  // fullName:string;

  // applyFilter(event: Event) {

  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //   // this.fullName = '';
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filteredData.forEach((ele) => {
      if (
        ele.fullName.trim().toLowerCase() === filterValue.trim().toLowerCase()
      ) {
        (event.target as HTMLInputElement).value = null;
      }
    });
  }

  applyFilterTimeline(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    this.dataSource2.filteredData.forEach((ele) => {
      if (
        ele.employeeName.trim().toLowerCase() ===
        filterValue.trim().toLowerCase()
      ) {
        (event.target as HTMLInputElement).value = null;
      }
    });
  }

  applyFilterArchives(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
    this.dataSource3.filteredData.forEach((ele) => {
      if (
        ele.fullName.trim().toLowerCase() === filterValue.trim().toLowerCase()
      ) {
        (event.target as HTMLInputElement).value = null;
      }
    });
  }

  selectedEmp: any;
  Dialog(row: any) {
    const dialogRef = this.dialogss.open(AddEmployeeUpdateDialogComponent, {
      height: '90%',
      width: '30%',
      data: row,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'update') {
        this.getAllEmployee();
        this.getAllTimeline();
      }
    });
  }


  // DialogTimeline(row: any) {
  //   const dialogRef = this.dialogss.open(EmployeeTimelineUpdateComponent, {
  //     // height: '85%',
  //     width: '30%',
  //     data: row
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 'update') {
  //       this.getAllEmployee();
  //     }
  //   })
  // }

  data = [];
  archiveAllEmployee() {
    const dialogRef = this.dialog.open(EmployeeArchiveComponent, {
      maxWidth: '25vw',
      width: '100%',
      data: this.checkBoxdataEmployee,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.disabledbutton = true;
      this.selection.clear();
      this.archiveSelected = false;
      this.exportSelected = false;
      if (result) {
        this.checkBoxdataEmployee.forEach((ele) => {
          this.data.push(ele._id);
          let nonDuplicateCheckBoxValueEmployee = [...new Set(this.data)];
          this.employeeService
            .archiveEmployee(nonDuplicateCheckBoxValueEmployee)
            .subscribe((res) => {
              this.getAllEmployee();
              this.getArchievedEmployee();
              this.selection.clear();
              this.exportSelected = false;
              this.disabledbutton = true;
              this.archiveSelected = false;
              this.checkBoxdataEmployee = [];
            });
        });
      }
    });
  }

  contractTraceTimeline() {
    let nonDuplicateCheckBoxValueTimeline = [
      ...new Set(this.checkBoxdataTimeline),
    ];
    this.uniqueArrTimeline = nonDuplicateCheckBoxValueTimeline;
    this.uniqueArrTimeline.forEach((ele) => {
      delete ele.SlNo,
        delete ele.created_at,
        delete ele.employeeId,
        delete ele.device,
        delete ele.__v;
      delete ele._id,
        // delete ele._phone,
        // delete ele._email,
        delete ele.userId,
        delete ele.locationId,
        delete ele.isRemote;
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

    const fileName =
      'Breazie_Employee_ContractTrace' +
      mm +
      '-' +
      dd +
      '-' +
      yyyy +
      '-' +
      hh +
      '-' +
      MM +
      '-' +
      ampm +
      '-' +
      '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uniqueArrTimeline);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'fileName');
    XLSX.writeFile(wb, fileName);
    this.selection1.clear();
    this.exportSelected = false;
    this.disabledbutton = true;
    this.archiveSelected = false;
    this.checkBoxdataTimeline = [];
  }

  // contractTraceTimeline() {
  //   let nonDuplicateCheckBoxValueEmployee = [...new Set(this.checkBoxdataEmployee)];
  //   this.uniqueArrEmployee = nonDuplicateCheckBoxValueEmployee
  //   this.uniqueArrEmployee.forEach((ele) => {

  //     console.log(ele.created_at);

  //     delete ele.SlNo,
  //       delete ele.created_at,
  //       delete ele.locationId,
  //       delete ele.userId,
  //       delete ele.__v
  //     delete ele._id,
  //       delete ele.deliveryIds,
  //       delete ele.role,
  //       delete ele.defaultAdmin,
  //       delete ele.isRemoteUser,
  //       delete ele.isDeliveryPerson,
  //       delete ele.isAnonymized,
  //       delete ele.isArchived
  //   });

  //   var today = new Date();
  //   var dd = String(today.getDate()).padStart(2, '0');
  //   var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //   var yyyy = today.getFullYear();
  //   var hh = today.getHours();
  //   var MM = today.getMinutes();
  //   var ampm = hh + MM >= 12 ? 'AM' : 'PM';
  //   hh = hh % 12;
  //   hh = hh ? hh : 12; // the hour '0' should be '12'
  //   // minutes = minutes < 10 ? '0' + minutes : minutes;
  //   const fileName = "Breeze_employees_" + mm + '-' + dd + '-' + yyyy + '-' + hh + '-' + MM + '-' + ampm + ".xlsx";
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uniqueArrEmployee);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "test");
  //   XLSX.writeFile(wb, fileName);
  //   this.toastr.success("downloaded successfuly")
  // }

  employee() {
    this.employees = true;
    this.timelines = false;
    this.archives = false;
  }
  timeline() {
    this.employees = false;
    this.timelines = true;
    this.archives = false;
  }
  archive() {
    this.employees = false;
    this.timelines = false;
    this.archives = true;
  }

  openSigninDialog(data) {
    const dialogRef = this.dialog.open(EmployeeSigninComponent, {
      width: '20%',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let date = new Date();
        this.exform.get('type').setValue('login');
        this.exform.get('isRemoteSignedIn').setValue(false);
        if (data.employeeId) {
          this.exform.get('employeeId').setValue(data.employeeId);
        } else {
          this.exform.get('employeeId').setValue(data._id);
        }
        this.exform.get('time').setValue(date);
        this.employeeService
          .signOutEmployee(this.exform.value)
          .subscribe((res) => {
            if (!res.error) {
              this.getAllEmployee();
              this.getAllTimeline();
              this.checkBoxdataEmployee = [];
              this.checkBoxdataTimeline = [];
            }
          });
      }
    });

    // this.signInButton=false
    // this.signOutButton=true
    // this.dialog.open(EmployeeSigninComponent, {
    // width: '20%'});
  }

  openRemotelySigninDialog(data) {
    const dialogRef = this.dialog.open(RemotelySignInComponent, {
      width: '20%',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let date = new Date();
        this.exform.get('type').setValue('login');
        this.exform.get('isRemoteSignedIn').setValue(true);
        if (data.employeeId) {
          this.exform.get('employeeId').setValue(data.employeeId);
        } else {
          this.exform.get('employeeId').setValue(data._id);
        }
        this.exform.get('time').setValue(date);
        this.employeeService
          .signOutEmployee(this.exform.value)
          .subscribe((res) => {
            if (!res.error) {
              this.getAllEmployee();
              this.getAllTimeline();
              this.checkBoxdataEmployee = [];
              this.checkBoxdataTimeline = [];
            }
          });
      }
    });

    // this.signInButton=false
    // this.signOutButton=true
    // this.dialog.open(EmployeeSigninComponent, {
    // width: '20%'});
  }

  openSinOutDialog(data) {
    const dialogRef = this.dialog.open(EmployeeSignoutComponent, {
      width: '20%',
      data: data,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        let date = new Date();
        this.exform.get('type').setValue('logout');
        if (data.employeeId) {
          this.exform.get('employeeId').setValue(data.employeeId);
        } else {
          this.exform.get('employeeId').setValue(data._id);
        }
        this.exform.get('time').setValue(date);
        this.employeeService
          .signOutEmployee(this.exform.value)
          .subscribe((res) => {
            if (!res.error) {
              this.getAllEmployee();
              this.getAllTimeline();
              this.checkBoxdataEmployee = [];
              this.checkBoxdataTimeline = [];
            }
          });
      }
    });
  }

  openRestoreDialog(data) {
    const dialogRef = this.dialog.open(EmployeeRestoreComponent, {
      width: '20%',
      data: data,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.employeeService
          .restoreArchiveEmployee(data._id)
          .subscribe((res) => {
            if (!res.error) {
              this.getAllEmployee();
              this.getAllTimeline();
              this.getArchievedEmployee();
              this.checkBoxdataAnonymize = [];
            }
          });
      }
    });
  }

  OnDateTimelineStartChange(event) {
    this.customTimelineStartDate = event;
  }

  OnDateTimelineEndChange(event) {
    this.customTimelineEndDate = event;
  }

  getCheckboxValuesAllEmployee(event, data) {
    this.checkBoxdataEmployee = [];
    data.forEach((ele) => {
      if (event.checked) {
        this.exportSelected = true;
        this.disabledbutton = false;
        this.archiveSelected = true;
        this.checkBoxdataEmployee.push(ele);
      } else {
        this.exportSelected = false;
        this.disabledbutton = true;
        this.archiveSelected = false;
        this.checkBoxdataEmployee = [];
      }
    });
    this.checkBoxdataEmployee.forEach((ele) => { });
  }

  checkboxValuesEmployeeRow(event, data) {
    if (event.checked) {
      this.exportSelected = true;
      this.disabledbutton = false;
      this.archiveSelected = true;
      this.checkBoxdataEmployee.push(data);
    } else {
      if (this.checkBoxdataEmployee.length == 1) {
        this.exportSelected = false;
        this.disabledbutton = true;
        this.archiveSelected = false;
      }
      let removeIndex = this.checkBoxdataEmployee.findIndex(
        (itm) => itm === data
      );
      if (removeIndex !== -1) this.checkBoxdataEmployee.splice(removeIndex, 1);
    }
  }

  getCheckboxValuesAllTimeline(event, data) {
    this.checkBoxdataTimeline = [];
    data.forEach((ele) => {
      if (event.checked) {
        this.disabledButtonTimeline = false;
        this.exportFiltered = true;
        this.contractTrace = true;
        this.checkBoxdataTimeline.push(ele);
      } else {
        this.exportFiltered = false;
        this.disabledButtonTimeline = true;
        this.contractTrace = false;
        this.checkBoxdataTimeline = [];
      }
    });
  }

  checkboxValuesTimelineRow(event, data) {
    if (event.checked) {
      this.disabledButtonTimeline = false;
      this.exportFiltered = true;
      this.contractTrace = true;

      this.checkBoxdataTimeline.push(data);
    } else {
      if (this.checkBoxdataTimeline == 1) {
        this.exportFiltered = false;
        this.disabledButtonTimeline = true;
        this.contractTrace = false;
      }

      let removeIndex = this.checkBoxdataTimeline.findIndex(
        (itm) => itm === data
      );
      if (removeIndex !== -1) this.checkBoxdataTimeline.splice(removeIndex, 1);
    }
  }

  timelineConvertexel() {
    let nonDuplicateCheckBoxValueTimeline = [
      ...new Set(this.checkBoxdataTimeline),
    ];
    this.uniqueArrTimeline = nonDuplicateCheckBoxValueTimeline;
    this.uniqueArrTimeline.forEach((ele) => {
      delete ele.SlNo,
        delete ele.created_at,
        delete ele.employeeId,
        delete ele.device,
        delete ele.__v;
      delete ele._id,
        delete ele.userId,
        delete ele.locationId,
        delete ele.isRemote;
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

    const fileName =
      'Breazie_Employee_Timeline' +
      mm +
      '-' +
      dd +
      '-' +
      yyyy +
      '-' +
      hh +
      '-' +
      MM +
      '-' +
      ampm +
      '-' +
      '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uniqueArrTimeline);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'test');
    XLSX.writeFile(wb, fileName);
    this.selection1.clear();
    this.exportSelected = false;
    this.disabledbutton = true;
    this.archiveSelected = false;
    this.checkBoxdataTimeline = [];
  }

  onChangeEmployeesTimeLineDuration($event: any) {
    if ($event.value.toLowerCase() == 'all') {
      let start = 'All';
      let end = 'All';
      this.timelineService.getTimeline(start, end).subscribe((res) => {
        this.apiaTimelineResponse = res.timeline;
        this.dataSource2 = new MatTableDataSource(this.apiaTimelineResponse);
        this.dataSource2.paginator = this.paginatorTimeline;
        this.dataSource2.sort = this.timelineSort;
      });
    } else if ($event.value.toLowerCase() == 'employee2') {
      let start = new Date();
      let start1 = new Date();
      let numberOfDaysToAdd = -1;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1);
      let year = end.getFullYear();
      let month = end.getMonth();
      let date = end.getDate() + 1;
      let dateFilter = new Date(year, month, date, 0, 1, 50, 50);
      this.timelineService.getTimeline(start, dateFilter).subscribe((res) => {
        this.apiaTimelineResponse = res.timeline;
        this.dataSource2 = new MatTableDataSource(this.apiaTimelineResponse);
        this.dataSource2.paginator = this.paginatorTimeline;
        this.dataSource2.sort = this.timelineSort;
      });
    } else if ($event.value.toLowerCase() == 'employee3') {
      let start = new Date();
      let start1 = new Date();
      let numberOfDaysToAdd = -7;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1);
      this.timelineService.getTimeline(start, end).subscribe((res) => {
        this.apiaTimelineResponse = res.timeline;
        this.dataSource2 = new MatTableDataSource(this.apiaTimelineResponse);
        this.dataSource2.paginator = this.paginatorTimeline;
        this.dataSource2.sort = this.timelineSort;
      });
    } else if ($event.value.toLowerCase() == 'employee4') {
      let start = new Date();
      let start1 = new Date();
      let numberOfDaysToAdd = -30;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1);
      this.timelineService.getTimeline(start, end).subscribe((res) => {
        this.apiaTimelineResponse = res.timeline;
        this.dataSource2 = new MatTableDataSource(this.apiaTimelineResponse);
        this.dataSource2.paginator = this.paginatorTimeline;
        this.dataSource2.sort = this.timelineSort;
      });
    } else if ($event.value.toLowerCase() == 'employee5') {
      let start = new Date();
      let start1 = new Date();
      let numberOfDaysToAdd = -30;
      let numberOfDaysToAdd1 = -60;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1);
      let over1 = start.setDate(start.getDate() + numberOfDaysToAdd1);
      let over = new Date(over1);
      this.timelineService.getTimeline(end, over).subscribe((res) => {
        this.apiaTimelineResponse = res.timeline;
        this.dataSource2 = new MatTableDataSource(this.apiaTimelineResponse);
        this.dataSource2.paginator = this.paginatorTimeline;
        this.dataSource2.sort = this.timelineSort;
      });
    } else if ($event.value.toLowerCase() == 'employee6') {
      let start = new Date(this.customTimelineStartDate);
      let end = new Date(this.customTimelineEndDate);
      let year = end.getFullYear();
      let month = end.getMonth();
      let date = end.getDate();
      let dateFilter = new Date(year, month, date, 23, 59, 50, 50);
      let year1 = start.getFullYear();
      let month1 = start.getMonth();
      let date1 = start.getDate();
      let dateFilter1 = new Date(year1, month1, date1, 0, 1, 5, 5);
      this.timelineService
        .getTimeline(dateFilter, dateFilter1)
        .subscribe((res) => {
          this.apiaTimelineResponse = res.timeline;
          this.dataSource2 = new MatTableDataSource(this.apiaTimelineResponse);
          this.dataSource2.paginator = this.paginatorTimeline;
          this.dataSource2.sort = this.timelineSort;
        });
    }
  }

  onChangeEmployeesTimeLineStatus($event: any) {
    if ($event.value.toLowerCase() == 'all') {
      let filterData = _.filter(this.apiaTimelineResponse, (iteam) => {
        return iteam;
      });
      this.dataSource2 = new MatTableDataSource(filterData);
      this.dataSource2.paginator = this.paginatorTimeline;
      this.dataSource2.sort = this.timelineSort;
    } else if ($event.value.toLowerCase() == 'signed') {
      let filterData = _.filter(this.apiaTimelineResponse, (iteam) => {
        if (!iteam.logoutTime) {
          return iteam.loginTime;
        }
      });
      this.dataSource2 = new MatTableDataSource(filterData);
      this.dataSource2.paginator = this.paginatorTimeline;
      this.dataSource2.sort = this.timelineSort;
    } else if ($event.value.toLowerCase() == 'workingremotely') {
      let filterData = _.filter(this.apiaTimelineResponse, (iteam) => {
        if (iteam.isRemote) {
          return iteam.isRemote;
        }
      });
      this.dataSource2 = new MatTableDataSource(filterData);
      this.dataSource2.paginator = this.paginatorTimeline;
      this.dataSource2.sort = this.timelineSort;
    } else if ($event.value.toLowerCase() == 'signedin&remote') {
      let filterData = _.filter(this.apiaTimelineResponse, (iteam) => {
        if (!iteam.logoutTime && iteam.isRemote) {
          return iteam;
        }
      });
      this.dataSource2 = new MatTableDataSource(filterData);
      this.dataSource2.paginator = this.paginatorTimeline;
      this.dataSource2.sort = this.timelineSort;
    } else if ($event.value.toLowerCase() == 'signedout') {
      let filterData = _.filter(this.apiaTimelineResponse, (iteam) => {
        if (iteam.loginTime && iteam.logoutTime) {
          return iteam;
        }
      });
      this.dataSource2 = new MatTableDataSource(filterData);
      this.dataSource2.paginator = this.paginatorTimeline;
      this.dataSource2.sort = this.timelineSort;
    }
  }

  // convertexel() {
  //   let element = document.getElementById('excel-table');
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, this.fileName);
  // }

  convertexelEmpolyee() {
    let nonDuplicateCheckBoxValueEmployee = [
      ...new Set(this.checkBoxdataEmployee),
    ];
    this.uniqueArrEmployee = nonDuplicateCheckBoxValueEmployee;
    this.uniqueArrEmployee.forEach((ele) => {
      delete ele.SlNo,
        delete ele.created_at,
        delete ele.locationId,
        delete ele.userId,
        delete ele.__v;
      delete ele._id,
        delete ele.deliveryIds,
        delete ele.role,
        delete ele.defaultAdmin,
        delete ele.isRemoteUser,
        delete ele.isDeliveryPerson,
        delete ele.isAnonymized,
        delete ele.isArchived,
        // delete ele.lastActivity,
        delete ele.password,
        delete ele.loginTime,
        delete ele.acceess;
      delete ele.ExtraFields;
      delete ele.isCatering;
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
    const fileName =
      'Breeze_employees_' +
      mm +
      '-' +
      dd +
      '-' +
      yyyy +
      '-' +
      hh +
      '-' +
      MM +
      '-' +
      ampm +
      '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uniqueArrEmployee);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'test');
    XLSX.writeFile(wb, fileName);
    this.toastr.success('downloaded successfuly');
    this.selection.clear();
    // this.disabledbutton=true
    this.exportSelected = false;
    this.disabledbutton = true;
    this.archiveSelected = false;
    this.checkBoxdataEmployee = [];
  }

  // convertexeltimeline() {
  //   let element = document.getElementById('excel-table-timeline');
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, this.fileNameTimeline);
  // }

  getCheckboxValuesAllAnonymize(event, data) {
    this.checkBoxdataAnonymize = [];
    data.forEach((ele) => {
      if (event.checked) {
        this.anonymizeSelected = true;
        this.disabledbuttonAnonymize = false;
        this.checkBoxdataAnonymize.push(ele);
      } else {
        this.anonymizeSelected = false;
        this.disabledbuttonAnonymize = true;
        this.checkBoxdataAnonymize = [];
      }
    });
  }

  checkboxValuesAnonymizeRow(event, data) {
    if (event.checked) {
      this.selectButtonAnonymize = false;
      this.anonymizeSelected = true;
      this.contractTrace = true;
      this.disabledbuttonAnonymize = false;
      this.checkBoxdataAnonymize.push(data);
    } else {
      if (this.checkBoxdataAnonymize.length == 1) {
        this.anonymizeSelected = false;
        this.selectButtonAnonymize = true;
        this.contractTrace = false;
        this.disabledbuttonAnonymize = true;
      }

      let removeIndex = this.checkBoxdataAnonymize.findIndex(
        (itm) => itm === data
      );
      if (removeIndex !== -1) this.checkBoxdataAnonymize.splice(removeIndex, 1);
    }
  }

  TotalEmployees: number = 0;
  getAllEmployee() {
    this.employeeService.getEmployee().subscribe(
      (res) => {
        this.spinner = false;
        this.table = true;
        this.employe = res.employeeData;
        this.dataSource.sort = this.employeeSort;
        this.TotalEmployees = res.employeeData.length;
        this.dataSource = new MatTableDataSource([...res.employeeData]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.employeeSort;
      },
      (err) => {
        if (err.status) {
          this.toastr.error(err.error.message);
          this.logOut()
        } else {
          this.toastr.error('CONNECTION_ERROR');
          // this.logOut()
        }
      }
    );
  }

  archievedEmployees = [];
  getArchievedEmployee() {
    var start = 'All';
    var end = 'All';
    this.employeeService.getArchivedEmployee(start, end).subscribe(
      (res) => {
        this.spinner = false;
        this.table = true;
        this.archievedEmploye = res.delivery;
        this.archievedEmployees = res.delivery;
        this.archievedEmployees.forEach((ele, i) => {
          ele.SlNo = i + 1;
        });
        this.archievedEmployees.forEach((ele, i) => {
          if (ele.isAnonymized) {
            ele.FullName = 'Anonymized Visitor';
            ele.CompanyName = '';
          }
        });

        // this.archievedEmployees.forEach(ele =>{
        //     if (ele.isAnonymized) {
        //       ele.fullName="Anonymized Visitor"

        //     }
        // })
        this.dataSource3 = new MatTableDataSource([...this.archievedEmployees]);
        this.dataSource3.paginator = this.paginatoAarchive;
        this.dataSource3.sort = this.archiveSort;
      },
      (err) => {
        if (err.status) {
          this.toastr.error(err.error.message);
          this.logOut()
        } else {
          this.toastr.error('CONNECTION_ERROR');
          this.logOut()
        }
      }
    );
  }

  getAllTimeline() {
    var start = 'All';
    var end = 'All';
    this.timelineService.getTimeline(start, end).subscribe(
      (res) => {
        this.spinner = false;
        this.table = true;

        this.time = res.timeline;
        this.apiaTimelineResponse = res.timeline;
        this.dataSource2 = new MatTableDataSource([...res.timeline]);
        this.dataSource2.paginator = this.paginatorTimeline;
        this.dataSource2.sort = this.timelineSort;
      },
      (err) => {
        if (err.status) {
          this.toastr.error(err.error.message);
          this.logOut()
        } else {
          this.toastr.error('CONNECTION_ERROR');
          this.logOut()
        }
      }
    );
  }

  // signinEmployee(){
  //   this.employeeService.signInEmployee().subscribe(res=>{
  //   })
  // }

  onChangeEmployeesSelect($event: any) {
    if ($event.value.toLowerCase() == 'all') {
      this.employeeService.getEmployee().subscribe((res) => {
        this.apiaResponse = res.employeeData;
        let filterData = _.filter(this.apiaResponse, (iteam) => {
          return iteam;
        });
        this.dataSource = new MatTableDataSource(filterData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.employeeSort;
      });
    } else if ($event.value.toLowerCase() == 'signedin') {
      this.employeeService.getEmployee().subscribe((res) => {
        this.apiaResponse = res.employeeData;
        let filterData = _.filter(this.apiaResponse, (iteam) => {
          if (iteam.lastActivity.recent == 'login') {
            return iteam;
          }
        });
        this.dataSource = new MatTableDataSource(filterData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.employeeSort;
      });
    } else if ($event.value.toLowerCase() == 'workingremotely') {
      this.employeeService.getEmployee().subscribe((res) => {
        this.apiaResponse = res.employeeData;
        let filterData = _.filter(this.apiaResponse, (iteam) => {
          if (iteam.isRemote) {
            return iteam;
          }
        });
        this.dataSource = new MatTableDataSource(filterData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.employeeSort;
      });
    } else if ($event.value.toLowerCase() == 'signedin&remote') {
      this.employeeService.getEmployee().subscribe((res) => {
        this.apiaResponse = res.employeeData;
        let filterData = _.filter(this.apiaResponse, (iteam) => {
          if (iteam.lastActivity.recent == 'login' && iteam.isRemote) {
            return iteam;
          }
        });
        this.dataSource = new MatTableDataSource(filterData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.employeeSort;
      });
    } else if ($event.value.toLowerCase() == 'signedout') {
      this.employeeService.getEmployee().subscribe((res) => {
        this.apiaResponse = res.employeeData;
        let filterData = _.filter(this.apiaResponse, (iteam) => {
          if (iteam.lastActivity.recent == 'logout') {
            return iteam.logoutTime;
          }
        });
        this.dataSource = new MatTableDataSource(filterData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.employeeSort;
      });
    }
  }
  OnDateArchiveStartChange(event) {
    this.ArchiveStartDate = event;
  }
  OnDateArchiveEndChange(event) {
    this.ArchiveEndDate = event;
  }

  remote() { }

  onChangeEmployeesArchiveDuration($event: any) {
    if ($event.value.toLowerCase() == 'all') {
      let start = 'All';
      let end = 'All';
      this.employeeService.getArchivedEmployee(start, end).subscribe((res) => {
        this.apiaArchiveResponse = res.delivery;
        this.dataSource3 = new MatTableDataSource(this.apiaArchiveResponse);
        this.dataSource3.paginator = this.paginatoAarchive;
        this.dataSource3.sort = this.archiveSort;
      });
    } else if ($event.value.toLowerCase() == 'archive2') {
      let start = new Date();
      let start1 = new Date();
      let numberOfDaysToAdd = -1;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1);
      let year = end.getFullYear();
      let month = end.getMonth();
      let date = end.getDate() + 1;
      let dateFilter = new Date(year, month, date, 0, 1, 50, 50);
      this.employeeService
        .getArchivedEmployee(start, dateFilter)
        .subscribe((res) => {
          this.apiaArchiveResponse = res.delivery;
          this.dataSource3 = new MatTableDataSource(this.apiaArchiveResponse);
          this.dataSource3.paginator = this.paginatoAarchive;
          this.dataSource3.sort = this.archiveSort;
        });
    } else if ($event.value.toLowerCase() == 'archive3') {
      let start = new Date();
      let start1 = new Date();
      let numberOfDaysToAdd = -7;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1);
      this.employeeService.getArchivedEmployee(start, end).subscribe((res) => {
        this.apiaArchiveResponse = res.delivery;
        this.dataSource3 = new MatTableDataSource(this.apiaArchiveResponse);
        this.dataSource3.paginator = this.paginatoAarchive;
        this.dataSource3.sort = this.archiveSort;
      });
    } else if ($event.value.toLowerCase() == 'archive4') {
      let start = new Date();
      let start1 = new Date();
      let numberOfDaysToAdd = -30;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1);
      this.employeeService.getArchivedEmployee(start, end).subscribe((res) => {
        this.apiaArchiveResponse = res.delivery;
        this.dataSource3 = new MatTableDataSource(this.apiaArchiveResponse);
        this.dataSource3.paginator = this.paginatoAarchive;
        this.dataSource3.sort = this.archiveSort;
      });
    } else if ($event.value.toLowerCase() == 'archive5') {
      let start = new Date();
      let start1 = new Date();
      let numberOfDaysToAdd = -30;
      let numberOfDaysToAdd1 = -60;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1);
      let over1 = start.setDate(start.getDate() + numberOfDaysToAdd1);
      let over = new Date(over1);
      this.employeeService.getArchivedEmployee(end, over).subscribe((res) => {
        this.apiaArchiveResponse = res.delivery;
        this.dataSource3 = new MatTableDataSource(this.apiaArchiveResponse);
        this.dataSource3.paginator = this.paginatoAarchive;
        this.dataSource3.sort = this.archiveSort;
      });
    } else if ($event.value.toLowerCase() == 'archive6') {
      let start = new Date(this.ArchiveStartDate);
      let end = new Date(this.ArchiveEndDate);
      let year = end.getFullYear();
      let month = end.getMonth();
      let date = end.getDate();
      let dateFilter = new Date(year, month, date, 23, 59, 50, 50);
      let year1 = start.getFullYear();
      let month1 = start.getMonth();
      let date1 = start.getDate();
      let dateFilter1 = new Date(year1, month1, date1, 0, 1, 5, 5);
      this.employeeService
        .getArchivedEmployee(dateFilter, dateFilter1)
        .subscribe((res) => {
          this.apiaArchiveResponse = res.delivery;
          this.dataSource3 = new MatTableDataSource(this.apiaArchiveResponse);
          this.dataSource3.paginator = this.paginatoAarchive;
          this.dataSource3.sort = this.archiveSort;
        });
    }
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
}
