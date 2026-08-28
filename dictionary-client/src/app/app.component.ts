import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DictionariesService} from "./dictionaries/dictionaries.service";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    private readonly dictionariesService = inject(DictionariesService);
    constructor() {
        this.dictionariesService.restoreDictionaryState();
    }
}
