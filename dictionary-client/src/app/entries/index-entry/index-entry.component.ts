import {Component, OnInit} from '@angular/core';
import {EntryCardComponent} from "../entry-card/entry-card.component";
import {EntrySummaryDto} from "../entry.models";
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
export class IndexEntryComponent implements OnInit {
    totalCount: number = 0;
    readonly entrySummaryDtos: EntrySummaryDto[] = [
        {
            id: 1,
            term: "string1",
            pronunciation: "string",
            partOfSpeech: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 1,
                name: "word"
            },
        },
        {
            id: 2,
            term: "string2",
            pronunciation: "string",
            partOfSpeech: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 1,
                name: "word"
            },
        },
        {
            id: 3,
            term: "apple3",
            // pronunciation: "string",
            partOfSpeech: "string",
            meaning: "meaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaning",
            isFavorite: false,
            category: {
                id: 1,
                name: "word"
            },
        },
        {
            id: 4,
            term: "string4",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
        },
        {
            id: 5,
            term: "string5",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },
        },
        {
            id: 6,
            term: "string6",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },

        },
        {
            id: 7,
            term: "string7",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },

        },
        {
            id: 8,
            term: "string8",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },

        },
        {
            id: 9,
            term: "string9",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },

        },
        {
            id: 1,
            term: "string1",
            pronunciation: "string",
            partOfSpeech: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 1,
                name: "word"
            },
        },
        {
            id: 2,
            term: "string2",
            pronunciation: "string",
            partOfSpeech: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 1,
                name: "word"
            },
        },
        {
            id: 3,
            term: "apple3",
            // pronunciation: "string",
            partOfSpeech: "string",
            meaning: "meaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaning",
            isFavorite: false,
            category: {
                id: 1,
                name: "word"
            },
        },
        {
            id: 4,
            term: "string4",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },

        },
        {
            id: 5,
            term: "string5",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },

        },
        {
            id: 6,
            term: "string6",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },

        },
        {
            id: 7,
            term: "string7",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },

        },
        {
            id: 8,
            term: "string8",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },

        },
        {
            id: 9,
            term: "string9",
            // pronunciation: "string",
            meaning: "meaning",
            isFavorite: true,
            category: {
                id: 2,
                name: "phrase"
            },

        },
    ];
    
    ngOnInit(): void {
        this.totalCount = this.entrySummaryDtos.length;
    }
    
    handleScrollIndex(index: number) {
        console.log(index);
    }
}
