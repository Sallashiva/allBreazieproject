import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  Storage
} from '@capacitor/storage';
import {
  ModalController,
  NavController,
  Platform
} from '@ionic/angular';
import {
  ToastrService
} from 'ngx-toastr';
import {
  Subscription
} from 'rxjs';
import {
  ModalPage
} from '../modal/modal.page';
import {
  RegisterService
} from '../register/register.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  backButtonSubscription: Subscription;
  imagePath: string;
  token: string;
  myAngularxQrCode: string = null;
  isDevice: Boolean = false
  rForm: FormGroup;

  constructor(
    private navController: NavController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private register: RegisterService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.token = localStorage.getItem('Token');
    this.myAngularxQrCode = `https://app.breazie.com/home?key=${this.token}&device=true`;
    this.activatedRoute.queryParams.subscribe(async (data) => {
      if (data.key) {
        this.isDevice = data.device
        localStorage.setItem('Token', data.key);
        await Storage.set({
          key: "Token",
          value: data.key
        })
      }
    })
  }

  ngOnInit() {
    this.rForm = new FormGroup({
      deviceId: new FormControl('')
    });
    this.swipe();
    this.getAllScreens();
    this.getDeviceSettings();
    this.getLocation();
    if (!this.isDevice) {
      this.getSavedData();
    }
  }

  random: number
  ScreenSaver() {
  }

  screens: string[] = [];
  showQr: Boolean = false
  getDeviceSettings() {
    this.register.getSettings().subscribe(resp => {
      if (!resp.error) {
        this.showQr = resp.companySettings.contactLess.generateDynamicQR
      } else {
        this.navigateToDeviceLogout();
      }
    },err => {
      if (!this.isDevice) {
        this.navigateToDeviceLogout();
      }
    });
  }

  employeeInOut: Boolean = false;
  delivery: Boolean = false;
  visitorOut: Boolean = false;

  getLocation() {
    this.register.getDeviceData().subscribe(resp => {
      if (!resp.error) {
        this.employeeInOut = resp.deviceData.employeeInandOut;
        this.visitorOut = resp.deviceData.visitorInandOut;
        this.delivery = resp.deviceData.deliveries;
      }
    });
  }

  getAllScreens() {
    this.register.getScreens().subscribe(res => {
      if (res.response.length > 0) {
        for (let i = 0; i < res.response.length; i++) {
          if (res.response[i].hidden == "false" || res.response[i].hidden == false) {
            this.screens.push(res.response[i].imagePath)
          }
        }
      }
      this.random = Math.floor(Math.random() * this.screens.length);
      this.imagePath = this.screens[this.random];
      setInterval(() => {
        this.random = Math.floor(Math.random() * this.screens.length);
        this.imagePath = this.screens[this.random];
      }, 10000);
    })
  }

  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(666, () => {
      if (this.constructor.name == "HomePage") {
        if (window.confirm("Are you sure you want to exit?")) {
          navigator['app'].exitApp();
        }
      }
    });
  }
  userData
  deviceId: any
  async getSavedData() {

    if (!this.isDevice) {
      let a = localStorage.getItem('DeviceId')
      let b = await Storage.get({
        key: 'DeviceId'
      })
      if (a) {
        this.rForm.get('deviceId').setValue(a)
        this.deviceId = a
      } else if (b) {
        this.rForm.get('deviceId').setValue(b.value)
        this.deviceId = b.value
      } else {
        this.deviceId = false
      }
      if (this.deviceId) {
        this.register.checkDevice(this.rForm.value).subscribe(async res => {
          if (!res.error) {
          } else {
            this.toastr.error("Please Login Again!!!");
            this.navigateToDeviceLogout()
          }
        }, error => {
          if (error) {
            this.navigateToDeviceLogout()
            this.toastr.error("Please Login Again!!!");
          } else {
            this.toastr.error("connection error")
          }
        });
      } else {
        this.moveToWelcome()
      }
    }
  }

  swipe() {
    var device = this.isDevice
    var token = this.token
    var navController = this.navController
    var initialMouse = 0;
    var slideMovementTotal = 0;
    var mouseIsDown = false;
    var slider = $('#slider');
    slider.on('mousedown touchstart', function (event) {
      mouseIsDown = true;
      slideMovementTotal = $('#button-background').width() - $(this).width() + 10;
      initialMouse = event.clientX || event.originalEvent.touches[0].pageX;
    });
    $(document.body, '#slider').on('mouseup touchend', function (event) {
      if (!mouseIsDown)
        return;
      mouseIsDown = false;
      var currentMouse = event.clientX || event.changedTouches[0].pageX;
      var relativeMouse = currentMouse - initialMouse;
      if (relativeMouse < slideMovementTotal) {
        $('.slide-text').fadeTo(300, 1);
        slider.animate({
          left: "0px"
        }, 300);
        return;
      }
      slider.addClass('unlocked');
      $('#locker').text('lock_outline');
      setTimeout(function () {
        slider.on('click tap', function (event) {
          if (!slider.hasClass('unlocked'))
            return;
          slider.removeClass('unlocked');
          $('#locker').text('lock_open');
          slider.off('click tap');
        });
      }, 0);
    });

    $(document.body).on('mousemove touchmove', function (event) {
      if (!mouseIsDown)
        return;
      var currentMouse = event.clientX || event.originalEvent.touches[0].pageX;
      var relativeMouse = currentMouse - initialMouse;
      var slidePercent = 1 - (relativeMouse / slideMovementTotal);
      $('.slide-text').fadeTo(0, slidePercent);
      if (relativeMouse <= 0) {
        slider.css({
          'right': '10px'
        });
        return;
      }
      if (relativeMouse >= slideMovementTotal - 20) {
        slider.css({
          'left': 160 + 'px'
        });
        navController.navigateRoot(['/login'])
        let userData = localStorage.getItem('userData')
        if (localStorage.getItem('userData') === null) {
          if (device) {
            navController.navigateRoot(['/login'], {
              queryParams: {
                key: token,
                device: true
              }
            });
          } else {
            navController.navigateRoot(['/login'])
          }
        } else {
          if (device) {
            navController.navigateRoot(['/visitor-check']);
          }
        }
        return;
      }
      slider.css({
        'left': relativeMouse - 0
      });
    });
  }

  qrCodeOpen() {
    this.modalCtrl.create({
      component: ModalPage,
      backdropDismiss: false,
    }).then(modalres => {
      modalres.present();
    })
  }

  navigateToLogout(event) {
    if (event.target.value === 'employee') {
      this.navController.navigateRoot(['employees'])
    };
    if (event.target.value === 'visitors') {
      this.navController.navigateRoot(['visitor-logout']);
    }
    if (event.target.value === 'delivery') {
      this.navController.navigateRoot(['delivery']);
    }
    if (event.target.value === 'logout') {
      this.register.logOutDevice().subscribe(async res => {

        if (!res.error) {
          this.toastr.success(res.message);
          localStorage.removeItem("Token");
          await Storage.clear()
          this.navController.navigateRoot(['welcomepage']);
        } else {
          this.toastr.error(res.message);
        }
      })
    }
  }

  async moveToWelcome() {
    localStorage.removeItem("Token");
    await Storage.clear()
    this.navController.navigateRoot(['welcomepage']);
  }
  navigateToDeviceLogout() {
    this.register.logOutDevice().subscribe(async res => {
      if (!res.error) {
        this.toastr.success(res.message);
        localStorage.clear()
        await Storage.clear()
        this.navController.navigateRoot(['welcomepage']);
      } else {
        this.toastr.error(res.message);
      }
    }, async err => {
      if (err.error.message == "Access Denied / Unauthorized request") {
        localStorage.clear()
        await Storage.clear()
        this.navController.navigateRoot(['welcomepage']);
        // this.navigateToDeviceLogout()
        // this.toastr.error(err.error.message);
      } else {
        // this.toastr.error("CONNECTION_ERROR");
      }
    })
  }
  // navigateToVisitorLogout() {
  //   this.navController.navigateRoot(['visitor-logout']);
  // }

  // navigateToDelivery(){
  //   this.navController.navigateRoot(['delivery']);
  // }

  toggleTheme(event) {
    if (event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
}
