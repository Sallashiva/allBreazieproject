import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { EmployeeSigninPage } from '../employee-signin/employee-signin.page';
import { EmployeeSignoutPage } from '../employee-signout/employee-signout.page';
import { EmployeeService } from '../employee.service';
import { logoutResponse } from '../logoutdata/logoutResponse';
import { LogoutserviceService } from '../logoutservice.service';
import { EmployeeResponse } from './employeeResponse';

@Component({
  selector: 'app-logout',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class LogoutComponent implements OnInit, AfterViewInit {
  logoutdetails: logoutResponse[];
  spinner = true;
  table = false;
  exform: FormGroup;
  isDevice: Boolean = false;
  token: string = null;
  url: string = "home"


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(
    private logout: LogoutserviceService,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    private platform: Platform,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
  ) {
    this.exform = new FormGroup({
      finalDate: new FormControl()
    });
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data.key) {
        this.isDevice = data.device
        this.token = data.key;
        this.url = `home?key=${this.token}&device=true`
      }
    })
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.isDevice) {
        this.navController.navigateBack(`/home?key=${this.token}&device=true`);
      } else {
        this.navController.navigateBack('/home');
      }
    });
  }

  ngOnInit() {
    this.getAllEmployee();
    this.getSettings();
    this.exform = new FormGroup({
      'type': new FormControl,
      'employeeId': new FormControl,
      'time': new FormControl,
      'signedOutMessage': new FormControl,
      'isRemoteSignedIn': new FormControl
    })
  }
  signOutData:any
  signInData:any
  getSettings() {
    this.employeeService.getWelcomScreen().subscribe(res => {
      this.signOutData = res.settings[0].EmployeeSetting.signOutMessages;
      this.signInData = res.settings[0].EmployeeSetting.employeeQuestionsText;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  displayedColumns: string[] = ['SlNO', 'fullName', 'symbol','signinbutton'];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  dataSource = new MatTableDataSource([]);

  employe:any
  TotalEmployees:any
  getAllEmployee() {
    this.employeeService.getEmployee().subscribe(res => {
      setTimeout(() =>{
        this.spinner = false
      },1000)
      this.employe = res.employeeData;
      this.dataSource.sort = this.sort;
      this.TotalEmployees = res.employeeData.length
      this.dataSource = new MatTableDataSource([
        ...res.employeeData
      ]);
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator;
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }


  employeeData:any
  openSigninDialog(data) {
    // const dialogRef = this.dialog.open(EmployeeSigninPage,

    //   {width:'500px'}
    // );
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
        let date = new Date();
        this.exform.get('type').setValue("login")
        if (data.employeeId) {
          this.exform.get('employeeId').setValue(data.employeeId)
        } else {
          this.exform.get('employeeId').setValue(data._id)
        }
        this.exform.get('time').setValue(date);
        this.employeeData = this.exform.value
        if(this.signInData.length > 0) {
          this.navController.navigateRoot(['/empsignin']);
        } else {
          this.navController.navigateRoot(['/emp-camera']);
          }
        this.employeeService.setData(this.employeeData);

    //   }
    // })
  }
  employeeOutData:any
  openSinOutDialog(data) {
    // const dialogRef = this.dialog.open(EmployeeSignoutPage, {
    //   width: '24%'
    // });
    // dialogRef.afterClosed().subscribe(async result => {
    //   if (result) {
        let date = new Date();
        this.exform.get('type').setValue("logout")
        if (data.employeeId) {
          this.exform.get('employeeId').setValue(data.employeeId)
        } else {
          this.exform.get('employeeId').setValue(data._id)
        }
        this.exform.get('time').setValue(date)
         this.employeeOutData =this.exform.value
         if(this.signOutData.length > 0) {
         this.navController.navigateRoot(['empsignout']);
         } else {
          this.navController.navigateRoot(['/emp-camera']);
         }
        this.employeeService.setData(this.employeeOutData);

    //   }
    // })
  }


  checkboxLabel(row?: EmployeeResponse): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.fullName + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selection = new SelectionModel<EmployeeResponse>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
}
