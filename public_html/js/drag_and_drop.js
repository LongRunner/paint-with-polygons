
var holder = document.getElementById('holder'),
        tests = {
            filereader: typeof FileReader != 'undefined',
            dnd: 'draggable' in document.createElement('span'),
            formdata: !!window.FormData,
            progress: "upload" in new XMLHttpRequest
        },
support = {
    filereader: document.getElementById('filereader'),
    formdata: document.getElementById('formdata'),
    progress: document.getElementById('progress')
},
acceptedTypes = {
    'image/png': true,
    'image/jpeg': true,
    'image/gif': true
},
progress = document.getElementById('uploadprogress'),
        fileupload = document.getElementById('upload');

"filereader formdata progress".split(' ').forEach(function(api) {
    if (tests[api] === false) {
        support[api].className = 'fail';
    } else {
        // FFS. I could have done el.hidden = true, but IE doesn't support
        // hidden, so I tried to create a polyfill that would extend the
        // Element.prototype, but then IE10 doesn't even give me access
        // to the Element object. Brilliant.
        support[api].className = 'hidden';
    }
});

var image;
function previewfile(file) {
    if (tests.filereader === true && acceptedTypes[file.type] === true) {
        var reader = new FileReader();
        reader.onload = function(event) {
            image = new Image();
            image.src = event.target.result;
            image.id = "drawme";
            
            //image.width = 250; // a fake resize
            holder.appendChild(image);
            init_canvas(image)
        };

        reader.readAsDataURL(file);
    } else {
        holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size / 1024 | 0) + 'K' : '');
        console.log(file);
    }
}

function readfiles(files) {
    //debugger;
    var formData = tests.formdata ? new FormData() : null;
    for (var i = 0; i < files.length; i++) {
        if (tests.formdata)
            formData.append('file', files[i]);
        previewfile(files[i]);
    }
}

function init_canvas(im) {
    best_so_far = document.getElementById('test');
    best_so_far_ctx = test.getContext('2d');
    
    IWIDTH = im.width;
    IHEIGHT = im.height;
    
    best_so_far.setAttribute('width', IWIDTH);
    best_so_far.setAttribute('height', IHEIGHT);
    
    //user_input_pic.setAttribute('width', IWIDTH);
    //user_input_pic.setAttribute('height', IHEIGHT);
    
    best_so_far_ctx.drawImage(im, 0, 0);
    real_img_data = best_so_far_ctx.getImageData(0, 0, IWIDTH, IHEIGHT).data;

    best_so_far_ctx.fillStyle = "white";
    best_so_far_ctx.fillRect(0, 0, IWIDTH, IHEIGHT);
    
    display_el = document.getElementById('output');
    display_ctx = display_el.getContext('2d');

    testWidth = IWIDTH;
    testHeight = IHEIGHT;
    
    display_el.setAttribute('width', IWIDTH);
    display_el.setAttribute('height', IHEIGHT);

}


if (tests.dnd) {
    holder.ondragover = function() {
        this.className = 'hover';
        return false;
    };
    holder.ondragend = function() {
        this.className = '';
        return false;
    };
    holder.ondrop = function(e) {
        this.className = '';
        e.preventDefault();
        readfiles(e.dataTransfer.files);
        //init_canvas();
    }
} else {
    fileupload.className = 'hidden';
    fileupload.querySelector('input').onchange = function() {
        readfiles(this.files);
    };
}
