import Post from './components/Post';
import Comment from './components/Comment';
import { ajax } from 'rxjs/ajax';
import { Observable, Subject, fromEvent, from, of, range, merge, interval, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, pluck, switchMap, exhaustMap, catchError, mergeMap, concatMap } from 'rxjs/operators';

export default class App {
  constructor() {
    this.#createPostStream();
    this.posts = [];
    this.commentsCache = new Map();

    this.postContainer = document.querySelector('.posts');
  }
 
  #ajaxNewPost() {
    return ajax('http://localhost:9080/posts/latest')
      .pipe(
        pluck('response'),
        catchError(error => {
          console.error('Error fetching posts:', error);
          return of({ status: 'error', data: [] });
        })
      );
  }

  #ajaxComments(postId) {
    return ajax(`http://localhost:9080/posts/${postId}/comments/latest`)
    .pipe(
      pluck('response'),
      catchError(error => {
        console.error(`Error fetching comments for post ${postId}:`, error);
        return of({ status: 'error', data: [] });
      })
    );;
  }

  #createPostStream() {
    const postStream$ = interval(30000)
      .pipe(
        switchMap(() => this.#ajaxNewPost()),
        pluck('data'),
        concatMap(posts => from(posts))
      );
    
    postStream$.subscribe({
      next: post => {
        if (!this.posts.find(p => p.id === post.id)) {
          this.posts.unshift(post);
          this.#renderPost(post);
          this.#fetchAndRenderComments(post);
        }
      },

      error: err => {
        console.log('No posts');
      },

      complete: () => {
        console.log('No posts');
      }
    });

  }

  #renderPost(post) {
    const postElement = new Post(post).element;
    this.postContainer.prepend(postElement);
    this.#renderComments(post.id);
  }

  #renderComments(postId) {
    console.log(postId);
    const postElement = document.getElementById(postId);
    const commentsContainer = postElement.querySelector('.comments');
    commentsContainer.innerHTML = '';
    const comments = this.commentsCache.get(postId) || [];
    comments.forEach(comment => {
      const commentElement = new Comment(comment).element;
      commentsContainer.append(commentElement);
    }); 
  }

  #fetchAndRenderComments(post) {
    if (!this.commentsCache.has(post.id)) {
      this.commentsCache.set(post.id, []);
    }
      
      this.#ajaxComments(post.id)
      .pipe(
        pluck('data'),
        concatMap(comments => from(comments))
      )
      .subscribe({
        next: comment => {
          const cachedComments = this.commentsCache.get(post.id);
          if (!cachedComments.find(c => c.id === comment.id)) {
            cachedComments.unshift(comment);
            this.commentsCache.set(post.id, cachedComments);
            this.#renderComments(post.id);
          }
        },
        error: err => {
          console.log('No comments');
        },
  
        complete: () => {
          console.log('No comments');
        }
      })
  }
  

}