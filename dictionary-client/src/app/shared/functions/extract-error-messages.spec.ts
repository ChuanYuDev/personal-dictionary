import {HttpErrorResponse} from "@angular/common/http";
import {extractErrorMessages} from "./extract-error-messages";

describe("extractErrorMessages", () => {
    it('should return the connection error message when status is 0', () => {
        const httpErrorResponse = new HttpErrorResponse({status: 0});
        
        const result = extractErrorMessages(httpErrorResponse);
        
        expect(result).toEqual(["Unable to connect to the server. Please try again later."]);
    });

    it('should return the validation error message when errors property exists', () => {
        const httpErrorResponse = new HttpErrorResponse({
            status: 501,
            error: {
                errors: {
                    name: ["This field is required", "The first letter should be uppercase"],
                    email: ["invalid email"]
                }
            }
        });
        
        const result = extractErrorMessages(httpErrorResponse);

        expect(result).toEqual([]);
    });

    it('should return the expected failure and unexpected error message when detail property exists', () => {
        const httpErrorResponse = new HttpErrorResponse({
            status: 400,
            error: {
                detail: "No dictionary is currently selected. Please create or open a dictionary."
            }
        });

        const result = extractErrorMessages(httpErrorResponse);

        expect(result).toEqual(["No dictionary is currently selected. Please create or open a dictionary."]);
        
    });

    it('should log error and return fallback message when receiving an unexpected error response', () => {
        const httpErrorResponse = new HttpErrorResponse({status: 501});
        spyOn(console, "error");
        
        const result = extractErrorMessages(httpErrorResponse);

        expect(console.error).toHaveBeenCalledTimes(1);
        expect(result).toEqual(["An unexpected error occurred. Please try again later."]);
    });
});