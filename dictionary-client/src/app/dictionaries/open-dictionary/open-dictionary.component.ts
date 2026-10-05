import {Component, inject, input, signal} from '@angular/core';
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";
import {DictionaryService} from "../dictionary.service";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";

@Component({
    selector: 'app-open-dictionary',
    imports: [DisplayErrorsComponent],
    templateUrl: './open-dictionary.component.html',
    styleUrl: './open-dictionary.component.css'
})
export class OpenDictionaryComponent {
    readonly isOpening = signal(false);
    readonly errors = signal<string[]>([]);
    
    readonly buttonText = input.required<string>();
    
    readonly dictionaryService = inject(DictionaryService);
    
    change(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        const files = inputElement.files;
        
        if (files && files.length > 0) {
            const file = files[0];
            
            this.isOpening.set(true);
            this.errors.set([]);
            
            this.dictionaryService.open(file).subscribe({
                next: () => {
                    this.isOpening.set(false);
                },
                
                error: async (err) => {
                    console.error("Failed to open a dictionary", "error response: ", err);
                    this.isOpening.set(false);
                    
                    const errorMessages = await extractErrorMessages(err);
                    this.errors.set(errorMessages);
                }
            });
        }
    }
}
