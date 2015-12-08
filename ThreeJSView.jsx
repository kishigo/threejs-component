/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 kishigo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var threeScene = null;
var threeRenderer = null;
var threeCamera = null;
var threeControls = null;
var WIDTH = 400, HEIGHT = 300;
var VIEW_ANGLE = 75, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 1000;

CameraType = {
	perspective: 0,
	orthographic: 1
};

ThreeJSView = React.createClass({
    proptypes: {
		// optional
		testMode: React.PropTypes.bool,
        canvasWidth: React.PropTypes.number.isRequired,
        canvasHeight: React.PropTypes.number.isRequired,
    },
	getDefaultProps: function () {
		return {
			canvasWidth: 800,
			canvasHeight: 600
		};
	},
	render: function () {
		console.log('ThreeJSView:render');
		return (<div className="ThreeJSView" ref='threeJSView' align="center"
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
			if (this.props.state.camera === CameraType.perspective) {
				threeCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
			}
			else {
				let width = this.props.canvasWidth, height = this.props.canvasHeight;
				threeCamera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, NEAR, FAR );

			}
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
		this.configureThreeJSView(renderCanvas);
		this.customTest('hello internal');
		let dims = {width: 10, height: 4};
		var ground = this.buildGround(dims);
		threeScene.add(ground);
		
		var light = new THREE.SpotLight(0xFFFFFF);
		light.position.set(100,100,2500);
		threeScene.add(light);

		threeCamera.position.z = 100;
		
		threeRenderer.render(threeScene, threeCamera);
	},
	shouldComponentUpdate: function shouldComponentUpdate (nextProps, nextState) {
		console.log('ThreeJSView: shouldComponentUpdate: ENTRY');
		return !this.isMounted();
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
	},
	configureThreeJSView: function configureThreeJSView (canvas) {
		var renderContainer = this.refs.threeJSView;
		var width;
		var height;
		// set area either from container or props if no container
		if (!this.props.testMode && renderContainer) {
			width = renderContainer.clientWidth;
			height = renderContainer.clientHeight;
		}
		else {
			width = this.props.canvasWidth;
			height = this.props.canvasHeight;
		}
		canvas.height = height;
		canvas.width = width;
		threeControls.handleResize();
	},
	buildGround: function buildGround (dims) {
		var w = dims.width * 10;
		var h = dims.length * 10;
		var geometry = new THREE.PlaneGeometry(w, h);
		//var material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
		var material = new THREE.MeshBasicMaterial( { color: 0xd2b48c } );
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.y = -20;
		mesh.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
		mesh.doubleSided = true;
		return mesh;
	}
});

var stupidFunction = function stupidFunction(canvas) {
	console.log('stupidFunction: ENTRY, canvas: ' + canvas);
};

