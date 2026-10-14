import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from './partials/header/header.component';
import {CommonModule, registerLocaleData} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {MenuModule} from 'primeng/menu';
import {BadgeModule} from 'primeng/badge';
import {RippleModule} from 'primeng/ripple';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {IconFieldModule} from 'primeng/iconfield';
import { TimelineComponent } from './timeline/timeline.component';
import { PostsComponent } from './posts/posts.component';
import { RegisterComponent } from './register/register.component';
import {AuthInterceptor} from './services/interceptors/auth.interceptor';
import { ToastModule } from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {PostsModule} from './posts/posts.module';
import zh from '@angular/common/locales/zh'
import {DrawerModule} from 'primeng/drawer';
import {TimelineModule} from "primeng/timeline";
import {CardModule} from 'primeng/card';
import {AnimateOnScrollModule} from 'primeng/animateonscroll';
import { CommentComponent } from './partials/comment/comment.component';
import {AccordionModule} from 'primeng/accordion';
import {SidebarModule} from 'primeng/sidebar';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ChartModule} from 'primeng/chart';
import {CalendarModule} from 'primeng/calendar';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import { DeviceCheckingComponent } from './partials/device-checking/device-checking.component';
import { HistoryComponent } from './history/history.component';
import { ImageComponent } from './partials/image/image.component';
import {DeviceService} from './services/device.service';
import { DeviceComponent } from './device/device.component';
import {DatePickerModule} from 'primeng/datepicker';
import { ImageHistoryComponent } from './image-history/image-history.component';
import {DialogModule} from 'primeng/dialog';
import { UploadComponent } from './upload/upload.component';
import { AlertEmailComponent } from './alert-email/alert-email.component';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';

registerLocaleData(zh);


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        LoginComponent,
        TimelineComponent,
        RegisterComponent,
        SidebarComponent,
        DeviceCheckingComponent,
        HistoryComponent,
        ImageComponent,
        DeviceComponent,
        ImageHistoryComponent,
        UploadComponent,
        AlertEmailComponent,

    ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      newestOnTop: false
    }),
    BrowserAnimationsModule,
    FormsModule, TableModule, TagModule,
    ReactiveFormsModule, DrawerModule, PanelMenuModule, ChartModule, CalendarModule, DynamicDialogModule, DatePickerModule,
    MenuModule, BadgeModule, RippleModule, AvatarModule, ButtonModule, IconFieldModule, ToastModule, DrawerModule, TimelineModule, CardModule, AccordionModule, AnimateOnScrollModule, SidebarModule, DialogModule

  ],
    providers: [
        provideAnimationsAsync(),
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: false
                }
            }
        }),
        {provide: LOCALE_ID, useValue: 'zh-CN'},
        MessageService,
      DialogService,
      DeviceService
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
