import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUploadedInventoryComponent } from './view-uploaded-inventory.component';

describe('ViewUploadedInventoryComponent', () => {
  let component: ViewUploadedInventoryComponent;
  let fixture: ComponentFixture<ViewUploadedInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewUploadedInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUploadedInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
