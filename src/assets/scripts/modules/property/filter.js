import 'ion-rangeslider';
import 'ion-rangeslider/css/ion.rangeSlider.min.css';
import $ from 'jquery';
import requestData from '../api';
import { useState } from '../helpers/helpers';

import { propertyCard } from "./propertyCard.js";
import { gsap, ScrollTrigger, CustomEase } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger, CustomEase);



const loadMoreBtn = document.querySelector("[data-more-property]")
const [property, setProperty, usePropertyEffect] = useState({
  pending: true,
  container: document.querySelector('.property__container'),
  data: [],
  part:1,
  step:6,
});

usePropertyEffect(({ data, container, part, step }) => {
    
    if(!data){
      container.innerHTML=`<p class="no-result">Нічого не знайдено</p>`;
      loadMoreBtn.style.display="none"
      return
    }
    
  if(data.length <= (step * part)){
   
      loadMoreBtn.style.display="none"
    }else {
      loadMoreBtn.style.display = 'block';
    }

  const newData = data.map(el => {  
    return propertyCard(el)}).slice(0, step * part).join('')
    
    container.innerHTML=newData;

    
});

usePropertyEffect(({ pending, container }) => {
  gsap.to(container, {
    autoAlpha: pending ? 0.5 : 1,
  });

  pending ? container.classList.add('loading') : container.classList.remove('loading');
});


if (loadMoreBtn){loadMoreBtn.addEventListener("click", function () {
  setProperty({
    ...property(),
    part: property().part + 1,
    pending: true,
  })
  setTimeout(()=> {
    setProperty({
      ...property(),
      pending: false,
    })
  }, 500)
})}

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const selectData = document.querySelectorAll('.select');
const minArea = params.get('area_MIN') ? +params.get('area_MIN') : 9;
const maxArea = params.get('area_MAX') ? +params.get('area_MAX') : 300;

$('#doubleRange').ionRangeSlider({
  skin: 'big',
  min: 9,
  max: 300,
  from: minArea,
  to: maxArea,
  type: 'double',
});

const dataSlider = $('#doubleRange').data('ionRangeSlider');
const dataForFirstRequest = {}
function getValuesByGetParams() {
  if (params.size === 0) return;
  for (const select of selectData) {
    const currentParam = params.get(select.dataset.name);
    if (!currentParam || currentParam === 'all') continue;
    const option = select.querySelector(`[data-${select.dataset.name}="${currentParam}"]`);
    if (!option) continue;
    select.dataset.value = currentParam;
    const currentText = select.querySelector('.select__current');
    currentText.innerText = option.textContent;
    dataForFirstRequest[select.dataset.name]=currentParam
  }
 
}
getValuesByGetParams();

dataForFirstRequest['area_MIN'] = dataSlider.result.from;
dataForFirstRequest['area_MAX'] = dataSlider.result.to;

if(window.location.pathname.includes("property")){requestData("property", dataForFirstRequest).then(res => {
    
    
    setProperty({
      ...property(),
      data: res.data.result,
      pending: false,
    });
  });}




//Custom select START

let selectItem = document.querySelectorAll('.select__item');
  let selectHeader = document.querySelectorAll('.select__header');

document.body.addEventListener("click", function (event) {
  console.log(event)
  const select = event.target.closest(".select__header");
  if(select) {
    if (select.parentElement.classList.contains("is-active")){
      
      select.parentElement.classList.remove("is-active"); 
      return
      }
    selectHeader.forEach(item =>  item.parentElement.classList.remove("is-active"))

    select.parentElement.classList.add("is-active")

    
  }
  else {
    selectHeader.forEach(item =>  item.parentElement.classList.remove("is-active"))
  }
})
selectItem.forEach(item => {
  item.addEventListener('click', selectChoose);
});
function selectChoose() {
  let text = this.innerText,
    select = this.closest('.select'),
    currentText = select.querySelector('.select__current');
  let value = this.getAttribute(`data-${select.dataset.name}`);
 
  select.dataset.value = value;
  currentText.innerText = text;
  select.classList.remove('is-active');
}





const formMain = document.querySelector('.real-estate__form');

if (formMain) {
  formMain.addEventListener('submit', function(event) {
    event.preventDefault();
    const dataObject = Array.from(selectData)
      .map(select => `${select.dataset.name}=${select.dataset.value.replace(' ', '_').trim()}`)
      .join('&');

    
    window.location.assign(
      `/property?${dataObject}&area_MIN=${dataSlider.result.from}&area_MAX=${dataSlider.result.to}`,
    );
  });
}

const formProperty = document.querySelector('.property__form');
if (formProperty) {
  formProperty.addEventListener('submit', function(event) {
    event.preventDefault();
    const dataForm = {};
    Array.from(selectData).forEach(
      select => (dataForm[select.dataset.name] = select.dataset.value),
    );
    dataForm['area_MIN'] = dataSlider.result.from;
    dataForm['area_MAX'] = dataSlider.result.to;
    Object.keys(dataForm).forEach(key => params.set(key, dataForm[key]));
    window.history.replaceState({}, '', `${url.pathname}?${params.toString()}`);
    setProperty({
        ...property(),
        pending:true,
      });
    requestData("property", dataForm).then(res => {
        
        setProperty({
          ...property(),
          data: res.data.result,
          pending:false
        });
      });
  });
}
 const selectField = document.querySelectorAll(".select")
const resetBtn = document.querySelector("[data-reset]")
if(resetBtn) {
  resetBtn.addEventListener("click", function () {
 
    window.history.replaceState({}, document.title, window.location.pathname);
    selectField.forEach(select=> {
  
  const allItem = select.querySelector(`[data-${select.dataset.name}="all"]`) //потім вкзати data-${select.dataset.name}="all"
  
  let text = allItem.textContent
  let value = allItem.getAttribute(`data-${select.dataset.name}`);
  let currentText = select.querySelector('.select__current');
  
  currentText.innerText = text;
  select.dataset.value = value;
  
  })
  dataSlider.update({
    from:9,
    to: 300
  })
  })
}

// //Custom select END




