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
	
	
	var areas = new Array();
	$('.area').click(function() {
		if($(this).is(':checked'))
        	areas.push($(this).attr("id"));
        else {
			var index = areas.indexOf($(this).attr("id"));
			areas.splice(index,1);
		}
		console.log(areas);
	});

	var fuels = new Array();
	$('.fuel').click(function() {
		if($(this).is(':checked'))
			fuels.push($(this).attr("id"));
        else {
			var index = fuels.indexOf($(this).attr("id"));
			fuels.splice(index,1);
		}
		console.log(fuels);
	});
	
	d3.csv("Environment_Temperature_change_E_All_Data_NOFLAG.csv", function(data1) {
		d3.csv("global_power_plant_database.csv", function(data2) {
			console.log(data1);
		});
	});
});
