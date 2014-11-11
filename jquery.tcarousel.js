// tCarousel 1.0 (Tin Trần  - tindl88@gmail.com)
(function ($) {
	var methods = {
		init: function(options){
			var def = {
				visibleItem: 3,
				itemWidth: 250,
				itemHeight: 250,
				itemMarginWidth: 4,
				activeWidth: 362,
				activeHeight: 362,
				activeMarginWidth: 10,
				autoPlay:true,
				pauseOnHover: true,
				duration: 2000,
				animateSpeed: 500,
				easing: "swing",
				nextSelector: ".tCarouselNext",
				prevSelector: ".tCarouselPrev"
			};
			return this.each(function () {
				var opts = $.extend(def, options || {}),
				self = $(this),
				intervalHandle,
				itemOuterWidth = opts.itemWidth + (opts.itemMarginWidth * 2),
				centerIndex = Math.ceil(opts.visibleItem / 2),
				totalItem = self.find(">div").size(),
				currentIndex = centerIndex,
				direction = 1,
				add = (opts.activeWidth  - itemOuterWidth) + (opts.activeMarginWidth * 2);

				// API
				var tCarouselApi = {
					Init: function(){
						if(totalItem < opts.visibleItem + 2){
							for (var i = 0; i < (opts.visibleItem - totalItem) + 2; i++) {
								var a = self.find('>div').eq(i).clone();
								self.append(a);
							};
						}
						currentIndex = centerIndex;
						self.css({ "left": -itemOuterWidth });
						self.parent().width(opts.visibleItem * itemOuterWidth + add);

						self.find('>div').css({
							width: opts.itemWidth,
							height: opts.itemHeight,
							marginLeft: opts.itemMarginWidth,
							marginRight: opts.itemMarginWidth,
							marginTop: (opts.activeHeight - opts.itemHeight) / 2
						}).eq(currentIndex).addClass('active').css({
							width: opts.activeWidth,
							height: opts.activeHeight,
							marginLeft: opts.activeMarginWidth,
							marginRight: opts.activeMarginWidth,
							marginTop: 0
						});
					},
					Controls: function(){
						// Previous
						$(self.parent().find(opts.prevSelector)).bind("click", function(){
							tCarouselApi.Prev();
						});

						// Next
						$(self.parent().find(opts.nextSelector)).bind("click", function(){
							tCarouselApi.Next();
						});
					},
					KeyboardEvent: function(){
						$(document).keydown(function(e){
							switch(e.keyCode)
							{
								case 37: // Left
								tCarouselApi.Prev();
								break;
								case 38: // Up
								tCarouselApi.Prev();
								break;
								case 39: // Right
								tCarouselApi.Next();
								break;
								case 40: // Down
								tCarouselApi.Next();
								break;
							}
						});
					},
					PauseOnHover: function(){
						if(opts.autoPlay){
							self.hover(function() {
								clearInterval(intervalHandle);
							},
							function() {
								intervalHandle = setInterval(function(){tCarouselApi.Next()}, opts.duration);
							}
							);
						}
					},
					Autoplay: function(){
						if(opts.autoPlay){
							intervalHandle = setInterval(function(){tCarouselApi.Next()}, opts.duration);
						}
					},
					PauseSlide: function(){
						clearInterval(intervalHandle);
					},
					Mousewhell: function(){
						self.bind("mousewheel", function(e) {
							if(e.deltaY == 1){
								tCarouselApi.Prev();
							} else {
								tCarouselApi.Next();
							}
						});
					},
					Goto: function(index){
						self.find('>div').removeClass('active').animate({
							width: opts.itemWidth,
							height: opts.itemHeight,
							marginLeft: opts.itemMarginWidth,
							marginRight: opts.itemMarginWidth,
							marginTop:(opts.activeHeight - opts.itemHeight) / 2},
							{
								queue:false,
								duration:opts.animateSpeed
							}).eq(direction === 1 ? centerIndex + 1 : centerIndex - 1).addClass('active').animate({
								width:opts.activeWidth,
								height:opts.activeHeight,
								marginTop:0,
								marginLeft: opts.activeMarginWidth,
								marginRight: opts.activeMarginWidth
							}, {
								queue:false,
								duration:opts.animateSpeed
							});
							if(direction === 1) {
								var leftIndent = parseInt(self.css('left')) - itemOuterWidth;
								self.not(':animated').animate({ left: leftIndent },{queue:false, duration: opts.animateSpeed, specialEasing: { left: opts.easing }, complete:function() {
									self.find(">div:last").after(self.find(">div:first"));
									self.css({"left": -itemOuterWidth});
								}
							});
							} else {
								var leftIndent = parseInt(self.css('left')) + itemOuterWidth;
								self.not(':animated').animate({ left: leftIndent },{queue:false, duration: opts.animateSpeed, specialEasing: { left: opts.easing }, complete:function() {
									self.find(">div:first").before(self.find(">div:last"));
									self.css({"left": -itemOuterWidth});
								}
							});
							}
						},
						Next: function () {
							currentIndex++;
							direction = 1;
							tCarouselApi.Goto(currentIndex);
						},
						Prev: function(){
							currentIndex--;
							direction = -1;
							tCarouselApi.Goto(currentIndex);
						}
					}
				// Init
				tCarouselApi.Init();
				// Keyboard
				tCarouselApi.KeyboardEvent();
				// Mousewhell
				tCarouselApi.Mousewhell();
				// Auto play
				tCarouselApi.Autoplay();
				// Pause on hover
				tCarouselApi.PauseOnHover();
				// Controls
				tCarouselApi.Controls();
			});
}
};
$.fn.tCarousel = function(method) {
	if (methods[method])
		return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	else if (typeof method === 'object' || !method)
		return methods.init.apply(this, arguments);
	else
		$.error('tCarousel: Method ' + method + ' does not exist.');
};
})(jQuery);

