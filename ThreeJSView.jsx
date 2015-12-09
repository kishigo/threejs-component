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
        this.configureCanvas(renderCanvas);
		if (!this.threeScene) {
			this.threeScene = new THREE.Scene();
		}
		if (!this.threeCamera) {
			if (this.props.state.camera === CameraType.perspective) {
				this.threeCamera = new THREE.PerspectiveCamera(this.props.VIEW_ANGLE, this.props.ASPECT, this.props.NEAR, this.props.FAR);
			}
			else {
				let width = this.props.canvasWidth, height = this.props.canvasHeight;
				this.threeCamera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, this.props.NEAR, this.props.FAR );

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

			this.threeControls.keys = [ 65, 83, 68 ];

			this.threeControls.addEventListener( 'change', this.render );
		}
		stupidFunction(renderCanvas);
		this.configureThreeJSView(renderCanvas);
		this.customTest('hello internal');
		let dims = {width: 10, height: 4};
		var ground = this.buildGround(dims);
		this.threeScene.add(ground);
		
		var light = new THREE.SpotLight(0xFFFFFF);
		light.position.set(100,100,2500);
		this.threeScene.add(light);

		this.threeCamera.position.z = 100;
		this.runAnimation = true;
		this.threeAnimate();
		this.threeRender();
	},
	componentWillUnmount: function componentWillUnmount () {
		this.threeControls = this.threeScene = this.threeCamera = this.threeRenderer = null;
	},
	shouldComponentUpdate: function shouldComponentUpdate (nextProps, nextState) {
		console.log('ThreeJSView: shouldComponentUpdate: ENTRY');
		let action = nextProps.state.action;
		var delta;
		switch (action.constructor.name) {
		case 'ActionZoom':
			delta = (action.direction === ActionType.ZoomIn) ? -action.zUnits : action.zUnits;
			this.threeCamera.position.z += delta;
			break;
		case 'ActionRotate':
			this.rotateCameraAroundScene(action.speed, action.direction);
			break;
		case 'ActionPan':
			this.panCameraAcrossScene(action.direction, action.delta);
			break;
		case 'ActionCamera':
			delta = (action.direction === ActionType.CameraUp) ? action.delta : -action.delta;
			this.threeCamera.position.y += delta;
			break;
		case 'ActionAddMesh':
			this.threeScene.add(action.mesh);
			break;
		}
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
		this.threeControls.handleResize();
	},
	buildGround: function buildGround (dims) {
		var w = dims.width * 10;
		var h = dims.height * 10;
		var geometry = new THREE.PlaneGeometry(w, h);
		//var material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
		var material = new THREE.MeshBasicMaterial( { color: 0xd2b48c } );
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.y = -20;
		mesh.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
		mesh.doubleSided = true;
		return mesh;
	},
	threeRender: function threeRender () {
		this.threeRenderer.render(this.threeScene, this.threeCamera);
	},
	threeAnimate: function threeAnimate () {
		if (this.runAnimation) {
			requestAnimationFrame(this.threeAnimate);
			this.threeControls.update();
			this.threeRenderer.render(this.threeScene, this.threeCamera)
		}
	},
	rotateCameraAroundScene: function rotateCameraAroundScene (rotSpeed, direction) {
		var x = this.threeCamera.position.x,
			z = this.threeCamera.position.z;
	
		if (direction === ActionType.RotateLt){
			this.threeCamera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
			this.threeCamera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
		} else if (direction === ActionType.RotateRt){
			this.threeCamera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
			this.threeCamera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
		}
	
		this.threeCamera.lookAt(this.threeScene.position);
	},
	panCameraAcrossScene: function panCameraAcrossScene (direction, delta) {
		if (direction === ActionType.PanLt) {
			this.threeScene.position.x -= delta;
		}
		else if (direction === ActionType.PanRt) {
			this.threeScene.position.x += delta;
		}
		this.threeCamera.lookAt(this.threeScene.position);
	}
});

var stupidFunction = function stupidFunction(canvas) {
	console.log('stupidFunction: ENTRY, canvas: ' + canvas);
};

