if (Meteor.isClient) {
	var exceptionHandler = function exceptionHandler (e) {
		throw e;
	};
	EventEx = new EventEmitterEx();
	
	// counter starts at 0
	Session.setDefault('counter', 0);

	Template.hello.helpers({
		ThreeJSViewContainer: function () {
			return ThreeJSViewContainer;
		},
		counter: function () {
			return Session.get('counter');
		}
	});

	Template.hello.events({
		'click #zoomIn': function () {
			// increment the counter when button is clicked
			//Session.set('counter', Session.get('counter') + 1);
			Dispatcher.dispatch('ZOOM_IN');
		},
		'click #zoomOut': function () {
			// increment the counter when button is clicked
			//Session.set('counter', Session.get('counter') - 1);
			Dispatcher.dispatch('ZOOM_OUT');
		},
		'click #rotRt': function () {
			// increment the counter when button is clicked
			//Session.set('counter', Session.get('counter') + 1);
			Dispatcher.dispatch('ROT_RT');
		},
		'click #rotLt': function () {
			// increment the counter when button is clicked
			//Session.set('counter', Session.get('counter') + 1);
			Dispatcher.dispatch('ROT_LT');
		},
		'click #panRt': function () {
			// increment the counter when button is clicked
			//Session.set('counter', Session.get('counter') + 1);
			Dispatcher.dispatch('PAN_RT');
		},
		'click #panLt': function () {
			// increment the counter when button is clicked
			//Session.set('counter', Session.get('counter') + 1);
			Dispatcher.dispatch('PAN_LT');
		},
		'click #cameraUp': function () {
			// increment the counter when button is clicked
			//Session.set('counter', Session.get('counter') + 1);
			Dispatcher.dispatch('CAMERA_UP');
		},
		'click #cameraDn': function () {
			// increment the counter when button is clicked
			//Session.set('counter', Session.get('counter') + 1);
			Dispatcher.dispatch('CAMERA_DN');
		},
		'click #sampleMesh': function () {
			Dispatcher.dispatch('TEST_MESH');
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}
