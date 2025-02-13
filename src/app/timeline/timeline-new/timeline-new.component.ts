import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TimelineService} from '../../services/timeline.service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-timeline-new',
  standalone: false,

  templateUrl: './timeline-new.component.html',
  styleUrl: './timeline-new.component.scss'
})
export class TimelineNewComponent {
  maxDate: Date | undefined;
  imageFile: File | null = null;
  form: FormGroup;
  isSubmitted = false;
  isSubmitting = false;
  avatarUrl: string = "";
  constructor(private fb: FormBuilder,
              private timelineService: TimelineService,
              private router: Router,
              private messageService: MessageService) {
    this.maxDate = new Date();
    this.form = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
    console.log(this.imageFile)
    if (this.imageFile!.size > 2 * 1024 * 1024) {
      this.messageService.add({severity: 'info', text: '图片不能大于2MB', summary: '图片过大'});
      return;
    }

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.type.startsWith("image/")) {
        this.messageService.add({severity: 'info', text: '只能上传图片文件', summary: '请选择图片文件'});

        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.messageService.add({severity: 'info', text: '图片不能大于2MB', summary: '图片过大'});

        return;
      }

      this.imageFile = file;

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  get fc(){
    return this.form.controls;
  }

   submitForm() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.isSubmitting = true;
     this.isSubmitted = false;

     const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('date', this.form.value.date);
    formData.append('description', this.form.value.description);
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.timelineService.createTimeline(formData).subscribe((res: any) => {
      this.isSubmitting = false;
      this.form.reset();
      this.imageFile = null;
      this.avatarUrl = "";
      this.messageService.add({severity: 'success', text: '您已成创建一个节点', summary: '创建节点成功'});
    }, () => {
      this.isSubmitting = false;
      this.messageService.add({severity: 'error', text: '发生一些错误', summary: '创建失败'});
    });

  }

}
