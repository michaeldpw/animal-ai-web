import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DEVICE_URL} from '../shared/constants/urls';
import {BehaviorSubject, interval, of, Subscription, switchMap} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private deviceId: string | null = null;

  private deviceIDSubject = new BehaviorSubject<string | null>(null);
  deviceID$ = this.deviceIDSubject.asObservable();

  private onlineSubject = new BehaviorSubject<object | null>(null);
  online$ = this.onlineSubject.asObservable();

  private pollingSub?: Subscription;  // 👈 轮询订阅

  constructor(private http: HttpClient) {}

  /** 初始化：登录后调用, 先获取设备ID，再启动轮询 */
  init() {
    this.http.get<any>(`${DEVICE_URL}`)
      .pipe(
        catchError(err => {
          console.error('获取设备信息失败：', err);
          return of({ deviceId: null as any });
        })
      )
      .subscribe(res => {
        console.log(res);
        if (res.device?.deviceId) {
          this.deviceId = res.device.deviceId;
          this.deviceIDSubject.next(this.deviceId);
          console.log('绑定设备ID:', this.deviceId);
          this.startStatusPolling();
        } else {
          console.warn('未绑定任何设备');
        }
      });
  }

  /** 定时轮询设备状态 */
  private startStatusPolling() {
    // 避免重复启动
    this.stopStatusPolling();

    this.pollingSub = interval(10000)
      .pipe(
        switchMap(() => {
          if (!this.deviceId) return of({ online: false });
          return this.http.get<{ online: boolean }>(`${DEVICE_URL}/status/${this.deviceId}`)
            .pipe(catchError(err => {
              console.error('获取设备状态失败：', err);
              return of({ online: false });
            }));
        })
      )
      .subscribe(res => {
        this.onlineSubject.next(res);
        // console.log(`设备状态：${res.online ? '在线 ✅' : '离线 ❌'}`);
      });
  }

  /** 停止轮询 */
  stopStatusPolling() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = undefined;
      console.log('⏹️ 已停止设备状态轮询');
    }
  }

  checkDevice() {
    return this.http.get(`${DEVICE_URL}`);
  }

  bindDevice(data: any) {
    const {deviceId, name, location} = data;
    return this.http.post(`${DEVICE_URL}/bind`, { deviceId, deviceName: name, location });
  }

  /** 登出时调用 */
  logoutCleanup() {
    this.deviceId = null;
    this.onlineSubject.next(null);
    this.stopStatusPolling();
  }

  /** 服务销毁时调用 */
  ngOnDestroy() {
    this.stopStatusPolling();
  }
}
