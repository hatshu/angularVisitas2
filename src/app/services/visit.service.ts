import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IVisit } from '../model/visit';
const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable()
export class VisitService {

  constructor(private http: HttpClient) { }
   // get all visit data
   getAllVisit(url: string): Observable <IVisit[]> {
    return this.http.get <IVisit[]> (url).pipe(catchError(this.handleError));
}
// insert new visit details
    addVisit(url: string, visit: IVisit): Observable < any > {
    return this.http.post(url, JSON.stringify(visit), httpOptions).pipe(catchError(this.handleError));
}
// get all visit data for Person
getAllVisitPerson(url: string, Id: number): Observable <IVisit[]> {
  const newurl = `${url}?Id=${Id}`;
 return this.http.get <IVisit[]> (newurl).pipe(catchError(this.handleError));
}

// update visit details
    updateVisit(url: string, Id: number, visit: IVisit): Observable < any > {
    const newurl = `${url}?Id=${Id}`;
    return this.http.put(newurl, visit, httpOptions).pipe(catchError(this.handleError));
}
// delete visit information
    deleteVisit(url: string, Id: number): Observable < any > {
    const newurl = `${url}?Id=${Id}`; // DELETE api/visit?Id=42
    return this.http.delete(newurl, httpOptions).pipe(catchError(this.handleError));
}
// custom handler
private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
    } else {
        // the backend returned an unsuccessful response code.
        // the response body may contain clues as to what went wrong,
        console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
}
}
