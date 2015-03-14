jQuery(function() {

	new Nex({
		autoplay         : false , // true || false
		thumbnails       : false, // true || false
		bullets          : false,  // true || false
		bar              : false, // true || false
		load_bar         : false, // true || false
		
		data             : [
			{
				display     : "video", // image, map, video
				url         : "http://vimeo.com/22884674", // video link
			}
		]
	});
	
});