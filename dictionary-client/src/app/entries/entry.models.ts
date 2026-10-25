import {CategoryDto} from "../categories/categories.models";

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
    category: CategoryDto;
}

export interface EntryDetailsDto extends EntrySummaryDto {
    notes?: string;
    modifiedAt: Date;
    createdAt: Date;
}