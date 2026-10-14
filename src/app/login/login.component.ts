import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {GlobalService} from '../services/global.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DeviceCheckingComponent} from '../partials/device-checking/device-checking.component';
import {DeviceService} from '../services/device.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!:FormGroup;
  isSubmitted = false;
  returnUrl = '';
  isSubmitting = false;
  ref: DynamicDialogRef | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private globalService: GlobalService,
    private router: Router,
    private deviceService: DeviceService,
    public dialogService: DialogService

  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:['', [Validators.required,Validators.email]],
      password:['', Validators.required]
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  get fc(){
    return this.loginForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.loginForm.invalid) return;

    this.isSubmitting = true;
    this.userService.login({email:this.fc['email'].value,
      password: this.fc['password'].value}).subscribe(() => {
      this.isSubmitting = false;
      this.router.navigateByUrl(this.returnUrl).then(() => {
        this.globalService.setSidebarHiddenState(false);
        this.globalService.setSidebarState(true);
        // this.ref = this.dialogService.open(DeviceCheckingComponent, { header: '设备绑定', modal:true, width: '800px'})

      });
    },
      () => {
        this.isSubmitting = false;
      });
  }

}
