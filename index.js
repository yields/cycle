
/**
 * dependencies
 */

var emitter = require('emitter')
  , classes = require('classes')
  , events = require('events')
  , indexof = require('indexof');

/**
 * export `Cycle`.
 */

module.exports = Cycle;

/**
 * Initialize a `Cycle` with `el`.
 * 
 * @param {Element} el
 */

function Cycle(el){
  if (!(this instanceof Cycle)) return new Cycle(el);
  if (!el) throw new TypeError('cycle(): requires an element');
  this.events = events(el, this);
  this.els = el.children;
  this.el = el;
  this.selected = el.children[1];
  this.i = 1;
  this.bind();
}

/**
 * mixin `emitter`.
 */

emitter(Cycle.prototype);

/**
 * bind internal events.
 * 
 * @return {Cycle}
 */

Cycle.prototype.bind = function(){
  this.events.bind('click');
  this.events.bind('mousewheel');
  return this;
};

/**
 * unbind internal events.
 * 
 * @return {Cycle}
 */

Cycle.prototype.unbind = function(){
  this.events.unbind();
  return this;
};

/**
 * Select the given `el` or `i`.
 * 
 * @param {Number|Element} el
 * @return {Cycle}
 */

Cycle.prototype.select = function(el){
  if ('number' == typeof el) el = this.els[el];
  if (!this.selectable(el)) return;

  // rect
  var rect = el.getBoundingClientRect();
  this.i = indexof(el);

  // calculate top
  var top = (this.i - 1) * rect.height;

  // set top.
  this.el.style.top = 0 > top
    ? (top + 'px').substr(1)
    : '-' + top + 'px';

  // select
  classes(this.selected).remove('selected');
  classes(el).add('selected');
  this.selected = el;
  this.emit('select', this.selected);
  return this;
};

/**
 * Go up.
 * 
 * @return {Cycle}
 */

Cycle.prototype.up = function(e){
  if (e) e.preventDefault();
  return this.select(this.i - 1);
};

/**
 * Go down.
 * 
 * @return {Cycle}
 */

Cycle.prototype.down = function(e){
  if (e) e.preventDefault();
  return this.select(this.i + 1);
};

/**
 * Check if the given `el` is selectable.
 * 
 * @param {Element} el
 * @return {Boolean}
 * @api private
 */

Cycle.prototype.selectable = function(el){
  return null != el
    && el.parentNode == this.el
    && !classes(el).has('selected');
};

/**
 * on-click
 */

Cycle.prototype.onclick = function(e){
  this.select(e.target);
};

/**
 * on-mousewheel
 */

Cycle.prototype.onmousewheel = function(e){
  e.preventDefault();
  return 0 > e.wheelDelta
    ? this.down()
    : this.up();
};
