import {TestBed} from "@angular/core/testing";
import {HttpClient, provideHttpClient, withInterceptors} from "@angular/common/http";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {dbIdInterceptor} from "./db-id.interceptor";

describe("dbIdInterceptor", () => {
    let httpClient: HttpClient;
    let httpTesting: HttpTestingController;
    
    const dbIdKey = "db-id";
    const dbIdHeaderKey = "X-DbId";
    const testUrl = "/api/db-id-test";
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([dbIdInterceptor])),
                provideHttpClientTesting()
            ]
        });
        
        httpClient = TestBed.inject(HttpClient);
        httpTesting = TestBed.inject(HttpTestingController);
        
        window.localStorage.removeItem(dbIdKey);
    });
    
    afterEach(() => {
        httpTesting.verify();
        window.localStorage.removeItem(dbIdKey);
    });

    it('should add X-DbId header when dbId exists in localStorage', () => {
        const dbId = "test dbId";
        window.localStorage.setItem(dbIdKey, dbId);
        
        httpClient.get(testUrl).subscribe();
        
        const testRequest = httpTesting.expectOne(testUrl);
        
        const dbIdHeader = testRequest.request.headers.get(dbIdHeaderKey);
        
        expect(dbIdHeader).toBe(dbId);
        
        testRequest.flush({});
    });

    it('should not add X-DbId header when dbId does not exist', () => {
        httpClient.get(testUrl).subscribe();

        const testRequest = httpTesting.expectOne(testUrl);

        const dbIdHeader = testRequest.request.headers.get(dbIdHeaderKey);

        expect(dbIdHeader).toBeNull();

        testRequest.flush({});
        
    });
});