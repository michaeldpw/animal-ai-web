import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-update-profile',
  standalone: false,

  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent implements OnInit{
  selectedFile: File | null = null;
  avatarUrl: string = "";  // Store uploaded avatar URL
  isUploading = false;
  errorMessage = "";
  user: any;
  visible: boolean = false;

  constructor(private userService: UserService, private messageService: MessageService) {

  }

  ngOnInit() {
    this.userService.userObservable.subscribe((user: any) => {
      this.user = user.user;
    })
  }

  showDialog() {
    this.visible = true;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.type.startsWith("image/")) {
        this.errorMessage = "只能上传图片文件";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = "图片不能超过2MB";
        return;
      }

      this.selectedFile = file;
      this.errorMessage = "";

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadAvatar() {
    if (!this.selectedFile) {
      this.errorMessage = "Please select an image first!";
      return;
    }

    this.isUploading = true;
    this.userService.updateAvatar(this.selectedFile).subscribe({
      next: (res: any) => {
        console.log(res);
        this.messageService.add({ severity: 'success', summary: '头像更新成功', detail: '您的头像已更新' });
        // 更新localstorage中的user
        let userData = JSON.parse(localStorage.getItem('User')!);
        userData.user.avatarUrl = res.avatarUrl;
        localStorage.setItem('User', JSON.stringify(userData));
        this.avatarUrl = res.avatarUrl;  // Update with uploaded image URL
        this.user.avatarUrl = res.avatarUrl;
        this.isUploading = false;
        this.visible = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.messageService.add({ severity: 'error', summary: '头像更新失败', detail: '暂时无法更新头像' });
        this.isUploading = false;
        this.visible = false;
      }
    });
  }

  closeDialog() {
    this.visible = false;
    this.selectedFile = null;
    this.avatarUrl = "";
    this.errorMessage = "";

  }


}
