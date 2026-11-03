import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";
import {DictionaryService} from "../dictionary.service";
import {CreateDictionaryComponent} from "../create-dictionary/create-dictionary.component";
import {DownloadDictionaryComponent} from "../download-dictionary/download-dictionary.component";
import {OpenDictionaryComponent} from "../open-dictionary/open-dictionary.component";
import {MatIconModule} from "@angular/material/icon";
import {PageHeaderComponent} from "../../shared/components/page-header/page-header.component";
import {UpdateDictionaryNameComponent} from "../update-dictionary-name/update-dictionary-name.component";

@Component({
    selector: 'app-manage-dictionary',
    imports: [CreateDictionaryComponent, DownloadDictionaryComponent, OpenDictionaryComponent, MatIconModule,
        PageHeaderComponent, MatIconModule, UpdateDictionaryNameComponent],
    templateUrl: './manage-dictionary.component.html',
    styleUrl: './manage-dictionary.component.css'
})
export class ManageDictionaryComponent {
    
    private readonly dictionaryService = inject(DictionaryService);
    private readonly router = inject(Router);
    readonly dictionaryState = this.dictionaryService.dictionaryState;

    disconnectDictionary(): void {
        this.dictionaryService.disconnect();
        this.navigateToHome();
    }
    
    navigateToHome(): void {
        this.router.navigate(["/"]);
    }
}
