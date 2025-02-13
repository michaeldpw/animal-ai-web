import {Component, HostListener, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {TimelineService} from '../services/timeline.service';

interface Event {
  date: Date,
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-timeline',
  standalone: false,

  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})



export class TimelineComponent implements OnInit{
  isLoading = true;
  events: any;

  windowWidth: number;
  mode: string;


  constructor(private userService: UserService, private timelineService: TimelineService) {
    this.windowWidth = window.innerWidth;
    this.mode = this.windowWidth > 800 ? 'alternate' : 'left';
  }

  ngOnInit() {
    this.timelineService.getAllTimeline().subscribe((res: any) => {
      console.log(res);
      this.isLoading = false;
      this.events = res.timelines;
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateWindowSize();
  }

  updateWindowSize() {
    this.windowWidth = window.innerWidth;
    console.log(this.windowWidth)
    this.mode = this.windowWidth > 800 ? 'alternate' : 'left';

  }
}
