import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {DictionaryDto, DictionaryState} from "./dictionaries.models";
import {tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DictionariesService {
    private httpClient = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/dictionaries`;
    
    private readonly keyDbId = "db-id";
    private readonly keyDbName = "db-name";
    
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
    
    restoreDictionary(): void {
        const dbId = window.localStorage.getItem(this.keyDbId);
        const dbName = window.localStorage.getItem(this.keyDbName);
        
        if (dbId && dbName) {
            this._dictionaryState.set({
                dbId: dbId,
                dbName: dbName
            });          
        }
    }
    
    private storeDictionaryState(dictionaryDto: DictionaryDto): void {
        window.localStorage.setItem(this.keyDbId, dictionaryDto.dbId);
        window.localStorage.setItem(this.keyDbName, dictionaryDto.dbName);
    }
}
