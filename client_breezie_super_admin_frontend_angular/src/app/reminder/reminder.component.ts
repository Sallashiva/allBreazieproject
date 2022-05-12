import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, SimpleChange, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-classic';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { AuthServiceService } from '../services/auth-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useClass: ReminderComponent
  }],
})
export class ReminderComponent implements OnInit,AfterViewInit{
  // items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
  displayedColumns: string[] = [
    'select',
    'customerName',
    'packageType',
    'duration',
    'packExpiryDate',
    'totalEarnings',
    'action'
  ];

  dayReminder = true;
  fifteenDaysReminder = false;
  thirtyDaysReminder = false;
  checkBoxdataEmployee: any = [];
  checkBoxdataEmployeeFifteenDays: any = [];

  uniqueArrEmployee: any = []
  exportSelected = false
  emitIsAllSelected: boolean;
  currentRow: any;
  currentTab: Number = 1;
  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef, private authService: AuthServiceService, private fb: FormBuilder, private toastr: ToastrService) {}
  showSendRemBtn: boolean | Event
  showSendRemBtn1: boolean | Event
  showSendRemBtn2: boolean | Event
  countryList = [];
  packageList = [];
  data = "";
  reminderForm: FormGroup;
  dataSource = new MatTableDataSource < Element > ();
  dataSource1 = new MatTableDataSource < Element > ();
  dataSource2 = new MatTableDataSource < Element > ();
  errorMsg!: string;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('daySort') daySort = new MatSort;
  @ViewChild('thirtyDaysSort') thirtyDaysSort = new MatSort;
  @ViewChild('fifteenDaysSort') fifteenDaysSort = new MatSort;
  @ViewChild('dayPaginator') dayPaginator: MatPaginator;
  @ViewChild('fifDaysPaginator') fifDaysPaginator: MatPaginator;
  @ViewChild('thirtyDaysPaginator') thirtyDaysPaginator: MatPaginator;
  isLoading: boolean = false;
  @ViewChildren('dataChecked') dataChecked: QueryList < MatCheckbox >
    @ViewChildren('dataChecked1') dataChecked1: QueryList < MatCheckbox >
    @ViewChildren('dataChecked2') dataChecked2: QueryList < MatCheckbox >
    @ViewChild('headerChecked') headerChecked: MatCheckbox
  @ViewChild('headerChecked1') headerChecked1: MatCheckbox
  @ViewChild('headerChecked2') headerChecked2: MatCheckbox
  @ViewChild('closeModal') closeModal: ElementRef
  selection = new SelectionModel < Element > (true, []);
  selection1 = new SelectionModel < Element > (true, []);
  selection2 = new SelectionModel < Element > (true, []);

  ngOnInit(): void {
    this.reminderForm = this.fb.group({
      select_country: new FormControl('', [Validators.required]),
      package_type: new FormControl('', Validators.required)
    })
    this.getDayReminderList();
    this.getFifDaysReminderList();
    this.getThirtyDaysReminderList();
    this.getCountryList();
    this.getPackageType();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelected1() {
    const numSelected1 = this.selection1.selected.length;
    const numRows1 = this.dataSource1.data.length;
    return numSelected1 === numRows1;
  }

  isAllSelected2() {
    const numSelected2 = this.selection2.selected.length;
    const numRows2 = this.dataSource2.data.length;
    return numSelected2 === numRows2;
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
      this.selection1.clear();
      return;
    }
    this.selection1.select(...this.dataSource1.data);
  }

  masterToggle2() {
    if (this.isAllSelected2()) {
      this.selection2.clear();
      return;
    }
    this.selection2.select(...this.dataSource2.data);
  }

  checkboxLabel(row ? : Element): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  checkboxLabel1(row ? : Element): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'}`;
  }

  checkboxLabel2(row ? : Element): string {
    if (!row) {
      return `${this.isAllSelected2() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection2.isSelected(row) ? 'deselect' : 'select'}`;
  }

  // checkboxSelected(event: MatCheckboxChange, data: QueryList<MatCheckbox>, dataSourceData: MatTableDataSource<any>, noOfDays) {
  //   let temp = data.map(ele => ele.checked === true ? true : false)
  //   if (noOfDays === 1) {
  //     if (event?.checked && temp.length === dataSourceData.data.length) {
  //       this.showSendRemBtn = true
  //     } else if (!event?.checked && temp.length === dataSourceData.data.length) {
  //       this.showSendRemBtn = false;
  //     }
  //   }
  //   else if (noOfDays === 15) {
  //     if (event?.checked && temp.length === dataSourceData.data.length) {
  //       this.showSendRemBtn = true
  //     } else if (!event?.checked && temp.length === dataSourceData.data.length) {
  //       this.showSendRemBtn = false;
  //     }
  //   }
  //   else if (noOfDays === 30) {
  //     if (event?.checked && temp.length === dataSourceData.data.length) {
  //       this.showSendRemBtn = true
  //     } else if (!event?.checked && temp.length === dataSourceData.data.length) {
  //       this.showSendRemBtn = false;
  //     }
  //   }
  // }

  checkboxSelectedFifteenDays(event, data) {
    this.checkBoxdataEmployee = [];
    data.forEach(ele => {
      if (event.checked) {
        this.exportSelected = true;
        let userdata1 = {
          customerName: ele.customerName,
          // purchaseDate:ele.purchaseDate.slice(0,10),
          packageType: ele.packageType,
          duration: ele.duration,
          packExpiryDate: ele.packExpiryDate.slice(0, 10),
          totalEarnings: ele.totalEarnings
        }
        this.checkBoxdataEmployee.push(userdata1);
      } else {
        this.exportSelected = false;
        this.checkBoxdataEmployee = []
      }
    });
    this.checkBoxdataEmployee.forEach(ele => {})
  }

  checkboxValuesRowFifteenDays(event, data) {
    console.log(data.purchaseDate.slice(0, 10));

    if (event.checked) {
      this.exportSelected = true;
      let userdata = {
        customerName: data.customerName,
        // purchaseDate:data.purchaseDate.slice(0,10),
        packageType: data.packageType,
        duration: data.duration,
        packExpiryDate: data.packExpiryDate.slice(0, 10),
        totalEarnings: data.totalEarnings
      }

      this.checkBoxdataEmployee.push(userdata);
    } else {
      if (this.checkBoxdataEmployee.length == 1) {
        this.exportSelected = false;
      }


      let removeIndex = this.checkBoxdataEmployee.findIndex(itm => itm === data);
      if (removeIndex !== -1)
        this.checkBoxdataEmployee.splice(removeIndex, 1);
    }

  }


  checkboxSelectedDaysRemaining(event, data) {
    this.checkBoxdataEmployee = [];
    data.forEach(ele => {
      if (event.checked) {
        this.exportSelected = true;
        let userdata1 = {
          customerName: ele.customerName,
          purchaseDate: ele.purchaseDate.slice(0, 10),
          packageType: ele.packageType,
          duration: ele.duration,
          packExpiryDate: ele.packExpiryDate.slice(0, 10),
          totalEarnings: ele.totalEarnings
        }
        this.checkBoxdataEmployee.push(userdata1);
      } else {
        this.exportSelected = false;
        this.checkBoxdataEmployee = []
      }
    });
    this.checkBoxdataEmployee.forEach(ele => {})
  }

  checkboxValuesRowDayRemining(event, data) {
    console.log(data.purchaseDate.slice(0, 10));

    if (event.checked) {
      this.exportSelected = true;
      let userdata = {
        customerName: data.customerName,
        purchaseDate: data.purchaseDate.slice(0, 10),
        packageType: data.packageType,
        duration: data.duration,
        packExpiryDate: data.packExpiryDate.slice(0, 10),
        totalEarnings: data.totalEarnings
      }

      this.checkBoxdataEmployee.push(userdata);
    } else {
      if (this.checkBoxdataEmployee.length == 1) {
        this.exportSelected = false;
      }


      let removeIndex = this.checkBoxdataEmployee.findIndex(itm => itm === data);
      if (removeIndex !== -1)
        this.checkBoxdataEmployee.splice(removeIndex, 1);
    }
  }

  checkboxSelectedThirtyDaysRemaining(event, data) {
    this.checkBoxdataEmployee = [];
    data.forEach(ele => {
      if (event.checked) {
        this.exportSelected = true;
        let userdata1 = {
          customerName: ele.customerName,
          purchaseDate: ele.purchaseDate.slice(0, 10),
          packageType: ele.packageType,
          duration: ele.duration,
          packExpiryDate: ele.packExpiryDate.slice(0, 10),
          totalEarnings: ele.totalEarnings
        }
        this.checkBoxdataEmployee.push(userdata1);
      } else {
        this.exportSelected = false;
        this.checkBoxdataEmployee = []
      }
    });
    this.checkBoxdataEmployee.forEach(ele => {})
  }

  checkboxValuesRowThirtyDays(event, data) {
    console.log(data.purchaseDate.slice(0, 10));

    if (event.checked) {
      this.exportSelected = true;
      let userdata = {
        customerName: data.customerName,
        purchaseDate: data.purchaseDate.slice(0, 10),
        packageType: data.packageType,
        duration: data.duration,
        packExpiryDate: data.packExpiryDate.slice(0, 10),
        totalEarnings: data.totalEarnings
      }
      this.checkBoxdataEmployee.push(userdata);
    } else {
      if (this.checkBoxdataEmployee.length == 1) {
        this.exportSelected = false;
      }
      let removeIndex = this.checkBoxdataEmployee.findIndex(itm => itm === data);
      if (removeIndex !== -1)
        this.checkBoxdataEmployee.splice(removeIndex, 1);
    }
  }

  patchToCKEditor(item) {
    this.data = item ?.template_content;
  }

  public onReady(editor) {
    editor ?.ui ?.getEditableElement() ?.parentElement ?.insertBefore(
      editor ?.ui ?.view ?.toolbar ?.element,
      // editor?.ui?.view?.toolbar?.element.setAttribute('style', 'display:none'),
      editor ?.ui ?.getEditableElement(),
      // editor.resize('100%', '300')
    );
  }
  public Editor = DecoupledEditor;


  setOfTemplates = [{
      template_name: 'Template 1',
      template_content: '<h3>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio consectetur quod ad ipsum nihil, amet sint  accusamus sunt veritatis accusamus sunt veritatis possimus.</h3>'
    },
    {
      template_name: 'Template 2',
      template_content: '<h3>Template 2</h3>'
    },
    {
      template_name: 'Template 3',
      template_content: '<h3>Template 3</h3>'
    },
    {
      template_name: 'Template 4',
      template_content: '<h3>Template 4</h3>'
    },
    {
      template_name: 'Template 5',
      template_content: '<h3>Template 5</h3>'
    }
  ];

  getTableData() {
    this.getDayReminderList();
    this.getFifDaysReminderList();
    this.getThirtyDaysReminderList();
  }

  getDayReminderList() {
    let reqBody = {
      country: this.reminderForm.get('select_country').value,
      packageId: this.reminderForm.get('package_type').value
    }
    this.isLoading = true;
    this.dataSource.data = [];
    this.errorMsg = '';
    this.authService.reminderTableData(reqBody).subscribe((res) => {
      if (Array.isArray(res['reminder']['1']) && (res['reminder']['1']).length > 0) {
        this.isLoading = false;
        this.dataSource.data = res['reminder']['1'];
        this.dataSource.paginator = this.dayPaginator;
        this.dataSource.sort = this.daySort
      } else {
        this.isLoading = false;
        this.dataSource.data = [];
        this.errorMsg = "No data found";
      }
    }, err => {
      this.isLoading = false;
      this.dataSource.data = [];
      this.errorMsg = "Sorry, Something went wrong";
    })
  }

  getFifDaysReminderList() {
    let reqBody = {
      country: this.reminderForm.get('select_country').value,
      packageId: this.reminderForm.get('package_type').value
    }
    this.isLoading = true;
    this.dataSource1.data = [];
    this.errorMsg = '';
    this.authService.reminderTableData(reqBody).subscribe((res) => {
      if (Array.isArray(res['reminder']['15']) && (res['reminder']['15']).length > 0) {
        this.isLoading = false;
        this.dataSource1.data = res['reminder']['15'];
        this.dataSource1.paginator = this.fifDaysPaginator;
        this.dataSource1.sort = this.fifteenDaysSort
      } else {
        this.isLoading = false;
        this.dataSource1.data = [];
        this.errorMsg = "No data found";
      }
    }, err => {
      this.isLoading = false;
      this.dataSource1.data = [];
      this.errorMsg = "Sorry, Something went wrong";
    })
  }

  getThirtyDaysReminderList() {
    let reqBody = {
      country: this.reminderForm.get('select_country').value,
      packageId: this.reminderForm.get('package_type').value
    }
    this.isLoading = true;
    this.dataSource2.data = [];
    this.errorMsg = '';
    this.authService.reminderTableData(reqBody).subscribe((res) => {
      if (Array.isArray(res['reminder']['30']) && (res['reminder']['30']).length > 0) {
        this.isLoading = false;
        this.dataSource2.data = res['reminder']['30'];
        this.dataSource2.paginator = this.thirtyDaysPaginator;
        this.dataSource2.sort = this.thirtyDaysSort
      } else {
        this.isLoading = false;
        this.dataSource2.data = [];
        this.errorMsg = "No data found";
      }
    }, err => {
      this.isLoading = false;
      this.dataSource2.data = [];
      this.errorMsg = "Sorry, Something went wrong";
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource1.filter = filterValue.trim().toLowerCase();
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.filteredData.length == 0 && this.dataSource1.filteredData.length == 0 && this.dataSource2.filteredData.length == 0) {
      this.errorMsg = "No records found for searched data"
    }
  }

  getCountryList() {
    this.authService.CountryData().subscribe((res: Array < any > ) => {
      this.countryList = res;
    }, err => {})
  }

  getPackageType() {
    this.authService.packageTypeList().subscribe((res: Array < any > ) => {
      this.packageList = res;
    }, err => {})
  }

  selectedRemainder(row) {
    this.currentRow = row
  }
  ngAfterViewInit() {
  
    this.dataSource.sort = this.daySort;
    this.dataSource1.sort=this.fifteenDaysSort;
    this.dataSource2.sort=this.thirtyDaysSort;
  }

  selectedTab(currentTabId) {
    this.currentTab = currentTabId
  }

  sendReminder() {
    let reqBody = {
      userIds: this.currentRow.map(ele => ele.userId),
      template: this.data
    }
    this.authService.sendReminder(reqBody).subscribe(res => {
      this.toastr.success("Reminder has been sent");
      setTimeout(() => {
        this.data = null;
        this.toastr.clear();
        this.closeModal.nativeElement.click();
      }, 1000);
    }, err => {
      this.toastr.error("Failed sending the reminder");
    })
  }

  resetSelectedAll() {
    this.showSendRemBtn = false;
    this.headerChecked.checked = false;
    this.headerChecked1.checked = false;
    this.headerChecked2.checked = false;
    this.dataChecked.forEach(ele => ele.checked = false)
    this.dataChecked1.forEach(ele => ele.checked = false)
    this.dataChecked2.forEach(ele => ele.checked = false)
  }


  downloadEXCELDayReminder() {
    // console.log(12345);
    this.dayReminder = true;
    this.fifteenDaysReminder = false;
    this.thirtyDaysReminder = false;

    let nonDuplicateCheckBoxValueEmployee = [...new Set(this.checkBoxdataEmployee)];
    this.uniqueArrEmployee = nonDuplicateCheckBoxValueEmployee
    this.uniqueArrEmployee.forEach((ele) => {

      console.log(ele.created_at);

      delete ele.SlNo,
        delete ele.created_at,
        delete ele.locationId,
        delete ele.userId,
        delete ele.__v,
        delete ele._id,
        delete ele.deliveryIds,
        delete ele.role,
        delete ele.defaultAdmin,
        delete ele.isRemoteUser,
        delete ele.isDeliveryPerson,
        delete ele.isAnonymized,
        delete ele.isArchived
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
    const fileName = "Breeze_employees_" + mm + '-' + dd + '-' + yyyy + '-' + hh + '-' + MM + '-' + ampm + ".xlsx";
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uniqueArrEmployee);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "test");
    XLSX.writeFile(wb, fileName);
    this.toastr.success("downloaded successfuly")
    this.selection.clear();
    window.location.reload();
  }

  downloadEXCELFifteenDays() {
    console.log("jhg");
    this.dayReminder = false;
    this.fifteenDaysReminder = true;
    this.thirtyDaysReminder = false;
    let nonDuplicateCheckBoxValueEmployee = [...new Set(this.checkBoxdataEmployeeFifteenDays)];
    this.uniqueArrEmployee = nonDuplicateCheckBoxValueEmployee
    this.uniqueArrEmployee.forEach((ele) => {

      console.log(ele.created_at);

      delete ele.SlNo,
        delete ele.created_at,
        delete ele.locationId,
        delete ele.userId,
        delete ele.__v
      delete ele._id,
        delete ele.deliveryIds,
        delete ele.role,
        delete ele.defaultAdmin,
        delete ele.isRemoteUser,
        delete ele.isDeliveryPerson,
        delete ele.isAnonymized,
        delete ele.isArchived
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
    const fileName = "Breeze_employees_" + mm + '-' + dd + '-' + yyyy + '-' + hh + '-' + MM + '-' + ampm + ".xlsx";
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uniqueArrEmployee);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "test");
    XLSX.writeFile(wb, fileName);
    this.toastr.success("downloaded successfuly");
    this.selection1.clear();
    window.location.reload();
  }

  downloadEXCELThirtyDays() {
    console.log(987);
    this.dayReminder = false;
    this.fifteenDaysReminder = false;
    this.thirtyDaysReminder = true;

    let nonDuplicateCheckBoxValueEmployee = [...new Set(this.checkBoxdataEmployee)];
    this.uniqueArrEmployee = nonDuplicateCheckBoxValueEmployee
    this.uniqueArrEmployee.forEach((ele) => {

      console.log(ele.created_at);

      delete ele.SlNo,
        delete ele.created_at,
        delete ele.locationId,
        delete ele.userId,
        delete ele.__v
      delete ele._id,
        delete ele.deliveryIds,
        delete ele.role,
        delete ele.defaultAdmin,
        delete ele.isRemoteUser,
        delete ele.isDeliveryPerson,
        delete ele.isAnonymized,
        delete ele.isArchived
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
    const fileName = "Breeze_employees_" + mm + '-' + dd + '-' + yyyy + '-' + hh + '-' + MM + '-' + ampm + ".xlsx";
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uniqueArrEmployee);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "test");
    XLSX.writeFile(wb, fileName);
    this.toastr.success("downloaded successfuly")
    this.selection2.clear();
    window.location.reload();


  }

  savePDF() {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const reminderPdf = "Reminder_Pdf_List_" + today.toLocaleDateString() + ".pdf"
    let tableBody: any[] = (this.currentTab === 1 ? this.dataSource.data : this.currentTab === 15 ? this.dataSource1.data : this.currentTab === 30 ? this.dataSource2.data : [])
    tableBody = tableBody ?.map((ele: any) => {
      return {
        customerName: ele ?.customerName,
        packExpiryDate: moment(ele ?.packExpiryDate).format('DD/MM/yyyy'),
        packageType: ele ?.packageType,
        duration: ele ?.duration,
        purchaseDate: moment(ele ?.purchaseDate).format('DD/MM/yyyy'),
        totalEarnings: ele ?.totalEarnings
      }
    })
    tableBody = tableBody ?.map(ele => Object ?.values(ele))
    let tableHeaders: any[] = (this.currentTab === 1 ? this.dataSource.data : this.currentTab === 15 ? this.dataSource1.data : this.currentTab === 30 ? this.dataSource2.data : [])
    tableHeaders = tableHeaders ?.length > 0 ? Object ?.keys(tableHeaders[0]) : []
    tableHeaders ?.splice(0, 1);
    tableHeaders = tableHeaders ?.map(ele => ele[0] ?.toUpperCase() + ele ?.substring(1, ele ?.length))
    const doc = new jsPDF()
    autoTable(doc, {
      head: [tableHeaders],
      body: tableBody,
      horizontalPageBreak: true
    })
    doc.save(reminderPdf)
  }

}
