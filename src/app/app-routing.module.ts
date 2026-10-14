import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {TimelineComponent} from './timeline/timeline.component';
import {PostsComponent} from './posts/posts.component';
import {RegisterComponent} from './register/register.component';
import {authGuard} from './services/auth.guard';
import {loginRegisterGuardGuard} from './services/login-register-guard.guard';
import {HistoryComponent} from './history/history.component';
import {DeviceComponent} from './device/device.component';
import {ImageHistoryComponent} from './image-history/image-history.component';
import {UploadComponent} from './upload/upload.component';
import {AlertEmailComponent} from './alert-email/alert-email.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [authGuard]
  },
  {
    path: 'device',
    component: DeviceComponent,
    canActivate: [authGuard]
  },
  {
    path: 'upload-and-diagnose',
    component: UploadComponent,
    canActivate: [authGuard]
  },
  {
    path: 'images-history',
    component: ImageHistoryComponent,
    canActivate: [authGuard]
  },
  {
    path: 'alert-emails',
    component: AlertEmailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'timeline',
    loadChildren: () => import('./timeline/timeline.module').then((m) => m.TimelineModule),

  },
  {
    path: 'places',
    loadChildren: () => import('./places/places.module').then((m) => m.PlacesModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./posts/posts.module').then((m) => m.PostsModule),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginRegisterGuardGuard]

  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [loginRegisterGuardGuard]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
