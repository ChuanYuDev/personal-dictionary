import {HttpErrorResponse} from "@angular/common/http";
import {extractErrorMessages} from "./extract-error-messages";

describe("extractErrorMessages", () => {
    it('should return the connection error message when status is 0', async () => {
        const httpErrorResponse = new HttpErrorResponse({status: 0});
        
        const result = await extractErrorMessages(httpErrorResponse);
        
        expect(result).toEqual(["Unable to connect to the server. Please try again later."]);
    });
    
    it('should return the expected failure and unexpected error message when blob can be parsed and detail property exists', async () => {
        const problemDetails = {
            detail: "test detail"
        };
        
        const blob = new Blob([JSON.stringify(problemDetails)]);
        
        const httpErrorResponse = new HttpErrorResponse({
            status: 400,
            error: blob
        });

        const result = await extractErrorMessages(httpErrorResponse);

        expect(result).toEqual(["test detail"]);

    });
    
    it('should log error and return fallback message when blob cannot be parsed', async () => {
        const blob = new Blob(["Invalid json"]);

        const httpErrorResponse = new HttpErrorResponse({
            status: 400,
            error: blob
        });
        
        spyOn(console, "error");

        const result = await extractErrorMessages(httpErrorResponse);

        expect(console.error).toHaveBeenCalledWith("Unable to parse the error text", "errorText: ", jasmine.anything());
        expect(result).toEqual(["An unexpected error occurred. Please try again later."]);
    });

    it('should return the validation error message when errors property exists', async () => {
        const httpErrorResponse = new HttpErrorResponse({
            status: 501,
            error: {
                errors: {
                    name: ["This field is required", "The first letter should be uppercase"],
                    email: ["invalid email"]
                }
            }
        });
        
        const result = await extractErrorMessages(httpErrorResponse);

        expect(result).toEqual([]);
    });

    it('should return the expected failure and unexpected error message when detail property exists', async () => {
        const httpErrorResponse = new HttpErrorResponse({
            status: 400,
            error: {
                detail: "test detail"
            }
        });

        const result = await extractErrorMessages(httpErrorResponse);

        expect(result).toEqual(["test detail"]);
        
    });

    it('should log error and return fallback message when receiving an unexpected error response', async () => {
        const httpErrorResponse = new HttpErrorResponse({status: 501});
        spyOn(console, "error");
        
        const result = await extractErrorMessages(httpErrorResponse);

        expect(console.error).toHaveBeenCalledWith("Unexpected error response: ", jasmine.anything());
        expect(result).toEqual(["An unexpected error occurred. Please try again later."]);
    });
});