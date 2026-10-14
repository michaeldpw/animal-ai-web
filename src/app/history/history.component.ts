import { Component } from '@angular/core';
import {ImageHistoryService} from '../services/image-history.service';

@Component({
  selector: 'app-history',
  standalone: false,

  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  data = [
    {
      date: '2025-10-23',
      images: [
        {
          src: '/assets/images/sample/cow_healthy_055.jpg',
          confidence: '80.7%',
          takenAt: '8:00',
          isIll: '否',
          disease: '无'
        },
        {
          src: '/assets/images/sample/cow_healthy_108.jpeg',
          confidence: '82.1%',
          takenAt: '17:00',
          isIll: '否',
          disease: '无'
        }
      ]
    },
    {
      date: '2025-10-22',
      images: [
        {
          src: '/assets/images/sample/cow_healthy_158.jpg',
          confidence: '75.2%',
          takenAt: '8:00',
          isIll: '否',
          disease: '无'
        },
        {
          src: '/assets/images/sample/cow_lumpy_skin_005.jpg',
          confidence: '8.6%',
          takenAt: '17:00',
          isIll: '是',
          disease: '牛结节疹'
        }
      ]
    },
    {
      date: '2025-10-21',
      images: [
        {
          src: '/assets/images/sample/cow_lumpy_skin_028.jpg',
          confidence: '11.2%',
          takenAt: '8:00',
          isIll: '是',
          disease: '牛结节疹'
        },
        {
          src: '/assets/images/sample/cow_lumpy_skin_034.jpg',
          confidence: '5.6%',
          takenAt: '17:00',
          isIll: '是',
          disease: '牛结节疹'
        }
      ]
    },
  ]
  constructor(private imageHistoryService: ImageHistoryService) {
  }



}
