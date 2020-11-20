function Emitter () {
  this.events = {};
}

Emitter.prototype.on = function(event, cb) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(cb);
};

Emitter.prototype.off = function(event, cb) {
  if (!this.events[event] || !this.events[event]) return false;
  let cbs = this.events[event];
  let findIndex = cbs.findIndex(c => c === cb);
  if (findIndex !== -1) {
    this.cbs.splice(findIndex, 1);
  }
};

Emitter.prototype.emit = function(event) {
  if (!this.events[event] || !this.events[event]) return false;
  let cbs = this.events[event];
  let args = Array.prototype.slice.call(arguments, 1);
  while (cbs.length > 0) {
    let cb = cbs.shift();
    cb.apply(null, args);
  }
};

export default Emitter;
