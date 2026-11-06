import {Component, inject, input, signal, viewChild} from '@angular/core';
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";
import {Router} from "@angular/router";
import {EntryService} from "../entry.service";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";

@Component({
    selector: 'app-delete-entry',
    imports: [DialogComponent, DisplayErrorsComponent],
    templateUrl: './delete-entry.component.html',
    styleUrl: './delete-entry.component.css'
})
export class DeleteEntryComponent {
    readonly id = input.required<number>();
    
    readonly isDeleting = signal<boolean>(false);
    readonly errors = signal<string[]>([]);
    readonly dialogComponent = viewChild.required(DialogComponent);
    
    private readonly router = inject(Router);
    private readonly entryService = inject(EntryService);

    openDialog() {
        this.dialogComponent().open();
    }
    
    delete() {
        this.isDeleting.set(true);
        this.errors.set([]);
        
        this.entryService.delete(this.id()).subscribe({
            next: () => {
                this.isDeleting.set(false);
                this.dialogComponent().close();
                this.router.navigate(['/']);
            },
            
            error: async err => {
                console.error("Failed to delete the entry", "error response: ", err);
                this.isDeleting.set(false);

                const errorMessages = await extractErrorMessages(err);
                this.errors.set(errorMessages);
            }
        });
    }
}
