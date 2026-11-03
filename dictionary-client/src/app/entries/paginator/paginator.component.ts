import {Component, computed, effect, input, model, OnInit, output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-paginator',
    imports: [ReactiveFormsModule],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
    readonly totalCount = input.required<number>();
    readonly pageSize = input<number>(20);
    readonly page = model<number>(1);
    readonly pageChange = output<number>();
    
    readonly pageCount = computed(() => Math.ceil(this.totalCount() / this.pageSize() ));
    readonly pageFormControl = new FormControl<number>(1);
    
    constructor() {
        effect(() => {
            this.pageFormControl.setValue(this.page());
        });
    }
    
    onChange() {
        if (this.isPageValid()) this.page.set(this.pageFormControl.value as number); 
        else this.pageFormControl.setValue(this.page());
    }
    
    decreasePage() {
        this.page.update(value => value - 1);
    }
    
    increasePage() {
        this.page.update(value => value + 1);
    }
    
    private isPageValid() {
        const value = this.pageFormControl.value;
        
        if (value === null) return false;
        if (!Number.isInteger(value)) return false;
        if (value < 1) return false;
        if (value > this.pageCount()) return false;
        return true;
    }
    
}
