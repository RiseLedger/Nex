jQuery(function() {

	new Nex({
		autoplay         : false , // true || false
		thumbnails       : false, // true || false
		bullets          : false,  // true || false
		bar              : false, // true || false
		load_bar         : false, // true || false
		
		data             : [
			{
				display     : "image", // image, map, video
				title       : "Nex", // image title
				description : "Blazing Fast Fullscreen Slider", // image description
				link        : "../../../../images/1.jpg", // image src
				thumb       : "../../../../images/thumb_1.jpg", // image thumb
				url         : "#", // url where image will link
				alt         : "Blazing Fast Fullscreen Slider" // image alt tag
			}
		]
	});
	
});