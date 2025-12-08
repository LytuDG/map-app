import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateContentModalComponent } from './create-content-modal.component';

describe('CreateContentModalComponent', () => {
  let component: CreateContentModalComponent;
  let fixture: ComponentFixture<CreateContentModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CreateContentModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateContentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
