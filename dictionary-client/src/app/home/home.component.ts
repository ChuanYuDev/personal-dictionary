import {Component, inject, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {DictionaryService} from "../dictionaries/dictionary.service";
import {CreateDictionaryComponent} from "../dictionaries/create-dictionary/create-dictionary.component";
import {OpenDictionaryComponent} from "../dictionaries/open-dictionary/open-dictionary.component";
import {FavoriteComponent} from "../shared/components/favorite/favorite.component";
import {MatIconModule} from "@angular/material/icon";
import {EntryDto} from "../entries/entries.models";
import {EntryCardComponent} from "../entries/entry-card/entry-card.component";

@Component({
    selector: 'app-home',
    imports: [RouterLink, CreateDictionaryComponent, OpenDictionaryComponent, FavoriteComponent, MatIconModule, EntryCardComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    private dictionaryService = inject(DictionaryService);
    readonly dictionaryState = this.dictionaryService.dictionaryState;
    
    isFavorite = signal(true);
    isFavorite2 = signal(true);
    
    readonly entryDtos: EntryDto[] = [{
        id: 2,
        term: "string",
        pronunciation: "string",
        partOfSpeech: "string",
        meaning: "meaning",
        notes: "string",
        isFavorite: true,
        category: {
            id: 1,
            name: "word"
        },
        createdAt: new Date("2026-10-19T00:08:00.770028")
    }, {
        id: 3,
        term: "apple",
        // pronunciation: "string",
        partOfSpeech: "string",
        meaning: "meaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaning",
        notes: "string",
        isFavorite: false,
        category: {
            id: 1,
            name: "word"
        },
        createdAt: new Date("2026-10-19T00:08:00.770028")
    }, {
        id: 4,
        term: "string",
        // pronunciation: "string",
        meaning: "meaning",
        notes: "string",
        isFavorite: true,
        category: {
            id: 2,
            name: "phrase"
        },
        createdAt: new Date("2026-10-19T00:08:00.770028")
        
    }];
}
