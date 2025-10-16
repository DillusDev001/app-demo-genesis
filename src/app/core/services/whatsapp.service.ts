import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiBody } from "../interfaces/api/api-body.interface";
import { ApiBotResult } from "../interfaces/api/api-bot.interface";

@Injectable({
    providedIn: 'root'
})
export class WhatsAppService {

    constructor(private http: HttpClient) { }

    //dominio: string = 'https://upeaposgrado.elohimdev.com/api'
    dominio: string = environment.production ? 'https://upeaposgrado.elohimdev.com/api' : 'http://localhost:3000'
    version: string = '/v1';
    route: string = '/message';



    setWhatsApp(body: ApiBody): Observable<ApiBotResult> {
        return this.http.post<ApiBotResult>(`${this.dominio}${this.version}${this.route}`, body);
    }

    setWhatsAppBatch(messages: ApiBody[], botOwnerNumber: string): Observable<ApiBotResult> {
        //return this.http.post<ApiBotResult>(`${this.dominio}${this.version}${this.route}/batch`, { body, ownerNumber });
        return this.http.post<ApiBotResult>(`${this.dominio}${this.version}${this.route}/batch`, { messages, botOwnerNumber });
        // return this.http.post(`${API_URL}/v1/batch-messages`, { messages: batch }).subscribe();
    }
}