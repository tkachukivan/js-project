// PLACEHOLDER FOR IE!!!!

document.addEventListener('DOMContentLoaded', placeholder);

function placeholder() {
    var forms = document.getElementsByClassName('form')[0];
    var labelForms = forms.querySelectorAll('label');
    var inputForms = forms.querySelectorAll('input');
    for (var i = 0; i < inputForms.length; i++) {
        var span = document.createElement('span');
        span.innerHTML = inputForms[i].getAttribute('placeholder');
        span.classList.add('placeholder');
        labelForms[i].appendChild(span);
    }
    
    forms.addEventListener('keyup', removePlaceholder);
    forms.addEventListener('blur', addPlaceholder, true);
    forms.addEventListener('submit', changePlaceholder);
    function removePlaceholder(e) {
        var target = e.target;
        if (target.tagName != 'INPUT') {
            return;
        }
        
        var label = target.parentElement;
        var span = label.querySelector('span');
        if (!span) {
            return
        }
        label.removeChild(span);
    }
    
    function addPlaceholder(e) {
        var target = e.target;
        if (target.tagName != 'INPUT') {
            return;
        }
        
        if (target.value == '') {
            var label = target.parentElement;
            span.innerHTML = target.getAttribute('placeholder');
            label.appendChild(span);
        }
    }
    
    function changePlaceholder() {
        var forms = document.getElementsByClassName('form')[0];
        var labelForms = forms.querySelectorAll('label');
        var inputForms = forms.querySelectorAll('input');
        
        for (var i = 0; i < inputForms.length; i++) {
            var span = document.createElement('span');
            span.innerHTML = inputForms[i].getAttribute('placeholder');
            span.classList.add('placeholder');
            if (labelForms[i].lastChild.tagName == 'SPAN'){
                labelForms[i].removeChild(labelForms[i].lastChild)
            }
            
            labelForms[i].appendChild(span);
        }
    }
}