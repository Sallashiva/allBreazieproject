import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-setting-brand-drop',
  templateUrl: './setting-brand-drop.component.html',
  styleUrls: ['./setting-brand-drop.component.css']
})
export class SettingBrandDropComponent implements OnInit {

  public fName: string;
  public fIndex: any;
  constructor(private modalRef: MatDialogRef<SettingBrandDropComponent>) { }

  ngOnInit(): void {
  }
  confirm() {
    this.modalRef.close(this.fIndex);
  }
  cancel() {
    this.modalRef.close();
  }

}
