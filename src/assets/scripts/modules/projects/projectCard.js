
export function projectCard({ card,img,title, url} = {}) {
        const{ type, credit_month, credit, info, eoselya, adres,appart_count,cost,deadline} = card;
  return `
    <a href="${url}" class="swiper-slide project-card">
        <div class="project__img-wrap">
        <img class="project__img" src="${img}" alt="project">
           ${type==="done"?`<div class="project__ready">Об'єкт здано</div>`:`<div class="project__ready">Об'єкт будується</div>`} 
            <div class="project__right-top-wrap">
                ${credit_month?`<div class="project__postpayment">Розтермінування ${credit_month} міс.</div>`:''}
                ${credit?`<div class="project__credit">Доступно в кредит</div>`:''}
                ${info?`<div class="project__partners">${info}</div>`:''}
            </div>
            ${eoselya?`<div class="project__jeoselia">
                <svg class="icon--oselia" role="presentation">
                    <use xlink:href="#icon-oselia"></use>
                </svg>
            </div>`:''}
        </div>
        <div class="project__title-loc-wrap">
            <h3 class="project__title">${title}</h3><div class="project__location" >
                <svg class="icon--location" role="presentation">
                    <use xlink:href="#icon-location"></use>
                </svg>
                <p>${adres}</p>
            </div>
        </div>
        <ul class="project__info-list">
            <li class="project__info-item">
                <h4 class="project__info-label">Квартири:</h4>
                <p class="project__info-value">${appart_count}</p>
            </li>
            <li class="project__info-item">
                <h4 class="project__info-label">Ціна:</h4>
                <p class="project__info-value">${cost}</p>
            </li>
            <li class="project__info-item">
                <h4 class="project__info-label">Здача:</h4>
                <p class="project__info-value">${deadline}</p>
            </li>
        </ul>
    </div>`;
}