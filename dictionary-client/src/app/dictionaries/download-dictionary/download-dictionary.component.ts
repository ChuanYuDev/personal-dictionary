import {Component, inject, signal} from '@angular/core';
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";
import {DictionaryService} from "../dictionary.service";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";

@Component({
    selector: 'app-download-dictionary',
    imports: [DisplayErrorsComponent],
    templateUrl: './download-dictionary.component.html',
    styleUrl: './download-dictionary.component.css'
})
export class DownloadDictionaryComponent {
    readonly isDownloading = signal(false);
    readonly errors = signal<string[]>([]);
    
    private dictionaryService = inject(DictionaryService);
    
    downloadDictionary(): void {
        this.isDownloading.set(true);
        this.errors.set([]);
        
        this.dictionaryService.download().subscribe({
            next: () => {},
            error: (err) => {
                console.error("Failed to download the dictionary", "error response: ", err);
                this.isDownloading.set(false);
                
                const errorMessages = extractErrorMessages(err);
                this.errors.set(errorMessages);
            }
        });
    }
}
