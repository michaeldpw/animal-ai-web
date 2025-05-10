import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacesComponent } from './places/places.component';
import {PlacesRoutingModule} from './places-routing.module';
import { CreatePlaceComponent } from './create-place/create-place.component';
import {ButtonModule} from 'primeng/button';
import {DrawerModule} from 'primeng/drawer';
import {FormsModule} from '@angular/forms';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';



@NgModule({
  declarations: [
    PlacesComponent,
    CreatePlaceComponent
  ],
  imports: [
    CommonModule,
    PlacesRoutingModule,
    ButtonModule,
    DrawerModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule
  ]
})
export class PlacesModule { }
