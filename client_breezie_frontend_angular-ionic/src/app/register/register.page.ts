import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  private signaturePadOptions: Object = { 
    'maxWidth': 1,
    'minWidth': 1,
    'canvasWidth': 500,
    'canvasHeight': 600
  };

  constructor() {}
  
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
  }

  ngOnInit() {}
}
