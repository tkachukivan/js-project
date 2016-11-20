function UploadFile(block) {
    this.filesBlock = block;
    this.uploadForm = document.forms.upload;
    var fileInput = this.uploadForm.querySelector('[type="file"]');
    this.fileInfo = {};
    this.fileList = [];
    
    this.filesContainer = this.filesBlock.querySelector('.files__container');
    this.fileTmpl = this.filesBlock.querySelector('.files__tmpl');
    
    this.fileNameField = this.uploadForm.querySelector('.file_name');
    
    window.ls.initField('files');
    this.getFileList();
    this.renderFromArray(this.fileList);
    pagination.renderPag(this.fileList);
    
    fileInput.addEventListener('change', this.getFileInfo.bind(this));
    this.uploadForm.addEventListener('submit', this.upload.bind(this));
}

UploadFile.prototype.upload = function (e) {
    if (this.fileInfo.name == undefined) {
        this.notChoseFile();
        e.preventDefault();
        return;
    }
    
    var check = this.checkFileType(this.fileInfo.type);
    if (!check) {
        this.wrongFileType();
        e.preventDefault();
        return;
    }
    
    var checkSame = this.checkSameFile();
    if (!checkSame) {
        this.sameFile();
        e.preventDefault();
        return;
    }
    
    this.fileInfo.date = Date.now();
    this.setFileList();
    this.getFileList();
    filterFiles.fileList = this.fileList;
    filterFiles.filterArray = this.fileList;
    pagination.renderPag(this.fileList);
    pagination.toPage();
    
    this.notChoseFile();
    this.fileInfo = {};
    e.preventDefault();
};

UploadFile.prototype.renderFileRow = function () {
    var newFileRow = this.fileTmpl.cloneNode(true);
    newFileRow.classList.remove('files__tmpl');
    var fileType = this.getClassOfType(this.fileInfo.type);
    newFileRow.classList.add(fileType);
    this.renderFileName(newFileRow);
    this.renderFileSize(newFileRow);
    this.renderDownloadDate(newFileRow);
    this.filesContainer.insertBefore(newFileRow, this.filesContainer.firstChild);
};

UploadFile.prototype.getClassOfType = function (type) {
    var regexpAudio = /(audio)/;
    var regexpVideo = /(video)/;
    if (regexpAudio.test(type)) {
        this.fileInfo.type = 'files__audio';
        return 'files__audio';
    }
    if (regexpVideo.test(type)) {
        this.fileInfo.type = 'files__video';
        return 'files__video';
    }
    
    this.fileInfo.type = 'files__text';
    return 'files__text';
};

UploadFile.prototype.renderFileName = function (elem) {
    var fileNameElem = elem.querySelector('.files__name');
    fileNameElem.innerHTML = this.fileInfo.name;
};

UploadFile.prototype.renderFileSize = function (elem) {
    var fileSizeElem = elem.querySelector('.files__size');
    fileSizeElem.innerHTML = (this.fileInfo.size / 1048576).toFixed(3) + ' Mb';
};

UploadFile.prototype.renderDownloadDate = function (elem) {
    var fileDateElem = elem.querySelector('.files__date');
    var now = Date.now();
    
    var options = {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric'
    };
    
    var diff = Math.floor((now - this.fileInfo.date) / 1000);
    
    if (diff < 60) {
        fileDateElem.innerHTML = 'recently';
        return;
    }
    
    if (diff < 3600) {
        fileDateElem.innerHTML = Math.floor(diff / 60) + ' min ago';
        return;
    }
    
    if (diff < 86400) {
        fileDateElem.innerHTML = Math.floor(diff / 3600) + ' hour ago';
        return;
    }
    
    var date = new Date(this.fileInfo.date);
    fileDateElem.innerHTML = date.toLocaleString('ru', options).replace(',', '');
};

UploadFile.prototype.setFileList = function () {
    this.fileList.push(this.fileInfo);
    window.ls.updateField('files', this.fileList);
};

UploadFile.prototype.getFileList = function () {
    this.fileList = window.ls.getFieldData('files');
};

UploadFile.prototype.renderFromArray = function (fileArray, from, to) {
    if (from == undefined && to == undefined) {
        from = fileArray.length - pagination.quantytiElemenst;
        to = fileArray.length;
    }
    
    if (fileArray.length <= pagination.quantytiElemenst) {
        from = 0;
        to = fileArray.length;
    }
    
    for (var i = from; i < to; i++) {
        this.fileInfo = fileArray[i];
        this.renderFileRow();
    }
    
    this.fileInfo = {};
};

UploadFile.prototype.checkSameFile = function () {
    for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileInfo.name == this.fileList[i].name) {
            return false;
        }
    }
    return true;
};

UploadFile.prototype.wrongFileType = function () {
    this.fileNameField.innerHTML = 'Change file before upload. We don`t support this file type.';
};

UploadFile.prototype.notChoseFile = function () {
    this.fileNameField.innerHTML = 'No file chosen';
};

UploadFile.prototype.sameFile = function () {
    this.fileNameField.innerHTML = 'File with this name was downloaded';
};

UploadFile.prototype.renderChooseFileName = function () {
    var check = this.checkFileType(this.fileInfo.type);
    if (!check) {
        this.fileNameField.innerHTML = 'We don`t support this file type.';
        return;
    }
    this.fileNameField.innerHTML = this.fileInfo.name;
};

UploadFile.prototype.getFileInfo = function (e) {
    if (!e.target.files) {  // IF IE less 9
        this.getFileInfoForIE(e.target.value);
        this.renderChooseFileName();
        return;
    }
    
    var files = e.target.files[0]; 
    
    for (var inf in files) {
        this.fileInfo[inf] = files[inf];
    }
    this.renderChooseFileName();
};

UploadFile.prototype.checkFileType = function (type) {
    var regexpAudio = /(audio)/,
        regexpVideo = /(video)/,
        regexpPdf = /(pdf)/,
        regexpWord = /(msword)/,
        regexpText = /(plain)/,
        regexpWordNew = /(officedocument)/,
        regexpOpenDoc = /(opendocument)/;
    
    if (regexpAudio.test(type)) {return true; }
    if (regexpVideo.test(type)) {return true; }
    if (regexpPdf.test(type)) {return true; }
    if (regexpWord.test(type)) {return true; }
    if (regexpText.test(type)) {return true; }
    if (regexpWordNew.test(type)) {return true; }
    if (regexpOpenDoc.test(type)) {return true; }
    
    return false;
};

UploadFile.prototype.getFileInfoForIE = function (name) {
    this.fileInfo.name = this.getFileNameIE(name);
    this.fileInfo.type = this.getFileTypeIE(name);
    this.fileInfo.size = 0;
}

UploadFile.prototype.getFileNameIE = function(name) {
    var name = name.split('\\');
    return name[name.length - 1];
}

UploadFile.prototype.getFileTypeIE = function(name) {
    var audioReg = /\.(mp3)?(ogg)?(aac)?(wma)?(wav)?(midi)?(mod)?(mt9)?(lav)?(cda)?(asf)?$/i;
    var videoReg = /\.(mp4)?(3gp)?(avi)?(flv)?(mkv)?(mov)?(divx)?$/i;
    var textReg = /\.(pdf)?(txt)?(rtf)?(odt)?(sxw)?(wpd)?(doc)?(docx)?(docm)?(djv)?(fb2)?(xls)?(xlsx)?(xlsm)?(ods)?(wpd)?(pptx)?(pptm)?(ppt)?$/i;
    
    if (audioReg.test(name)) {
        return 'audio';
    }
    
    if (videoReg.test(name)) {
        return 'video';
    }
    
    if (textReg.test(name)) {
        return 'plain';
    }
}

var filesBlock = document.getElementById('files');

var uploadFile = new UploadFile(filesBlock);

function DeleteFile() {
    this.filesContainer = uploadFile.filesContainer;
    this.fileList = uploadFile.fileList;
    
    this.filesContainer.addEventListener('click', this.deleteFile.bind(this));
}

DeleteFile.prototype.deleteFile = function (e) {
    var target = e.target;
    if (!target.classList.contains('files__delete')) {
        return;
    }
    
    var filesRow = target;
    while (!filesRow.classList.contains('files__row')) {
        filesRow = filesRow.parentElement;
    }
    
    var fileName = filesRow.querySelector('.files__name').innerHTML;
    
    this.filesContainer.removeChild(filesRow);
    this.removeFromLs(fileName);
    filterFiles.filterArray = this.fileList;
    if (this.filesContainer.children.length == 0) {
        pagination.pageNumber = pagination.pageNumber == 1 ? 1 : pagination.pageNumber - 1;
        pagination.renderPag(this.fileList);
        
        pagination.toPage();
    }
    pagination.renderPag(this.fileList);
    pagination.toPage();
};

DeleteFile.prototype.removeFromLs = function (name) {
    var self = this;
    this.fileList.forEach(function (file, index) {
        if (file.name == name) {
            self.fileList.splice(index, 1);
        }
    });
    
    window.ls.updateField('files', this.fileList);
};

var deleteFile = new DeleteFile();