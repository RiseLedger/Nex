/* Nex Class 1.1.0 */
var Nex = function( options ) {
	
	// merge defaults with passed options
	var defaults = {
		view             : "local", // local
		transition       : "random", // none || fade || slideLeft || slideRight || slideTop || slideBottom || zoom || rotate || skew || random
		transition_speed : 600, // how long the transition between two images will durate
		delay            : 7000, // between images transition
		autoplay         : true , // true || false
		thumbnails       : true, // true || false
		bullets          : true,  // true || false
		bar              : true, // true || false
		load_bar         : true // true || false
	};

	var data = {
		display     : "image", // image, map, video
		title       : "", // image title
		description : "", // image description
		link        : "", // image src
		thumb       : "", // image thumb
		url         : "#", // url where image will link
		alt         : "", // image alt tag
		marker      : false,
		infowindow  : "",
		zoom        : 12,
		type        : "ROADMAP",
		lat         : "",
		lng         : ""


	};
	
	var style = {
		type       : "circle", /* circle, square */
		filter     : "none",  // none, grayscale, sepia, hue-rotate, brightness, contrast, saturate
		pattern    : "", // url to pattern
		background : "#ede8d2", // background color
		hover      : "#aac83f", // hover color of background
		color      : "#000" // text color
	};

	nex = this;
	nex.opt = jQuery.extend( {}, defaults, options );
	nex.opt.data = [];
	nex.opt.style = jQuery.extend({}, style, options.style);

	for(var i=0, len = options.data.length;i<len;i++)
	{
		nex.opt.data[i] = jQuery.extend({}, data, options.data[i]);

		if (options.data[i].type == "map")
		{
			nex.opt.data[i].zoom = parseInt(options.data[i].zoom);
		}
	}
	
	// boolean values
	nex.isLoaded     = false;
	nex.isAutoplay   = nex.opt.autoplay;
	nex.isThumbnails = nex.opt.thumbnails;
	nex.isBullets    = nex.opt.bullets;
	nex.isBar        = nex.opt.bar;
	nex.isLoadBar    = nex.opt.load_bar;
	nex.isPattern    = (nex.opt.style.pattern.length > 0) ? true : false;
	nex.isVideo      = false;
	nex.isHTML5      = false;
	nex.isImage      = false;
	nex.isMap        = false;
	nex.isLocal      = (nex.opt.view == "local") ? true : false;
	nex.isTouch      = !!('ontouchstart' in window);
	
	// time manipulation
	nex.startTime = null;
	nex.passTime = 0;
	nex.progress = 0;
	
	// other variables
	nex.prevSlide = 0;
	nex.currentSlide = 0;
	nex.size = nex.opt.data.length;
	nex.transitions = ["fade", "slideLeft", "slideRight", "slideTop", "slideBottom","zoom", "rotate", "skew"];
	
	// static embed links
	nex.vimeoEmbed = "http://player.vimeo.com/video/%s?autoplay=0";
	nex.youtubeEmbed = "http://www.youtube.com/v/%s?autoplay=0";
	
	this.setAnimoEffect();
	this.init();
	
	// add touch support
	if(nex.isTouch)
		nex.enableTouch();
		
	// keypress handler
	nex.onKeypress();
}

Nex.prototype = {
	
	init : function() {
	
		nex.displayLoader();
	
		if(nex.isLocal)
		{		
			nex.preloadMarkup();
			nex.preloadStyle();
			
			// set active elements
			nex.initActive();
			nex.makeAppearance();
			
			// on gallery load
			jQuery(window).on('load',function() {
				nex.isLoaded = true;
				
				new Animo({
					el : jQuery("#nex .nex-animo-main").first(),
					duration : nex.opt.transition_speed,
					template : animo.Template.show
				});

				// set the start time of animation
				nex.startTime = new Date();
				_raf( nex.checkState );
				
				// set content type of current slide
				nex.setContentType();
				nex.onContentType();
		
				nex.initLoadBar();
			});
			 
			// on item click go to that slide
			nex.onItemClick();
		}
		
	},
	
	setAnimoEffect : function() {		
		animo.Template.hide = {opacity : [1, 0]};
		animo.Template.show = {opacity : [0, 1]};
		animo.Template.slideLeftHide = {opacity : [1, 0],translateX : [0, -100, "%"]};
		animo.Template.slideLeftShow = {opacity : [0, 1],translateX : [-100, 0, "%"]};
		animo.Template.slideRightHide = {opacity : [1, 0],translateX : [0, 100, "%"]};
		animo.Template.slideRightShow = {opacity : [0, 1],translateX : [100, 0, "%"]};
		animo.Template.slideTopShow = {opacity : [0, 1],translateY : [-100, 0, "%"]};
		animo.Template.slideTopHide = {opacity : [1, 0],translateY : [0, -100, "%"]};
		animo.Template.slideBottomShow = {opacity : [0, 1],translateY : [100, 0, "%"]};
		animo.Template.slideBottomHide = {opacity : [1, 0],translateY : [0, 100, "%"]};
		animo.Template.zoom = {opacity:[0.9,1],scale:[2,1]};
		animo.Template.rotate = {opacity:[0.9,1],rotateY:[-90, 0, "deg"]};
		animo.Template.skew = {opacity:[0.9,1],scale:[0.5, 1],skew:[[20, 20], [0,0], "deg"]};
	},
	
	makeAppearance : function() {
		var thumbnails = jQuery("#nex-thumbnails li");
		if(thumbnails.length > 0)
		{
			new Animo(
				{
					el : jQuery("#nex"),
					template : animo.Template.show
				},
				{
					el : thumbnails,
					gap : -85,
					duration : 800,
					easing : "easeOutBack",
					
					template : {
						scale : [0, 1],
						opacity : [0, 1]
					}
				}
			);
		}
		else
		{
			new Animo(
				{
					el : jQuery("#nex"),
					template : animo.Template.show
				}
			);
		}
	},
	
	/**
	*	Check if the Slide Need to Change
	*	@since 1.0.0
	*	@update 1.1.0
	*/
	checkState : function() {
		nex.passTime = new Date() - nex.startTime;
		nex.progress = nex.passTime / nex.opt.delay;
		
		if(nex.progress >= 1)
		{
			if(!nex.isAutoplay) return;
			nex.nextSlide();
			nex.onChange();
		}
		
		_raf( nex.checkState );
	},
	
	/**
	*	reset all nex variables and states
	*	execute this function every time a slide is change
	*	@since 1.0.0
	*	@update 1.1.0
	*/
	onChange : function() {	
		nex.progress = 0;
		nex.startTime = new Date();

		// go to next slide
		nex.changeMain();
		nex.changeDetails();
		
		// set content type of current slide
		nex.setContentType();
		nex.onContentType();
		
		// reset load bar
		nex.initLoadBar();
		nex.initActive();
	},
	
	onContentType : function() {
		if(nex.isVideo)
		{
			nex.Video.pause();
			nex.Video.play();
		}
		else if(nex.isMap)
		{
			nex.Video.pause();
			
			nex.Map.init();
			nex.Map.clear();
		} 
		else // for images 
		{
			nex.Video.pause();
		}
	},
	
	initLoadBar : function() {
		if(!nex.isLoadBar) return;
		if(!nex.isAutoplay) return; // stop progressbar if autoplay is false
		
		var progress_bar = jQuery("#nex-loadbar-progress");
		
		new Animo({
			el : progress_bar,
			duration : nex.opt.delay,
			
			template : {
				width : [0,100,"%"]
			}
		});
	},
	
	// set && remove active
	initActive : function() {
		// remove active
		nex.removeActive( jQuery("#nex-thumbnails li") ); // for thumbnails
		nex.removeActive( jQuery(".nex-bullet") ); // for bullets
	
		// set active
		nex.setActive( jQuery("#nex-thumbnails li").eq( nex.currentSlide ) ); // for thumbnails
		nex.setActive( jQuery(".nex-bullet").eq( nex.currentSlide ) ); // for bullets
	},
	
	/**
	*	Creating Markup for Main Content FullScreen
	*	@since 1.0.0
	*	@update 1.1.0
	*/
	preloadContentType : function() {
		var markup = "";
		for(var i = 0; i < nex.size; i++)
		{
			// get the content type of current data. Ex: image, video, map
			var contentType = nex.opt.data[i].display;
			var isActive = (i === 0) ? "is-active" : ""; 
			var mainOpacity = "opacity:0;"; 
			
			switch(contentType)
			{
				case "image":
					markup += "<div class='nex-animo-main " + isActive + "' style='"+mainOpacity+"'><div class='nex-main nex-" + nex.opt.style.filter + " is-image' style='background-image:url(" + nex.opt.data[ i ].link + ")'>\
					" + nex.showPattern() + "</div></div>";
					break;
				case "video":
					var videoLink = nex._parseVideo( nex.opt.data[i].url );
					
					if(nex.isHTML5)
					{
						var browser = nex._getBrowser()[0];
						
						if(browser == "MSIE") // Flash Fallback
						{
							markup += "<div class='nex-main nex-animo-main nex-" + nex.opt.style.filter + " is-video " + isActive + "' style='"+mainOpacity+"'></div>";
						}
						else
						{
							markup += "<div class='nex-main nex-animo-main nex-" + nex.opt.style.filter + " is-video " + isActive + "' style='"+mainOpacity+"'>\
							<video src='"+videoLink+"' type='video/mp4' width='100%' height='100%' controls preload></video></div>";
						}
						
						nex.isHTML5 = false;
					}
					else
					{
						markup += "<div class='nex-main nex-animo-main nex-" + nex.opt.style.filter + " is-video " + isActive + "' style='"+mainOpacity+"'>\
						<iframe style='overflow:hidden;height:100%;width:100%' src='" + videoLink + "' width='100%' height='100%' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>";
					}
					break;
				case "map":
					markup += "<div class='nex-main nex-animo-main nex-" + nex.opt.style.filter + " is-map " + isActive + "' id='gmap-" + i + "' style='"+mainOpacity+"'></div>";
					break;
				default:
					break;
			}
		}
		return markup;
	},
	
	// preload Markup of gallery
	preloadMarkup : function() {
		var markup = "<div id='nex' class='nex-" + nex.opt.style.type + "'>";
		
		if(nex.isBar)
		{
			markup += "<div id='nex-bar'>";
				markup += nex.showThumbnails(); // display thumbnails				
				markup += nex.showDetails(); // display title and description
				markup += nex.showBullets(); // display bullets
			markup += "</div>";
		}
		else
		{
			markup += nex.showThumbnails(); // display thumbnails
			markup += nex.showBullets(); // display bullets
		}
		
		markup += nex.preloadContentType(); // display fullscreen content type
		markup += nex.showLoadBar(); // display load bar
		
		markup += "</div>";
		
		jQuery("body").append(markup);
	},
	
	// add style for gallery
	preloadStyle : function() {
		// rgb
		var rgb = nex._hexToRgb(nex.opt.style.background);
	
		var style = "<style type='text/css'>";
		
			style += "#nex-bar,#nex-loadbar,#nex-loadbar-progress {background-color:"+nex.opt.style.background+"}";
			style += "#nex-thumbnails li {border:4px solid "+nex.opt.style.background+";border:4px solid rgba(" + rgb.r +","+ rgb.g +","+ rgb.b + "," + 0.75 + ") }";
			style += "a:hover.nex-bullet, a.nex-bullet.is-active {background-color:"+ nex.opt.style.hover +"}";
			style += "#nex-details {color:"+ nex.opt.style.color +"}";
			
			if(!nex.isBar) // center the thumbnails if no bar active
			{
				var marginLeft = - ( jQuery("#nex-thumbnails").outerWidth(true) / 2 );
				style += "#nex-thumbnails {margin-left:"+marginLeft+"px}";
			}
			
			if(nex.isPattern)
				style += "#nex-pattern {background:url("+nex.opt.style.pattern+")}";
		
		style += "</style>";
		
		jQuery("body").append(style);
	},
	
	// display elements
	displayLoader : function() {
		var nex_loader = '<div id="nex-preloader"><div id="nex-preloader-1"></div><div id="nex-preloader-2"></div><div id="nex-preloader-3"></div><div id="nex-preloader-4"></div></div>';
		jQuery("body").append( nex_loader );
	},
	
	// show the active image or video fullscreen	
	showLoadBar : function() {
		return (nex.isLoadBar) ? "<div id='nex-loadbar'></div><div id='nex-loadbar-progress'></div>" : "";
	},
	
	// show details - title and description (under thumbnails on bar)
	showDetails : function() {
		return "<div id='nex-details'><span id='nex-details-title'>" + nex.getTitle() + "</span><span id='nex-details-description'> " + nex.getDescription() + "</span></div>";
	},
	
	showPattern : function() {
		return (nex.isPattern) ? "<div id='nex-pattern'>&nbsp;</div>" : "";
	},
	
	showBullets : function() {
		if(!nex.isBullets) return "";
		var markup = "";
		
		markup += "<div id='nex-bullets'>";
			for(i = 0, len = nex.opt.data.length; i < len; i++)
			{
				var url = nex.opt.data[i].url || "#";
				markup += "<a href='" + url + "' class='nex-bullet' \
						data-nex-title='" + nex.opt.data[i].title + "'\
						data-nex-description='" + nex.opt.data[i].description + "'\
						data-nex-display='" + nex.opt.data[i].display + "'\
						data-nex-link='" + nex.opt.data[i].link + "'\
						></a>";
			}
		markup += "</div>";
		
		return markup;
	},
	
	showThumbnails : function() {
		if(!nex.isThumbnails) return "";
		var markup = "";
		
		markup += "<ul id='nex-thumbnails'>";
			for(i = 0, len = nex.opt.data.length; i < len; i++)
			{
				switch(nex.opt.data[i].display)
				{
					case "image":
					case "video":
						markup += "<li data-nex-display='" + nex.opt.data[i].display + "' data-nex-title='" + nex.opt.data[i].title + "' data-nex-description='" + nex.opt.data[i].description + "'>";
							markup += "<a href='" + nex.opt.data[i].url + "'><img class='nex-" + nex.opt.style.filter + "' src='" + nex.opt.data[i].thumb + "' alt='" + nex.opt.data[i].alt + "' width='125' height='125' /></a>";
						markup += "</li>";
						break;
					case "map":
						markup += "<li data-nex-display='" + nex.opt.data[i].display + "' data-nex-title='" + nex.opt.data[i].title + "' data-nex-description='" + nex.opt.data[i].description + "'>";
							markup += "<a href='#'><img class='nex-" + nex.opt.style.filter + "' src='" + nex.opt.data[i].thumb + "' width='125' height='125' /></a>";
						markup += "</li>";
						break;
					default:
						break;
				}
			}
		markup += "</ul><div class='clear'></div>";
		
		return markup;
	},
	
	// setters
	// set content type of current slide. Ex: image, video, map
	setContentType : function() {
		contentType = nex.opt.data[ nex.currentSlide ].display;
		
		switch(contentType)
		{
			case "video":
				nex.isImage = false;
				nex.isVideo = true;
				nex.isMap = false;
				break;
			case "map":
				nex.isImage = false;
				nex.isVideo = false;
				nex.isMap = true;
				break;
			default: // image
				nex.isImage = true;
				nex.isVideo = false;
				nex.isMap = false;
		}
	},
	
	// getters
	getContentType : function() {
		return nex.opt.data[ nex.currentSlide ].display;
	},
	
	getTitle : function() {
		return nex.opt.data[ nex.currentSlide ].title;
	},
	
	getDescription : function() {
		return nex.opt.data[ nex.currentSlide ].description;
	},
	
	onItemClick : function() {
		jQuery("#nex-thumbnails li, .nex-bullet").on("click", function() {
			nex.goTo( jQuery(this).index() );
			return false;
		});
	},
	
	changeMain : function() {	
		nex.execTransition();
	},
	
	changeDetails : function() {
		jQuery("#nex-details-title").text( nex.getTitle() + " " );
		jQuery("#nex-details-description").html( nex.getDescription() );
	},
	
	// execute change slider effect
	execTransition : function() {
		var previousSlide = jQuery("#nex .nex-animo-main").eq( nex.prevSlide );
		var activeSlide = jQuery("#nex .nex-animo-main").eq( nex.currentSlide );
		activeSlide.addClass("is-active");
		previousSlide.removeClass("is-active");
		
		if(nex.opt.transition == "random")
		{
			var transitionType = nex.transitions [ nex.getRandom(0, nex.transitions.length) ];
		}
		else
		{
			var transitionType = nex.opt.transition;
		}
		
		switch(transitionType)
		{
			case "none":
				activeSlide.addClass("is-active").css("opacity",1).siblings("#nex .nex-animo-main").removeClass("is-active").css("opacity", 0);
				break;
			case "fade":				
				new Animo(
					{
						el : previousSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.hide
					},
					{
						el : activeSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.show
					}
				);
				break;
			case "slideLeft":				
				new Animo(
					{
						el : previousSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.slideRightHide
					},
					{
						el : activeSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.slideLeftShow
					}
				);
				break;
			case "slideRight":
				new Animo(
					{
						el : previousSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.slideLeftHide
					},
					{
						el : activeSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.slideRightShow
					}
				);
				break;
			case "slideTop":
				new Animo(
					{
						el : previousSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.slideBottomHide
					},
					{
						el : activeSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.slideTopShow
					}
				);
				break;
			case "slideBottom":
				new Animo(
					{
						el : previousSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.slideTopHide
					},
					{
						el : activeSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.slideBottomShow
					}
				);
				break;
			case "zoom":
				new Animo(
					{
						el : previousSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.hide
					},
					{
						el : activeSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.zoom
					}
				);
				break;
			case "rotate":
				new Animo(
					{
						el : previousSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.hide
					},
					{
						el : activeSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.rotate
					}
				);
				break;
			case "skew":
				new Animo(
					{
						el : previousSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.hide
					},
					{
						el : activeSlide,
						duration : nex.opt.transition_speed,
						template : animo.Template.skew
					}
				);
				break;
		}
	},
	
	getRandom : function( min, max )
	{
		return Math.floor( Math.random() * (max - min) + min );
	},
	
	// set active, remove active
	setActive : function(el) {
		el.addClass("is-active");
	},
	
	removeActive : function(el) {
		el.removeClass("is-active");
	},
	
	// nex api
	/**
	*	@since 1.0.0
	*	@update 1.1.0
	*/
	goTo : function( index ) {
		nex.prevSlide = nex.currentSlide;
		nex.currentSlide = index;
		nex.onChange();
	},
	
	/**
	*	Go to Next Slide
	*	@since 1.0.0
	*	@update 1.1.0
	*/
	nextSlide : function() {
		nex.prevSlide = nex.currentSlide;
		nex.currentSlide++;
		if(nex.currentSlide == nex.size) // go to first if no next slide
			nex.currentSlide = 0;
			
		nex.onChange();
	},
	
	/**
	*	Go to Previous Slide
	*	@since 1.0.0
	*	@update 1.1.0
	*/
	previousSlide : function() {
		nex.prevSlide = nex.currentSlide;
		nex.currentSlide--;
		if(nex.currentSlide < 0) // go to last slide if no prev
			nex.currentSlide = nex.size - 1;
			
		nex.onChange();
	},
	
	// Video Class Handler
	Video : {
	
		play : function() {
			if(nex.opt.autoplay)
				nex.isAutoplay = false;
		
			var link = jQuery(".nex-main").eq( nex.currentSlide ).find("iframe");
			
			if(link.length == 1)
			{
				var src = link.attr("src");
				var src = src.slice(0, src.length - 1) + 1;
				
				// set source for the link
				link.attr("src", src);
			}
			else
			{
				var html5Video = jQuery(".nex-main").eq( nex.currentSlide ).find("video");
				if(html5Video.length == 1)
				{
					html5Video = html5Video[0];
					html5Video.play();
				}
				else // for video flash fallback
				{
					var data = jQuery(".nex-main").eq( nex.currentSlide );
					var video = nex.opt.data[ nex.currentSlide ].url;
					data.html('<object width=\"100%\" height=\"100%\"> <param name=\"movie\" value=\"http://fpdownload.adobe.com/strobe/FlashMediaPlayback.swf\"></param><param name=\"flashvars\" value=\"src=http%3A%2F%2Fnex.riseledger.com%2Fupload%2Fslider%2Fimages%2Fexample.mp4\"></param><param name=\"allowFullScreen\" value=\"true\"></param><param name=\"allowscriptaccess\" value=\"always\"></param><embed src=\"http://fpdownload.adobe.com/strobe/FlashMediaPlayback.swf\" type=\"application/x-shockwave-flash\" allowscriptaccess=\"always\" allowfullscreen=\"true\"  width=\"100%\" height=\"100%\" flashvars=\"src='+video+'&autoPlay=true\"></embed></object>');
					
				}
			}
		},
		
		pause : function() {
			if(nex.opt.autoplay)
				nex.isAutoplay = true;
		
			var link = jQuery(".nex-main").eq( nex.prevSlide ).find("iframe");
			
			if(link.length == 1)
			{
				var src = link.attr("src");
				var src = src.slice(0, src.length - 1) + 0;
				
				// set source for the link
				link.attr("src", src);
			}
			else
			{
				var html5Video = jQuery(".nex-main").eq( nex.prevSlide ).find("video");
				if(html5Video.length == 1)
				{
					html5Video = html5Video[0];
					html5Video.pause();
				}
				else // for video flash fallback
				{
					jQuery(".nex-main").eq( nex.prevSlide ).html("");
				}
			}
		}
	},
	
	// Map Class Handler
	Map : {
		
		// init the map
		init : function() {
			var myLatlng = new google.maps.LatLng( nex.opt.data[ nex.currentSlide ].lat, nex.opt.data[ nex.currentSlide ].lng );
			
			var mapOptions = {
				zoom: nex.opt.data[ nex.currentSlide ].zoom,
				center: myLatlng,
				mapTypeId: nex.Map.getType( nex.opt.data[ nex.currentSlide ].type )
			}

			var myMap = new google.maps.Map(document.getElementById( "gmap-" + nex.currentSlide ), mapOptions);
			
			nex.Map.showMarker( myMap, myLatlng ); // display marker on map
		},
		
		// display the marker point on the map
		showMarker : function( myMap, myLatlng ) {
			if(!nex.opt.data[nex.currentSlide].marker) return "";
			
			var infowindow = new google.maps.InfoWindow({
				content: nex.opt.data[nex.currentSlide].infowindow
			});

			var marker = new google.maps.Marker({
				position: myLatlng,
				map: myMap
			});
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(myMap,marker);
			});
		},
		
		// return map type
		getType : function( type ) {
			var myType = google.maps.MapTypeId.ROADMAP;
			type = type.toUpperCase();
			switch(type)
			{
				case "SATELLITE":
					myType = google.maps.MapTypeId.SATELLITE;
					break;
				case "HYBRID":
					myType = google.maps.MapTypeId.HYBRID;
					break;
				case "TERRAIN":
					myType = google.maps.MapTypeId.TERRAIN;
					break;
				default:
					myType = google.maps.MapTypeId.ROADMAP;
					break;
			}
			return myType;
		},
		
		// use this function to clear other maps on the same page
		clear : function() {
			jQuery(".nex-main").eq( nex.currentSlide ).siblings(".is-map").html("").removeAttr("style");
		}
	},
	
	/**
	*	Touch Handler
	*	@since 1.1.0
	*/
	enableTouch : function() {
		var start = {};
		var delta = {};
		
		jQuery("#nex").on("touchstart touchmove touchend", function(ev) {
			if(jQuery(ev.target).hasClass("nex-main"))
				ev.preventDefault(); // canceling default behavior such as scrolling
		
			var el = jQuery(this);
			var activeSlide = el.find(".nex-animo-main.is-active");
			var activeNext = (nex.currentSlide == nex.size - 1) ? jQuery(this).find(".nex-animo-main").first() : activeSlide.next();
			var activePrev = (nex.currentSlide == 0) ? jQuery(this).find(".nex-animo-main").eq( nex.size - 1) : activeSlide.prev();
			var width = el.width(); 
			
			switch(ev.type)
			{
				case "touchstart":
					var touches = event.targetTouches[0];
					coords = {
						x : touches.pageX,
						y : touches.pageY,
						time : +new Date
					};

					// reset delta and end measurements
					delta = {};
					break;
				case "touchmove":
					var touches = event.targetTouches[0];
					delta = {
						x : touches.pageX - coords.x,
						y : touches.pageY - coords.y
					}
					
					delta.x = 
						delta.x / 
							( (!nex.currentSlide && delta.x > 0		// if first slide and sliding left
								|| nex.currentSlide == nex.size - 1	// or if last slide and sliding right
								&& delta.x < 0						// and if sliding at all
							) ?                      
							( Math.abs(delta.x) / width + 1 )		// determine resistance level
							: 1 );									// no resistance if false
					
					
					var scrollNext = width + delta.x;
					var scrollPrev = -width + delta.x;
					// current slide
					jQuery(activeSlide).css({
						"-webkit-transform" : "translateX( " + delta.x + "px)",
						"transform" : "translateX( " + delta.x + "px)"
					});
					
					// next slide
					jQuery(activeNext).css({
						opacity : 1,
						"-webkit-transform" : "translateX( " + scrollNext + "px)",
						"transform" : "translateX( " + scrollNext + "px)"
					});
					
					// previous slide
					jQuery(activePrev).css({
						opacity : 1,
						"-webkit-transform" : "translateX( " + scrollPrev + "px)",
						"transform" : "translateX( " + scrollPrev + "px)"
					});
					
					break;
				case "touchend":
					// measure duration
					var duration = +new Date - coords.time;
					
					// determine if slide attempt triggers next/prev slide
					var isValidSlide = 
						duration < 500					// if slide duration is less than 250ms
						&& Math.abs(delta.x) > 20;		// and if slide amt is greater than 20px
						
					// determine direction of swipe (true:right, false:left)
					var direction = delta.x < 0;						
					if(isValidSlide) // execute touch slide
					{
						if(direction) // slide to next
						{
							var activeX = nex.getSwipe( activeSlide ); // active slide
							var nextX = nex.getSwipe( activeNext ); // next slide
							
							if(activeSlide.length == 0 || activeNext.length == 0) return; // prevent from causing an error if null
							
							// set prevSlide, currentSlide
							nex.prevSlide = nex.currentSlide;
							nex.currentSlide = (nex.currentSlide == nex.size - 1) ? 0 : nex.currentSlide + 1;
							nex.onChange();
							
							// execute swipe
							new Animo(
								{
									el : activeSlide,
									duration : nex.opt.transition_speed,
									template : {
										opacity : [1,0],
										translateX : [activeX, - width, "px"]
									}
								},
								{
									el : activeNext,
									duration : nex.opt.transition_speed,
									template : {
										translateX : [width + activeX, 0, "px"]
									}
								}
							);
						}
						else // slide to previous
						{
							var activeX = nex.getSwipe( activeSlide ); // active slide
							var prevX = nex.getSwipe( activePrev ); // prev slide
							
							if(activeSlide.length == 0 || activePrev.length == 0) return; // prevent from causing an error if null
							
							// set prevSlide, currentSlide
							nex.prevSlide = nex.currentSlide;
							nex.currentSlide = (nex.currentSlide == 0) ? nex.size - 1 : nex.currentSlide - 1;
							nex.onChange();
							
							// execute swipe
							new Animo(
								{
									el : activeSlide,
									duration : nex.opt.transition_speed,
									template : {
										opacity : [1,0],
										translateX : [activeX, width, "px"]
									}
								},
								{
									el : activePrev,
									duration : nex.opt.transition_speed,
									template : {
										translateX : [prevX , 0, "px"]
									}
								}
							);
						}
					}
					else // restore default slides position, invalid slide
					{
						if(direction) // restore - slide to next
						{
							var activeX = nex.getSwipe( activeSlide ); // active slide
							var nextX = nex.getSwipe( activeNext ); // next slide
							
							if(activeSlide.length == 0 || activeNext.length == 0) return; // prevent from causing an error if null
							
							// restore swipe
							new Animo(
								{
									el : activeSlide,
									duration : nex.opt.transition_speed,
									template : {
										translateX : [activeX, 0, "px"]
									}
								},
								{
									el : activeNext,
									duration : nex.opt.transition_speed,
									template : {
										opacity : [1, 0],
										translateX : [width + activeX, width, "px"]
									}
								}
							);
						}
						else // restore - slide to previous
						{
							var activeX = nex.getSwipe( activeSlide ); // active slide
							var prevX = nex.getSwipe( activePrev ); // prev slide
							
							if(activeSlide.length == 0 || activePrev.length == 0) return; // prevent from causing an error if null
							
							// restore swipe
							new Animo(
								{
									el : activeSlide,
									duration : nex.opt.transition_speed,
									template : {
										translateX : [activeX, 0, "px"]
									}
								},
								{
									el : activePrev,
									duration : nex.opt.transition_speed,
									template : {
										opacity : [1,0],
										translateX : [prevX , - width, "px"]
									}
								}
							);
						}
					}
					break;
			}
		});
	},
	
	/**
	*	Return a number represented the swipe value
	*	@since 1.1.0
	*/
	getSwipe : function( el ) {
		var style = el.attr("style");
		var swipe = "0";
		var patt = /translateX\((-)?\d+/g;
		if(patt.test(style))
			swipe = style.match( patt )[0];
			
		return parseInt( swipe.replace("translateX(", "") );
	},
	
	/**
	*	Keyboard click handle left - right slide change
	*	@since 1.1.0
	*/
	onKeypress : function() {
		jQuery(window).keydown(function(ev) {
			if(ev.keyCode == 37) // left arrow
			{
				nex.previousSlide();
			}
			
			if(ev.keyCode == 39) // right arrow
			{
				nex.nextSlide();
			}
		});
	},
	
	// internal functionality
	_hexToRgb : function( hex ) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	},
	
	_parseVideo : function( url ) {
		var videoId = "";
		var videoLink = "";
		
		if( /youtube.com/.test( url ) )
		{
			videoId = nex._parseYoutube( url );
			videoLink = nex.youtubeEmbed.replace("%s", videoId);
		}			
		else if( /vimeo.com/.test( url ) )
		{
			videoId = nex._parseVimeo( url );
			videoLink = nex.vimeoEmbed.replace("%s", videoId);
		}
		else
		{
			videoLink = url;
			nex.isHTML5 = true;
		}
			
		return videoLink;
	},
	
	_parseYoutube : function( url ) {
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
		var match = url.match(regExp);
		if (match&&match[7].length==11){
			return match[7];
		}
	},
	
	_parseVimeo : function( url ) {
		var m = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/);
		return m ? m[2] || m[1] : null;
	},
	
	_getBrowser : function() {
		var N= navigator.appName, ua= navigator.userAgent, tem;
		var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
		M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
		return M;
	}
	
}
