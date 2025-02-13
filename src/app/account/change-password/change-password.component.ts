import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {PasswordsMatchValidator} from '../../shared/validators/password_match_validators';
import {Router} from '@angular/router';
import {Message} from 'primeng/message';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-change-password',
  standalone: false,

  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{
  form: FormGroup;
  isSubmitted = false;
  isSubmitting = false;
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private messageService: MessageService,
              private router: Router) {
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    },
      {
        validators: PasswordsMatchValidator("oldPassword","confirmPassword" )
      })
  }

  ngOnInit() {
  }

  get fc(){
    return this.form.controls;
  }

  submit() {
    this.isSubmitted = true;
    if(this.form.invalid) return;

    this.isSubmitting = true;
    const fv = this.form.value;
    console.log(fv)
    this.userService.updatePassword(fv['oldPassword'], fv['newPassword']).subscribe((res: any) => {
      this.isSubmitting = false;
      this.messageService.add({ severity: 'success', summary: `密码更新成功`, detail: `${res.message}!` });
      this.form.reset();
      this.isSubmitted = false;

    },
      (errorResponse) => {
        this.isSubmitting = false;
        this.isSubmitted = false;
        this.messageService.add({ severity: 'error', summary: `密码更新失败`, detail: `${errorResponse.error.message}!` });


      })
  }

}
