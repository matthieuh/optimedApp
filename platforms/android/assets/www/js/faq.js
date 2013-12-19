eDeviceReady(setParams);

var syncPath;
var syncArgs;
var createTableSQL;

function setParams() {
	syncPath = "http://www.optimed-recrutement.com/mobile/API/gethtmlbyversion/";
	syncArgs = "faq"+"/"+device.platform+"/"+device.version;
	createTableSQL =	"CREATE TABLE IF NOT EXISTS faq ( " +
							"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
							"title VARCHAR, " +
							"content TEXT, " +
							"lastmodified VARCHAR)";
}

function SQLUpdate(data,tx) {
	var sql =	"INSERT OR REPLACE INTO faq (id, title, content, lastmodified) " +
				"VALUES (?, ?, ?, ?)";

	var l = data.length;
	for (var i = 0; i < l; i++) {
		d = data[i];
		var params = [d.id, d.title, d.content, d.lastmodified];
		tx.executeSql(sql, params);
	}

	console.log('Synchronization complete (' + l + ' items synchronized)');
}


function getContent(data) {

	var content=data[0].content;

	if(device.platform == "Android" && parseInt(device.version) < 3) {
	document.getElementById("collapse").innerHTML = content;
		$(".msg_body").hide();
		//toggle the componenet with class msg_body
		$(".msg_head").click(function() {
			$(".msg_body").hide();
			$(this).next(".msg_body").show();
		});
	} else {
		document.getElementById("content").innerHTML = content;
		var $element = $('<div data-role="collapsible"></div>').appendTo($('#content div:first'));
		$element.collapsible();
		$('#content').find('div[data-role=collapsible]').collapsible({refresh:true});
		$('#content').collapsibleset("refresh");
	}
}
