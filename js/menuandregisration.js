function ShowHideMenu() {
    this.dropdown = document.getElementsByClassName('dropdown')[0].firstChild;
    this.dropdownMenu = document.getElementsByClassName('dropdown__menu')[0];
    document.addEventListener('click', this.show.bind(this));
}

ShowHideMenu.prototype.show = function (e) {
    var target = e.target;
    
    if (target !== this.dropdown) {
        this.dropdownMenu.classList.remove('show-menu');
        return;
    }
    
    this.render();
    e.preventDefault();
};

ShowHideMenu.prototype.render = function () {
    this.dropdownMenu.classList.toggle('show-menu');
};

var showMenu = new ShowHideMenu();

function ShowForm(options) {
    this.elemLogin = options.elemLogin;
    this.elemSingUp = options.elemSingUp;
    var header = document.querySelector('header');
    
    header.addEventListener('click', this.show.bind(this));
}

ShowForm.prototype.show = function (e) {
    var target = e.target;
    if (target.getAttribute('id') !== 'login' &&
        target.getAttribute('id') !== 'singUp') {
        
        this.elemSingUp.classList.remove('active');
        this.elemLogin.classList.remove('active');
        return;
    }
    
    this.render(target.getAttribute('id'));
    e.preventDefault();
};

ShowForm.prototype.render = function (attr) {
    if (attr == 'login') {
        this.elemSingUp.classList.remove('active');
        this.elemLogin.classList.toggle('active');
        return;
    }
    
    this.elemSingUp.classList.toggle('active');
    this.elemLogin.classList.remove('active');
};

var loginForm = document.forms.login;
var singUpForm = document.forms.singUp;
var successful = document.querySelector('.form p');

var showForm = new ShowForm({elemLogin: loginForm,
                              elemSingUp: singUpForm});

function SingUp(form, success) {
    this.singUpForm = form;
    this.users = [];
    this.userInfo = {};
    this.success = success;
    
    window.ls.initField('users');
    this.getUsers();
    
    this.singUpForm.addEventListener('submit', this.renderSingUp.bind(this));
    this.singUpForm.addEventListener('click', this.removeClassError.bind(this));
}

SingUp.prototype.renderSingUp = function (e) {
    if (this.checkSingUp()) {
        this.singUpForm.classList.remove('active');
        this.success.classList.add('active');
        var _self = this;
        setTimeout(function () {
            _self.success.classList.remove('active');
        }, 2000);
        
        this.setUsers();
        this.getUsers();
        this.userInfo = {};
    }
    
    e.preventDefault();
};

SingUp.prototype.checkSingUp = function () {
    var elems = this.singUpForm.elements;
    var name = elems.name,
        email = elems.email,
        password = elems.password,
        password2 = elems.password2;
    
    var errorCount = 0;
    
    var nameReg = /^[\w]{2,10}$/;
    var emailReg = /^[\w.+-]{3,30}\@[a-z]{2,10}\.[a-z]{1,5}$/;
    var passwordReg = /^[\w\,.\/\?\>\<\:\;\|\"\'\!\@\#\$\%\^)(\{\}[\]]{6,}$/;
    
    if (!this.checkSame(email.value)) {
        errorCount++;
        this.errorRender(email, 'EMAIL REGISTRED');
    }
    
    if (!nameReg.test(name.value)) {
        errorCount++;
        this.errorRender(name, 'WRONG NAME');
    }
    
    if (!emailReg.test(email.value)) {
        errorCount++;
        this.errorRender(email, 'WRONG EMAIL');
    }
    
    if (!passwordReg.test(password.value)) {
        errorCount++;
        this.errorRender(password, 'SHORT PASSWORD');
    } else if (password.value !== password2.value) {
        errorCount++;
        this.errorRender(password2, 'NOT THE SAME');
    }
    
    if (errorCount !== 0) {
        return false;
    }
    
    this.userInfo.name = name.value;
    this.userInfo.email = email.value;
    this.userInfo.password = password.value;
    
    name.value = '';
    email.value = '';
    password.value = '';
    password2.value = '';
    return true;
};

SingUp.prototype.errorRender = function (elem, message) {
    elem.setAttribute('placeholder', message);
    elem.value = '';
    elem.classList.add('error');
};

SingUp.prototype.checkSame = function (email) {
    for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].email == email) {
            return false;
        }
    }
    
    return true;
};

SingUp.prototype.removeClassError = function (e) {
    var target = e.target;
    if (target.tagName !== 'INPUT') {return; }
    target.classList.remove('error');
};

SingUp.prototype.getUsers = function () {
    this.users = window.ls.getFieldData('users');
};

SingUp.prototype.setUsers = function () {
    this.users.push(this.userInfo);
    window.ls.updateField('users', this.users);
};

var singUp = new SingUp(singUpForm, successful);

function Login(loginForm, header) {
    this.loginForm = loginForm;
    this.loginMenuElem = header.querySelector('#login');
    this.singUpMenuElem = header.querySelector('#singUp');
    this.userName = '';
    
    this.loginForm.addEventListener('submit', this.loginUser.bind(this));
    this.singUpMenuElem.addEventListener('click', this.exit.bind(this));
}

Login.prototype.loginUser = function (e) {
    if (this.checkLogin()) {
        this.renderLogin();
    }
    
    e.preventDefault();
};

Login.prototype.checkLogin = function () {
    var email = this.loginForm.elements.email;
    var password = this.loginForm.elements.password;
    var statusLogin;
    
    for (var i = 0; i < singUp.users.length; i++) {
        if (singUp.users[i].email == email.value) {
            statusLogin = singUp.users[i].password == password.value;
            this.userName = singUp.users[i].name;
            break;
        }
    }
    
    if (!statusLogin) {
        singUp.errorRender(email, 'WRONG EMAIL');
        singUp.errorRender(password, 'WRONG PASSWORD');
        this.userName = '';
        return statusLogin;
    }
    
    email.value = '';
    password.value = '';
    
    return statusLogin;
};

Login.prototype.renderLogin = function () {
    this.loginMenuElem.innerHTML = this.userName;
    this.loginMenuElem.setAttribute('id', 'name');
    
    this.singUpMenuElem.innerHTML = 'exit';
    this.singUpMenuElem.setAttribute('id', 'exit');
    
    this.loginForm.classList.remove('active');
};

Login.prototype.exit = function (e) {
    var target = e.target;
    if (target.getAttribute('id') !== 'exit') {
        return;
    }
    
    this.loginMenuElem.innerHTML = 'login';
    this.loginMenuElem.setAttribute('id', 'login');
    
    this.singUpMenuElem.innerHTML = 'singup';
    this.singUpMenuElem.setAttribute('id', 'singUp');
    
    e.preventDefault();
};

var header = document.querySelector('header');

var login = new Login(loginForm, header);