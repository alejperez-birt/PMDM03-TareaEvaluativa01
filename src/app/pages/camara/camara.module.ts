import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CamaraPageRoutingModule } from './camara-routing.module';
import { CamaraPage } from './camara.page';
import { MisComponentesModule } from './../../components/mis-componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CamaraPageRoutingModule,
    MisComponentesModule
  ],
  declarations: [CamaraPage]
})
export class CamaraPageModule {}
