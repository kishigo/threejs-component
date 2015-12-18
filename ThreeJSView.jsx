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

CameraType = {
	perspective: 0,
	orthographic: 1
};

ThreeJSView = React.createClass({
    proptypes: {
		// optional
		testMode: React.PropTypes.bool,
        canvasWidth: React.PropTypes.number.isRequired,
        canvasHeight: React.PropTypes.number.isRequired
    },
	getDefaultProps: function () {
		return {canvasWidth: 900, canvasHeight: 700, testMode: true, WIDTH: 400, HEIGHT: 300, ASPECT: 400/300, VIEW_ANGLE: 75, NEAR: 0.1, FAR: 1000};
	},
	getInitialState: function getInitialState () {
		return this.props.store.getAll();
	},
	/**
	 * For threejs components which render themselves, this is a one time action
	 * @returns {XML}
	 */
	render: function () {
		console.log('ThreeJSView:render');
		return (<div className="ThreeJSView" ref='threeJSView' align="center"
					 style={{position: 'absolute', left: 0, width: 100 + '%', height: 100 + '%'}}>
			<canvas className='ThreeJSCanvas' ref='threeJSCanvas'
					style={{display: 'table-row', backgroundColor: '#222222'}}></canvas>
		</div>);
	},
	/**
	 * Set up the threejs basic render context, controls
	 */
	componentDidMount: function () {
		// Use a ref to get the underlying DOM element once we are mounted
		let renderCanvas = this.refs.threeJSCanvas;
		console.log('componentDidMount, canvas: ' + renderCanvas);
		this.configureCanvas(renderCanvas);
		this.plugin = this.state.plugin;
		let storeName = this.props.store.name;
		let listener = function (bar) {
			console.log('Event: ' + storeName);
			// Pass the state to the real component whenever the store updates the state
			this.setState(this.props.store.getAll());
		}.bind(this);
		EventEx.on(storeName, listener);

		if (!this.threeScene) {
			this.threeScene = new THREE.Scene();
		}
		if (!this.threeCamera) {
			if (this.state.camera === CameraType.perspective) {
				this.threeCamera = new THREE.PerspectiveCamera(this.props.VIEW_ANGLE, this.props.ASPECT, this.props.NEAR, this.props.FAR);
			}
			else {
				let width = this.props.canvasWidth, height = this.props.canvasHeight;
				this.threeCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, this.props.NEAR, this.props.FAR);

			}
		}
		if (!this.threeRenderer) {
			this.threeRenderer = this.getRenderer(renderCanvas);
		}
		if (!this.threeControls) {
			this.threeControls = new THREE.TrackballControls(this.threeCamera);
			this.threeControls.rotateSpeed = 1.0;
			this.threeControls.zoomSpeed = 1.2;
			this.threeControls.panSpeed = 0.8;

			this.threeControls.noZoom = false;
			this.threeControls.noPan = false;

			this.threeControls.staticMoving = true;
			this.threeControls.dynamicDampingFactor = 0.3;

			this.threeControls.keys = [65, 83, 68];

			this.threeControls.addEventListener('change', this.render);
		}
		this.threeControls.handleResize();
		
		if (this.plugin) {
			this.plugin.setContext(this.threeScene, this.threeCamera, this.threeRenderer);
		}
		
		var light = new THREE.SpotLight(0xFFFFFF);
		light.position.set(100,100,2500);
		this.threeScene.add(light);

		this.threeCamera.position.z = 100;
		this.runAnimation = true;
		this.threeAnimate();
		this.threeRender();
	},
	/**
	 * Clear out threejs context on unmount
	 */
	componentWillUnmount: function componentWillUnmount () {
		this.threeControls = this.threeScene = this.threeCamera = this.threeRenderer = null;
	},
	/**
	 * This is where we proxy action to plugin and also prevent vdom activity
	 * Note, this will prevent the entire subtree from updating so ideally, ThreeJSView should be a leaf node
	 * @param nextProps
	 * @param nextState
	 * @returns {boolean}
	 */
	shouldComponentUpdate: function shouldComponentUpdate (nextProps, nextState) {
		console.log('ThreeJSView: shouldComponentUpdate: ENTRY');
		let action = nextState.action;
		this.plugin.handleAction(action);
		return !this.isMounted();
	},
	/**
	 * Detect webgl and return appropriate threejs renderer, prefer webgl
	 * @param {object} canvas - dom item
	 * @returns {*} - threejs renderer
	 */
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
	/**
	 * Compute canvas height and width
	 * @param canvas - dom item, mutate height and width on it
	 */
    configureCanvas: function configureCanvas (canvas) {
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
    },
	/**
	 * wrapper around the threejs render call
	 */
	threeRender: function threeRender () {
		this.threeRenderer.render(this.threeScene, this.threeCamera);
	},
	/**
	 * threejs render with RAF
	 */
	threeAnimate: function threeAnimate () {
		if (this.runAnimation) {
			requestAnimationFrame(this.threeAnimate);
			this.threeControls.update();
			this.threeRenderer.render(this.threeScene, this.threeCamera)
		}
	}
});

