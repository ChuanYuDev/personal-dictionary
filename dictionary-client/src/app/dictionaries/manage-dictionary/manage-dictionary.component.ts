import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-manage-dictionary',
    imports: [RouterLink],
    templateUrl: './manage-dictionary.component.html',
    styleUrl: './manage-dictionary.component.css'
})
export class ManageDictionaryComponent {
    name:string = "Dictionary name";
}
