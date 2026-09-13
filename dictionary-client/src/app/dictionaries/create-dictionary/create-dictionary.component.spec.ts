import {ComponentFixture, TestBed} from "@angular/core/testing";
import {CreateDictionaryComponent} from "./create-dictionary.component";
import {DictionaryService} from "../dictionary.service";
import {of, Subject, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {DictionaryDto} from "../dictionary.models";

describe("CreateDictionaryComponent", () => {
    let mockDictionaryService: jasmine.SpyObj<DictionaryService>;
    let fixture: ComponentFixture<CreateDictionaryComponent>;
    let component: CreateDictionaryComponent;
    
    beforeEach(async () => {
        mockDictionaryService= jasmine.createSpyObj<DictionaryService>("DictionaryService", ["create"]);
        
        await TestBed.configureTestingModule({
            imports: [CreateDictionaryComponent],
            providers: [{provide: DictionaryService, useValue: mockDictionaryService}]
        }).compileComponents();
        
        fixture = TestBed.createComponent(CreateDictionaryComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should disable the button and show Creating... when a dictionary is being created', () => {
        const subject = new Subject<DictionaryDto>();
        mockDictionaryService.create.and.returnValue(subject);

        fixture.detectChanges();

        const htmlElement = fixture.nativeElement as HTMLElement;
        const buttonElement = htmlElement.querySelector("button") as HTMLButtonElement;

        // Act
        buttonElement.click();

        // Assert
        fixture.detectChanges();

        expect(component.isCreating()).toBeTrue();
        expect(buttonElement.disabled).toBeTrue();
        expect(buttonElement.textContent).toContain("Creating...")
        
    });

    it('should emit created output and reset the button when creation succeeds', () => {
        // Arrange
        mockDictionaryService.create.and.returnValue(of({
            dbId: "test dbId",
            dbName: "test dbName"
        }));
        
        fixture.detectChanges();
        
        const htmlElement = fixture.nativeElement as HTMLElement;
        const buttonElement = htmlElement.querySelector("button") as HTMLButtonElement;
        
        spyOn(component.created, "emit");

        // Act
        buttonElement.click();

        // Assert
        fixture.detectChanges();
        
        expect(mockDictionaryService.create).toHaveBeenCalled();
        expect(component.created.emit).toHaveBeenCalled();
        expect(component.isCreating()).toBeFalse();
        expect(buttonElement.disabled).toBeFalse();
    });

    it('should set errors, reset the button, and not emit created output when creation fails', () => {
        // Arrange
        mockDictionaryService.create.and.returnValue(throwError(() => new HttpErrorResponse({status: 500})));

        fixture.detectChanges();

        const htmlElement = fixture.nativeElement as HTMLElement;
        const buttonElement = htmlElement.querySelector("button") as HTMLButtonElement;

        spyOn(component.created, "emit");

        // Act
        buttonElement.click();

        // Assert
        fixture.detectChanges();

        expect(component.errors()).toEqual(["Unable to create the dictionary. Please try again."])
        expect(component.created.emit).not.toHaveBeenCalled();
        expect(component.isCreating()).toBeFalse();
        expect(buttonElement.disabled).toBeFalse();
        
    });
});