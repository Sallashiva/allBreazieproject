
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import SignaturePad from 'signature_pad';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { RegisterService } from '../register.service';
import { ToastrService } from 'ngx-toastr';
import { AlertController, LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { ModalPage } from 'src/app/modal/modal.page';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { VistorService } from 'src/app/vistor.service';
import { VisitorResponse } from 'src/app/visitor-logout/visitor-response';
import { EmployeeService } from 'src/app/employee.service';
@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
})

export class ConditionsComponent implements OnInit {
  triggerForm: NgForm;
  agreementForm: FormGroup;
  submitted = false;
  spinner = true;
  @ViewChild(IonContent, {
    static: true
  })
  content: IonContent;
  toggle: boolean;
  @ViewChild('canvas', {
    static: true,
  })
  signaturePadElement;
  signaturePad: any;
  canvasWidth: number;
  canvasHeight: number;
  visitorId: string;
  digitalSignature: string;
  acceptTerms: boolean = false;
  employeePath: string;
  loginPath: string;
  subscription: Subscription;
  subscription1: Subscription;
  stagedEmployee;
  emailId;
  loading: any;
  token: string = null
  isDevice: Boolean = false
  url: string = "register/employeelist"
  selectHost: Boolean = false
  path: string
  visitorNewId:VisitorResponse

  constructor(
    private elementRef: ElementRef,
    private agreement: RegisterService,
    private fb: FormBuilder,
    private vistorservice: VistorService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private navController: NavController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
  ) {
    this.getDeviceSettings();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data.key) {
        this.isDevice = data.device
        this.token = data.key;
        this.url = `home?key=${this.token}&device=true`
      }
    })


    this.agreement.changeVisitorId()
    this.subscription1 = this.agreement.currentVisitorId.subscribe(Visitorid => {
      this.visitorId = Visitorid
    });
    this.init();

    this.agreementForm = this.fb.group({
      EmailId: new FormControl(null, [
        Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/),
        Validators.email
      ]),
      acceptTerms: new FormControl(false, Validators.required),
      DigitalSignature: new FormControl(''),
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack("/home");
    });
    this.getAgreement();

    this.getEmployeeListData();
    if (this.stagedEmployee == 'Data is Empty') {
      if (this.isDevice) {
        this.navController.navigateRoot([`home`], {
          queryParams: {
            key: this.token,
            device: true
          }
        });
      } else {
        this.navController.navigateRoot([`/home`]);
      }
    }
  }

  getEmployeeListData() {
    this.agreement.serviceData.subscribe(res => {
      this.stagedEmployee = res;
      this.stagedEmployee.agreeTerms = this.acceptTerms;
      this.stagedEmployee.DigitalSignature = this.digitalSignature;
      this.stagedEmployee.EmailId = this.emailId;
    })
  }

  init() {
    if (window.screen.width > 1024) {
      const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
      canvas.width = 355;
      canvas.height = 150;
      if (this.signaturePad) {
        this.signaturePad.clear();
      }
    } else if (window.screen.width < 768) {
      const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
      canvas.width = 355;
      canvas.height = 150;
      if (this.signaturePad) {
        this.signaturePad.clear();
      }
    } else if (window.screen.width < 1024) {
      const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
      canvas.width = 200;
      canvas.height = 100;
      if (this.signaturePad) {
        this.signaturePad.clear();
      }
    }
  }

  public ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(
      this.signaturePadElement.nativeElement
    );
    this.signaturePad.clear();
    this.isCanvasBlank();
    this.signaturePad.penColor = 'rgb(0,0,0)';
  }
  signatureIsEmpty: boolean = true;
  isCanvasBlank(): boolean {
    if (window.screen.width < 768) {
      this.content.scrollToBottom(2000);
    }
    if (this.signaturePad) {
      this.signatureIsEmpty = this.signaturePad.isEmpty();
      return this.signaturePad.isEmpty()? true : false;
    }
  }

  clear() {
    this.signaturePad.clear();
    this.signatureIsEmpty = this.signaturePad.isEmpty();
  }

  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop();
      this.signaturePad.fromData(data);
    }
  }

  onToggle(event) {
    this.toggle = event.detail.checked;
    if (window.screen.width < 768) {
      this.content.scrollToBottom(2000);
    }
    if (this.toggle === false) {
      this.agreementForm.controls['EmailId'].reset();
    }
  }

  checkBox(event) {
    this.acceptTerms = event.detail.checked;
    if (window.screen.width < 768) {
      this.content.scrollToBottom(2000);
    }
  }

  get agreementFormControl() {
    return this.agreementForm.controls;
  }

  triggerSubmit() {
    if (!this.triggerForm) {
      console.warn('triggerForm not assigned a value');
    } else {
      if (this.triggerForm.valid) {
        this.triggerForm.ngSubmit.emit();
      }
    }
  }
  resp
  agreementData = `<p>Welcome To Our Workplace

  Visitors are welcome to visit during hours of operations. For your safety and security we have the following guidelines:

  All visitors agree to follow the site rules before entry is permitted into the building.
  All visitors must sign in and out through the main entrance.
  All visitors are required to read and acknowledge the Non-Disclosure and Waiver Agreement below.
  Smoking and tobacco use is prohibited in our facility.
  Firearms or other weapons are prohibited in our facility.

  Visitors Non-Disclosure and Waiver Agreement

  During my visit to your facility, I may learn or have disclosed to me proprietary or confidential information (including, without limitations, information relating to technology, trade secrets, processes, materials, equipment, drawings, specifications, prototypes and products) and may receive samples of products not generally known to the public.

  I agree that I will not, without your written permission or that of your authorized representative:

  Disclose or otherwise make available to others any confidential information disclosed to me during this and any subsequent visit that was not known to me or my organization prior to disclosure by you, or is not now or subsequently becomes a part of the public domain as aresult of publication or otherwise.
  Use or assist others in using or further developing in any manner any confidential information.
  Use cameras or video technology to disclose confidential information.

  I agree to conform to any applicable safety requirements, which are brought to my attention by any employee or by signs posted in the areas that I visit while on the premises, and to observe other reasonable safety precautions.</p>`
  getAgreement() {
    this.agreement.getAgreement().subscribe(res => {
      this.resp = res.response
      for (let i = 0; i < this.resp.length; i++) {
        if (this.resp[i].isSelected) {
          this.agreementData = this.resp[i].agreementData
        }
      }
    })
  }

  companySetting
  cameraActivation: boolean = false
  getDeviceSettings() {
    this.agreement.getSettings().subscribe(res => {
      if (!res.error) {
        this.companySetting = res.companySettings
        this.cameraActivation = this.companySetting.visitorSetting.takePhotoOfVisitor
        this.selectHost = this.companySetting.visitorSetting.selectHost
    this.employeePath = `/register/employeelist`;
    this.loginPath = `/home`;
    if (this.selectHost) {
      if (this.isDevice) {
        this.path = `${this.employeePath}?key=${this.token}&device=true`
      } else {
        this.path = this.employeePath
      }
    } else {
      if (this.isDevice) {
        this.path = `${this.loginPath}?key=${this.token}&device=true`
      } else {
        this.path = this.loginPath
      }
    }

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack(this.path);
    });
      }
    });

  }

  async onAgreement() {
    this.submitted = true;
    this.digitalSignature = this.signaturePad.toDataURL();
    this.agreementForm.get('DigitalSignature').setValue(this.digitalSignature);
    this.emailId = this.agreementForm.value.EmailId
    this.agreement.setData(this.stagedEmployee);
    if (this.cameraActivation) {
      if (this.isDevice) {
        this.navController.navigateRoot(['camera/camera'], {
          queryParams: {
            key: this.token,
            device: true,
            id :this.visitorNewId
          }
        });
      } else {
        this.navController.navigateRoot(['camera/camera'])
      }
      // this.navController.navigateRoot(['camera/camera']);
    } else {
      this.presentLoading();
      this.stagedEmployee.finalDate = new Date();
      this.vistorservice.visitorData(this.stagedEmployee).subscribe(async (res) => {
        if (!res.error) {
          this.visitorNewId = res.visitorData[0]._id
          this.employeeService.setData(this.visitorNewId)
          this.loadingController.dismiss()
            this.presentAlertCondition();
            // this.navController.navigateRoot(['cafeteria'])
        } else {
          this.toastr.error("Something went wrong");
        }
      }, err => {

          if (err.status) {
            this.toastr.error(err.error.message);
          } else {
            if (window.screen.width <= 1024) {
              this.agreement.presentAlert();
              this.loadingController.dismiss()
            } else {
              this.loadingController.dismiss()
              this.toastr.error("CONNECTION_ERROR");
            }
          }
        });
    }

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  async presentAlertCondition() {
    const alert = await this.alertController.create({
      message: 'Visitor CheckIn',
      buttons: ['OK']
    });
    await alert.present();
    await alert.onDidDismiss();

    if (this.isDevice) {
      this.navController.navigateRoot(['/thanks-logout'], {
        queryParams: {
          key: this.token,
          device: true,
          id :this.visitorNewId
        }
      });
    } else {
      this.navController.navigateRoot(['/cafeteria'])
    }

    // this.navController.navigateRoot(['/cafeteria']);
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Message has been sent to the employee',
      buttons: ['OK']
    });
    await alert.present();
    await alert.onDidDismiss();

    if (this.isDevice) {
      this.navController.navigateRoot(['/thanks-logout'], {
        queryParams: {
          key: this.token,
          device: true
        }
      });
    } else {
      this.navController.navigateRoot(['/cafeteria'])
    }

    // this.navController.navigateRoot(['/cafeteria']);
  }


  qrCodeOpen() {
    this.modalCtrl
      .create({
        component: ModalPage,
        backdropDismiss: false,
      })
      .then((modalres) => {
        modalres.present();
      });
  }


}
