import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthServiceService } from '../services/auth-service.service';


@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'customerName',
    'purchaseDate',
    'packageType',
    'duration',
    'packExpiryDate',
    'totalEarnings'
  ];

  dataSource = new MatTableDataSource<Element>();
  errorMsg!: string;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoading: boolean = false;
  constructor(private authService: AuthServiceService, private cdr: ChangeDetectorRef, private fb: FormBuilder) { }
  selection = new SelectionModel<Element>(true, []);
  revenueForm: FormGroup;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  years = [];
  days = [{ display_name: 'Today', display_value: 'today' }, { display_name: 'Yesterday', display_value: 'yesterday' }, { display_name: 'Last 15 days', display_value: 'last15' }]
  totalRevenue

  getLastFiveYears() {
    for (let i = new Date().getFullYear(); i > new Date().getFullYear() - 5; i--) {
      this.years.push(i)
    }
  }

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

  checkboxLabel(row?: Element): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  ngOnInit(): void {
    this.revenueForm = this.fb.group({
      day: new FormControl('', [Validators.required]),
      months: new FormControl('', [Validators.required]),
      years: new FormControl('', [Validators.required])
    })
    this.getLastFiveYears();
    this.getTableData()
  }

  getTableData() {
    this.isLoading = true;
    this.errorMsg = ''
    this.dataSource.data = [];
    let reqBody = {
      day: this.revenueForm.get('day').value,
      month: this.revenueForm.get('months').value ? this.months.indexOf(this.revenueForm.get('months').value)+1 : '',
      year: this.revenueForm.get('years').value
    }
    this.authService.revenueTableData(reqBody).subscribe((res) => {
      if (Array.isArray(res['modifiedData']) && res['modifiedData'].length > 0) {
        this.isLoading = false;
        this.dataSource.data = res['modifiedData'];
        this.totalRevenue = res['totalRevenue']
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } else {
        this.isLoading = false;
        this.errorMsg = "No data found"
        this.dataSource.data = [];
      }
    }, err => {
      this.isLoading = false;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.filteredData.length == 0) {
      this.errorMsg = "No records found for searched data"
    }
  }

}
