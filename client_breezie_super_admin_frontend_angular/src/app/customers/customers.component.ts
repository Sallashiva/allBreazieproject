import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthServiceService } from '../services/auth-service.service';
import * as XLSX from 'xlsx';
import autoTable, { RowInput } from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as moment from 'moment';
import{ExcelService}from '../services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { TableUtil } from "./tableUtil";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit,AfterViewInit{
  displayedColumns: string[] = [
    'select',
    'customerName',
    'purchaseDate',
    'packageType',
    'duration',
    'packExpiryDate',
    'totalEarnings',
  ];
  dataSourceActive = new MatTableDataSource<Element>();
  dataSourceNonActive = new MatTableDataSource<Element>();
  dataSourceUnRegistered = new MatTableDataSource<any>();
  errorMsg!: string;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('activeSort') activeSort = new MatSort;
  @ViewChild('nonActiveSort') nonActiveSort = new MatSort;
  @ViewChild('activePaginator') activePaginator: MatPaginator;
  @ViewChild('nonactivePaginator') nonactivePaginator: MatPaginator;
  @ViewChild('unRegisteredPaginator') unRegisteredPaginator: MatPaginator
  @ViewChildren('dataChecked') dataChecked: QueryList<MatCheckbox>
  @ViewChildren('dataChecked1') dataChecked1: QueryList<MatCheckbox>
  @ViewChildren('dataChecked2') dataChecked2: QueryList<MatCheckbox>
  @ViewChild('headerChecked') headerChecked: MatCheckbox
  @ViewChild('headerChecked1') headerChecked1: MatCheckbox
  @ViewChild('headerChecked2') headerChecked2: MatCheckbox
  isLoading: boolean = false;
  selection = new SelectionModel<Element>(true, []);
  selection1 = new SelectionModel<Element>(true, []);
  selection2 = new SelectionModel<Element>(true, []);
  downloadForNonActive=false
  customerForm: FormGroup;
  countryList = [];
  packageList = [];
  checkBoxdataEmployee: any = [];
  exportSelected = false;
  disabledbutton = true;
  currentRow: any;
  currentTab: String = '';
  uniqueArrEmployee: any = []
  constructor(private fb: FormBuilder, private authService: AuthServiceService,
    private toastr:ToastrService, private  excelService:ExcelService) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      select_country: new FormControl('', [Validators.required]),
      package_type: new FormControl('', [Validators.required]),
    })
    this.activeCustomerData();
    this.nonActiveCustomerData();
    this.unRegisteredCustomerData();
    this.getCountryList();
    this.getPackageType();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceActive.data.length;
    return numSelected === numRows;
  }

  isAllSelected1() {
    const numSelected1 = this.selection1.selected.length;
    const numRows1 = this.dataSourceNonActive.data.length;
    return numSelected1 === numRows1;
  }

  isAllSelected2() {
    const numSelected2 = this.selection2.selected.length;
    const numRows2 = this.dataSourceUnRegistered.data.length;
    return numSelected2 === numRows2;
  }
 
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSourceActive.data);
  }

  masterToggle1() {
    if (this.isAllSelected1()) {
      this.selection1.clear();
      return;
    }
    this.selection1.select(...this.dataSourceNonActive.data);
  }

  masterToggle2() {
    if (this.isAllSelected()) {
      this.selection2.clear();
      return;
    }
    this.selection2.select(...this.dataSourceUnRegistered.data);
  }

  checkboxLabel(row?: Element): string {
    if (!row) {
      return `${this.isAllSelected()? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row)? 'deselect' : 'select'}`;
  }

  checkboxLabel1(row?: Element): string {
    if (!row) {
      return `${this.isAllSelected1()? 'deselect' : 'select'} all`;
    }
    return `${this.selection1.isSelected(row)? 'deselect' : 'select'}`;
  }

  checkboxLabel2(row?: Element): string {
    if (!row) {
      return `${this.isAllSelected2()? 'deselect' : 'select'} all`;
    }
    return `${this.selection2.isSelected(row)? 'deselect' : 'select'}`;
  }

  resetSelectedAll() {
    this.headerChecked.checked = false;
    this.headerChecked1.checked = false;
    this, this.headerChecked2.checked = false;
    this.dataChecked.forEach(ele => ele.checked = false);
    this.dataChecked1.forEach(ele => ele.checked = false);
    this.dataChecked2.forEach(ele => ele.checked = false);
  }

  getTableData() {
    this.activeCustomerData();
    this.nonActiveCustomerData();
    this.unRegisteredCustomerData();

  }

  activeCustomerData() {
    let reqBody = {
      country: this.customerForm.get('select_country').value,
      packageId: this.customerForm.get('package_type').value
    }  
    this.isLoading = true;
    this.dataSourceActive.data = [];
    this.dataSourceActive.paginator = null;
    this.dataSourceActive.sort = null;
    this.errorMsg = ''
    this.authService.customersTableData(reqBody).subscribe((res) => {
      if (Array.isArray(res['active']) && res['active'].length > 0) {
        this.isLoading = false;
        this.dataSourceActive.data = res['active'];
        setTimeout(() => {
          // this.dataSourceActive.sort = this.sort;
          this.dataSourceActive.sort = this.activeSort;
          this.dataSourceActive.paginator = this.activePaginator;
        });

      } else {
        this.isLoading = false;
        this.errorMsg = "No data found";
        this.dataSourceActive.data = [];
      }
    }, err => {
      this.isLoading = false;
    })
  }

  nonActiveCustomerData() {
    let reqBody = {
      country: this.customerForm.get('select_country').value,
      packageId: this.customerForm.get('package_type').value
    }
    this.isLoading = true;
    this.dataSourceNonActive.data = [];
    this.dataSourceNonActive.paginator = null;
    this.dataSourceNonActive.sort = null;
    this.errorMsg = ''
    this.authService.customersTableData(reqBody).subscribe((res) => {
      if (Array.isArray(res['nonactive']) && res['nonactive'].length > 0) {
        this.isLoading = false;
        this.dataSourceNonActive.data = res['nonactive'];
        setTimeout(() => {
          // this.dataSourceNonActive.sort = this.sort;
          this.dataSourceNonActive.sort = this.nonActiveSort;
          this.dataSourceNonActive.paginator = this.nonactivePaginator;
        });
      } else {
        this.isLoading = false;
        this.errorMsg = "No data found";
        this.dataSourceNonActive.data = [];
      }
    }, err => {
      this.isLoading = false;
    })
  }


  ngAfterViewInit() {
  
    this.dataSourceNonActive.sort = this.nonActiveSort;
  }

  unRegisteredCustomerData() {
    let reqBody = {
      country: this.customerForm.get('select_country').value,
      packageId: this.customerForm.get('package_type').value
    }
    this.isLoading = true;
    this.dataSourceUnRegistered.data = [];
    this.dataSourceUnRegistered.paginator = null;
    this.dataSourceUnRegistered.sort = null;
    this.errorMsg = ''
    this.authService.customersTableData(reqBody).subscribe((res) => {
      if (Array.isArray(res['unregistered']) && res['unregistered'].length > 0) {
        this.isLoading = false;
        this.dataSourceUnRegistered.data = res['unregistered'];
        setTimeout(() => {
          // this.dataSourceUnRegistered.sort = this.sort;
          this.dataSourceNonActive.sort = this.nonActiveSort;
          this.dataSourceUnRegistered.paginator = this.unRegisteredPaginator;
        });
      } else {
        this.isLoading = false;
        this.errorMsg = "No data found";
        this.dataSourceUnRegistered.data = [];
      }
    }, err => {
      this.isLoading = false;
    })
  }

  getCountryList() {
    this.authService.CountryData().subscribe((res: Array<any>) => {
      this.countryList = res;
    }, err => {
    })
  }

  getPackageType() {
    this.authService.packageTypeList().subscribe((res: Array<any>) => {
      this.packageList = res;
    }, err => {
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceActive.filter = filterValue.trim().toLowerCase();
    this.dataSourceNonActive.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceActive.filteredData.length == 0 && this.dataSourceNonActive.filteredData.length == 0 && this.dataSourceUnRegistered.filteredData.length == 0) {
      this.errorMsg = "No records found for searched data"
    }
  }


  selectedTab(currentTabId) {
    this.currentTab = currentTabId
  }
  uniqueArr=[];
  downloadEXCEL() {
    // this.excelService.exportAsExcelFile(this.dataSourceActive.data, 'sample');
    // TableUtil.exportTableToExcel("excel-table");
    let nonDuplicateCheckBoxValue = [...new Set(this.dataSourceActive.data)];
    this.uniqueArr = nonDuplicateCheckBoxValue
    this.uniqueArr.forEach((ele) => {
      delete ele.userId,
      delete ele.customerType
       
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
    this.disabledbutton = true;
    this.checkBoxdataEmployee = []
  }
  getCheckboxValuesAllEmployee(event, data) {
    this.checkBoxdataEmployee = [];
    data.forEach(ele => {
      if (event.checked) {
        this.exportSelected = true;
        this.disabledbutton = false;
          this.checkBoxdataEmployee.push(ele);
      } else {
        this.exportSelected = false;
        this.disabledbutton = true
        this.checkBoxdataEmployee = []
      }
    });
  }

  moduleCustomerData:any
  checkboxValuesEmployeeRow(event, data) {
    this.moduleCustomerData = data
    if (event.checked) {
      this.exportSelected = true;
      this.disabledbutton = false;
      this.checkBoxdataEmployee.push(data);
    } else {
      if (this.checkBoxdataEmployee.length == 1) {
        this.exportSelected = false;
        this.disabledbutton = true
      }
      let removeIndex = this.checkBoxdataEmployee.findIndex(itm => itm === data);
      if (removeIndex !== -1)
        this.checkBoxdataEmployee.splice(removeIndex, 1);
    }

  }
  // getCheckboxValuesAllEmployee(event, data) {
  //   this.checkBoxdataEmployee = [];
  //   data.forEach(ele => {
  //     if (event.checked) {
  //       this.exportSelected = true;
  //       let userdata1={
  //         customerName:ele.customerName,
  //         purchaseDate:ele.purchaseDate.slice(0,10),
  //         packageType:ele.packageType,
  //         duration:ele.duration,
  //         packExpiryDate:ele.packExpiryDate.slice(0,10),
  //         totalEarnings:ele.totalEarnings
  //       }
  //       this.checkBoxdataEmployee.push(userdata1);
  //     } else {
  //       this.exportSelected = false;
  //       this.checkBoxdataEmployee = []
  //     }
  //   });
  //   this.checkBoxdataEmployee.forEach(ele => {
  //   })
  // }


  // checkboxValuesEmployeeRow(event, data) {
  //   if (event.checked) {
  //     this.exportSelected = true;
  //     let userdata={
  //       customerName:data.customerName,
  //         purchaseDate:data.purchaseDate.slice(0,10),
  //         packageType:data.packageType,
  //         duration:data.duration,
  //         packExpiryDate:data.packExpiryDate.slice(0,10),
  //         totalEarnings:data.totalEarnings
  //     }

  //     this.checkBoxdataEmployee.push(userdata);
  //   } else {
  //     if (this.checkBoxdataEmployee.length == 1) {
  //       this.exportSelected = false;
  //     }


  //     let removeIndex = this.checkBoxdataEmployee.findIndex(itm => itm === data);
  //     if (removeIndex !== -1)
  //       this.checkBoxdataEmployee.splice(removeIndex, 1);
  //   }

  // }

  getCheckboxValuesAllEmployeeNonActive(event, data) {
    this.checkBoxNonActiveDataEmloyee = [];
    data.forEach(ele => {
      if (event.checked) {
        this.exportSelected = true;
        this.checkBoxNonActiveDataEmloyee.push(ele);
      } else {
        this.exportSelected = false;
        this.checkBoxNonActiveDataEmloyee = []
      }
    });
  }
 checkBoxNonActiveDataEmloyee:any=[];

  checkboxValuesEmployeeRowNonActive(event, data) {
    console.log(data.purchaseDate.slice(0,10));
    if (event.checked) {
      this.exportSelected = true;

      this.checkBoxNonActiveDataEmloyee.push(data);
    } else {
      if (this.checkBoxNonActiveDataEmloyee.length == 1) {
        this.exportSelected = false;
      }
      let removeIndex = this.checkBoxNonActiveDataEmloyee.findIndex(itm => itm === data);
      if (removeIndex !== -1)
        this.checkBoxNonActiveDataEmloyee.splice(removeIndex, 1);
    }

  }


  savePDF() {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const customerPdf = "Customer_Pdf_List_" + today.toLocaleDateString() + ".pdf"
    let tableBody: RowInput[] = (this.currentTab === 'active'? this.dataSourceActive.data : this.currentTab === 'nonactive'? this.dataSourceNonActive.data : this.currentTab === 'unregistered'? this.dataSourceUnRegistered.data : [])
    tableBody = tableBody?.map((ele: any) => {
      return { customerName: ele?.customerName, packExpiryDate: moment(ele?.packExpiryDate).format('DD/MM/yyyy'), packageType: ele?.packageType, duration: ele?.duration, purchaseDate: moment(ele?.purchaseDate).format('DD/MM/yyyy'), totalEarnings: ele?.totalEarnings }
    })
    tableBody = tableBody?.map(ele => Object.values(ele))
    let tableHeaders: any[] = (this.currentTab === 'active'? this.dataSourceActive.data : this.currentTab === 'nonactive'? this.dataSourceNonActive.data : this.currentTab === 'unregistered'? this.dataSourceUnRegistered.data : [])
    tableHeaders = tableHeaders?.length > 0? Object?.keys(tableHeaders[0]) : []
    tableHeaders?.splice(0, 1);
    tableHeaders = tableHeaders?.map(ele => ele[0]?.toUpperCase() + ele?.substring(1, ele?.length))
    const doc = new jsPDF()
    autoTable(doc, {
      head: [tableHeaders],
      body: tableBody,
      horizontalPageBreak: true
    })
    doc.save(customerPdf)
  }

}
