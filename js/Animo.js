/*!
* Animo JavaScript Library v1.0.0
* @author      : Rise Ledger
* @site        : http://riseledger.com
* @download    : https://github.com/RiseLedger/Animo
* @license     : Released under the MIT license
* @version     : 1.0.0 Official Release
* @copyright   : 2013
* @description : Use this library to animate the elements on page.
*/

function Animo() {

	rl = this;
	rl._addSupport(); // for older browsers

	rl.opt = arguments; // passed object

	// default values
	rl.len = arguments.length; // object length
	rl._objInfo = new Array( rl.len ); // hold all info of each object
	rl._globalInfo = {
		delay : 0,
		length : 0,
		isDone : 0
	}; // hold global information, when to start animation, for how long

	// browser vendor
	rl.vendor = rl._setVendor();

	// 18 css3 properties, 2D || 3D Transform
	rl._css3Transforms = ["translate", "translateX", "translateY", "translateZ", "translate3d", "scale", "scaleX", "scaleY", "scaleZ", "scale3d", "rotate", "rotateX", "rotateY", "rotateZ", "rotate3d", "skew", "skewX", "skewY"];
	rl._specialProp = ["color", "background"]; // text-fade to be included in future

	for(var i = 0; i < rl.len; i++)
	{
		rl._objInfo[i] = {};
		rl._objInfo[i].isEnd = false;
		rl._objInfo[i].isDone = 0;
		rl._objInfo[i].isObj = (rl.opt[i].el.length == void 0) ? false : true;
		rl._objInfo[i].easing = rl.opt[i].easing || "linear";
		rl._objInfo[i].delay = rl.opt[i].delay || 0;
		rl._objInfo[i].loop = rl.opt[i].loop || 1; // -1 for infinite loop
		rl._objInfo[i].gap = rl.opt[i].gap || 0; // gap between stack execution in percentage
		rl._objInfo[i].callback = rl.opt[i].callback || false;
		rl._objInfo[i].duration = rl.opt[i].duration || 1000;
		rl._objInfo[i].template = rl.opt[i].template;

		// objects info push, when start, end of animation for each element
		rl._objInfo[i].length = rl.opt[i].el.length || 1;
		rl._objInfo[i].els = new Array( rl._objInfo[i].length );
		for(var j = 0; j < rl._objInfo[i].length; j++)
		{
			rl._objInfo[i].els[j] = {};
			rl._objInfo[i].els[j].el	= (rl._objInfo[i].isObj) ? rl.opt[i].el[j] : rl.opt[i].el;

			if(j == 0)
			{
				rl._objInfo[i].els[j].startTime = new Date().getTime() + rl._objInfo[i].delay;
			}
			else
			{
				rl._objInfo[i].els[j].startTime = rl._objInfo[i].els[j - 1].startTime + ( rl._objInfo[i].duration + rl._getGap(rl._objInfo[i].duration, rl._objInfo[i].gap) );
			}
			rl._objInfo[i].els[j].isEnd = false;
		}

		// set global delay
		if(i == 0)
		{
			rl._globalInfo.delay = rl._objInfo[i].delay;
		}
		else
		{
			rl._globalInfo.delay = (rl._globalInfo.delay <= rl._objInfo[i].delay) ? rl._globalInfo.delay : rl._objInfo[i].delay;
		}

		rl._globalInfo.length += rl._objInfo[i].length;
	}

	// call the animation
	rl._animo();
}

Animo.prototype = {
	_animo : function() {

		var objInfo = rl._objInfo,
			globalInfo = rl._globalInfo;

		// call animation first time
		setTimeout(function() {
			_raf(step);
		}, globalInfo.delay);

		function step() {
			var currentTime = new Date().getTime();

			for(var i = 0; i < objInfo.length; i++) // implement another loop for each individual element to check when to start !!!
			{
				for(var j = 0; j < objInfo[i].els.length; j++)
				{
					if(currentTime < objInfo[i].els[j].startTime) // waiting for animation start
						continue;

					if(objInfo[i].els[j].isEnd) // skip elements animation if it is already done
						continue;

					var passTime = currentTime - objInfo[i].els[j].startTime;
					var p = passTime / objInfo[i].duration;

					if (p > 1)
					{
						p = 1;
					}

					if(p == 1)
					{
						var delta = 1;
					}
					else
						var delta = rl.Easing[objInfo[i].easing](p, passTime, 0, 1, objInfo[i].duration); // calculate delta

					// new style
					// (to-from) * delta + from + unit
					var newStyle = rl.getStyle( objInfo[i].template, delta );
					objInfo[i].els[j].el.cssText != void 0 ? objInfo[i].els[j].el.style.cssText = newStyle : objInfo[i].els[j].el.setAttribute('style',newStyle); // add style to the element

					if (p == 1) {
						objInfo[i].els[j].isEnd = true;
						objInfo[i].isDone++;
						globalInfo.isDone++;

						if(objInfo[i].isDone == objInfo[i].length)
						{
							objInfo[i].isEnd = true;

							if(objInfo[i].callback)
								objInfo[i].callback();
						}
					}
				}
			}

			globalInfo.isDone == globalInfo.length ? _caf(step) : _raf(step);
		};
	},

	// return element style that need to be applied
	getStyle : function( template, delta ) {
		var style = "";
		var css3prefix = rl.vendor + "transform:";
		var css3style = "";
		if(typeof Object.keys == "function") // use this version for speed acceleration
		{
			Object.keys(template).forEach(function(key) {

				var buildStyle = rl._buildStyle(template, key, style, css3style, delta);
				style = buildStyle[0];
				css3style = buildStyle[1];

			});
		}
		else
		{
			for(var key in template)
			{
				var buildStyle = rl._buildStyle(template, key, style, css3style, delta);
				style = buildStyle[0];
				css3style = buildStyle[1];
			}
		}

		// if css3 transform exists add it to the style
		if(css3style.length > 0)
		{
			style += css3prefix + css3style + ";";
		}

		return style;
	},

	// build style function
	_buildStyle : function(template, key, style, css3style, delta) {

		if(typeof template[key][0].length == "undefined")
		{
			var from = template[key][0],
				to = template[key][1],
				unit = template[key][2] == void 0 ? "" : template[key][2],
				newValue = (to-from) * delta + from + unit;
		}
		else // for array from - to values
		{
			var len = template[key][0].length;
			var last = len - 1;
			var unit = template[key][2] == void 0 ? "" : template[key][2];
			var newValue = "";
			var tempUnit = "";

			if(key == "rotate3d")
			{
				var tempUnit = unit;
				unit = "";
			}

			for(var z = 0; z < len; z++)
			{
				if(last == z)
					newValue += (template[key][1][z] - template[key][0][z]) * delta + template[key][0][z] + unit;
				else
					newValue += (template[key][1][z] - template[key][0][z]) * delta + template[key][0][z] + unit + ",";
			}

			if(key == "rotate3d")
			{
				newValue += "," + tempUnit;
			}
		}

		if(rl._inArray(key, rl._css3Transforms)) // css3 property
		{
			css3style += key + "("+ newValue +") ";
		}
		else if(rl._inArray(key, rl._specialProp)) // special properties animation
		{
			switch(key)
			{
				case "background":
					var bgColor = rl._backgroundAnimo(template[key], delta);
					style += "background-color:" + bgColor + ";";
					break;
				case "color":
					var color = rl._colorAnimo(template[key], delta);
					style += "color:" + color + ";";
					break;
			}
		}
		else // simple property
		{
			style += key + ":" + newValue + ";";
		}

		return [style, css3style];
	},

	/*
		Return gap value
	*/
	_getGap : function(duration, gapValue) {
		return (duration * gapValue) / 100;
	},

	// check if a value is in array
	_inArray : function(value, arr) {
		return (arr.indexOf(value) != -1);
	},

	// add different support for old browser
	_addSupport : function() {
		// Add ECMA262-5 Array methods if not supported natively
		// indexOf support add
		if (!('indexOf' in Array.prototype)) {
			Array.prototype.indexOf= function(find, i /*opt*/) {
				if (i===undefined) i= 0;
				if (i<0) i+= this.length;
				if (i<0) i= 0;
				for (var n= this.length; i<n; i++)
					if (i in this && this[i]===find)
						return i;
				return -1;
			};
		}
	},

	_getBrowser : function() {
		var N= navigator.appName, ua= navigator.userAgent, tem;
		var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
		M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
		return M;
	},

	_setVendor : function() {
		var v = "";
		var browser = rl._getBrowser();
		switch(browser[0])
		{
			case "Chrome":
				v = "-webkit-";
				break;
			case "MSIE":
				v = (browser[1] == 9.0) ? "-ms-" : "";
				break;
			default:
				v = "";
				break
		}

		return v;
	},

	// hex to rgb
	_toRgb : function( hex ) {
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)] : null;
	},

	// special animation are defined below
	_colorAnimo : function(values, delta) {
		var from = typeof values[0] == "string" ? rl._toRgb( values[0] ) : values[0],
			to = typeof values[1] == "string" ? rl._toRgb( values[1] ) : values[1];

		return 'rgb(' +
			Math.max(Math.min(parseInt((delta * (to[0]-from[0])) + from[0], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((delta * (to[1]-from[1])) + from[1], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((delta * (to[2]-from[2])) + from[2], 10), 255), 0) + ')';
	},

	_backgroundAnimo : function(values, delta) {
		var from = typeof values[0] == "string" ? rl._toRgb( values[0] ) : values[0],
			to = typeof values[1] == "string" ? rl._toRgb( values[1] ) : values[1];

		return 'rgb(' +
			Math.max(Math.min(parseInt((delta * (to[0]-from[0])) + from[0], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((delta * (to[1]-from[1])) + from[1], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((delta * (to[2]-from[2])) + from[2], 10), 255), 0) + ')';
	},

	Easing : {
		linear : function(p, t, a, b, d) {
			return a + b * p;
		},

		swing : function(p, t, a, b, d) {
			return (-Math.cos(p * Math.PI) / 2 + 0.5) * b + a;
		},

		easeInQuad : function(p, t, a, b, d) {
			return b * (t /= d) * t + a;
		},

		easeOutQuad : function(p, t, a, b, d) {
			return -b * (t /= d) * (t - 2) + a;
		},

		easeInOutQuad : function(p, t, a, b, d) {
			if ((t /= d / 2) < 1) return b / 2 * t * t + a;
            return -b / 2 * (--t * (t - 2) - 1) + a;
		},

		easeInCubic : function(p, t, a, b, d) {
			return b * (t /= d) * t * t + a;
		},

		easeOutCubic : function(p, t, a, b, d) {
			return b * ((t = t / d - 1) * t * t + 1) + a;
		},

		easeInOutCubic : function (p, t, a, b, d) {
            if ((t /= d / 2) < 1) return b / 2 * t * t * t + a;
            return b / 2 * ((t -= 2) * t * t + 2) + a;
        },

		easeInQuart : function(p, t, a, b, d) {
			return b * (t /= d) * t * t * t + a;
		},

		easeOutQuart : function(p, t, a, b, d) {
			return -b * ((t = t / d - 1) * t * t * t - 1) + a;
		},

		easeInOutQuart : function(p, t, a, b, d) {
			if ((t /= d / 2) < 1) return b / 2 * t * t * t * t + a;
            return -b / 2 * ((t -= 2) * t * t * t - 2) + a;
		},

		easeInQuint : function(p, t, a, b, d) {
			return b * (t /= d) * t * t * t * t + a;
		},

		easeOutQuint : function(p, t, a, b, d) {
			return b * ((t = t / d - 1) * t * t * t * t + 1) + a;
		},

		easeInOutQuint : function(p, t, a, b, d) {
			if ((t /= d / 2) < 1) return b / 2 * t * t * t * t * t + a;
            return b / 2 * ((t -= 2) * t * t * t * t + 2) + a;
		},

		easeInSine : function(p, t, a, b, d) {
			return -b * Math.cos(t / d * (Math.PI / 2)) + b + a;
		},

		easeOutSine : function(p, t, a, b, d) {
			return b * Math.sin(t / d * (Math.PI / 2)) + a;
		},

		easeInOutSine : function(p, t, a, b, d) {
			return -b / 2 * (Math.cos(Math.PI * t / d) - 1) + a;
		},

		easeInExpo : function(p, t, a, b, d) {
			return t == 0 ? a : b * Math.pow(2, 10 * (t / d - 1)) + a;
		},

		easeOutExpo : function(p, t, a, b, d) {
			return t == d ? a + b : b * (-Math.pow(2, -10 * t / d) + 1) + a;
		},

		easeInOutExpo : function(p, t, a, b, d) {
			if (t == 0) return a;
            if (t == d) return a + b;
            if ((t /= d / 2) < 1) return b / 2 * Math.pow(2, 10 * (t - 1)) + a;
            return b / 2 * (-Math.pow(2, -10 * --t) + 2) + a;
		},

		easeInCirc : function(p, t, a, b, d) {
			return -b * (Math.sqrt(1 - (t /= d) * t) - 1) + a;
		},

		easeOutCirc : function(p, t, a, b, d) {
			return b * Math.sqrt(1 - (t = t / d - 1) * t) + a;
		},

		easeInOutCirc : function(p, t, a, b, d) {
			if ((t /= d / 2) < 1) return -b / 2 * (Math.sqrt(1 - t * t) - 1) + a;
            return b / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + a;
		},

		easeInElastic : function(p, t, a, b, d) {
			var p = 1.70158, n = 0, m = b;
            if (t == 0) return a;
            if ((t /= d) == 1) return a + b;
            n || (n = d * 0.3);
            m < Math.abs(b) ? (m = b, p = n / 4) : p = n / (2 * Math.PI) * Math.asin(b / m);
            return -(m * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - p) * 2 * Math.PI / n)) + a;
		},

		easeOutElastic : function(p, t, a, b, d) {
			var p = 1.70158, n = 0, m = b;
            if (t == 0) return a;
            if ((t /= d) == 1) return a + b;
            n || (n = d * 0.3);
            m < Math.abs(b) ? (m = b, p = n / 4) : p = n / (2 * Math.PI) * Math.asin(b / m);
            return m * Math.pow(2, -10 * t) * Math.sin((t * d - p) * 2 * Math.PI / n) + b + a;
		},

		easeInOutElastic : function(p, t, a, b, d) {
			var p = 1.70158, n = 0, m = b;
            if (t == 0) return a;
            if ((t /= d / 2) == 2) return a + b;
            n || (n = d * 0.3 * 1.5);
            m < Math.abs(b) ? (m = b, p = n / 4) : p = n / (2 * Math.PI) * Math.asin(b / m);
            if (t < 1) return -0.5 * m * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - p) * 2 * Math.PI / n) + a;
            return m * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - p) * 2 * Math.PI / n) * 0.5 + b + a;
		},

		easeInBack : function(p, t, a, b, d) {
			var n = 1.70158;
			return b * (t /= d) * t * ((n + 1) * t - n) + a;
		},

		easeOutBack : function(p, t, a, b, d) {
			var n = 1.70158;
			return b * ((t = t / d - 1) * t * ((n + 1) * t + n) + 1) + a;
		},

		easeInOutBack : function(p, t, a, b, d) {
			var n = 1.70158;
            if ((t /= d / 2) < 1) return b / 2 * t * t * (((n *= 1.525) + 1) * t - n) + a;
            return b / 2 * ((t -= 2) * t * (((n *= 1.525) + 1) * t + n) + 2) + a;
		},

		easeInBounce : function(p, t, a, b, d) {
			return b - this.easeOutBounce(p, d - t, 0, b, d) + a;
		},

		easeOutBounce : function(p, t, a, b, d) {
			return (t /= d) < 1 / 2.75 ? b * 7.5625 * t * t + a : t < 2 / 2.75 ? b * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + a : t < 2.5 / 2.75 ? b * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + a : b * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + a;
		},

		easeInOutBounce : function(p, t, a, b, d) {
			if (t < d / 2) return this.easeInBounce(p, t * 2, 0, b, d) * 0.5 + a;
            return this.easeOutBounce(p, t * 2 - d, 0, b, d) * 0.5 + b * 0.5 + a;
		}
	}
}

var animo = { Template : {} };

// Animation Heart
var _raf = window.requestAnimationFrame,
	_caf = window.cancelAnimationFrame,
	_p = ["webkit","moz","ms","o"];
var i = _p.length;
while (--i > -1 && !_raf)
{
	_raf = window[_p[i] + "RequestAnimationFrame"];
	_caf = window[_p[i] + "CancelAnimationFrame"] || window[_p[i] + "CancelRequestAnimationFrame"];
}

// for no requestAnimationFrame support
if(!_raf)
{
	_raf = (function() { return function(cb){ window.setTimeout(cb, 1000 / 60); } })();
	_caf = function(id) { clearTimeout(id) };
}
