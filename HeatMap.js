var width = 1000;
var height = 950;
var textHeight = 87;

var color = ["rgb(247,251,255)",
			"rgb(222,235,247)",
			"rgb(198,219,239)",
			"rgb(158,202,225)",
			"rgb(107,174,214)",
			"rgb(66,146,198)",
			"rgb(33,113,181)",
			"rgb(8,81,156)",
			"rgb(8,48,107)"];

var totalCrimeData = {};

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
	.attr("id", "text1")
	.attr("x", 5)
	.attr("y", textHeight);

d3.select("svg").append("text")
	.attr("id", "text2")
	.attr("x", 5)
	.attr("y", textHeight + 25)
	.style("font-size", "20px");



var g = svg.append("g");


d3.csv("data/data.csv", function(crimeData) {
	for (i = 0; i < crimeData.length; i++) {
		if (!(crimeData[i].neighbourhood in totalCrimeData)) {
			totalCrimeData[crimeData[i].neighbourhood] = parseInt(crimeData[i].no_of_crime);
		}
		else {
			totalCrimeData[crimeData[i].neighbourhood] += parseInt(crimeData[i].no_of_crime);	
		}
	}
	var arr = Object.keys(totalCrimeData).map(function(key) {return totalCrimeData[key];});
	var min = Math.min.apply(null, arr);
	var max = Math.max.apply(null, arr);

	d3.json("data/yeg.geojson", function(mapData) {
		var features = mapData.features;
		var scale = d3.scalePow()
					.exponent(0.5)
					.domain([min, max])
					.range([0, 0.9]);

		var colourmap = function(d) {
							if (totalCrimeData[d.properties.name.toUpperCase()] == undefined) {
								return 0;
							}
							else {
								return scale(totalCrimeData[d.properties.name.toUpperCase()]);
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
				.style("fill", "rgb(8,48,107)")
				.style("opacity", function(d) {
					if (totalCrimeData[d.properties.name.toUpperCase()] == undefined) {
						return 0.15;
					}
					else {
						return scale(totalCrimeData[d.properties.name.toUpperCase()]) + 0.15;
					}
				});
				d3.select("#text1")
					.text(d3.select(this).data()[0].properties.name);
				d3.select("#text2")
					.text("Number of Crimes: " + 
						totalCrimeData[d3.select(this).data()[0].properties.name.toUpperCase()]);
			})
			.on("mouseout", function() {
				d3.select(this)
				.style("fill", "rgb(204, 0, 0)")
				.style("opacity", colourmap);
				d3.select("#text1").text("");
				d3.select("#text2").text("");
			});
	});
});
	