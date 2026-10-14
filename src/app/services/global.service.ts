import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Global service
})
export class GlobalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false); // Default: closed

  private isSidebarOpenSubject = new BehaviorSubject<boolean>(true); // Default: opened
  // 外部组件可以订阅它
  sidebarVisible$ = this.isSidebarOpenSubject.asObservable();

  private isSidebarHiddenSubject = new BehaviorSubject<boolean>(true); // 登录之前隐藏sidebar

  sidebarHidden$ = this.isSidebarHiddenSubject.asObservable();


  constructor() {}

  // Observable for drawer state
  getDrawerState(): Observable<boolean> {
    return this.isOpenSubject.asObservable();
  }

  getSidebarState(): Observable<boolean> {
    return this.isSidebarOpenSubject.asObservable();
  }

  getSidebarHiddenState(): Observable<boolean> {
    return this.isSidebarHiddenSubject.asObservable();
  }

  // Toggle drawer
  toggleDrawer(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }
  // Toggle drawer
  toggleSidebar(): void {
    this.isSidebarOpenSubject.next(!this.isSidebarOpenSubject.value);
  }


  // Force open/close
  setDrawerState(state: boolean): void {
    this.isOpenSubject.next(state);
  }
  // Force open/close
  setSidebarState(state: boolean): void {
    this.isSidebarOpenSubject.next(state);
  }

  setSidebarHiddenState(state: boolean): void {
    this.isSidebarHiddenSubject.next(state);
  }

}
