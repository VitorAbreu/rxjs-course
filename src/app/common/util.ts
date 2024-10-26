import { Observable } from "rxjs";


/**
 * The function creates an observable that fetches data from a specified URL using the Fetch API in
 * TypeScript.
 * @param {string} url - The `url` parameter is a string representing the endpoint to which the HTTP
 * request will be made. In this case, it is used to construct the full URL for the fetch request by
 * appending it to `http://localhost:9000/`.
 * @returns The `createHttpObservable` function returns an Observable that makes an HTTP request to the
 * specified URL using the Fetch API. The Observable emits the response body as the next value and then
 * completes. If there is an error during the HTTP request, it emits an error.
 */
export function createHttpObservable(url: string): Observable<any> {
    return Observable.create(observer => {
        fetch(`http://localhost:9000/${url}`)
          .then(data => data.json())
          .then(body => {
            observer.next(body);
            observer.complete();
          })
          .catch(err => observer.error(err))
      })
}

