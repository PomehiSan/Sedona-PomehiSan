let openButton = document.querySelector('.main-nav__menu-open-button');
let closeButton = document.querySelector('.main-nav__menu-close-button');

let navMenu = document.querySelector('.main-nav');
let navMenuList = document.querySelector('.main-nav__site-list');

navMenu.classList.remove('main-nav--nojs');

openButton.addEventListener('click', function() {
  if(navMenu.classList.contains('main-nav--closed')) {
    navMenu.classList.remove('main-nav--closed');
    navMenu.classList.add('main-nav--opened');
  } else {
    navMenu.classList.remove('main-nav--opened');
    navMenu.classList.add('main-nav--closed');
  }
});

closeButton.addEventListener('click', function() {
  if(!navMenu.classList.contains('main-nav--closed')){
    navMenu.classList.remove('main-nav--opened');
    navMenu.classList.add('main-nav--closed');
  }
});
