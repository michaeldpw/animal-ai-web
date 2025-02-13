import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Global service
})
export class GlobalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false); // Default: closed

  constructor() {}

  // Observable for drawer state
  getDrawerState(): Observable<boolean> {
    return this.isOpenSubject.asObservable();
  }

  // Toggle drawer
  toggleDrawer(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  // Force open/close
  setDrawerState(state: boolean): void {
    this.isOpenSubject.next(state);
  }
}
