import {
  HttpClient
} from '@angular/common/http';
import {
  Visitor
} from '@angular/compiler/src/i18n/i18n_ast';
import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject
} from 'rxjs';
import {
  environment
} from 'src/environments/environment';
import {
  EmployeeResponse
} from './RegisterModel/employeesResponse';
import {
  Storage
} from '@capacitor/storage'
import {
  AlertController
} from '@ionic/angular';
import { ScreenResponse } from './RegisterModel/screen';


@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  private DataSource = new BehaviorSubject('Data is Empty');
  serviceData = this.DataSource.asObservable();

  setData(data :any){
    this.DataSource.next(data);
  }

  private visitorID = new BehaviorSubject('abc@gmail.com');
  currentVisitorId = this.visitorID.asObservable();

  private employeeid = new BehaviorSubject('123abc');
  currentId = this.employeeid.asObservable();
  constructor(private http: HttpClient,
    private alertController: AlertController) {}

  loggedIn() {
    return !!localStorage.getItem('message');
  }

  getJWT() {
    return localStorage.getItem('Token');
  }
  registerVisitor(visitorDetails) {
    return this.http.post < {
      error: boolean;
      message: string;
      visitorData: Visitor[];
    } > (`${environment.baseUrl}/visitor/add-visitor`, visitorDetails);
  }

  employeeList() {
    return this.http.get < {
      error: boolean;
      message: string;
      employeeData: EmployeeResponse[];
    } > (`${environment.baseUrl}/employee/get-all-employee`);
  }

  sendMail(visitorDetails, id) {
    return this.http.post < {
      error: boolean;
      message: string;
    } > (`${environment.baseUrl}/visitor/add-terms/${id}`, visitorDetails);
  }


  getAgreement(){
    return this.http.get < {
      error: boolean;
      message: string;
      response;
    } > (`${environment.baseUrl}/agreement/get-agreement`);
  }

  sendMailEmployee(visitorForm, id) {
    return this.http.post < {
      error: boolean;
      message: string;
    } > (`${environment.baseUrl}/visitor/employee-notify/${id}`, visitorForm);
  }
  async changeVisitorId() {
    let visitorId = localStorage.getItem('visitorId');
    if (window.screen.width <= 1024) {
      await Storage.get({
        key: 'visitorId'
      }).then((res) => {
        this.visitorID.next(res.value);
      }).catch((err) => {
      });

    } else {
      this.visitorID.next(visitorId);
    }
  }
  async changeEmployeeId() {
    let employeeId = localStorage.getItem('employeeId');
    if (window.screen.width <= 1024) {
      await Storage.get({
        key: 'employeeId'
      }).then((res) => {
        this.employeeid.next(res.value);
      }).catch((err) => {
      });
    } else {
      this.employeeid.next(employeeId);
    }
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Something went wrong',
      buttons: ['OK']
    });
    await alert.present();
  }

  imagePathArray = [
    'https://cdn.pixabay.com/photo/2021/12/13/17/29/branches-6868761__480.jpg',
    'https://cdn.pixabay.com/photo/2021/12/11/15/06/northern-lights-6862969__340.jpg',
    'https://cdn.pixabay.com/photo/2021/10/17/02/29/blackish-oystercatcher-6716397__340.jpg'
  ];

  getScreens(){
    return this.http.get<{
      error: boolean,
      message: string,
      response:ScreenResponse[]
    }>(`${environment.baseUrl}/setting/get-screen-image`)
  }

  get imagePathArrays(): Array < string > {
    return this.imagePathArray;
  }

  loginDevice(data) {
    return this.http.post < {
      error: boolean;
      message: string;
      token: string;
      response;
      deviceDetails;
      userId;
    } > (`${environment.baseUrl}/register/device-login`,data);
  }

  
  checkDevice(data) {
    return this.http.post < {
      error: boolean;
      message: string;
    } > (`${environment.baseUrl}/register/check-device`,data);
  }


  logOutDevice() {
    return this.http.post < {
      error: boolean;
      message: string;
      token: string;
      response;
      userId;
    } > (`${environment.baseUrl}/register/device-logout`,null);
  }
  getSettings(){
    return this.http.get < {
      error: boolean;
      message: string;
      companySettings;
      token: string;
      settings
      response;
      userId;
    } > (`${environment.baseUrl}/setting/get-company-settings`);
  }

  getDeviceData(){
    return this.http.get < {
      error: boolean;
      message: string;
      deviceData
    } > (`${environment.baseUrl}/devicelocation/get-device-data`);
  }
}
