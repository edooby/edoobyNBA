var $teamBox;

function showSplashDialog()
{
	$("#sgCover>.black").css("height", $(document.body).height()-20);
	$("#sgCover").fadeIn();
}

function hideSplashDialog()
{
	$("#sgCover").fadeOut();
}

function showDemo()
{
	$("#cover>.black").css("height", $(document.body).height()-70);
	$("#cover").fadeIn();
	var rh = $(".infoBox .register>.pDesc").height();
	if(rh != null)
	{
		var dph = $(".infoBox .premium>.pDesc").height();
		$(".infoBox .register>.pDesc").css("height", Math.max(rh, dph)+10);
		$(".infoBox .premium>.pDesc").css("height", Math.max(rh, dph)+10);
	}
	else
		$(".infoBox .premium>.pDesc").css("border", "none");
}
function hideDemo()
{
	$("#cover").fadeOut();
}

function callbackWhatsNew(data)
{
	var $videoBox = $(".videoBox");
	$videoBox.html("");
	$.each(data.response.docs, function(i,val){
		var str = '<div class="videoItem"><div class="normal"><img src="' + locProgramImage + val.image + '"/>';
		str += '<a href="/nba/video/' + val.slug + '" class="desc">' + val.name + '</a>';
		str += '<div>' + formatTime(val.runtime) + '</div></div>';
		str += '<a href="/nba/video/' + val.slug + '" class="bg"></a><a class="playBtn" href="/nba/video/' + val.slug + '"></a></div>';
		$videoBox.append(str);
	});
	$(".addBtn",$videoBox).click(function(){alert("add to playlist")});
	$videoBox.append('<div class="clearDiv"></div>');
}

function getWhatsNew()
{
	var url = solr_prefix + "sort=releaseDate%20desc&json.wrf=callbackWhatsNew&fl=sequence,name,slug,runtime,image,releaseDate&rows=10&q=*:*"
	$.getScript(url);
}