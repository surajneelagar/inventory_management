import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkReturnableComponent } from './mark-returnable.component';

describe('MarkReturnableComponent', () => {
  let component: MarkReturnableComponent;
  let fixture: ComponentFixture<MarkReturnableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkReturnableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkReturnableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
