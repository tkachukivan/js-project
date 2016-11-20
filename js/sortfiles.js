function SortFiles () {
    this.sortForm = document.forms.sort;
    this.previusSort = this.sortForm.querySelector('[id="sort_date"]');
    
    this.sortForm.addEventListener('click', this.sort.bind(this));
}

SortFiles.prototype.sort = function (e) {
    var target = e.target;
    
    if (target.tagName !== 'INPUT') {
        return;
    }
    
    if (target == this.previusSort) {
        return;
    }
    
    this.previusSort = target;
    
    if (target.getAttribute('id') == 'sort_date') {
        this.sortByDate();
    }
    
    if (target.getAttribute('id') == 'sort_size') {
        this.sortBySize();
    }
    
    if (target.getAttribute('id') == 'sort_name') {
        this.sortByName();
    }
    
    if (target.getAttribute('id') == 'sort_type') {
        this.sortByType();
    }
    
    this.clearFileContainer();
    pagination.toPage();
};

SortFiles.prototype.sortByDate = function () {
    filterFiles.filterArray.sort(function (elem1, elem2) {
        return elem1.date - elem2.date;
    });
};

SortFiles.prototype.sortBySize = function () {
    filterFiles.filterArray.sort(function (elem1, elem2) {
        return elem2.size - elem1.size;
    });
};

SortFiles.prototype.sortByName = function () {
    filterFiles.filterArray.sort(function (elem1, elem2) {
        var name1 = elem1.name.toLowerCase();
        var name2 = elem2.name.toLowerCase();
        if (name1 > name2) {
            return -1;
        }
        
        if (name1 < name2) {
            return 1;
        }
    });
};

SortFiles.prototype.sortByType = function () {
    filterFiles.filterArray.sort(function (elem1, elem2) {
        var type1 = elem1.type;
        var type2 = elem2.type;
        
        if (type1 > type2) {
            return 1;
        }
        
        if (type1 < type2) {
            return -1;
        }
        
        if (type1 == type2) {
            return 0;
        }
    });
};

SortFiles.prototype.defaultSort = function () {
    var inputRadio = this.sortForm.querySelectorAll('[type="radio"]');
    
    Array.prototype.forEach.call(inputRadio, function (input) {
        input.checked = false;
    });
    
    inputRadio[0].checked = true;
    this.previusSort = this.sortForm.querySelector('[id="sort_date"]');
};

SortFiles.prototype.clearFileContainer = function () {
    var filesRow = uploadFile.filesContainer.getElementsByClassName('files__row');
    
    filesRow = Array.prototype.slice.call(filesRow, 0);
    filesRow.forEach(function (fileRow) {
        uploadFile.filesContainer.removeChild(fileRow);
    });
};

var sortFiles = new SortFiles();