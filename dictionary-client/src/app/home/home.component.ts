import {Component, effect, inject, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {DictionaryService} from "../dictionaries/dictionary.service";
import {CreateDictionaryComponent} from "../dictionaries/create-dictionary/create-dictionary.component";
import {OpenDictionaryComponent} from "../dictionaries/open-dictionary/open-dictionary.component";
import {MatIconModule} from "@angular/material/icon";
import {IndexEntryComponent} from "../entries/index-entry/index-entry.component";
import {MetadataService} from "../dictionaries/metadata.service";
import {DisplayErrorsComponent} from "../shared/components/display-errors/display-errors.component";

@Component({
    selector: 'app-home',
    imports: [RouterLink, CreateDictionaryComponent, OpenDictionaryComponent, MatIconModule, IndexEntryComponent, DisplayErrorsComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    readonly name = signal<string | null >(null);
    readonly nameErrors = signal<string[]>([]);
    
    private readonly dictionaryService = inject(DictionaryService);
    readonly dictionaryState = this.dictionaryService.dictionaryState;
    
    private readonly metadataService = inject(MetadataService);
    
    constructor() {
        effect(() => {
            const state = this.dictionaryState();
            
            this.name.set(null);
            this.nameErrors.set([]);
            
            if (state) this.metadataService.loadMetadata(this.name, this.nameErrors);
        });
    }
}
