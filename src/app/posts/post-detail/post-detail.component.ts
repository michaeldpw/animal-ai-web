import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PostService} from '../../services/post.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-post-detail',
  standalone: false,

  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailComponent implements OnInit{
  postID: string;
  post: any;
  isLoading: boolean = true;
  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.postID = this.route.snapshot.params['id'];
    console.log(this.postID);
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPostDetail(this.postID).subscribe((res: any) => {
      console.log(res);
      this.post = res;
      this.isLoading = false;
      this.cdr.detectChanges();
    },
      (error => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
  }


}
