
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CameraControlService implements OnDestroy {

  private ws: WebSocket | null = null;

  private readonly apiUrl = `${environment.apiUrl}/camera`;

  private readonly wsUrl = environment.apiUrl
    .replace(/^http/, 'ws')
    .replace(/\/api\/?$/, '/ws/control');

  connected$ = new BehaviorSubject<boolean>(false);
  deviceOnline$ = new BehaviorSubject<boolean>(false);

  pan$ = new BehaviorSubject<number>(90);
  tilt$ = new BehaviorSubject<number>(90);

  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectDelay = 10000;
  private manuallyDisconnected = false;
  private connectingPromise: Promise<void> | null = null;

  constructor(private http: HttpClient) {}

  async connect(): Promise<void> {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    // 使用现有 JWT 认证机制。
    // 如果你的项目使用 Authorization 请求头，
    // 请确保现有 HttpInterceptor 会自动添加。
    const response = await firstValueFrom(
      this.http.post<{ticket: string}>(
        `${this.apiUrl}/ws-ticket`,
        {}
      )
    );

    const ws = new WebSocket(
      `${this.wsUrl}?ticket=${encodeURIComponent(response.ticket)}`
    );

    this.ws = ws;

    ws.onopen = () => {
      this.connected$.next(true);
      this.reconnectAttempts = 0;
      console.log('云台 WebSocket 已连接');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === 'device_connection') {
          this.deviceOnline$.next(message.online);
        }

        if (message.type === 'camera_status') {
          this.pan$.next(message.pan);
          this.tilt$.next(message.tilt);
        }

        if (message.type === 'camera_error') {
          console.error('云台控制错误:', message.message);
        }
      } catch (error) {
        console.error('WebSocket 消息解析失败:', error);
      }
    };

    ws.onclose = () => {
      if (this.ws === ws) {
        this.connected$.next(false);
        this.deviceOnline$.next(false);
        this.ws = null;
        console.log('云台 WebSocket 已断开');

        this.scheduleReconnect();
      }
    };

    ws.onerror = () => {
      console.error('云台 WebSocket 连接异常');
    };
  }

  move(pan: number, tilt: number): boolean {
    if (
      this.ws?.readyState !== WebSocket.OPEN ||
      !this.deviceOnline$.value
    ) {
      return false;
    }

    if (
      !Number.isFinite(pan) ||
      !Number.isFinite(tilt) ||
      pan < 5 || pan > 175 ||
      tilt < 30 || tilt > 130
    ) {
      return false;
    }

    this.ws.send(JSON.stringify({
      type: 'camera_move',
      pan,
      tilt
    }));

    return true;
  }

  private scheduleReconnect(): void {
    if (this.manuallyDisconnected || this.reconnectTimer) {
      return;
    }

    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;

      this.connect().catch(error => {
        console.error('云台 WebSocket 重连失败:', error);
        this.scheduleReconnect();
      });
    }, delay);
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
    this.connected$.next(false);
    this.deviceOnline$.next(false);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
