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
/**
 * Act as a parent to the ThreeJSView component to allow that component to be reusable
 */
ThreeJSViewContainer = React.createClass({
	threeJSViewData: {canvasWidth: 900, canvasHeight: 700, testMode: true},
    render: function render () {
        console.log('ThreeJSViewContainer:render, threeJSViewData: ' + this.threeJSViewData);
		// Use POJS so we can pass an entire props object instead of specifying individual fields
		return React.createElement(ThreeJSView, this.threeJSViewData);
    },
    componentDidMount: function componentDidMount () {
        console.log('ThreeJSViewContainer:componentDidMount');
		//MBus.subscribe('_change_', function(message) {
		//	console.log('MBus: _change_, fakeState: ' + fakeState);
		//	let state = {fubar: fakeState};
		//	this.setState(state);
		//	fakeState++;
		//}.bind(this));
		listener = function (bar) {
			console.log('Event: _change_');
			let state = {fubar: fakeState};
			this.setState(state);
			throw 'errortest';
		}.bind(this);
		var listener2 = function (bar) {
			console.log('Event[2]: _change_');
			let state = {fubar: fakeState};
		}.bind(this);
		EventNew.on('_change_', listener);
		EventNew.on('_change_', listener2);
    }
});

var fakeState = 0;
var listener;