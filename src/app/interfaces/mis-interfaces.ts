// Creamos una interfaz para almacenar la ruta de la imagen en el disco duro (filepath)
// y la ruta para visualizarla webviewPath)
export interface IFoto {
    filepath: string;
    webviewPath: string;
  }

export interface IDatosCamaras {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  cameras: ICamara[];
}

export interface ICamara {
  cameraId: string;
  sourceId: string;
  cameraName: string;
  urlImage: string;
  latitude: string;
  longitude: string;
  road: string;
  kilometer: string;
}