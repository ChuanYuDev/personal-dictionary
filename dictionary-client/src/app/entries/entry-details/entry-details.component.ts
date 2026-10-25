import {Component, computed, input, numberAttribute, OnInit, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {EntryDto} from "../entry.models";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";

@Component({
    selector: 'app-entry-details',
    imports: [RouterLink, MatIconModule, FavoriteComponent],
    templateUrl: './entry-details.component.html',
    styleUrl: './entry-details.component.css'
})
export class EntryDetailsComponent implements OnInit {
    id = input.required({transform: numberAttribute});
    
    readonly entryDto = signal<EntryDto | null>(null);
    readonly isFavorite = computed(() => this.entryDto()?.isFavorite ?? false);
    
    ngOnInit(): void {
        this.entryDto.set({
            id: 2,
            term: "string2",
            pronunciation: "string",
            partOfSpeech: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 1,
                name: "word"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")
        });
    }
}