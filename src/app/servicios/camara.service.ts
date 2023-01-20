import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { GestionStorageService } from './gestion-storage.service';
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  listaUrl: string[] = [];
  listaPath: string[]= [];

  constructor(private platform: Platform, private usarStorage: GestionStorageService) {
    this.loadSaved();
   }

   private async loadSaved() {
    // Recupera los datos de Storage en formato string
    const photoList = await this.usarStorage.getObject("rutas");

    // Lo parsea a un array de objetos IFoto y lo almacena en el atributo accesoFotos
    // Si no obtiene datos inicializará el array para poder empezar a almacenar fotos.
    this.listaPath = JSON.parse(photoList.value) || [];    
    
    // Se obtiene una URL válida para visualizar cada foto guardada en el sistema de archivos
    // En los navegadores debemos cargar las imágenes en formato base64 para que se visualicen correctamente
    // En los dispositivos podemos obtener la URL a partir del path

    let webviewPath: string;
    for (let photo of this.listaPath) {
      if (!this.platform.is("hybrid")) {     
          const readFile = await Filesystem.readFile({
              path: photo,
              directory: Directory.Data
          });

          // La URL de la foto en base64 para que se pueda visualizar
          webviewPath = `data:image/jpeg;base64,${readFile.data}`;      
      } else {
        webviewPath = Capacitor.convertFileSrc(photo);
      }
      this.listaUrl.push(webviewPath);
    }
  }

  getListaUrl(): string[] {
    return this.listaUrl;
  }

  public async sacarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    // Guardamosla URL para visualizar la imagen añadiendo la cabecera base64
    this.listaUrl.push("data:image/jpeg;base64," + image.base64String);

    this.savePicture(image);

  }

  private async savePicture(image: any) {

    let base64Data = image.base64String;
    // Guarda el fichero
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    
    // Si trabajamos con el navegador, guardamos solo el nombre del fichero. Lo necesitaremos para 
    // Con dispositivos móviles guardaremos la ruta que nos devuelve
    let ruta: string;
  
    if (this.platform.is('hybrid')) {
      ruta = savedFile.uri;
    } else {
      ruta = fileName;
  
    }
  
    this.listaPath.push(ruta);
  
    // Almacenamos los datos de las fotos en Storage para poder acceder a ellas
    this.usarStorage.setObject("rutas", this.listaPath);
  }
}
