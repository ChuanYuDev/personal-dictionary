import {Component, inject, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {DictionariesService} from "../dictionaries/dictionaries.service";
import {DictionaryDto, DictionaryState} from "../dictionaries/dictionaries.models";

@Component({
    selector: 'app-home',
    imports: [RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    
    readonly isCreating = signal(false);
    readonly dictionaryState = signal<DictionaryState | null>(null);
    private dictionariesService = inject(DictionariesService);
    
    CreateDictionary(): void {
        this.isCreating.set(true);
        
        this.dictionariesService.create().subscribe({
            next: (dictionaryDto) => {
                this.dictionaryState.set({
                    dbId: dictionaryDto.dbId,
                    dbName: dictionaryDto.dbName
                });
                
                this.isCreating.set(false);
            },
            
            error: (err) => {
                this.isCreating.set(false);
            }
        });
    }
}
