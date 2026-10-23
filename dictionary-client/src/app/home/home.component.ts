import {Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {DictionaryService} from "../dictionaries/dictionary.service";
import {CreateDictionaryComponent} from "../dictionaries/create-dictionary/create-dictionary.component";
import {OpenDictionaryComponent} from "../dictionaries/open-dictionary/open-dictionary.component";
import {MatIconModule} from "@angular/material/icon";
import {IndexEntryComponent} from "../entries/index-entry/index-entry.component";

@Component({
    selector: 'app-home',
    imports: [RouterLink, CreateDictionaryComponent, OpenDictionaryComponent, MatIconModule, IndexEntryComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    private dictionaryService = inject(DictionaryService);
    readonly dictionaryState = this.dictionaryService.dictionaryState;
}
