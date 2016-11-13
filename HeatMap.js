var width = 1000;
var height = 1100;

var projection = d3.geoMercator()
					.scale(100000)
					.center([-113.48, 53.533])
					.translate([width/2, height/2]);

var path = d3.geoPath()
			.projection(projection);

var svg = d3.select("div")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("stroke", "#aaa")
			.attr("fill", "pink");

var g = svg.append("g");

d3.json("data/yeg.geojson", function(mapData) {
	var features = mapData.features;

	g.selectAll("path")
		.data(features)
		.enter().append("path")
		.attr("d", path);

	console.log(features);
});