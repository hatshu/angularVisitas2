import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IEnlaceVisitContact } from '../model/enlaceVisitContact';
const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})
export class EnlaceService {

  constructor(private http: HttpClient) { }
   // get all IEnlaceVisitContact data
//    getAllEnlaceVisitContact(url: string): Observable <IEnlaceVisitContact[]> {
//     return this.http.get <IEnlaceVisitContact[]> (url).pipe(catchError(this.handleError));
// }
   getAllEnlaceVisitContact(url: string): Observable <IEnlaceVisitContact[]> {
    return this.http.get <IEnlaceVisitContact[]> (url).pipe(catchError(this.handleError));
}

   getAllPersonsName(url: string, Id: number): Observable <string[]> {
    const newurl = `${url}?Id=${Id}`;
    return this.http.get <string[]> (newurl).pipe(catchError(this.handleError));
}

// insert new IEnlaceVisitContact details
    addEnlaceVisitContact(url: string, enlaceVisitContact: IEnlaceVisitContact): Observable < any > {
    return this.http.post(url, JSON.stringify(enlaceVisitContact), httpOptions).pipe(catchError(this.handleError));
}
// update IEnlaceVisitContact details
    updateEnlaceVisitContact(url: string, Id: number, enlaceVisitContact: IEnlaceVisitContact): Observable < any > {
    const newurl = `${url}?Id=${Id}`;
    return this.http.put(newurl, enlaceVisitContact, httpOptions).pipe(catchError(this.handleError));
}
// delete IEnlaceVisitContact information
    deleteEnlaceVisitContact(url: string, Id: number): Observable < any > {
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
