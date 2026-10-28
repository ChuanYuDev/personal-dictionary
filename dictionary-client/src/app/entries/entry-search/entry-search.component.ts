import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {CategoryDto} from "../../categories/category.models";
import {debounceTime} from "rxjs";
import {FavoriteComponent} from "../../shared/components/favorite/favorite.component";

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
            name: "Phase"
        }]);
        
        this.formGroup.valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => {
            console.log(value);
        });
        
        this.totalCount.set(0);
    }
}
