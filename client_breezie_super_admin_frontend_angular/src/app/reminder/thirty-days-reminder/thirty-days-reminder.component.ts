import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


export interface Element {
  customer_name: string;
  package_type: string;
  no_of_login: string;
  pack_expiration_date: string;
  total_earnings: string;
}

const ELEMENT_DATA: Element[] = [
  {
    customer_name: 'Naruto',
    package_type: 'Annual',
    no_of_login: '5 / day',
    pack_expiration_date: '10 Feb 2023',
    total_earnings: '2,00,000/-',
  },
  {
    customer_name: 'Naruto',
    package_type: 'Quarterly',
    no_of_login: '5 / day',
    pack_expiration_date: '10 Feb 2023',
    total_earnings: '2,00,000/-',
  },
  {
    customer_name: 'Naruto',
    package_type: 'Monthly',
    no_of_login: '5 / day',
    pack_expiration_date: '10 Feb 2023',
    total_earnings: '2,00,000/-',
  },
  {
    customer_name: 'Naruto',
    package_type: 'Annual',
    no_of_login: '5 / day',
    pack_expiration_date: '10 Feb 2023',
    total_earnings: '2,00,000/-',
  },
];

@Component({
  selector: 'app-thirty-days-reminder',
  templateUrl: './thirty-days-reminder.component.html',
  styleUrls: ['./thirty-days-reminder.component.css']
})
export class ThirtyDaysReminderComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'customer_name',
    'package_type',
    'no_of_login',
    'pack_expiration_date',
    'total_earnings',
    'action'
  ];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  errorMsg!: string;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('thirtyDaysSort') thirtyDaysSort = new MatSort;
  isLoading: boolean = false;
  numSelected: number;
  numRows: number;
  constructor() { }
  selection = new SelectionModel<Element>(true, []);
  @Output() emitIsAllSelected = new EventEmitter<any>();
  @ViewChildren('dataChecked') dataChecked: QueryList<MatCheckbox>

  isAllSelected() {
    this.numSelected = this.selection.selected.length;
    this.numRows = this.dataSource.data.length;
    return this.numSelected === this.numRows;
  }

  emitData(event: MatCheckboxChange) {
    let temp = this.dataChecked.filter(ele => ele.checked === true ? true : false)
    if (event?.checked || temp.length === this.dataSource.data.length) {
      this.emitIsAllSelected.emit(true);
    } else {
      this.emitIsAllSelected.emit(false);
    }
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
  }

}
