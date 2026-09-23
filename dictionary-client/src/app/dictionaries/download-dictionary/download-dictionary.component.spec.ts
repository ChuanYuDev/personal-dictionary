import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDictionaryComponent } from './download-dictionary.component';

describe('DownloadDictionaryComponent', () => {
    let component: DownloadDictionaryComponent;
    let fixture: ComponentFixture<DownloadDictionaryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DownloadDictionaryComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DownloadDictionaryComponent);
        component = fixture.componentInstance;
        
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
