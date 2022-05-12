import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { VisitorResponse } from '../visitor-logout/visitor-response';
import { VistorService } from '../vistor.service';

@Component({
  selector: 'app-device-thankyou',
  templateUrl: './device-thankyou.page.html',
  styleUrls: ['./device-thankyou.page.scss'],
})
export class DeviceThankyouPage implements OnInit {
  path: string;
  visitorId: string;
  token: string = null
  isDevice: Boolean = false
  url: string = "home"
  signOutForm: FormGroup

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private navController: NavController,
    private platform: Platform,
    private activatedRoute: ActivatedRoute,
    private visitorService: VistorService,
  ) {}
  visitorNewId
  ngOnInit() {
    // this.goHome();
    this.activatedRoute.url
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data.key) {
        this.isDevice = data.device
        this.token = data.key;
        this.visitorNewId = data.id
        this.url = `home?key=${this.token}&device=true`
      }
    })
    // this.path = `/cafeteria/cafeteria-item`;
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.isDevice) {
        this.navController.navigateBack(`/home?key=${this.token}&device=true`);
      } else {
        this.navController.navigateBack(this.path);
      }
      this.navController.navigateBack(this.path);
    });
    this.signOutForm = this.fb.group({
      finalDate: ['']
    })
    this.getVisitor()
  }

  visitorData: VisitorResponse

  getVisitor() {
    this.visitorService.getVisitor(this.visitorNewId).subscribe(res => {
      this.visitorData = res.response
    })
  }

  signOutVisitor(visitorData: VisitorResponse) {
    const date = new Date().toString()
    this.signOutForm.get('finalDate').setValue(date);
    this.visitorService.signOutVisitors(visitorData._id, this.signOutForm.value).subscribe(res => {
      if (!res.error) {
        // this.navController.navigateRoot(['empsignout-thanks']);
        this.navController.navigateRoot(['/home'], {
          queryParams: {
            key: this.token,
            device: true
          }
        });
      }
    })
  }


  goToHome() {
    this.navController.navigateRoot(['/home'], {
      queryParams: {
        key: this.token,
        device: true
      }
    });

  }

  //  async goHome() {
  //   //   localStorage.clear()
  //   // await  Storage.clear()
  //     setTimeout(() => {
  //       this.router.navigate(['/home']);
  //     }, 3000);
  //   }
}
