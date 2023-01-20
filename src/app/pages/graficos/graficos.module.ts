import { NgChartsModule } from 'ng2-charts';
import { MisComponentesModule } from './../../components/mis-componentes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraficosPageRoutingModule } from './graficos-routing.module';

import { GraficosPage } from './graficos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraficosPageRoutingModule,
    MisComponentesModule,
    NgChartsModule
  ],
  declarations: [GraficosPage]
})
export class GraficosPageModule {}
