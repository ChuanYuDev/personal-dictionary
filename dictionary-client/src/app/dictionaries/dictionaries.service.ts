import { inject, Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {DictionaryDto} from "./dictionaries.models";
import {tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DictionariesService {
    private httpClient = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/dictionaries`;
    
    private readonly keyDbId = "db-id";
    private readonly keyDbName = "db-name";

    constructor() { }
    
    create() {
        return this.httpClient.post<DictionaryDto>(`${this.baseUrl}/create`, null).pipe(tap(
            dictionaryDto => {this.storeDictionaryState(dictionaryDto);}
        ));
    }
    
    private storeDictionaryState(dictionaryDto: DictionaryDto): void {
        window.localStorage.setItem(this.keyDbId, dictionaryDto.dbId);
        window.localStorage.setItem(this.keyDbName, dictionaryDto.dbName);
    }
}
