import {Component, inject, output, signal} from '@angular/core';
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";
import {DictionaryService} from "../dictionary.service";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";

@Component({
    selector: 'app-create-dictionary',
    imports: [DisplayErrorsComponent],
    templateUrl: './create-dictionary.component.html',
    styleUrl: './create-dictionary.component.css'
})
export class CreateDictionaryComponent {
    readonly isCreating = signal(false);
    readonly errors = signal<string[]>([]);
    private dictionaryService = inject(DictionaryService);
    readonly created = output<void>();

    createDictionary(): void {
        this.isCreating.set(true);
        this.errors.set([]);

        this.dictionaryService.create().subscribe({
            next: () => {
                this.isCreating.set(false);
                this.created.emit();
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

                this.errors.set(["An unexpected error occurred. Please contact the administrator."]);
            }
        });
        
    }

}
