$(document).ready(function() {
	$("#year-slider").slider({
		range: true,
		min: 1961,
		max: 2010,
		values: [ 1961, 2010 ],
		slide: function( event, ui ) {
			var years = ui.values;
			var yearFrom = years[0];
			var yearTo = years[1];
			console.log(years);
			$('#years').text(yearFrom + " - " + yearTo);
		}
	});
	
	$("#capa-slider").slider({
		range: true,
		min: 1,
		max: 22000,
		values: [ 1, 22000 ],
		slide: function( event, ui ) {
			var capacities = ui.values;
			var capacityFrom = capacities[0];
			var capacityTo = capacities[1];
			console.log(capacities);
			$('#capacities').text(capacityFrom + " - " + capacityTo);
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
			console.log(data2);
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
	var data = [10,80,20,30,50,20,10,5,20];
	// var data = [];
	var sum = 0;
	var selectedColors = [];
	for(let i=0;i<selectedFuels.length;i++) {
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

});
