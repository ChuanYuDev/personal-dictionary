import { inject, Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class DictionariesService {
    private httpClient = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/dictionaries`;

    constructor() { }
    
    public create() {
        this.httpClient.post(`${this.baseUrl}/create`, null);
    }
}
