import { gsap, SplitText } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger, SplitText);

import { ScrollTrigger } from 'gsap/ScrollTrigger';

function initAnimations() {
  if (document.querySelector('.page-template-home')) {
    gsap.fromTo(
      '.section_top__top_right ',
      { transform: 'translate(100%, -100%)' },
      { transform: 'translate(0, 0)', duration: 1, ease: 'power2.out' },
    );
    gsap.fromTo(
      '.section_top__bottom_left',
      { transform: 'translate(-100p%, 100%)' },
      { transform: 'translate(0, 0)', duration: 1, ease: 'power2.out' },
    );

    gsap.fromTo(
      '.section_btn_projects .section_for_btn__top_left',
      { transform: 'translate(-100%, 100%)' },
      {
        transform: 'translate(0, 0)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.section_btn_projects',
          start: 'top 50%',
          toggleActions: 'play none none none',
        },
      },
    );

    gsap.fromTo(
      '.section_btn_projects .section_for_btn__bottom_right',
      { transform: 'translate(100%, -100%)' },
      {
        transform: 'translate(0, 0)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.section_btn_projects',
          start: 'top 50%',
          toggleActions: 'play none none none',
        },
      },
    );

    gsap.fromTo(
      '.section_btn_planning .section_for_btn__top_left',
      { transform: 'translate(-100%, 100%)' },
      {
        transform: 'translate(0, 0)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.section_btn_planning',
          start: 'top 50%',
          toggleActions: 'play none none none',
        },
      },
    );

    gsap.fromTo(
      '.section_btn_planning .section_for_btn__bottom_right',
      { transform: 'translate(100%, -100%)' },
      {
        transform: 'translate(0, 0)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.section_btn_planning',
          start: 'top 50%',
          toggleActions: 'play none none none',
        },
      },
    );
  }
  //
  if (window.innerWidth > 1300) {
    gsap.fromTo(
      '.section_top_subpage .section_top_subpage__breadcrumbs',
      { transform: 'translate(-100%, -100%)' },
      { transform: 'translate(0, 0)', duration: 1.1, ease: 'power2.out' },
    );
  }
  gsap.fromTo(
    '.section_top_subpage .section_top_subpage__top_left',
    { transform: 'translate(-100%, -100%)' },
    { transform: 'translate(0, 0)', duration: 1, ease: 'power2.out' },
  );

  gsap.fromTo(
    '.section_top_subpage .section_top_subpage__bottom_right',
    { transform: 'translate(100%, 100%)' },
    { transform: 'translate(0, 0)', duration: 1, ease: 'power2.out' },
  );
  if (document.querySelector('.page-template-projects')) {
    gsap.fromTo(
      '.btn_filter_mob',
      { transform: 'translateY(100%)' },
      { transform: 'translateY(0)', duration: 1, ease: 'power2.out' },
    );
  }
}

document.addEventListener('DOMContentLoaded', initAnimations);
window.addEventListener('load', initAnimations);
// window.addEventListener('resize', () => {
//   setTimeout(initAnimationsWithDelay, 200);
// });
