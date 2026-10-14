import {Component, ViewChild} from '@angular/core';
import {UserService} from './services/user.service';
import {User} from './shared/models/Users';
import {Drawer} from 'primeng/drawer';
import {GlobalService} from './services/global.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {Subscription} from 'rxjs';
import {DeviceService} from './services/device.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '智瞳诊牧';
  user!:any;
  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  visible: boolean = false;
  isDrawerOpen = false;

  isSidebarVisible = false;
  private sub!: Subscription;
  isSidebarHidden = true;
  private sidebarHiddenSub!: Subscription;
  constructor(private userService: UserService,
              private globalService: GlobalService,
              private messageService: MessageService,
              private deviceService: DeviceService,
              private router: Router) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
      if (this.user?.user?.id) {
        this.globalService.setSidebarHiddenState(false);
        this.deviceService.init();
      } else {
        this.deviceService.logoutCleanup();
      }

    });

    this.globalService.getDrawerState().subscribe(state => {
      this.isDrawerOpen = state;
    });

    this.sub = this.globalService.sidebarVisible$.subscribe(v => this.isSidebarVisible = v);
  this.sidebarHiddenSub = this.globalService.sidebarHidden$.subscribe(h => this.isSidebarHidden = h);
  }

  drawerStateChanged(e: any) {
    console.log(e);
    this.globalService.setDrawerState(e);
  }

  menuItemClicked(url: string) {
    this.router.navigateByUrl(url);
    this.globalService.setDrawerState(false);

  }

  logout() {
    this.userService.logout(true).subscribe(res => {
      this.globalService.setDrawerState(false);
      this.globalService.setSidebarHiddenState(true);
      this.messageService.add({ severity: 'success', summary: '再见', detail: `登出成功` });
    });
  }
}
