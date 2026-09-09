import {HttpErrorResponse} from "@angular/common/http";
import {extractErrorMessages} from "./extract-error-messages";

describe("extractErrorMessages", () => {
    it('should return unable to connect to the server message when status is 0', () => {
        const httpErrorResponse = new HttpErrorResponse({status: 0});
        
        const result = extractErrorMessages(httpErrorResponse);
        
        expect(result).toEqual(["Unable to connect to the server. Please try again."]);
    });

    it('should return null when other errors occur', () => {
        const httpErrorResponse = new HttpErrorResponse({status: 501});
        
        const result = extractErrorMessages(httpErrorResponse);

        expect(result).toBeNull();
    });
});