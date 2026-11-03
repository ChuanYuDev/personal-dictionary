import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-paginator',
    imports: [],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
    readonly totalCount = input.required<number>();
    readonly pageSize = input<number>(20);
    readonly pageIndex = input<number>(1);
    readonly pageChange = output<number>();
}
