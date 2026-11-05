import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {EntryCardComponent} from "../entry-card/entry-card.component";
import {EntryFilterDto, EntrySearchFilterDto, EntrySummaryDto} from "../entry.models";
import {EntrySearchFormComponent} from "../entry-search-form/entry-search-form.component";
import {ActivatedRoute, Params, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {PaginatorComponent} from "../paginator/paginator.component";
import {Location} from "@angular/common";
import {EntryService} from "../entry.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";

@Component({
    selector: 'app-index-entry',
    imports: [EntryCardComponent, EntrySearchFormComponent, RouterLink, MatIconModule, ScrollingModule, PaginatorComponent, DisplayErrorsComponent],
    templateUrl: './index-entry.component.html',
    styleUrl: './index-entry.component.css'
})
export class IndexEntryComponent implements OnInit {
    readonly pageSize = 20;
    
    entrySearchFilterDto = signal<EntrySearchFilterDto>({});
    page = signal<number>(1);
    
    readonly entrySummaryDtos = signal<EntrySummaryDto[]>([]);
    readonly totalCount = signal<number>(0);
    readonly pageCount = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize)));

    readonly errors = signal<string[]>([]);
    
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly location = inject(Location);
    private readonly entryService = inject(EntryService);
    
    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.readValuesFromQueryParams(params);
            
            this.filterEntriesWithPageChecking();
        });
    }
    
    onEntrySearchFilterDtoChange(entrySearchFilterDtoObject: EntrySearchFilterDto) {
        this.entrySearchFilterDto.set(entrySearchFilterDtoObject);     
        this.page.set(1);
        this.filterEntries();
    }
    
    onPageChange(pageNum: number) {
        this.page.set(pageNum);
        this.filterEntries();
    }
    
    private readValuesFromQueryParams(params: Params) {
        const entrySearchFilterDtoObject: EntrySearchFilterDto = {};

        const term = params["term"];
        if (term) entrySearchFilterDtoObject.term = term;

        const categoryId = params["categoryId"];
        if (categoryId) entrySearchFilterDtoObject.categoryId = Number(categoryId);

        const isFavorite = params["isFavorite"];
        if (isFavorite) entrySearchFilterDtoObject.isFavorite = (isFavorite === "true");

        this.entrySearchFilterDto.set(entrySearchFilterDtoObject);

        const pageString = params["page"];
        
        if (pageString && this.isPageValueValid(Number(pageString))) this.page.set(Number(pageString));
        else this.page.set(1);
    }
    
    private isPageValueValid(value: number) {
        if (!Number.isInteger(value)) return false;
        if (value < 1) return false;
        return true;
    }

    private filterEntriesWithPageChecking() {
        const entryFilterDto = this.getEntryFilterDto();
        this.writeParametersInUrl(entryFilterDto);

        this.entryService.get(entryFilterDto).subscribe({
            next: httpResponse => {
                const totalCountString = httpResponse.headers.get("total-count");
                this.totalCount.set(Number(totalCountString));
                
                if (this.page() <= this.pageCount()) {
                    this.entrySummaryDtos.set(httpResponse.body ?? []);
                    return;
                }
                
                this.page.set(this.pageCount());
                this.filterEntries();
                
            },
            error: async err => {
                await this.handleError(err);
            }
        });
    }

    private filterEntries() {
        const entryFilterDto = this.getEntryFilterDto();
        this.writeParametersInUrl(entryFilterDto);

        this.entryService.get(entryFilterDto).subscribe({
            next: httpResponse => {
                const totalCountString = httpResponse.headers.get("total-count");
                this.totalCount.set(Number(totalCountString));

                this.entrySummaryDtos.set(httpResponse.body ?? []);
            },

            error: async err => {
                await this.handleError(err);
            }
        });
    }

    private getEntryFilterDto(): EntryFilterDto {
         return {
            ...this.entrySearchFilterDto(),
            page: this.page(),  
            recordsPerPage: this.pageSize
        };
    }

    private writeParametersInUrl(entryFilterDto: EntryFilterDto) {
        const queryStrings: string[] = [];

        if (entryFilterDto.term) queryStrings.push(`term=${encodeURIComponent(entryFilterDto.term)}`);

        if (entryFilterDto.categoryId) queryStrings.push(`categoryId=${entryFilterDto.categoryId}`);

        if (entryFilterDto.isFavorite) queryStrings.push(`isFavorite=${entryFilterDto.isFavorite}`);

        if (entryFilterDto.page) queryStrings.push(`page=${entryFilterDto.page}`);

        this.location.replaceState("", queryStrings.join('&'));
    }

    private async handleError(err: HttpErrorResponse) {
        console.error("Failed to get entries summary list", "error response: ", err);

        const errorMessages = await extractErrorMessages(err);
        this.errors.set(errorMessages);
    }
    
    private readonly entrySummaryDtoObjects: EntrySummaryDto[] = [
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
}
