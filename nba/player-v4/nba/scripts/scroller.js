(function (a) {
	a.fn.scroller = function(params) {

		var height = 300;
		var width = "auto";

		var dragVertical = true;
		var dragHorizontal = true;
		
		var barWidth = 4;
		var barHeight = 4;
		
		var mouseWheelOrientation = "vertical";
		
		if ( params.height != undefined ) height = params.height;
		if ( params.width != undefined ) width = params.width;
		if ( params.isVertical!= undefined ) dragVertical = params.isVertical;
		if ( params.isHorizontal != undefined ) dragHorizontal = params.isHorizontal;
		if ( params.mouseWheelOrientation != undefined ) mouseWheelOrientation = params.mouseWheelOrientation;

		var $root = $(this);
		$root.css("height", height+'px');
		
		var $content = $(".content", $root);
		var contentHeight = $content.height();
		var contentWidth = $content.width();
		var contentPositionY = 0;
		var contentPositionYto = 0;
		var contentPositionX = 0;
		var contentPositionXto = 0;

		//////
		var positionClicked;
		var positionIni;
		var dragging=false;
		var draggingVertical=false;
		var draggingHorizontal=false;
		//////

		var updatedraggersSize = function(){
			if(contentHeight > height){
				if(dragVertical && $thumb_Y)
				{
					thumbHeight = height / (contentHeight / height);					
					$thumb_Y.css("height", thumbHeight +'px');
					updateScroller();
				}
				if(dragHorizontal && $thumb_X)
				{
					thumbWidth = width / (contentWidth / width);
					$thumb_X.css("width", thumbWidth +'px');
				}
			}
		}		
		
		var updateScroller = function(){
			var realHeight = $track_Y.height();
			if(realHeight != height) $track_Y.css("height", 2 * height - realHeight + 'px');

			realHeight = $thumb_Y.height();
			if(realHeight != thumbHeight) $thumb_Y.css("height", 2 * thumbHeight - realHeight + 'px');
		}

		if(dragVertical & contentHeight > height)
		{
			var $track_Y = $(".trackY", $root);
			var $thumb_Y = $(".thumbY", $root);
			$track_Y.show();
			$thumb_Y.show();
			
			if(!$track_Y.html())
			{
				var scrollBar = '<table class="trackY"><tr><td><div class="top"></div></td></tr><tr><td class="middle"></td></tr><tr><td><div class="bottom"></div></td></tr></table>';
				scrollBar += '<table class="thumbY"><tr><td><div class="thumbtop">&nbsp;</div></td></tr><tr><td class="thumbmiddle"></td></tr><tr><td><div class="thumbbottom">&nbsp;</div></td></tr></table>';
				$root.append(scrollBar);
				$track_Y = $(".trackY", $root);
				$thumb_Y = $(".thumbY", $root);
			}
			
			var thumbHeight;
			var trackHeight = height;

			$track_Y.css("width", barWidth + 'px');
			$track_Y.css("height", height + 'px');

			var draggerVerticalPosition = 0;
			$thumb_Y.css("top", 0 + "px");
			$thumb_Y.css("width", barWidth + 'px');
			
			updateScroller();
			if(!dragHorizontal) updatedraggersSize();
		}
		else
		{
			var $track_Y = $(".trackY", $root);
			var $thumb_Y = $(".thumbY", $root);
			$track_Y.hide();
			$thumb_Y.hide();
		}
		contentPositionY = 0;
		$content.css('top', contentPositionY + "px");
		
		if(dragHorizontal & contentWidth > width)
		{
			var $track_X = $(".trackX", $root);
			var $thumb_X = $(".thumbX", $root);
			
			if(!$track_X.html())
			{
				var scrollBar = '<table class="trackX"><tr><td><div class="left"></div></td><td class="center"></td><td><div class="right"></div></td></tr></table>';
				scrollBar += '<table class="thumbX"><tr><td><div class="thumbleft"></div></td><td class="thumbcenter"></td><td><div class="thumbright"></div></td></tr></table>';
				$root.append(scrollBar);
				$track_X = $(".trackX", $root);
				$thumb_X = $(".thumbX", $root);
			}
		
			var thumbWidth;
			var trackWidth = width;

			var draggerHorizontalPosition = 0;
			$thumb_X.css("left", 0 + "px");
			$thumb_X.css("height", barHeight + 'px');
			
			updatedraggersSize();
		}
		else
		{
			var $track_X = $(".trackX", $root);
			var $thumb_X = $(".thumbX", $root);
			$track_X.hide();
			$thumb_X.hide();
		}
		contentPositionX = 0;
		$content.css('left', contentPositionX + "px");

		var changeDraggerPosition = function(dir){
			if(dir == "vertical" && $thumb_Y){
				if(draggerVerticalPosition < 0) draggerVerticalPosition = 0;
				if(draggerVerticalPosition > (trackHeight - thumbHeight))
					draggerVerticalPosition = (trackHeight - thumbHeight);
				var perc =  draggerVerticalPosition / (trackHeight - thumbHeight);
				contentPositionYto = -(contentHeight - height) * perc;
				 
				$thumb_Y.css("top", draggerVerticalPosition + "px");
			}
			else if(dir == "horizontal" && $thumb_X){
				if(draggerHorizontalPosition < 0) draggerHorizontalPosition = 0;
				if(draggerHorizontalPosition > (trackWidth - thumbWidth))
					draggerHorizontalPosition = (trackWidth - thumbWidth);
				
				var perc =  draggerHorizontalPosition / (trackWidth - thumbWidth);
				contentPositionXto = -(contentWidth - width) * perc;
				
				$thumb_X.css("left", draggerHorizontalPosition + "px");
			}
		}

		
		var drag = function(e){
			var currentPosition;
			var direction = "vertical";
			var dif;
			
			if(draggingVertical){
				currentPosition = e.pageY;
				dif = currentPosition - positionClicked;
				draggerVerticalPosition = (positionIni +  dif);
			}
			else{
				currentPosition = e.pageX;
				direction= "horizontal";
				dif = currentPosition - positionClicked;
				draggerHorizontalPosition = (positionIni + dif);
			}
			
			changeDraggerPosition(direction);
			updateContent();
		}

		if(dragVertical && $track_Y){
			$track_Y.mouseover(function(){ $track_Y.addClass("over"); });
			$track_Y.mouseout(function(){ $track_Y.removeClass("over"); });
		
			$thumb_Y.mouseover(function(){ $thumb_Y.addClass("over"); });
			$thumb_Y.mouseout(function(){ if(!draggingVertical) $thumb_Y.removeClass("over"); });
			
			$thumb_Y.mousedown( function(e) {
				positionClicked = e.pageY;
				positionIni = parseInt( $thumb_Y.css("top") , 10);
				draggingVertical = true;
				
				$(document).bind('mousemove', drag);	
				$(document).mouseup( function(){ 
						$(document).unbind('mousemove');
						draggingVertical = false;
						$thumb_Y.removeClass("over");
				});		
				return false;
			});
			
			$track_Y.click( function(e) {
				var offset = $track_Y.offset();
				draggerVerticalPosition = e.pageY - offset.top;
				
				changeDraggerPosition("vertical");
				updateContent();
				return false;
			});
		}

		if(dragHorizontal && $track_X){
			$track_X.mouseover(function(){ $track_X.addClass("over"); });
			$track_X.mouseout(function(){ $track_X.removeClass("over"); });
		
			$thumb_X.mouseover(function(){ $thumb_X.addClass("over"); });
			$thumb_X.mouseout(function(){ if(!draggingVertical) $thumb_X.removeClass("over"); });
			
			$thumb_X.mousedown( function(e) {
				positionClicked = e.pageX;
				positionIni = parseInt( $thumb_X.css("left") , 10);
				draggingHorizontal = true;
				
				$(document).bind('mousemove', drag);	
				$(document).mouseup( function(){ 
						$(document).unbind('mousemove');
						draggingHorizontal = false;
						$thumb_X.removeClass("over");
				});		
				return false;
			});
			
			$track_X.click( function(e) {
				var offset = $track_X.offset();
				draggerHorizontalPosition = e.pageX - offset.left;
				
				changeDraggerPosition("horizontal");
				updateContent();
				return false;
			});
		}
		
		var updateContent = function(){
			if(dragVertical){
				var mover = Math.round(((contentPositionYto -contentPositionY)));
				contentPositionY += mover;
				$content.css('top', contentPositionY + "px");
			}
			if(dragHorizontal){
				var mover = Math.round(((contentPositionXto - contentPositionX)));
				contentPositionX += mover;
				$content.css('left', contentPositionX + "px");
			}
		}
		$root.mousewheel(function(event, delta) {
			if(mouseWheelOrientation == "vertical"){
				if(contentHeight > height)
				{
					draggerVerticalPosition -= delta*13;
					changeDraggerPosition("vertical");
					updateContent();
				}
				else
				{
					contentPositionY = 0;
					$content.css('top', contentPositionY + "px");
				}
			}
			else{
				if(contentWidth > width)
				{
					draggerHorizontalPosition -= delta * 13;
				changeDraggerPosition("horizontal");
				updateContent();
				}
				else
				{
					contentPositionX = 0;
					$content.css('left', contentPositionX + "px");
				}
			}			
			return false;
		});

    }
})(jQuery);