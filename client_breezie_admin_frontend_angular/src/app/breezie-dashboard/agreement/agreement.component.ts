import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NgForm
} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { AgreementService } from 'src/app/services/agreement.service';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class AgreementComponent implements OnInit {
  // public Editor = ClassicEditor;
  public Editor = DecoupledEditor;
  agreementForm: FormGroup
  spinner:boolean=true
  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  addReport: FormGroup;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private agreementService: AgreementService
  ) {}

  ckeditorContent = "<h2>Welcome To Our Workplace </h2>";
  agreementName = "New Agreement"
  ngOnInit(): void {
    this.agreementForm = this.fb.group({
      // pdf: [''],
      agreementName: ['New Agreement'],
      agreementId: [''],
      agreementData: ['<h2>Welcome To Our Workplace </h2>'],
    })
    this.getAgreement()
  }
  agreements=[]
  agreementId: string
  getAgreement() {

    this.agreementService.getAgreement().subscribe((res) => {
      this.spinner=false
      if (!res.error) {
        this.agreements = res.response
        
        const resp = res.response
        if (resp.length > 0) {
          // for (let i = 0; i < resp.length; i++) {
          //   this.agreements
          // }
          for (let i = 0; i < resp.length; i++) {
            if (resp[i].isSelected) {
              this.agreementForm.controls['agreementId'].setValue(resp[i]._id);
              this.agreementForm.controls['agreementName'].setValue(resp[i].agreementName);
              this.agreementForm.controls['agreementData'].setValue(resp[i].agreementData);
            }
          }
        }
        // this.getAllVisitors()
      } else {
      }
    })
  }

  selectAgreement(item){
    this.agreementForm.controls['agreementId'].setValue(item._id);
    this.agreementForm.controls['agreementName'].setValue(item.agreementName);
    this.agreementForm.controls['agreementData'].setValue(item.agreementData);
    
  }

  NewCkEditor() {
    this.agreementForm.reset()
  }

  onSubmitData(form: NgForm) {

    // this.agreementService.editAgreement(this.agreementId,form.value).subscribe((res) => {
    //   if (!res.error) {
    //     this.getAgreement()
    //   } else {
    //   }
    // })
  }

  addAgreement() {
    this.spinner=true;
    if (this.agreementForm.value.agreementId != null) {
      this.agreementService
        .editAgreement(this.agreementForm.value.agreementId, this.agreementForm.value)
        .subscribe((res) => {
          this.spinner=false
          if (!res.error) {
            this.toastr.success(res.message);
            this.getAgreement()
          } else {
            this.toastr.error(res.message);
          }
        })
    } else{
      if (this.agreementForm.value.agreementData != null 
        && this.agreementForm.value.agreementName != null) {
        this.agreementService.addNewAgreement(this.agreementForm.value)
        .subscribe((res) => {
          if (!res.error) {
            this.toastr.success(res.message);
            this.getAgreement()
          } else {
            this.toastr.error(res.message);
          }
        })
      }
    }
  }
  // onSubmit() {
  // }

}
