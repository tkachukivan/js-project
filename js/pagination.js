function Pagination(block) {
    this.filesContainer = block.querySelector('.files__container');
    this.pagination = block.querySelector('.files__pagination ul');
    this.quantytiElemenst = 7;
    this.pages;
    this.pageQuantyti;
    this.lastPageElements;
    this.pageNumber = 1;
    this.currentPage;
    
    this.pagination.addEventListener('click', this.toPageClick.bind(this));
}

Pagination.prototype.renderPag = function(array) {
    this.pageQuantyti = Math.ceil(array.length / this.quantytiElemenst);
    var li = '';
    if (this.pageQuantyti == 0) {
        this.pageQuantyti = 1;
    }
    
    var separator = '<li><a href="#" class="separator">' + '...' + '</a></li>';
    var firstPageNumber = '<li><a href="#">' + 1 + '</a></li>';
    var lastPageNumber = '<li><a href="#">' + this.pageQuantyti + '</a></li>';
    
    var renderFrom = this.pageNumber - 2 < 1 ? 1 : this.pageNumber - 2;
    var renderTo = this.pageNumber + 2;
    
    if (renderTo > this.pageQuantyti) {
        renderTo = this.pageQuantyti;
        renderFrom = renderTo - 4;
    }
    
    if (renderTo < 5) {
        renderTo = 5;
    }
    
    if (this.pageQuantyti <= 6) {
        renderFrom = 1;
        renderTo = this.pageQuantyti;
    }
    
    if (renderFrom == 2) {
        li  = firstPageNumber;
    }
    
    if (renderFrom > 2) {
        li  = firstPageNumber + separator;
    }
    
    for (var i = renderFrom; i <= renderTo; i++) {
        li =  li + '<li><a href="#">' + i + '</a></li>';
    }
    
    if (this.pageQuantyti - renderTo == 1) {
        li = li + lastPageNumber;
    }
    
    if (this.pageQuantyti - renderTo > 1) {
        li = li + separator + lastPageNumber;
    }
    
    this.pagination.innerHTML = li;
    this.pages = this.pagination.querySelectorAll('li > a');
    this.currentPage = this.pages[0];
    this.currentPage.classList.add('active');
};

Pagination.prototype.toPageClick = function (e) {
    var target = e.target;
    if (target.tagName !== 'A') {
        e.preventDefault();
        return;
    }
    
    if (target.classList.contains('separator')) {
        e.preventDefault();
        return;
    }
    
    this.pageNumber = parseInt(target.innerHTML, 10);
    this.toPage();
    
    e.preventDefault();
};

Pagination.prototype.toPage = function () {
    var filterQuantyti = filterFiles.filterArray.length;
    this.lastPageElements = filterQuantyti % this.quantytiElemenst == 0 ? this.quantytiElemenst : filterQuantyti % this.quantytiElemenst;
    if (this.pageNumber == this.pageQuantyti) {
        sortFiles.clearFileContainer();
        uploadFile.renderFromArray(filterFiles.filterArray,  0, this.lastPageElements);
        this.renderPag(filterFiles.filterArray);
        this.changeCurrentPage();
        return;
    }
    
    var from = filterQuantyti - (this.pageNumber * this.quantytiElemenst);
    var to = from + this.quantytiElemenst;
    
    sortFiles.clearFileContainer();
    uploadFile.renderFromArray(filterFiles.filterArray, from, to);
    this.renderPag(filterFiles.filterArray);
    this.changeCurrentPage();
};

Pagination.prototype.changeCurrentPage = function () {
    for (var i = 0; i < this.pages.length; i++) {
        if (parseInt(this.pages[i].innerHTML, 10) == this.pageNumber) {
            this.currentPage.classList.remove('active');
            this.currentPage = this.pages[i];
            this.currentPage.classList.add('active');
        }
    }
}

var filesBlock = document.getElementById('files');
var pagination = new Pagination(filesBlock);