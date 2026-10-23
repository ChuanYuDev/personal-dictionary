import { Component } from '@angular/core';
import {EntryCardComponent} from "../entry-card/entry-card.component";
import {EntryDto} from "../entry.models";
import {EntrySearchComponent} from "../entry-search/entry-search.component";
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {ScrollingModule} from "@angular/cdk/scrolling";

@Component({
    selector: 'app-index-entry',
    imports: [EntryCardComponent, EntrySearchComponent, RouterLink, MatIconModule, ScrollingModule],
    templateUrl: './index-entry.component.html',
    styleUrl: './index-entry.component.css'
})
export class IndexEntryComponent {
    readonly entryDtos: EntryDto[] = [
        {
            id: 1,
            term: "string1",
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
        },
        {
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
        },
        {
            id: 3,
            term: "apple3",
            // pronunciation: "string",
            partOfSpeech: "string",
            meaning: "meaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaning",
            notes: "string",
            isFavorite: false,
            category: {
                id: 1,
                name: "word"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")
        },
        {
            id: 4,
            term: "string4",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
        {
            id: 5,
            term: "string5",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
        {
            id: 6,
            term: "string6",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
        {
            id: 7,
            term: "string7",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
        {
            id: 8,
            term: "string8",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
        {
            id: 9,
            term: "string9",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
        {
            id: 1,
            term: "string1",
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
        },
        {
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
        },
        {
            id: 3,
            term: "apple3",
            // pronunciation: "string",
            partOfSpeech: "string",
            meaning: "meaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaning",
            notes: "string",
            isFavorite: false,
            category: {
                id: 1,
                name: "word"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")
        },
        {
            id: 4,
            term: "string4",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
        {
            id: 5,
            term: "string5",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
        {
            id: 6,
            term: "string6",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
        {
            id: 7,
            term: "string7",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
        {
            id: 8,
            term: "string8",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
        {
            id: 9,
            term: "string9",
            // pronunciation: "string",
            meaning: "meaning",
            notes: "string",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
            createdAt: new Date("2026-10-19T00:08:00.770028")

        },
    ];
}
