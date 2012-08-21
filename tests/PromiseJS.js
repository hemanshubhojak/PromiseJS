(function (global) {

    var states = {
        Pending: "Pending",
        Resolved: "Resolved",
        Rejected: "Rejected"
    };

    function Deferred() {
        var self = this,
            successCallbacks = [],
            failCallbacks = [],
            progressCallbacks = [],
            state = states.Pending,
            value;

        function Promise() {
            var self = this;

            self.success = function (callback) {
                if (state === states.Resolved) {
                    callback.call(self, value);
                }
                else {
                    successCallbacks.push(callback);
                }

                return self;
            };

            self.fail = function (callback) {
                if (state === states.Rejected) {
                    callback.call(self, value);
                }
                else {
                    failCallbacks.push(callback);
                }

                return self;
            };

            self.progress = function (callback) {
                progressCallbacks.push(callback);
                return self;
            };

            self.always = function (callback) {
                return self.success(callback).fail(callback);
            };

            self.then = function (onSuccess, onError) {
                return self.success(onSuccess).fail(onError);
            };

            self.isPending = function () {
                return state === states.Pending;
            };

            self.isResolved = function () {
                return state === states.Resolved;
            };

            self.isRejected = function () {
                return state === states.Rejected;
            };

            self.value = function () {
                return value;
            };
        }

        self.promise = new Promise();

        self.resolve = function (result) {
            if (state === states.Pending) {
                state = states.Resolved;
                value = result;
                successCallbacks.forEach(function (cb) {
                    cb.call(self.promise, value);
                });
            }
        };

        self.reject = function (error) {
            if (state === states.Pending) {
                state = states.Rejected;
                value = error;
                failCallbacks.forEach(function (cb) {
                    cb.call(self.promise, value);
                });
            }
        };

        self.notify = function () {
            if (state === states.Pending) {
                progressCallbacks.forEach(function (cb) {
                    cb.call(self.promise);
                });
            }
        };
    }

    function isArray(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    }

    function when(array) {
        var promises = isArray(array) ? array : Array.prototype.slice.call(arguments, 0),
            total = promises.length, completed = 0,
            d = new Deferred();

        promises.forEach(function (p) {
            p.always(function () {
                completed += 1;

                if (completed === total) {
                    d.resolve(promises);
                }
            });
        });

        return d.promise;
    }

    function executeChain(funcs, deferred, promises) {
        if (funcs.length === 0) {
            deferred.resolve(promises);
        }
        else {
            var promise = funcs[0].call();

            promise.always(function () {
                executeChain(
                    Array.prototype.slice.call(funcs, 1),
                    deferred,
                    promises.concat([promise])
                );
            });
        }
    }

    function chain(array) {
        var funcs = isArray(array) ? array : Array.prototype.slice.call(arguments, 0),
            d = new Deferred();

        if (funcs.length === 0) {
            d.resolve();
        }
        else {
            executeChain(funcs, d, []);
        }

        return d.promise;
    }

    global.PromiseJS = {
        Deferred: Deferred,
        when: when,
        chain: chain
    };
    
    //  For CommonJS environments
    if( typeof exports !== "undefined" ){
        exports.PromiseJS = global.PromiseJS;
    }

}(this));