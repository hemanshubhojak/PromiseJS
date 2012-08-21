PromiseJS
=========

PromiseJS is a JavaScript framework which helps you subscribe to an async operation which can notify you upon its completion.

**A simple example**

```javascript
function doAsync(){
  var d = new PromiseJS.Deferred();
  
  setTimeout(function(){
    d.resolve();
  }, 1000);
  
  return d.promise;
}

var promise = doAsync();

promise
  .success(function(){
    alert("Succeeded");
  })
  .fail(function(){
    alert("Failed");
  });
```

**Use `when(funcs)` to join a list of promises and get notified when all of them complete**
```javascript
var promise = PromiseJS.when(promise1, promise2, promise3, promise4); //  You can also pass an array of promises here

promise.then(function(promises){
  promises.forEach(function(p){
    if( promise.isResolved() ){
      alert( p.value() ); //  value() returns the result or error attached with the promise
    }
  });
})
```

**Use 'chain(funcs)' to call a list of deferred functions sequentially**
```javascript
var promise = PromiseJS.chain(func1, func2, func3, func4);  //  You can also pass an array of functions here

promise.then(function(promises){
  promises.forEach(function(p){
    if( promise.isResolved() ){
      alert( p.value() ); //  value() returns the result or error attached with the promise
    }
  });
});
```

**Use `isPending()`, `isResolved()` and `isRejected()` on a promise to check the status**

Checkout the complete documentation [here](https://github.com/hemanshubhojak/PromiseJS/wiki).