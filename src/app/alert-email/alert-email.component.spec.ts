import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertEmailComponent } from './alert-email.component';

describe('AlertEmailComponent', () => {
  let component: AlertEmailComponent;
  let fixture: ComponentFixture<AlertEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
