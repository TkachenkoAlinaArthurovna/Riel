import i18next from 'i18next';
import { gsap } from 'gsap';
import * as yup from 'yup';
// eslint-disable-next-line import/no-extraneous-depende
import { FormMonster, FormMonsterForCart } from '../../../pug/components/form/form';
import SexyInput from '../../../pug/components/input/input';
import { useState } from './helpers/helpers';

/*
 * form handlers start
 */
const forms = [
  '[data-form="contact-form"]',
  '[data-form="contact-form-1"]',
  '[data-form="contact-form-2"]',
  '[data-form="contact-form-3"]',
];

const formsForCart = ['[data-form="contact-form-in-cart"]'];

function resetInputs(dataForm) {
  const form = document.querySelector(dataForm);

  if (form) {
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      input.value = ''; // очистити текст
      input.removeAttribute('value');
      input.classList.remove('filled', 'error', 'valid');

      // 🔥 якщо хочеш, щоб HTML-валідація не спрацьовувала взагалі:
      input.removeAttribute('required');
    });

    // усі повідомлення про помилки
    const messages = form.querySelectorAll('[data-input-message]');
    messages.forEach(msg => {
      msg.textContent = '';
      msg.classList.remove('error', 'show', 'visible');
    });

    // скинути стани полів
    const fields = form.querySelectorAll('[data-field-input]');
    fields.forEach(field => {
      field.removeAttribute('data-status');
      field.setAttribute('data-status', 'field--inactive');
      field.classList.remove('selected');
    });
  }
}

forms.forEach(form => {
  const $form = document.querySelector(form);
  if ($form) {
    /* eslint-disable */
    new FormMonster({
      /* eslint-enable */
      elements: {
        $form,
        successAction: () => {
          console.log('successAction'); 
          $form.insertAdjacentHTML(
            'beforeend',
            `
              <div class="success-pop-up" data-success>
                  <div class="success-pop-up__wrapper">
                  <div class="success-pop-up__close" onclick="this.closest('[data-success]').remove();" >
                      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.25 29.75L29.75 12.25" stroke="#1d3541" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M29.75 29.75L12.25 12.25" stroke="#1d3541" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                  </div>
                  
                  <div class="success-pop-up__text"> Дякуємо! Ми зв'яжемося з вами найближчим часом. Гарного дня!</div>
                  
                  </div>
              </div>
            `,
          );

          setTimeout(() => {
            resetInputs('[data-form="contact-form"]');
            if ($form.querySelector('[data-success]')) {
              $form.querySelector('[data-success]').remove();
            }
          }, 5000);
        },
        $btnSubmit: $form.querySelector('[data-btn-submit]'),
        fields: {
          name: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-name]'),
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .trim(),
            defaultMessage: i18next.t('name'),
            valid: false,
            error: [],
          },
          // email: {
          //   inputWrapper: new SexyInput({
          //     animation: 'none',
          //     $field: $form.querySelector('[data-field-email]'),
          //   }),
          //   rule: yup
          //     .string()
          //     .required(i18next.t('required'))
          //     .trim(),
          //   defaultMessage: i18next.t('email'),
          //   valid: false,
          //   error: [],
          // },

          phone: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-phone]'),
              typeInput: 'phone',
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .min(17, i18next.t('field_too_short', { cnt: 17 - 5 })),

            defaultMessage: i18next.t('phone'),
            valid: false,
            error: [],
          },
        },
      },
    });
  }
});

formsForCart.forEach(form => {
  const $form = document.querySelector(form);
  if ($form) {
    /* eslint-disable */
    new FormMonsterForCart({
      /* eslint-enable */
      elements: {
        $form,
        successAction: () => {
          if (window.innerWidth < 1300) {
            document.querySelector('.cart_popup__right').classList.add('non_active');
            document.querySelector('.cart_popup__center').classList.remove('non_active');
          }
          document.querySelector('.cart_popup').classList.remove('active');

          document.querySelector('.page__content').insertAdjacentHTML(
            'beforeend',
            `
              <div class="success-pop-up" data-success>
                  <div class="success-pop-up__wrapper">
                  <div class="success-pop-up__close" onclick="this.closest('[data-success]').remove();" >
                      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.25 29.75L29.75 12.25" stroke="#1d3541" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M29.75 29.75L12.25 12.25" stroke="#1d3541" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                  </div>
                  
                  <div class="success-pop-up__text"> Дякуємо! Ми зв'яжемося з вами найближчим часом. Гарного дня!</div>
                  
                  </div>
              </div>
            `,
          );

          setTimeout(() => {
            resetInputs('[data-form="contact-form-in-cart"]');
            if (document.querySelector('[data-success]')) {
              document.querySelector('[data-success]').remove();
            }
          }, 5000);
        },
        $btnSubmit: $form.querySelector('[data-btn-submit]'),
        fields: {
          name: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-name]'),
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .trim(),
            defaultMessage: i18next.t('name'),
            valid: false,
            error: [],
          },
          phone: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-phone]'),
              typeInput: 'phone',
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .min(17, i18next.t('field_too_short', { cnt: 17 - 5 })),

            defaultMessage: i18next.t('phone'),
            valid: false,
            error: [],
          },
        },
      },
    });
  }
});

const [fromPopup, setFormPopup, useSetPopupEffect] = useState(false);

useSetPopupEffect(val => {
  if (val) {
    gsap.to('[data-form-popup]', {
      autoAlpha: 1,
      pointerEvents: 'all',
    });
    return;
  }
  gsap.to('[data-form-popup]', {
    autoAlpha: 0,
    pointerEvents: 'none',
  });
});

document.body.addEventListener('click', evt => {
  const target = evt.target.closest('[data-form-popup-call]');
  if (!target) return;
  setFormPopup(true);
});
document.body.addEventListener('click', evt => {
  const target = evt.target.closest('[data-form-popup-close]');
  if (!target) return;
  setFormPopup(false);
});
