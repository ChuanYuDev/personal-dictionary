import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {DictionariesService} from "../dictionaries.service";

@Component({
    selector: 'app-manage-dictionary',
    imports: [RouterLink],
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
}
