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

Checkout the complete documentation [here](https://github.com/hemanshubhojak/PromiseJS/wiki).