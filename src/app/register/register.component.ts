import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PasswordsMatchValidator} from '../shared/validators/password_match_validators';
import {IUserRegister} from '../shared/interfaces/IUserRegister';

@Component({
  selector: 'app-register',
  standalone: false,

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  registerForm!:FormGroup;
  isSubmitted = false;
  returnUrl = '';
  isSubmitting = false;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email:['', [Validators.required,Validators.email]],
      firstName:['', Validators.required],
      lastName:['', Validators.required],
      nickName:['', Validators.required],
      password:['', [Validators.required, Validators.minLength(6)]],
      confirmPassword:['', Validators.required],
      secretCode: ['', Validators.required]
    }, {
      validators: PasswordsMatchValidator("password","confirmPassword" )
    });
  }


  get fc(){
    return this.registerForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.registerForm.invalid) return;

    this.isSubmitting = true;
    const fv = this.registerForm.value;
    const user: IUserRegister = {
      email: fv['email'],
      firstName: fv['firstName'],
      lastName: fv['lastName'],
      nickName: fv['nickName'],
      secretCode: fv['secretCode'],
      password: fv['password'],
      confirmPassword: fv['confirmPassword']
    }
    this.userService.register(user).subscribe(() => {
      this.isSubmitting = false;
      this.router.navigateByUrl(this.returnUrl);
    },
      () => {
        this.isSubmitting = false;
      });
  }


}
