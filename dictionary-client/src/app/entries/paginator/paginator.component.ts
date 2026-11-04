import {Component, computed, effect, input, model, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-paginator',
    imports: [ReactiveFormsModule, MatIconModule],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
    readonly pageCount = input.required<number>();
    readonly page = model.required<number>();
    
    readonly pageFormControl = new FormControl<number | null>(null);
    
    constructor() {
        effect(() => {
            this.pageFormControl.setValue(this.page());
        });
    }
    
    decreasePage() {
        this.page.update(value => value - 1);
    }
    
    goToPage() {
        const value = this.pageFormControl.value;
        
        if (this.isValueValid(value)) this.page.set(value as number);
        else this.pageFormControl.setValue(this.page());
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
