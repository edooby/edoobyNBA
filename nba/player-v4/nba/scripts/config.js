var g_trackProduction = true;

var prefix = "http://smb.cdnak.neulion.com/fs/nba/feeds_s2012/stats/";
var schedulePrefix = "http://smb.cdnak.neulion.com/fs/nba/feeds_s2012/schedule/";
var playerImgPrefix = "http://i.cdn.turner.com/nba/nba/csl/";
var dlSrc = "http://smb.cdnak.neulion.com/fs/nba/feeds/common/dl.js";
var solr_prefix = "http://smbsolr.cdnak.neulion.com/solr/NBA/select/?wt=json&";
var pregameFeed = "http://smb.cdnak.neulion.com/fs/nba/feeds/pregame/";
var minDate = new Date(2011,11,25);
var maxDate = new Date(2013,3,17);
var scheduleDefaultDate = new Date(2012,9,5);

var categoryFeed = "http://smb.cdnak.neulion.com/fs/nba/feeds/common/cats.js";
var epgFeed = "http://smb.cdnak.neulion.com/fs/nba/feeds/epg/shows.js";
var epgDateFeedPrefix = "http://smb.cdnak.neulion.com/fs/nba/feeds/epg/"; // + "YYYY/M_Djs"

var VF_PREFIX_ARCHIVE = "rtmp://cp118328.edgefcs.net/ondemand/mp4:u/nbamobile/vod/nba/";
var VF_PREFIX_CONDENSED ="rtmp://cp118328.edgefcs.net/ondemand/mp4:u/nbamobile/vod/nba/";
var VF_PREFIX_ARCHIVE_ADAPTIVE = "adaptive://nlds143.neulion.com:443/nlds_vod/nfl/vod/";
var VF_PREFIX_CONDENSED_ADAPTIVE ="adaptive://nlds143.neulion.com:443/nlds_vod/nfl/vod/";
var VF_PREFIX_DISCRETE ="http://smb.cdnak.neulion.com/u/nbamobile/vod/nba/";
// All Star Upcoming
var ALL_STAR = null;
// All Star Live in ET
//var ALL_STAR = {st:"2012-02-25T18:00:00.000"};
// All Star DVR Live in ET
//var ALL_STAR = {st:"2012-02-25T20:00:20.000", et:"2012-02-25T23:08:52.000"};
var LOC_QOS = "http://nlqosdrecv01.neulion.com/nbadrecv/ProxyBean";

var useEVP = false;
var season = "2011";
var teams = {'ATL':{code:'ATL',city:'Atlanta',name:'Hawks',division:'Southeast', conference:'Eastern', color:"#E2373E" },
			'BKN':{code:'BKN',city:'Brooklyn',name:'Nets',division:'Atlantic', conference:'Eastern', color:"#FFFFFF"},
			'BOS':{code:'BOS',city:'Boston',name:'Celtics',division:'Atlantic', conference:'Eastern', color:"#007239"},
			'CHA':{code:'CHA',city:'Charlotte',name:'Bobcats',division:'Southeast', conference:'Eastern', color:"#F24D28"},
			'CHI':{code:'CHI',city:'Chicago',name:'Bulls',division:'Central', conference:'Eastern', color:"#C60033"},
			'CLE':{code:'CLE',city:'Cleveland',name:'Cavaliers',division:'Central', conference:'Eastern', color:"#B2004A"},
			'DAL':{code:'DAL',city:'Dallas',name:'Mavericks',division:'Southwest', conference:'Western', color:"#0063AF"},
			'DEN':{code:'DEN',city:'Denver',name:'Nuggets',division:'Northwest', conference:'Western', color:"#559FD6"},
			'DET':{code:'DET',city:'Detroit',name:'Pistons',division:'Central', conference:'Eastern', color:"#EC003D"},
			'GSW':{code:'GSW',city:'Golden State',name:'Warriors',division:'Pacific', conference:'Western', color:"#0068B3"},
			'HOU':{code:'HOU',city:'Houston',name:'Rockets',division:'Southwest', conference:'Western', color:"#C60033"},
			'IND':{code:'IND',city:'Indiana',name:'Pacers',division:'Central', conference:'Eastern', color:"#FFC633"},
			'LAC':{code:'LAC',city:'Los Angeles',name:'Clippers',division:'Pacific', conference:'Western', color:"#00559A"},
			'LAL':{code:'LAL',city:'Los Angeles',name:'Lakers',division:'Pacific', conference:'Western', color:"#FEA927"},
			'MEM':{code:'MEM',city:'Memphis',name:'Grizzlies',division:'Southwest', conference:'Western', color:"#bed4e9"},
			'MIA':{code:'MIA',city:'Miami',name:'Heat',division:'Southeast', conference:'Eastern', color:"#98002E"},
			'MIL':{code:'MIL',city:'Milwaukee',name:'Bucks',division:'Central', conference:'Eastern', color:"#C41230"},
			'MIN':{code:'MIN',city:'Minnesota',name:'Timberwolves',division:'Northwest', conference:'Western', color:"#3B6A8E"},
			'NJN':{code:'NJN',city:'New Jersey',name:'Nets',division:'', conference:'', color:"#C60033"},
			'NOH':{code:'NOH',city:'New Orleans',name:'Hornets',division:'Southwest', conference:'Western', color:"#008FC5"},
			'NYK':{code:'NYK',city:'New York',name:'Knicks',division:'Atlantic', conference:'Eastern', color:"#F3571F"},
			'OKC':{code:'OKC',city:'Oklahoma City',name:'Thunder',division:'Northwest', conference:'Western', color:"#FDBB30"},
			'ORL':{code:'ORL',city:'Orlando',name:'Magic',division:'Southeast', conference:'Eastern', color:"#006BB7"},
			'PHI':{code:'PHI',city:'Philadelphia',name:'76ers',division:'Atlantic', conference:'Eastern', color:"#EC003D"},
			'PHX':{code:'PHX',city:'Phoenix',name:'Suns',division:'Pacific', conference:'Western', color:"#E4491D"},
			'POR':{code:'POR',city:'Portland',name:'Trailblazers',division:'Northwest', conference:'Western', color:"#DE2032"},
			'SAC':{code:'SAC',city:'Sacramento',name:'Kings',division:'Pacific', conference:'Western', color:"#7070DB"},
			'SAS':{code:'SAS',city:'San Antonio',name:'Spurs',division:'Southwest', conference:'Western', color:"#BAC4CA"},
			'TOR':{code:'TOR',city:'Toronto',name:'Raptors',division:'Atlantic', conference:'Eastern', color:"#C60033"},
			'UTA':{code:'UTA',city:'Utah',name:'Jazz',division:'Northwest', conference:'Western', color:"#446893"},
			'WAS':{code:'WAS',city:'Washington',name:'Wizards',division:'Southeast', conference:'Eastern', color:"#E31837"},
			'EST':{code:'EST',city:'All-Star',name:'East',division:'', conference:'', color:"#00559A"},
			'WST':{code:'WST',city:'All-Star',name:'West',division:'', conference:'', color:"#EC003D"},
			'CHK':{code:'CHK',city:'Rising Stars',name:'Team Chuck',division:'', conference:'', color:"#0575BC"},
			'SHQ':{code:'SHQ',city:'Rising Stars',name:'Team Shaq',division:'', conference:'', color:"#0575BC"},
			'ALB':{code:'ALB',city:'Berlin',name:'ALBA',division:'', conference:'', color:"#0063AF", isintl:true},
			'EAM':{code:'EAM',city:'Milan',name:'EA7',division:'', conference:'', color:"#FFFFFF", isintl:true},
			'FBU':{code:'FBU',city:'Istanbul',name:'Fenerbahce Ulker',division:'', conference:'', color:"#EC003D", isintl:true},
			'MPS':{code:'MPS',city:'Siena',name:'Montepaschi Siena',division:'', conference:'', color:"#007239", isintl:true},
			'RMD':{code:'RMD',city:'Madrid',name:'Real Madrid',division:'', conference:'', color:"#006BB7", isintl:true},
			'FCB':{code:'FCB',city:'Barcelona',name:'FC Barcelona',division:'', conference:'', color:"#446893", isintl:true}
};

var g_gaaccount = "UA-19149477-18";
if(g_trackProduction)
	g_gaaccount = "UA-19149477-21";

function getTeamColor(teamCode)
{
	var t = teams[teamCode];
	if(t!=null)
		return t.color;
	else
		return "#FFFFFF";
}

function getTeamCity(teamCode)
{
	var t = teams[teamCode];
	if(t!=null)
		return t.city;
	else
		return teamCode;
}

function gotoCurrentSite()
{
	location.href = "https://ilp.nba.com/nbalp/secure/myaccount?nobeta=true";
}