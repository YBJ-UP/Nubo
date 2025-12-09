import { Injectable } from '@angular/core';
import { ApiConfigService } from './api-config.service';

/**
 * Service that calls the backend text‑to‑speech endpoint and returns an audio URL.
 */
@Injectable({
    providedIn: 'root'
})
export class TextToSpeechService {
    constructor(private apiConfig: ApiConfigService) { }

    /**
     * Sends the given text to the /text-to-speech endpoint.
     * The API is expected to return a JSON object like `{ audioUrl: string }`.
     */
    async speak(text: string): Promise<{ audioUrl: string }> {
        const response = await fetch(
            this.apiConfig.getFullUrl('/text-to-speech'),
            {
                method: 'POST',
                headers: { ...this.apiConfig.getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            }
        );

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || err.message || 'Error en text‑to‑speech');
        }
        return response.json();
    }
}
