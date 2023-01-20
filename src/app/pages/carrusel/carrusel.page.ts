import { CamaraService } from './../../servicios/camara.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.page.html',
  styleUrls: ['./carrusel.page.scss'],
})
export class CarruselPage implements OnInit {

  options={
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true,
    speed: 400
   }; 

  constructor(public usarCamara: CamaraService) { }

  ngOnInit() {
  }

}
