import {Component, computed, inject, input, numberAttribute, OnInit, signal} from '@angular/core';
import {EntryFormComponent} from "../entry-form/entry-form.component";
import {MatIconModule} from "@angular/material/icon";
import {EntryCreateDto, EntryDetailsDto} from "../entry.models";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";
import {PageHeaderComponent} from "../../shared/components/page-header/page-header.component";
import {DeleteEntryComponent} from "../delete-entry/delete-entry.component";
import {EntryService} from "../entry.service";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";
import {Router} from "@angular/router";

@Component({
    selector: 'app-update-entry',
    imports: [EntryFormComponent, MatIconModule, FavoriteComponent, PageHeaderComponent, DeleteEntryComponent, DisplayErrorsComponent],
    templateUrl: './update-entry.component.html',
    styleUrl: './update-entry.component.css'
})
export class UpdateEntryComponent implements OnInit{
    readonly id = input.required({transform: numberAttribute});
    
    readonly entryDetailsDto = signal<EntryDetailsDto | null>(null);
    isFavorite = signal<boolean>(false);
    readonly isUpdating = signal<boolean>(false);
    readonly errors = signal<string[]>([]);
    readonly saveErrors = signal<string[]>([]);
    readonly backRoute = computed(() => ['/entries', this.id()]);

    private readonly router = inject(Router);
    private readonly entryService = inject(EntryService);

    ngOnInit(): void {
        this.entryService.getById(this.id()).subscribe({
            next: entryDetailsDtoObject => {
                this.entryDetailsDto.set(entryDetailsDtoObject);

                this.isFavorite.set(entryDetailsDtoObject.isFavorite);
            },
            error: async err => {
                console.error("Failed to get entry details", "error response: ", err);

                const errorMessages = await extractErrorMessages(err);
                this.errors.set(errorMessages);
            }
        });
    }
    
    saveChanges(entryCreateDto: EntryCreateDto) {
        entryCreateDto.isFavorite = this.isFavorite();
        
        this.isUpdating.set(true);
        this.errors.set([]);
        
        this.entryService.update(this.id(), entryCreateDto).subscribe({
            next: () => {
                this.isUpdating.set(false);
                this.router.navigate(['/entries', this.id()]);  
            },
            error: async err => {
                console.error("Failed to update the entry", "error response: ", err);
                this.isUpdating.set(false);

                const errorMessages = await extractErrorMessages(err);
                this.saveErrors.set(errorMessages);
            }
        });
    }
}
