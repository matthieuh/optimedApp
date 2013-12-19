/**
 * Easy add Event
 * @param {[type]} obj   [description]
 * @param {[type]} event [description]
 * @param {[type]} fct   [description]
 */
function addEvent(obj, evt, fct, cptr) {
	obj.addEventListener(evt, fct);
}

/**
 * ajout d'un évenement au chargement de la page
 * @param  {[type]} fct [description]
 * @return {[type]}     [description]
 */
function eWindowLoad(fct) {
	addEvent(window, "load", fct);
}

/**
 * Ajout d'un évenement lorsque l'appareil est prêt (PhoneGap nécessaire)
 * @param  {[type]} fct [description]
 * @return {[type]}     [description]
 */
function eDeviceReady(fct) {
	addEvent(document, "deviceready", fct);
}

/**
 * Activation de FastClick
 * @return {[type]} [description]
 */
function fastClick() {
	eWindowLoad( function() {
		new FastClick(document.body);
	});
}

/**
 * [stringSearch description]
 * @param  {[type]} strg1 [description]
 * @param  {[type]} strg2 [description]
 * @return {[type]}       [description]
 */
function stringSearch(strg1, strg2) {
	if (strg2.indexOf(strg1)!=-1) {
		return true;
	} else {
		return false;
	}
}

/**
 * [capitaliseFirstLetter description]
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * [correctEmptyValue description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function correctEmptyValue(value) {
	if (value) {
		return value;
	}
	return "Non renseigné";
}


/**
 * Tranforme le champ sexe formaté h, f ou hf en homme, femme ou mixte
 * @param  {[string]} formatedSexe [champ sexe formaté : h, f ou hf]
 * @return {[string]} readableSexe [champ sexe lisible : homme, femme ou mixte]
 */
function checkSexe(formatedSexe) {
	var readableSexe;

	if (formatedSexe == 'hf')
	{
		readableSexe = 'Mixte';
	}
	else if (formatedSexe == 'h')
	{
		readableSexe = 'Hommes';
	}
	else if (formatedSexe == 'f')
	{
		readableSexe = 'Femmes';
	}
	else
	{
		readableSexe = 'Non renseigné';
	}

	return readableSexe;
}