// import '../form';
// import 'intl-tel-input/build/css/intlTelInput.css';
// import intlTelInput from 'intl-tel-input';

// const input = document.querySelector('#phone');
// intlTelInput(input, {
//   utilsScript: 'path/to/utils.js',
// });
import googleMap from '../map/map';
import { contactFormFooter } from './contactFormFooter';

const footer = document.querySelector('footer');

const initFooter = () => {
  const createFormValidRef = document.querySelectorAll('[contact-form-js]');
  createFormValidRef.forEach(el => {
    contactFormFooter(el);
  });
  
};
setTimeout(()=>{googleMap()}, 1500)
if (footer) {
  initFooter();
}
