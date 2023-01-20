import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'camara',
    loadChildren: () => import('./pages/camara/camara.module').then( m => m.CamaraPageModule)
  },
  {
    path: 'carrusel',
    loadChildren: () => import('./pages/carrusel/carrusel.module').then( m => m.CarruselPageModule)
  },
  {
    path: 'geolocalizacion',
    loadChildren: () => import('./pages/geolocalizacion/geolocalizacion.module').then( m => m.GeolocalizacionPageModule)
  },
  {
    path: 'graficos',
    loadChildren: () => import('./pages/graficos/graficos.module').then( m => m.GraficosPageModule)
  },
  {
    path: 'videos',
    loadChildren: () => import('./pages/videos/videos.module').then( m => m.VideosPageModule)
  },
  {
    path: 'fotos',
    loadChildren: () => import('./pages/fotos/fotos.module').then( m => m.FotosPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
