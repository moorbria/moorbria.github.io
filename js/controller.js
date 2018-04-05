$("#start_btn").click(function(){
  console.log("start clicked");
  $("#jumbotron_title").switchClass("col-md-12","col-md-6",1000,"swing");
  $("#memory_table").show();
  $("#memory_table").switchClass("col-md-0","col-md-6",1000,"swing");
});
