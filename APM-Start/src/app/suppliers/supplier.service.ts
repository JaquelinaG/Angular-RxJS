import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError, of } from 'rxjs';
import { tap, concatMap, mergeMap, switchMap, shareReplay, catchError } from 'rxjs/operators';
import { Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';

  suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl).pipe(
    tap(data => console.log('suppliers: ', JSON.stringify(data))),
    shareReplay(1),
    catchError(err=> this.handleError(err))
  )

  suppliersconcatMap$ = of(1,5,8).pipe(
    tap(id => console.log('concatMap source obs: ', id)),
    concatMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  suppliersmergeMap$ = of(1,5,8).pipe(
    tap(id => console.log('mergeMap source obs: ', id)),
    mergeMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  suppliersswitchMap$ = of(1,5,8).pipe(
    tap(id => console.log('switchMap source obs: ', id)),
    switchMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  constructor(private http: HttpClient) {
    // this.suppliersconcatMap$.subscribe(item => console.log('result concatMap:', item));
    // this.suppliersmergeMap$.subscribe(item => console.log('result mergeMap:', item));
    // this.suppliersswitchMap$.subscribe(item => console.log('result switchMap:', item));
   }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
