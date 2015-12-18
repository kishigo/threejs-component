if (Meteor.isClient) {
	var exceptionHandler = function exceptionHandler (e) {
		throw e;
	};
	EventEx = new EventEmitterEx();
	
	// counter starts at 0
	Session.setDefault('counter', 0);

	Template.hello.helpers({
		ThreeJSView: function () {
			return ThreeJSView;
		},
		counter: function () {
			return Session.get('counter');
		},
		defaultProps: function () {
			return {a:0, b:1, c:2};
		},
		store: function () {
			return ThreeJSViewActionStore;
		}
	});

	Template.hello.events({
		'click #initialize': function () {
			// Just add a ground reference plane
			Dispatcher.dispatch('TEST_INIT');
		},
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
		},
		'click #orthographicCamera': function () {
			Dispatcher.dispatch('SET_ORTHO_CAMERA');
		},
		'click #perspectiveCamera': function () {
			Dispatcher.dispatch('SET_PERSPECTIVE_CAMERA');
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}
