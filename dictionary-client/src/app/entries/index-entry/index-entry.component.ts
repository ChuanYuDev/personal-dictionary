import {Component, OnInit, signal} from '@angular/core';
import {EntryCardComponent} from "../entry-card/entry-card.component";
import {EntrySummaryDto} from "../entry.models";
import {EntrySearchComponent} from "../entry-search/entry-search.component";
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {PaginationDto} from "../../shared/models/pagination.models";
import {PaginatorComponent} from "../paginator/paginator.component";

@Component({
    selector: 'app-index-entry',
    imports: [EntryCardComponent, EntrySearchComponent, RouterLink, MatIconModule, ScrollingModule, PaginatorComponent],
    templateUrl: './index-entry.component.html',
    styleUrl: './index-entry.component.css'
})
export class IndexEntryComponent implements OnInit {
    readonly totalCount = signal<number>(0);
    readonly paginationDto: PaginationDto = {page: 1, recordsPerPage: 20};
    readonly entrySummaryDtos = signal<EntrySummaryDto[]>([]);
    
    ngOnInit(): void {
        const entrySummaryDtoObjects: EntrySummaryDto[] = [
            {
                id: 1,
                term: "string1",
                pronunciation: "string",
                partOfSpeech: "string",
                meaning: "meaning",
                isFavorite: true,
                categoryName: "Word"
            },
            {
                id: 2,
                term: "string2",
                pronunciation: "string",
                partOfSpeech: "string",
                meaning: "meaning",
                isFavorite: true,
                categoryName: "Word"
            },
            {
                id: 3,
                term: "apple3",
                // pronunciation: "string",
                partOfSpeech: "string",
                meaning: "meaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaningmeaning",
                isFavorite: false,
                categoryName: "Word"
            },
            {
                id: 4,
                term: "string4",
                // pronunciation: "string",
                meaning: "meaning",
                isFavorite: true,
                categoryName: "Word"
            },
            {
                id: 5,
                term: "string5",
                // pronunciation: "string",
                meaning: "meaning",
                isFavorite: true,
                categoryName: "Phrase"
            },
            {
                id: 6,
                term: "string6",
                // pronunciation: "string",
                meaning: "meaning",
                isFavorite: true,
                categoryName: "Phrase"

            },
            {
                id: 7,
                term: "string7",
                // pronunciation: "string",
                meaning: "meaning",
                isFavorite: true,
                categoryName: "Phrase"

            },
            {
                id: 8,
                term: "string8",
                // pronunciation: "string",
                meaning: "meaning",
                isFavorite: true,
                categoryName: "Phrase"
            },
            {
                id: 9,
                term: "string9",
                // pronunciation: "string",
                meaning: "meaning",
                isFavorite: true,
                categoryName: "Phrase"

            },
            {
                id: 10,
                term: "string10",
                // pronunciation: "string",
                meaning: "meaning",
                isFavorite: true,
                categoryName: "Phrase"

            },
            {
                id: 11,
                term: "string11",
                // pronunciation: "string",
                meaning: "meaning",
                isFavorite: true,
                categoryName: "Phrase"

            }
        ];
        
        this.entrySummaryDtos.set(entrySummaryDtoObjects);
        this.totalCount.set(50000);
    }
    
    handleScrollIndex(index: number) {
        console.log(index);
    }
}
