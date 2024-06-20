import { DateTime }from 'luxon';

export default class Post {
  constructor(data) {
    this.data = data;
    this.#createPost();
  }

  #createPost() {
    const {
      id,
      author,
      avatar,
      img,
      created
    } = this.data;

    const post = document.createElement('div');
    post.classList.add('post');
    post.setAttribute('id', id);

    const postHeader = document.createElement('div');
    postHeader.classList.add('post_header');

    const info = document.createElement('div');
    info.classList.add('info');

    const authorAvatar = document.createElement('div');
    authorAvatar.classList.add('authorAvatar');
    authorAvatar.style.backgroundImage = `url(${avatar})`;

    const authorSpan = document.createElement('span');
    authorSpan.classList.add('authorSpan');
    authorSpan.textContent = author;
    
    const date = document.createElement('span');
    date.classList.add('date');
    date.textContent = this.#fixDate(created);

    info.append(authorSpan, date);

    postHeader.append(authorAvatar, info);


    const content = document.createElement('div');
    content.classList.add('content');
    content.style.backgroundImage = `url(${img})`;

    const comments = document.createElement('div');
    comments.classList.add('comments');
    comments.textContent = 'Latest comments';


    const postFooter = document.createElement('span');
    postFooter.classList.add('postFooter');
    postFooter.textContent = 'Load more';

    post.append(postHeader, content, comments, postFooter);
    
    this._element = post;
  }

  #fixDate(created) {
    const luxonDate = DateTime.fromMillis(created);
    return luxonDate.toFormat('HH:mm dd.MM.yyyy'); 
  }

  get element() {
    return this._element;
  }
}