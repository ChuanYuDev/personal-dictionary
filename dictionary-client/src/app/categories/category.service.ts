import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CategoryDto} from "./category.models";

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
}
