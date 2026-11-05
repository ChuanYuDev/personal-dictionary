import {Component, inject, signal} from '@angular/core';
import {PageHeaderComponent} from "../../shared/components/page-header/page-header.component";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";
import {EntryFormComponent} from "../entry-form/entry-form.component";
import {EntryCreateDto} from "../entry.models";
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";
import {Router} from "@angular/router";
import {EntryService} from "../entry.service";

@Component({
    selector: 'app-create-entry',
    imports: [PageHeaderComponent, FavoriteComponent, EntryFormComponent, DisplayErrorsComponent],
    templateUrl: './create-entry.component.html',
    styleUrl: './create-entry.component.css'
})
export class CreateEntryComponent {
    isFavorite = signal<boolean>(false);
    
    readonly isCreating = signal<boolean>(false);
    readonly errors = signal<string[]>([]);

    private readonly router = inject(Router);
    private readonly entryService = inject(EntryService);
    
    saveChanges(entryCreateDto: EntryCreateDto)
    {
        entryCreateDto.isFavorite = this.isFavorite();
        this.isCreating.set(true);
        this.errors.set([]);
        
        this.entryService.create(entryCreateDto).subscribe({
            next: () => {
                this.isCreating.set(false);
                this.router.navigate(['/']);
            },
            error: async err => {
                console.error("Failed to create the entry", "error response: ", err);
                this.isCreating.set(false);

                const errorMessages = await extractErrorMessages(err);
                this.errors.set(errorMessages);
            }
        });
    }
}
