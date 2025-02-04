import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, switchMap, tap} from "rxjs";
import {Post, SmallPost} from "./news.domain";
import {API_DOMAIN, Language, MAX_CACHE_AGE} from "./api.domain";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private readonly posts = new BehaviorSubject<SmallPost[]>([]);
  private nextUpdate = 0;

  constructor(
    private readonly http: HttpClient,
    @Inject(LOCALE_ID) private readonly lang: Language,
  ) {
  }

  public getPosts(): Observable<SmallPost[]> {
    if (this.nextUpdate > Date.now()) {
      return this.posts;
    }

    this.nextUpdate = Date.now() + MAX_CACHE_AGE;

    return this.http.get<SmallPost[]>(`${API_DOMAIN}/news/${this.lang}`)
      .pipe(
        tap(posts => this.posts.next(posts)),
        switchMap(() => this.posts),
      );
  }

  public getPost(slug: string): Observable<Post> {
    return this.http.get<Post>(`${API_DOMAIN}/news/${this.lang}/${slug}`);
  }
}
