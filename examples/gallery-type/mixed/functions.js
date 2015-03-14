jQuery(function() {

	new Nex({
		delay            : 10000, // between images transition
		
		data             : [
		
			{
				display     : "image", // image, map, video
				title       : "Nex", // image title
				description : "Blazing Fast Fullscreen Slider", // image description
				link        : "../../../images/1.jpg", // image src
				thumb       : "../../../images/thumb_1.jpg", // image thumb
				url         : "#", // url where image will link
				alt         : " &mdash; Blazing Fast Fullscreen Slider" // image alt tag
			},
			
			{
				display     : "map", // image, map, video
				title       : "Nex", // image title
				description : " &mdash; Use Video, Images and Maps in the Same Slider", // image description
				thumb       : "../../../images/thumb_map2.jpg", // image thumb
				
				marker      : false,  //  true || false (show or hide the marker of map)
				infowindow  : "", // html content
				zoom        : 19, // zoom level of map up to 16
				type        : "SATELLITE", // type of map to display. Ex: ROADMAP, SATELLITE, HYBRID, TERRAIN
				lat         : 35.683514, // latitude of the map
				lng         : 139.693115, // longitude of the map
			},
			
			{
				display     : "video", // image, map, video
				url         : "http://vimeo.com/22884674", // video link
				title       : "Nex",
				description : " &mdash; Blazing Fast Fullscreen Slider",
				thumb       : "../../../images/thumb_video_lambo.jpg"
			}

		]
	});
	
});