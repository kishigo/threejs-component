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
ActionType = {
	ZoomIn: 0,
	ZoomOut: 1,
	RotateRt: 2,
	RotateLt: 3,
	PanRt: 4,
	PanLt: 5,
	CameraUp: 6,
	CameraDn: 7,
	AddMesh: 8
};

AbstractAction = class AbstractAction {
	constructor () {}
};

ActionZoom = class ActionZoom extends AbstractAction {
	constructor (direction, zUnits) {
		super();
		this.direction = direction;
		this.zUnits = zUnits;
	}
};

ActionRotate = class ActionRotate extends AbstractAction {
	constructor (direction, speed) {
		super();
		this.direction = direction;
		this.speed = speed;
	}
};

ActionPan = class ActionPan extends AbstractAction {
	constructor (direction, delta) {
		super();
		this.direction = direction;
		this.delta = delta;
	}
};

ActionCamera = class ActionCamera extends AbstractAction {
	constructor (direction, delta) {
		super();
		this.direction = direction;
		this.delta = delta;
	}
};

ActionAddMesh = class ActionAddMesh extends AbstractAction {
	constructor (mesh) {
		super();
		this.mesh = mesh;
	}
};

ThreeJSViewActionStore = (function () {
	const EVENT_TYPE = 'ThreeJSViewActionStore';
	Dispatcher.register(function (action) {
		switch (action.type) {
		case 'TEST_TRIGGER':
			console.log('TEST_TRIGGER');
			//MBus.publish('_change_', null);
			EventEx.emit('_change_', {data: null});
			break;
		case 'ZOOM_IN':
			_state.action = new ActionZoom(ActionType.ZoomIn, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'ZOOM_OUT':
			_state.action = new ActionZoom(ActionType.ZoomOut, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'ROT_RT':
			_state.action = new ActionRotate(ActionType.RotateRt, 0.2);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'ROT_LT':
			_state.action = new ActionRotate(ActionType.RotateLt, 0.2);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'PAN_RT':
			_state.action = new ActionPan(ActionType.PanRt, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'PAN_LT':
			_state.action = new ActionPan(ActionType.PanLt, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'CAMERA_UP':
			_state.action = new ActionCamera(ActionType.CameraUp, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'CAMERA_DN':
			_state.action = new ActionCamera(ActionType.CameraDn, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'TEST_MESH':
			_state.action = new ActionAddMesh(_buildMesh('custom.png', 0.5, 0.5, 0.5, 'sphere'));
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		}
	});
	
	var _state = {
		camera: CameraType.perspective
	};
	
	var _buildMesh = function _buildMesh (url, width, height, depth, shape) {
		let bitmap = new Image();
		bitmap.src = url;
		bitmap.onerror = function () {
			console.error('Error loading: ' + bitmap.src);
		};
		width = width * 10;
		height = height * 10;
		depth = depth * 10;
		let geometry;
		let texture = THREE.ImageUtils.loadTexture(bitmap.src);
		let material = new THREE.MeshPhongMaterial({ map: texture });
		switch (shape) {
		case 'sphere':
			geometry = new THREE.SphereGeometry(depth / 2, 64, 64);
			break;
		default:
			geometry = new THREE.BoxGeometry(width, height, depth);
			break;
		}
		let mesh = new THREE.Mesh(geometry, material);
		mesh.position.y = -20 + (depth / 2);
		mesh.rotation.y = -Math.PI/2; //-90 degrees around the yaxis
		// adjust x
		mesh.position.x = 0;
		mesh.position.z = 0;
		return mesh;
	};
	
	var _getAll = function _getAll () {
		return _state;
	};
	
	var _getState = function _getState () {
		return _state;
	};
	
	return {
		getAll: _getAll,
		getState: _getState
	}
})();