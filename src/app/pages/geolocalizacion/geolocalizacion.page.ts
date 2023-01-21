import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Observable } from 'rxjs/internal/Observable';

import { IDatosCamaras, ICamara } from './../../interfaces/mis-interfaces';

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.page.html',
  styleUrls: ['./geolocalizacion.page.scss'],
})
export class GeolocalizacionPage implements OnInit {
  public map: google.maps.Map = {} as google.maps.Map;
  camaras: ICamara[] = [];

  constructor(private servidorRest: HttpClient) { }

  ngOnInit() {
    this.initMap();
    this.getCamaras();
  }

  public async obtenerPosicion() {
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  };

  public onClick() {
    this.obtenerPosicion();
  }

  getCamaras() {
    // Se crea el Observable y nos suscribimos a él
    let datosCamaras: Observable<IDatosCamaras>;

    // Se hace la consuta Rest que nos devuelva todos las camaras
    datosCamaras = this.servidorRest.get<IDatosCamaras>("https://api.euskadi.eus/traffic/v1.0/cameras/bySource/1");

    datosCamaras.subscribe(datos => {
      // Se añaden al array las camaras recogidos
      this.camaras.push(...datos.cameras);
    });
  }
  
  public async initMap() {
    let coordenadas: Position;
    coordenadas = await this.obtenerPosicion();
    console.log("Posición actual:", coordenadas);

    // Obtenemos la latitud y la longitud
    const posicion = {
      lat: coordenadas.coords.latitude,
      lng: coordenadas.coords.longitude
    };

    // Mostramos el mapa centrado en la posición almacenada
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement,
      {
        zoom: 10,
        center: posicion,
      }
    );

    // Mostramos el marcador en la misma posición
    const marcadorUbicacion = new google.maps.Marker({
      position: posicion,
      map: map
    });

    //Creamos el objeto geocoder para convertir coordenadas en direcciones y viceversa
    const geocoder = new google.maps.Geocoder();

    // Creamos el objeto infowindow para mostrar la dirección sobre el marcador de la ubicación actual
    const infowindow = new google.maps.InfoWindow();

    // Ejecutamos el método geocode
    // Le pasamos la latitud y longitud, y una función de callback con el código que queremos que se ejecute una vez obtenida la dirección
    // Se mostrará sobre el mapa
    geocoder.geocode({ location: posicion }, function(results, status) {
      if (results[0]) {
        infowindow.setContent("<strong>Mi ubicación</strong><br>" + results[0].formatted_address);
        infowindow.open(map, marcadorUbicacion);
      } else {
        window.alert("No results found");
      }
    });

    // Creamos otro objeto infowindow para mostrar la información de cada una de las camaras
    const infoWindow2 = new google.maps.InfoWindow();

    // Recorremos el array de las camaras para mostrar un marcador por cada una de ellas
    for (let i = 0; i < this.camaras.length; i++) {
      // Cogemos su posicion
      const posicionCamara = {
        lat: Number(this.camaras[i].latitude),
        lng: Number(this.camaras[i].longitude)
      };

      // Configuramos y añadimos el marcador
      console.log(posicionCamara);
      const marcadorCamara = new google.maps.Marker({
        position: posicionCamara,
        map: map,
        icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
      });

      // Creamos un click linstener para cada marcador para que al hacer click sobre el muestre la información de la camara
      marcadorCamara.addListener("click", () => {
        infoWindow2.close();
        infoWindow2.setContent(this.camaras[i].cameraName + "<br>" + this.camaras[i].road + ", " + this.camaras[i].kilometer);
        infoWindow2.open(map, marcadorCamara);
      });
    }
  }
}
