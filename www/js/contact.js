eDeviceReady(setParams);

var syncPath;
var syncArgs;
var createTableSQL;

function setParams() {
	syncPath = "http://www.optimed-recrutement.com/mobile/API/gethtmlbyversion/";
	syncArgs = "contact"+"/"+device.platform+"/"+device.version;
	createTableSQL =	
		"CREATE TABLE IF NOT EXISTS contact ( " +
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"title VARCHAR, " +
		"content TEXT, " +
		"lastmodified VARCHAR)";
}

function SQLUpdate(data,tx) {
	var sql =	"INSERT OR REPLACE INTO contact (id, title, content, lastmodified) " +
				"VALUES (?, ?, ?, ?)";

	var l = data.length;
	for (var i = 0; i < l; i++) {
		d = data[i];
		var params = [d.id, d.title, d.content, d.lastmodified];
		tx.executeSql(sql, params);
	}

	console.log('Synchronization complete (' + l + ' items synchronized)');
}


function getContent(contact) {

	$('#infosgrenoble').empty();
	$('#infosgrenoble').html(contact[0].content);
	$('#ajoutcontact-grenoble').html('<a href="#" data-role="button" data-mini="true" data-inline="true" id="Grenoble" class="addContact" data-icon="person">Ajouter à mes contacts</a>');
	$('#infosgrenoble').trigger('create');

	$('#infoslyon').empty();
	$('#infoslyon').html(contact[1].content);
	$('#ajoutcontact-lyon').html('<a href="#" data-role="button" data-mini="true" data-inline="true" id="Lyon" class="addContact" data-icon="person">Ajouter à mes contacts</a>');
	$('#infoslyon').trigger('create');

	$(".addContact").on("click", function(){
		$.mobile.loading("show");
		var site = $(this).attr('id');

		var fields = ["displayName","nickname"];
		var options = new ContactFindOptions();
		options.filter="Eurofins Optimed " + site;
		navigator.contacts.find(fields, function(contacts){
			addOptimedContact(contacts,site);
		}, contactError, options);

	});

}


/**
 * [addOptimedContact description]
 * @param {[type]} contacts [description]
 * @param {[type]} site     [description]
 */
function addOptimedContact(contacts,site) {

	URLtoCall='http://www.optimed-recrutement.com/mobile/API/site';

	if(contacts.length == 0) {

		$.ajax({
			cache: false,
			url:URLtoCall,
			dataType: 'json',
			success: function(data) {
				switch (site)
				{
					case 'Grenoble':
						var id = 0;
					break;
					case 'Lyon':
						var id = 1;
					break;
				}
				
				var contact = navigator.contacts.create();
				contact.displayName = "Eurofins Optimed " + site;
				contact.nickname = "Eurofins Optimed " + site;
				var name = new ContactName();
				name.givenName = "Eurofins";
				name.familyName = "Optimed " + site;
				contact.name = name;
				var phoneNumbers = [];
				phoneNumbers[0] = new ContactField('work', data[id].telephone, false);
				contact.phoneNumbers = phoneNumbers;
				var Emails = [];
				Emails[0] = new ContactField('work', data[id].email, false);
				contact.emails = Emails;

				var Addresses = [];
				Addresses[0] = new ContactAddress();
                Addresses[0].type = 'home';
				Addresses[0].streetAddress = data[id].rue;
                Addresses[0].locality = data[id].ville;
                Addresses[0].postalCode = data[id].codepostal;
                Addresses[0].country = data[id].pays;
				contact.addresses = Addresses;

				contact.save(function() {
					$.mobile.loading("hide");
					navigator.notification.alert('Contact "Eurofins Optimed '+site+'" créé et sauvegardé !', null, 'Note :','OK');
				},function() {
					$.mobile.loading("hide");
					console.log("Error Contact!");
				});
			}
		});

	} else {
		$.mobile.loading("hide");
		navigator.notification.alert('Contact déjà existant !', null, 'Attention','OK');
	}
}

/**
 * [contactError description]
 * @param  {[type]} contactError [description]
 * @return {[type]}              [description]
 */
function contactError (contactError){
	navigator.notification.alert('Erreur durant la création du contact !', null, 'Erreur','OK');
}