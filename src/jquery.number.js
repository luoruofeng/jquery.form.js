/**
 * input[type=number]
 * Adds up and down controls to increment/decrement a number field
 * Controls: can be clicked once or held down
 */
$.fn.number = function(){

	if($.support.number){
		return $(this);
	}

	// kill iterations to increase the value
	var interval = null;
	$(document.body).mouseup(function(){
		if(interval){
			clearTimeout(interval);
		}
	});

	// check for support for the input[type=number] attribute
	return ( $(this).is("input[type=number],input[data-type=number]") ? $(this) : $("input[type=number],input[data-type=number]", this) ).each(function(){
		// Found

		var el = this,
			w = $(this).outerWidth(),
			min = $(this).attr('min'),
			max = $(this).attr('max'),
			step = parseFloat($(this).attr('step'))||1;

		function increment(change){
			var n = (parseInt($(el).val(),10)||0)+(change*step);
			if(n>max){
				n=max;
			}
			if(n<min){
				n=min;
			}
			$(el).val(n);
		}

		// Listen for up down events on the element
		$(this).bind('keypress', function(e){
			var change = 0;
			if(e.which===40){
				change = -1;
			}
			if(e.which===38){
				change = 1;
			}

			if(!change){
				return;
			}
			increment(change);
		}).bind('blur', function(){
			if( $(this).val() !== $(this).filter('.placeholder').attr('placeholder') ){
				$(this).val( $(this).val().replace(/[^\d\.\-]/ig,'') );
			}
		});

		var $span = $(this)
			// add the controls
			.after('<span class="number" unselectable="on"><span unselectable="on"></span><span unselectable="on"></span></span>')
			.addClass("number")
			.find("+ span.number")
			.attr("unselectable", true)
			.find("span")
			.mousedown(function (e){
				var i = $(this).parent().children().index(this);
				
				(function change(){
					// trigger up down events
					increment(i?-1:1);

					// press'n'hold can be cancelled by keyup (above)
					interval = setTimeout(change,100);
				})();
				
			})
			.parents('span.number');

		// add dimensions
		setTimeout(function(){

			var pR = 0,// parseInt($(el).css("paddingRight")),
				mR = parseInt($(el).css("marginRight"),10);

			$(el).css({
				paddingRight: ( pR + 22 )+"px",
				marginRight: 0,
				width :  ($(el).width() - ($(el).outerWidth() - w)) + "px"
			});

			$span.css({
				marginRight:mR+"px",
				marginTop: ( $(el).offset().top - $span.offset().top ) + 'px'
			});
		},0);
	});
};
