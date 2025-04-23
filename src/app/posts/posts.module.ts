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
import {CommentComponent} from '../partials/comment/comment.component';
import {AvatarModule} from 'primeng/avatar';
import {FloatLabelModule} from 'primeng/floatlabel';
import {TextareaModule} from 'primeng/textarea';



@NgModule({
  declarations: [
    PostsComponent,
    NewPostComponent,
    PostDetailComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    EditorModule,
    PaginatorModule,
    AvatarModule,
    FloatLabelModule,
    TextareaModule
  ],
  providers: [DatePipe]
})
export class PostsModule { }
