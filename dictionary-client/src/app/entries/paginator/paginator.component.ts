import {Component, computed, effect, input, model, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-paginator',
    imports: [ReactiveFormsModule],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit {
    readonly totalCount = input.required<number>();
    readonly pageSize = input.required<number>();
    readonly page = model<number>(1);
    
    readonly pageCount = computed(() => Math.ceil(this.totalCount() / this.pageSize() ));
    readonly pageFormControl = new FormControl<number | null>(null);
    
    constructor() {
        effect(() => {
            this.pageFormControl.setValue(this.page());
        });
    }

    ngOnInit(): void {
        if (!this.isValueValid(this.page())) this.page.set(1);
    }
    
    onChange() {
        const value = this.pageFormControl.value;
        if (this.isValueValid(value)) this.page.set(value as number); 
        else this.pageFormControl.setValue(this.page());
    }
    
    decreasePage() {
        this.page.update(value => value - 1);
    }
    
    increasePage() {
        this.page.update(value => value + 1);
    }
    
    private isValueValid(value: number | null) {
        if (value === null) return false;
        if (!Number.isInteger(value)) return false;
        if (value < 1) return false;
        if (value > this.pageCount()) return false;
        return true;
    }
}
