var dropForm = $('#upload_form');
var uploadBtn = $('#upload_button');
var droppedFiles = false;

uploadBtn.on('click', function(e) {
  e.preventDefault();
  $('#file').click();
});

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
      success: function(data) {
        console.log('upload successful\n' + data);
        $('p.'+ data).css('display','block');
      }
    })
    console.log(formData.getAll('files[]'));
  }
})

dropForm.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
	e.preventDefault();
	e.stopPropagation();
})
.on('dragover dragenter', function() {
	dropForm.addClass('is-active');
})
.on('dragleave dragend drop', function() {
	dropForm.removeClass('is-active');
})
.on('drop', function(e) {
	droppedFiles = e.originalEvent.dataTransfer.files;
	console.log(droppedFiles);
	dropForm.trigger('submit');
});