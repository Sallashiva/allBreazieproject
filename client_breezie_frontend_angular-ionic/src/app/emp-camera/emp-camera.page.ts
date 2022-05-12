import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { ModalPage } from '../modal/modal.page';
import { PhotoService } from '../register/photo.service';
import { RegisterService } from '../register/register.service';
import { VistorService } from '../vistor.service';

@Component({
  selector: 'app-emp-camera',
  templateUrl: './emp-camera.page.html',
  styleUrls: ['./emp-camera.page.scss'],
})
export class EmpCameraPage implements OnInit {

  visitorPhoto: FormGroup;
  imageUrl: string = "";
  employeeId: string;
  addNewToGallery: any;
  visitorId: string;
  picture;
  path: string;
  subscription: Subscription;
  @ViewChild('cameraBtn') cameraBtn: ElementRef;
  loading:any;
  photoStageData;

  constructor(
    public photoService: PhotoService,
    private registerService: RegisterService,
    private vistorservice: VistorService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private navController: NavController,
    private alertController: AlertController,
    private platform: Platform,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.visitorPhoto = this.fb.group({
      EmployeeId: ['', Validators.required],
      VisitorImage: ['', Validators.required],
    });
    this.addPhotoToGallery();
    this.path = `/employees`;
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack(this.path);
    });
    this.registerService.changeEmployeeId()
    this.subscription = this.registerService.currentId.subscribe(id => {
      this.employeeId = id
      this.visitorPhoto.patchValue({
        EmployeeId: this.employeeId,
      });
    });
    this.registerService.changeVisitorId()
    this.subscription = this.registerService.currentVisitorId.subscribe(email => {
      this.visitorId = email
    });

    this.getConditionsComponentData();
    this.getEmployeeData();
    this.getLogoutPageData();
    this.getLoginPageData();

  }
  stageData:any
  logOutCheck:any
  getLogoutPageData() {
    this.employeeService.serviceData.subscribe(res=>{
      this.stageData = res;
      this.logOutCheck =this.stageData.type
    })
  }
  loginStageData:any
  checkType:any
  getLoginPageData() {
    this.employeeService.serviceData.subscribe(res=>{
      this.loginStageData = res;
      this.checkType = this.loginStageData.type
    })
  }

  empData:any
  getEmployeeData() {
    this.employeeService.getEmployee().subscribe(res => {
      this.empData = res.employeeData[0].lastActivity.recent

    })
  }

  toggleCheck:any
  getConditionsComponentData() {
    this.registerService.serviceData.subscribe(res=>{
      this.photoStageData = res;
     this.toggleCheck = this.photoStageData.rememberMe;
    });
  }

  addPhotoToGallery() {
    let url = this.photoService.addNewToGallery();

    url.then((res) => {
        let split = res.split(",")
        if (split[0] === "data:image/jpeg;base64" || split[0] === "data:image/png;base64") {
          this.imageUrl = res;
          this.loginStageData.employeeImage = this.imageUrl;
          this.stageData.employeeImage = this.imageUrl;
          this.photoStageData.finalDate = new Date();
          this.visitorPhoto.patchValue({
            VisitorImage: this.imageUrl,
          });
        } else {
          this.toastr.error('Only Images are allowed');
          throw "err"
        }
      })
      .catch((err) => {
        err
      }
    );
  }

  async sendPhoto() {
     this.presentLoading();
    this.vistorservice.
    visitorData(this.photoStageData)
      .subscribe(async(res) => {
        if (!res.error) {
          this.loadingController.dismiss()
          this.presentAlert();
          if (this.toggleCheck === true) {
            localStorage.setItem('userData',JSON.stringify(this.photoStageData))
          } else {
            localStorage.removeItem('userData')
          }
        }else{
          this.toastr.error("Something went wrong");
        }
      },err=>{
        if (err.status) {
          this.toastr.error(err.error.message);
        } else{
          if(window.screen.width<=1024){
            this.registerService.presentAlert();
            this.loadingController.dismiss()
          }
         else{
          this.loadingController.dismiss()
          this.toastr.error("CONNECTION_ERROR");
         }
        }
      }
    );
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Message has been sent to the employee',
      buttons: ['OK']
    });
    await alert.present();
    await alert.onDidDismiss();
    this.navController.navigateRoot(['/cafeteria']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
    if (document.querySelector('pwa-camera-modal') !== null) {
      document.querySelector('pwa-camera-modal').remove();
      document.querySelector('pwa-camera-modal-instance').remove();
    }
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
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  navigateToThanks() {
     this.employeeService.signOutEmployee(this.loginStageData).subscribe((res:any) => {
       if (!res.error) {
         this.navController.navigateRoot(['emp-thanks']);
          }
        })
  }
  navigateToSignOutThanks() {
    this.employeeService.signOutEmployee(this.stageData).subscribe((res:any) => {
      if (!res.error) {
          }
        })
    this.navController.navigateRoot(['empsignout-thanks']);
  }
}
