import { AfterViewInit, Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeliveriesModelComponent } from '../deliveries-model/deliveries-model.component';
import { MatTableDataSource } from '@angular/material/table';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { DeliveryResponse } from 'src/app/models/deliveriesResponse';
import { ToastrService } from 'ngx-toastr';
import { getLocaleDateTimeFormat, FormatWidth, formatDate } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { DeliveriesUpdateComponent } from 'src/app/modules/deliveries-update/deliveries-update.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RegisterService } from 'src/app/services/register.service';
import { DeliveryModelTrialComponent } from 'src/app/modules/delivery-model-trial/delivery-model-trial.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {
  deliveries: DeliveryResponse[];
  table: boolean = false;
  spinner: boolean = true;
  tables: boolean = false;
  dataSource = new MatTableDataSource([]);
  markCollected = true;
  collected = false;
  date = false;
  dateTime = new Date();
  exform: FormGroup;
  freeTrialForm: FormGroup;
  deviceId: any;
  markCollecteds = false;
  apiDeliveriesResponse: any = [];
  value: 'all'
  showFreeTrialDialog
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private deliveryService: DeliveriesService,
    private registerService: RegisterService,
    private toastr: ToastrService,
    public dialogss: MatDialog,
    private router:Router,
    @Inject(LOCALE_ID) private locale: string,
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.getUserData()
    this.getDeliveries();
    this.exform = new FormGroup({
      'collectedTime': new FormControl()
    })
    this.freeTrialForm = new FormGroup({
      'finalDate': new FormControl()
    })
    // this.dataSource.paginator = this.paginator;
  }
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort
  // }
  // deliveries: DeliveriesResponse[]

  displayedColumns: string[] = ['image', 'recepient', 'deliveryTime', 'collectedTime', 'signature', 'scan', 'Collected', 'action'];
  FreeTrial: Boolean = false
  activeStatus: Boolean = false
  getUserData() {
    this.registerService.getRegister().subscribe((res) => {
      if (!res.error) {
        if (res.registeredData.deliveryAddOn.endDate) {
          let lastDay = res.registeredData.deliveryAddOn.endDate
          let lastDate: any = new Date(lastDay);
          let todayDate: any = new Date()
          var difference = (lastDate - todayDate)
          let days = Math.ceil(difference / (1000 * 3600 * 24))
          if (days >= 0) {
            this.activeStatus = true
          } else {
            this.activeStatus = false
          }
        } else {
          this.activeStatus = false
        }
        if (res.registeredData.deliveryAddOn.deliveryFreeTrialUsed) {
          this.FreeTrial = res.registeredData.deliveryAddOn.deliveryFreeTrialUsed
        }
        if (!res.registeredData.deliveryAddOn.deliveryFreeTrialUsed && !this.activeStatus) {
          this.FreeTrial = res.registeredData.deliveryAddOn.deliveryFreeTrialUsed
          this.openDeliveryModel();
        }
      }
    })
  }


  openDeliveryModel() {
    const dialogRef = this.dialog.open(DeliveryModelTrialComponent, {
      maxWidth: '25vw',
      width: '100%',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let date = new Date();
        this.freeTrialForm.get('finalDate').setValue(date);
        this.deliveryService.addFreeTrial(this.freeTrialForm.value).subscribe(res => {
          this.getUserData()
        })
        // this.getAllVisitors();
      }
    });
  }

  openEdit(element: any) {
    const dialogRef = this.dialogss.open(DeliveriesUpdateComponent, {
      width: '25%',
      data: element,
      disableClose: true,

    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.getDeliveries();
      }
    });

  }
  openDialog() {
    const dialogRef = this.dialogss.open(DeliveriesModelComponent, {
      width: '25%',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'save') {
        this.getDeliveries();
      }
    });

  }

  notification(data) {
    this.deliveryService.notifyRecepient(data.empId, data._id).subscribe(res => {
      if (!res.error) {
        this.toastr.success(res.message);
      }
    })
  }
  // Dialog(row: any) {
  //   const dialogRef = this.dialogss.open(VisitorUpdatediologComponent, {
  //     height: '98%',
  //     width: '30%',
  //     data: row,
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       if (result === 'update') {
  //         this.getAllVisitors();
  //       }

  //     }
  //   })
  // }

  // Dialog(row: any) {
  //   const dialogRef = this.dialogss.open(EditDeliveryModuleComponent, {
  //     height: '85%',
  //     width: '30%',
  //     data: row
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.getDeliveries();
  //     }
  //   })
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filteredData.forEach(ele => {
      if (ele.recepient.trim().toLowerCase() === filterValue.trim().toLowerCase()) {
        (event.target as HTMLInputElement).value = null
      }
    })
  }

  listdata: MatTableDataSource<any>
  getDeliveries() {
    let start = 'All'
    let end = 'All'
    this.deliveryService.getDeliveries(start, end).subscribe((res) => {
      this.spinner = false;
      this.tables = true;
      this.apiDeliveriesResponse = res.delivery;
      this.dataSource = new MatTableDataSource([
        ...res.delivery
      ]);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      });

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
  onChangeDuration($event: any) {
    this.dataSource.paginator = this.paginator;
    if ($event.value == 'all') {
      let start = 'All'
      let end = 'All'
      this.deliveryService.getDeliveries(start, end).subscribe(res => {
        this.apiDeliveriesResponse = res.delivery;
        this.dataSource = new MatTableDataSource(this.apiDeliveriesResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
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
      this.deliveryService.getDeliveries(start, dateFilter).subscribe(res => {
        this.apiDeliveriesResponse = res.delivery;
        this.dataSource = new MatTableDataSource(this.apiDeliveriesResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      })
    } else if ($event.value.toLowerCase() == 'visitors2') {
      let start = new Date();
      let start1 = new Date()
      let numberOfDaysToAdd = -7;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1)
      this.deliveryService.getDeliveries(start, end).subscribe(res => {
        this.apiDeliveriesResponse = res.delivery;
        this.dataSource = new MatTableDataSource(this.apiDeliveriesResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      })
    } else if ($event.value.toLowerCase() == 'visitors3') {
      let start = new Date();
      let start1 = new Date()
      let numberOfDaysToAdd = -30;
      let end1 = start1.setDate(start1.getDate() + numberOfDaysToAdd);
      let end = new Date(end1)
      this.deliveryService.getDeliveries(start, end).subscribe(res => {
        this.apiDeliveriesResponse = res.delivery;
        this.dataSource = new MatTableDataSource(this.apiDeliveriesResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
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
      this.deliveryService.getDeliveries(end, over).subscribe(res => {
        this.apiDeliveriesResponse = res.delivery;
        this.dataSource = new MatTableDataSource(this.apiDeliveriesResponse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      })
    }
  }

  // markAsCollected() {
  //   this.formatMyDate();
  //   this.collected = true;
  //   this.markCollected = false;
  //   this.date = true;
  // }

  Collected() {
    this.collected = true;
    this.markCollected = false;
  }
  formatMyDate() {
    const format = getLocaleDateTimeFormat(this.locale, FormatWidth.Long);
    const date = formatDate(this.dateTime, 'MMMM d, y', this.locale)
    const time = formatDate(this.dateTime, 'HH:mm', this.locale)
    return format
      .replace("'", "")
      .replace("'", "")
      .replace('{1}', date)
      .replace('{0}', time)
  }

  markAsCollected(data) {
    let date = new Date();
    this.exform.get('collectedTime').setValue(date);
    this.deliveryService.collectedTime(data._id, this.exform.value).subscribe((res) => {
      if (!res.error) {
        // this.getTodayVisitor();
        // this.getVisitor();
        this.markCollecteds = true
        this.getDeliveries()
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
  onChangeStatus($event) {
    if ($event.value.toLowerCase() == 'all') {
      let filterData = _.filter(this.apiDeliveriesResponse, (iteam) => {
        return iteam
      })
      this.dataSource = new MatTableDataSource(filterData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort

    } else if ($event.value.toLowerCase() == 'collected') {
      let filterData = _.filter(this.apiDeliveriesResponse, (iteam) => {
        if (iteam.collectedTime) {
          return iteam
        }
      })
      this.dataSource = new MatTableDataSource(filterData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort

    } else if ($event.value.toLowerCase() == 'uncollected') {
      let filterData = _.filter(this.apiDeliveriesResponse, (iteam) => {
        if (!iteam.collectedTime) {
          return iteam
        }
      })
      this.dataSource = new MatTableDataSource(filterData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    }
  }
}
