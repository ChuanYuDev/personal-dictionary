import {Component, inject, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {DictionaryService} from "../dictionaries/dictionary.service";
import {CreateDictionaryComponent} from "../dictionaries/create-dictionary/create-dictionary.component";
import {OpenDictionaryComponent} from "../dictionaries/open-dictionary/open-dictionary.component";
import {FavoriteComponent} from "../shared/components/favorite/favorite.component";
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-home',
    imports: [RouterLink, CreateDictionaryComponent, OpenDictionaryComponent, FavoriteComponent, MatIconModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    private dictionaryService = inject(DictionaryService);
    readonly dictionaryState = this.dictionaryService.dictionaryState;
    
    readonly isFavorite = signal(false);
}
