import {HttpErrorResponse} from "@angular/common/http";

export function extractErrorMessages(err: HttpErrorResponse): string[] {
    if (err.status === 0) return ["Unable to connect to the server. Please try again later."];
    
    if (err.error?.errors) {
        // Validation error
        // To do
        return [];
    }
    
    if (err.error?.detail) {
        // Expected failure and unexpected error
        return [err.error.detail];
    }
    
    console.error("Unexpected error response: ", err);
    
    return ["An unexpected error occurred. Please try again later."];
}