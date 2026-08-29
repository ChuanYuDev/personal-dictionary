import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {DictionariesService} from "../dictionaries.service";
import {CreateDictionaryComponent} from "../create-dictionary/create-dictionary.component";

@Component({
    selector: 'app-manage-dictionary',
    imports: [RouterLink, CreateDictionaryComponent],
    templateUrl: './manage-dictionary.component.html',
    styleUrl: './manage-dictionary.component.css'
})
export class ManageDictionaryComponent {
    private readonly dictionariesService = inject(DictionariesService);
    private readonly router = inject(Router);
    readonly dictionaryState = this.dictionariesService.dictionaryState;
    
    disconnectDictionary(): void {
        this.dictionariesService.disconnect();
        this.router.navigate(["/"]);
    }
    
    onDictionaryCreated(): void {
        this.router.navigate(["/"]);
    }
}
