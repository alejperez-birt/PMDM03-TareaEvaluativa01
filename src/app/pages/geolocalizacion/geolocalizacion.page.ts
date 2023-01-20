import { Component, OnInit } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.page.html',
  styleUrls: ['./geolocalizacion.page.scss'],
})
export class GeolocalizacionPage implements OnInit {
  public map: google.maps.Map = {} as google.maps.Map;

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  

  public async obtenerPosicion() {

    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  };

  public onClick() {
    this.obtenerPosicion();
  }
  
  public async initMap() {
    let coordenadas: Position;
    coordenadas = await this.obtenerPosicion();
    console.log("Posición acctual:", coordenadas);

    // Obtenemos la latitud y la longitud
    const posicion = {
      lat: coordenadas.coords.latitude,
      lng: coordenadas.coords.longitude
    };

    // Mostramos el mapa centrado en la posición almacenada
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement,
      {
        zoom: 8,
        center: posicion,
      }
    );

    // Mostramos el marcador en la misma posición
    const marker = new google.maps.Marker({
      position: posicion,
      map: map,
    });

    // Creamos el objeto geocoder para convertir coordenadas en direcciones y viceversa
    const geocoder = new google.maps.Geocoder();

    // Creamos el objeto infowindow para mostrar la dirección sobre el marcador del mapa
    const infowindow = new google.maps.InfoWindow();

    // Ejecutamos el método geocode
    // Le pasamos la latitud y longitud, y una función de callback con el código que queremos que se ejecute una vez obtenida la dirección
    // Se mostrará sobre el mapa
    geocoder.geocode({ location: posicion }, function(results, status) {
      if (results[0]) {
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert("No results found");
      }
    });

    // Le pasamos la dirección y la función de callback para que cree otro marcado y
    // lo posicione en las coordenadas de esa dirección
    geocoder.geocode({ address: "Bilbao" }, function(results, status) {
      if (results[0]) {
        const marker2 = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
        });

        const infowindow2 = new google.maps.InfoWindow();
        infowindow2.setContent(results[0].formatted_address);
        infowindow2.open(map, marker2);
      } else {
        window.alert("No results found");
      }
    });
  }
}
