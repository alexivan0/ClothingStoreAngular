import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, finalize, Observable } from "rxjs";
import { BusyService } from "../services/busy.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private busyService: BusyService) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //if the request is not going to ...emailexists
        //turn of the loading spinner for the email validator inside /register
        if(!req.url.includes('emailexists')){
            this.busyService.busy();
        }
        return next.handle(req).pipe(
            delay(500),
            finalize(() =>{
                this.busyService.idle();
            })
        );
    }
}