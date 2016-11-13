var width = 1000;
var height = 950;
var textHeight = 78;

var totalCrimeData = {};
var typeCrimeData = {"Assault": 0, 
                     "Break and Enter": 0,
                     "Homicide": 0,
                     "Robbery": 0,
                     "Sexual Assaults": 0,
                     "Theft From Vehicle": 0,
                     "Theft Of Vehicle": 0,
                     "Theft Over $5000": 0
                    };

var projection = d3.geoMercator()
					.scale(100000)
					.center([-113.48, 53.557])
					.translate([width/2, height/2]);

var path = d3.geoPath()
			.projection(projection);

var svg = d3.select("div")
			.append("svg")
			.attr("width", width)
			.attr("height", height)

d3.select("svg").append("text")
	.attr("id", "title")
	.attr("x", 5)
	.attr("y", 50)
	.style("font-size", "36px")
	.text("Heat Map of Crimes in Edmonton");

d3.select("svg").append("text")
  .attr("id", "title1")
  .attr("x", 295)
  .attr("y", textHeight)
  .style("font-size", "20px")
  .text("January 2009 to June 2016");
			
d3.select("svg").append("text")
	.attr("id", "text1")
	.attr("x", 5)
	.attr("y", textHeight + 30)
  .style("font-size", "30px");

d3.select("svg").append("text")
	.attr("id", "text2")
	.attr("x", 5)
	.attr("y", textHeight + 60)
	.style("font-size", "25px");

d3.select("svg").append("text")
  .attr("id", "text3")
  .attr("x", 5)
  .attr("y", textHeight + 90)
  .style("font-size", "20px");

d3.select("svg").append("text")
  .attr("id", "text4")
  .attr("x", 5)
  .attr("y", textHeight + 110)
  .style("font-size", "20px");

d3.select("svg").append("text")
  .attr("id", "text5")
  .attr("x", 5)
  .attr("y", textHeight + 130)
  .style("font-size", "20px");

d3.select("svg").append("text")
  .attr("id", "text6")
  .attr("x", 5)
  .attr("y", textHeight + 150)
  .style("font-size", "20px");

d3.select("svg").append("text")
  .attr("id", "text7")
  .attr("x", 5)
  .attr("y", textHeight + 170)
  .style("font-size", "20px");

d3.select("svg").append("text")
  .attr("id", "text8")
  .attr("x", 5)
  .attr("y", textHeight + 190)
  .style("font-size", "20px");

d3.select("svg").append("text")
  .attr("id", "text9")
  .attr("x", 5)
  .attr("y", textHeight + 210)
  .style("font-size", "20px");

d3.select("svg").append("text")
  .attr("id", "text10")
  .attr("x", 5)
  .attr("y", textHeight + 230)
  .style("font-size", "20px");

var g = svg.append("g");


d3.csv("data/data.csv", function(crimeData) {
	for (i = 0; i < crimeData.length; i++) {
      if (!(crimeData[i].neighbourhood in totalCrimeData)) {
        totalCrimeData[crimeData[i].neighbourhood] = {"Total" : 0,
                                                      "Assault": 0, 
                                                      "Break and Enter": 0,
                                                      "Homicide": 0,
                                                      "Robbery": 0,
                                                      "Sexual Assaults": 0,
                                                      "Theft From Vehicle": 0,
                                                      "Theft Of Vehicle": 0,
                                                      "Theft Over $5000": 0
                                                      };
        totalCrimeData[crimeData[i].neighbourhood]["Total"] = parseInt(crimeData[i].no_of_crime);
        totalCrimeData[crimeData[i].neighbourhood][crimeData[i].type_crime] += parseInt(crimeData[i].no_of_crime);
      }
      else {
        totalCrimeData[crimeData[i].neighbourhood]["Total"] += parseInt(crimeData[i].no_of_crime);
        totalCrimeData[crimeData[i].neighbourhood][crimeData[i].type_crime] += parseInt(crimeData[i].no_of_crime);
      }
    
	}
	var arr = Object.keys(totalCrimeData).map(function(key) {return totalCrimeData[key]["Total"];});
	var min = Math.min.apply(null, arr);
	var max = Math.max.apply(null, arr);

	d3.json("data/yeg.geojson", function(mapData) {
		var features = mapData.features;
		var scale = d3.scalePow()
					.exponent(0.5)
					.domain([min, max])
					.range([0, 0.9]);

		var colourmap = function(d) {
            if (d.properties.name.toUpperCase() in totalCrimeData) {
							if (totalCrimeData[d.properties.name.toUpperCase()]["Total"] == undefined) {
								return 0;
							}
							else {
								return scale(totalCrimeData[d.properties.name.toUpperCase()]["Total"]);
							}
						} else {
              return 0;
            }
    };

		g.selectAll("path")
			.data(features)
			.enter().append("path")
			.attr("d", path)
			.attr("fill", "rgb(204, 0, 0)")
			.attr("stroke", "#fff")
			.attr("opacity", colourmap)
			.on("mouseover", function() {
				d3.select(this)
				.style("fill", "rgb(240,200,200)")
				.style("opacity", 100)
				d3.select("#text1")
					.text(d3.select(this).data()[0].properties.name);
				d3.select("#text2")
					.text("Number of Crimes: " + 
						totalCrimeData[d3.select(this).data()[0].properties.name.toUpperCase()]["Total"]);
			})
      .on("mousedown", function() {
        d3.select("#text3").text("Assault: " + totalCrimeData[d3.select(this).data()[0].properties.name.toUpperCase()]["Assault"])
        d3.select("#text4").text("Break and Enter: " + totalCrimeData[d3.select(this).data()[0].properties.name.toUpperCase()]["Break and Enter"])
        d3.select("#text5").text("Homicide: " + totalCrimeData[d3.select(this).data()[0].properties.name.toUpperCase()]["Homicide"])
        d3.select("#text6").text("Robbery: " + totalCrimeData[d3.select(this).data()[0].properties.name.toUpperCase()]["Robbery"])
        d3.select("#text7").text("Sexual Assaults: " + totalCrimeData[d3.select(this).data()[0].properties.name.toUpperCase()]["Sexual Assaults"])
        d3.select("#text8").text("Theft From Vehicle: " + totalCrimeData[d3.select(this).data()[0].properties.name.toUpperCase()]["Theft From Vehicle"])
        d3.select("#text9").text("Theft Of Vehicle: " + totalCrimeData[d3.select(this).data()[0].properties.name.toUpperCase()]["Theft Of Vehicle"])
        d3.select("#text10").text("Theft Over $5000: " + totalCrimeData[d3.select(this).data()[0].properties.name.toUpperCase()]["Theft Over $5000"])
      })
			.on("mouseout", function() {
				d3.select(this)
				.style("fill", "rgb(204, 0, 0)")
				.style("opacity", colourmap);
				d3.select("#text1").text("");
				d3.select("#text2").text("");
        d3.select("#text3").text("");
        d3.select("#text4").text("");
        d3.select("#text5").text("");
        d3.select("#text6").text("");
        d3.select("#text7").text("");
        d3.select("#text8").text("");
        d3.select("#text9").text("");
        d3.select("#text10").text("");
      
			});
	});
});
	