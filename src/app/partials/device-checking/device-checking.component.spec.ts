import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCheckingComponent } from './device-checking.component';

describe('DeviceCheckingComponent', () => {
  let component: DeviceCheckingComponent;
  let fixture: ComponentFixture<DeviceCheckingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceCheckingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
