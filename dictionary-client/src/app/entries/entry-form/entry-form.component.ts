import {Component, computed, inject, input, OnInit, output, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {EntryCreateDto, EntryDetailsDto, EntryFilterDto, EntrySummaryDto} from "../entry.models";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CategoryDto} from "../../categories/category.models";
import {TextFieldModule} from "@angular/cdk/text-field";
import {toSignal} from "@angular/core/rxjs-interop";
import {removeNullProperties} from "../../shared/functions/remove-null-properties";
import {debounceTime} from "rxjs";
import {EntryService} from "../entry.service";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";
import {EntryCardComponent} from "../entry-card/entry-card.component";

@Component({
    selector: 'app-entry-form',
    imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, TextFieldModule, EntryCardComponent],
    templateUrl: './entry-form.component.html',
    styleUrl: './entry-form.component.css'
})
export class EntryFormComponent implements OnInit{
    readonly entryDetailsDto = input<EntryDetailsDto | null>(null);
    readonly saveButtonDisabled = input<Boolean>(false);
    readonly cancelRoute = input.required<any[]>();
    readonly postForm = output<EntryCreateDto>();

    private readonly formBuilder = inject(FormBuilder);
    
    readonly formGroup = this.formBuilder.group({
        term: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required]
        }),
        categoryId: new FormControl<number>(1, { nonNullable: true }),
        partOfSpeech: new FormControl<string | null>(null),
        pronunciation: new FormControl<string | null>(null),
        meaning: new FormControl<string | null>(null),
        notes: new FormControl<string | null>(null)
    });
    
    readonly categoryDtos = signal<CategoryDto[]>([]);
    
    readonly selectedCategoryId = toSignal(this.formGroup.controls.categoryId.valueChanges, {
        initialValue: this.formGroup.controls.categoryId.value
    });

    readonly showPartOfSpeech = computed(() => {
        const selectedCategoryDto = this.categoryDtos().find((categoryDto) => categoryDto.id === this.selectedCategoryId());
        return selectedCategoryDto?.name === "Word";
    });

    readonly partOfSpeeches: string[] = [
        "Noun",
        "Verb",
        "Adjective",
        "Adverb",
        "Pronoun",
        "Preposition",
        "Conjunction",
        "Interjection",
        "Determiner" 
    ];
    
    private readonly entryService = inject(EntryService);
    readonly entrySummaryDtos = signal<EntrySummaryDto[] | null>(null);
    readonly errors = signal<string[]>([]);
    
    ngOnInit(): void {
        this.categoryDtos.set([{
            id: 1,
            name: "Word"
        }, {
            id: 2,
            name: "Phase"
        }]);
        
        const entryDetailsDtoObject = this.entryDetailsDto();
        
        if (entryDetailsDtoObject) this.formGroup.patchValue(entryDetailsDtoObject);
        
        const entryFilterDto: EntryFilterDto = {
            exactMatch: true,
            paginate: false    
        };
        
        this.formGroup.controls.term.valueChanges
            .pipe(debounceTime(300))
            .subscribe(term => {
                entryFilterDto.term = term;
                
                this.filterExistingEntries(entryFilterDto);
            });
    }
    
    private filterExistingEntries(entryFilterDto: EntryFilterDto) {
        this.entrySummaryDtos.set(null);
        
        this.entryService.get(entryFilterDto).subscribe({
            next: httpResponse => {
                this.entrySummaryDtos.set(httpResponse.body ?? []);
            },
            
            error: async err => {
                console.error("Failed to get existing entries list", "error response: ", err);

                const errorMessages = await extractErrorMessages(err);
                this.errors.set(errorMessages);
            }
        });
    }
    
    getErrorMessagesForTerm(): string {
        const termFormControl = this.formGroup.controls.term;
        
        if (termFormControl.hasError("required")) return "The Term field is required."; 
        
        return "";
    }
    
    onSubmit() {
        const entryCreationDto = removeNullProperties<EntryCreateDto>(this.formGroup.value);
        
        this.postForm.emit(entryCreationDto);
    }
}
