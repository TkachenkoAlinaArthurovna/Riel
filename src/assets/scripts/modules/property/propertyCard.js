export function propertyCard({all_area, apart_img, city_code, city_name, living_area, name, project_code, project_img, project_name, type_code, type_name, url}) {
  return `
    <a href="${url}" class="property-card" data-project-code="${project_code}" data-type-code="${type_code}" data-city-code="${city_code}">

        <div class="property-card__img-wrap">

            <img class="property-card__img" src="${project_img}" alt="">

            <div class="property-card__location" >

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="6" fill="#77B551"></rect>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6C9.87878 6 8 7.24528 8 9.62264C8 10.1208 8.28283 10.8491 8.42424 11.1509L12 18V11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39545 10.8954 7.50003 12 7.5V6ZM12 11.5C12 11.5 12 11.5 12 11.5C13.1046 11.5 14 10.6046 14 9.5C14 8.39543 13.1046 7.5 12 7.5C12 7.5 12 7.5 12 7.5V6C14.1212 6 16 7.24528 16 9.62264C16 10.1208 15.7172 10.8491 15.5757 11.1509L12 18V11.5Z" fill="#F2F5F8"></path>
                </svg>

                <span>${city_name}</span>

            </div>

            <h3 class="property-card__project-title">${project_name}</h3>

        </div>

        <div class="property-card__info-wrap">

            <div class="property-card__info-img-wrap"> 
                <img src="${apart_img}" alt="">
            </div>

            <div class="property-card__info-text">
                <h4 class="property-card__info-title">${type_name}</h4>
                <ul class="property-card__info-list">
                    <li class="property-card__info-item">
                        <p>Загальна площа:<span>${all_area}</span>м²</p>
                    </li>
                    <li class="property-card__info-item">
                        <p>Житлова площа:<span>${living_area}</span>м²</p>
                    </li>
                </ul>
                <button class="general-button" href="${url}">ДИВИТИСЯ ПЛАНУВАННЯ</button>
            </div>

        </div>
    </a>`;
}
