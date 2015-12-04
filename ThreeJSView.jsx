var threeScene = null;
var threeRenderer = null;
var threeCamera = null;
var threeControls = null;
var WIDTH = 400, HEIGHT = 300;
var VIEW_ANGLE = 75, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 1000;

ThreeJSView = React.createClass({
	render: function () {
		console.log('render');
		return (<div className="ThreeJSView" align="center"
					 style={{position: 'absolute', left: 0, width: 100 + '%', height: 100 + '%'}}>
			<canvas className='ThreeJSCanvas' ref='threeJSCanvas'
					style={{display: 'table-row', backgroundColor: '#222222'}}></canvas>
		</div>);
	},
	componentDidMount: function () {
		// Use a ref to get the underlying DOM element once we are mounted
		let renderCanvas = this.refs.threeJSCanvas;
		console.log('componentDidMount, canvas: ' + renderCanvas);
		if (threeScene === null) {
			threeScene = new THREE.Scene();
		}
		if (threeCamera === null) {
			threeCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		}
		if (threeRenderer === null) {
			threeRenderer = this.getRenderer(renderCanvas);
		}
		if (threeControls === null) {
			threeControls = new THREE.TrackballControls(threeCamera);
			threeControls.rotateSpeed = 1.0;
			threeControls.zoomSpeed = 1.2;
			threeControls.panSpeed = 0.8;

			threeControls.noZoom = false;
			threeControls.noPan = false;

			threeControls.staticMoving = true;
			threeControls.dynamicDampingFactor = 0.3;

			threeControls.keys = [ 65, 83, 68 ];

			//threeControls.addEventListener( 'change', render );
		}
		stupidFunction(renderCanvas);
		this.customTest('hello internal');
	},
	customTest: function (xxx) {
		console.log('customTest, xxx: ' + xxx);
	},
	getRenderer: function getRenderer (canvas) {
		// Detect webgl, fallback to canvas if missing.  Test is from mr.doob sample code to detect webgl
		try {
			!!( window.WebGLRenderingContext && ( canvas.getContext('webgl') || canvas.getContext('experimental-webgl') ) );
			return new THREE.WebGLRenderer({canvas: canvas});
		}
		catch (e) {
			return new THREE.CanvasRenderer({canvas: canvas});
		}
	}
});

var stupidFunction = function stupidFunction(canvas) {
	console.log('stupidFunction: ENTRY, canvas: ' + canvas);
};

