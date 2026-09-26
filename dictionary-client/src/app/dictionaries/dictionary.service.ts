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
    private readonly dbNameKey = "db-name";
    
    private readonly _dictionaryState = signal<DictionaryState | null>(null);
    readonly dictionaryState = this._dictionaryState.asReadonly();

    constructor() { }
    
    create() {
        return this.httpClient.post<DictionaryDto>(`${this.baseUrl}/create`, null).pipe(tap(
            dictionaryDto => {
                this.storeDictionaryState(dictionaryDto);
                
                this._dictionaryState.set({
                    dbId: dictionaryDto.dbId,
                    dbName: dictionaryDto.dbName
                });
            }
        ));
    }
    
    download() {
        return this.httpClient.get(`${this.baseUrl}/download`, {
            responseType: "blob"
        });
    }
    
    disconnect(): void {
        window.localStorage.removeItem(this.dbIdKey);
        window.localStorage.removeItem(this.dbNameKey);
        
        this._dictionaryState.set(null);
    }
    
    restoreDictionaryState(): void {
        const dbId = window.localStorage.getItem(this.dbIdKey);
        const dbName = window.localStorage.getItem(this.dbNameKey);
        
        if (dbId && dbName) {
            this._dictionaryState.set({
                dbId: dbId,
                dbName: dbName
            });          
        }
    }
    
    getDbId(): string | null {
        return window.localStorage.getItem(this.dbIdKey);
    }
    
    private storeDictionaryState(dictionaryDto: DictionaryDto): void {
        window.localStorage.setItem(this.dbIdKey, dictionaryDto.dbId);
        window.localStorage.setItem(this.dbNameKey, dictionaryDto.dbName);
    }
}
