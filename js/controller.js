// Variable to store your files
let files;

// File Reader used on file upload
var reader = new FileReader();

// Callback to allow start once reader has read a file
reader.onload = function(event){
  parseTraceTape(reader.result);
};

// Size of physical Memory
const physicalMemory = 4096;

const pageSize = 512;

// Array of commands
let commands = [];

// Program counter used to parse over commands
let programCounter = 0;

// Page Object
function Page(procId, segment, pageNum, segmentLength){
  this.procId = procId;
  this.segment = segment;
  this.pageNum = pageNum;

  // Add frames to memory table
  $("tr[data-free-frame='true']").first().children("td[data-value='procId']").html(this.procId).hide().fadeIn(500);
  $("tr[data-free-frame='true']").first().children("td[data-value='segment']").html(this.segment).hide().fadeIn(500);
  $("tr[data-free-frame='true']").first().children("td[data-value='pageNum']").html(this.pageNum).hide().fadeIn(500);
  $("tr[data-free-frame='true']").first().attr("data-free-frame",this.procId);
}

// Add events
$('#file_btn').on('change', prepareUpload);

// Reload the page to restart
$("#restart_btn").click(function(){location.reload();});

$("#next_btn").click(function(){
  $(this).text("Next");

  const command = commands[programCounter];
  const tokens = command.split(" "); 
  if (tokens.length < 2){
    $("#next_btn").prop("disabled", true);
    
  }else{

    if (tokens[1].toLowerCase() == "halt"){
     $("tr[data-free-frame=" + tokens[0] + "]").children("td[data-value]").html("");
     $("tr[data-free-frame=" + tokens[0] + "]").attr("data-free-frame","true");

      $("div[data-process-number=" + tokens[0] + "]").fadeOut(500,function(){$(this).remove();});
    }else{
      var i = 0;
      var textCount = Math.ceil(tokens[1]/pageSize);
      var dataCount = Math.ceil(tokens[2]/pageSize);

      // Built Process Card
      var strVar="";
      strVar += "        <div class=\"col-lg-4 col-md-6 mb-4\" data-process-number=\"" + tokens[0] + "\">";
      strVar += "          <div class=\"card\">";
      strVar += "            <div class=\"card-body\">";
      strVar += "              <h4 class=\"card-title\">Process ID: <span>" + tokens[0] + "<\/span><\/h4>";
      strVar += "              <h4><small class=\"segment-type-" + tokens[0] + "\">Text<\/small><\/h4>";
      strVar += "              <table class=\"table table-condensed table-striped \">";
      strVar += "                <thead>";
      strVar += "                  <tr>";
      strVar += "                    <th scope=\"col\">Page<\/th>";
      strVar += "                    <th scope=\"col\">Frame<\/th>";
      strVar += "                    <th scope=\"col\">Length<\/th>";
      strVar += "                  <\/tr>";
      strVar += "                <\/thead>";
      strVar += "                <tbody>";


      while (i < textCount){
        let frameNum = $("tr[data-free-frame='true']").first().children("td[data-frame-number]").attr("data-frame-number");
        strVar += "                  <tr class='segment-type-text-" + tokens[0] + "'>";
        strVar += "                    <td data-value=\"pageNum\">" + i + "<\/td>";
        strVar += "                    <td data-value=\"frameNum\">" + frameNum + "<\/td>";
        if((i + 1) == textCount){
          
          new Page(tokens[0],"text", i, tokens[1] % pageSize);
        strVar += "                    <td data-value=\"segLength\">" + (512 - tokens[1] % pageSize) + "<\/td>";
        }else{
          new Page(tokens[0],"text", i, pageSize);
        strVar += "                    <td data-value=\"segLength\">512<\/td>";
        }
        strVar += "                  <\/tr>";
        i++; 
      }
      i = 0;
      while (i < dataCount){
        let frameNum = $("tr[data-free-frame='true']").first().children("td[data-frame-number]").attr("data-frame-number");
        strVar += "                  <tr class='segment-type-data-" + tokens[0] + "' style='display:none;'>";
        strVar += "                    <td data-value=\"pageNum\">" + i + "<\/td>";
        strVar += "                    <td data-value=\"frameNum\">" + frameNum + "<\/td>";
        if((i+1) == dataCount){
          new Page(tokens[0],"data", i, tokens[2] % pageSize);
          strVar += "                    <td data-value=\"segLength\">" + (512 - tokens[1] % pageSize) + "<\/td>";
        }else{
          new Page(tokens[0],"data", i, pageSize);
          strVar += "                    <td data-value=\"segLength\">512<\/td>";
        }
        strVar += "                  <\/tr>";
        i++; 
      }

      strVar += "                <\/tbody>"; 
      strVar += "              <\/table>";
      strVar += "            <\/div>";
      strVar += "            <div class=\"card-footer\">";
      strVar += "              <button class=\"btn btn-primary\" id=\"proc" + tokens[0] + "btn\" data-shown-segment-type=\"text\">Show Data Segments<\/button>";
      strVar += "            <\/div>";
      strVar += "          <\/div>";
      strVar += "        <\/div>";
    }

    $("#card-container").append($(strVar).hide().fadeIn(500)); 



    $("#proc" + tokens[0] + "btn").click(function(){
      const btn = $(this);
      if($(btn).attr("data-shown-segment-type") == "text"){
        $(btn).attr("data-shown-segment-type","data");
        $(".segment-type-" + tokens[0]).text("Data");
        $(btn).text("Show Text Segments");
      }else{
        $(btn).attr("data-shown-segment-type","text");
        $(".segment-type-" + tokens[0]).text("Text");
        $(btn).text("Show Data Segments");
      }
      $(".segment-type-data-" + tokens[0]).toggle();  
      $(".segment-type-text-" + tokens[0]).toggle();
    });

    programCounter++;
  }
});

// Grab the files and set them to our variable
function prepareUpload(event){

  files = event.target.files;
  reader.readAsText(files[0]);

  $("#jumbotron_title").switchClass("col-md-12","col-md-6",1000,"swing");
  $("#memory_table").show();
  $("#memory_table").switchClass("col-md-0","col-md-6",1000,"swing");
  $("#next_btn").fadeIn(1000);
  $("#restart_btn").fadeIn(1000);
  $("#next_btn").prop("disabled", false);
  $("#file_btn").prop("disabled", true);

}

function parseTraceTape(traceTape){
  commands = traceTape.split(/\r?\n/);
}
