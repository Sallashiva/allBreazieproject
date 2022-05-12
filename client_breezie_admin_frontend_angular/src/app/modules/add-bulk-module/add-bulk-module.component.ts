import {
  Component,
  OnInit,
  VERSION
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatStepperModule
} from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { zip } from 'rxjs';
import { EmployeesComponent } from 'src/app/breezie-dashboard/employees/employees.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocationService } from 'src/app/services/location.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-add-bulk-module',
  templateUrl: './add-bulk-module.component.html',
  styleUrls: ['./add-bulk-module.component.css']
})
export class AddBulkModuleComponent implements OnInit {
  locationId: any
  location: any
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourFormGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private employeeService: EmployeeService,
    private toastr:ToastrService,
    private dialogRef:MatDialogRef<EmployeesComponent>
    ) {}

  ngOnInit(): void {

    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: [''],
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: [''],
      location: new FormControl('', [Validators.required]),

    });
    this.thirdFormGroup = this.formBuilder.group({
      thirdCtrl: [''],
      file:new FormControl('',[Validators.required]),
      // employeeArray: new FormControl('', [
      //   Validators.required
      // ]),
      // file:new FormControl(''),
      // location: new FormControl('', [Validators.required]),
    });
    this.fourFormGroup = this.formBuilder.group({
      fourCtrl: [''],
    });
    this.getDeviceLOcatoion()
  }
  file
  // fileUpload(e){
  //   if(e.target.files.length>0){
  //     const file=e.target.files[0].name;
  //     this.file=file;

  //   }
  // }

  locationDataId:any

  getLocationId(id){

    this.locationDataId=id
  }

  data1
  spinner: boolean = true
  inserted:number = 0
  updated:number = 0
  issue:number = 0
  resultData:boolean = false
  errorMessage:string =""
  erroShow:Boolean=false
  uplodeFile() {
    this.csvResult.forEach((ele,index)=>{
       ele.isRemoteUser = ele.isRemoteUser.toLowerCase();
    })
    let data={
      locationId:this.locationDataId,
      employeeArray:this.csvResult
    }
    this.employeeService.uploadXlSheet(data).subscribe(res=>{
         this.inserted=res.Data.Inserted;
         this.updated=res.Data.Upadted;
         this.issue=res.Data.Issue;
         
         if(res) {
           setTimeout(()=>{
             this.spinner = false;
             this.erroShow= false
             this.resultData = !this.resultData
           },500)
         }
        }, (err) => {       
          this.spinner = false;
          this.erroShow= true
           this.resultData = false
           this.errorMessage=err.error.message
          this.toastr.error(err.error.message)
        })
    // const file = (event.target as HTMLInputElement).files[0];
    // // if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type == 'application/vnd.ms-excel') {
    //   const target: DataTransfer = < DataTransfer > event.target;
    //   if (target.files.length !== 1) throw new Error('Cannot use multiple files')
    //   const reader: FileReader = new FileReader();
    //   reader.onload = (e: any) => {
    //     const bstr: string = e.target.result;
    //     const wb: XLSX.WorkBook = XLSX.read(bstr, {
    //       type: 'binary'
    //     });
    //     const wsname: string = wb.SheetNames[0];
    //     const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    //     this.data1 = (XLSX.utils.sheet_to_json(ws, {
    //       header: 1
    //     }));
    //     var keys = this.data1.shift();
    //     const collection = this.data1.map(function (row) {
    //       return keys.reduce(function (obj, key, i) {
    //         obj[key] = row[i];
    //         return obj;
    //       }, {});
    //     });
    //     this.thirdFormGroup.get('employeeArray').patchValue(collection);
    //     // this.uploadForm.reset()
    //     // this.uploadFileToBackend(event);
    //   }
    //   reader.readAsBinaryString(target.files[0]);
    // // } else {
    // //   this.toastr.error("Dont use " + file.type + " format");
    // // }
  }

  uploadFileToBackend(event:any) {
    this.employeeService.uploadEmployeeData(this.thirdFormGroup.value).subscribe((res) => {
      if (!res.error) {
        // this.toastr.success(res.message);
        // this.getAllEmployee();
      } else {
        // this.toastr.error(res.message);
      }
    }, err => {
      // this.toastr.error(err.error.message);
    })
    event.target.value = null
  }


  deviceLocation: any = []
  getDeviceLOcatoion() {
    this.locationService.getDeiviceLocation().subscribe(res => {
      // this.deviceLocation.push(res)
      res.deviceData.forEach((deviceData) => {
        let location = {
          officeName: deviceData.locations.officeName,
          locationId: deviceData._id
        }
        this.deviceLocation.push(location);
      })
    })
  }

  companyLocationsData
  locations = []
  getCompanyLocations() {
    this.locationService.getDeiviceLocation().subscribe(res => {
      this.companyLocationsData = res.deviceData
      for (let i = 0; i < this.companyLocationsData.length; i++) {
        if (this.companyLocationsData[i].locations) {
          this.locations.push(this.companyLocationsData[i])
        }
      }
    });
  }

  Done(){
    this.dialogRef.close(true);
  }

  csvFile:Boolean=false
  activationFile: File;
  formDataActivation: FormData;
  csvResult: any[];
  name = 'Angular ' + VERSION.major;
  onChoosingActivationFile(event: Event) {
    this.activationFile = (event.target as HTMLInputElement).files[0];
    let arr=this.activationFile.name.split('.')[1];
    this.file = (event.target as HTMLInputElement).files[0].name;
    if (arr ==="csv") {
      this.csvFile=false
      this.formDataActivation = new FormData()
      this.formDataActivation.append('filename', this.activationFile);
      this.formDataActivation.append('document_type', 'xls');
      let reader = new FileReader();
      reader.readAsText(this.activationFile);
      reader.onload = () => {
        this.csvResult = [];
        let csv = reader.result;
        let lines = csv.toString().split('\r\n');
        let headers = lines[0].split(',');
        for (let i = 1; i < lines.length; i++) {
          let obj = {};
          let currentLines = lines[i].split(',');
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLines[j];
          }
          this.csvResult.push(obj);
        }
        this.csvResult.pop();
        this.csvResult.forEach((element, i) => {
          delete element['']
          delete element["\r"]
          return element;
        });
      }
    } else {
      this.csvFile=true
    }
  }

}
