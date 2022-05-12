import { T } from '@angular/cdk/keycodes';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { ToastrService } from 'ngx-toastr';
import { SettingVisitorFieldsService } from 'src/app/services/setting-visitor-fields.service';
import { WelcomeScreenService } from 'src/app/services/welcome-screen.service';

@Component({
  selector: 'app-visitor-fields',
  templateUrl: './visitor-fields.component.html',
  styleUrls: ['./visitor-fields.component.css']
})
export class VisitorFieldsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  headOfficeHide: boolean = false;
  newAgreementHide: boolean = false;
  noAgreementHide: boolean = true;
  show = false
  showAgreement = false
  showVisitorFiled = false
  panelOpenState = false;
  visitorField = false;
  questionButtons: boolean = false;
  text: boolean = false;
  phone: boolean = false;
  selectedAgreement;
  selectedFeilds;
  spinner: boolean = true;
  visitorFieldForm: FormGroup
  texts: boolean = true
  companyLabel = "Company Name"
  arr: FormArray;
  checkboxarr: FormArray;
  visitorFields: Array<any>
  updateVisitorFields: Array<any>
  isNextDisabled: boolean = true;
  isTextDisabled: boolean = true;
  isBirthDisabled: boolean = true;
  isPhoneBtnDisabled: boolean = true;
  isEmailDisabled: boolean = true;
  isCheckboxDisabled: boolean = true;
  isYesDisabled: boolean = true;
  isVaccineDisabled: boolean = true;






  constructor(private fb: FormBuilder,
    private visitorService: SettingVisitorFieldsService,
    private toastr: ToastrService,
    private welcomeScree: WelcomeScreenService) {
    this.addEmails = [];
    this.addPhone = [];
    this.email = [];
    this.DateofBirth = [];
    this.multiChoice = [];
    this.checkbox = [];
    this.yes = [];
    // this.document=[];
    this.vaccine = [];
    this.addCategory = [];
  }

  ngOnInit(): void {
    this.visitorFieldForm = this.fb.group({
      selectedAgreement: new FormControl('', [Validators.required]),
      selectedFeilds: new FormControl(''),
      check: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required, Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/)]),
      // textresponse:new FormControl('',[Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/)]),
      phonerequired: new FormControl('', [Validators.required]),
      // phoneresponse:new FormControl('',[Validators.required]),
      emailCheck: new FormControl('', [Validators.required]),
      // emailResponse:new FormControl('',[Validators.required]),
      birth: new FormControl('', [Validators.required, Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/)]),
      dateCheck: new FormControl('', [Validators.required]),
      // dateResponse:new FormControl('',[Validators.required]),
      multi: new FormControl('', [Validators.required, Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/)]),
      multi1: new FormControl('', [Validators.required, Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/)]),
      // multi1Check:new FormControl('',[Validators.required]),
      hideInactiveFields: new FormControl('false'),
      multiRequire: new FormControl('', [Validators.required]),
      // multiResponce:new FormControl('',[Validators.required]),
      checkbox: new FormControl('', [Validators.required]),
      checkboxinput: new FormControl('', [Validators.required]),
      fieldCheck: new FormControl('', [Validators.required]),
      requiredCheck: new FormControl('', [Validators.required]),
      // responseCheck:new FormControl('',[Validators.required]),
      yes: new FormControl('', [Validators.required, Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/)]),
      yesRequire: new FormControl('', [Validators.required]),
      // yesResponce:new FormControl('',[Validators.required]),
      yesCheck: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.required]),
      fieldName: new FormControl('', [Validators.required]),
      fieldCheck2: new FormControl(''),
      documentTextBox: new FormControl('', [Validators.required]),
      documentRequire: new FormControl('', [Validators.required]),
      documetApprove: new FormControl('', [Validators.required]),
      vaccvalidation: new FormControl('', [Validators.required, Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/)]),
      vaccines: new FormControl('', [Validators.required]),
      vaccine1: new FormControl('', [Validators.required, Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/)]),
      vaccineRequire: new FormControl('', [Validators.required]),
      vaccineValidated: new FormControl('', [Validators.required]),
      companyLabel: new FormControl('', [Validators.required]),
      companyCheck: new FormControl('', [Validators.required]),
      arr: this.fb.array([this.createItem()]),
      checkboxarr: this.fb.array([this.createCheckBox()])
    })
    this.getAllData();
    setTimeout(() => {
      this.visitorFieldForm.patchValue({
        selectedAgreement: this.agreementData
      })
    }, 500)
    this.visitorFieldForm.get('companyLabel').setValue({
      companyLabel: this.companyLabel
    })

  }
  finalValidate: boolean
  ngAfterViewInit() {
    this.visitorFieldForm.get('text').valueChanges.subscribe((v) => {
      if (this.visitorFieldForm.get('text').valid) {
        this.isTextDisabled = false;
      } else {
        this.isTextDisabled = true;
      }
    });
    this.visitorFieldForm.get('phone').valueChanges.subscribe((v) => {
      if (this.visitorFieldForm.get('phone').valid) {
        this.isPhoneBtnDisabled = false;
      } else {
        this.isPhoneBtnDisabled = true;
      }
    });
    this.visitorFieldForm.get('email').valueChanges.subscribe((v) => {
      if (this.visitorFieldForm.get('email').valid) {
        this.isEmailDisabled = false;
      } else {
        this.isEmailDisabled = true;
      }
    });
    this.visitorFieldForm.get('birth').valueChanges.subscribe((v) => {
      if (this.visitorFieldForm.get('birth').valid) {
        this.isBirthDisabled = false;
      } else {
        this.isBirthDisabled = true;
      }
    });

    this.visitorFieldForm.valueChanges.subscribe((v) => {
      let findData = (this.visitorFieldForm.get('arr') as FormArray).controls

      findData.forEach((v, i) => {
        if (this.visitorFieldForm.get('multi').valid && ((this.visitorFieldForm.get('arr') as FormArray).controls[i] as FormGroup).get('multi1').valid) {
          this.isNextDisabled = false;
        } else {
          this.isNextDisabled = true;
        }
      })
    });

    this.visitorFieldForm.get('checkbox').valueChanges.subscribe((v) => {
      if (this.visitorFieldForm.get('checkbox').valid) {
        this.isCheckboxDisabled = false;
      } else {
        this.isCheckboxDisabled = true;
      }
    });
    this.visitorFieldForm.get('yes').valueChanges.subscribe((v) => {
      if (this.visitorFieldForm.get('yes').valid) {
        this.isYesDisabled = false;
      } else {
        this.isYesDisabled = true;
      }
    });
    this.visitorFieldForm.get('vaccvalidation').valueChanges.subscribe((v) => {
      if (this.visitorFieldForm.get('vaccvalidation').valid) {
        this.isVaccineDisabled = false;
      } else {
        this.isVaccineDisabled = true;
      }
    });
  }

  agreementData: any
  getAllData() {
    this.welcomeScree.getWelcomScreen().subscribe(res => {
      this.spinner = false
      this.agreementData = res.settings[0].visitorFieldSetting.agreement
      this.updateVisitorFields = res.settings[0].visitorFieldSetting.addFields

      this.updateVisitorFields.forEach(ele => {
        if (ele.type === "text") {
          this.addEmails.push(ele)
        }
        if (ele.type === "email") {
          this.email.push(ele)
        }
        if (ele.type === "date") {
          this.DateofBirth.push(ele)
        }
        if (ele.type === "number") {
          this.addPhone.push(ele)
        }
        if (ele.type === "radio") {
          this.multiChoice.push(ele)
        }
        if (ele.type === "yes") {
          this.yes.push(ele)
        }
        if (ele.type === "checkBox") {
          this.checkbox.push(ele)
        }
        if (ele.type === "vaccine") {
          this.vaccine.push(ele)
        }
      })
    })
  }
  createItem() {
    return this.fb.group({
      multi1: ['', [Validators.required]],
      multiCheckBox: [false],
      multi1Check: [false]
    })
  }
  addItem() {
    this.arr = this.visitorFieldForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }
  //checkbox
  createCheckBox() {
    return this.fb.group({
      fieldName: [''],
      fieldCheck2: [false],
    })
  }
  addCheckboxOption() {
    this.checkboxarr = this.visitorFieldForm.get('checkboxarr') as FormArray;
    this.checkboxarr.push(this.createCheckBox());
  }

  textField() {
    this.phone = !this.phone
    this.text = false;

  }
  phoneNumber() {
    this.phone = true;
  }

  //category
  addCategory: Array<any>;
  addItemsCategory(input, addCategory, host, catering) {
    this.texts = false
    if (addCategory !== null) {
      let category = {
        textValue: addCategory,
        hostchecked: host._checked,
        cateringchecked: catering._checked
      }
      if (host._checked === true || catering._checked === true) {
        category.hostchecked = host._checked;
        category.cateringchecked = catering._checked

        this.addCategory.push(category)
      } else {
        this.addCategory.push(category)
      }
      input.value = '';
    }
  }

  deleteAddCategory(addCategory) {
    const index = this.addCategory.indexOf(addCategory);
    if (index >= 0) this.addCategory.splice(index, 1);
  }


  addEmails: Array<any>;
  addItems(input, addEmail, check, textresponse) {

    this.texts = false
    if (addEmail !== null) {
      let text = {
        label: addEmail,
        type: "text",
        required: false,
        hidden: false,
        default: false
      }
      if (check._checked === true) {
        text.required = check._checked;
        this.addEmails.push(text)
      } else {
        this.addEmails.push(text)
      }
      input.value = '';
    }
    this.visitorFieldForm.get('text').reset();
  }

  deleteAddEmail(addEmail) {
    const index = this.addEmails.indexOf(addEmail);
    if (index >= 0) this.addEmails.splice(index, 1);
  }

  /*AddPhone*/
  addPhone: Array<any>;
  addPhones(phone, addPhone, phoneCheck) {
    if (addPhone !== null) {
      let phoneText = {
        label: addPhone,
        type: 'number',
        required: phoneCheck._checked,
        hidden: false,
        default: false
      }
      if (phoneCheck._checked === true) {
        phoneText.required = phoneCheck._checked

        this.addPhone.push(phoneText)
      } else {
        this.addPhone.push(phoneText)
      }

      phone.value = '';
    }
    this.visitorFieldForm.get('phone').reset();
  }

  deleteAddPhone(addPhone) {
    const index = this.addPhone.indexOf(addPhone);
    if (index >= 0) this.addPhone.splice(index, 1);
  }

  //email
  email: Array<any>;
  Email(email, addEmail, emailCheck) {
    if (addEmail !== null) {
      let emailText = {
        label: addEmail,
        type: "email",
        required: emailCheck._checked,
        hidden: false,
        default: false
      }
      if (emailCheck._checked === true) {
        emailText.required = emailCheck._checked

        this.email.push(emailText)
      } else {
        this.email.push(emailText)
      }
      email.value = ''
    }
    this.visitorFieldForm.get('email').reset();

  }

  deleteEmail(addEmail) {
    const index = this.email.indexOf(addEmail);
    if (index >= 0) this.email.splice(index, 1);
  }


  //date
  DateofBirth: Array<any>;
  addDateofBirth(birth, addDate, dateCheck) {
    if (addDate !== null) {
      let dateText = {
        label: addDate,
        type: "date",
        required: dateCheck._checked,
        hidden: false,
        default: false
      }
      if (dateCheck._checked === true) {
        dateText.required = dateCheck._checked
        this.DateofBirth.push(dateText)
      } else {
        this.DateofBirth.push(dateText)
      }
      birth.value = '';
    }
    this.visitorFieldForm.get('birth').reset();
  }

  deleteDateofBirth(addDate) {
    const index = this.DateofBirth.indexOf(addDate);
    if (index >= 0) this.DateofBirth.splice(index, 1);
  }

  //multichoice
  values = [];
  multiChoice: Array<any>;
  addMultichoices(multichoice, addMultichoice, multiRequire) {
    this.visitorFieldForm.value.arr.forEach((data) => {
      this.values.push(data);
    })
    if (addMultichoice !== null) {
      let multiext = {
        label: addMultichoice,
        value: this.values,
        type: "radio",
        required: multiRequire._checked,
        hidden: false,
        default: false
      }
      if (multiRequire._checked === true) {
        multiext.required = multiRequire._checked
        this.multiChoice.push(multiext);
      } else {
        this.multiChoice.push(multiext)
      }
      multichoice.value = '';

    }
    this.visitorFieldForm.get('multi').reset();
  }

  deleteMultichoice(addMultichoice) {
    const index = this.multiChoice.indexOf(addMultichoice);
    if (index >= 0) this.multiChoice.splice(index, 1);
  }

  //checkbox
  checkboxvalues = [];
  checkbox: Array<any>;
  addCheckbox(checkbox, addcheckbox, checkboxinput, requiredCheck, fieldCheck) {
    this.visitorFieldForm.value.checkboxarr.forEach((data) => {
      this.checkboxvalues.push(data);
    })
    if (addcheckbox !== null && checkboxinput !== null) {
      let checkboxText = {
        label: addcheckbox,
        // values:checkboxinput,
        type: 'checkBox',
        value: this.checkboxvalues,
        fieldcheck: requiredCheck._checked,
        required: fieldCheck._checked,
        hidden: false,
        default: false
      }
      let obj = {
        fieldName: checkboxinput,
        fieldCheck2: requiredCheck._checked
      }
      this.checkboxvalues.push(obj);
      if (requiredCheck._checked === true || fieldCheck._checked === true) {
        checkboxText.fieldcheck = fieldCheck._checked
        checkboxText.required = requiredCheck._checked
        this.checkbox.push(checkboxText);

      } else {
        this.checkbox.push(checkboxText)
      }
      checkbox.value = '';
    }
    this.visitorFieldForm.get('checkbox').reset();
  }

  deleteCheckboxes(addcheckboxes) {
    const index = this.checkbox.indexOf(addcheckboxes);
    if (index >= 0) this.checkbox.splice(index, 1);
  }

  //yes
  yes: Array<any>;
  addYes(yes, addyes, yesRequire, yesCheck, yes1) {
    if (addyes !== null) {
      let yestext = {
        label: addyes,
        type: "yes",
        yesChecked: yesCheck._checked,
        yesinput: yes1._checked,
        yes: false,
        no: false,
        required: yesRequire._checked,
        hidden: false,
        default: false
      }
      if (yesCheck._checked === true || yesRequire._checked === true || yes1._checked) {
        yestext.yesChecked = yesCheck._checked
        yestext.yesinput = yes1._checked
        this.yes.push(yestext);
      } else {
        this.yes.push(yestext)
      }
      yes.value = '';
    }
    this.visitorFieldForm.get('yes').reset();
  }

  deleteYes(addyes) {
    const index = this.yes.indexOf(addyes);
    if (index >= 0) this.yes.splice(index, 1);
  }

  //document
  // document: Array<any>;
  // addDocument(document, adddocument,documentTextBox,documentRequire,documetApprove) {
  //   if( adddocument !== null || documentTextBox !== null){
  //     let documenttext = {
  //       documentValue:adddocument,
  //       documentinput:documentTextBox,
  //       documentrequire:documentRequire._checked,
  //       documetapprove:documetApprove._checked
  //     }
  //     if(documentRequire._checked===true || documetApprove._checked===true){
  //       documenttext.documentrequire = documentRequire._checked
  //       documenttext.documetapprove = documetApprove._checked
  //       this.document.push(documenttext);

  //     }else{
  //       this.document.push(documenttext)
  //     }
  //       document.value = '';

  //   }
  // }

  // deleteDocument(adddocument) {
  //   const index = this.document.indexOf(adddocument);
  //   if( index >= 0) this.document.splice(index, 1);
  // }

  //vaccine
  vaccine: Array<any>;
  addVaccine(vaccine, addvaccine, vaccine1, vaccineRequire, vaccineValidated, vaccineNotValidated) {
    if (addvaccine !== null || vaccine1 !== null) {
      let vaccinetext = {
        label: addvaccine,
        optionalLabel: vaccine1,
        type: 'vaccine',
        vaccinevalidated: vaccineNotValidated._checked,
        vaccinenotvalidated: vaccineValidated._checked,
        required: vaccineRequire._checked,
        hidden: false,
        default: false
      }
      if (vaccineRequire._checked === true || vaccineValidated._checked === true || vaccineNotValidated._checked === true) {
        vaccinetext.vaccinevalidated = vaccineRequire._checked
        vaccinetext.vaccinenotvalidated = vaccineValidated._checked
        vaccinetext.required = vaccineNotValidated._checked
        this.vaccine.push(vaccinetext);

      } else {
        this.vaccine.push(vaccinetext)
      }
      vaccine.value = '';
    }
    this.visitorFieldForm.get('vaccvalidation').reset();
  }

  deleteVaccine(addvaccine) {
    const index = this.vaccine.indexOf(addvaccine);
    if (index >= 0) this.vaccine.splice(index, 1);
  }

  shows: boolean = false;
  isdisabled: boolean = false;
  disable(index, addEmail) {
    this.addEmails[index].isdisabled = !this.addEmails[index].isdisabled;
    this.addEmails[index].shows = !this.addEmails[index].shows;
    if (this.addEmails[index].shows === false) {
      this.panelOpenState = false;
    }
    addEmail.hidden = this.addEmails[index].shows;
    addEmail.required = !this.addEmails[index].shows;
  }
  showPhone: boolean = false;
  isPhonedisabled: boolean = false;
  disablePhone(index, phone) {
    this.addPhone[index].isPhonedisabled = !this.addPhone[index].isPhonedisabled;
    this.addPhone[index].showPhone = !this.addPhone[index].showPhone;
    if (this.showPhone === false) {
      this.panelOpenState = false;
    }
    phone.hidden = this.addPhone[index].showPhone;
    phone.required = !this.addPhone[index].showPhone;
  }
  showEmail: boolean = false;
  isEmaildisabled: boolean = false;
  disableEmail(index, email) {

    this.email[index].isEmaildisabled = !this.email[index].isEmaildisabled;
    this.email[index].showEmail = !this.email[index].showEmail;
    if (this.showEmail === false) {
      this.panelOpenState = false;
    }
    email.hidden =  this.email[index].showEmail;
    email.required =  !this.email[index].showEmail;
  }
  showDate: boolean = false;
  isDatedisabled: boolean = false;
  disableDate(index, date) {
    this.DateofBirth[index].isDatedisabled = !this.DateofBirth[index].isDatedisabled;
    this.DateofBirth[index].showDate = !this.DateofBirth[index].showDate;
    if (this.showDate === false) {
      this.panelOpenState = false;
    }
    date.hidden =  this.DateofBirth[index].showDate;
    date.required =  !this.DateofBirth[index].showDate;
  }

  showMultiCheck: boolean = true;
  isMulticheckdisabled: boolean = false;
  disableMultiCheck(index, multichoices) {
    this.multiChoice[index].isMulticheckdisabled = !this.multiChoice[index].isMulticheckdisabled;
    this.multiChoice[index].showMultiCheck = !this.multiChoice[index].showMultiCheck;
    if (this.showMultiCheck === false) {
      this.panelOpenState = false;
    }
    multichoices.hidden = this.multiChoice[index].showMultiCheck;
    multichoices.required = !this.multiChoice[index].showMultiCheck;
  }
  showCheckBoxCheck: boolean = false;
  isCheckdisabled: boolean = false;
  disableCheckBox(index, check) {
    this.checkbox[index].isCheckdisabled = !this.checkbox[index].isCheckdisabled;
    this.checkbox[index].showCheckBoxCheck = !this.checkbox[index].showCheckBoxCheck;
    if (this.showCheckBoxCheck === false) {
      this.panelOpenState = false;
    }
    check.hidden = this.checkbox[index].showCheckBoxCheck;
    check.required = !this.checkbox[index].showCheckBoxCheck;
  }
  showYesCheck: boolean = false;
  isYesdisabled: boolean = false;
  disableYes(index, booleans) {
    this.yes[index].isYesdisabled = !this.yes[index].isYesdisabled;
    this.yes[index].showYesCheck = !this.yes[index].showYesCheck;
    if (this.showYesCheck === false) {
      this.panelOpenState = false;
    }
    booleans.hidden = this.yes[index].showYesCheck;
    booleans.required = !this.yes[index].showYesCheck;
  }
  showVaccineCheck: boolean = false;
  isVaccinedisabled: boolean = false;
  disableVaccine(index, vaccines) {
    this.vaccine[index].isVaccinedisabled = !this.vaccine[index].isVaccinedisabled;
    this.vaccine[index].showVaccineCheck = !this.vaccine[index].showVaccineCheck;
    if (this.showVaccineCheck === false) {
      this.panelOpenState = false;
    }
    vaccines.hidden = this.vaccine[index].showVaccineCheck;
    vaccines.required = !this.vaccine[index].showVaccineCheck;
  }
  expandPanel(matExpansionPanel1: MatExpansionPanel, matExpansionPanel2: MatExpansionPanel, matExpansionPanel3: MatExpansionPanel, matExpansionPanel4: MatExpansionPanel, matExpansionPanel5: MatExpansionPanel,
    matExpansionPanel6: MatExpansionPanel, matExpansionPanel7: MatExpansionPanel, matExpansionPanel8: MatExpansionPanel, matExpansionPanel9: MatExpansionPanel, event: any) {
    // event.stopPropagation();

    // if (!this._isExpansionIndicator(event.target)) {
    //   matExpansionPanel1.close();
    //   matExpansionPanel2.close();
    // }
  }

  private _isExpansionIndicator(target: EventTarget | any): boolean {
    const expansionIndicatorClass = "mat-expansion-indicator";
    return (
      target.classList && target.classList.contains(expansionIndicatorClass)
    );
  }
  updateVisitorField = []
  submit() {
    this.spinner = true;
    this.addEmails.forEach((text) => {
      this.updateVisitorField.push(text)
    })
    this.email.forEach((email) => {
      this.updateVisitorField.push(email)
    })
    this.DateofBirth.forEach((date) => {
      this.updateVisitorField.push(date)
    })
    this.addPhone.forEach((phone) => {
      this.updateVisitorField.push(phone)
    })
    this.multiChoice.forEach((radio) => {
      this.updateVisitorField.push(radio)
    })
    this.checkbox.forEach((checkbox) => {
      this.updateVisitorField.push(checkbox)
    })
    this.yes.forEach((yes) => {
      this.updateVisitorField.push(yes)
    })
    this.vaccine.forEach((vaccine) => {
      this.updateVisitorField.push(vaccine)
    })
    // this.Fields = this.updateVisitorField.filter((ele, index) => {
    //   return this.updateVisitorField.indexOf(ele) == index;
    // })

    let formData = {
      agreement: this.visitorFieldForm.value.selectedAgreement,
      hideInactiveFields: this.visitorFieldForm.value.hideInactiveFields,
      addFields: this.updateVisitorField
    }
    this.visitorService.updateVisitorFields(formData).subscribe(res => {
      this.spinner = false;
      this.toastr.success("Fields updated successfully");
      this.updateVisitorField = []
    })

  }
  headOffice() {
    this.headOfficeHide = true;
    this.newAgreementHide = false;
    this.noAgreementHide = false;

  }
  newAgreement() {
    this.headOfficeHide = false;
    this.newAgreementHide = true;
    this.noAgreementHide = false;
  }
  agreementRemove() {
    this.headOfficeHide = false;
    this.noAgreementHide = true;
  }
  agreementRemove1() {
    this.newAgreementHide = false;
    this.noAgreementHide = true;
  }


}
