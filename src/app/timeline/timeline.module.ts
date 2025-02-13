import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Timeline} from 'primeng/timeline';
import {CardModule} from 'primeng/card';
import { TimelineNewComponent } from './timeline-new/timeline-new.component';
import {TimelineRoutingModule} from './timeline-routing.module';
import {FloatLabelModule} from 'primeng/floatlabel';
import {TextareaModule} from 'primeng/textarea';
import {InputTextModule} from 'primeng/inputtext';
import {DatePickerModule} from 'primeng/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {AnimateOnScroll} from 'primeng/animateonscroll';



@NgModule({
  declarations: [
    TimelineNewComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    TimelineRoutingModule,
    FloatLabelModule,
    TextareaModule,
    InputTextModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    AnimateOnScroll
  ]
})
export class TimelineModule { }
