var map, marker_start, marker_end, myPosition, options, geocoder, something;


/**
 * [loadMap description]
 * @return {[type]} [description]
 */
function loadMap() {

	options = {
		scrollwheel: false,
		draggable: false,
		zoom: 14,
		center: something,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map"), options);
		marker_start = new google.maps.Marker({
		position: something,
		map: map,
		visible: true,
		title: "Emplacement du centre",
		myoption: "start"
	});
	codeAddress(optimedPosition);
}

/**
 * [loadScript description]
 * @return {[type]} [description]
 */
function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' + 'callback=loadMap';
	document.body.appendChild(script);
}

/**
 * [codeAddress description]
 * @param  {[type]} address [description]
 * @return {[type]}         [description]
 */
function codeAddress(address) {
	var geocoder = new google.maps.Geocoder();

	/* Appel au service de geocodage avec l'adresse en paramètre */
	geocoder.geocode({'address': address}, function (results, status) {

		/* Si l'adresse a pu être géolocalisée */
		if (status === google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location,
				title: "Emplacement du centre"
			});
		} else {
            console.log("Le geocodage n\'a pu etre effectue pour la raison suivante: " + status);
        }
	});
}