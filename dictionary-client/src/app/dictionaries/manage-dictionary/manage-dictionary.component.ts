import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {DictionaryService} from "../dictionary.service";
import {CreateDictionaryComponent} from "../create-dictionary/create-dictionary.component";
import {DownloadDictionaryComponent} from "../download-dictionary/download-dictionary.component";

@Component({
    selector: 'app-manage-dictionary',
    imports: [RouterLink, CreateDictionaryComponent, DownloadDictionaryComponent],
    templateUrl: './manage-dictionary.component.html',
    styleUrl: './manage-dictionary.component.css'
})
export class ManageDictionaryComponent {
    private readonly dictionaryService = inject(DictionaryService);
    private readonly router = inject(Router);
    readonly dictionaryState = this.dictionaryService.dictionaryState;
    
    disconnectDictionary(): void {
        this.dictionaryService.disconnect();
        this.router.navigate(["/"]);
    }
    
    onDictionaryCreated(): void {
        this.router.navigate(["/"]);
    }
}
