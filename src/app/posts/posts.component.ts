import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {POST_URL} from '../shared/constants/urls';
import {PostService} from '../services/post.service';
import {UserService} from '../services/user.service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: false,

  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements OnInit{
  posts = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  isLoading = false;
  constructor(private postService: PostService,
              private cdr: ChangeDetectorRef,
              private router: Router,
              private userService: UserService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.loadPosts(this.currentPage, this.pageSize);
  }

  loadPosts(page: number, limit: number) {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.postService.getAllPosts(page, limit).subscribe((response: any) => {
      this.posts = response.data;
      console.log(this.posts);
      this.totalRecords = response.totalItems;
      this.isLoading = false;
      this.cdr.detectChanges();
    },
      () => {
        this.isLoading = false;
        this.router.navigateByUrl('/login?returnUrl=posts').then(() => {
          this.messageService.add({ severity: 'info', summary: '请求失败', detail: `请先登录` });
        })
      });
  }

  onPageChange(event: any) {
    this.currentPage = parseInt(event.page) + 1; // PrimeNG paginator starts from 0
    this.pageSize = event.rows;
    this.loadPosts(this.currentPage, this.pageSize);
  }


}
