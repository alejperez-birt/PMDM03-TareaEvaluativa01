import { FotosService } from './../../servicios/fotos.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
})
export class FotosPage implements OnInit {

  constructor(public usarCamara: FotosService) { }

  ngOnInit() {
  }

  public takePicture() {
    this.usarCamara.sacarFoto();
  }
}
