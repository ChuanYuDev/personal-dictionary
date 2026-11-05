import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {EntryCreateDto, EntryDetailsDto, EntryFilterDto, EntrySummaryDto} from "./entry.models";

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
    
    getById(id: number) {
        return this.httpClient.get<EntryDetailsDto>(`${this.baseUrl}/${id}`);
    }
    
    create(entryCreationDto: EntryCreateDto) {
        return this.httpClient.post(this.baseUrl, entryCreationDto);
    }
    
    update(id: number, entryCreationDto: EntryCreateDto) {
        return this.httpClient.put(`${this.baseUrl}/${id}`, entryCreationDto);
    }
    
    delete(id: number) {
        return this.httpClient.delete(`${this.baseUrl}/${id}`);
    }
    
    private buildQueryParams(entryFilterDto: EntryFilterDto): HttpParams {
        let queryParams = new HttpParams();
        
        for (const [key, value] of Object.entries(entryFilterDto)) {
            queryParams = queryParams.append(key, value);
        }
        return queryParams;
    }
}
