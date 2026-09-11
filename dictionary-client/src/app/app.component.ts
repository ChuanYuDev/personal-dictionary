import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DictionaryService} from "./dictionaries/dictionary.service";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    private readonly dictionaryService = inject(DictionaryService);
    constructor() {
        this.dictionaryService.restoreDictionaryState();
    }
}
