(function(j){function i(){var a=this,h=[],f=[],e=[],d=c.Pending,g;a.promise=new function(){var b=this;b.success=function(a){d===c.Resolved?a.call(b,g):h.push(a);return b};b.fail=function(a){d===c.Rejected?a.call(b,g):f.push(a);return b};b.progress=function(a){e.push(a);return b};b.always=function(a){return b.success(a).fail(a)};b.then=function(a,d){return b.success(a).fail(d)};b.isPending=function(){return d===c.Pending};b.isResolved=function(){return d===c.Resolved};b.isRejected=function(){return d===
c.Rejected};b.value=function(){return g}};a.resolve=function(b){d===c.Pending&&(d=c.Resolved,g=b,h.forEach(function(b){b.call(a.promise,g)}))};a.reject=function(b){d===c.Pending&&(d=c.Rejected,g=b,f.forEach(function(b){b.call(a.promise,g)}))};a.notify=function(){d===c.Pending&&e.forEach(function(b){b.call(a.promise)})}}function k(a,h,c){if(0===a.length)h.resolve(c);else{var e=a[0].call();e.always(function(){k(Array.prototype.slice.call(a,1),h,c.concat([e]))})}}var c={Pending:"Pending",Resolved:"Resolved",
Rejected:"Rejected"};j.PromiseJS={Deferred:i,when:function(a){var c="[object Array]"===Object.prototype.toString.call(a)?a:Array.prototype.slice.call(arguments,0),f=c.length,e=0,d=new i;c.forEach(function(a){a.always(function(){e+=1;e===f&&d.resolve(c)})});return d.promise},chain:function(a){var c="[object Array]"===Object.prototype.toString.call(a)?a:Array.prototype.slice.call(arguments,0),f=new i;0===c.length?f.resolve():k(c,f,[]);return f.promise}};"undefined"!==typeof exports&&(exports.PromiseJS=
j.PromiseJS)})(function(){return this}.call());