import {HttpErrorResponse} from "@angular/common/http";

export function extractErrorMessages(err: HttpErrorResponse): string[] | null {
    if (err.status === 0) return ["Unable to connect to the server. Please try again."];
    
    return null;
}