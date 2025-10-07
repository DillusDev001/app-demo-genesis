import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HeaderService {

    private headerAction = new Subject<string>();

    // Observable al que se puede suscribir el header
    headerAction$ = this.headerAction.asObservable();

    // Método para emitir eventos hacia el header
    triggerAction(action: string) {
        this.headerAction.next(action);
    }

}