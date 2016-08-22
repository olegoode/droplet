var dropForm = $('#upload_form');
var dropZone = $('#dropzone');
var uploadBtn = $('#upload_button');
var droppedFiles = false;

dropForm.on('submit', function(e) {
  e.preventDefault();
  var formData = new FormData();
  if (droppedFiles) {
    for (var i = 0; i < droppedFiles.length; i++) {
      console.log(droppedFiles[i]);
      var file = droppedFiles[i];
      formData.append('files[]', file, file.name);
    }
    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      xhr: function() {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function(e) {
          if (e.lengthComputable) {
            var percentComplete = e.loaded / e.total;
            percentComplete = parseInt(percentComplete * 100);
            $('.progress-fill').width(percentComplete + '%');
          }
        }, false);
        return xhr;
      },
      success: function(data) {
        console.log('upload successful\n' + data);
        $('div.'+ data).addClass('show');
      }      
    })
    console.log(formData.getAll('files[]'));
  }
})

dropForm.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
	e.preventDefault();
	e.stopPropagation();
})
.on('dragenter', function(e) {
  console.log(e.originalEvent.dataTransfer.types)
})
.on('dragbetterenter', function(e) {
	dropForm.addClass('is-active');
  $('.droplet_status > div').removeClass('show');
  $('.progress-fill').width('0%');
})
.on('dragbetterleave', function() {
	dropForm.removeClass('is-active');
})
.on('drop', function(e) {
  console.log(e.originalEvent.dataTransfer.items[0]);
	droppedFiles = e.originalEvent.dataTransfer.files;
	console.log(droppedFiles);
	dropForm.trigger('submit');
});