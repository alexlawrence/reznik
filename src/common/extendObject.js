'use strict';

var extendObject = function(left, right) {
  for (var property in right) {
      if (right.hasOwnProperty(property)) {
          if (left[property] && typeof left[property] === 'object' && typeof right[property] === 'object') {
              extendObject(left[property], right[property]);
          }
          else {
              left[property] = right[property];
          }

      }
  }
};

module.exports = extendObject;