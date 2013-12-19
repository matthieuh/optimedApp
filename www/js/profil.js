            app.initialize();

			// Wait for Cordova to load
			//
			document.addEventListener("deviceready", onDeviceReady, false);
			var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
			
			// Cordova is ready
			//
			function onDeviceReady() {
			db.transaction(populateDB, errorCB, successCB);
			}
			
			
			function valider(){

			  if(document.formProfil.prenom.value != "") {
				db.transaction(populateDB, errorCB, successCB);  
				return true;
			  }
			  else {
				alert("Saisissez votre prénom");
				return false;
			  }
			}
			
			//add table and record to DB
			function populateDB(tx) {
				tx.executeSql('DROP TABLE IF EXISTS PROFIL');
				tx.executeSql('CREATE TABLE IF NOT EXISTS PROFIL (id unique, nom, prenom)');
				tx.executeSql('INSERT INTO PROFIL (id, prenom, nom) VALUES (1, document.formProfil.nom.value, document.formProfil.prenom.value)');
			}
			function errorCB(err) {
				alert("Error processing SQL: "+err);
			}

			function successCB() {
				alert("success!");
			}


			function afficher(frm){
				alert("Vous avez entré : " + frm.elements['prenom'].value);
			}
			
			function queryDB(tx){
				tx.executeSql('SELECT * FROM PROFIL',[],querySuccess,errorCB);
			}
			
			function querySuccess(tx,result){
				$('#ProfilRecap').empty();
				$.each(result.rows,function(index){
					var row = result.rows.item(index);
					$('#ProfilRecap').append('<li><a href="#"><h3 class="ui-li-heading">'+row['nom']+'</h3><p class="ui-li-desc">Club '+row['prenom']+'</p></a></li>');
	        });
			
			$('#ProfilRecap').listview();
			
			}