/*jshint node:true, laxcomma:true */
const fs = require('fs');

function ConsoleBackend(startupTime, config, emitter){
  var self = this;
  this.lastFlush = startupTime;
  this.lastException = startupTime;
  this.config = config.console || {};
  // attach
  emitter.on('flush', function(timestamp, metrics) { self.flush(timestamp, metrics); });
  emitter.on('status', function(callback) { self.status(callback); });
}

function log(message) {
  console.log(message);
  fs.appendFileSync('csye6225.log', message+"\r\n");
}

ConsoleBackend.prototype.flush = function(timestamp, metrics) {
  var counters = metrics.counters ;
  delete counters["statsd.bad_lines_seen"];
  delete counters["statsd.packets_received"];
  delete counters["statsd.metrics_received"];

  var timers = metrics.timers;

  for( const counter in counters ){
    if (counters[counter] !== 0) {
      log(`${counter}:${counters[counter]}|c`);
    } else {
      console.log("no-api call count");
    }
  }

  for( const timer in timers ){
    if( timers[timer].length !== 0 ){
      log(`${timer}:${timers[timer].join(', ')}|ms`);
    } else {
      console.log("no-api call ms");
    }

  }
};

ConsoleBackend.prototype.status = function(write) {
  ['lastFlush', 'lastException'].forEach(function(key) {
    write(null, 'console', key, this[key]);
  }, this);
};

exports.init = function(startupTime, config, events) {
  var instance = new ConsoleBackend(startupTime, config, events);
  return true;
};
