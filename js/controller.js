// Variable to store your files
let files;

// File Reader used on file upload
var reader = new FileReader();

// Callback to allow start once reader has read a file
reader.onload = function(event){
  $("#start_btn").prop("disabled", false);
};

// Size of physical Memory
const physicalMemory = 4096;

const pageSize = 512;

// Array of commands
let commands = [];

// Program counter used to parse over commands
let programCounter = 0;

// Page Object
function Page(number, type, size){
  this.number = number;
  this.type = type;
  this.size = size;
  console.log("hi");
  $("tr[free='true']").first().children("td").html("hello");
}

// Add events
$('#file_btn').on('change', prepareUpload);

// Starts the program from the uploaded file
$("#start_btn").click(function(){
  console.log("start clicked");
  $("#jumbotron_title").switchClass("col-md-12","col-md-6",1000,"swing");
  $("#memory_table").show();
  $("#memory_table").switchClass("col-md-0","col-md-6",1000,"swing");
  $("#next_btn").fadeIn(1000);
  $("#next_btn").prop("disabled", false);
  console.log(reader.result);
  parseTraceTape(reader.result);
});

$("#next_btn").click(function(){
  console.log(commands[programCounter]);
  new Page(1,"text",512);
  programCounter++;
});

// Grab the files and set them to our variable
function prepareUpload(event){
  console.log(event);
  console.log("here");
  files = event.target.files;
  reader.readAsText(files[0]);
}

function parseTraceTape(traceTape){
  commands = traceTape.split(/\r?\n/);
}