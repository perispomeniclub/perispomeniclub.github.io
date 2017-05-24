
/**
 * Priority queue by Agnat.
 * source: https://github.com/agnat/js_priority_queue
 * 
 * Copyright (c) 2012 David Siegel
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */


(function() { // namespace

var exports = (typeof module !== 'undefined' && module.exports) ?
    module.exports : window.priority_queue = {};

exports.PriorityQueue = function PriorityQueue(compare, queue) {
  if (!(this instanceof PriorityQueue)) return new PriorityQueue(compare, queue);

  compare = compare || min_first;
  queue   = queue   || [];

  function swap(i, j) { var t = queue[i]; queue[i] = queue[j]; queue[j] = t; }

  function heapify(i) {
    var length = queue.length, x, l, r;
    while (true) {
      x = i; l = left(i); r = right(i);
      if (l < length && compare(queue[l], queue[x]) < 0) x = l;
      if (r < length && compare(queue[r], queue[x]) < 0) x = r;
      if (x === i) break;
      swap(i, x);
      i = x;
    }
  }

  function remove(i) {
    var t = queue[i], b = queue.pop();
    if (queue.length > 0) {
      queue[i] = b;
      heapify(i);
    }
    return t;
  }

  this.push = function push(/* element, ... */) {
    var i = queue.length, e = i + arguments.length, j, p;
    queue.push.apply(queue, arguments);
    for (; i < e; ++i) {
      j = i; p = parent(i);
      for (; j > 0 && compare(queue[j], queue[p]) < 0; j = p, p = parent(j)) {
        swap(j, p);
      }
    }
    return queue.length;
  }

  this.shift = function shift() { return remove(0); }
  this.__defineGetter__('length', function length() { return queue.length });

  for (var i = parent(queue.length - 1); i >= 0; --i) { heapify(i) }
}

function left(i)   { return 2 * i + 1 }
function right(i)  { return 2 * i + 2 }
function parent(i) { return Math.floor((i + 1) / 2) - 1 }

var max_first = exports.max_first = function max_first(a, b) { return b - a }
  , min_first = exports.min_first = function min_first(a, b) { return a - b }
  ;

})(); // end of namespace 
