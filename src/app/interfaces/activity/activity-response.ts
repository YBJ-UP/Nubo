import { ContentItem } from "./content-item";

export interface ActivityResponse {
    id: string;
    teacherId: string;
    moduleId: string;
    titulo: string;
    thumbnail: string; 
    isPublic: boolean;
    content: ContentItem[];
}
