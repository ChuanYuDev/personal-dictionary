import {HttpErrorResponse} from "@angular/common/http";

export async function extractErrorMessages(err: HttpErrorResponse): Promise<string[]> {
    const unexpectedErrorMessage = "An unexpected error occurred. Please try again later.";
    
    if (err.status === 0) return ["Unable to connect to the server. Please try again later."];
    
    let error = err.error;
    
    if (error instanceof Blob) {
        const errorText = await error.text();
        
        try {
            error = JSON.parse(errorText);
        } catch {
            console.error("Unable to parse the error text", "errorText: ", errorText);
            
            return [unexpectedErrorMessage];
        }
    }

    // Validation error
    if (error?.errors) {
        const errorMessages: string[] = [];
        
        for (const [key, value] of Object.entries(error.errors)) errorMessages.push(`${key}: ${value}`);
        return errorMessages;
    }

    // Expected failure and unexpected error
    if (error?.detail) {
        return [error.detail];
    }
    
    console.error("Unexpected error response: ", err);
    
    return [unexpectedErrorMessage];
}