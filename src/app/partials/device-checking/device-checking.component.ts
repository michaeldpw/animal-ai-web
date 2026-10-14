import {Component, OnInit} from '@angular/core';
import {DeviceService} from '../../services/device.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-device-checking',
  standalone: false,

  templateUrl: './device-checking.component.html',
  styleUrl: './device-checking.component.scss'
})
export class DeviceCheckingComponent implements OnInit{
  isChecking: boolean = true;
  isBound: boolean = false;
  msg: string = '';
  deviceBoundForm!:FormGroup;
  isSubmitted = false;
  isSubmitting = false;
  device: any;

  constructor(private deviceService: DeviceService,private formBuilder: FormBuilder, public ref: DynamicDialogRef) {
    this.deviceBoundForm = this.formBuilder.group({
      deviceId:['', Validators.required],
      deviceName:['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit():void {
    this.deviceService.checkDevice().subscribe((r: any) => {
      console.log(r);
      setTimeout(() => {
        this.isChecking = false;
        if (r.success) {
          this.isBound = r.bound;
          this.msg = r.message;
          if (r.device) {
            this.device = r.device;
          }
        }
      }, 2000)
    })

  }

  get fc(){
    return this.deviceBoundForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.deviceBoundForm.invalid) return;

    this.isSubmitting = true;
    this.deviceService.bindDevice({deviceId:this.fc['deviceId'].value,
      name: this.fc['deviceName'].value, location: this.fc['location'].value}).subscribe(() => {
        this.isSubmitting = false;

      },
      () => {
        this.isSubmitting = false;
      });
  }

  closeDialog() {
    this.ref.close();
  }

}
