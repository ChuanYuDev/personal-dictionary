import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {DictionaryDto, DictionaryState} from "./dictionary.models";
import {tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DictionaryService {
    private httpClient = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/dictionaries`;
    
    private readonly dbIdKey = "db-id";
    private readonly dbIdHeaderKey = "db-id";
    
    private readonly _dictionaryState = signal<DictionaryState | null>(null);
    readonly dictionaryState = this._dictionaryState.asReadonly();

    constructor() { }
    
    create() {
        return this.httpClient.post<DictionaryDto>(`${this.baseUrl}/create`, null).pipe(tap(
            dictionaryDto => { this.storeDictionaryState(dictionaryDto); }
        ));
    }
    
    download() {
        return this.httpClient.get(`${this.baseUrl}/download`, {
            responseType: "blob"
        });
    }
    
    open(file: File) {
        return this.httpClient.post<DictionaryDto>(`${this.baseUrl}/open`, file).pipe(tap(
            dictionaryDto => { this.storeDictionaryState(dictionaryDto); }
        ));
    }
    
    connect(dbId: string) {
        return this.httpClient.get(`${this.baseUrl}/connect`, {headers: {[this.dbIdHeaderKey]: dbId}}).pipe(tap(
            () => { this.storeDictionaryState({dbId: dbId}); }
        ));
    }
    
    disconnect(): void {
        window.localStorage.removeItem(this.dbIdKey);
        
        this._dictionaryState.set(null);
    }
    
    restoreDictionaryState(): void {
        const dbId = window.localStorage.getItem(this.dbIdKey);
        
        if (dbId) {
            this._dictionaryState.set({
                dbId: dbId,
            });          
        }
    }
    
    getDbId(): string | null {
        return window.localStorage.getItem(this.dbIdKey);
    }
    
    private storeDictionaryState(dictionaryDto: DictionaryDto): void {
        window.localStorage.setItem(this.dbIdKey, dictionaryDto.dbId);
        
        this._dictionaryState.set({
            dbId: dictionaryDto.dbId,
        });
    }
}
