function updateAppsDialog(ua)
{
	var src = null;
	if(ua.indexOf("ipad")!=-1)
	{
		src = locResource + "images/appsipad.jpg";
		g_appsDownload = "https://itunes.apple.com/us/app/2013-nba-game-time/id484672289?ls=1&mt=8";
	}
	else if(ua.indexOf("iphone")!=-1)
	{
		src = locResource + "images/appsiphone.jpg";
		g_appsDownload = "https://itunes.apple.com/us/app/2013-nba-game-time/id484672289?ls=1&mt=8";
	}
	else if(ua.indexOf("android")!=-1)
	{
		if(ua.indexOf("mobile")!=-1)
			src = locResource + "images/appsandroid.jpg";
		else
			src = locResource + "images/appsandroidtab.jpg";
		g_appsDownload = "https://play.google.com/store/apps/details?id=com.nbaimd.gametime.nba2011";
	}
	if(src!=null)
	{
		document.getElementById("appsImage").src = src;
		jQuery(document).ready(function($) {
			showAppsDialog();
		});
	}
}
function showAppsDialog()
{
	$("#appsCover>.black").css("height", $(document.body).height()-20);
	$("#appsCover").fadeIn();
}

function hideAppsDialog(hide)
{
	$("#appsCover").fadeOut();
	if(hide)
		addCookie("nbatvapps", "true");
	else
		addCookie("nbatvapps", "true", true);
}

function openAppsDownload()
{
	if(g_appsDownload!=null)
	{
		addCookie("nbatvapps", "true");
		location.href = g_appsDownload;
	}
}

function openSurvey()
{
	var win = window.open("http://www.nba.com/globalsitecomp/nbatv_survey.html","survey","scrollbars=no,menubar=no,width=346,height=335,resizable=no,toolbar=no,location=no,status=no");
	if(win!=null && !window.closed)
		win.focus();
}
function openEndSurvey()
{
	var win = window.open("https://www.surveymk.com/s/SY25MMF", "survey", "height=350,width=500,scrollbars=yes,menubar=no,toolbar=no,location=no,resizable=yes,status=yes");
	if(win!=null && !window.closed)
		win.focus();
}
//convert 137(seconds) to "2:17"
function formatTime(time)
{
	var t = parseInt(time / 60);
	var sec = time - t * 60;
	sec = sec > 9 ? sec : "0" + sec;
	return t + ":" + sec;
}

//convert "2012-02-04T11:42:33.718" to Date obj
function formatTimeToDate(str)
{
	var d = str.split("T")[0].split("-");
	var t = str.split("T")[1].split(".")[0].split(":");
	var month = d[1] / 1 - 1;
	return new Date(d[0], month, d[2], t[0], t[1], t[2]);
}

//convert Date obj to "2012-02-04T11:42:33.718"
function formatDateToTime(date)
{
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	if (m < 10) m = "0" + m;
	var d = date.getDate();
	if (d < 10) d = "0" + d;
	var hour = date.getHours();
	if (hour < 10) hour = "0" + hour;
	var min = date.getMinutes();
	if (min < 10) min = "0" + min;
	var sec = date.getSeconds();
	if (sec < 10) sec = "0" + sec;
	var mill = date.getMilliseconds();
	if (mill < 10) mill = "00" + mill;
	else if (mill < 100) mill = "0" + mill;
	return y + "-" + m + "-" + d + "T"
					+ hour + ":" + min + ":" + sec + "." + mill;
}

//convert "2012-02-04T11:42:33.718" to "Feb 4, 2012"
function formatVideoDate(releaseDate)
{
	var videoPageMonths = [$("#calendar_month_min_1").html(), $("#calendar_month_min_2").html(), $("#calendar_month_min_3").html(), $("#calendar_month_min_4").html(), $("#calendar_month_min_5").html(), $("#calendar_month_min_6").html(), $("#calendar_month_min_7").html(), $("#calendar_month_min_8").html(), $("#calendar_month_min_9").html(), $("#calendar_month_min_10").html(), $("#calendar_month_min_11").html(), $("#calendar_month_min_12").html()];
	var rd = releaseDate.split("T")[0];
	var y = rd.split('-')[0];
	var m = rd.split('-')[1];
	m = videoPageMonths[m-1];
	var d = rd.split('-')[2] / 1;
	rd = m + ' ' + d + ', ' + y;
	return rd;
}

function formatToDecimal(num)
{
	if(parseFloat(num) == num)
	{
		var ret = Math.round(num * 10) / 10 + "";
		var idx = ret.indexOf(".");
		if(idx < 0) return ret + ".0";
		else return ret;
	}
	else return "";
}

function formatDateToArray(date)
{
	var d = date.split("T")[0];
	return d.split("-");
}

function _showScores(isAuto){}
function _hideScores(isAuto){}
function showhideScore(isAuto)
{
	if(g_prefs.showScores)
	{
		$(".shscore .on").addClass("selected");
		$(".shscore .off").removeClass("selected");
		$(".homescore").css("visibility", "visible");
		$(".awayscore").css("visibility", "visible");
		$(".scoreOnValue").show();
		$(".scoreOffValue").hide();
		_showScores(isAuto);
	}
	else
	{
		$(".shscore .on").removeClass("selected");
		$(".shscore .off").addClass("selected");
		$(".homescore").css("visibility", "hidden");
		$(".awayscore").css("visibility", "hidden");
		$(".scoreOnValue").hide();
		$(".scoreOffValue").show();
		_hideScores(isAuto);
	}
}

function addCookie(name, value, session)
{
	try
	{
		var expdate = "";
		if(session!=true)
		{
			expdate = new Date ();
			expdate.setTime(expdate.getTime()+1000*24*3600*1000);
			expdate = ";expires=" + expdate.toUTCString();
		}
		document.cookie = name + "=" + escape(value) + ";path=" + "/nba/" + expdate;
	}
	catch (e){}
}

function getCookieByName(name)
{
	if (document.cookie!=null && document.cookie!='')
	{
		var the_cookie = document.cookie;
		var crumbs = the_cookie.split(";");
		for(var i=0; i<crumbs.length;i++)
		{
			var curr_crumb = crumbs[i].split("=");
			if (curr_crumb[0].indexOf(name) != -1)
			{
				if (unescape(curr_crumb[1])!=null)			
				{
					return unescape(curr_crumb[1]);
				}
			}
		}
	}
	return null;
}

function formatDay(value)
{
	var ret=null;
	switch(value)
	{
		case 0:
			ret = $("#calendar_day_min_0").html();
			break;
		case 1:
			ret = $("#calendar_day_min_1").html();
			break;
		case 2:
			ret = $("#calendar_day_min_2").html();
			break;
		case 3:
			ret = $("#calendar_day_min_3").html();
			break;
		case 4:
			ret = $("#calendar_day_min_4").html();
			break;
		case 5:
			ret = $("#calendar_day_min_5").html();
			break;
		case 6:
			ret = $("#calendar_day_min_6").html();
			break;
	}
	return ret;
}
function formatMonth(value)
{
	var ret=null;
	switch(value)
	{
		case 0:
			ret = $("#calendar_month_min_1").html();
			break;
		case 1:
			ret = $("#calendar_month_min_2").html();
			break;
		case 2:
			ret = $("#calendar_month_min_3").html();
			break;
		case 3:
			ret = $("#calendar_month_min_4").html();
			break;
		case 4:
			ret = $("#calendar_month_min_5").html();
			break;
		case 5:
			ret = $("#calendar_month_min_6").html();
			break;
		case 6:
			ret = $("#calendar_month_min_7").html();
			break;
		case 7:
			ret = $("#calendar_month_min_8").html();
			break;
		case 8:
			ret = $("#calendar_month_min_9").html();
			break;
		case 9:
			ret = $("#calendar_month_min_10").html();
			break;
		case 10:
			ret = $("#calendar_month_min_11").html();
			break;
		case 11:
			ret = $("#calendar_month_min_12").html();
			break;
	}
	return ret;
}
function checkCompanions()
{
	if(document.getElementById("companionContainer").innerHTML.length==0)
	{
		var ord = Math.random()*10000000000000000;
		document.getElementById("companionContainer").innerHTML = '<a href="http://ad.doubleclick.net/jump/desktop.dart/video_default;sz=300x250;ord='+ord+'?" target="_blank"><img src="http://ad.doubleclick.net/ad/desktop.dart/video_default;sz=300x250;ord='+ord+'?" width="300" height="250" border="0"></a>';
	}
}
function iptvShowCompanions(playerX, playerY, companions)
{
	for(var i=0;i<companions.length;i++)
	{
		var adsize = companions[i][0];
		switch(adsize)
		{
		case "300x250":
			var strAdHTML = "";
			var companion = companions[i];
			if("iframe"==companion[1] && companion[2]!=null)
			{
				strAdHTML = "<iframe id='jtvshlIFrame' width='300' height='250' frameborder='0' scrolling='no' src='"+companion[2]+"'></iframe>";
			}
			else if("html"==companion[1] && companion[2]!=null)
			{
				strAdHTML = companion[2];
			}
			else if("swf"==companion[1] && companion[2]!=null)
			{
				strAdHTML = "<object width='300' height='250' id='jtvshlSWF' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000'><param name='movie' value='"+companion[2]+"' /><embed name='jtvshlSWF' pluginspage='http://www.adobe.com/go/getflashplayer' src='"+companion[2]+"' type='application/x-shockwave-flash' width='300' height='250'></embed></object>";
			}
			else if("img"==companion[1] && companion[2]!=null)
			{
			
				if (companion[3] !=null && companion[3].length > 0)
					strAdHTML = "<a href='"+companion[3]+"' target='_blank'>";
				
				strAdHTML += "<img src='"+companion[2]+"' border='0' />";
	
				if (companion[3] !=null && companion[3].length > 0)
					strAdHTML += "</a>";
			}
	
			document.getElementById("companionContainer").innerHTML = strAdHTML;
			break;
		}
	}
}