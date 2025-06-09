import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchedInventoryComponent } from './dispatched-inventory.component';

describe('DispatchedInventoryComponent', () => {
  let component: DispatchedInventoryComponent;
  let fixture: ComponentFixture<DispatchedInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchedInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchedInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
