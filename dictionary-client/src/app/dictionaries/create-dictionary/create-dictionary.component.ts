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

            error: async (err) => {
                console.error("Failed to create a dictionary", "error response: ", err);
                this.isCreating.set(false);

                const errorMessages = await extractErrorMessages(err);
                this.errors.set(errorMessages);
            }
        });
        
    }

}
