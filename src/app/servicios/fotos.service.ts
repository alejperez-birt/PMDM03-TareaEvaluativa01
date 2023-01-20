import { IFoto } from '../interfaces/mis-interfaces';
import { GestionStorageService } from './gestion-storage.service';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FotosService {
  // Array para almacenar las rutas de cada foto
  public accesoFotos: IFoto[] = [];

  // Carga las imágenes que tenemos almacenadas
  constructor(private usarStorage: GestionStorageService, private plataforma: Platform) {
    this.loadSaved();
  }

  // Devuelve el array para poderlo utilizar en un componente
  public getFotos() {
    return this.accesoFotos;
  }

  // Recupera las imágenes que hay almacenadas en el disco duro
  private async loadSaved() {
    // Recupera los datos de Storage en formato string
    const photoList = await this.usarStorage.getObject("fotos");

    // Lo parsea a un array de objetos IFoto y lo almacena en el atributo accesoFotos
    // Si no obtiene datos inicializará el array para poder empezar a almacenar fotos.
    this.accesoFotos = JSON.parse(photoList.value) || [];
    console.log(photoList);
    
    // En los navegadores debemos cargar las imágenes en formato base64 para que se visualicen correctamente
    if (!this.plataforma.is("hybrid")) {
      // Lee los datos de cada foto guardada en el sistema de archivos
      for (let photo of this.accesoFotos) {
        const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
        });

        // Plataforma web solamente: Guardar la foto en base64 para que se pueda visualizar
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  // Define las características de la foto y la saca
  public async sacarFoto() {
    // Definir características de la foto
    let caracteristicasFoto: ImageOptions = {
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    };
    const foto: Photo = await Camera.getPhoto(caracteristicasFoto);
    console.log(foto);

    // Se obtiene la URL y se añade al principio del array
    // let UrlFoto: string = foto.webPath;
    // this.urlFotos.unshift(UrlFoto);

    // En los dispositivos móviles las fotos se guardan por defecto y tenemos el path físico y el webpath para visualizar
    // En el navegador hay que guardar la imagen en un fichero y se almacena su path y su URL en el array
    let imagenGuardada: any;

    if (!this.plataforma.is("hybrid")) {
      imagenGuardada = await this.savePicture(foto);
    } else {
      // Guarda las rutas de acceso a la foto
      imagenGuardada = {
        filepath: foto.path,
        webviewPath: foto.webPath
      };
    }
    this.accesoFotos.unshift(imagenGuardada);
    console.log(imagenGuardada);


    // Almacenamos los datos de las fotos en Storage
    this.usarStorage.setObject("fotos", this.accesoFotos);


  }

  // Se almacena la imagen en el sistema de ficheros
  // Solo para el navegador
  private async savePicture(cameraPhoto: Photo) {
   
    // Convierte la foto al formato base64, exigido por la API del sistema de ficheros
    const base64Data = await this.readAsBase64(cameraPhoto);
  
    // Guarda el fichero
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data   // Los datos se borrarn al desinstalar la aplicación
    });

    console.log(savedFile);

    // Crea y devuelve un objeto IFoto
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    };
  }

  // Devuelve la imagen en formato base64 para trabajar en los navegadores
  // Recupera la imagen como blob y la convierte a base64
  private async readAsBase64(foto: Photo) {
    const response = await fetch(foto.webPath!);
    const blob = await response.blob();
    const base64 = await this.convertBlobToBase64(blob) as string;
    return base64;
  }
  
  // Conviete una imagen en formato blob a formato base 64
  private convertBlobToBase64(blob: Blob) {
    let promesa = new Promise( function(resolve, reject) {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

    return promesa;
  }
  
  // Here's an example of reading a file with a full file path. Use this to
  // read binary data (base64 encoded) from plugins that return File URIs, such as
  // the Camera.
  private async readFilePath() {
    const contents = await Filesystem.readFile({
      path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt'
    });

    console.log('data:', contents);
  };
}
