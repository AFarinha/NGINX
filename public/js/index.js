//Primeira página a carregar
$( window ).on( "load", function ( jQuery ) {
    $("#varibleContent").load("hello.html");
} );


$(document).ready(function() {


  $('#hello').on('click', function() {
      //alert("teste");
      $("#varibleContent").load("hello.html");
  });
  	
  $('#li_dashboard').on('click', function() {
  		//alert("teste");
  		$("#varibleContent").load("dashboard.html");
	});

  $('#li_new_host').on('click', function() {
      //alert("teste");
      $("#varibleContent").load("addHost.html");
  });

  $('#li_manage_hosts').on('click', function() {
      //alert("teste");
      $("#varibleContent").load("manageHosts.html");
  });




});
