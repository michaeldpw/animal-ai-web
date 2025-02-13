import {RouterModule, Routes} from '@angular/router';
import {TimelineComponent} from '../timeline/timeline.component';
import {NgModule} from '@angular/core';
import {TimelineNewComponent} from './timeline-new/timeline-new.component';


const routes: Routes = [
  {
    path: '',
    component: TimelineComponent,
  },
  {
    path: 'new',
    component: TimelineNewComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelineRoutingModule { }
