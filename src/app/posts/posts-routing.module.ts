import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../home/home.component';
import {TimelineComponent} from '../timeline/timeline.component';
import {PostsComponent} from './posts.component';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
import {NgModule} from '@angular/core';
import {NewPostComponent} from './new-post/new-post.component';
import {PostDetailComponent} from './post-detail/post-detail.component';


const routes: Routes = [
  {
    path: '',
    component: PostsComponent,
  },
  {
    path: 'new',
    component: NewPostComponent
  },
  {
    path: ':id',
    component: PostDetailComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
