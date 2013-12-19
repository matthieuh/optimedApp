eDeviceReady(onDeviceReady);
fastClick();

var db;
var page;


/**
 * [onDeviceReady description]
 * @return {[type]} [description]
 */
function onDeviceReady() {
	log("Device Ready !");
	page = $('div[data-role="page"]').attr('id');

	if(stringSearch('contact',page))
		page = 'contact';

	db = window.openDatabase("eurofinOptimed", "1.0", "Optimed Sync Database", 200000);
	dao.initialize(function(fistTime) {
		checkConnection(fistTime);
	});
}

/**
 * Affiche la liste des études présentes en local : renderList()
 * Vérifie l'état de la connection (navigator.connection.type) :
 * Si connecté synchro (dao.sync) avec la BDD du site web des volontaire puis renderList()
 * @return {[type]} [description]
 */
function checkConnection(fistTime) {
	if (navigator.connection.type != "none") {
		dao.createTable(function() {
			if(page == 'etude') {
				dao.delOldEntries(function() {
					dao.sync(renderList);
				});
			} else {
				dao.sync(renderList);
			}
		});
	} else if (fistTime) {
		navigator.notification.alert('Une connexion internet est nécessaire au premier lancement de l\'application...', null, 'Connexion nécessaire !','OK');
	}
}



window.dao =  {

	/**
	 * Vérifie la présence d'une base SQLite
	 * @param  {Function} callback [Fonction de retour]
	 * @return {[type]}            [description]
	 */
	initialize: function(callback) {
		log('initialize...');
		var self = this;
		var firstime;
		db.transaction( function(tx) {
			tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='"+page+"'", this.txErrorHandler,
				function(tx, results) {
					if (results.rows.length == 1) {
						log('Using existing '+ page +' table in local SQLite database');
						renderList();
						callback(firstTime = false);
					}
					else
					{
						log(page+' table does not exist in local SQLite database');
						callback(firstime = true);
					}
				}
			);
		});
	},

	/**
	 * Créer la table SQLite si inexistante
	 * @param  {Function} callback [Fonction de retour]
	 * @return {[type]}            [description]
	 */
	createTable: function(callback) {
		db.transaction(
			function(tx) {
				tx.executeSql(createTableSQL);
			},
			this.txErrorHandler,
			function() {
				log('Table '+page+' successfully CREATED in local SQLite database');
			}
		);
		callback();
	},
	/**
	 * [dropTable description]
	 * @param  {Function} callback [Fonction de retour]
	 * @return {[type]}            [description]
	 */
	dropTable: function(callback) {
		db.transaction(
			function(tx) {
				tx.executeSql('DROP TABLE IF EXISTS '+page);
			},
			this.txErrorHandler,
			function() {
				log('Table '+page+' successfully DROPPED in local SQLite database');
				callback();
			}
		);
	},

	/**
	 * Récupération des données de la base SQLite
	 * @param  {Function} callback [Fonction de retour]
	 * @return {[type]}            [description]
	 */
	findAll: function(callback) {
		db.transaction(
			function(tx) {
				var sql = "SELECT * FROM "+page;
				log('Local SQLite database: "SELECT * FROM '+page);
				tx.executeSql(sql, this.txErrorHandler,
					function(tx, results) {
						var len = results.rows.length,
							data = [],
							i = 0;
						for (; i < len; i = i + 1) {
							data[i] = results.rows.item(i);
						}
						log(len + ' rows found');
						callback(data);
					}
				);
			}
		);
	},

	/**
	 * Récupération de la date de dernière synchronisation
	 * @param  {Function} callback [Fonction de retour]
	 * @return {[type]}            [description]
	 */
	getLastSync: function(callback) {
		db.transaction(
			function(tx) {
				var sql = "SELECT MAX(lastmodified) as lastSync FROM "+page;
				tx.executeSql(sql, this.txErrorHandler,
					function(tx, results) {
						var lastSync = results.rows.item(0).lastSync;
						//var lastSync = "2012-11-05 00:00:00";
						log('Last local timestamp is ' + lastSync);
						callback(lastSync);
					}
				);
			}
		);
	},

	/**
	 * Synchronisation des données entre la BDD du site web des volontaires et la base SQLite 
	 * @param  {Function} callback [Fonction de retour]
	 * @return {[type]}            [description]
	 */
	sync: function(callback) {
		var self = this;
		log('Starting synchronization...');
		this.getLastSync(function(lastSync){
			log('getLastSync Callback');
			log(self.syncPath + ' ' + lastSync);
			self.getChanges(syncPath, lastSync,
				function (changes) {

					log('getChanges Callback');
					if (changes.length > 0) {
						self.applyChanges(changes,function() {
							callback();
						});
					} else {
						log('Nothing to synchronize');
						callback();
					}
				}
			);
		});
	},

	delOldEntries: function(callback) {
		var url = "http://www.optimed-recrutement.com/mobile/API/etudes/idlist";
		$.ajax({
			cache: false,
			url: url,
			dataType:"json",
			success:function (data) {
				
				db.transaction(
					function(tx) {
						var sql = "SELECT id FROM etude";
						tx.executeSql(sql, this.txErrorHandler,
							function(tx, result) {
								var difference = [];
								var localArray = [];
								var internetArray = [];

								for (var i=0; i<result.rows.length; i++) {
									var row = result.rows.item(i);
									localArray.push(row['id']);
								}

								for (var i=0; i<data.length; i++) {
									var row = data[i].id;
									internetArray.push(row);
								}

								difference = arr_diff(internetArray,localArray);

								for (var i=0; i<difference.length; i++) {
									var id = difference[i];
									var sql = "DELETE FROM etude WHERE id="+id;
									tx.executeSql(sql, this.txErrorHandler);		
								}
								callback();
							}
						);
					}
				);

			},
			error: function(model, response) {
			}
		});
	},

	/**
	 * Réalise la récupération des données sur le site web des volontaires via l'API.
	 * @param  {[type]}   syncURL       [URL de l'API de récupération des données]
	 * @param  {[type]}   modifiedSince [Date de dernière modification]
	 * @param  {Function} callback      [Fonction de retour]
	 * @return {[type]}                 [description]
	 */
	getChanges: function(syncPath, modifiedSince, callback) {
		$.ajax({
			cache: false,
			url: syncPath+syncArgs,
			data: {modifiedSince: modifiedSince},
			dataType:"json",
			success:function (data) {
				log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
				callback(data);
			},
			error: function(model, response) {
			}
		});

	},

	/**
	 * Application des changements de la synchronisation dans la base de donnée SQLite.
	 * @param  {[type]}   data     [Données récupérées via l'API et à ajouter en SQLite]
	 * @param  {Function} callback [Fonction de retour]
	 * @return {[type]}            [description]
	 */
	applyChanges: function(data,callback) {
		db.transaction(
			function(tx) {
				log('Inserting or Updating in local database:');
				SQLUpdate(data,tx);
				callback();
			}
		);
	},

	/**
	 * [Récupération des erreurs pour log ou affichage]
	 * @param  {[type]} tx [Objet du message d'erreur]
	 * @return {[type]}    [description]
	 */
	txErrorHandler: function(tx) {
		log("Error : " +tx.message);
	}
};


/**
 * Incorporation des données dans la page liée
 * @param  {[type]} data [Données à afficher]
 * @return {[type]}      [description]
 */
function renderList(data) {
	log('Rendering list using local SQLite data...');
	dao.findAll(
		function(data) {
			getContent(data);
		}
	);
}


/**
 * Réalise un console.log du message reçu en paramètre
 * @param  {[type]} msg [Message à logguer ou afficher]
 * @return {[type]}     [description]
 */
function log(msg) {
	console.log(msg);
}

function arr_diff(a1, a2) {
  var a=[], diff=[];
  for(var i=0;i<a1.length;i++)
    a[a1[i]]=true;
  for(var i=0;i<a2.length;i++)
    if(a[a2[i]]) delete a[a2[i]];
    else a[a2[i]]=true;
  for(var k in a)
    diff.push(k);
  return diff;
}