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

ThreeJSView = React.createClass({
    proptypes: {
        optionalCanvasWidth: React.PropTypes.number,
        optionalCanvasHeight: React.PropTypes.number
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
		this.configureThreeJSView(renderCanvas);
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
	},
	configureThreeJSView: function configureThreeJSView (canvas) {
		var renderContainer = this.refs.threeJSView;
		var width;
		var height;
		if (renderContainer) {
			width = renderContainer.clientWidth;
			height = renderContainer.clientHeight;
		}
		else {
			width = 800;
			height = 600;
		}
		canvas.height = height;
		canvas.width = width;
		threeControls.handleResize();
	}
});

var stupidFunction = function stupidFunction(canvas) {
	console.log('stupidFunction: ENTRY, canvas: ' + canvas);
};

