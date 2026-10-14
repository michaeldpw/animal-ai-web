import {Component, OnInit} from '@angular/core';
import {AlertEmailService} from '../services/alert-email.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-alert-email',
  standalone: false,

  templateUrl: './alert-email.component.html',
  styleUrl: './alert-email.component.scss'
})
export class AlertEmailComponent implements OnInit{
  deviceId = 'raspi-001';
  emails: any[] = [];
  newEmail: string = '';
  loading = false;

  constructor(private alertEmailService: AlertEmailService, private message: MessageService) {
  }

  ngOnInit() {
    this.loadEmails();

  }

  /** 加载设备绑定的邮箱列表 */
  loadEmails() {
    this.loading = true;
    this.alertEmailService.getAlertEmails(this.deviceId).subscribe({
      next: (res: any) => {
        this.emails = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        // this.message.add({ severity: 'error', summary: '加载失败', detail: '无法获取邮箱列表' });
        this.loading = false;
      },
    });
  }

  /** 添加邮箱 */
  addEmail() {
    if (!this.newEmail.trim()) {
      this.message.add({ severity: 'warn', summary: '提示', detail: '请输入邮箱地址' });
      return;
    }

    this.alertEmailService.addAlertEmail({deviceId: this.deviceId, email: this.newEmail}).subscribe({
      next: (res: any) => {
        this.message.add({ severity: 'success', summary: '成功', detail: '邮箱添加成功' });
        this.newEmail = '';
        this.loadEmails();
      },
      error: (err) => {
        console.error(err);
        this.message.add({ severity: 'error', summary: '添加失败', detail: err.error?.message || '服务器错误' });
      },
    });
  }

  /** 删除邮箱 */
  deleteEmail(id: string) {
    if (!confirm('确认删除该邮箱吗？')) return;
    this.alertEmailService.deleteAlertEmail(id).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: '成功', detail: '邮箱已删除' });
        this.loadEmails();
      },
      error: (err) => {
        console.error(err);
        this.message.add({ severity: 'error', summary: '删除失败', detail: '服务器错误' });
      },
    });
  }

}
