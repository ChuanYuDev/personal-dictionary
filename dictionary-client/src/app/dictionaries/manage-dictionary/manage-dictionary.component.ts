import {Component, inject, OnInit, signal} from '@angular/core';
import {Router} from "@angular/router";
import {DictionaryService} from "../dictionary.service";
import {CreateDictionaryComponent} from "../create-dictionary/create-dictionary.component";
import {DownloadDictionaryComponent} from "../download-dictionary/download-dictionary.component";
import {OpenDictionaryComponent} from "../open-dictionary/open-dictionary.component";
import {MatIconModule} from "@angular/material/icon";
import {PageHeaderComponent} from "../../shared/components/page-header/page-header.component";
import {UpdateDictionaryNameComponent} from "../update-dictionary-name/update-dictionary-name.component";
import {MetadataService} from "../metadata.service";
import {extractErrorMessages} from "../../shared/functions/extract-error-messages";
import {DisplayErrorsComponent} from "../../shared/components/display-errors/display-errors.component";

@Component({
    selector: 'app-manage-dictionary',
    imports: [CreateDictionaryComponent, DownloadDictionaryComponent, OpenDictionaryComponent, MatIconModule,
        PageHeaderComponent, MatIconModule, UpdateDictionaryNameComponent, DisplayErrorsComponent],
    templateUrl: './manage-dictionary.component.html',
    styleUrl: './manage-dictionary.component.css'
})
export class ManageDictionaryComponent implements OnInit {
    readonly name = signal<string>("Name not available");
    readonly nameErrors = signal<string[]>([]);
        
    private readonly dictionaryService = inject(DictionaryService);
    private readonly router = inject(Router);
    private readonly metadataService = inject(MetadataService);
    
    readonly dictionaryState = this.dictionaryService.dictionaryState;
    
    ngOnInit(): void {
        this.loadMetadata();
    }
    
    loadMetadata() {
        this.metadataService.loadMetadata(this.name, this.nameErrors);
    }

    disconnectDictionary(): void {
        this.dictionaryService.disconnect();
        this.navigateToHome();
    }
    
    navigateToHome(): void {
        this.router.navigate(["/"]);
    }
}
