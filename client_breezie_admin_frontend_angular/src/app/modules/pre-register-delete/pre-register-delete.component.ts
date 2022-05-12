import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PreRegisteredService } from 'src/app/services/pre-registered.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PreregisteredComponent } from 'src/app/breezie-dashboard/preregistered/preregistered.component';

@Component({
  selector: 'app-pre-register-delete',
  templateUrl: './pre-register-delete.component.html',
  styleUrls: ['./pre-register-delete.component.css']
})
export class PreRegisterDeleteComponent implements OnInit {


  constructor(
    private PreRegisteredServices:PreRegisteredService,
    @Inject(MAT_DIALOG_DATA) public editData:any ,
    private dialogRef:MatDialogRef<PreRegisterDeleteComponent>
  ) { }

  ngOnInit(): void {


  }

  delete(){
      this.PreRegisteredServices.deletePreregister(this.editData._id).subscribe(res => {
        if(!res.error){
          this.dialogRef.close("delete");
        }
      })
    }
    
  

}
