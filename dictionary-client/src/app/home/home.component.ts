import {Component, inject, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {DictionariesService} from "../dictionaries/dictionaries.service";
import {extractErrorMessages} from "../shared/functions/extract-error-messages";
import {DisplayErrorsComponent} from "../shared/components/display-errors/display-errors.component";

@Component({
    selector: 'app-home',
    imports: [RouterLink, DisplayErrorsComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    
    readonly isCreating = signal(false);
    private dictionariesService = inject(DictionariesService);
    readonly dictionaryState = this.dictionariesService.dictionaryState;
    readonly errors = signal<string[]>([]);
    
    CreateDictionary(): void {
        this.isCreating.set(true);
        this.errors.set([]);

        this.dictionariesService.create().subscribe({
            next: (dictionaryDto) => {
                this.isCreating.set(false);
            },

            error: (err) => {
                console.log(err);
                this.isCreating.set(false);
                
                const errorMessages = extractErrorMessages(err);
                
                if (errorMessages) {
                    this.errors.set(errorMessages);
                    return;
                }
                
                if (err.status === 500) {
                    this.errors.set(["Unable to create the dictionary. Please try again."]);
                    return;
                }
                
                this.errors.set(["An unexpected error occurred. Please connect the administer."]);
            }
        });
    }
}
