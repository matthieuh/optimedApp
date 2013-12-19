$('#fbLink').click( function() {
    window.open(encodeURI('https://www.facebook.com/pages/Eurofins-Optimed/226946754036621'), '_system', 'location=yes');
    return false; 
} );

$('#twLink').click( function() {
    window.open(encodeURI('https://twitter.com/EurofinsOptimed'), '_system', 'location=yes');
    return false; 
} );

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};