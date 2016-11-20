document.addEventListener('DOMContentLoaded', function() {
    window.radioInputsView = new RadioInputsView();
});

function RadioInputsView() {
    this.filesBlock = document.getElementById('files');
    
    this.currentFilterDateInput = null;
    this.currentFilterSizeInput = null;
    this.currentFilterTypeInput = null;
    
    this.currentSortInput = this.filesBlock.querySelector('.sort [for="sort_date"]');
    this.currentSortInput.classList.add('checked');
    
    this.filesBlock.addEventListener('click', this.render.bind(this));
    this.filesBlock.addEventListener('click', this.clearFilter.bind(this));
}

RadioInputsView.prototype.render = function (e) {
    var target = e.target;
    
    if (target.tagName != 'INPUT') {
        return;
    }
    
    if (target.getAttribute('type') != 'radio') {
        return;
    }
    
    var label = target.nextElementSibling
    if (target.getAttribute('name') == 'by-date') {
        if (this.currentFilterDateInput) {
            this.currentFilterDateInput.classList.remove('checked');
        }
        label.classList.add('checked');
        this.currentFilterDateInput = label;
    }
    
    if (target.getAttribute('name') == 'by-size') {
        if (this.currentFilterSizeInput) {
            this.currentFilterSizeInput.classList.remove('checked');
        }
        label.classList.add('checked');
        this.currentFilterSizeInput = label;
    }
    
    if (target.getAttribute('name') == 'by-type') {
        if (this.currentFilterTypeInput) {
            this.currentFilterTypeInput.classList.remove('checked');
        }
        label.classList.add('checked');
        this.currentFilterTypeInput = label;
    }
    
    if (target.getAttribute('name') == 'sort_file') {
        if (this.currentSortInput) {
            this.currentSortInput.classList.remove('checked');
        }
        label.classList.add('checked');
        this.currentSortInput = label;
    }
}

RadioInputsView.prototype.clearFilter = function(e) {
    var target = e.target;
    
    if (target.tagName != 'BUTTON') {
        return;
    }
    
    if (target.innerHTML != 'clear filter') {
        return;
    }
    
    
    if (this.currentFilterDateInput) {
        this.currentFilterDateInput.classList.remove('checked');
        this.currentFilterDateInput = null;
    }
    
    if (this.currentFilterSizeInput) {
        this.currentFilterSizeInput.classList.remove('checked');
        this.currentFilterSizeInput = null;
    }
    
    if (this.currentFilterTypeInput) {
        this.currentFilterTypeInput.classList.remove('checked');
        this.currentFilterTypeInput = null;
    }
    
    if (this.currentSortInput != this.filesBlock.querySelector('.sort [for="sort_date"]')) {
        this.currentSortInput.classList.remove('checked');
        this.currentSortInput = this.filesBlock.querySelector('.sort [for="sort_date"]');
        this.currentSortInput.classList.add('checked');
    }
}

