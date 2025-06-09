import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceHistoryComponent } from './device-history.component';

describe('DeviceHistoryComponent', () => {
  let component: DeviceHistoryComponent;
  let fixture: ComponentFixture<DeviceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
