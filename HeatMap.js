var width = 1000;
var height = 950;
var textHeight = 87;

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
				.style("fill", "rgb(240,200,200)")
				.style("opacity", 100)
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
	