import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInformatinoComponent } from './form-informatino.component';

describe('FormInformatinoComponent', () => {
  let component: FormInformatinoComponent;
  let fixture: ComponentFixture<FormInformatinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInformatinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormInformatinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
