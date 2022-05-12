import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IdBadgeService } from 'src/app/services/id-badge.service';

@Component({
  selector: 'app-id-badges',
  templateUrl: './id-badges.component.html',
  styleUrls: ['./id-badges.component.css']
})
export class IdBadgesComponent implements OnInit {
  photos: boolean = true;
  standards: boolean = false;
  simples: boolean = false;
  idBadge: FormGroup;
  photoChecked: boolean = true;
  spinner: boolean = true;
  constructor(private fb: FormBuilder, private idBadgeService: IdBadgeService, private toastr: ToastrService, ) {}

  ngOnInit(): void {
    this.idBadge = this.fb.group({
      scanBadgeToSignOut: new FormControl('', Validators.required),
      badgeType: new FormControl('photo', Validators.required),
    });
    this.getIdbadge()
    this.getIdCompanyLogo()
  }
  photo(e) {
    this.idBadge.get('badgeType').setValue(e.target.value);
    this.photos = true;
    this.standards = false;
    this.simples = false;

  }

  standard(e) {
    this.idBadge.get('badgeType').setValue(e.target.value);
    this.standards = true;
    this.photos = false;
    this.simples = false;
  }
  simple(e) {
    this.idBadge.get('badgeType').setValue(e.target.value);

    this.simples = true;
    this.standards = false;
    this.photos = false;

  }
  get myForm() {
    return this.idBadge.get('badgeType');
  }
  getIdbadge() {

    this.idBadgeService.getIdBagdge().subscribe((res) => {
      this.spinner = false;
      this.idBadge.get('scanBadgeToSignOut').setValue(res.settings[0].idBadge.scanBadgeToSignOut);
      if (res.settings[0].idBadge.badgeType === 'photo') {
        this.photos = true;
        this.standards = false;
        this.simples = false;
      }
      if (res.settings[0].idBadge.badgeType === 'standard') {
        this.standards = true;
        this.photos = false;
        this.simples = false;
      }
      if (res.settings[0].idBadge.badgeType === 'simple') {
        this.simples = true;
        this.standards = false;
        this.photos = false;
      }
      this.idBadge.get('badgeType').setValue(res.settings[0].idBadge.badgeType);
    })
  }
  files: any;
  getIdCompanyLogo() {
    this.idBadgeService.getIdCompanyLogo().subscribe(res => {
      res.response.forEach(data => {
        if (data.idBadge == 'Id Badge') {
          this.files = data.companyLogo

        }

      })
      // if(res.response[1].idBadge === 'Id Badge'){
      //   this.files=res.response[1].companyLogo
      // }
    })


  }
  submit() {
    this.spinner = true;
    this.idBadgeService.editIdBadge(this.idBadge.value).subscribe((res) => {
      if (!res.error) {
        this.spinner = false;
        this.toastr.success("Id badges updated successfully")
        this.getIdbadge();
      }
    })
  }
}
