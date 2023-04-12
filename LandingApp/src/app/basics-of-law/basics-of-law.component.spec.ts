import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicsOfLawComponent } from './basics-of-law.component';

describe('BasicsOfLawComponent', () => {
  let component: BasicsOfLawComponent;
  let fixture: ComponentFixture<BasicsOfLawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicsOfLawComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicsOfLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
