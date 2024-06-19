import moment from 'moment';

export default class Comment {
  constructor(data) {
    this.data = data;
    this.#createComment();
  }

  #createComment() {
    let {
      id,
      author,
      avatar,
      content,
      created
    } = this.data;

    const comment = document.createElement('div');
    comment.classList.add('comment');
    comment.setAttribute('id', id);

    const authorAvatar = document.createElement('div');
    authorAvatar.classList.add('authorAvatar');
    authorAvatar.style.backgroundImage = `url(${avatar})`;

    const authorAndContent = document.createElement('div');
    authorAndContent.classList.add('authorAndContent');

    const authorSpan = document.createElement('span');
    authorSpan.classList.add('authorSpan');
    authorSpan.textContent = author;

    const contentSpan = document.createElement('span');
    contentSpan.classList.add('contentSpan');
    if (content.length > 15) {
      content = content.slice(0, 25) + '...';
    }
    contentSpan.textContent = content;

    authorAndContent.append(authorSpan, contentSpan);
    
    const date = document.createElement('span');
    date.classList.add('comment_date');
    date.textContent = this.#fixDate(created);

    comment.append(authorAvatar, authorAndContent, date);
    
    this._element = comment;
  }

  #fixDate(created) {
    const momentDate = moment.unix(created);
    return momentDate.format('HH:mm DD.MM.YYYY'); 
  }

  get element() {
    return this._element;
  }
}