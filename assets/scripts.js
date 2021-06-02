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
	
	
	var selectedAreas = ["africa","antarctica","asia","australia","europe","north","south"];
	$('.area').click(function() {
		if($(this).is(':checked'))
			selectedAreas.push($(this).attr("id"));
        else {
			var index = selectedAreas.indexOf($(this).attr("id"));
			selectedAreas.splice(index,1);
		}
		console.log(selectedAreas);
	});

	var selectedFuels = ['coal','gas','hydro','nuclear','oil','solar','waste','wind','others'];
	$('.fuel').click(function() {
		if($(this).is(':checked'))
		selectedFuels.push($(this).attr("id"));
        else {
			var index = selectedFuels.indexOf($(this).attr("id"));
			selectedFuels.splice(index,1);
		}
		console.log(selectedFuels);
	});
	
	d3.csv("Environment_Temperature_change_E_All_Data_NOFLAG.csv", function(data1) {
		d3.csv("global_power_plant_database.csv", function(data2) {
			console.log(data1);
		});
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
	var selectedColors = [];
	var data = [];
	var sum = 0;
	// var data = [10,80,20,30,50,20,10,5,20];

	for(let i=0;i<selectedFuels.length;i++) {
		selectedColors.push(allDonutColors[allDonutFuels.indexOf(selectedFuels[i])]);
		sum += data[i];
	// data.push(10*i+10);
	}

	var r = 120;
	var color = d3.scale.ordinal().range(selectedColors);
	var canvas = d3.select("#donut-chart").append("svg").attr("width", 325).attr("height", 250);
	var group = canvas.append("g").attr("transform", "translate(120,120)");
	var arc = d3.svg.arc().innerRadius(50).outerRadius(r);
	var pie = d3.layout.pie().value(function (d, i) { return data[i]; });
	var arcs = group.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");
	arcs.append("path").attr("d", arc).attr("fill", function(d,i) {return selectedColors[i];});
	arcs.append("text").attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";})
		.attr("text-anchor", "middle").attr("font-size", "12px").style("fill", "white")
		.text(function(d,i) {return data[i] / sum + "%";});

	var legendG = canvas.selectAll(".legend").data(pie(data)).enter().append("g")
				.attr("transform", function(d,i){ return "translate(" + (260) + "," + (i * 15 + 20) + ")"; })
				.attr("class", "legend");
	legendG.append("circle").attr("r", 5).attr("fill", function(d,i) { return selectedColors[i]; });
	legendG.append("text").text(function(d,i) {return selectedFuels[i];}).style("font-size", 12).attr("y", 3).attr("x", 11);

});
