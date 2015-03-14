jQuery(function() {

	new Nex({
		
		thumbnails       : true, // true || false
		bullets          : true,  // true || false
		bar              : false, // true || false
		load_bar         : true, // true || false
	
		data             : [
			{
				display     : "image", // image, map, video
				title       : "Nex", // image title
				description : "Blazing Fast Fullscreen Slider", // image description
				link        : "../../../images/1.jpg", // image src
				thumb       : "../../../images/thumb_1.jpg", // image thumb
				url         : "#", // url where image will link
				alt         : "Blazing Fast Fullscreen Slider" // image alt tag
			},
			{
				display     : "image", // image, map, video
				title       : "Nex", // image title
				description : "Speed Optimized", // image description
				link        : "../../../images/2.jpg", // image src
				thumb       : "../../../images/thumb_2.jpg", // image thumb
				url         : "#", // url where image will link
				alt         : "Speed Optimized" // image alt tag
			},
			{
				display     : "image", // image, map, video
				title       : "Nex", // image title
				description : "GPU Accelerated", // image description
				link        : "../../../images/3.jpg", // image src
				thumb       : "../../../images/thumb_3.jpg", // image thumb
				url         : "#", // url where image will link
				alt         : "GPU Accelerated" // image alt tag
			},
			{
				display     : "image", // image, map, video
				title       : "Nex", // image title
				description : "Full Customizable", // image description
				link        : "../../../images/4.jpg", // image src
				thumb       : "../../../images/thumb_4.jpg", // image thumb
				url         : "#", // url where image will link
				alt         : "Full Customizable" // image alt tag
			},
			{
				display     : "image", // image, map, video
				title       : "Nex", // image title
				description : "Unique Effects", // image description
				link        : "../../../images/5.jpg", // image src
				thumb       : "../../../images/thumb_5.jpg", // image thumb
				url         : "#", // url where image will link
				alt         : "Unique Effects" // image alt tag
			}
		]
	});
	
});