import {TestBed} from "@angular/core/testing";
import {provideHttpClient} from "@angular/common/http";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {DictionaryService} from "./dictionary.service";
import {DictionaryDto} from "./dictionary.models";
import {firstValueFrom, Observable} from "rxjs";

describe("DictionaryService", () => {
    let dictionaryService: DictionaryService;
    let httpTesting: HttpTestingController;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        
        dictionaryService = TestBed.inject(DictionaryService);
        httpTesting = TestBed.inject(HttpTestingController);
    });
    
    afterEach(() => {
        httpTesting.verify();
    });

    it('should create the service', () => {
        expect(dictionaryService).toBeTruthy();
    });
    
    describe("create", () => {
        beforeEach(() => {
            spyOn(window.localStorage, "setItem");
        });
        
        it('should issue a POST request, update the dictionary state when the creation succeeds', async () => {
            // Arrange
            const create$ = dictionaryService.create();
            
            // Test
            const createPromise = firstValueFrom(create$);
            
            // Assert
            expect(dictionaryService.dictionaryState()).toBeNull();
            
            const testRequest = httpTesting.expectOne((request) => request.url.endsWith("api/dictionaries/create"));
            expect(testRequest.request.method).toBe("POST");

            const dictionaryDto: DictionaryDto = {
                dbId: "test dbId",
                dbName: "test dbName"
            };

            testRequest.flush(dictionaryDto);
            
            expect(await createPromise).toEqual(dictionaryDto);
            expect(dictionaryService.dictionaryState()).toEqual({
                dbId: dictionaryDto.dbId,
                dbName: dictionaryDto.dbName
            });
            
            expect(window.localStorage.setItem).toHaveBeenCalledTimes(2);
            expect(window.localStorage.setItem).toHaveBeenCalledWith("db-id", dictionaryDto.dbId);
            expect(window.localStorage.setItem).toHaveBeenCalledWith("db-name", dictionaryDto.dbName);
        });

        it('should not update the dictionary state when the creation fails', () => {
            // Test
            dictionaryService.create().subscribe({error: (err) => {}});

            // Assert
            expect(dictionaryService.dictionaryState()).toBeNull();

            const testRequest = httpTesting.expectOne((request) => request.url.endsWith("api/dictionaries/create"));

            testRequest.flush(null, {status: 500, statusText: "Internal server error"});

            expect(dictionaryService.dictionaryState()).toBeNull();

            expect(window.localStorage.setItem).not.toHaveBeenCalled();
            
        });
    });
});