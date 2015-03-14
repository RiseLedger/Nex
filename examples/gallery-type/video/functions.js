jQuery(function() {

	new Nex({
		autoplay         : false , // true || false
		thumbnails       : true, // true || false
		bullets          : true,  // true || false
		bar              : true, // true || false
		load_bar         : false, // true || false
		
		data             : [
			{
				display     : "video", // image, map, video
				url         : "http://vimeo.com/22884674", // video link
				title       : "Nex",
				description : " &mdash; Blazing Fast Fullscreen Slider",
				thumb       : "../../../images/thumb_video_lambo.jpg"
			},
			{
				display     : "video", // image, map, video
				url         : "http://www.youtube.com/watch?v=Wo8UtWiYiZI", // video link
				title       : "Nex",
				description : " &mdash; Embed Videos from Youtube",
				thumb       : "../../../images/thumb_video_mm.jpg"
			},
			{
				display     : "video", // image, map, video
				url         : "http://vimeo.com/48963312", // video link
				title       : "Nex",
				description : " &mdash; Embed Videos from Vimeo",
				thumb       : "../../../images/thumb_video_bulgari.jpg"
			},
			{
				display     : "video", // image, map, video
				url         : "http://www.youtube.com/watch?v=KSTe0Er9BXI", // video link
				title       : "Nex",
				description : " &mdash; Use HTML in the Description",
				thumb       : "../../../images/thumb_video_vs.jpg"
			}
		]
	});
	
});