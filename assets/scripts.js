// Definitions

var BLmargin = {top: 0, right: 10, bottom: 30, left: 10},
		BLwidth = 784,
		BLheight = 300;


$(document).ready(function() {
	$("#year-slider").slider({
		range: true,
		min: 1961,
		max: 2010,
		values: [ 1961, 2010 ],
		slide: function( event, ui ) {
			var years = ui.values;
			console.log(years);
			$('#years').text(years);
		}
	});
	
	$("#capa-slider").slider({
		range: true,
		min: 1,
		max: 22000,
		values: [ 1, 22000 ],
		slide: function( event, ui ) {
			var capacities = ui.values;
			console.log(capacities);
			$('#capacities').text(capacities);
		}
	});
	
	d3.csv("Environment_Temperature_change_E_All_Data_NOFLAG.csv", function(data1) {
		d3.csv("global_power_plant_database.csv", function(data2) {
			// unset from hardcoded after
			makeBarLine(formatBLDataSet(data1, data2, "Philippines", 1990, 2019));
		});
	});
	
	var selectedAreas = ["africa","antarctica","asia","australia","europe","north","south"];
	
	$('.area').click(function() {
		if ($(this).is(':checked'))
			selectedAreas.push($(this).attr("id"));
        else {
			let index = selectedAreas.indexOf($(this).attr("id"));
			selectedAreas.splice(index,1);
		}
		console.log(selectedAreas);
	});

	var selectedFuels = ['coal','gas','hydro','nuclear','oil','solar','waste','wind','others'];
	
	$('.fuel').click(function() {
		if ($(this).is(':checked'))
		selectedFuels.push($(this).attr("id"));
        else {
			let index = selectedFuels.indexOf($(this).attr("id"));
			selectedFuels.splice(index,1);
		}
		console.log(selectedFuels);
	});
	
	
	// DONUT
	
	var allDonutFuels = ['coal','gas','hydro','nuclear','oil','solar','waste','wind','others'];
		let darknude = '#6B5E5B';
		let rose = '#a3664a';
		let mustard = '#d6b85a';
		let orange = '#F0A35E';
		let purple = '#663a82';
		let greenish = '#70ae98';
		let teal = '#055b56';
		let coralblue = '#657fa6';
		let deepblue = '#02273a';
		let darkgray = '#808080';
	var allDonutColors = [darknude,rose,mustard,purple,greenish,teal,coralblue,deepblue,darkgray];
	// var allDonutColors = ['red','orange','yellow','green','teal','blue','violet','pink','gray'];
	// var selectedFuels = ['coal','gas','hydro','nuclear'];
	// var selectedColors = ["red", "blue", "yellow", "green"];
	var data = [10,80,20,30,50,20,10,5,20];
	// var data = [];
	var sum = 0;
	var selectedColors = [];
	for (let i=0;i<selectedFuels.length;i++) {
		selectedColors.push(allDonutColors[allDonutFuels.indexOf(selectedFuels[i])]);
		sum += data[i];
		// data.push(10*i+10);
	}

	var r = 120;
	var color = d3.scale.ordinal().range(selectedColors);
	var canvas = d3.select("#donut-chart").append("svg").attr("width", 325).attr("height", 250);
	var donutHover = d3.select("body").append("div") .attr("class", "tooltip");
	var group = canvas.append("g").attr("transform", "translate(120,120)");
	var arc = d3.svg.arc().innerRadius(50).outerRadius(r);
	var pie = d3.layout.pie().value(function (d, i) { return data[i]; });
	var arcs = group.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc")
		.on("mousemove",function(d,i){
        	var mouseVal = d3.mouse(this);
        	donutHover.style("display","none");
        	donutHover
        	.html( selectedFuels[i][0].toUpperCase() + selectedFuels[i].slice(1) + "</br>" + data[i])
            .style("left", (d3.event.pageX+12) + "px")
            .style("top", (d3.event.pageY-10) + "px")
            .style("opacity", 1)
            .style("display","block");
        })
        .on("mouseout",function(){donutHover.html(" ").style("display","none");})
        .on("click",function(d){
        	if(d3.select(this).attr("transform") == null){ d3.select(this).attr("transform","translate(42,0)"); }
			else{ d3.select(this).attr("transform",null); }
		});
	arcs.append("path").attr("d", arc).attr("fill", function(d,i) {return selectedColors[i];});
	arcs.append("text").attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";})
		.attr("text-anchor", "middle").attr("font-size", "12px").style("fill", "white")
		.text(function(d,i) {return Math.round(100*(data[i]/sum)) + "%";});

	var legendG = canvas.selectAll(".legend").data(pie(data)).enter().append("g")
				.attr("transform", function(d,i){ return "translate(" + (260) + "," + (i * 15 + 20) + ")"; })
				.attr("class", "legend");
	legendG.append("circle").attr("r", 5).attr("fill", function(d,i) { return selectedColors[i]; });
	legendG.append("text").text(function(d,i) {return selectedFuels[i];}).style("font-size", 12).attr("y", 3).attr("x", 11);
	
	
	
	// MAP
	
	
	
	var active;
	var width = 1000;
	var height = 450;

	// The svg
	var svg = d3.select("#map")
		.append("svg")
		.attr("width", 1000)
		.attr("height", 450);
	
	// Map and projection
	var projection = d3.geoMercator()
		.scale(90)
		.center([0,30])
		.rotate([8.2,0])
		.translate([width / 2, height / 2]);
	var path = d3.geoPath().projection(projection);
	
	// Data and color scale
	var data = d3.map();
	var colorScale = d3.scaleOrdinal()
		.domain([-0.103352941, 1.511571429])
		.range(["#69B34C", "#FAB733", "#FF8E15", "#FF0D0D"]);
	
	// Load external data and boot
	d3.queue()
		.defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
		.defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); })
		.defer(d3.csv, "https://raw.githubusercontent.com/neallithic64/DATA101-power-plants/master/Environment_Temperature_change_E_All_Data_NOFLAG.csv", function(d) { data.set(d.Area, d.Continent, d.Average); })
		.defer(d3.csv, "https://raw.githubusercontent.com/neallithic64/DATA101-power-plants/master/global_power_plant_database.csv", function(d){ data.set(d.latitude, d.longitude); })
		.await(ready);
	
	// Tooltip
	// var tip = d3.tip()
	// 	.attr('class', 'd3-tip')
	// 	.offset([-5, 0])
	// 	.html(function(d) {
	// 		var dataRow = countryById.get(d.properties.name);
	// 		if (dataRow) {
	// 			console.log(dataRow);
	// 			return dataRow.states + ": " + dataRow.mortality;
	// 		} else {
	// 			console.log("no dataRow", d);
	// 			return d.properties.name + ": No data.";
	// 		}
	// 	})
	
	function ready(error, topo, tempData, plantData) {
		let mouseOver = function(d) {
			d3.selectAll(".Country")
			.transition()
			.duration(200)
			.style("opacity", .5)
			d3.select(this)
			.transition()
			.duration(200)
			.style("opacity", 1)
		}

		let mouseLeave = function(d) {
			d3.selectAll(".Country")
			.transition()
			.duration(200)
			.style("opacity", .8)
			d3.select(this)
			.transition()
			.duration(200)
		}

		svg.append("rect")
			.attr("width", 1000)
			.attr("height", 450)
			.on("click", reset)
			.style("fill", "transparent");

		var g = svg.append("g");

		g.selectAll("path")
			.data(topo.features)
			.enter()
			.append("path")
			// draw each country
			.attr("d", path)
			// set the color of each country=
			.attr("fill", function (tempData) {
				tempData.Average = data.get(tempData.id) || 0;
				return colorScale(tempData.Average);
			})
			.style("stroke-width", 0.1)
			.style("stroke", "gray")
			.attr("class", function(d){ return "Country" })
			.style("opacity", .8)
			.on("mouseover", mouseOver)
			.on("mouseleave", mouseLeave)
			.on("click", function (d) { click(d); })
		
		g.append("path")
			.data(topo.features)
			.enter()
			.append("path")
			.attr("class", "mesh")
			.attr("d", path);
		
		function click(d) {

		if (active === d) return reset();
			g.selectAll(".active").classed("active", active = true);
			d3.select(".Country").classed("active", active = d);
			
			var b = path.bounds(d);

			g.transition().duration(750).attr("transform",
			"translate(" + projection.translate() + ")"
			+ "scale(" + .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height) + ")"
			+ "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");
		}

		function reset() {
			g.selectAll(".active").classed("active", active = false);
			g.transition().duration(750).attr("transform", "");
		}
		
		// points
		aa = [-122.490402, 37.786453];
		// bb = [-122.389809, 37.72728];

		// add circles to svg
		g.selectAll("circle")
			.data([aa]).enter()
			.append("circle")
			.attr("cx", function (d) { return projection(d)[0]; })
			.attr("cy", function (d) { return projection(d)[1]; })
			.attr("r", "1px")
			.attr("fill", "blue")

	}
});

function makeBarLine(dataset) {
	let xScale = d3.scaleBand()
					.rangeRound([0, BLwidth])
					.padding(0.1)
					.domain(dataset.map(function(d) {
						return d[0];
					}));
	let yScale = d3.scaleLinear()
					.rangeRound([BLheight, 0])
					.domain([0, d3.max(dataset, (function (d) {
						return d[1];
					}))]);

	let svg = d3.select("#barline").append("svg")
				.attr("width", BLwidth + BLmargin.left + BLmargin.right)
				.attr("height", BLheight + BLmargin.top + BLmargin.bottom);

	let g = svg.append("g")
				.attr("transform", "translate(" + BLmargin.left + "," + BLmargin.top + ")");

	// axis-x
	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + BLheight + ")")
		.call(d3.axisBottom(xScale));

	// axis-y
	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(yScale));

	let bar = g.selectAll("rect")
				.data(dataset)
				.enter().append("g");

	// bar chart
	bar.append("rect")
		.attr("x", function(d) { return xScale(d[0]); })
		.attr("y", function(d) { return yScale(d[1]); })
		.attr("width", xScale.bandwidth())
		.attr("height", function(d) { return BLheight - yScale(d[1]); })
		.attr("class", function(d) {
			if (d[2] < 10)			return "bar bar1";
			else if (d[2] < 30)		return "bar bar2";
			else if (d[2] < 50)		return "bar bar3";
			else					return "bar bar4";
		});

	// labels on the bar chart
	bar.append("text")
		.attr("dy", "1.3em")
		.attr("x", function(d) { return xScale(d[0]) + xScale.bandwidth() / 2; })
		.attr("y", function(d) { return yScale(d[1]); })
		.attr("text-anchor", "middle")
		.attr("font-family", "sans-serif")
		.attr("font-size", "11px")
		.attr("fill", "black")
		.text(function(d) {
			return d[1];
		});

	// line chart
	var line = d3.line()
				.x(function(d, i) { return xScale(d[0]) + xScale.bandwidth() / 2; })
				.y(function(d) { return yScale(d[2]); })
				.curve(d3.curveMonotoneX);

	bar.append("path")
		.attr("class", "line")
		.attr("d", line(dataset));

	bar.append("circle")
		.attr("class", "dot")
		.attr("cx", function(d, i) { return xScale(d[0]) + xScale.bandwidth() / 2; })
		.attr("cy", function(d) { return yScale(d[2]); })
		.attr("r", 3);
}


// missing: checking for continent
function formatBLDataSet(temp, power, country, year_start, year_end) {
	let data = [], count;
	/* expected result
		[   [YEAR, POWER PLANT COUNT, TEMP CHANGE], ...   ]
	*/
	
	// year
	for (let i = year_start; i <= year_end; i++) {
		// power plant count
		count = 0;
		for (let j = 0; j < power.length; j++) {
			if (power[j].country_long === country && power[j].commissioning_year !== "" && power[j].commissioning_year == i) {
				count++;
			}
		}
		if (i > year_start) count += data[i - year_start - 1][1];
		data.push([i, count]);
	}
	
	// temp change
	let countryTemps;
	for (let j = 0; j < temp.length; j++) if (temp[j].Area === country) countryTemps = temp[j];
	if (countryTemps !== undefined) {
		let values = Object.values(countryTemps);
		for (let i = year_start - 1961; i < year_end - 1961 + 1; i++) {
			data[i-(year_start-1961)].push(values[i] == "" ? 0 : Number.parseFloat(values[i]) * 10);
		}
		console.log(values, data);
	}
	return data;
}
