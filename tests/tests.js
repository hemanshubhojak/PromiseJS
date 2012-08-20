function doAsync(reject) {
    var d = new PromiseJS.Deferred();

    setTimeout(function () {
        if (reject) {
            d.reject();
        }
        else {
            d.resolve();
        }
    }, 500);

    return d.promise;
}

function doAsyncWithNotify() {
    var d = new PromiseJS.Deferred();

    setTimeout(function () {
        d.notify();
        d.resolve();
    }, 500);

    return d.promise;
}

asyncTest("Should call the success callback when resolved", function () {

    var promise = doAsync(false);

    promise.success(function () {
        ok(true, "Success called");
        start();
    });

});

asyncTest("Should call the fail callback when rejected", function () {

    var promise = doAsync(true);

    promise.fail(function () {
        ok(true, "Fail called");
        start();
    });

});

asyncTest("Should call the progress callback when notify", function () {

    var promise = doAsyncWithNotify();

    promise.progress(function () {
        ok(true, "Notify called");
        start();
    });

});

asyncTest("Should not resolve when it is already failed", function () {

    var func = function () {
        var d = new PromiseJS.Deferred();

        setTimeout(function () {

            d.reject();
            d.resolve();

        }, 500);

        return d.promise;
    };

    var promise = func();

    promise
        .success(function () {
            ok(false, "Should not call success if it is already failed");
            start();
        })
        .fail(function () {
            ok(true, "Fail called");
            start();
        });

});

asyncTest("Should not reject when it is already resolved", function () {

    var func = function () {
        var d = new PromiseJS.Deferred();

        setTimeout(function () {
            d.resolve();
            d.reject();
        }, 500);

        return d.promise;
    };

    var promise = func();

    promise
        .fail(function () {
            ok(false, "Should not call fail if it is already resolved");
            start();
        })
        .success(function () {
            ok(true, "Success called");
            start();
        });

});

asyncTest("Should notify only if pending", function () {

    var func = function () {
        var d = new PromiseJS.Deferred();

        setTimeout(function () {
            d.resolve();
            d.notify();
        }, 500);

        return d.promise;
    };

    var promise = func();

    promise
        .progress(function () {
            ok(false, "Should not notify if it is not pending");
            start();
        })
        .success(function () {
            ok(true, "Success called");
            start();
        });

});

test("Should immediately call success if its already resolved", function () {
    expect(1);
    var func = function () {
        var d = new PromiseJS.Deferred();

        d.resolve();

        return d.promise;
    };

    var promise = func();

    promise
        .success(function () {
            ok(true, "Success called");
        });

});

test("Should immediately call fail if its already rejected", function () {
    expect(1);
    var func = function () {
        var d = new PromiseJS.Deferred();

        d.reject();

        return d.promise;
    };

    var promise = func();

    promise
        .fail(function () {
            ok(true, "Fail called");
        });

});

test("Should pass the result as argument while calling success", function () {
    expect(1);
    var func = function () {
        var d = new PromiseJS.Deferred();

        d.resolve(1);

        return d.promise;
    };

    var promise = func();

    promise
        .success(function (result) {
            equal(result, 1, "Result should be 1");
        });
});

test("Should pass the error as argument while calling fail", function () {
    expect(1);
    var func = function () {
        var d = new PromiseJS.Deferred();

        d.reject(1);

        return d.promise;
    };

    var promise = func();

    promise
        .fail(function (error) {
            equal(error, 1, "Error should be 1");
        });
});

test("Should call callback passed to always when failed", function () {
    expect(1);
    var func = function () {
        var d = new PromiseJS.Deferred();

        d.reject(1);

        return d.promise;
    };

    var promise = func();

    promise
        .always(function (data) {
            equal(data, 1, "Data should be 1");
        });
});

test("Should call callback passed to always when resolved", function () {
    expect(1);
    var func = function () {
        var d = new PromiseJS.Deferred();

        d.resolve(1);

        return d.promise;
    };

    var promise = func();

    promise
        .always(function (data) {
            equal(data, 1, "Data should be 1");
        });
});

test("Should call success callback passed to then when resolved", function () {
    expect(1);
    var func = function () {
        var d = new PromiseJS.Deferred();

        d.resolve();

        return d.promise;
    };

    var promise = func();

    promise
        .then(
            function () {
                ok(true, "Success called");
            },
            function () {
                ok(false, "Should not call fail");
            }
        );
});

test("Should call fail callback passed to then when rejected", function () {
    expect(1);
    var func = function () {
        var d = new PromiseJS.Deferred();

        d.reject();

        return d.promise;
    };

    var promise = func();

    promise
        .then(
            function () {
                ok(false, "Should not call success");
            },
            function () {
                ok(true, "Fail called");
            }
        );
});

asyncTest("Should complete with all promises in when", function () {
    var func = function (val) {
        var d = new PromiseJS.Deferred();

        setTimeout(function () {
            d.resolve(val);
        }, 500);

        return d.promise;
    };

    var promise = PromiseJS.when([ func(1), func(2) ]);

    promise.success(function (promises) {
        equal(promises.length, 2, "Should return 2 promises");
        start();
    });
});

asyncTest("Should complete with all functions sequentially in a chain", function () {
    var func = function (val, timeout) {
        return function () {
            var d = new PromiseJS.Deferred();

            setTimeout(function () {
                d.resolve(val);
            }, timeout);

            return d.promise;
        };
    };

    var promise = PromiseJS.chain([func(1, 500), func(2, 400), func(3, 300)]);

    promise.success(function (promises) {
        equal(promises.length, 3, "Should return 3 promises");
        equal(promises[0].value(), 1, "Should be 1");
        equal(promises[2].value(), 3, "Should be 3");
        start();
    });
});