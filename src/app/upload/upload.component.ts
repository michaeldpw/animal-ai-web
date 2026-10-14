import { Component } from '@angular/core';
import {DiagnosisService} from '../services/diagnosis.service';
import {Message} from 'primeng/message';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-upload',
  standalone: false,

  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading: boolean = false;
  result: any;

  constructor(private diagnosisService: DiagnosisService, private messageService: MessageService) {
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.imagePreview = null;
      alert('请选择图片文件!');
    }
  }

  clearImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.result = null;
  }

  upload(): void {
    if (!this.selectedFile) return;
    console.log('上传文件:', this.selectedFile);
    this.isLoading = true;
    // 使用web端上传的照片不传deviceId为null
    this.diagnosisService.uploadAndDiagnosis({file: this.selectedFile, deviceId: ''}).pipe(
    ).subscribe((res: any) => {
      console.log(res);
      this.result = res;
    },
      (e) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: '推理失败', detail: `${e.error.error}`});

      },
      () => {
        this.isLoading = false;

      })
  }

}
