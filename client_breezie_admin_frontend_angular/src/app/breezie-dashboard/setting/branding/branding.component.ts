import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Color } from 'jspdf-autotable';
import { SettingBrandingService } from 'src/app/services/setting-branding.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.css']
})
export class BrandingComponent implements OnInit {
  addImagesForm: FormGroup
  isProject: boolean = true;
  isActiveProject: boolean = true;
  color = "#0000"
  files = [];
  spinner: boolean = true;
  selected = 'domain';
  @ViewChild('brandColor') brandColor: Color

  constructor(private fb: FormBuilder, private settingbranding: SettingBrandingService, private toastr: ToastrService,) {

  }

  ngOnInit(): void {
    this.addImagesForm = this.fb.group({
      brandColor: [''],
      selectedValues: [''],
      idBadge: [' ']
    })
    this.getSettings()
    this.getLogo()
  }
  // files: File[] = [];

  colorChange(color) {
    document.getElementById('backGround').style.backgroundColor = this.color;
    this.settingbranding.updateBarndColor(this.color).subscribe(res => {

    })
  }
  selectedOne

  getSettings() {
    this.settingbranding.getSettings().subscribe(res => {
      this.spinner = false;
      document.getElementById('backGround').style.backgroundColor = res.settings[0].branding.brandColor;
      this.color = res.settings[0].branding.brandColor;
      // this.addImagesForm.get('idBadge').setValue('Id Badge')
    })
  }

  onSelect(event) {
    if (event.addedFiles[0].size >= 2000000) {
      this.toastr.error('Select less than 2MB Image')
    } else {
      let idBadge = "false";
      let email = "false";
      let contactless = "false"
      this.settingbranding.addCompanyLogo(event.addedFiles[0], idBadge, email, contactless).subscribe(res => {
        this.getLogo()
      })
    }
    // this.files.push(...event.addedFiles);
  }


  onRemove(event) {
    this.settingbranding.deleteCompanyLogo(event).subscribe((res) => {
      this.getLogo()
    })
    // this.files.splice(this.files.indexOf(event), 1);
  }



  getLogo() {
    this.settingbranding.getCompanyLogo().subscribe(res => {

      this.files = res.response
    })
  }




  // onFormSubmit() {
  // }
  Project() {
    this.isProject = !this.isProject
  }

  activeProject() {
    this.isActiveProject = !this.isActiveProject
  }

  onFormSubmit() {
  }

  selectValue: any
  idBadge: any
  email: any
  contactless: any
  selectId: any
  onChangeEmployeesSelect(id) {
    this.selectValue = "efwe"
    this.selectId = id
    this.settingbranding.selectValue(id, this.selectValue).subscribe((res) => {
      this.getLogo()
    })
  }
}
