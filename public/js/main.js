$(document).ready(function() {
  $('#createHost').on('click', function() {
    $.ajax({
      type: 'POST',
      url: '/host',
      data: {},
      success: function(data){
        console.log(data);
      },
      dataType: 'json'
    });
  });
});
