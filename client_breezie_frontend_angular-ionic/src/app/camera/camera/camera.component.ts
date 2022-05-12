import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PhotoService } from '../../register/photo.service';
import { RegisterService } from '../../register/register.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { ModalPage } from 'src/app/modal/modal.page';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { VistorService } from 'src/app/vistor.service';
import { ActivatedRoute } from '@angular/router';
import { CafetrriaServiceService } from 'src/app/cafeteria/cafetrria-service.service';
import { EmployeeService } from 'src/app/employee.service';
import { VisitorResponse } from 'src/app/visitor-logout/visitor-response';
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})

export class CameraComponent implements OnInit, OnDestroy {

  visitorPhoto: FormGroup;
  imageUrl: string = "";
  employeeId: string;
  addNewToGallery: any;
  visitorId: string;
  picture;
  path: string;
  subscription: Subscription;
  @ViewChild('cameraBtn') cameraBtn: ElementRef;
  loading: any;
  photoStageData;
  token: string = null
  isDevice: Boolean = false
  url: string = "home"

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
    private activatedRoute: ActivatedRoute,
    private cafeteriaService: CafetrriaServiceService,
    private employeeServices: EmployeeService,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data.key) {
        this.isDevice = data.device
        this.token = data.key;
        this.url = `home?key=${this.token}&device=true`
      }
    })
    this.visitorPhoto = this.fb.group({
      // EmployeeId: ['', Validators.required],
      VisitorImage: ['', Validators.required],
    });
    this.addPhotoToGallery();
    this.path = `/register/condition`;
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.isDevice) {
        this.navController.navigateBack(`${this.path}?key=${this.token}&device=true`);
      } else {
        this.navController.navigateBack(this.path);
      }
      // this.navController.navigateBack(this.path);
    });
    this.registerService.changeEmployeeId()
    // this.subscription = this.registerService.currentId.subscribe(id => {
    //   this.employeeId = id
    //   this.visitorPhoto.patchValue({
    //     EmployeeId: this.employeeId,
    //   });
    // });
    this.registerService.changeVisitorId()
    this.subscription = this.registerService.currentVisitorId.subscribe(email => {
      this.visitorId = email
    });
    this.getConditionsComponentData();
    if (this.photoStageData == 'Data is Empty') {
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
    this.getBeverage();
  }

  beverages:any
   getBeverage() {
     this.cafeteriaService.getBeverages().subscribe(res=>{
       this.beverages = res.catering;
     })
   }

  toggleCheck: any
  getConditionsComponentData() {
    this.registerService.serviceData.subscribe(res => {
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
          this.photoStageData.imageUrl = this.imageUrl;
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
      });
  }
  visitorData:any
visitorNewId:VisitorResponse
  async sendPhoto() {
    this.presentLoading();
    this.vistorservice.visitorData(this.photoStageData).subscribe(async (res) => {
          this.visitorData = res;
          if (!res.error) {
            this.visitorNewId = res.visitorData[0]._id
            this.employeeServices.setData(this.visitorNewId);
            this.loadingController.dismiss()
            this.presentAlert();
            if (this.toggleCheck === true) {
              localStorage.setItem('userData', JSON.stringify(this.photoStageData))
            } else {
              localStorage.removeItem('userData')
            }
          } else {
            this.toastr.error("Something went wrong");
          }
        }, err => {
          if (err.status) {
            this.toastr.error(err.error.message);
          } else {
            if (window.screen.width <= 1024) {
              this.registerService.presentAlert();
              this.loadingController.dismiss()
            } else {
              this.loadingController.dismiss()
              this.toastr.error("CONNECTION_ERROR");
            }
          }
        });

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
          device: true,
          id :this.visitorNewId
        }
      });
    } else {
      // this.navController.navigateRoot(['/register/employeelist'])
      if(this.beverages.length > 0) {
        this.navController.navigateRoot(['/cafeteria']);
      } else {
        this.navController.navigateRoot(['/cafeteria/thankyou']);
      }
    }
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

  // postVisitorData() {
  //   this.vistorservice.visitorData(this.photoStageData).subscribe(res =>{

  //   })
  // }
}
