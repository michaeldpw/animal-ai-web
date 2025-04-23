import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommentService} from '../../services/comment.service';
import {MessageService} from 'primeng/api';
import {PostService} from '../../services/post.service';
import {isInputEmpty} from '../../shared/utils/utils';

@Component({
  selector: 'app-comment',
  standalone: false,

  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent implements OnInit{
  @Input() post: any;
  form: FormGroup;
  isSubmitted = false;
  user: any;
  isSubmitting = false;
  comments: any;
  constructor(private userService: UserService,
              private fb: FormBuilder,
              private commentService: CommentService,
              private messageService: MessageService,
              private cdr: ChangeDetectorRef,
              private postService: PostService) {
    this.form = fb.group({
      content: ['', Validators.required]
    })
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
      console.log(this.user);
      // this.cdr.detectChanges();

    })
  }

  ngOnInit() {
    this.postService.getAllCommentsByPostId(this.post.id).subscribe((allComments: any) => {
      console.log(allComments);
      this.comments = allComments;
      this.comments.map((c: any) => {
        c.isCommentInputOpen = false;
      })
      this.cdr.detectChanges();

    })
  }



  submit(e: any) {
    e.preventDefault();
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.isSubmitted = false;
    const commentData = {
      content: this.form.controls['content'].value,
      postId: this.post.id,
    };
    this.isSubmitting = true;

    this.commentService.createComment(commentData).subscribe((res: any) => {
        this.isSubmitting = false;
        this.form.reset();
        console.log(res);
        this.comments.unshift(res);
        this.cdr.detectChanges();
          this.messageService.add({ severity: 'success', summary: `评论成功`, detail: `您发布了一条评论` });



      },
      (error: any) => {
        this.isSubmitting = false;
        this.messageService.add({ severity: 'error', summary: `评论失败`, detail: `请稍后再试` });


      })
  }

  handleCommentButtonClick(comment: any) {
    console.log(comment)
    comment.isCommentInputOpen = true;
  }

  submitSubComment(e: any, comment: any, rootComment?: any) {
    e.preventDefault();

    if (isInputEmpty(comment.subComment)) return;
    comment.isSubCommentSubmiting = true;
    console.log(comment);
    const commentData = {
      content: comment.subComment,
      postId: this.post.id,
      parentCommentId: comment._id
    };
    this.commentService.createComment(commentData).subscribe((res: any) => {
      console.log(res);
      comment.isSubCommentSubmiting = false;
      comment.isCommentInputOpen = false;
      comment.subComment = '';
      if (rootComment) {
        rootComment.replies.unshift(res);
      } else {
        comment.replies.unshift(res);

      }
      this.cdr.detectChanges();
      this.messageService.add({ severity: 'success', summary: `评论成功`, detail: `您发布了一条评论` });



    })

  }
}
