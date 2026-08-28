import {Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {DictionariesService} from "../dictionaries.service";

@Component({
    selector: 'app-manage-dictionary',
    imports: [RouterLink],
    templateUrl: './manage-dictionary.component.html',
    styleUrl: './manage-dictionary.component.css'
})
export class ManageDictionaryComponent {
    private readonly dictionariesService = inject(DictionariesService);
    readonly dictionaryState = this.dictionariesService.dictionaryState;
}
