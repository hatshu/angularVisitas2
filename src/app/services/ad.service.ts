import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IContact } from '../model/contact';
const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient) { }
  // get all contact data

getAllUsers(url: string): Observable <string[]> {
   return this.http.get <string[]> (url).pipe(catchError(this.handleError));
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
