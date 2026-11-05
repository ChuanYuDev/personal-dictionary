import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {EntryFilterDto, EntrySummaryDto} from "./entry.models";

@Injectable({
    providedIn: 'root'
})
export class EntryService {
    private httpClient = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/entries`
    constructor() { }
    
    get(entryFilterDto: EntryFilterDto) {
        const queryParams = this.buildQueryParams(entryFilterDto);
        
        return this.httpClient.get<EntrySummaryDto[]>(this.baseUrl, {
           params: queryParams,
           observe: "response" 
        });
    }
    
    private buildQueryParams(entryFilterDto: EntryFilterDto): HttpParams {
        let queryParams = new HttpParams();
        
        for (const [key, value] of Object.entries(entryFilterDto)) {
            queryParams = queryParams.append(key, value);
        }
        return queryParams;
    }
}
