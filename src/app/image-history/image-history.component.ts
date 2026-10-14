import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ImageHistoryService} from '../services/image-history.service';

@Component({
  selector: 'app-image-history',
  standalone: false,

  templateUrl: './image-history.component.html',
  styleUrl: './image-history.component.scss'
})
export class ImageHistoryComponent implements OnInit{
  deviceId = '';
  groupedPhotos: any[] = [];
  loading = false;
  rangeDates: Date[] = [];
  visible: boolean = false;
  photo: any = null;

  constructor(private imageHistoryService: ImageHistoryService) {}



  // ngOnInit() {
  //   this.loadPhotos();
  //  }
  ngOnInit() {
    this.loadPhotos();
  }
  // loadDeviceId() {
  //   this.http.get<any>('/api/device/current').subscribe({
  //     next: res => {
  //       if (res?.deviceId) {
  //         this.deviceId = res.deviceId;
  //         this.loadPhotos();
  //       }
  //     },
  //     error: err => console.error('获取设备失败', err)
  //   });
  // }

  // loadPhotos() {
  //   this.imageHistoryService.loadImages('raspi-001', this.rangeDates).subscribe({
  //     next: res => {
  //       this.groupedPhotos = res.groupedPhotos || [];
  //       this.loading = false;
  //     },
  //     error: err => {
  //       // console.error('加载照片失败', err);
  //       this.loading = false;
  //     }
  //   });
  // }
// loadPhotos(){
//用loadimages方法,发起异步请求
//   this.imageHistoryService.loadImages('raspi-001',this.rangeDates).subscribe({
//将接口返回的groupedPhotos数据赋值给组件的grouperPhotos属性
//     next:res=>{
//       this.groupedPhotos=res.groupedPhotos ||[];
// 将加载状态设置为false
//       this.loading=false;
//     },
//     error:err=>{
//       this.loading=false;
//防止页面一直处于加载状态
//     }
//   });
// }
loadPhotos(){
  this.imageHistoryService.loadImages('raspi-001',this.rangeDates).subscribe({
    // 调用loadimages方法,发送异步请求,上传设备ID与时间范围参数
    next:res=>{
      this.groupedPhotos=res.groupedPhotos ||[];
      // 将后端接口返回的groupedPhotos数据赋值给组件groupedPhotos
      this.loading=false;
      // 将loading状态设置为false
    },
    error:err=>{
      this.loading=false;
      // 
    }
  });
}
openDialog(photo:any) {
  console.log(photo);
  this.photo=photo;
  this.visible=true;
}

}
