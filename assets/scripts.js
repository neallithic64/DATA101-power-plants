// Definitions
var years = [1961,2018];
var capacities = [1,22500];
var allAreas = ["Africa","Antarctica","Asia","Australia","Europe","North","South"];
var allFuels = ['Coal','Gas','Hydro','Nuclear','Oil','Solar','Waste','Wind','Others'];
var selectedAreas = [];
var selectedFuels = [];
var selectedCountry;
var mouseCountry;
var dataTemp;
var dataPower;

var BLmargin = {top: 0, right: 10, bottom: 30, left: 10},
		BLwidth = 784,
		BLheight = 300;

$(document).ready(function() {

	d3.csv("Environment_Temperature_change_E_All_Data_NOFLAG.csv", function(data1) {
		d3.csv("global_power_plant_database.csv", function(data2) {
			dataTemp = data1;
			dataPower = data2;
			makeBarLine(formatBLDataSet(dataTemp, dataPower, "Philippines", 1961, 2018));
			makeDonut(years,capacities,selectedCountry,selectedAreas,selectedFuels);
		});
	});

	$("#year-slider").slider({
		range: true,
		min: 1961,
		max: 2018,
		values: [ 1961, 2018 ],
		slide: function( event, ui ) {
			let years = ui.values;
			$('#years').text(years[0] + " - " + years[1]);
			makeBarLine(formatBLDataSet(dataTemp, dataPower, selectedCountry, years[0], years[1]));
			makeDonut(years,capacities,selectedCountry,selectedAreas,selectedFuels);
		}
	});
	
	$("#capa-slider").slider({
		range: true,
		min: 1,
		max: 22000,
		values: [ 1, 22000 ],
		slide: function( event, ui ) {
			let capacities = ui.values;
			$('#capacities').text(capacities[0] + " - " + capacities[1]);
			makeBarLine(formatBLDataSetEmiss(dataTemp, dataPower, selectedCountry, capacities[0], capacities[1]));
			makeDonut(years,capacities,selectedCountry,selectedAreas,selectedFuels);
		}
	});
	
	$('.area').click(function() {
		if ($(this).is(':checked'))
			selectedAreas.push($(this).attr("id"));
        else {
			let index = selectedAreas.indexOf($(this).attr("id"));
			selectedAreas.splice(index,1);
		}
		// console.log(selectedAreas);
		selectedCountry = null;
		makeDonut(years,capacities,selectedCountry,selectedAreas,selectedFuels);
	});

	// var selectedFuels = ['coal','gas','hydro','nuclear','oil','solar','waste','wind','others'];
	$('.fuel').click(function() {
		if ($(this).is(':checked'))
		selectedFuels.push($(this).attr("id"));
        else {
			let index = selectedFuels.indexOf($(this).attr("id"));
			selectedFuels.splice(index,1);
		}
		// console.log(selectedFuels);
		makeDonut(years,capacities,selectedCountry,selectedAreas,selectedFuels);
	});
	
	
// DONUT
function makeDonut(years,capacities,selectedCountry,selectedAreas,selectedFuels) {
	// console.log(years,capacities,selectedCountry,selectedAreas,selectedFuels)
	let div = document.querySelector("#donut-chart");
	div.innerHTML = "";
	if (selectedCountry!=null & selectedCountry!=undefined) document.querySelector("#donutPlace").innerHTML = selectedCountry;
	else document.querySelector("#donutPlace").innerHTML =  selectedAreas;
	var inputAreas = [];
	var inputFuels = [];
	if(selectedAreas.length==0) inputAreas = allAreas;
	else inputAreas = selectedAreas;
	if (selectedFuels.length==0) inputFuels = allFuels;
	else inputFuels = selectedFuels;
	
	var allDonutFuels = allFuels;
	var allDonutColors = ['#E41A1C', '#377EB8', '#4DAF4A', '#984EA3', '#FF7F00', '#FFFF33', '#A65628', '#F781BF', '#999999'];
	// var gwhData = [10,80,20,30,50,20,10,5,20];
	var gwhData = [];
	var sum = 0;
	var selectedColors = [];
	for (let i=0;i<inputFuels.length;i++) {
		selectedColors.push(allDonutColors[allDonutFuels.indexOf(inputFuels[i])]);
		gwhData.push(sumFilteredFuelEmission(years,capacities,selectedCountry,inputAreas,inputFuels[i]))
		sum += gwhData[i];
		// gwhData.push(10*i+10);
	}

	var r = 150;
	var color = d3.scale.ordinal().range(selectedColors);
	var canvas = d3.select("#donut-chart").append("svg").attr("width", 425).attr("height", 300);
	var donutHover = d3.select("body").append("div") .attr("class", "tooltip");
	var group = canvas.append("g").attr("transform", "translate(150,150)");
	var arc = d3.svg.arc().innerRadius(50).outerRadius(r);
	var pie = d3.layout.pie().value(function (d, i) { return gwhData[i]; });
	var arcs = group.selectAll(".arc").data(pie(gwhData)).enter().append("g").attr("class", "arc")
		.on("mousemove",function(d,i){
        	var mouseVal = d3.mouse(this);
        	donutHover.style("display","none");
        	donutHover
        	.html( inputFuels[i][0].toUpperCase() + inputFuels[i].slice(1) + "</br>" + gwhData[i])//(gwhData[i]/1000).toFixed(3).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")*/ )
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
		.text(function(d,i) {return (gwhData[i]*100/sum).toFixed(2) + "%";});

	var legendG = canvas.selectAll(".legend").data(pie(gwhData)).enter().append("g")
				.attr("transform", function(d,i){ return "translate(" + (320) + "," + (i * 15 + 20) + ")"; })
				.attr("class", "legend");
	legendG.append("circle").attr("r", 5).attr("fill", function(d,i) { return selectedColors[i]; });
	legendG.append("text").text(function(d,i) {return (gwhData[i]==0)? inputFuels[i] : (inputFuels[i] + " (" + (gwhData[i]*100/sum).toFixed(2) + "%)" ) ;}).style("font-size", 12).attr("y", 3).attr("x", 11);
}

function sumFilteredFuelEmission(yearsInput,capacityInput,countryInput,areasInput,fuel) {
	var sum = 0;
	for (let i=0 ; i<dataPower.length; i++) {
		if(!allFuels.includes(dataPower[i].primary_fuel)) dataPower[i].primary_fuel = "Others";
		if (fuel === dataPower[i].primary_fuel)
			if((yearsInput[0]==1961 && yearsInput[1]==2018) || (yearsInput[0] <= dataPower[i].commissioning_year && dataPower[i].commissioning_year <= yearsInput[1]))
				if ((capacityInput[0]==1 && capacityInput[1]==22500) || (capacityInput[0] <= dataPower[i].capacity_mw && dataPower[i].capacity_mw <= capacityInput[1]))
				{	if (countryInput!=undefined && countryInput!=null)
						{ if(countryInput === dataPower[i].country_long) 
			 				// sum = sum + Number(dataPower[i].estimated_generation_gwh); }
							sum++;}
					else if (areasInput.includes(dataPower[i].Continent.split(' ')[0]) || areasInput.length==7)
						// sum = sum + Number(dataPower[i].estimated_generation_gwh);
						sum++;
				}
	}
	return sum;
}


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
		.translate([width / 2, height / 2])
	var path = d3.geoPath().projection(projection);

	// Data and color scale
	var data = d3.map();


	// Load external data and boot
	d3.queue()
		.defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
		.defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); })
		.defer(d3.csv, "https://raw.githubusercontent.com/neallithic64/DATA101-power-plants/master/Environment_Temperature_change_E_All_Data_NOFLAG.csv")
		.defer(d3.csv, "https://raw.githubusercontent.com/neallithic64/DATA101-power-plants/master/global_power_plant_database.csv")
		.await(ready);
	
	function ready(error, topo, popData, tempData, plantData) {
		// Tooltip
		function getTipData(country, tempData, plantData) {
			tipData = [];
			var i = j = k = 0;
			var tempCountry = country;
			for (j = 0; j < tempData.length; j++) {
				if (tempCountry === tempData[j].Area)
					var tempAve = tempData[j].Average;
			}
			var tempCount = 0;
			for (k = 0; k < plantData.length; k++) {
				if (tempCountry === plantData[k].country_long)
					var tempCount = tempCount + 1; 
			}
			if (tempAve == null) tempAve = "No data."
			if (tempCount === 0) tempCount = "No data."
			tipData.push([tempCountry, tempAve, tempCount]);
			return tipData;
		}

		// Tooltip variable
		var mapTip = d3.select("div.mapTip");


		// Mouse hover function
		let mouseOver = function(d, i) {
			d3.selectAll(".Country")
			.transition()
			.duration(200)
			.style("opacity", .5)
			d3.select(this)
			.transition()
			.duration(200)
			.style("opacity", 1)

			displayTip = getTipData(d.properties.name, tempData, plantData);
			// console.log(displayTip);
			return mapTip.style("hidden", false).html(displayTip[0][0] + "<br> Average Temp: " + displayTip[0][1] + "<br> Plant Count: " + displayTip[0][2]);
		}

		// Mouse move function
		let mouseMove = function(d, i) {
			displayTip = getTipData(d.properties.name, tempData, plantData);
			mapTip.classed("hidden", false)
			.style("top", (d3.event.pageY) + "px")
			.style("left", (d3.event.pageX + 10) + "px")
			.html(displayTip[0][0] + "<br> Average Temp: " + displayTip[0][1] + "<br> Plant Count: " + displayTip[0][2]);
			mouseCountry = displayTip[0][0];
		}

		// Mouse leave function
		let mouseLeave = function(d, i) {
			d3.selectAll(".Country")
			.transition()
			.duration(200)
			.style("opacity", .8)
			d3.select(this)
			.transition()
			.duration(200)

			return mapTip.classed("hidden", true);
		}

		// Invisible rect for zoom reset
		svg.append("rect")
			.attr("width", 1000)
			.attr("height", 450)
			.on("click", reset)
			.style("fill", "transparent");


		// Main svg
		var g = svg.append("g");

		function getColors(tempData) {
			var average = [];
			for (var i = 0; i < tempData.length; i++) {
				average.push(tempData[i].Average);
			}
			return average;
		}

		var tempAverage = getColors(tempData);

		var colorScale = d3.scaleQuantize()
			.domain([-0.103352941, 1.511571429])
			.range(["#69B34C", "#FAB733", "#FF8E15", "#FF0D0D"]);

		// Base map
		g.selectAll("path")
			.data(topo.features)
			.enter()
			.append("path")
			// draw each country
			.attr("d", path)
			// set the color of each country
			// .attr("fill", function (tempData) {
			// 	tempData.average = data.get(tempData.id) || 0;
			// 	return colorScale(tempData.average);
			// })
			.attr("fill", function (d, i) { /*console.log(tempAverage[i], colorScale(tempAverage[i]));*/ return colorScale(tempAverage[i]); } )
			.style("stroke-width", 0.1)
			.style("stroke", "gray")
			.attr("class", function(d){ return "Country" })
			.style("opacity", .8)
			.on("mouseover", mouseOver)
			.on("mousemove", mouseMove)
			.on("mouseleave", mouseLeave)
			.on("click", function (d) { click(d); });

		// Path
		g.append("path")
			.data(topo.features)
			.enter()
			.append("path")
			.attr("class", "mesh")
			.attr("d", path);

		// Getting coordinates of power plants
		function getCoords(plantData) {
			var coords = [];
			for (var i = 0; i < plantData.length; i++) {
				coords.push([plantData[i].longitude, plantData[i].latitude]);
			}
			return coords;
		}

		// New projector for power plants layer
		var projectionPlants = d3.geoMercator()
			.scale(90)
			.center([0,30])
			.translate([width / 2, height / 2])

		// Add power plant circles to svg
		g.selectAll("circle")
			.data(getCoords(plantData)).enter()
			.append("circle")
			.attr("cx", function (d) { return projectionPlants.rotate([0, 0, 0])(d)[0] })
			.attr("cy", function (d) { return projectionPlants.rotate([0, 0, 0])(d)[1] })
			.attr("r", "0.3px")
			.attr("fill", "blue")

		// Country click then zoom function
		function click(d) {
			// console.log(d);
			if (active === d) return reset();
			g.selectAll(".active").classed("active", active = true);
			d3.select(".Country").classed("active", active = d);

			var b = path.bounds(d);

			g.transition().duration(750).attr("transform",
			"translate(" + projection.translate() + ")"
			+ "scale(" + .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height) + ")"
			+ "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");

	// SELECT COUNTRY INTERACT
			selectedCountry = mouseCountry;
			console.log(selectedCountry);
			makeBarLine(formatBLDataSet(dataTemp, dataPower, selectedCountry, 1961, 2018));
			makeDonut(years,capacities,selectedCountry,selectedAreas,selectedFuels);
		}

		// Zoom reset function
		function reset() {
			g.selectAll(".active").classed("active", active = false);
			g.transition().duration(750).attr("transform", "");
		}

	}
});

function makeBarLine(dataset) {
	let div = document.querySelector("#barline");
	div.innerHTML = "";
	
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
			if (d[1] < 10)			return "bar bar1";
			else if (d[1] < 100)	return "bar bar2";
			else if (d[1] < 250)	return "bar bar3";
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
	
	let multiplier = data[data.length-1][1] / 2;
	
	// temp change
	let countryTemps;
	for (let j = 0; j < temp.length; j++) if (temp[j].Area === country) countryTemps = temp[j];
	if (countryTemps !== undefined) {
		let values = Object.values(countryTemps);
		for (let i = year_start - 1961; i < year_end - 1961 + 1; i++) {
			data[i-(year_start-1961)].push(isNaN(values[i+2]) ? 0 : Number.parseFloat(values[i+2]) * multiplier);
		}
	}
	console.log(data);
	return data;
}

function formatBLDataSetEmiss(temp, power, country, min_emiss, max_emiss) {
	let data = [], count;
	/* expected result
		[   [YEAR, POWER PLANT COUNT, TEMP CHANGE], ...   ]
	*/
	
	// year
	for (let i = 0; i < 2019-1961; i++) {
		// power plant count
		count = 0;
		for (let j = 0; j < power.length; j++) {
			if (power[j].country_long === country
					&& power[j].commissioning_year !== ""
					&& power[j].commissioning_year == (1961+i)
					&& power[j].estimated_generation_gwh !== ""
					&& power[j].estimated_generation_gwh >= min_emiss
					&& power[j].estimated_generation_gwh <= max_emiss) {
				count++;
			}
		}
		if (i > 0) count += data[i - 1][1];
		data.push([i+1961, count]);
	}
	
	let multiplier = data[data.length-1][1] / 2;
	
	// temp change
	let countryTemps;
	for (let j = 0; j < temp.length; j++) if (temp[j].Area === country) countryTemps = temp[j];
	if (countryTemps !== undefined) {
		let values = Object.values(countryTemps);
		for (let i = 0; i < 2019-1961; i++) {
			data[i].push(values[i+2] == NaN ? 0 : Number.parseFloat(values[i+2]) * multiplier);
		}
	}
	return data;
}
