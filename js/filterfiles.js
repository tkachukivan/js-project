function FilterFiles() {
    this.searchForm = document.forms.search;
    this.filterBlock = uploadFile.filesBlock.querySelector('.filter');
    var button = this.filterBlock.querySelector('button');
    this.inputRadio = this.filterBlock.querySelectorAll('input');
    
    this.fileList = [];
    uploadFile.getFileList.call(this);
    this.filterArray = this.fileList;
//    keyup because IE8-9 dont normal support input
    this.filterBlock.addEventListener('click', this.filter.bind(this));
    button.addEventListener('click', this.clearFilter.bind(this));
    this.searchForm.addEventListener('keyup', this.search.bind(this));
    this.searchForm.addEventListener('submit', function (e) {e.preventDefault(); });
}

FilterFiles.prototype.filter = function (e) {
    var target = e.target;
    
    var checkedFilter = Array.prototype.filter.call(this.inputRadio, function (file) {
        return file.checked;
    });
    
    if (target.tagName !== 'INPUT') {return; }
    
    this.filterArray = this.fileList;
    
    
    for (var i = 0; i < checkedFilter.length; i++) {
        if (checkedFilter[i].getAttribute('name') == 'by-date') {
            this.filterByDate(checkedFilter[i].getAttribute('data-sort'), checkedFilter[i]);
        }
    
        if (checkedFilter[i].getAttribute('name') == 'by-size') {
            this.filterBySize(checkedFilter[i].getAttribute('data-sort'), checkedFilter[i]);
        }
    
        if (checkedFilter[i].getAttribute('name') == 'by-type') {
            this.filterByType(checkedFilter[i].getAttribute('data-sort'));
        }
    }
    
    sortFiles.clearFileContainer();
    sortFiles.defaultSort();
    pagination.pageNumber = 1;
    pagination.renderPag(this.filterArray);
    pagination.toPage();
};

FilterFiles.prototype.filterByDate = function (filterData, checkedElem) {
    this.filterArray = this.filterArray.filter(function (file) {
        var date = file.date;
        var now = Date.now();
        
        if (filterData == Infinity) {
            return (now - date) > checkedElem.previousElementSibling.previousElementSibling.getAttribute('data-sort') * 3600000;
        }
        
        return (now - date) <= filterData * 3600000;
    });
};

FilterFiles.prototype.filterBySize = function (filterData, checkedElem) {
    this.filterArray = this.filterArray.filter(function (file) {
        var size = file.size;
        
        if (filterData == Infinity) {
            return size > checkedElem.previousElementSibling.previousElementSibling.getAttribute('data-sort') * 1048576;
        }
    
        return size <= filterData * 1048576;
    });
};

FilterFiles.prototype.filterByType = function (filterData) {
    this.filterArray = this.filterArray.filter(function (file) {
        return file.type == filterData;
    });
};

FilterFiles.prototype.search = function (e) {
    var target = e.target;
    var searchReg = new RegExp(target.value, 'i');
    this.filterArray = this.fileList;
    
    this.filterArray = this.filterArray.filter(function (file) {
        var fileName = file.name;
        return searchReg.test(fileName);
    });
    
    sortFiles.clearFileContainer();
    sortFiles.defaultSort();
    pagination.pageNumber = 1;
    pagination.renderPag(this.filterArray);
    pagination.toPage();
};

FilterFiles.prototype.clearFilter = function () {
    var inputRadio = this.filterBlock.querySelectorAll('[type="radio"]');
    Array.prototype.forEach.call(inputRadio, function (input) {
        input.checked = false;
    });
    
    sortFiles.clearFileContainer();
    sortFiles.defaultSort();
    this.filterArray = this.fileList;
    pagination.pageNumber = 1;
    pagination.renderPag(this.filterArray);
    pagination.toPage();
};

var filterFiles = new FilterFiles();