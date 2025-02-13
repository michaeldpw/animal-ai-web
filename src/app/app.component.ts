import {Component, ViewChild} from '@angular/core';
import {UserService} from './services/user.service';
import {User} from './shared/models/Users';
import {Drawer} from 'primeng/drawer';
import {GlobalService} from './services/global.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'zmkdpw';
  user!:any;
  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  visible: boolean = false;
  isDrawerOpen = false;
  constructor(private userService: UserService,
              private globalService: GlobalService,
              private messageService: MessageService,
              private router: Router) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;

    });

    this.globalService.getDrawerState().subscribe(state => {
      this.isDrawerOpen = state;
    });
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
      this.messageService.add({ severity: 'success', summary: '再见', detail: `登出成功` });
    });
  }
}
