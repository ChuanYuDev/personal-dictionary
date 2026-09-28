import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { DownloadDictionaryComponent } from './download-dictionary.component';
import {DictionaryService} from "../dictionary.service";
import {of, Subject, throwError} from "rxjs";
import {signal} from "@angular/core";
import {DictionaryState} from "../dictionary.models";
import {HttpErrorResponse} from "@angular/common/http";

describe('DownloadDictionaryComponent', () => {
    let mockDictionaryService: jasmine.SpyObj<DictionaryService>;
    let component: DownloadDictionaryComponent;
    let fixture: ComponentFixture<DownloadDictionaryComponent>;
    let buttonElement: HTMLButtonElement;

    beforeEach(async () => {
        const dictionaryState = signal<DictionaryState>({
            dbId: "test dbId",
            dbName: "test dbName"
        }).asReadonly();
        
        mockDictionaryService = jasmine.createSpyObj<DictionaryService>("DictionaryService", ["download"], {dictionaryState});

        await TestBed.configureTestingModule({
            imports: [DownloadDictionaryComponent],
            providers: [{provide: DictionaryService, useValue: mockDictionaryService}]
        }).compileComponents();

        fixture = TestBed.createComponent(DownloadDictionaryComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
        
        const htmlElement = fixture.nativeElement as HTMLElement;
        buttonElement = htmlElement.querySelector("button") as HTMLButtonElement;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should disable the button and show Downloading... when a dictionary is being downloaded', () => {
        const subject = new Subject<Blob>;
        mockDictionaryService.download.and.returnValue(subject);
        
        buttonElement.click();
        
        fixture.detectChanges();
        
        expect(component.isDownloading()).toBeTrue();
        expect(buttonElement.disabled).toBeTrue();
        expect(buttonElement.textContent).toContain("Downloading...");
    });
    
    it('should trigger the file downloading and reset the button when download succeeds', () => {
        const blob = new Blob(["test"]);
        mockDictionaryService.download.and.returnValue(of(blob));
        
        const url = "blob: test";
        spyOn(URL, "createObjectURL").and.returnValue(url);
        spyOn(URL, "revokeObjectURL");
        
        const anchor = document.createElement("a");
        spyOn(document, "createElement").and.returnValue(anchor);
        spyOn(anchor, "click");
        
        // Act
        buttonElement.click();
        
        // Assert
        fixture.detectChanges();
        
        expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
        
        expect(anchor.download).toBe("test dbName.db");
        expect(anchor.href).toBe(url);
        expect(anchor.click).toHaveBeenCalledTimes(1);
        
        expect(URL.revokeObjectURL).toHaveBeenCalledWith(url);
        
        expect(component.isDownloading()).toBeFalse();
        expect(buttonElement.disabled).toBeFalse();
    });

    it('should log error, set errors, and reset the button when download fails', async () => {
        const httpErrorResponse = new HttpErrorResponse({
            status: 400,
            error: {
                detail: "test detail"
            }
        });
        
        mockDictionaryService.download.and.returnValue(throwError(() => httpErrorResponse));
        
        spyOn(console, "error");
        
        // Act
        buttonElement.click();
        
        // Assert
        await fixture.whenStable();
        fixture.detectChanges();
        
        expect(console.error).toHaveBeenCalledWith("Failed to download the dictionary", "error response: ", jasmine.anything());
        
        expect(component.isDownloading()).toBeFalse();
        expect(buttonElement.disabled).toBeFalse();
        
        expect(component.errors()).toEqual(["test detail"]);
    });
});