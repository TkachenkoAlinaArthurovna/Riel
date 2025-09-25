
export function newsCard({ date,img,pre_text,title,type,url} = {}) {
  return `
  <a class="news-card" href="${url}" data-type="${type}"> 
    <div class="news-card__img">
      <img src="${img}" alt="news">
    </div>
    <div class="news-card__content-wrap">
        <div class="news-card__header">
            ${type ==="actions"?'<div class="news-card__type">АКЦІЯ</div>':""}
            <div class="news-card__date-wrap"><svg class="news-card__date-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M15.9914 5.5H6.00991C5.22239 5.5 4.58398 6.13841 4.58398 6.92593V16.9074C4.58398 17.6949 5.22239 18.3333 6.00991 18.3333H15.9914C16.7789 18.3333 17.4173 17.6949 17.4173 16.9074V6.92593C17.4173 6.13841 16.7789 5.5 15.9914 5.5Z" stroke="#8E9098" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M13.75 3.66699V6.41699" stroke="#8E9098" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.25 3.66699V6.41699" stroke="#8E9098" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4.58398 9.16699H17.4173" stroke="#8E9098" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg><span class="news-card__date">${date}</span>
            </div>
        </div>
        <div class="news-card__title">${title}</div>
        <div class="news-card__descr">${pre_text}</div>
        <button class="news-card__link" href="${url}">ЧИТАТИ НОВИНУ</button>
    </div>
  </a>`;
}


