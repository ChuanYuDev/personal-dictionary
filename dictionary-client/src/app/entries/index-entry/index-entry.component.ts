import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {EntryCardComponent} from "../entry-card/entry-card.component";
import {EntryFilterDto, EntrySearchFilterDto, EntrySummaryDto} from "../entry.models";
import {EntrySearchFormComponent} from "../entry-search-form/entry-search-form.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {PaginatorComponent} from "../paginator/paginator.component";
import {Location} from "@angular/common";

@Component({
    selector: 'app-index-entry',
    imports: [EntryCardComponent, EntrySearchFormComponent, RouterLink, MatIconModule, ScrollingModule, PaginatorComponent],
    templateUrl: './index-entry.component.html',
    styleUrl: './index-entry.component.css'
})
export class IndexEntryComponent implements OnInit {
    readonly pageSize = 20;
    entrySearchFilterDto = signal<EntrySearchFilterDto>({});
    
    page = signal<number>(1);
    
    readonly entrySummaryDtos = signal<EntrySummaryDto[]>([]);
    readonly totalCount = signal<number>(0);
    
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly location = inject(Location);
    
    constructor() {
        effect(() => {
            const entryFilterDtoObject: EntryFilterDto = {
                ...this.entrySearchFilterDto(),
                page: this.page(),  
                recordsPerPage: this.pageSize
            };
            
            this.writeParametersInUrl(entryFilterDtoObject);
            
            this.filterEntries(entryFilterDtoObject);
        });
    }
    
    ngOnInit(): void {
        this.readValuesFromUrl();
    }
    
    private readValuesFromUrl() {
        this.activatedRoute.queryParams.subscribe(params => {
            const entrySearchFilterDtoObject: EntrySearchFilterDto = {};
            
            const term = params["term"];
            if (term) entrySearchFilterDtoObject.term = term;

            const categoryId = params["categoryId"];
            if (categoryId) entrySearchFilterDtoObject.categoryId = Number(categoryId);

            const isFavorite = params["isFavorite"];
            if (isFavorite) entrySearchFilterDtoObject.isFavorite = (isFavorite === "true");
            
            this.entrySearchFilterDto.set(entrySearchFilterDtoObject);
            
            const page = params["page"];
            if (page) this.page.set(Number(page));
        });
    }

    private writeParametersInUrl(entryFilterDto: EntryFilterDto) {
        const queryStrings: string[] = [];

        if (entryFilterDto.term) queryStrings.push(`term=${encodeURIComponent(entryFilterDto.term)}`);

        if (entryFilterDto.categoryId) queryStrings.push(`categoryId=${entryFilterDto.categoryId}`);

        if (entryFilterDto.isFavorite) queryStrings.push(`isFavorite=${entryFilterDto.isFavorite}`);
        
        if (entryFilterDto.page) queryStrings.push(`page=${entryFilterDto.page}`);

        this.location.replaceState("", queryStrings.join('&'));
    }
    
    private filterEntries(entryFilterDto: EntryFilterDto) {
        // Http Request
        console.log(entryFilterDto);
        
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
}
