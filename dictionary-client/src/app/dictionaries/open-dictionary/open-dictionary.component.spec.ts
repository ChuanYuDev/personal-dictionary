import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenDictionaryComponent } from './open-dictionary.component';
import {DictionaryService} from "../dictionary.service";

describe('OpenDictionaryComponent', () => {
    let mockDictionaryService: jasmine.SpyObj<DictionaryService>;
    let component: OpenDictionaryComponent;
    let fixture: ComponentFixture<OpenDictionaryComponent>;

    beforeEach(async () => {
        
        await TestBed.configureTestingModule({
            imports: [OpenDictionaryComponent],
            providers: [{provide: DictionaryService, useValue: mockDictionaryService}]
        }).compileComponents();

        fixture = TestBed.createComponent(OpenDictionaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
