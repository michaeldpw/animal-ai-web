import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PostService} from '../../services/post.service';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-new-post',
  standalone: false,

  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent implements OnInit{
  form: FormGroup;
  isSubmitted = false;
  user: any;
  isSubmitting = false;
  constructor(private fb: FormBuilder,
              private postService: PostService,
              private router: Router,
              private messageService: MessageService,
              private userService: UserService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.userService.userObservable.subscribe((u: any) => {
      console.log(u);
      this.user = u.user;
    })

  }

  get fc(){
    return this.form.controls;
  }

  submit(e: any) {
    e.preventDefault();
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.isSubmitted = false;
    const title = this.form.controls['title'].value;
    const content = this.form.controls['content'].value;
    this.isSubmitting = true;

    this.postService.createPost(title, content, this.user.id).subscribe((res: any) => {
      console.log(res);
      this.isSubmitting = true;
      this.router.navigateByUrl('/posts').then(() => {
      this.messageService.add({ severity: 'success', summary: `发布成功`, detail: `${res.message}!` })
    });


    },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: `发布失败`, detail: `${error.message}!` })

      })
  }

}
