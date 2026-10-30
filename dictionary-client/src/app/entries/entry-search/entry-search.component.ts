import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {CategoryDto} from "../../categories/category.models";
import {debounceTime} from "rxjs";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";
import {EntryFilterDto} from "../entry.models";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
    selector: 'app-entry-search',
    imports: [ReactiveFormsModule, FavoriteComponent],
    templateUrl: './entry-search.component.html',
    styleUrl: './entry-search.component.css'
})
export class EntrySearchComponent implements OnInit{
    private formBuilder = inject(FormBuilder);
    
    readonly formGroup = this.formBuilder.group({
        term: new FormControl<string | null>(null),
        categoryId: new FormControl<number | null>(null),
        isFavorite: new FormControl<boolean>(false, { nonNullable: true })
    });
    
    readonly categoryDtos = signal<CategoryDto[]>([]);
    isFavorite = signal<boolean>(false);
    
    totalCount = signal<number>(0);
    
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly location = inject(Location);
    
    constructor() {
        effect(() => {
            this.formGroup.controls.isFavorite.setValue(this.isFavorite());
        });
    }
    ngOnInit(): void {
        this.categoryDtos.set([{
            id: 1,
            name: "Word"
        }, {
            id: 2,
            name: "Phrase"
        }]);
        
        this.formGroup.valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => {
                this.writeParametersInUrl(value as EntryFilterDto);
                console.log(value);
            });
        
        this.totalCount.set(0);
        this.readValuesFromUrl();
    }
    
    private readValuesFromUrl() {
        this.activatedRoute.queryParams.subscribe(params => {
            const value: any = {};
            
            const term = params["term"];
            if (term) value.term = term;
            
            const categoryId = params["categoryId"];
            if (categoryId) value.categoryId = Number(categoryId);
            
            const isFavorite = params["isFavorite"];
            if (isFavorite) this.isFavorite.set(isFavorite === "true");
            
            this.formGroup.patchValue(value);
        });
    }
    
    private writeParametersInUrl(entryFilterDto: EntryFilterDto) {
        const queryStrings: string[] = [];
        
        if (entryFilterDto.term) queryStrings.push(`term=${encodeURIComponent(entryFilterDto.term)}`);
        
        if (entryFilterDto.categoryId) queryStrings.push(`categoryId=${entryFilterDto.categoryId}`);
        
        if (entryFilterDto.isFavorite) queryStrings.push(`isFavorite=${entryFilterDto.isFavorite}`);
        
        this.location.replaceState("", queryStrings.join('&'));
    }
}
