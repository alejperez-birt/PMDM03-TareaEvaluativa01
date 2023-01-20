import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarruselPage } from './carrusel.page';

const routes: Routes = [
  {
    path: '',
    component: CarruselPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarruselPageRoutingModule {}
