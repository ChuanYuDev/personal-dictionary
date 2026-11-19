import {inject, Injectable, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CategoryDto} from "./category.models";
import {extractErrorMessages} from "../shared/functions/extract-error-messages";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly httpClient = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/categories`;
    constructor() { }
    
    get() {
        return this.httpClient.get<CategoryDto[]>(this.baseUrl);
    }
    
    loadCategories(
        categoryDtos: WritableSignal<CategoryDto[]>,
        categoryErrors: WritableSignal<string[]>
    ) {
        this.get().subscribe({
            next: categoryDtosArray => {
                categoryDtos.set(categoryDtosArray);
            },

            error: async err => {
                console.error("Failed to get category list", "error response: ", err);

                const errorMessages = await extractErrorMessages(err);
                categoryErrors.set(errorMessages);
            }
        });
    }
}
