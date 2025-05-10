import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PlacesComponent} from './places/places.component';
import {CreatePlaceComponent} from './create-place/create-place.component';


const routes: Routes = [
  {
    path: '',
    component: PlacesComponent,
  },
  {
    path: 'new',
    component: CreatePlaceComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacesRoutingModule { }
