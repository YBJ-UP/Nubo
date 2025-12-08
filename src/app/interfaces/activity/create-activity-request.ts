import { ContentItem } from "./content-item";

export interface CreateActivityRequest {
    teacherId: string;
    moduleId: string;
    title: string;
    thumbnail: string;
    isPublic: boolean;
    content: ContentItem[];
}
