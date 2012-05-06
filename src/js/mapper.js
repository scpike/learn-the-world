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

d3.json("../src/data/world-countries.json", function(collection){
  countries.selectAll("path").data(collection.features)
    .enter().append("svg:path").attr("d", path)
    .attr("data-i", function(d, i) {
      return i * 21;  //Bar width of 20 plus 1 for padding
    })
    .attr("data-name", function(d, i) {
      return d.properties.name;  //Bar width of 20 plus 1 for padding
    })
    .attr("data-initials", function(d, i) {
      return d.id;  //Bar width of 20 plus 1 for padding
    })
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

// Check whether the current input is the selected country
function checkAgainstAll(){
  guess = $("#guess").val();
  country = d3.selectAll("path").filter(function(i,k){
    if(i.properties.name.toLowerCase() === guess.toLowerCase()){
      return this;
    } else {
      return null
    }
  })
  if (country[0].length){
    country = country[0][0]
    if (country.answered){
      country.answered = true
      d3.select(country).transition()
        .style("fill", "lightblue")
        .each("end", colorGreen)
    } else {
      d3.select(country).style("fill", "green")
      country.answered = true
      $("#correct").append($('<li>').text(country.getAttribute("data-name")));
    }
    $("#guess").val("");
  }
}

function colorGreen(){
  d3.select(this).transition()
    .style("fill", "green")
}


$("#guess").focus();
$("#guess").keyup(function(){
  checkAgainstAll();
  return false;
});

// Do we support SVG?
if (!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")){
  $("#browser-warning").show();
}
