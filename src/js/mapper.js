var w = 700;
var h = 600;

var projection = d3.geo.mercator()
  .scale([700])
  .translate([300,300])
var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("#viz").insert("svg:svg", "h2")
  .attr("width", w)
  .attr("height", h);

var countries = svg.append("svg:g").attr("id", "countries");

d3.json("/data/world-countries.json", function(collection){
  countries.selectAll("path").data(collection.features)
    .enter().append("svg:path").attr("d", path)
    .on("mouseover", function(){if(!(this.answered || this === window.selected_country)){d3.select(this).style("fill", "#eee")};})
    .on("mouseout", function(){
      if(!(this.answered || this === window.selected_country)){
        d3.select(this).style("fill", "#ccc")};})
    .on("mousedown", selectCountry())
});

function selectCountry(){
  return function(g,i) {
    if(window.selected_country !== this){
      if (window.selected_country && !window.selected_country.answered){
        d3.select(window.selected_country).style("fill", "#ccc");
      }
      window.selected_country = this;
      window.current_answer = g.properties.name
      $("#answer").text(window.current_answer)
      d3.select(this).style("fill", "#05C")
    }
//    $("#guess").focus();
  }
}

// Check whether the current input is the selected country
function checkAnswer(){
  guess = $("#guess")
  country = window.selected_country
  answer = window.current_answer
  if (window.current_answer && !country.answered &&
      guess.val().toLowerCase() === answer.toLowerCase()){
    d3.select(country).style("fill", "green")
    country.answered = true
    $("#correct").append($('<li>').text(answer));
    $("#guess").val("");
  }
}

$(document).ready(function(){
  $("#guess").keyup(function(){
    checkAnswer();
    return false;
  });
});


