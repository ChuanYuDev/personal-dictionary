import {CategoryDto} from "../categories/category.models";
import {PaginationDto} from "../shared/models/pagination.models";

export interface EntryCreateDto {
    term: string;
    pronunciation?: string;
    partOfSpeech?: string;
    meaning?: string;
    notes?: string;
    isFavorite: boolean;
    categoryId: number;
}

export interface EntrySummaryDto {
    id: number;
    term: string;
    pronunciation?: string;
    partOfSpeech?: string;
    meaning?: string;
    isFavorite: boolean;
    categoryName: string;
}

export interface EntryDetailsDto extends EntrySummaryDto {
    notes?: string;
    modifiedAt: Date;
    createdAt: Date;
    categoryId: number;
}

export interface EntryFilterDto extends PaginationDto {
    term?: string;
    categoryId?: number;
    isFavorite: boolean;
}