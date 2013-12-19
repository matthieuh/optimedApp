var reference;
var site;
//document.addEventListener("deviceready", onDeviceReady, false);


window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);

$("#formPage").bind("pageshow", function(event){
	var url = $.url(document.location);
    reference = url.param("ref");
    site = url.param("lieu");

	$('#formRef').text(reference);
});


/**
 * Gestion du DatePicker
 */

$(document).on("pagecreate", "#formPage", function() {
    var picker = $( "input[name='ddn']", this);
    picker.mobipick({
    	locale: "fr",
    	dateFormat: "dd-MM-yyyy"
    });
});    	
//intlStdDate: false

$("input[name='ddn']").on("change", function() {
    // formatted date, like yyyy-mm-dd              
    var date = $( this ).val();
 
    // JavaScript Date object
    var dateObject = $( this ).mobipick( "option", "date" );
});

/**
 * Gestion du formulaire
 */
/**
 * Gestion du formulaire
 */
$("#postuler").validate({
	rules: {
		genre: "required",
		prenom: "required",
		nom: "required",
		ddn: "required",
		tel: {
			required: true,
			number: true
		},
		email: {
			required: true,
			email: true
		},

		criteresOK: "required"
	},
	messages: {
		genre: "Indiquez votre genre",
		prenom: "Champ invalide !",
		nom: "Champ invalide!",
		ddn: "Champ invalide !",
		tel: "Champ invalide !",
		email: "Champ invalide !",
		criteresOK: "Correspondez-vous aux critères ?"
	},
	errorPlacement: function(error, element) {
		error.insertBefore($(element).parent());
	},
	submitHandler: function(form)
	{
		var secret = "vae5mcfaGwGKz6JG";

		$("#send").hide();
		$.mobile.loading("show");

		var genre = $('input[type=radio][name=genre]:checked').attr('value');
		var prenom = $("input[name=prenom]").val();
		var nom = $("input[name=nom]").val();
		var ddn = $("input[name=ddn]").val();
		var tel = $("input[name=tel]").val();
		var email = $("input[name=email]").val();


		if (site == 'Lyon') {
			URLtoCall='http://www.optimed-recrutement.com/mobile/API/sendemail/lyon/';
		}
		else {
			URLtoCall='http://www.optimed-recrutement.com/mobile/API/sendemail/grenoble/';
		}

		URLtoCall=URLtoCall+reference+'/'+genre+'/'+nom+'/'+prenom+'/'+ddn+'/'+tel+'/'+email+'/'+secret;

		$.ajax({
			url:URLtoCall,
			timeout:10000,
			type:'GET',
			success:function(data) {
				console.log('GET : ' + data);
				if (data=='EMAILSEND:OK') {
					$.mobile.loading("hide");
					navigator.notification.alert('Votre demande a été envoyée avec succès !', null, 'Envoyé','OK');
					$(location).attr('href',"index.html");
				} else {
					$.mobile.loading("hide");
					navigator.notification.alert('Erreur lors de l\'envoi !', null, 'Echec','OK');
				}
			},
			error:function(XMLHttpRequest,textStatus,errorThrown) {
				$.mobile.loading("hide");
				$("#send").show();
				navigator.notification.alert('Erreur lors de l\'envoi !', null, 'Echec','OK');

				console.log("Error status :" + textStatus);
				console.log("Error type :" + errorThrown);
				console.log("Error message :" + XMLHttpRequest.responseXML);
			}
		});
	}

});