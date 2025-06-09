import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDeviceComponent } from './assign-device.component';

describe('AssignDeviceComponent', () => {
  let component: AssignDeviceComponent;
  let fixture: ComponentFixture<AssignDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
