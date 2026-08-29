import {Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {DictionariesService} from "../dictionaries/dictionaries.service";
import {CreateDictionaryComponent} from "../dictionaries/create-dictionary/create-dictionary.component";

@Component({
    selector: 'app-home',
    imports: [RouterLink, CreateDictionaryComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    private dictionariesService = inject(DictionariesService);
    readonly dictionaryState = this.dictionariesService.dictionaryState;
}
