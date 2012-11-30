var currentDate;
var today;
var defaultDate;
var firstDate;//The first date in the week of the selected date.
var selectedDay = 0;
var team = "";
var needTracking = false;
var hasScheduled = false;
var timerInterval = 60 * 1000;
var timer;
var g_gamescheck = true;
var g_needCache = false;
var cache = {};
var baseurlSecure = "";

function __gameItemBeforeAdd(){}
function __gameItemAdded(width, filterChanged){}

function getSchedule(year, month, day, callback, isSameCall)
{
	var url = schedulePrefix + year + "/" + month + "_" + day + ".js";
	url += "?t=" + getTime();
	if(isSameCall == undefined) isSameCall = false;
	$.getScript(url, function() 
	{
		hasScheduled = true;
		needTracking = false;
		if(callback) callback();
		var hasPrev = g_schedule.prevDate != undefined;
		var hasNext = g_schedule.nextDate != undefined;
		if($(".weekSelector") != undefined && $(".weekSelector").html() == "")
		{
			updateCalendar(year, month, day, hasPrev, hasNext, isSameCall);
			var date = new Date();
			date.setFullYear(year, month - 1, day);
			firstDate = date;
			selectDay(selectedDay);
			updateCalendarSelector();
		}
		else
			selectDay(selectedDay, isSameCall);
	});
}

function checkDatePosition(date)
{
	var noPrev, noNext;
	var mondyOfFirstWeek = getFirstDayOfWeek(minDate);
	var mondyOfLastWeek = getFirstDayOfWeek(maxDate);
	if(getFirstDayOfWeek(new Date(date.getTime() - 7 * 24 * 3600 * 1000)) >= mondyOfFirstWeek) noPrev = true;
	if(getFirstDayOfWeek(new Date(date.getTime() + 7 * 24 * 3600 * 1000)) <= mondyOfLastWeek) noNext = true;
	return [noPrev, noNext];
}

function updateCalendar(year, month, day, hasPrev, hasNext, isSameCall)
{
	var date = new Date();
	date.setFullYear(year, month - 1, day);
	if(hasPrev)
	{
		var pyear, pmonth, pdate;
		if(isSameCall == undefined)
		{
			var pd = new Date(date.getTime() - 7 * 24 * 3600 * 1000);
			pyear = pd.getFullYear();
			pmonth = pd.getMonth() + 1;
			pdate = pd.getDate();
		}
		else
		{
			pyear = g_schedule.prevDate.split("/")[0];
			pmonth = g_schedule.prevDate.split("/")[1].split("_")[0];
			pdate = g_schedule.prevDate.split("/")[1].split("_")[1];
		}
	}
	var prevStr = hasPrev ? ' href="javascript:browseSchedule(' + pyear + ',' + pmonth + ',' + pdate + ')"' : '';
	var str = '<a' + prevStr + ' class="weekPrev' + (hasPrev ? '' : ' wpdisabled') + '"></a>';
	for(var i = 0; i < 7; i++)
	{
		var fd = formatDay(date.getDay());
		var fm = formatMonth(date.getMonth());
		var fdate = date.getDate();
		var isEnable = date <= new Date(maxDate.getTime()+24*3600*1000) && date >= minDate;
		str += '<a '+ (isEnable ? 'href="javascript:showGamesByDate('+ i +')"' : '') +' class="weekDay' + (isEnable ? '' : ' wddisabled') + '"><div class="normal">' + fd + '<br/><span style="text-transform:uppercase">'+ fm + ' ' + fdate + '</span></div></a>';
		date.setDate(date.getDate() + 1);
	}
	date.setDate(date.getDate() - 7);
	if(hasNext)
	{
		var nyear, nmonth, ndate;
		if(isSameCall == undefined)
		{
			var nd = new Date(date.getTime() + 7 * 24 * 3600 * 1000);
			nyear = nd.getFullYear();
			nmonth = nd.getMonth() + 1;
			ndate = nd.getDate();
		}
		else
		{
			nyear = g_schedule.nextDate.split("/")[0];
			nmonth = g_schedule.nextDate.split("/")[1].split("_")[0];
			ndate = g_schedule.nextDate.split("/")[1].split("_")[1];
		}
	}
	var nextStr = hasNext ? ' href="javascript:browseSchedule(' + nyear + ',' + nmonth + ',' + ndate + ')"' : '';
	str += '<a' + nextStr + ' class="weekNext' + (hasNext ? '' : ' wpdisabled') + '"></a>';
	$(".weekSelector").html(str);
	$(".weekSelector").attr("fd", date.getTime());
	if(firstDate != undefined && compareDate(firstDate,date))
		$(".weekSelector .weekDay>div:eq("+selectedDay+")").addClass("select");
}

function browseSchedule(year, month, day)
{
	var date = new Date();
	date.setFullYear(year, month - 1, day);
	var ret = checkDatePosition(date);
	updateCalendar(year, month, day, ret[0], ret[1]);
}
function showGamesByDate(day)
{
	var fd = new Date(parseInt($(".weekSelector").attr("fd")));
	var needCall = !compareDate(firstDate,fd);
	if(selectedDay == day && !needCall) return;
	$(".weekSelector .weekDay>div:eq("+day+")").addClass("select");
	$(".weekSelector .weekDay>div:eq("+selectedDay+")").removeClass("select");
	selectedDay = day;
	if(!needCall)
	{
		generateGameItem(g_schedule.games[day], true, true);
		updateCalendarSelector();
	}
	else
	{
		needTracking = false;
		hasScheduled = false;
		var year = fd.getFullYear();
		var month = fd.getMonth() + 1;
		var	day = fd.getDate();
		firstDate = fd;
		updateCalendarSelector();
		getSchedule(year, month, day);
	}
}

function updateCalendarSelector()
{
	if($("#calendarSelector") && firstDate)
	{
		var nd = new Date(firstDate.getTime() + selectedDay * 24 * 60 *60 *1000);
		var str = nd.getFullYear() + "/" + (nd.getMonth()+1) + "/" + nd.getDate();
		$("#calendarSelector").datepicker("setDate", str);
	}
}

function generateGameItem(data, filterChanged, dateChanged)
{
	var selectedDate = new Date(firstDate.getTime() + selectedDay * 24 * 3600 * 1000);
	selectedDate.setHours(2,0,0,0);
	if(dateChanged == undefined) dateChanged = false;
	if(filterChanged) 
	{
		__gameItemBeforeAdd();
		$(".browseResultContainer").html("");
	}
	var length = 0;
	var frequencyCheck = false;
	var checkLiveOrDvr = false;
	var checkUpcoming = false;
	$.each(data,function(key, val){
		if(team == "" || team == val.h || team == val.v)
		{
			if(compareDate(selectedDate, today) && (val.gs == 0 || val.gs == 1))
			{
				var d = formatTimeToDate(val.d);
				if(val.gs == 1 || d.getTime() - currentDate.getTime() < 3600 * 1000)
					frequencyCheck = true;
				needTracking = true;
			}
			if(val.gs == 1 || val.gs == 2) checkLiveOrDvr = true;
			if(val.gs == 0 && (selectedDate.getTime() - today.getTime() <= 3 * 24 * 3600 * 1000))
			{
				checkUpcoming = true;
			}
			var gameTime = getGameTimeByFeed(val);
			if(filterChanged)
			{
				var str = '<div id="game_'+val.id+'" class="gameItem" gs="'+val.gs+'"><div class="normal">';
				str += '<div class="team" style="background-image:url('+locResource+'images/teams/' + val.v + '.png);border-top-color:' + getTeamColor(val.v) + '">' + getTeamCity(val.v) + '</div>';
				str += '<div class="team" style="background-image:url('+locResource+'images/teams/' + val.h + '.png);border-top-color:' + getTeamColor(val.h) + '">' + getTeamCity(val.h) + '</div>';
				str += '<div class="awayscore">' + (val.vs != undefined ? val.vs : '&nbsp;') + '</div>';
				str += '<div class="state"><div class="blocked">'+$("#blackout_txt").html()+'</div>' + gameTime + '</div>';
				str += '<div class="homescore">' + (val.hs != undefined ? val.hs : '&nbsp;') + '</div>';
				//str += '</div><div class="bg"></div><div class="over">';
				str += generateItemByGameStats(val, isAuth);
				str += '</div><div class="live">';
				if(val.gs == 1) str += '<img src="'+locResource+'images/corner-live.png"/>';
				str += '</div></div>';
				$(".browseResultContainer").append(str);
			}
			else
			{
				var $kg = $("#game_"+val.id);
				if($kg.html() != undefined)
				{
					$(".awayscore", $kg).html(val.vs != undefined ? val.vs : '&nbsp;');
					$(".state", $kg).html('<div class="blocked">'+$("#blackout_txt").html()+'</div>' + gameTime);
					$(".homescore", $kg).html(val.hs != undefined ? val.hs : '&nbsp;');
					
					var lastgs = $kg.attr("gs");
					$kg.attr("gs", val.gs);
					if(lastgs != val.gs + "")
					{
						//$(".over", $kg).html(generateItemByGameStats(val, isAuth));
						if(val.gs == 1) $(".live", $kg).html('<img src="'+locResource+'images/corner-live.png"/>');
						else $(".live", $kg).html("");
					}
				}
			}
			length++;
		}
	});
	if(filterChanged)
	{
		if(length == 0) $(".browseResultContainer").append("<div class='nogameTxt'>"+$("#no_games_on_this_date").html()+"</div>");
		$(".browseResultContainer").append('<div class="clearDiv"></div>');
	}
	//if(hasPremiumAccess && (dateChanged || statsChanged)) checkGame(selectedDate, function(){ __gameItemAdded(290*length, filterChanged); });
	if(hasPremiumAccess && g_gamescheck && (checkLiveOrDvr || checkUpcoming))
	{
		if(g_needCache && cache[formatDateToMMddyyyy(selectedDate)] != undefined)
			callbackGamesCheck(cache[formatDateToMMddyyyy(selectedDate)]);
		else
			checkGame(selectedDate, function(){ __gameItemAdded(290*length, filterChanged); });
	}
	else __gameItemAdded(290*length, filterChanged);
	showhideScore(true);
	timerInterval = frequencyCheck ? 60 * 1000 : 3600 * 1000;
	if(needTracking)
	{
		clearTimeout(timer);
		timer = setTimeout(function(){
			if(frequencyCheck)
				getSchedule(firstDate.getFullYear(), firstDate.getMonth() + 1, firstDate.getDate(), null, true);
			else
			{
				updateCurrentTime(function(){
					getSchedule(firstDate.getFullYear(), firstDate.getMonth() + 1, firstDate.getDate(), null, true);
				});
			}
		}, timerInterval);
	}
}

function getGameTimeByFeed(val)
{
	var gameTime;
	var period = val.p;
	switch(val.gs)
	{
		case 0:
			gameTime = formatScheduleTime(val.d) + "&nbsp;ET";
			break;
		case 1:
			if(val.c == "" && val.ps != null) gameTime = val.ps;
			else
			{
				if(period > 4) period = period > 5 ? $("#game_ot").html() + "(" + (period - 4) + ")" : $("#game_ot").html();
				else period = "Q" + period;
				gameTime = val.c + '&nbsp;<span style="color:#666666;">' + period + '</span>';
			}
			break;
		case 2:
		case 3:
			if(period > 4)
			{
				period = period > 5 ? $("#game_ot").html() + "(" + (period - 4) + ") " : $("#game_ot").html();
				gameTime = $("#game_final").html() + "&nbsp;" + period;
			}
			else gameTime = $("#game_final").html();
		break;
	}
	var gameTime_on = gameTime;
	var gameTime_off = val.gs > 1 ? $("#game_final").html() : (val.gs == 1 ? $("#game_live").html() : gameTime);	
	gameTime = "<table><tr><td><span class='scoreOnValue'>"+gameTime_on+"</span><span class='scoreOffValue'>"+gameTime_off+"</span></td></tr></table>";
	return gameTime;
}

function checkGame(date, callback)
{
	var url = "/nba/servlets/gamescheck";
	url += "?date=" + formatDateToMMddyyyy(date) + "&format=json&callback=callbackGamesCheck&ppv=true";
	$.getScript(url, callback);
}

function callbackGamesCheck(obj)
{
	if(g_needCache)
	{
		var selectedDate = new Date(firstDate.getTime() + selectedDay * 24 * 3600 * 1000);
		cache[formatDateToMMddyyyy(selectedDate)] = obj;
	}
	$.each(obj.block,function(key, val){
		key = key.replace("  ","");
		var newKey = "00" + key;
		if($("#game_"+newKey).html() != undefined)
		{
			var game = getGameById(newKey);
			game.block = true;
			$("#game_"+newKey+" .blocked").show();
			//$("#game_"+newKey+">.over").html(generateItemByGameStats(game, false));
		}
	});
	$.each(obj.noAccess,function(key, val){
		key = key.replace("  ","");
		var newKey = "00" + key;
		if($("#game_"+newKey).html() != undefined)
		{
			var game = getGameById(newKey);
			game.noAccess = true;
			//$("#game_"+newKey+">.over").html(generateItemByGameStats(game, false));
		}
	});
}

function updateCurrentTime(callback)
{
	$.post('/nba/servlets/sessionpoll', {}, function(data) {
		var result = $(data).find("currentDate").text();
		currentDate = formatTimeToDate(result);
		if(currentDate.getHours() < 6) today = new Date(currentDate.getTime() - 24 * 3600 * 1000);
		else today = new Date(currentDate.getTime());
		today.setHours(2,0,0,0);
    	if(callback) callback();
    });
}

//MM/dd/yyyy
function formatDateToMMddyyyy(date)
{
	var mm = date.getMonth() + 1;
	var dd = date.getDate();
	var yyyy = date.getFullYear();
	if(mm < 10) mm = "0" + mm;
	if(dd < 10) dd = "0" + dd;
	return mm + "/" + dd + "/" + yyyy;
}

function filterByTeam(teamCode)
{
	team = teamCode;
	generateGameItem(g_schedule.games[selectedDay], true);
}

function selectDay(day, isSameCall)
{
	$(".weekSelector .weekDay>div:eq("+day+")").addClass("select");
	generateGameItem(g_schedule.games[day], !isSameCall, !isSameCall);
}

function formatScheduleTime(value)
{
	var t = value.split("T")[1].split(":");
	var hour = stripNum(t[0]);
	var ampm = hour > 11 ? $("#ampm_pm").html() : $("#ampm_am").html();
	hour = hour > 12 ? hour - 12 : hour;
	if(hour == 0) hour = 12;
	return hour + ":" + t[1] + " " + ampm;
}
function generateItemByGameStats(game, isAccess)
{
	var ret = "";
	var nid = game.id.length == 10 ? game.id.substring(2) : game.id;
	var url = baseurl + 'games/' + formatDateToArray(game.d)[0] + formatDateToArray(game.d)[1] + formatDateToArray(game.d)[2] + '/' + game.v + game.h + '/' + nid;
	var buyUrl = baseurlSecure + 'secure/registerform?game='+nid;
	var hasBuyGameButton = (!hasPremiumAccess && buyGameCheck && game.s>2011);
	switch(game.gs)
	{
		case 0:
			if(isSub || isAuth)
				//TODO
				//ret += '<div class="title">' + $("#game_has_not_begun").html() + ':</div><a href="' + url + '" class="watchgame" style="float:left">' + $("#game_preview").html() + '</a><div class="remindergame" onclick="showReminderBox()" style="float:right">' + $("#game_set_reminder").html() + '</div><div class="or">' + $("#game_or").html() + '</div>';
				ret += '';			
			else
				ret += '';			;
			break;
		case 1:
			ret += '';
		case 2:
		case 3:
			var recapUrl = url + "?isPost=true";
			if(!hasBuyGameButton)
			{
				if(game.s>2011)
					ret += '' ;
				else
					ret += '';
			}
			else
				ret += '';
			break;
	}
	return ret;
}

//d:"2012-01-02T19:00:00.000",
function formatDateToArray(date)
{
	var d = date.split("T")[0];
	return d.split("-");
}

Date.prototype.minusDays = function(cur, days){
    var temp = days * 24 * 60 *60 *1000;
    return new Date(cur.getTime() - temp);
}
Date.prototype.addDays = function(cur, days){
    var temp = days * 24 * 60 *60 *1000;
    return new Date(cur.getTime() + temp);
}

function getFirstDayOfWeek(date)
{
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	date.setHours(2,0,0,0);
	var week = date.getDay();
	if(week == 0)
	{   
	    date = date.minusDays(date,6);
	}
	else
	{
	    date = date.minusDays(date,week-1);
	}
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	date.setHours(2,0,0,0);
	return date;
}
function stripNum(num)
{
	num = num.split(".")[0];
	var ex = /^0*/g;
	var result = null;
	try{
	    result = parseInt(num.replace(ex,'') != ''? num.replace(ex,'') : 0);
	}
	catch( e )
	{
	    result = 0;
	}
	return result;
}
function getGameById(id)
{
	var ret;
	$.each(g_schedule.games[selectedDay], function(i,val){
		if(val.id + "" == id) ret = val;
	});
	return ret;
}

function getScheduleByDay(day)
{
	return g_schedule.games[selectedDay];
}

function getTime()
{
	var d = new Date();
	d.setMilliseconds(0);
	if(d.getSeconds()<30) d.setSeconds(0);
	else d.setSeconds(30);
	return d.getTime().toString();
}
function compareDate(d1, d2)
{
	return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate())
}