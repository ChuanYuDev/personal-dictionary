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
    private dictionariesService = inject(DictionariesService);
    readonly dictionaryState = this.dictionariesService.dictionaryState;
    
    CreateDictionary(): void {
        this.isCreating.set(true);

        // this.dictionariesService.create().subscribe((dictionaryDto) => {
        //     console.log(dictionaryDto);
        //     this.isCreating.set(false);
        // });
        this.dictionariesService.create().subscribe({
            next: (dictionaryDto) => {

                this.isCreating.set(false);
            },

            error: (err) => {
                console.log(err);
                this.isCreating.set(false);
            }
        });
    }
}
