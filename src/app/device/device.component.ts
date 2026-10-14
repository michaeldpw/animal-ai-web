import {Component, OnInit} from '@angular/core';
import {DeviceService} from '../services/device.service';

@Component({
  selector: 'app-device',
  standalone: false,

  templateUrl: './device.component.html',
  styleUrl: './device.component.scss'
})
export class DeviceComponent implements OnInit{

  device: any;
  onlineDetails: any;

  constructor(private deviceService: DeviceService) {
  }

  ngOnInit() {
    this.deviceService.checkDevice().subscribe((res: any) => {
      console.log(res);
      this.device = res.device;
    });
    this.deviceService.online$.subscribe((onlineDetails: any) => {
      console.log(onlineDetails);
      this.onlineDetails = onlineDetails;
    });
  }

}
