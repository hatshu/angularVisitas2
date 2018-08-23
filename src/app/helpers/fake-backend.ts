import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const testUser = {
          id: 1, username: 'admin',
          password: 'admin',
          firstName: 'Test',
          lastName: 'User'
        };
        const normalUser = {
          id: 2, username: 'user',
          password: 'user',
          firstName: 'Normal',
          lastName: 'User'
        };
        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                // tslint:disable-next-line:max-line-length
                if ((request.body.username === testUser.username && request.body.password === testUser.password ) || (request.body.username === normalUser.username && request.body.password === normalUser.password )) {
                    // if login details are valid return 200 OK with a fake jwt token
                    let body: any = '';
                    if (request.body.username === testUser.username) {
                       body = {
                        id: testUser.id,
                        username: testUser.username,
                        firstName: testUser.firstName,
                        lastName: testUser.lastName,
                        token: 'fake-jwt-token'
                       };
                    } else {
                      if (request.body.username === normalUser.username) {
                        body = {
                         id: normalUser.id,
                         username: normalUser.username,
                         firstName: normalUser.firstName,
                         lastName: normalUser.lastName,
                         token: 'fake-jwt-token'
                        };
                      }
                    }
                    return of(new HttpResponse({ status: 200, body }));
                } else {
                    // else return 400 bad request
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // get users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                // tslint:disable-next-line:max-line-length
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: [testUser] }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ error: { message: 'Unauthorised' } });
                }
            }

            // pass through any requests not handled above
            return next.handle(request);

        }))

        // tslint:disable-next-line:max-line-length
        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
