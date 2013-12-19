eDeviceReady(setParams);

var syncPath;
var syncArgs;
var createTableSQL;

function setParams() {
	syncPath = "http://www.optimed-recrutement.com/mobile/API/etudes/list";
	syncArgs = "";
	createTableSQL =
		"CREATE TABLE IF NOT EXISTS etude ( " +
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"reference varchar  NOT NULL, " +
		"titre varchar, " +
		"description longtext, " +
		"duree varchar, " +
		"dates varchar, " +
		"indemnites varchar, " +
		"lieu varchar, " +
		"sexe varchar, " +
		"fromdate date, " +
		"todate date, " +
		"lastmodified varchar)";
}




function SQLUpdate(data,tx) {
	var sql =	"INSERT OR REPLACE INTO etude (id, reference, titre, description, duree, dates, indemnites, lieu, sexe, fromdate, todate, lastmodified) " +
				"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

	var l = data.length;
	for (var i = 0; i < l; i++) {
		d = data[i];
		var params = [d.id, d.reference, d.titre, d.description, correctEmptyValue(d.duree), d.dates, d.indemnites, d.lieu, d.sexe, d.fromdate, d.todate, d.lastmodified];
		tx.executeSql(sql, params);
	}

	console.log('Synchronization complete (' + l + ' items synchronized)');
}

function getContent(data) {

	$('#etudeList').empty();
			var l = data.length;
			for (var i = 0; i < l; i++) {
				var etude = data[i];
				$('#etudeList').append('<li><a href="etudedetails.html?id=' + etude.id + '" data-ajax="false">' +
					'<h4>' + etude.reference + '</h4>' +
					'<p>Lieu : ' + capitaliseFirstLetter(etude.lieu) + '</p>' +
					'<p>Indemnité : ' + etude.indemnites + '</p>' +
					'<p class="ui-li-aside"><strong>'+ checkSexe(etude.sexe) +'</strong></p></a></li>');
			}
			$('#etudeList').listview('refresh');
}



