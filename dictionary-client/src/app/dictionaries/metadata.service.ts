import {inject, Injectable, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MetadataDto, MetadataUpdateDto} from "./metadata.models";
import {extractErrorMessages} from "../shared/functions/extract-error-messages";

@Injectable({
    providedIn: 'root'
})
export class MetadataService {
    private httpClient = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/metadata`;

    constructor() { }
    
    get() {
        return this.httpClient.get<MetadataDto>(this.baseUrl);
    }
    
    updateName(metadataUpdateDto: MetadataUpdateDto) {
        return this.httpClient.put(this.baseUrl, metadataUpdateDto);
    }
    
    loadMetadata(
        name: WritableSignal<string | null>,
        nameErrors: WritableSignal<string[]>
    ) {
        this.get().subscribe({
            next: metadataDto => {
                name.set(metadataDto.name);
            },
            error: async err => {
                console.error("Failed to get the dictionary name", "error response: ", err);

                const errorMessages = await extractErrorMessages(err);
                nameErrors.set(errorMessages);
            }
        });
    }
}
