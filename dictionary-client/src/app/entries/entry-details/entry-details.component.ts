import {Component, computed, input, numberAttribute, OnInit, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {EntryDetailsDto, EntrySummaryDto} from "../entry.models";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";
import {DatePipe} from "@angular/common";
import {PageHeaderComponent} from "../../shared/components/page-header/page-header.component";

@Component({
    selector: 'app-entry-details',
    imports: [RouterLink, MatIconModule, FavoriteComponent, DatePipe, PageHeaderComponent],
    templateUrl: './entry-details.component.html',
    styleUrl: './entry-details.component.css'
})
export class EntryDetailsComponent implements OnInit {
    id = input.required({transform: numberAttribute});
    
    readonly entryDetailsDto = signal<EntryDetailsDto | null>(null);
    readonly isFavorite = signal<boolean>(false);
    
    ngOnInit(): void {
        const entryDetailsDtoObject: EntryDetailsDto = {
            id: 2,
            term: "string2",
            pronunciation: "string",
            partOfSpeech: "string",
            // meaning: "meaning",
            // notes: "string",
            isFavorite: true,
            category: {
                id: 1,
                name: "word"
            },
            modifiedAt: new Date("2026-10-19T20:08:00.770028"),
            createdAt: new Date("2026-10-19T10:08:00.770028")
        };
        
        this.entryDetailsDto.set(entryDetailsDtoObject);
        
        this.isFavorite.set(entryDetailsDtoObject.isFavorite);
    }
}