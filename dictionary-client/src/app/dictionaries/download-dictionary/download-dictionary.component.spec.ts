import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDictionaryComponent } from './download-dictionary.component';
import {DictionaryService} from "../dictionary.service";

describe('DownloadDictionaryComponent', () => {
    let mockDictionaryService: jasmine.SpyObj<DictionaryService>;
    let component: DownloadDictionaryComponent;
    let fixture: ComponentFixture<DownloadDictionaryComponent>;

    beforeEach(async () => {
        mockDictionaryService = jasmine.createSpyObj<DictionaryService>("DictionaryService", ["download"]);
        
        await TestBed.configureTestingModule({
            imports: [DownloadDictionaryComponent],
            providers: [{provide: DictionaryService, useValue: mockDictionaryService}]
        }).compileComponents();

        fixture = TestBed.createComponent(DownloadDictionaryComponent);
        component = fixture.componentInstance;
        
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
