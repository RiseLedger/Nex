jQuery(function() {

	new Nex({
		autoplay         : false , // true || false
		thumbnails       : false, // true || false
		bullets          : false,  // true || false
		bar              : false, // true || false
		load_bar         : false, // true || false
		
		data             : [
			{
				display     : "map", // image, map, video
				
				marker      : true,  //  true || false (show or hide the marker of map)
				infowindow  : "You can add any html content here", // html content
				zoom        : 12, // zoom level of map up to 16
				type        : "ROADMAP", // type of map to display. Ex: ROADMAP, SATELLITE, HYBRID, TERRAIN
				lat         : 40.734771, // latitude of the map
				lng         : -73.991654, // longitude of the map
			}
		]
	});
	
});