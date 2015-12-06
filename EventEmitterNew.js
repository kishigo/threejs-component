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
EventEmitterEx = class EventEmitterEx extends EventEmitter {
	/**
	 * This callback type is called 'exceptionHandler'
	 * @callback exceptionHandler
	 * @param {*} exceptionData
	 */
	/**
	 * If you throw out of throwHandler, the downstream listeners are skipped
	 * @param {?exceptionHandler} [exceptionHandler] optional if you want to handle any errors
	 */
	constructor (exceptionHandler) {
		super();
		this.exceptionHandler = exceptionHandler;
	}

	/**
	 * Add try-catch for robustness
	 * @param {Object[]} listenerArray array of subscribed listeners
	 * @param {Object} args event data
	 * @returns {number} number of listeners called
	 * @private
	 */
	_runCallbacksCatchThrow (listenerArray, args) {
		var self = this;
		// count of listeners triggered
		var count = 0;
		// Check if we have anything to work with
		if (typeof listenerArray !== 'undefined') {
			// Try to iterate over the listeners
			_.each(listenerArray, function(listener) {
				// Count listener calls
				count++;
				// Send the job to the eventloop
				try {
					listener.apply(self, args);
				}
				catch (e) {
					if (self.exceptionHandler) {
						self.exceptionHandler(e);
					}
				}
			});
		}

		// Return the count
		return count;
	}

	/**
	 * override original emit to allow use private _runCallbacksCatchThrow
	 * @param {string} eventName topic to event on
	 * @returns {boolean} true if there were listeners
	 */
	emit (eventName /* arguments */) {
		var self = this;
		// make argument list to pass on to listeners
		var args = _.rest(arguments);
	
		// Count listeners triggered
		var count = 0;
	
		// Swap once list
		var onceList = this._eventEmitter.onceListeners[eventName];
	
		// Empty the once list
		self._eventEmitter.onceListeners[eventName] = [];
	
		// Trigger on listeners
		count += this._runCallbacksCatchThrow.call(self, self._eventEmitter.onListeners[eventName], args);
	
		// Trigger once listeners
		count += self._runCallbacksCatchThrow.call(self, onceList, args);
	
		// Returns true if event had listeners, false otherwise.
		return (count > 0);
	}
};