import {Component, inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import * as THREE from "three";
// import {SimplexNoise} from "three/examples/jsm/math/SimplexNoise";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {fromEvent, Observable, Subscription} from "rxjs";
import {UserService} from "../services/user.service";
import {DeviceCheckingComponent} from '../partials/device-checking/device-checking.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DeviceService} from '../services/device.service';
import { CameraControlService } from '../services/camera-control.service';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

// @HostListener('window:resize', ['$event'])
// onResize(event) {
//   event.target.innerWidth;
// }
export class HomeComponent implements OnInit, OnDestroy {

  private readonly cameraSubscriptions = new Subscription();
  private subscription1 = new Subscription();
  private subscription2 = new Subscription();
  private subscription3 = new Subscription();
  private subscription4 = new Subscription();


  container: HTMLElement | null | undefined;
  visible: boolean = true;
  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  clock: any;
  controls: THREE.Controls<any> | any;
  nucleus: any;
  sphereBg: THREE.Mesh | undefined;
  stars: any;
  cameraSpeed = 0;
  blobScale = 3;
  delta = 0;
  // noise = new SimplexNoise();

  timeout_Debounce: any;

  resizeObservable$: Observable<Event> | undefined;
  resizeSubscription$: Subscription | undefined;

  currentUser: any;

  lineData: any;
  lineOptions: any;

  pieData: any;
  pieOptions: any;
  date: Date = new Date();
  lowConfidenceDays: string[] = [];
  confidences: { date: string; value: number }[] = [];
  ref: DynamicDialogRef | undefined;

  deviceStatusSubscription!: Subscription;
  isDeviceOnline: boolean = false;
  device: any;


  // ===== 云台控制 =====
  pan = 90;
  tilt = 90;

  readonly panMin = 5;
  readonly panMax = 175;
  readonly tiltMin = 30;
  readonly tiltMax = 130;

  readonly cameraStep = 5;

  cameraWsConnected = false;
  cameraDeviceConnected = false;

  get cameraControlAvailable(): boolean {
    return this.cameraWsConnected && this.cameraDeviceConnected;
  }

  moveCamera(direction: 'up' | 'down' | 'left' | 'right'): void {
    let targetPan = this.pan;
    let targetTilt = this.tilt;

    switch (direction) {
      case 'left': targetPan += this.cameraStep; break;
      case 'right': targetPan -= this.cameraStep; break;
      case 'up': targetTilt -= this.cameraStep; break;
      case 'down': targetTilt += this.cameraStep; break;
    }

    this.updateCameraAngles(targetPan, targetTilt);
  }

  updateCameraAngles(pan: number, tilt: number): void {
    const targetPan = Math.max(
      this.panMin,
      Math.min(this.panMax, pan)
    );

    const targetTilt = Math.max(
      this.tiltMin,
      Math.min(this.tiltMax, tilt)
    );

    if (!this.cameraControl.move(targetPan, targetTilt)) {
      console.warn('云台未连接，无法发送指令');
      return;
    }

    // 不立即修改 pan / tilt；
    // 等待树莓派 camera_status 确认后更新页面。
  }

  centerCamera(): void {
    this.updateCameraAngles(90, 90);
  }

  onPanChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.updateCameraAngles(value, this.tilt);
  }

  onTiltChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.updateCameraAngles(this.pan, value);
  }




  constructor(userService: UserService,
              public deviceService: DeviceService,
              public dialogService: DialogService,
              public cameraControl: CameraControlService
  ) {
    userService.userObservable.subscribe(u => {
      console.log(u);
      this.currentUser = u;

    });

  }

  ngOnInit(): void {

    this.subscription1 = this.cameraControl.connected$.subscribe(connected => {
      this.cameraWsConnected = connected;
    });

    this.subscription2 = this.cameraControl.deviceOnline$.subscribe(online => {
      this.cameraDeviceConnected = online;
    });

    this.subscription3 = this.cameraControl.pan$.subscribe(pan => {
      this.pan = pan;
    });

    this.subscription4 = this.cameraControl.tilt$.subscribe(tilt => {
      this.tilt = tilt;
    });

    this.cameraControl.connect().catch(error => {
      console.error('云台控制端连接失败:', error);
    });

    this.initCalendar();
    // ====== 最近30天的日期 ======
    const dates = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().split('T')[0];
    });

    // ====== 模拟30天置信度数据（0.8 ~ 0.98随机） ======
    const confidences = dates.map(() => +(0.8 + Math.random() * 0.18).toFixed(3));

    // ====== 折线图配置 ======
    this.lineData = {
      labels: dates,
      datasets: [
        {
          label: '图像识别置信度（最近30天）',
          data: confidences,
          fill: false,
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F588',
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: '#42A5F5'
        }
      ]
    };

    this.lineOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#333' }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#666',
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            maxTicksLimit: 10 // 避免日期太密集
          },
          grid: { color: '#eee' }
        },
        y: {
          min: 0.7,
          max: 1.0,
          ticks: { stepSize: 0.05, color: '#666' },
          grid: { color: '#eee' }
        }
      }
    };

    // ====== 饼图（虚构置信度区间占比） ======
    this.pieData = {
      labels: ['<0.5', '<0.6', '<0.7', '<0.8', '≥0.8'],
      datasets: [
        {
          data: [2, 5, 15, 28, 50], // 百分比
          backgroundColor: [
            '#EF5350', // 红
            '#FFA726', // 橙
            '#FFEE58', // 黄
            '#42A5F5', // 蓝
            '#66BB6A'  // 绿
          ],
          hoverBackgroundColor: [
            '#EF5350aa',
            '#FFA726aa',
            '#FFEE58aa',
            '#42A5F5aa',
            '#66BB6Aaa'
          ]
        }
      ]
    };

    this.pieOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#333',
            boxWidth: 20
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.label}: ${context.parsed}%`
          }
        }
      }
    };

  }

  initCalendar():void {
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const confidence = +(0.4 + Math.random() * 0.6).toFixed(2);
      this.confidences.push({
        date: d.toISOString().split('T')[0],
        value: confidence
      });
    }

    // 找出置信度 < 0.5 的日期
    this.lowConfidenceDays = this.confidences
      .filter(c => c.value < 0.5)
      .map(c => c.date);
  }

  // 用于模板中判断是否是低置信度日
  isLowConfidenceDay(dayObj: any): boolean {
    // PrimeNG dayTemplate 传入 dayObj，里面有 jsdate
    const dateObj: Date = dayObj.jsdate;

    if (!dateObj) return false;

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const date = String(dateObj.getDate()).padStart(2, '0');

    const dateStr = `${year}-${month}-${date}`;
    return this.lowConfidenceDays.includes(dateStr);
  }

  ngOnDestroy(): void {
    // this.cameraSubscriptions.unsubscribe();
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();

    this.deviceStatusSubscription?.unsubscribe();
    this.resizeSubscription$?.unsubscribe();

    // 当前首页负责建立云台连接。
    // 离开首页时主动断开，避免无用连接。
    this.cameraControl.disconnect();
  }


}
