import {Component, effect, inject, input, model, OnInit, output, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {CategoryDto} from "../../categories/category.models";
import {debounceTime} from "rxjs";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";
import {EntryFilterDto, EntrySearchFilterDto} from "../entry.models";

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
        isFavorite: new FormControl<boolean | null>(null)
    });
    
    readonly categoryDtos = signal<CategoryDto[]>([]);
    isFavorite = signal<boolean>(false);
    
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
                this.entrySearchFilterDto.set(value as EntrySearchFilterDto);
                console.log(this.entrySearchFilterDto());
            });
        
        const entrySearchFilterDtoObject = this.entrySearchFilterDto();
        
        this.formGroup.patchValue(entrySearchFilterDtoObject);
        if (entrySearchFilterDtoObject.isFavorite) this.isFavorite.set(entrySearchFilterDtoObject.isFavorite)
    }
}
