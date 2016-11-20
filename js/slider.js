function Slider(elem) {
    this.sliderElements = elem.getElementsByClassName('slider__content');
    this.paginationElem = elem.querySelectorAll('.slider__pagination a');
    this.firstSliderElement = this.sliderElements[0];
    this.pagination = elem.querySelector('.slider__pagination');
    
    this.slidersCount = this.sliderElements.length - 1;
    
    this.sliderCurrent = 0;
    
    this.timerId = setInterval(this.next.bind(this), 5000);
    this.pagination.addEventListener('click', this.pagintionMove.bind(this));
}

Slider.prototype.next = function () {
    this.deleteCurrentPagintion();
    this.sliderCurrent++;
    this.checkCount();
    this.render();
};

Slider.prototype.deleteCurrentPagintion = function () {
    this.paginationElem[this.sliderCurrent].classList.remove('slider__pagination__current');
};

Slider.prototype.checkCount = function () {
    if (this.sliderCurrent > this.slidersCount) {
        this.sliderCurrent = 0;
    }
};

Slider.prototype.pagintionMove = function (e) {
    this.deleteCurrentPagintion();
    this.sliderCurrent = +e.target.getAttribute('data-item');
    this.render();
    clearInterval(this.timerId);
    this.timerId = setInterval(this.next.bind(this), 5000);
    e.preventDefault();
};

Slider.prototype.render = function () {
    this.firstSliderElement.style.marginLeft = -(this.sliderCurrent * 100)  + '%';
    this.paginationElem[this.sliderCurrent].classList.add('slider__pagination__current');
};

var sliderElem = document.getElementsByClassName('slider')[0];

var slider = new Slider(sliderElem);