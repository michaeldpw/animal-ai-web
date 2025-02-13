import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import {AccountRoutingModule} from './account-routing.module';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {PasswordModule} from 'primeng/password';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FloatLabel, FloatLabelModule} from 'primeng/floatlabel';
import {ButtonModule} from 'primeng/button';
import {Dialog, DialogModule} from 'primeng/dialog';



@NgModule({
  declarations: [
    ProfileComponent,
    UpdateProfileComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    ButtonModule,
    DialogModule
  ]
})
export class AccountModule { }
