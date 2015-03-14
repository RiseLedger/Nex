jQuery(function() {

	new Nex({
		delay            : 10000, // between images transition
		
		data             : [
			{
				display     : "map", // image, map, video
				title       : "Nex", // image title
				description : " &mdash; Choose from 4 types of Map: ROADMAP, SATELLITE, HYBRID, TERRAIN", // image description
				thumb       : "../../../images/thumb_map1.jpg", // image thumb
				
				marker      : true,  //  true || false (show or hide the marker of map)
				infowindow  : "You can add any html content here", // html content
				zoom        : 12, // zoom level of map up to 16
				type        : "ROADMAP", // type of map to display. Ex: ROADMAP, SATELLITE, HYBRID, TERRAIN
				lat         : 40.734771, // latitude of the map
				lng         : -73.991654, // longitude of the map
			},
			
			{
				display     : "map", // image, map, video
				title       : "Nex", // image title
				description : " &mdash; Customize Your Zoom Level", // image description
				thumb       : "../../../images/thumb_map2.jpg", // image thumb
				
				marker      : false,  //  true || false (show or hide the marker of map)
				infowindow  : "", // html content
				zoom        : 19, // zoom level of map up to 16
				type        : "SATELLITE", // type of map to display. Ex: ROADMAP, SATELLITE, HYBRID, TERRAIN
				lat         : 35.683514, // latitude of the map
				lng         : 139.693115, // longitude of the map
			},
			
			{
				display     : "map", // image, map, video
				title       : "Nex", // image title
				description : " &mdash; You can Disable Map Marker", // image description
				thumb       : "../../../images/thumb_map3.jpg", // image thumb
				
				marker      : false,  //  true || false (show or hide the marker of map)
				infowindow  : "", // html content
				zoom        : 15, // zoom level of map up to 16
				type        : "HYBRID", // type of map to display. Ex: ROADMAP, SATELLITE, HYBRID, TERRAIN
				lat         : 48.26377, // latitude of the map
				lng         : 7.719585, // longitude of the map
			},
			
			{
				display     : "map", // image, map, video
				title       : "Nex", // image title
				description : " &mdash; Add any HTML in the Marker Popup", // image description
				thumb       : "../../../images/thumb_map4.jpg", // image thumb
				
				marker      : true,  //  true || false (show or hide the marker of map)
				infowindow  : "You can add any html content here", // html content
				zoom        : 12, // zoom level of map up to 16
				type        : "TERRAIN", // type of map to display. Ex: ROADMAP, SATELLITE, HYBRID, TERRAIN
				lat         : 41.867452, // latitude of the map
				lng         : -87.627643, // longitude of the map
			}
		]
	});
	
});