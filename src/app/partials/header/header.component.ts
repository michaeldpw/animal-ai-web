import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../shared/models/Users";
import {MenuItem, MessageService} from 'primeng/api';
import {NavigationEnd, Router} from '@angular/router';
import {GlobalService} from '../../services/global.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  user!:any;
  items: MenuItem[] | undefined;
  isTransparentMode: boolean = true;
  private sub!: Subscription;
  sidebarVisible = false;
  constructor(private userService: UserService,
              private router: Router,
              private messageService: MessageService,
              private cdr: ChangeDetectorRef,
              private globalService: GlobalService) {
    // this.cdr.detectChanges();
    // console.log('aaa', this.isTransparentMode)

    this.sub = this.globalService.sidebarVisible$.subscribe(v => {
      console.log(v);
      this.sidebarVisible = v;
      this.cdr.detectChanges();
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const transparentNavbarPages = ['/','/home'];
        this.isTransparentMode = transparentNavbarPages.includes(event.url);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
      this.cdr.detectChanges();

    })
    this.isTransparentMode = this.router.url === '/' || this.router.url === '/home';
    this.cdr.detectChanges();

    this.items = [
      // {
      //   separator: false
      // },
      // {
      //   label: 'Documents',
      //   items: [
      //     {
      //       label: 'New',
      //       icon: 'pi pi-plus',
      //       shortcut: '⌘+N'
      //     },
      //     {
      //       label: 'Search',
      //       icon: 'pi pi-search',
      //       shortcut: '⌘+S'
      //     }
      //   ]
      // },
      {
        label: '菜单',
        items: [
          {
            label: '我的主页',
            icon: 'pi pi-home',
            shortcut: '⌘+O',
            link: '/account/profile'
          },
          {
            label: '修改资料',
            icon: 'pi pi-pencil',
            link: '/account/update-profile'
            // badge: '2'
          },
          {
            label: '修改密码',
            icon: 'pi pi-key',
            link: '/account/change-password'
            // badge: '2'
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            shortcut: '⌘+Q'
          }
        ]
      },
      {
        separator: true
      }
    ];
  }

  toggleDrawer() {
    this.globalService.toggleDrawer();
  }

  logout() {
    this.userService.logout(true).subscribe(res => {
      this.globalService.setSidebarState(false);
      this.globalService.setSidebarHiddenState(true);
      this.messageService.add({ severity: 'success', summary: '再见', detail: `登出成功` });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
