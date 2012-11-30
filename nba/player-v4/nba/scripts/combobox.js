(function (a) {
	a.fn.combobox = function(params) {
		var width;
		var height;
		var dropWidth;
		var dropHeight;
		
		var showScrollBar;
		var dataProvider;
		//var defaultLabel = "Select Favorite Team";
		var labelField = "label";
		
		//
		var selectedItem;
		var $selectedViewItem;
		var initilized;
		//
		
		if ( params.dropHeight != undefined ) dropHeight = params.dropHeight;
		if ( params.showScrollBar != undefined ) showScrollBar = params.showScrollBar;
		if ( params.dataProvider != undefined ) dataProvider = params.dataProvider;
		if ( params.labelField != undefined ) labelField = params.labelField;
		if ( params.selectedItem != undefined ) selectedItem = params.selectedItem;

		var $root = $(this);
		var $container = $(".comboBox", $root);
		var $dropdown = $(".dropdown", $root);
		var $dropdownContent = $(".content", $dropdown);
		var $selectLabel = $(".selectLabel", $root);
		width = this.width();
				
		var updateShownLabels = function(value){
			$selectLabel.html(value);
		}
		
		$.each(dataProvider,function(key, val){
			var str = "";
			$.each(labelField,function(a, b){
				str += val[b] + " ";
			});
			var items = "<a name='"+ key +"'>" + str + "</a>";
			if(selectedItem != undefined && selectedItem == val)
			{
				items = "<a name='"+ key +"' class='selected'>" + str + "</a>";
				updateShownLabels(str);
			}
			$dropdownContent.append(items);
		});
		
		var itemChanged = function(value){
			$root.trigger("changed", value);
		}
		$container.mousedown(function(e) {
			e.stopPropagation();
			$(document).bind('mousedown', function(e){
				$container.removeClass("opened");
				$(document).unbind('mousedown');
			});
			if($container.hasClass("opened")) $container.removeClass("opened");
			else
			{
				$container.addClass("opened");
				if(!initilized && showScrollBar && dropHeight)
				{
					initilized = true;
					$dropdown.css("height", dropHeight + "px");
					$(".dropdown .scrollerContainer").scroller({ width:width, height:dropHeight, isHorizontal:false });
				}
			}
		});
		
		$dropdownContent.children().each(function(){	
			$(this).mousedown(function(e){ 
				e.stopPropagation();
				$container.removeClass("opened");
				if($selectedViewItem == $(this)) return;
				if($selectedViewItem) $selectedViewItem.removeClass("selected");
				$(this).addClass("selected");
				$selectedViewItem = $(this);
				updateShownLabels($(this).html());
				var idx = $(this).attr("name");//$dropdownContent.children().index($(this));
				var selectedItem = dataProvider[idx];
				itemChanged(new Array(idx, selectedItem));
			});
		});
	}
})(jQuery);