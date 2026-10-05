import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenDictionaryComponent } from './open-dictionary.component';

describe('OpenDictionaryComponent', () => {
  let component: OpenDictionaryComponent;
  let fixture: ComponentFixture<OpenDictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenDictionaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
