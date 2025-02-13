import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {PostsComponent} from './posts.component';
import { NewPostComponent } from './new-post/new-post.component';
import {PostsRoutingModule} from './posts-routing.module';
import {ButtonModule} from 'primeng/button';
import { PostDetailComponent } from './post-detail/post-detail.component';
import {EditorModule} from 'primeng/editor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginatorModule} from 'primeng/paginator';



@NgModule({
  declarations: [
    PostsComponent,
    NewPostComponent,
    PostDetailComponent
  ],
  imports: [
    CommonModule,
  PostsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    EditorModule,
    PaginatorModule
  ],
  providers: [DatePipe]
})
export class PostsModule { }
