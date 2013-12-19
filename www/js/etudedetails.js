document.addEventListener("deviceready", onDeviceReady, false);

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);


var id;
var optimedPosition;
var optimedaddress;
var lieu;
var ref;

/**
 * Met en majuscule le première caractère d'une chaine de caractères
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Fonction s'exécutant lorsque l'application PhoneGap est complétement prête
 * @return {[type]} [description]
 */
function onDeviceReady() {
	id = getUrlVars()["id"];
	var db = window.openDatabase("eurofinOptimed", "1.0", "Optimed Sync Database", 200000);
	db.transaction(queryDB, errorCB);
}

/**
 * Requête de récupération des données dans la base SQLite
 * @param  {[type]} tx [description]
 * @return {[type]}    [description]
 */
function queryDB(tx) {
	tx.executeSql('SELECT * FROM etude WHERE id = ?', [id], querySuccess, errorCB);
}

/**
 * Evenement erreur de la requête de récupération des données dans la base SQLite
 * @param  {[type]} err [description]
 * @return {[type]}     [description]
 */
function errorCB(err) {
	console.log("Error processing SQL: " + err.code);
}

/**
 * Evenement succès de la requête de récupération des données dans la base SQLite
 * @param  {[type]} tx      [description]
 * @param  {[type]} results [description]
 * @return {[type]}         [description]
 */
function querySuccess(tx, results) {
	ref = results.rows.item(0).reference;
	lieu = results.rows.item(0).lieu;

	$('#lienPostuler').prop("href","postuler.html?ref=" + ref + "&lieu=" + lieu);
	$('#ReferenceEtude').text(ref);
	$('#detailsRef').text(ref);

	$('#dataList').append('<li><p class="line1">Sexe :</p>' +
				'<p class="line2">' + checkSexe(results.rows.item(0).sexe) + '</p><img src="img/icons/sexe.png" class="data-icon"/></li>');
	$('#dataList').append('<li><p class="line1">Lieu :</p>' +
				'<p class="line2">' + capitaliseFirstLetter(lieu) + '</p><img src="img/icons/lieu.png" class="data-icon"/></li>');
	$('#dataList').append('<li><p class="line1">Dates :</p>' +
				'<p class="line2">' + convertDate(results.rows.item(0).fromdate) + ' - ' + convertDate(results.rows.item(0).todate) + '</p><img src="img/icons/dates.png" class="data-icon"/></li>');
	$('#dataList').append('<li><p class="line1">Durée :</p>' +
				'<p class="line2">' + results.rows.item(0).duree + '</p><img src="img/icons/duree.png" class="data-icon"/></li>');
	$('#dataList').append('<li><p class="line1">Indemnité :</p>' +
				'<p class="line2">' + results.rows.item(0).indemnites + '</p><img src="img/icons/indemnite.png" class="data-icon"/></li>');
	$('#dataList').append('<li><p class="line1">Description :</p>' +
				'<p class="line2">' + results.rows.item(0).description + '</p><img src="img/icons/description.png" class="data-icon"/></li>');

	convertLieuInAddress(lieu, function(optimedaddress){
		optimedPosition = optimedaddress;
		loadScript();
		if (navigator.connection.type != "none") {
			if (device.platform == 'iOS') {
				$('#btn-iti').attr("href","maps:q=" + optimedaddress);
			} else {
				$('#btn-iti').attr("href","geo:0,0?q=" + optimedaddress);
			}
		} else {
			$('#btn-iti').hide();
			$('#map').hide();
		}
	});
}

function convertDate(dateString) {
    var date = new Date();
    date = Date.parse(dateString, "yyyy-mm-dd");
    var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // create new increased date
    var monthNames = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ];
    return monthNames[newDate.getMonth()]+" "+newDate.getFullYear();
}

/**
 * Récupère les paramètres de la page courante dans un tableau : getUrlVars()["nom_du_parametre"];
 * @return {[tableau]} 
 */
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

/**
 * Retourne l'adresse correspodante à un site Optimed (Grenoble/Lyon) 
 * @param  {[type]}   lieu     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */

function convertLieuInAddress(lieu,callback) {
	var address;

	URLtoCall='http://www.optimed-recrutement.com/mobile/API/site';
	$.ajax({
		cache: false,
		url:URLtoCall,
		dataType: 'json',
		success: function(data) {
			switch (lieu)
			{
				case 'grenoble':
					$("#lienContacter").attr("href", "tel:"+data[0].telephone);
					callback(data[0].rue+' '+data[0].codepostal+' '+data[0].ville+' '+data[0].pays);
				break;
				case 'lyon':
					$("#lienContacter").attr("href", "tel:"+data[1].telephone);
					callback(data[1].rue+' '+data[1].codepostal+' '+data[1].ville+' '+data[1].pays);
				break;
			}
		}
	});
}

/**
 * Formate le genre (h->Hommes) (f->Femmes) (m->Mixte)
 * @param  {[type]} formatedSexe [description]
 * @return {[type]}              [description]
 */
function checkSexe(formatedSexe) {

	if (formatedSexe == 'hf')
	{
		return 'Mixte';
	}
	else if (formatedSexe == 'h')
	{
		return 'Hommes';
	}
	else if (formatedSexe == 'f')
	{
		return 'Femmes';
	}
	else
	{
		return 'Non renseigné';
	}
}


/**
 * [txErrorHandler description]
 * @param  {[type]} tx [description]
 * @return {[type]}    [description]
 */
function txErrorHandler(tx) {
	alert(tx.message);
}
