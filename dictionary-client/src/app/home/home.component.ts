import {Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {DictionaryService} from "../dictionaries/dictionary.service";
import {CreateDictionaryComponent} from "../dictionaries/create-dictionary/create-dictionary.component";

@Component({
    selector: 'app-home',
    imports: [RouterLink, CreateDictionaryComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    private dictionaryService = inject(DictionaryService);
    readonly dictionaryState = this.dictionaryService.dictionaryState;
}
