$(document).ready(function() {
	$("#year-slider").slider({
		range: true,
		min: 1961,
		max: 2010,
		values: [ 1961, 2010 ],
		slide: function( event, ui ) {
			console.log(ui.values);
		}
	});
	
	$("#capa-slider").slider({
		range: true,
		min: 1961,
		max: 2010,
		values: [ 1961, 2010 ],
		slide: function( event, ui ) {
			console.log(ui.values);
		}
	});
});
