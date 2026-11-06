import {Component, inject, input, model, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {CategoryDto} from "../../categories/category.models";
import {debounceTime} from "rxjs";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";
import {EntrySearchFilterDto} from "../entry.models";
import {removeNullProperties} from "../../shared/functions/remove-null-properties";

@Component({
    selector: 'app-entry-search-form',
    imports: [ReactiveFormsModule, FavoriteComponent],
    templateUrl: './entry-search-form.component.html',
    styleUrl: './entry-search-form.component.css'
})
export class EntrySearchFormComponent implements OnInit{
    readonly totalCount = input.required<number>();
    readonly entrySearchFilterDto = model.required<EntrySearchFilterDto>();
    
    private formBuilder = inject(FormBuilder);
    
    readonly formGroup = this.formBuilder.group({
        term: new FormControl<string | null>(null),
        categoryId: new FormControl<number | null>(null),
        isFavorite: new FormControl<boolean | null>(null),
        exactMatch: new FormControl<boolean | null>(null)
    });
    
    isFavorite = signal<boolean>(false);
    
    readonly categoryDtos = signal<CategoryDto[]>([]);
    
    ngOnInit(): void {
        this.categoryDtos.set([{
            id: 1,
            name: "Word"
        }, {
            id: 2,
            name: "Phrase"
        }]);

        const entrySearchFilterDtoObject = this.entrySearchFilterDto();

        this.formGroup.patchValue(entrySearchFilterDtoObject);
        if (entrySearchFilterDtoObject.isFavorite) this.isFavorite.set(entrySearchFilterDtoObject.isFavorite)
        
        this.formGroup.valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => {
                const entrySearchFilterDtoObject = removeNullProperties<EntrySearchFilterDto>(value);
                this.entrySearchFilterDto.set(entrySearchFilterDtoObject);
            });
    }
    
    onIsFavoriteChange(isFavoriteBool: boolean) {
        this.isFavorite.set(isFavoriteBool);
        this.formGroup.controls.isFavorite.setValue(isFavoriteBool);
    }
    
    clear() {
        const defaultFormValue = {
            term: null,
            categoryId: null,
            isFavorite: null,
            exactMatch: null
        };
        
        this.formGroup.patchValue(defaultFormValue);
        this.isFavorite.set(false);
    }
    
}
