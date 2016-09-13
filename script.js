var bar = document.getElementById('bar');
var initialOffset = -1.0;

var subpageRequest = null;
var newsRequest = null;

var canInsertNews = false;
var newsData = null;

function documentScrolled()
{
	if (initialOffset < 0.0)
		initialOffset = bar.getBoundingClientRect().top + window.pageYOffset;
	if (window.pageYOffset < initialOffset)
	{
		bar.style.top = 0.0;
		bar.style.opacity = 1.0;
	}
	else
	{
		bar.style.top = window.pageYOffset - initialOffset;
		bar.style.opacity = 0.9;
	}
}
function windowResized()
{
	bar.style.top = 0.0;
	initialOffset = bar.getBoundingClientRect().top + window.pageYOffset;
	documentScrolled();
}

function insertNews()
{
	var news = document.getElementById('news');
	if (news)
	{
		news.innerHTML = newsData;
		newsData = null;
	}
}
function loadNews()
{
	newsRequest = new XMLHttpRequest();
	newsRequest.onreadystatechange = function() {
		if (newsRequest.readyState == 4)
		{
			if (newsRequest.status == 200)
				newsData = newsRequest.responseText;
			else if (newsRequest.status > 0)
				newsData = "Error: " + newsRequest.status;
			if (canInsertNews)
			{
				insertNews(); //If already has a home page then insert news into it
				canInsertNews = false;
			}
			newsRequest = null;
		}
	}
	newsRequest.open('GET', 'news.html', true);
	newsRequest.setRequestHeader('Content-type', 'text/html');
	newsRequest.send(null);
}

function loadScreenshots()
{
	const nScreenshots = 60;
	const maxInRow = 3;

	Number.prototype.pad = function(size) {
		var s = String(this);
		while (s.length < size)
			s = "0" + s;
		return s;
	}

	var getImg = function(idx) {
		const screenshotsUrl = "https://raw.githubusercontent.com/adamkoss/epktscenery/screenshots/";
		var fileName = "Img" + idx.pad(3) + ".jpg";
		return "<a href='" + screenshotsUrl + fileName + "'><img src='" + screenshotsUrl + "small/" + fileName + "'/></a>";
	}

	var screenshotsData = "<table align='center' cellspacing='0' cellpadding='4' border='0'><tr>";
	for (var i = 1; i <= nScreenshots; ++i)
	{
		screenshotsData += "<td align='center'>" + getImg(i) + "</td>";
		if (!(i % maxInRow))
			screenshotsData += "</tr><tr>";
	}
	screenshotsData += "</tr></table>";

	document.getElementById('screenshots').innerHTML = screenshotsData;
}

function loadPage()
{
	var file = '';
	if (window.location.search)
	{
		var splitted = window.location.search.substring(1).split('&');
		for (var i = 0; i < splitted.length; ++i)
		{
			var arg = splitted[i].split('=');
			if (arg.length == 2)
			{
				if (arg[0] == 'subpage')
					file = arg[1];
			}
		}
	}
	if (file == '')
		file = 'home';
	file += '.html';

	//Abort current operations
	if (newsRequest)
	{
		newsRequest.onreadystatechange = null;
		newsRequest.abort();
	}
	if (subpageRequest)
	{
		subpageRequest.onreadystatechange = null;
		subpageRequest.abort();
	}

	//Clear the data
	subpageRequest = null;
	newsRequest = null;
	canInsertNews = false;
	newsData = null;

	var isHome = (file == 'home.html');
	if (isHome)
		loadNews(); //Start loading the news

	subpageRequest = new XMLHttpRequest();
	subpageRequest.onreadystatechange = function() {
		if (subpageRequest.readyState == 4)
		{
			var page = document.getElementById('page');
			if (subpageRequest.status == 200)
			{
				page.innerHTML = subpageRequest.responseText;
				if (isHome)
				{
					if (newsData)
						insertNews(); //If already has news then insert it into a home page
					else
						canInsertNews = true; //Allow insert news later
				}
				else if (file == 'screenshots.html')
					loadScreenshots();
			}
			else
			{
				//Show error from server without styles
				var errorStr = subpageRequest.responseText;
				for (;;)
				{
					var idx1 = errorStr.indexOf('<style');
					var idx2 = errorStr.indexOf('</style>');
					if (idx1 < 0 || idx2 < 0)
						break;
					errorStr = errorStr.slice(0, idx1) + errorStr.slice(idx2 + 8);
				}
				page.innerHTML = errorStr;
			}
			subpageRequest = null;
		}
	}
	subpageRequest.open('GET', file, true);
	subpageRequest.setRequestHeader('Content-type', 'text/html');
	subpageRequest.send(null);
}
function prepareToLoadPage(arg)
{
	window.history.pushState(arg,  document.title, window.location.pathname + arg);
	loadPage();
}

document.onscroll = documentScrolled;
window.onresize = windowResized;
window.onpopstate = loadPage;
bar.style.display = 'block';
loadPage();
