import {
  Component
} from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  constructor(
    private network: Network, 
    public alertController: AlertController,
    private navController: NavController,
    private router: Router
  ) {
    // if(window.screen.width <1024){
    //   ScreenOrientation.lock( ScreenOrientation.ORIENTATIONS.PORTRAIT)
    //  }
      window.addEventListener('offline', () => {
      this.openAlert()
    });
    window.addEventListener('online', () => {
      this.openAlert1()
    })
  }

  async openAlert() {
    if (window.screen.width < 1024) {
      const alert = await this.alertController.create({
        header: 'Check Network Connection',
        message: 'You do not have Internet Connection',
        buttons: [{
          text: "OK",
          handler: () => {
          }
        }]
      });
      await alert.present();
      // this.navController.navigateRoot(['/error']
      // ,{
      //   queryParams:{
      //     currentPath:this.router.url
      //   }
      // })
    }
  }

  async openAlert1() {
    if (window.screen.width < 1024) {
      const alert = await this.alertController.create({
        header: 'Back To Online 😊',
        buttons: [{
          text: "OK",
          handler: () => {
          }
        }]
      });
      await alert.present();
      // this.navController.navigateRoot(['/error']
      // ,{
      //   queryParams:{
      //     currentPath:this.router.url
      //   }
      // })
    }
  }
}
