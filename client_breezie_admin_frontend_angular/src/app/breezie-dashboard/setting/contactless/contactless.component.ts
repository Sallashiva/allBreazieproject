import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactlessService } from 'src/app/services/contactless.service';

@Component({
  selector: 'app-contactless',
  templateUrl: './contactless.component.html',
  styleUrls: ['./contactless.component.css']
})
export class ContactlessComponent implements OnInit {

  ContactlessForm: FormGroup;
  spinner: boolean = true;
  token: any
  myAngularxQrCode: any
  constructor(private fb: FormBuilder, private contactlessService: ContactlessService) {
    this.ContactlessForm = this.fb.group({
      generateDynamicQR: [Boolean],
      employeeInOut: [Boolean],
      requiredLocation: [Boolean],
      rememberEmployee: [Boolean]
    })
    this.token = localStorage.getItem('token');
    this.myAngularxQrCode = `https://visit-test.breazie.com/home?key=${this.token}&device=true`;

  }



  // Value: any = "http://localhost:4200/breezie-dashboard/setting/contactless"

  ngOnInit(): void {
    this.getData()
  }

  link: any
  onGenerate() {
    let valueform = document.getElementById('qr')

    this.link = valueform ?.getElementsByTagName('img')[0].getAttribute('src')

    let tag = document.createElement('a')
    // tag.href=
    tag.setAttribute('href', this.link)
    tag.setAttribute('download', 'breezie-visir-qrCode')
    tag.click()
  }

  //   async download() {
  //     const a = document.createElement("a");
  //     a.href = await toDataURL("http://serverpath/images/50.jpg");
  //     a.download = "";
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  // }
  Generate(event: any) {
    this.ContactlessForm.get('generateDynamicQR').setValue(event.checked)
    this.update()
  }


  employees: boolean = false
  employeeInOut(event: any) {
    this.ContactlessForm.get('employeeInOut').setValue(event.checked)
    this.employees = event.checked
    this.update()
  }

  location(event: any) {
    this.ContactlessForm.get('requiredLocation').setValue(event.checked)
    this.update()
  }

  employee(event: any) {
    this.ContactlessForm.get('rememberEmployee').setValue(event.checked)
    this.update()

  }
  isGenerate: boolean
  isEmpChecked: boolean
  isLocChecked: boolean
  isRemChecked: boolean
  getData() {
    this.contactlessService.getConatactless().subscribe(res => {
      this.spinner = false;
      this.ContactlessForm.get('generateDynamicQR').setValue(res.settings[0].contactLess.generateDynamicQR)
      this.ContactlessForm.get('employeeInOut').setValue(res.settings[0].contactLess.employeeInOut)
      this.ContactlessForm.get('requiredLocation').setValue(res.settings[0].contactLess.requiredLocation)
      this.ContactlessForm.get('rememberEmployee').setValue(res.settings[0].contactLess.rememberEmployee)
      this.isGenerate = res.settings[0].contactLess.generateDynamicQR
      this.isEmpChecked = res.settings[0].contactLess.employeeInOut
      this.employees = res.settings[0].contactLess.employeeInOut
      if (res.settings[0].contactLess.employeeInOut) {
        this.isLocChecked = res.settings[0].contactLess.requiredLocation
        this.isRemChecked = res.settings[0].contactLess.rememberEmployee
      } else {
        this.isLocChecked = false
        this.isRemChecked = false
      }

    })
  }

  update() {
    this.contactlessService.updateContactless(this.ContactlessForm.value).subscribe(res => {
    })
  }

  onSubmit() {

  }
}
