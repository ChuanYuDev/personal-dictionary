import {Component, computed, inject, input, numberAttribute, OnInit, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {EntryDetailsDto, EntrySummaryDto} from "../entry.models";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";
import {DatePipe} from "@angular/common";
import {PageHeaderComponent} from "../../shared/components/page-header/page-header.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {EntryService} from "../entry.service";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";

@Component({
    selector: 'app-entry-details',
    imports: [RouterLink, MatIconModule, FavoriteComponent, DatePipe, PageHeaderComponent, DisplayErrorsComponent],
    templateUrl: './entry-details.component.html',
    styleUrl: './entry-details.component.css'
})
export class EntryDetailsComponent implements OnInit {
    id = input.required({transform: numberAttribute});
    
    readonly entryDetailsDto = signal<EntryDetailsDto | null>(null);
    readonly isFavorite = signal<boolean>(false);
    
    readonly errors = signal<string[]>([]);
    
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
}