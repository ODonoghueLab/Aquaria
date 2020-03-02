/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.2.0
 */

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


(function(_global) {
  "use strict";

  var shim = {};
  if (typeof(exports) === 'undefined') {
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      shim.exports = {};
      define(function() {
        return shim.exports;
      });
    } else {
      // gl-matrix lives in a browser, define its namespaces in global
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // gl-matrix lives in commonjs, define its namespaces in exports
    shim.exports = exports;
  }

  (function(exports) {
    /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

if(!GLMAT_RANDOM) {
    var GLMAT_RANDOM = Math.random;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matricies
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    var z = (GLMAT_RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = GLMAT_RANDOM();
    out[1] = GLMAT_RANDOM();
    out[2] = GLMAT_RANDOM();
    out[3] = GLMAT_RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

mat3.fromValues = function(m00, m10, m20, 
    m01, m11, m21, 
    m02, m12, m22) {
  var out = new GLMAT_ARRAY_TYPE(9);
  out[ 0] = m00; out[ 1] = m10; out[ 2] = m20;
  out[ 3] = m01; out[ 4] = m11; out[ 5] = m21; 
  out[ 6] = m02; out[ 7] = m12; out[8] = m22; 
  return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[3] = xy + wz;
    out[6] = xz - wy;

    out[1] = xy - wz;
    out[4] = 1 - (xx + zz);
    out[7] = yz + wx;

    out[2] = xz + wy;
    out[5] = yz - wx;
    out[8] = 1 - (xx + yy);

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

mat4.fromValues = function(m00, m10, m20, m30, 
                           m01, m11, m21, m31, 
                           m02, m12, m22, m32, 
                           m03, m13, m23, m33) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[ 0] = m00; out[ 1] = m10; out[ 2] = m20, out[ 3] = m30;
    out[ 4] = m01; out[ 5] = m11; out[ 6] = m21; out[ 7] = m31;
    out[ 8] = m02; out[ 9] = m12; out[10] = m22; out[11] = m32;
    out[12] = m03; out[13] = m13; out[14] = m23; out[15] = m33;
    return out;
};
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

/**
* Calculates a 4x4 matrix from the given quaternion
*
* @param {mat4} out mat4 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat4} out
*/
mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;

    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;

    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class Quaternion
 * @name quat
 */

var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = view[0];
        matr[5] = view[1];
        matr[8] = view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = (function() {
    // benchmarks:
    //    http://jsperf.com/typed-array-access-speed
    //    http://jsperf.com/conversion-of-3x3-matrix-to-quaternion

    var s_iNext = (typeof(Int8Array) !== 'undefined' ? new Int8Array([1,2,0]) : [1,2,0]);

    return function(out, m) {
        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quaternion Calculus and Fast Animation".
        var fTrace = m[0] + m[4] + m[8];
        var fRoot;

        if ( fTrace > 0.0 ) {
            // |w| > 1/2, may as well choose w > 1/2
            fRoot = Math.sqrt(fTrace + 1.0);  // 2w
            out[3] = 0.5 * fRoot;
            fRoot = 0.5/fRoot;  // 1/(4w)
            out[0] = (m[7]-m[5])*fRoot;
            out[1] = (m[2]-m[6])*fRoot;
            out[2] = (m[3]-m[1])*fRoot;
        } else {
            // |w| <= 1/2
            var i = 0;
            if ( m[4] > m[0] )
              i = 1;
            if ( m[8] > m[i*3+i] )
              i = 2;
            var j = s_iNext[i];
            var k = s_iNext[j];
            
            fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
            out[i] = 0.5 * fRoot;
            fRoot = 0.5 / fRoot;
            out[3] = (m[k*3+j] - m[j*3+k]) * fRoot;
            out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
            out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
        }
        
        return out;
    };
})();

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;

  })(shim.exports);
})(this);

// Copyright (c) 2013-2014 Marco Biasini
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to 
// deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.

(function(exports) {
"use strict";

exports.derive = function(subclass, baseclass) {
  for (var prop in baseclass.prototype) {
    subclass.prototype[prop] = baseclass.prototype[prop];
  }
};

exports.bind = function (obj, fn) {
    return function() {
      return fn.apply(obj, arguments);
  };
};

exports.copy = function(src) {
  src = src || {};
  var cloned = {};
  for (var prop in src) {
    if (src.hasOwnProperty(prop)) {
      cloned[prop] = src[prop];
    }
  }
  return cloned;
};

function defaultComp(lhs, rhs) {
  return lhs < rhs;
}

// returns the index into the values array for the first value identical to
// *value*.
exports.binarySearch = function(values, value, comp) {
  if (values.length === 0) {
    return -1;
  }
  comp = comp || defaultComp;
  var low = 0, high = values.length;
  var mid  = (low + high) >> 1;
  while (true) {
    var midValue = values[mid];
    if (comp(value, midValue)) {
      high = mid;
    } else if (comp(midValue, value)) {
      low = mid;
    } else {
      return mid;
    }
    var newMid  = (low + high) >> 1;
    if (newMid === mid) {
      return -1;
    }
    mid = newMid;
  }
  return -1;
};

// returns the index of the first item in the list whose value is 
// larger or equal than *value*.
exports.indexFirstLargerEqualThan = function(values, value, comp) {
  comp = comp || defaultComp;
  if (values.length === 0 || comp(value, values[0])) {
    return -1;
  }
  var low = 0, high = values.length;
  var mid = (low + high) >> 1;
  while (true) {
    var midValue = values[mid];
    if (comp(value, midValue)) {
      // there might be other values larger than value with an index
      // lower than mid.
      high = mid;
    } else if (comp(midValue, value)) {
      low = mid;
    } else {
      high = mid+1;
    }
    var newMid  = (low + high) >> 1;
    if (newMid === mid) {
      return mid;
    }
    mid = newMid;
  }
};

exports.indexLastSmallerThan = function(values, value, comp) {
  comp = comp || defaultComp;
  if (values.length === 0 || comp(values[values.length-1], value)) {
    return values.length-1;
  }
  var low = 0, high = values.length;
  var mid = (low + high) >> 1;
  var cnt = 0;
  while (true) {
    var midValue = values[mid];
    if (comp(value, midValue)) {
      high = mid;
    } else {
      low = mid;
    }
    var newMid  = (low + high) >> 1;
    if (newMid === mid) {
      return mid-1;
    }
    mid = newMid;
  }
};

exports.indexLastSmallerEqualThan = function(values, value, comp) {
  comp = comp || defaultComp;
  if (values.length === 0 || comp(values[values.length-1], value)) {
    return values.length-1;
  }
  if (comp(value, values[0])) {
    return -1;
  }
  var low = 0, high = values.length;
  var mid = (low + high) >> 1;
  var cnt = 0;
  while (true) {
    var midValue = values[mid];
    if (comp(value, midValue)) {
      high = mid;
    } else {
      low = mid;
    }
    var newMid  = (low + high) >> 1;
    if (newMid === mid) {
      return mid;
    }
    mid = newMid;
  }
};

return true;
})(this);

// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var geom = (function() {
  "use strict";
  // calculates the signed angle of vectors a and b with respect to
  // the reference normal c. 
var signedAngle = (function() {
    var tmp = vec3.create();
    return function(a, b, c) {
      vec3.cross(tmp, a, b);
    return Math.atan2(vec3.dot(tmp, c), vec3.dot(a, b));
  };
})();

// calculate a vector orthogonal to an input vector
var ortho = (function() {
  var tmp = vec3.create();
  return function(out, vec) {
    vec3.copy(tmp, vec);
  if (Math.abs(vec[0]) < Math.abs(vec[1])) {
    if (Math.abs(vec[0]) < Math.abs(vec[2])) {
      tmp[0] += 1;
    } else {
      tmp[2] += 1;
    }
  } else {
    if (Math.abs(vec[1]) < Math.abs(vec[2])) {
      tmp[1] += 1;
    } else {
      tmp[2] += 1;
    }
  }
  return vec3.cross(out, vec, tmp);
  };
})();

// assumes that axis is normalized. don't expect  to get meaningful
// results when it's not
var axisRotation = function(out, axis, angle) {
  var sa = Math.sin(angle), ca = Math.cos(angle), x = axis[0], y = axis[1],
      z = axis[2], xx = x * x, xy = x * y, xz = x * z, yy = y * y, yz = y * z,
      zz = z * z;

  out[0] = xx + ca - xx * ca;
  out[1] = xy - ca * xy - sa * z;
  out[2] = xz - ca * xz + sa * y;
  out[3] = xy - ca * xy + sa * z;
  out[4] = yy + ca - ca * yy;
  out[5] = yz - ca * yz - sa * x;
  out[6] = xz - ca * xz - sa * y;
  out[7] = yz - ca * yz + sa * x;
  out[8] = zz + ca - ca * zz;
  return out;
};

var cubicHermiteInterpolate = (function() {
  var p = vec3.create();
  return function(out, p_k, m_k, p_kp1, m_kp1, t, index) {
    var tt = t * t;
  var three_minus_two_t = 3.0 - 2.0 * t;
  var h01 = tt * three_minus_two_t;
  var h00 = 1.0 - h01;
  var h10 = tt * (t - 2.0) + t;
  var h11 = tt * (t - 1.0);
  vec3.copy(p, p_k);
  vec3.scale(p, p, h00);
  vec3.scaleAndAdd(p, p, m_k, h10);
  vec3.scaleAndAdd(p, p, p_kp1, h01);
  vec3.scaleAndAdd(p, p, m_kp1, h11);
  out[index] = p[0];
  out[index + 1] = p[1];
  out[index + 2] = p[2];
};
})();

// returns the number of interpolation points for the given settings
function catmullRomSplineNumPoints(numPoints, subdiv, circular) {
  if (circular) {
    return numPoints * subdiv;
  } else {
    return subdiv * (numPoints - 1) + 1;
  }
}
// interpolates the given list of points (stored in a Float32Array) with a
// Cubic Hermite spline using the method of Catmull and Rom to calculate the
// tangents.
function catmullRomSpline(points, numPoints, num, strength, circular,
                          float32BufferPool) {
  circular = circular || false;
  strength = strength || 0.5;
  var out = null;
  var outLength = catmullRomSplineNumPoints(numPoints, num, circular) * 3;
  if (float32BufferPool) {
    out = float32BufferPool.request(outLength);
  } else {
    out = new Float32Array(outLength);
  }
  var index = 0;
  var delta_t = 1.0 / num;
  var m_k = vec3.create(), m_kp1 = vec3.create(); // tangents at k-1 and k+1
  var p_k = vec3.create(), p_kp1 = vec3.create(), p_kp2 = vec3.create(),
      p_kp3 = vec3.create();
  var i, j, e;

  vec3.set(p_kp1, points[0], points[1], points[2]);
  vec3.set(p_kp2, points[3], points[4], points[5]);
  if (circular) {
    vec3.set(p_k, points[points.length - 3], points[points.length - 2],
             points[points.length - 1]);
    vec3.sub(m_k, p_kp2, p_k);
    vec3.scale(m_k, m_k, strength);
  } else {
    vec3.set(p_k, points[0], points[1], points[2]);
    vec3.set(m_k, 0, 0, 0);
  }
  for (i = 1, e = numPoints - 1; i < e; ++i) {
    vec3.set(p_kp3, points[3 * (i + 1)], points[3 * (i + 1) + 1],
             points[3 * (i + 1) + 2]);
    vec3.sub(m_kp1, p_kp3, p_kp1);
    vec3.scale(m_kp1, m_kp1, strength);
    for (j = 0; j < num; ++j) {
      cubicHermiteInterpolate(out, p_kp1, m_k, p_kp2, m_kp1, delta_t * j,
                              index);
      index += 3;
    }
    vec3.copy(p_k, p_kp1);
    vec3.copy(p_kp1, p_kp2);
    vec3.copy(p_kp2, p_kp3);
    vec3.copy(m_k, m_kp1);
  }
  if (circular) {
    vec3.set(p_kp3, points[0], points[1], points[3]);
    vec3.sub(m_kp1, p_kp3, p_kp1);
    vec3.scale(m_kp1, m_kp1, strength);
  } else {
    vec3.set(m_kp1, 0, 0, 0);
  }
  for (j = 0; j < num; ++j) {
    cubicHermiteInterpolate(out, p_kp1, m_k, p_kp2, m_kp1, delta_t * j, index);
    index += 3;
  }
  if (!circular) {
    out[index] = points[3 * (numPoints - 1) + 0];
    out[index + 1] = points[3 * (numPoints - 1) + 1];
    out[index + 2] = points[3 * (numPoints - 1) + 2];
    return out;
  }
  vec3.copy(p_k, p_kp1);
  vec3.copy(p_kp1, p_kp2);
  vec3.copy(p_kp2, p_kp3);
  vec3.copy(m_k, m_kp1);
  vec3.set(p_kp3, points[3], points[4], points[5]);
  vec3.sub(m_kp1, p_kp3, p_kp1);
  vec3.scale(m_kp1, m_kp1, strength);
  for (j = 0; j < num; ++j) {
    cubicHermiteInterpolate(out, p_kp1, m_k, p_kp2, m_kp1, delta_t * j, index);
    index += 3;
  }
  return out;
}

function Sphere(center, radius) {
  this._center = center || vec3.create();
  this._radius = radius || 1.0;
}

Sphere.prototype.center = function() { return this._center; };
Sphere.prototype.radius = function() { return this._radius; };

return {
  signedAngle : signedAngle,
  axisRotation : axisRotation,
  ortho : ortho,
  catmullRomSpline : catmullRomSpline,
  cubicHermiteInterpolate : cubicHermiteInterpolate,
  catmullRomSplineNumPoints : catmullRomSplineNumPoints,
  Sphere : Sphere
};

})();

if(typeof(exports) !== 'undefined') {
  module.exports = geom;
}

// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

function BackboneTrace() { this._trace = []; }

if(typeof(exports) !== 'undefined') {
  exports.backboneTrace = BackboneTrace;
}

BackboneTrace.prototype.push = function(residue) {
  this._trace.push(residue);
};

BackboneTrace.prototype.length = function() {
  return this._trace.length;
};

BackboneTrace.prototype.residueAt = function(index) {
  return this._trace[index];
};

BackboneTrace.prototype.posAt = function(out, index) {
  vec3.copy(out, this._trace[index].centralAtom().pos());
  return out;
};

BackboneTrace.prototype.normalAt = function(out, index) {
  var residue = this._trace[index];
  if (residue.isAminoacid()) {
    vec3.sub(out, residue.atom('O').pos(), residue.atom('C').pos());
  }
  vec3.normalize(out, out);
  return out;
};

// nothing needs to be done for the backbone trace.
BackboneTrace.prototype.smoothPosAt = BackboneTrace.prototype.posAt;
BackboneTrace.prototype.smoothNormalAt = BackboneTrace.prototype.normalAt;

BackboneTrace.prototype.centralAtomAt = function(index) {
  return this._trace[index].centralAtom();
};

BackboneTrace.prototype.tangentAt = (function() {
  var posBefore = vec3.create();
  var posAfter = vec3.create();
  return function(out, index) {
    if (index > 0) { this.posAt(posBefore, index - 1);
    } else {
  this.posAt(posBefore, index);
    }
    if (index < this._trace.length-1) {
  this.posAt(posAfter, index + 1);
    } else {
  this.posAt(posAfter, index);
    }
    vec3.sub(out, posAfter, posBefore);
}
;
})();

BackboneTrace.prototype.fullTraceIndex = function(index) {
  return index;
};

BackboneTrace.prototype.subsets = function(residues) {
  // we assume that the residue list is ordered from N- to C-
  // terminus and we can traverse it in one go.
  var fullTraceIdx = 0, listIdx = 0;
  var subsets = [];
  while (listIdx < residues.length && fullTraceIdx < this._trace.length) {
    // increase pointer until we residue indices match.
    var residueIndex = residues[listIdx].full().index();
    while (this._trace.length > fullTraceIdx &&
           this._trace[fullTraceIdx].index() < residueIndex) {
      ++fullTraceIdx;
    }
    if (fullTraceIdx >= this._trace.length) {
      break;
    }
    var traceIndex = this._trace[fullTraceIdx].index();
    while (residues.length > listIdx &&
           residues[listIdx].full().index() < traceIndex) {
      ++listIdx;
    }
    if (listIdx >= residues.length) {
      break;
    }
    var fullTraceBegin = fullTraceIdx;
    var residueListBegin = listIdx;
    while (residues.length > listIdx && this._trace.length > fullTraceIdx &&
           residues[listIdx].full().index() ===
               this._trace[fullTraceIdx].index()) {
      ++listIdx;
      ++fullTraceIdx;
    }
    var residueListEnd = listIdx;
    var fullTraceEnd = fullTraceIdx;
    subsets.push(
        new TraceSubset(this, fullTraceBegin, fullTraceEnd,
                        residues.slice(residueListBegin, residueListEnd)));
  }
  return subsets;
};

// a trace subset, e.g. the part of a trace contained in a view. End regions
// are handled automatically depending on whether the beginning/end of the
// trace subset coincides with the C- and N-terminus of the full trace.
function TraceSubset(fullTrace, fullTraceBegin, fullTraceEnd, trace) {
  this._fullTrace = fullTrace;
  this._fullTraceBegin = fullTraceBegin;
  this._fullTraceEnd = fullTraceEnd;
  this._trace = trace;
  this._isNTerminal = this._fullTraceBegin === 0;
  this._isCTerminal = this._fullTrace.length() === this._fullTraceEnd;
  var length = this._fullTraceEnd - this._fullTraceBegin;
  if (!this._isCTerminal) {
    ++length;
  }
  if (!this._isNTerminal) {
    ++length;
    this._fullTraceBegin -= 1;
  }
  this._length = length;
}

TraceSubset.prototype.length = function() {
  return this._length;
};

TraceSubset.prototype.residueAt = function(index) {
  return this._fullTrace.residueAt(this._fullTraceBegin + index);
};

TraceSubset.prototype._interpolate = (function() {
  var posOne = vec3.create();
  var tangentOne = vec3.create();
  var tangentTwo = vec3.create();
  return function(out, indexOne, indexTwo, strength) {
    this.tangentAt(tangentOne, indexOne);
  this.tangentAt(tangentTwo, indexTwo);
  vec3.scale(tangentOne, tangentOne, strength);
  vec3.scale(tangentTwo, tangentTwo, strength);
  geom.cubicHermiteInterpolate(out, this.centralAtomAt(indexOne).pos(),
                               tangentOne, this.centralAtomAt(indexTwo).pos(),
                               tangentTwo, 0.5, 0);
  return out;
  };
})();

// like posAt, but interpolates the position for the ends with a Catmull-Rom
// spline.
TraceSubset.prototype.smoothPosAt = (function() {
  var posOne = vec3.create();
  var tangentOne = vec3.create();
  var tangentTwo = vec3.create();
  return function(out, index, strength) {
    if (index === 0 && !this._isNTerminal) {
          return this._interpolate(out, index, index + 1, strength);
    }
    if (index === this._length-1 && !this._isCTerminal) {
  return this._interpolate(out, index - 1, index, strength);
    }
    var atom = this.centralAtomAt(index);
    vec3.copy(out, atom.pos()); 
    return out;
}
;
})();


TraceSubset.prototype.smoothNormalAt = (function() {
  return function(out, index, strength) {
    this._fullTrace.normalAt(out, index + this._fullTraceBegin);
  return out;
  };
})();

TraceSubset.prototype.posAt = function(out, index) {
  var atom = this.centralAtomAt(index);
  var atom2 = null;
  vec3.copy(out, atom.pos());
  if (index === 0 && !this._isNTerminal) {
    atom2 = this.centralAtomAt(index + 1);
    vec3.add(out, out, atom2.pos());
    vec3.scale(out, out, 0.5);
  }
  if (index === this._length - 1 && !this._isCTerminal) {
    atom2 = this.centralAtomAt(index - 1);
    vec3.add(out, out, atom2.pos());
    vec3.scale(out, out, 0.5);
  }
  return out;
};

TraceSubset.prototype.centralAtomAt = function(index) {
  return this.residueAt(index).centralAtom();
};

TraceSubset.prototype.fullTraceIndex = function(index) {
  return this._fullTraceBegin + index;
};
TraceSubset.prototype.tangentAt = function(out, index) {
  return this._fullTrace.tangentAt(out, index + this._fullTraceBegin);
};


// Copyright (c) 2013-2014 Marco Biasini
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to 
// deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.

(function(exports) {
"use strict";

// a list of rotation/translation operators to be applied to certain chains,
// typically of the asymmetric unit.
function SymGenerator(chains, matrices) {
  this._chains = chains || [];
  this._matrices = matrices || [];
}

SymGenerator.prototype.addChain = function(name) {
  this._chains.push(name);
};

SymGenerator.prototype.chains = function() { return this._chains; };

SymGenerator.prototype.addMatrix = function(matrix) {
  this._matrices.push(matrix);
};

SymGenerator.prototype.matrices = function() { return this._matrices; };
SymGenerator.prototype.matrix = function(index) { return this._matrices[index]; };

// contains the definition for how to construct a biological assembly from
// an asymmetric unit. Essentially a list of rotation/translation operators
// to be applied to chains of the asymmetric unit.
function Assembly(name) {
  this._name = name;
  this._generators = [];
}

Assembly.prototype.name = function() { return this._name; };

Assembly.prototype.generators = function() { return this._generators; };
Assembly.prototype.generator = function(index) { return this._generators[index]; };
Assembly.prototype.addGenerator = function(gen) { 
  this._generators.push(gen); 
};

exports.SymGenerator = SymGenerator;
exports.Assembly = Assembly;

return true;
})(this);



// Copyright (c) 2013-2014 Marco Biasini
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to 
// deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.

(function(exports) {
"use strict";

// atom covalent radii by element derived from Cambrige Structural Database. 
// Source: http://profmokeur.ca/chemistry/covalent_radii.htm
var ELEMENT_COVALENT_RADII = {
 H : 0.31, HE : 0.28, LI : 1.28, BE : 0.96,  B : 0.84,  C : 0.76,  N : 0.71, 
 O : 0.66,  F : 0.57, NE : 0.58, NA : 1.66, MG : 1.41, AL : 1.21, SI : 1.11, 
 P : 1.07,  S : 1.05, CL : 1.02, AR : 1.06,  K : 2.03, CA : 1.76, SC : 1.70, 
TI : 1.60,  V : 1.53, CR : 1.39, MN : 1.39, FE : 1.32, CO : 1.26, NI : 1.24, 
CU : 1.32, ZN : 1.22, GA : 1.22, GE : 1.20, AS : 1.19, SE : 1.20, BR : 1.20, 
KR : 1.16, RB : 2.20, SR : 1.95,  Y : 1.90, ZR : 1.75, NB : 1.64, MO : 1.54, 
TC : 1.47, RU : 1.46, RH : 1.42, PD : 1.39, AG : 1.45, CD : 1.44, IN : 1.42, 
SN : 1.39, SB : 1.39, TE : 1.38,  I : 1.39, XE : 1.40, CS : 2.44, BA : 2.15, 
LA : 2.07, CE : 2.04, PR : 2.03, ND : 2.01, PM : 1.99, SM : 1.98, EU : 1.98, 
GD : 1.96, TB : 1.94, DY : 1.92, HO : 1.92, ER : 1.89, TM : 1.90, YB : 1.87, 
LU : 1.87, HF : 1.75, TA : 1.70,  W : 1.62, RE : 1.51, OS : 1.44, IR : 1.41, 
PT : 1.36, AU : 1.36, HG : 1.32, TL : 1.45, PB : 1.46, BI : 1.48, PO : 1.40, 
AT : 1.50, RN : 1.50, FR : 2.60, RA : 2.21, AC : 2.15, TH : 2.06, PA : 2.00, 
 U : 1.96, NP : 1.90, PU : 1.87, AM : 1.80, CM : 1.69
};

function covalentRadius(ele) {
  var r = ELEMENT_COVALENT_RADII[ele.toUpperCase()];
  if (r !== undefined) {
    return r;
  }
  return 1.5;
}

// combines the numeric part of the residue number with the insertion
// code and returns a single number. Note that this is completely safe
// and we do not have to worry about overflows, as for PDB files the 
// range of permitted residue numbers is quite limited anyway.
function rnumInsCodeHash(num, insCode) {
  return num << 8 | insCode.charCodeAt(0);
}

//-----------------------------------------------------------------------------
// MolBase, ChainBase, ResidueBase, AtomBase
//-----------------------------------------------------------------------------

function MolBase() {
}

MolBase.prototype.eachResidue = function(callback) {
  for (var i = 0; i < this._chains.length; i+=1) {
    if (this._chains[i].eachResidue(callback) === false) {
      return false;
    }
  }
};

MolBase.prototype.eachAtom = function(callback, index) {
  index |= 0;
  for (var i = 0; i < this._chains.length; i+=1) {
    index = this._chains[i].eachAtom(callback, index);
    if (index === false) {
      return false;
    }
  }
};

MolBase.prototype.residueCount = function () {
  var chains = this.chains();
  var count = 0;
  for (var ci = 0; ci < chains.length; ++ci) {
    count += chains[ci].residues().length;
  }
  return count;
};

MolBase.prototype.eachChain = function(callback) {
  var chains = this.chains();
  for (var i = 0; i < chains.length; ++i) {
    if (callback(chains[i]) === false) {
      return;
    }
  }
};

MolBase.prototype.atomCount = function() {
  var chains = this.chains();
  var count = 0;
  for (var ci = 0; ci < chains.length; ++ci) {
    count += chains[ci].atomCount();
  }
  return count;
};

MolBase.prototype.atoms = function() {
  var atoms = [];
  this.eachAtom(function(atom) { atoms.push(atom); });
  return atoms;
};

MolBase.prototype.atom = function(name) {
  var parts = name.split('.');
  var chain = this.chain(parts[0]);
  if (chain === null) {
    return null;
  }
  var residue = chain.residueByRnum(parseInt(parts[1], 10));
  if (residue === null) {
    return null;
  }
  return residue.atom(parts[2]);
};

MolBase.prototype.center = function() {
  var sum = vec3.create();
  var count = 0;
  this.eachAtom(function(atom) {
    vec3.add(sum, sum, atom.pos());
    count+=1;
  });
  if (count) {
    vec3.scale(sum, sum, 1/count);
  }
  return sum;
};

// returns a sphere containing all atoms part of this structure. This will not 
// calculate the minimal bounding sphere, just a good-enough approximation.
MolBase.prototype.boundingSphere = function() {
  var center = this.center();
  var radiusSquare = 0.0;
  this.eachAtom(function(atom) {
    radiusSquare = Math.max(radiusSquare, vec3.sqrDist(center, atom.pos()));
  });
  return new Sphere(center, radiusSquare);
};

// returns all backbone traces of all chains of this structure
MolBase.prototype.backboneTraces = function() {
  var chains = this.chains();
  var traces = [];
  for (var i = 0; i < chains.length; ++i) {
    Array.prototype.push.apply(traces, chains[i].backboneTraces());
  }
  return traces;
};


MolBase.prototype.select = function(what) {

  if (what === 'protein') {
    return this.residueSelect(function(r) { return r.isAminoacid(); });
  }
  if (what === 'water') {
    return this.residueSelect(function(r) { return r.isWater(); });
  }
  if (what === 'ligand') {
    return this.residueSelect(function(r) { 
      return !r.isAminoacid() && !r.isWater();
    });
  }
  // when what is not one of the simple strings above, we assume what
  // is a dictionary containing predicates which have to be fulfilled.
  return this._dictSelect(what);
};

MolBase.prototype.selectWithin = (function() {
  var dist = vec3.create();
  return function(mol, options) {
    console.time('Mol.selectWithin');
    options = options || {};
    var radius = options.radius || 4.0;
    var radiusSqr = radius*radius;
    var matchResidues = !!options.matchResidues;
    var targetAtoms = [];
    mol.eachAtom(function(a) { targetAtoms.push(a); });

    var view = new MolView(this.full());
    var addedRes = null, addedChain = null;
    var chains = this.chains();
    var skipResidue = false;
    for (var ci = 0; ci < chains.length; ++ci) {
      var residues = chains[ci].residues();
      addedChain = null;
      for (var ri = 0; ri < residues.length; ++ri) {
        addedRes = null;
        skipResidue = false;
        var atoms = residues[ri].atoms();
        for (var ai = 0; ai < atoms.length; ++ai) {
          if (skipResidue) {
            break;
          }
          for (var wi = 0; wi < targetAtoms.length; ++wi) {
            vec3.sub(dist, atoms[ai].pos(), targetAtoms[wi].pos());
            if (vec3.sqrLen(dist) > radiusSqr) {
              continue;
            }
            if (!addedChain) {
              addedChain = view.addChain(chains[ci].full(), false);
            }
            if (!addedRes) {
              addedRes =
                  addedChain.addResidue(residues[ri].full(), matchResidues);
            }
            if (matchResidues) {
              skipResidue = true;
              break;
            } 
            addedRes.addAtom(atoms[ai].full());
          }
        }
      }
    }
    console.timeEnd('Mol.selectWithin');
    return view;
  };
})();

MolBase.prototype.residueSelect = function(predicate) {
  console.time('Mol.residueSelect');
  var view = new MolView(this.full());
  for (var ci = 0; ci < this._chains.length; ++ci) {
    var chain = this._chains[ci];
    var chainView = null;
    var residues = chain.residues();
    for (var ri = 0; ri < residues.length; ++ri) {
      if (predicate(residues[ri])) {
        if (!chainView) {
          chainView = view.addChain(chain, false);
        }
        chainView.addResidue(residues[ri], true);
      }
    }
  }
  console.timeEnd('Mol.residueSelect');
  return view;
};

MolBase.prototype._atomPredicates = function(dict) {

  var predicates = [];
  if (dict.aname !== undefined) {
    predicates.push(function(a) { return a.name() === dict.aname; });
  }
  if (dict.anames !== undefined) {
    predicates.push(function(a) { 
      var n = a.name();
      for (var k = 0; k < dict.anames.length; ++k) {
        if (n === dict.anames[k]) {
          return true;
        }
      }
      return false;
    });
  }
  return predicates;
};

// extracts the residue predicates from the dictionary. 
// ignores rindices, rindexRange because they are handled separately.
MolBase.prototype._residuePredicates = function(dict) {

  var predicates = [];
  if (dict.rname !== undefined) {
    predicates.push(function(r) { return r.name() === dict.rname; });
  }
  if (dict.rnames !== undefined) {
    predicates.push(function(r) { 
      var n = r.name();
      for (var k = 0; k < dict.rnames.length; ++k) {
        if (n === dict.rnames[k]) {
          return true;
        }
      }
      return false;
    });
  }
  if (dict.rnums !== undefined) {
    var num_set = {};
    for (var i = 0; i < dict.rnums.length; ++i) {
      num_set[dict.rnums[i]] = true;
    }
    predicates.push(function(r) {
      var n = r.num();
      return num_set[n] === true;
    });
  }
  return predicates;
};

MolBase.prototype._chainPredicates = function(dict) {
  var predicates = [];
  if (dict.cname !== undefined) {
    dict.chain = dict.cname;
  }
  if (dict.cnames !== undefined) {
    dict.chains = dict.cnames;
  }
  if (dict.chain !== undefined) {
    predicates.push(function(c) { return c.name() === dict.chain; });
  }
  if (dict.chains !== undefined) {
    predicates.push(function(c) { 
      var n = c.name();
      for (var k = 0; k < dict.chains.length; ++k) {
        if (n === dict.chains[k]) {
          return true;
        }
      }
      return false;
    });
  }
  return predicates;
};

function fulfillsPredicates(obj, predicates) {
  for (var i = 0; i < predicates.length; ++i) {
    if (!predicates[i](obj)) {
      return false;
    }
  }
  return true;
}

MolBase.prototype._dictSelect = function(dict) {
  var view = new MolView(this);
  var residuePredicates = this._residuePredicates(dict);
  var atomPredicates = this._atomPredicates(dict);
  var chainPredicates = this._chainPredicates(dict);

  for (var ci = 0; ci < this._chains.length; ++ci) {
    var chain = this._chains[ci];
    if (!fulfillsPredicates(chain, chainPredicates)) {
      continue;
    }
    var chainView = null;
    var residues = chain.residues();
    if (dict.rindex) {
      dict.rindices = [dict.rindex];
    }
    if (dict.rnumRange) {
      residues =
          chain.residuesInRnumRange(dict.rnumRange[0], dict.rnumRange[1]);
    }
    var selResidues = [], i, e;
    if (dict.rindexRange !== undefined) {
      for (i = dict.rindexRange[0],
          e = Math.min(residues.length, dict.rindexRange[1]);
           i < e; ++i) {
        selResidues.push(residues[i]);
      }
      residues = selResidues;
    } else if (dict.rindices) {
      if (dict.rindices.length !== undefined) {
        selResidues = [];
        for (i = 0; i < dict.rindices.length; ++i) {
          selResidues.push(residues[dict.rindices[i]]);
        }
        residues = selResidues;
      }
    }
    for (var ri = 0; ri < residues.length; ++ri) {
      if (!fulfillsPredicates(residues[ri], residuePredicates)) {
        continue;
      }
      if (!chainView) {
        chainView = view.addChain(chain, false);
      }
      var residueView = null;
      var atoms = residues[ri].atoms();
      for (var ai = 0; ai < atoms.length; ++ai) {
        if (!fulfillsPredicates(atoms[ai], atomPredicates)) {
          continue;
        }
        if (!residueView) {
          residueView = chainView.addResidue(residues[ri], false);
        }
        residueView.addAtom(atoms[ai]);
      }
    }
  }
  return view;
};

function rnumComp(lhs, rhs) {
  return lhs.num() < rhs.num();
}

function numify(val) {
  return { num : function() { return val; }};
}



MolBase.prototype.assembly = function(id) {
  var assemblies = this.assemblies();
  for (var i = 0; i < assemblies.length; ++i) {
    if (assemblies[i].name() === id) {
      return assemblies[i];
    }
  }
  return null;
};

MolBase.prototype.chainsByName = function(chainNames) {
  // build a map to avoid O(n^2) behavior. That's overkill when the list 
  // of names is short but should give better performance when requesting
  // multiple chains.
  var chainMap = { };
  var chains = this.chains();
  for (var i = 0; i < chains.length; ++i) {
    chainMap[chains[i].name()] = chains[i];
  }
  var filteredChains = [];
  for (var j = 0; j < chainNames.length; ++j) {
    var filteredChain = chainMap[chainNames[j]];
    if (filteredChain !== undefined) {
      filteredChains.push(filteredChain);
    }
  }
  return filteredChains;
};


function ChainBase() {

}

ChainBase.prototype.eachAtom = function(callback, index) {
  index |= 0;
  for (var i = 0; i< this._residues.length; i+=1) {
    index = this._residues[i].eachAtom(callback, index);
    if (index === false) {
      return false;
    }
  }
  return index;
};


ChainBase.prototype.atomCount = function() {
  var count = 0;
  var residues = this.residues();
  for (var ri = 0; ri < residues.length; ++ri) {
    count+= residues[ri].atoms().length;
  }
  return count;
};

ChainBase.prototype.eachResidue = function(callback) {
  for (var i = 0; i < this._residues.length; i+=1) {
    if (callback(this._residues[i]) === false) {
      return false;
    }
  }
};



ChainBase.prototype.residues = function() { return this._residues; };

ChainBase.prototype.structure = function() { return this._structure; };


ChainBase.prototype.asView = function() {
  var view = new MolView(this.structure().full());
  view.addChain(this, true);
  return view;

};

ChainBase.prototype.residueByRnum = function(rnum) {
  var residues = this.residues();
  if (this._rnumsOrdered) {
    var index = binarySearch(residues, numify(rnum), rnumComp);
    if (index === -1) {
      return null;
    }
    return residues[index];
  } else {
    for (var i = 0; i < residues.length; ++i) {
      if (residues[i].num() === rnum) {
        return residues[i];
      }
    }
    return null;
  }
};


ChainBase.prototype.prop = function(propName) { 
  return this[propName]();
};

function ResidueBase() {

}

ResidueBase.prototype.prop = function(propName) { 
  return this[propName]();
};

ResidueBase.prototype.isWater = function() {
  return this.name() === 'HOH' || this.name() === 'DOD';
};

ResidueBase.prototype.eachAtom = function(callback, index) {
  index |= 0;
  for (var i =0; i< this._atoms.length; i+=1) {
    if (callback(this._atoms[i], index) === false) {
      return false;
    }
    index +=1;
  }
  return index;
};

ResidueBase.prototype.qualifiedName = function() {
  return this.chain().name()+'.'+this.name()+this.num();
};

ResidueBase.prototype.atom = function(index_or_name) { 
  if (typeof index_or_name === 'string') {
    for (var i =0; i < this._atoms.length; ++i) {
      if (this._atoms[i].name() === index_or_name) {
        return this._atoms[i];
      }
    }
    return null;
  }
  if (index_or_name >= this._atoms.length && index_or_name < 0) {
    return null;
  }
  return this._atoms[index_or_name]; 
};

// CA for amino acids, P for nucleotides, nucleosides
ResidueBase.prototype.centralAtom = function() {
  if (this.isAminoacid()) {
    return this.atom('CA');
  }
  if (this.isNucleotide()) {
    return this.atom('C3\'');
  }
  return null;
};


ResidueBase.prototype.center = function() {
  var count = 0;
  var c = vec3.create();
  this.eachAtom(function(atom) {
    vec3.add(c, c, atom.pos());
    count += 1;
  });
  if (count > 0) {
    vec3.scale(c, c, 1.0/count);
  }
  return c;
};

ResidueBase.prototype.isAminoacid = function() { 
  return this._isAminoacid;
};

ResidueBase.prototype.isNucleotide = function() { 
  return this._isNucleotide;
};


function AtomBase() {
}

AtomBase.prototype.name = function() { return this._name; };
AtomBase.prototype.pos = function() { return this._pos; };
AtomBase.prototype.element = function() { return this._element; };
AtomBase.prototype.index = function() { return this._index; };

AtomBase.prototype.prop = function(propName) { 
  return this[propName]();
};

AtomBase.prototype.bondCount = function() { return this.bonds().length; };
AtomBase.prototype.eachBond = function(callback) {
  var bonds = this.bonds();
  for (var i = 0, e = bonds.length; i < e; ++i) {
    callback(bonds[i]);
  }
};

//-----------------------------------------------------------------------------
// Mol, Chain, Residue, Atom, Bond
//-----------------------------------------------------------------------------

function Mol(pv) {
  MolBase.prototype.constructor.call(this);
  this._chains = [];
  this._assemblies = [];
  this._pv = pv;
  this._nextAtomIndex = 0;
}

derive(Mol, MolBase);



Mol.prototype.addAssembly = function(assembly) { 
  this._assemblies.push(assembly); 
};

Mol.prototype.setAssemblies = function(assemblies) { 
  this._assemblies = assemblies; 
};

Mol.prototype.assemblies = function() { return this._assemblies; };

Mol.prototype.chains = function() { return this._chains; };

Mol.prototype.full = function() { return this; };

Mol.prototype.containsResidue = function(residue) {
  return residue.full().structure() === this;
};

Mol.prototype.chainByName = function(name) { 
  for (var i = 0; i < this._chains.length; ++i) {
    if (this._chains[i].name() === name) {
      return this._chains[i];
    }
  }
  return null;
};

// for backwards compatibility
Mol.prototype.chain = Mol.prototype.chainByName;

Mol.prototype.nextAtomIndex = function() {
  var nextIndex = this._nextAtomIndex; 
  this._nextAtomIndex+=1; 
  return nextIndex; 
};

Mol.prototype.addChain = function(name) {
  var chain = new Chain(this, name);
  this._chains.push(chain);
  return chain;
};


Mol.prototype.connect = function(atom_a, atom_b) {
  var bond = new Bond(atom_a, atom_b);
  atom_a.addBond(bond);
  atom_b.addBond(bond);
  return bond;
};


function connectPeptides(structure, left, right) {
  var cAtom = left.atom('C');
  var nAtom = right.atom('N');
  if (cAtom && nAtom) {
    var sqrDist = vec3.sqrDist(cAtom.pos(), nAtom.pos());
    if (sqrDist < 1.6*1.6) {
      structure.connect(nAtom, cAtom);
    }
  } 
}

function connectNucleotides(structure, left, right) {
  var o3Prime = left.atom('O3\'');
  var pAtom = right.atom('P');
  if (o3Prime && pAtom) {
    var sqrDist = vec3.sqrDist(o3Prime.pos(), pAtom.pos());
    // FIXME: make sure 1.7 is a good threshold here...
    if (sqrDist < 1.7*1.7) {
      structure.connect(o3Prime, pAtom);
    }
  }
}

// determine connectivity structure. for simplicity only connects atoms of the 
// same residue and peptide bonds
Mol.prototype.deriveConnectivity = function() {
  console.time('Mol.deriveConnectivity');
  var this_structure = this;
  var prevResidue = null;
  this.eachResidue(function(res) {
    var sqr_dist;
    var d = vec3.create();
    for (var i = 0; i < res.atoms().length; i+=1) {
      var atomI = res.atom(i);
      var covalentI = covalentRadius(atomI.element());
      for (var j = 0; j < i; j+=1) {
        var atomJ = res.atom(j);
        var covalentJ = covalentRadius(atomJ.element());
        sqr_dist = vec3.sqrDist(atomI.pos(), atomJ.pos());
        var lower = covalentI+covalentJ-0.30;
        var upper = covalentI+covalentJ+0.30;
        if (sqr_dist < upper*upper && sqr_dist > lower*lower) {
          this_structure.connect(res.atom(i), res.atom(j));
        }
      }
    }
    res._deduceType();
    if (prevResidue !== null) {
      if (res.isAminoacid() && prevResidue.isAminoacid()) {
        connectPeptides(this_structure, prevResidue, res);
      }
      if (res.isNucleotide() && prevResidue.isNucleotide()) {
        connectNucleotides(this_structure, prevResidue, res);
      }
    }
    prevResidue = res;
  });
  console.timeEnd('Mol.deriveConnectivity');
};

function Chain(structure, name) {
  ChainBase.prototype.constructor.call(this);
  this._structure = structure;
  this._name = name;
  this._cachedTraces = [];
  this._residues = [];
  this._rnumsOrdered = true;
}

derive(Chain, ChainBase);

Chain.prototype.name = function() { return this._name; };

Chain.prototype.full = function() { return this; };

Chain.prototype.addResidue = function(name, num, insCode) {
  insCode = insCode || '\0';
  var residue = new Residue(this, name, num, insCode);
  if (this._residues.length > 0 && this._rnumsOrdered) {
    var combinedRNum = rnumInsCodeHash(num, insCode);
    var last = this._residues[this._residues.length-1];
    var lastCombinedRNum = rnumInsCodeHash(last.num(),last.insCode());
    this._rnumsOrdered = lastCombinedRNum < combinedRNum;
  }
  this._residues.push(residue);
  return residue;
};


Chain.prototype.residuesInRnumRange = function(start, end) {
  // FIXME: this currently only works with the numeric part, insertion
  // codes are not honoured.
  var matching = [];
  var i, e;
  if (this._rnumsOrdered === true) {
    // binary search our way to heaven
    var startIdx = indexFirstLargerEqualThan(this._residues, numify(start), 
                                             rnumComp);
    if (startIdx === -1) {
      return matching;
    }
    var endIdx = indexLastSmallerEqualThan(this._residues, numify(end), 
                                           rnumComp);
    if (endIdx === -1) {
      return matching;
    }
    for (i = startIdx; i <= endIdx; ++i) {
      matching.push(this._residues[i]);
    }
  } else {
    for (i = 0, e = this._residues.length; i !== e; ++i) {
      var res = this._residues[i];
      if (res.num() >= start && res.num() <= end) {
        matching.push(res);
      }
    }
  }
  return matching;
};

// assigns secondary structure to residues in range from_num to to_num.
Chain.prototype.assignSS = function(fromNumAndIns, toNumAndIns, ss) {
  // FIXME: when the chain numbers are completely ordered, perform binary 
  // search to identify range of residues to assign secondary structure to.
  var from = rnumInsCodeHash(fromNumAndIns[0], fromNumAndIns[1]);
  var to = rnumInsCodeHash(toNumAndIns[0], toNumAndIns[1]);
  for (var i = 1; i < this._residues.length-1; ++i) {
    var res = this._residues[i];
    // FIXME: we currently don't set the secondary structure of the first and 
    // last residue of helices and sheets. that takes care of better 
    // transitions between coils and helices. ideally, this should be done
    // in the cartoon renderer, NOT in this function.
    var combined = rnumInsCodeHash(res.num(), res.insCode());
    if (combined <=  from || combined >= to) {
      continue;
    }
    res.setSS(ss);
  }
};

// invokes a callback for each connected stretch of amino acids. these 
// stretches are used for all trace-based rendering styles, e.g. sline, 
// line_trace, tube, cartoon etc. 
Chain.prototype.eachBackboneTrace = function(callback) {
  this._cacheBackboneTraces();
  for (var i=0; i < this._cachedTraces.length; ++i) {
    callback(this._cachedTraces[i]);
  }
};

Chain.prototype._cacheBackboneTraces = function() {
  if (this._cachedTraces.length > 0) {
    return;
  }
  var stretch = new BackboneTrace();
  // true when the stretch consists of amino acid residues, false
  // if the stretch consists of nucleotides. 
  var aaStretch = null;
  for (var i = 0; i < this._residues.length; i+=1) {
    var residue = this._residues[i];
    var isAminoacid = residue.isAminoacid();
    var isNucleotide = residue.isNucleotide();
    if ((aaStretch  === true && !isAminoacid) ||
        (aaStretch === false && !isNucleotide) ||
        (aaStretch === null && !isNucleotide && !isAminoacid)) {
      // a break in the trace: push stretch if there were enough residues
      // in it and create new backbone trace.
      if (stretch.length() > 1) {
        this._cachedTraces.push(stretch);
      }
      aaStretch = null;
      stretch = new BackboneTrace();
      continue;
    }
    if (stretch.length() === 0) {
      stretch.push(residue);
      aaStretch = residue.isAminoacid();
      continue;
    }
    // these checks are on purpose more relaxed than the checks we use in 
    // deriveConnectivity(). We don't really care about correctness of bond 
    // lengths here. The only thing that matters is that the residues are 
    // more or less close so that they could potentially/ be connected.
    var prevAtom, thisAtom;
    if (aaStretch) {
      prevAtom = this._residues[i-1].atom('C');
      thisAtom = residue.atom('N');
    } else {
      prevAtom = this._residues[i-1].atom('O3\'');
      thisAtom = residue.atom('P');
    }
    var sqrDist = vec3.sqrDist(prevAtom.pos(), thisAtom.pos());
    if (Math.abs(sqrDist - 1.5*1.5) < 1) {
      stretch.push(residue);
    } else {
      if (stretch.length() > 1) {
        this._cachedTraces.push(stretch);
        stretch = new BackboneTrace();
      }
    }
  }
  if (stretch.length() > 1) {
    this._cachedTraces.push(stretch);
  }
};


// returns all connected stretches of amino acids found in this chain as 
// a list.
Chain.prototype.backboneTraces = function() {
  var traces = [];
  this.eachBackboneTrace(function(trace) { traces.push(trace); });
  return traces;

};

function Residue(chain, name, num, insCode) {
  ResidueBase.prototype.constructor.call(this);
  this._name = name;
  this._num = num;
  this._insCode = insCode;
  this._atoms = [];
  this._ss = 'C';
  this._chain = chain;
  this._isAminoacid = false;
  this._isNucleotide = false;
  this._index = chain.residues().length;
}

derive(Residue, ResidueBase);

Residue.prototype._deduceType = function() {
  this._isNucleotide = this.atom('P')!== null && this.atom('C3\'') !== null;
  this._isAminoacid = this.atom('N') !== null && this.atom('CA') !== null && 
                      this.atom('C') !== null && this.atom('O') !== null;
};

Residue.prototype.name = function() { return this._name; };
Residue.prototype.insCode = function() { return this._insCode; };

Residue.prototype.num = function() { return this._num; };

Residue.prototype.full = function() { return this; };

Residue.prototype.addAtom = function(name, pos, element) {
  var atom = new Atom(this, name, pos, element, this.structure().nextAtomIndex());
  this._atoms.push(atom);
  return atom;
};

Residue.prototype.ss = function() { return this._ss; };
Residue.prototype.setSS = function(ss) { this._ss = ss; };
Residue.prototype.index = function() { return this._index; };

Residue.prototype.atoms = function() { return this._atoms; };
Residue.prototype.chain = function() { return this._chain; };


Residue.prototype.structure = function() { 
  return this._chain.structure(); 
};

function Atom(residue, name, pos, element, index) {
  AtomBase.prototype.constructor.call(this);
  this._residue = residue;
  this._bonds = [];
  this._name = name;
  this._pos = pos;
  this._index = index;
  this._element = element;
}

derive(Atom, AtomBase);

Atom.prototype.addBond = function(bond) { this._bonds.push(bond); };
Atom.prototype.name = function() { return this._name; };
Atom.prototype.bonds = function() { return this._bonds; };
Atom.prototype.residue = function() { return this._residue; };
Atom.prototype.structure = function() { return this._residue.structure(); };
Atom.prototype.full = function() { return this; };
Atom.prototype.qualifiedName = function() {
  return this.residue().qualifiedName()+'.'+this.name();
};

var Bond = function(atom_a, atom_b) {
  var self = {
    atom_one : atom_a,
    atom_two : atom_b
  };
  return {
    atom_one : function() { return self.atom_one; },
    atom_two : function() { return self.atom_two; },

    // calculates the mid-point between the two atom positions
    mid_point : function(out) { 
      if (!out) {
        out = vec3.create();
      }
      vec3.add(out, self.atom_one.pos(), self.atom_two.pos());
      vec3.scale(out, out, 0.5);
      return out;
    }
  };
};

//-----------------------------------------------------------------------------
// MolView, ChainView, ResidueView, AtomView
//-----------------------------------------------------------------------------

function MolView(mol) {
  MolBase.prototype.constructor.call(this);
  this._mol = mol; 
  this._chains = [];
}

derive(MolView, MolBase);

MolView.prototype.full = function() { return this._mol; };

MolView.prototype.assemblies = function() { return this._mol.assemblies(); };

// add chain to view
MolView.prototype.addChain = function(chain, recurse) {
  var chainView = new ChainView(this, chain.full());
  this._chains.push(chainView);
  if (recurse) {
    var residues = chain.residues();
    for (var i = 0; i< residues.length; ++i) {
      chainView.addResidue(residues[i], true);
    }
  }
  return chainView;
};


MolView.prototype.containsResidue = function(residue) {
  if (!residue) {
    return false;
  }
  var chain = this.chain(residue.chain().name());
  if (!chain) {
    return false;
  }
  return chain.containsResidue(residue);
};

MolView.prototype.addResidues = function (residues, recurse) {
  var that = this;
  var chainsViews = {};
  residues.forEach(function  (residue) {
    var chainName = residue.chain().name();
    if (typeof chainsViews[chainName] === 'undefined') {
      chainsViews[chainName] = that.addChain(residue.chain(), false); 
    }
    chainsViews[chainName].addResidue(residue, recurse);
  });
  return chainsViews;
};

MolView.prototype.chains = function() { return this._chains; };


MolView.prototype.chain = function(name) {
  for (var i = 0; i < this._chains.length; ++i) {
    if (this._chains[i].name() === name) {
      return this._chains[i];
    }
  }
  return null;
};

function ChainView(molView, chain) {
  ChainBase.prototype.constructor.call(this);
  this._chain = chain;
  this._residues = [];
  this._molView = molView;
  this._residueMap = {};
}


derive(ChainView, ChainBase);

ChainView.prototype.addResidue = function(residue, recurse) {
  var resView = new ResidueView(this, residue.full());
  this._residues.push(resView);
  this._residueMap[residue.full().index()] = resView;
  if (recurse) {
    var atoms = residue.atoms();
    for (var i = 0; i < atoms.length; ++i) {
      resView.addAtom(atoms[i].full());
    }
  }
  return resView;
};

ChainView.prototype.addResidues = function (residues, recurse) {
  var that = this;
  residues.forEach(function (residue) {
    that.addResidue(residue, recurse);
  });
};

ChainView.prototype.containsResidue = function(residue) {
  var resView = this._residueMap[residue.full().index()];
  if (resView === undefined) {
    return false;
  }
  return resView.full() === residue.full();
};


ChainView.prototype.eachBackboneTrace = function(callback) {
  // backbone traces for the view must be based on the the full 
  // traces for the following reasons:
  //  - we must be able to display subsets with one residue in length,
  //    when they are part of a larger trace. 
  //  - when a trace residue is not at the end, e.g. the C-terminal or
  //    N-terminal end of the full trace, the trace residue starts
  //    midway between the residue and the previous, and ends midway
  //    between the residue and the next.
  //  - the tangents for the Catmull-Rom spline depend on the residues
  //    before and after. Thus, to get the same curvature for a 
  //    trace subset, the residues before and after must be taken
  //    into account.
  var fullTraces = this._chain.backboneTraces();
  var traceSubsets = [];
  for (var i = 0; i < fullTraces.length; ++i) {
    var subsets = fullTraces[i].subsets(this._residues);
    for (var j = 0; j < subsets.length; ++j) {
      callback(subsets[j]);
    }
  }
};

ChainView.prototype.backboneTraces = function() {
  var traces = [];
  this.eachBackboneTrace(function(trace) { traces.push(trace); });
  return traces;
};

ChainView.prototype.full = function() { return this._chain; };

ChainView.prototype.name = function () { return this._chain.name(); };

ChainView.prototype.structure = function() { return this._molView; };

function ResidueView(chainView, residue) {
  ResidueBase.prototype.constructor.call(this);
  this._chainView = chainView;
  this._atoms = [];
  this._residue = residue;
}


derive(ResidueView, ResidueBase);

ResidueView.prototype.addAtom = function(atom) {
  var atomView = new AtomView(this, atom.full());
  this._atoms.push(atomView);
};

ResidueView.prototype.full = function() { return this._residue; };
ResidueView.prototype.num = function() { return this._residue.num(); };

ResidueView.prototype.insCode = function() { 
  return this._residue.insCode(); 
};
ResidueView.prototype.ss = function() { return this._residue.ss(); };
ResidueView.prototype.index = function() { return this._residue.index(); };
ResidueView.prototype.chain = function() { return this._chainView; };
ResidueView.prototype.name = function() { return this._residue.name(); };

ResidueView.prototype.atoms = function() { return this._atoms; };
ResidueView.prototype.qualifiedName = function() {
  return this._residue.qualifiedName();
};

ResidueView.prototype.containsResidue = function(residue) {
  return this._residue.full() === residue.full();
};

ResidueView.prototype.isAminoacid = function() { return this._residue.isAminoacid(); };
ResidueView.prototype.isNucleotide = function() { return this._residue.isNucleotide(); };
ResidueView.prototype.isWater = function() { return this._residue.isWater(); };

function AtomView(resView, atom) {
  AtomBase.prototype.constructor.call(this);
  this._resView = resView;
  this._atom = atom;
  this._bonds = [];
}


derive(AtomView, AtomBase);

AtomView.prototype.full = function() { return this._atom; };
AtomView.prototype.name = function() { return this._atom.name(); };
AtomView.prototype.pos = function() { return this._atom.pos(); };
AtomView.prototype.element = function() { return this._atom.element(); };
AtomView.prototype.residue = function() { return this._resView; };
AtomView.prototype.bonds = function() { return this._atom.bonds(); };
AtomView.prototype.index = function() { return this._atom.index(); };
AtomView.prototype.qualifiedName = function() {
  return this._atom.qualifiedName();
};



var zhangSkolnickSS = (function() {
  var posOne = vec3.create();
  var posTwo = vec3.create();
  return function(trace, i, distances, delta) {
    for (var j = Math.max(0, i-2); j <= i; ++j) {
      for (var k = 2;  k < 5; ++k) {
        if (j+k >= trace.length()) {
          continue;
        }
        var d = vec3.dist(trace.posAt(posOne, j), 
                          trace.posAt(posTwo, j+k));
        if (Math.abs(d - distances[k-2]) > delta) {
          return false;
        }
      }
    }
    return true;
  };
})();

var isHelical = function(trace, i) {
  var helixDistances = [5.45, 5.18, 6.37];
  var helixDelta = 2.1;
  return zhangSkolnickSS(trace, i, helixDistances, helixDelta);
};

var isSheet = function(trace, i) {
  var sheetDistances = [6.1, 10.4, 13.0];
  var sheetDelta = 1.42;
  return zhangSkolnickSS(trace, i, sheetDistances, sheetDelta);
};

function traceAssignHelixSheet(trace) {
  for (var i = 0; i < trace.length(); ++i) {
    if (isHelical(trace, i)) {
      trace.residueAt(i).setSS('H');
      continue;
    } 
    if (isSheet(trace, i)) {
      trace.residueAt(i).setSS('E');
      continue;
    }
    trace.residueAt(i).setSS('C');
  }
}


// assigns secondary structure information based on a simple and very fast 
// algorithm published by Zhang and Skolnick in their TM-align paper. 
// Reference:
//
// TM-align: a protein structure alignment algorithm based on the Tm-score 
// (2005) NAR, 33(7) 2302-2309
function assignHelixSheet(structure) {
  console.time('mol.assignHelixSheet');
  var chains = structure.chains();
  for (var ci = 0; ci < chains.length; ++ci) {
    var chain = chains[ci];
    chain.eachBackboneTrace(traceAssignHelixSheet);
  }
  console.timeEnd('mol.assignHelixSheet');
}

exports.mol = {};

exports.mol.Mol = Mol;
exports.mol.Chain = Chain;
exports.mol.Residue = Residue;
exports.mol.Atom = Atom;

exports.mol.MolView = MolView;
exports.mol.ChainView = ChainView;
exports.mol.ResidueView = ResidueView;
exports.mol.AtomView = AtomView;
exports.mol.assignHelixSheet = assignHelixSheet;

return true;

})(this);

// Copyright (c) 2013-2014 Marco Biasini
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to 
// deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.

(function(exports) {


function Remark350Reader() {
  this._assemblies = {};
  this._current = null;
}

Remark350Reader.prototype.assemblies = function() { 
  var assemblies = [];
  for (var c in this._assemblies) {
    assemblies.push(this._assemblies[c]);
  }
  return assemblies;
};

Remark350Reader.prototype.assembly = function(id) {
  return this._assemblies[id];
};


Remark350Reader.prototype.nextLine = function(line) {
  line = line.substr(11);
  if (line[0] === 'B' && line.substr(0, 12) === 'BIOMOLECULE:') {
    var name =  line.substr(13).trim();
    this._currentAssembly = new Assembly(name); 
    this._assemblies[name] =  this._currentAssembly;
    return;
  }
  if (line.substr(0, 30) === 'APPLY THE FOLLOWING TO CHAINS:' ||
      line.substr(0, 30) === '                   AND CHAINS:') {
    var chains = line.substr(30).split(',');
    if (line[0] === 'A') {
      this._currentSymGen = new SymGenerator();
      this._currentAssembly.addGenerator(this._currentSymGen);
    }
    this._currentMatrix = mat4.create();
    for (var i = 0; i < chains.length; ++i) {
      var trimmedChainName = chains[i].trim();
      if (trimmedChainName.length) {
        this._currentSymGen.addChain(trimmedChainName);
      }
    }
    return;
  }
  if (line.substr(0, 7) === '  BIOMT') {
    var col = parseInt(line[7], 10) - 1;
    var offset = 0;
    // for PDB files with 100 or more BIOMT matrices, the columns are 
    // shifted to the right by one digit (see PDB entry 1m4x, for 
    // example). The offset increases by one for every additional 
    // digit.
    while (line[12 + offset] !== ' ') {
      offset += 1;
    }
    var x = parseFloat(line.substr(13 + offset, 9));
    var y = parseFloat(line.substr(23 + offset, 9));
    var z = parseFloat(line.substr(33 + offset, 9));
    var w = parseFloat(line.substr(43 + offset, 14));
    var l = x*x + y*y + z*z;
    this._currentMatrix[4*0+col] = x;
    this._currentMatrix[4*1+col] = y;
    this._currentMatrix[4*2+col] = z;
    this._currentMatrix[4*3+col] = w;
    if (col === 2) {
      this._currentSymGen.addMatrix(this._currentMatrix);
      this._currentMatrix = mat4.create();
    }
    return;
  }
};

function PDBReader() {
  this._helices = [];
  this._sheets = [];
  this._structure = new mol.Mol();
  this._remark350Reader = new Remark350Reader();
  this._currChain =  null;
  this._currRes = null;
  this._currAtom = null;
}

PDBReader.prototype.parseHelixRecord = function(line) {
  var frstNum = parseInt(line.substr(21, 4), 10);
  var frstInsCode = line[25] === ' ' ? '\0' : line[25];
  var lastNum = parseInt(line.substr(33, 4), 10);
  var lastInsCode = line[37] === ' ' ? '\0' : line[37];
  var chainName = line[19];
  this._helices.push({ first : [frstNum, frstInsCode], 
           last : [lastNum, lastInsCode], chainName : chainName 
  });
  return true;
};

PDBReader.prototype.parseSheetRecord = function(line) {
  var frstNum = parseInt(line.substr(22, 4), 10);
  var frstInsCode = line[26] === ' ' ? '\0' : line[26];
  var lastNum = parseInt(line.substr(33, 4), 10);
  var lastInsCode = line[37] === ' ' ? '\0' : line[37];
  var chainName = line[21];
  this._sheets.push({ 
    first : [frstNum, frstInsCode],
    last : [lastNum, lastInsCode],
    chainName : chainName
  });
  return true;
};

PDBReader.prototype.parseAndAddAtom = function(line, hetatm) {
  var alt_loc = line[16];
  if (alt_loc !== ' ' && alt_loc !== 'A') {
    return true;
  }
  var chainName = line[21];
  var resName = line.substr(17, 3).trim();
  var atomName = line.substr(12, 4).trim();
  var rnumNum = parseInt(line.substr(22, 4), 10);
  var insCode = line[26] === ' ' ? '\0' : line[26];
  var updateResidue = false;
  var updateChain = false;
  if (!this._currChain || this._currChain.name() !== chainName) {
    updateChain = true;
    updateResidue = true;
  }
  if (!this._currRes || this._currRes.num() !== rnumNum || 
      this._currRes.insCode() !== insCode) {
    updateResidue = true;
  }
  if (updateChain) {
    // residues of one chain might appear interspersed with residues from
    // other chains.
    this._currChain = this._structure.chain(chainName) || 
                      this._structure.addChain(chainName);
  }
  if (updateResidue) {
    this._currRes = this._currChain.addResidue(resName, rnumNum, insCode);
  }
  var pos = vec3.create();
  for (var i=0;i<3;++i) {
    pos[i] = (parseFloat(line.substr(30+i*8, 8)));
  }
  this._currRes.addAtom(atomName, pos, line.substr(76, 2).trim());
  return true;
};

PDBReader.prototype.processLine = function(line) {
  var recordName = line.substr(0, 6);
  if (recordName === 'ATOM  ') {
    return this.parseAndAddAtom(line, false);
  }
  if (recordName === 'HETATM') {
    return this.parseAndAddAtom(line, true);
  }
  if (recordName === 'REMARK') {
    // for now we are only interested in the biological assembly information
    // contained in remark 350.
    var remarkNumber = line.substr(7, 3);
    if (remarkNumber === '350') {
      this._remark350Reader.nextLine(line);
    }
    return true;
  }
  if (recordName === 'HELIX ') {
    return this.parseHelixRecord(line);
  }
  if (recordName === 'SHEET ') {
    return this.parseSheetRecord(line);
  }
  if (recordName === 'END   ' || recordName === 'ENDMDL') {
    return false;
  }
  return true;
};

// assigns the secondary structure information found in the helix sheet records, 
// derives connectivity and assigns assembly information.
PDBReader.prototype.finish = function() {
  var chain = null;
  for (i = 0; i < this._sheets.length; ++i) {
    var sheet = this._sheets[i];
    chain = this._structure.chain(sheet.chainName);
    if (chain) {
      chain.assignSS(sheet.first, sheet.last, 'E');
    }
  }
  for (i = 0; i < this._helices.length; ++i) {
    var helix = this._helices[i];
    chain = this._structure.chain(helix.chainName);
    if (chain) {
      chain.assignSS(helix.first, helix.last, 'H');
    }
  }
  this._structure.setAssemblies(this._remark350Reader.assemblies());
  this._structure.deriveConnectivity();
  console.log('imported', this._structure.chains().length, 'chain(s),',
              this._structure.residueCount(), 'residue(s)');
  return this._structure;
};

// a truly minimalistic PDB parser. It will die as soon as the input is 
// not well-formed. it only reads ATOM, HETATM, HELIX, SHEET and REMARK 
// 350 records, everything else is ignored. in case of multi-model 
// files, only the first model is read.
//
// FIXME: load PDB currently spends a substantial amount of time creating
// the vec3 instances for the atom positions. it's possible that it's
// cheaper to initialize a bulk buffer once and create buffer views to
// that data for each atom position. since the atom's lifetime is bound to
// the parent structure, the buffer could be managed on that level and
// released once the structure is deleted.
function pdb(text) {
  console.time('pdb'); 
  var reader = new PDBReader();
  var lines = text.split(/\r\n|\r|\n/g);
  var i = 0;
  for (i = 0; i < lines.length; i++) {
    if (!reader.processLine(lines[i])) {
      break;
    }
  }
  var structure = reader.finish();
  console.timeEnd('pdb');
  return structure;
}


exports.io = {};
exports.io.pdb = pdb;
exports.io.Remark350Reader = Remark350Reader;


}(this));





// Copyright (c) 2013-2014 Marco Biasini
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to 
// deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.


// During recoloring of a render style, most of the vertex attributes, e.g.
// normals and positions do not change. Only the color information for each
// vertex needs to be adjusted. 
//
// To do that efficiently, we need store an association between ranges of
// vertices and atoms in the original structure. Worse, we also need to 
// support render styles for which colors need to be interpolated, e.g.
// the smooth line trace, tube and cartoon render modes. 
//
// The vertex association data for the atom-based render styles is managed
// by AtomVertexAssoc, whereas the trace-based render styles are managed 
// by the TraceVertexAssoc class. 
function AtomVertexAssoc(structure, callColoringBeginEnd) {
  this._structure = structure;
  this._assocs = [];
  this._callBeginEnd = callColoringBeginEnd;

}

if(typeof(exports) !== 'undefined') {
    exports.AtomVertexAssoc = AtomVertexAssoc;
}

AtomVertexAssoc.prototype.addAssoc = function(atom, va, vertStart, vertEnd)  {
  this._assocs.push({ 
    atom: atom, vertexArray : va, vertStart : vertStart, vertEnd : vertEnd 
  });
};

AtomVertexAssoc.prototype.recolor = function(colorOp, view) {
  // allocate buffer to hold all colors of the view.
  var colorData = new Float32Array(view.atomCount()*4); 
  if (this._callBeginEnd) {
    // FIXME: does this need to be called on the complete structure or the 
    // view?
    colorOp.begin(this._structure);
  }

  var atomMap = {};
  view.eachAtom(function(atom, index) {
    atomMap[atom.index()] = index;
    colorOp.colorFor(atom, colorData, index*4);
  });
  if (this._callBeginEnd) {
    colorOp.end(this._structure);
  }
  // apply the color to the actual interleaved vertex array.
  for (var i = 0; i < this._assocs.length; ++i) {
    var assoc = this._assocs[i];
    var ai = atomMap[assoc.atom.index()];
    if (ai === undefined) {
      continue;
    }
    var r = colorData[ai*4+0], g = colorData[ai*4+1], 
        b = colorData[ai*4+2], a = colorData[ai*4+3];
    var va = assoc.vertexArray;
    for (var j = assoc.vertStart ; j < assoc.vertEnd; ++j) {
      va.setColor(j, r, g, b, a);
    }
  }
};

AtomVertexAssoc.prototype.getColorForAtom = function(atom, color) {
  // FIXME: this can potentially get slow when called for many atoms
  for (var i = 0; i < this._assocs.length; ++i) {
    var assoc = this._assocs[i];
    if (assoc.atom.full() === atom.full()) {
      // for atom-based color, the color for each atom is constant, so just 
      // use any vertex to the determine color.
      return assoc.vertexArray.getColor(assoc.vertStart, color);
    }
  }
  return null;
};

AtomVertexAssoc.prototype.setOpacity = function( val, view) {
  // apply the color to the actual interleaved vertex array.
  for (var i = 0; i < this._assocs.length; ++i) {
    var assoc = this._assocs[i];
    var va = assoc.vertexArray;
    for (var j = assoc.vertStart ; j < assoc.vertEnd; ++j) {
      va.setOpacity(j, val);
    }
  }
};

// handles the association between a trace element, and sets of vertices.
function TraceVertexAssoc(structure, interpolation, callColoringBeginEnd,
                          perResidueColors) {
  this._structure = structure;
  this._assocs = [];
  this._callBeginEnd = callColoringBeginEnd;
  this._interpolation = interpolation || 1;
  this._perResidueColors = {};
}

if(typeof(exports) !== 'undefined') {
    exports.TraceVertexAssoc = TraceVertexAssoc;
}

TraceVertexAssoc.prototype.setPerResidueColors = function(traceIndex, colors) {
  this._perResidueColors[traceIndex] = colors;
};

TraceVertexAssoc.prototype.addAssoc = 
  function(traceIndex, vertexArray, slice, vertStart, vertEnd) {
    this._assocs.push({ traceIndex: traceIndex, slice : slice, 
                        vertStart : vertStart, vertEnd : vertEnd,
                        vertexArray : vertexArray});
};

TraceVertexAssoc.prototype.recolor = function(colorOp, view) {
  // FIXME: this function might create quite a few temporary buffers. Implement
  // a buffer pool to avoid hitting the GC and having to go through the slow
  // creation of typed arrays.
  if (this._callBeginEnd) {
    // FIXME: does this need to be called on the complete structure?
    colorOp.begin(this._structure);
  }
  var colorData = [];
  var i, j;
  var traces = this._structure.backboneTraces();
  console.assert(this._perResidueColors, 
                 "per-residue colors must be set for recoloring to work");
  for (i = 0; i < traces.length; ++i) {
    // get current residue colors
    var data = this._perResidueColors[i];
    console.assert(data, "no per-residue colors. Seriously, man?");
    var index = 0;
    var trace = traces[i];
    for (j = 0; j < trace.length(); ++j) {
      if (!view.containsResidue(trace.residueAt(j))) {
        index+=4;
        continue;
      }
      colorOp.colorFor(trace.centralAtomAt(j), data, index);
      index+=4;
    }
    if (this._interpolation > 1) {
      colorData.push(interpolateColor(data, this._interpolation));
    } else {
      colorData.push(data);
    }
  }

  // store the color in the actual interleaved vertex array.
  for (i = 0; i < this._assocs.length; ++i) {
    var assoc = this._assocs[i];
    var ai = assoc.slice;
    var newColors = colorData[assoc.traceIndex];
    var r = newColors[ai*4], g = newColors[ai*4+1], b = newColors[ai*4+2], a=newColors[ai*4+3];
    var va = assoc.vertexArray;
    for (j = assoc.vertStart ; j < assoc.vertEnd; ++j) {
      va.setColor(j, r, g, b, a);
    }
  }
  if (this._callBeginEnd) {
    colorOp.end(this._structure);
  }
};

TraceVertexAssoc.prototype.getColorForAtom = function(atom, color) {
  // FIXME: this can potentially get slow when called for many atoms
  var i, j;
  var traces = this._structure.backboneTraces();
  var residue = atom.full().residue();
  for (i = 0; i < traces.length; ++i) {
    var data = this._perResidueColors[i];
    var index = 0;
    var trace = traces[i];
    for (j = 0; j < trace.length(); ++j) {
      if (residue === trace.residueAt(j).full()) {
        color[0] = data[index + 0];
        color[1] = data[index + 1];
        color[2] = data[index + 2];
        color[3] = data[index + 3];
        return color;
      }
      index+=4;
    }
  }
  return null;
};


TraceVertexAssoc.prototype.setOpacity = function( val, view) {
  // store the color in the actual interleaved vertex array.
  for (i = 0; i < this._assocs.length; ++i) {
    var assoc = this._assocs[i];
    var va = assoc.vertexArray;
    for (j = assoc.vertStart ; j < assoc.vertEnd; ++j) {
      va.setOpacity(j, val);
    }
  }

};


// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

(function(exports) {
"use strict";

// contains classes for two kinds of typed array allocation schemes. 
// PoolAllocator stores every typed array allocation in a list and tries
// to reuse unused buffers whenever possible. The NativeAllocator just
// news the typed arrays every time they are used.
function PoolAllocator(bufferType) {
  this._freeArrays = [];
  this._bufferType = bufferType;
}

PoolAllocator.prototype.request = function(requestedLength) {
  var bestIndex = -1;
  var bestLength = null;
  for (var i = 0; i < this._freeArrays.length; ++i) {
    var free = this._freeArrays[i];
    var length = free.length;
    if (length >= requestedLength && 
        (bestLength === null || length < bestLength)) {
      bestLength = length;
      bestIndex = i;
    }
  }
  if (bestIndex !== -1) {
    var result = this._freeArrays[bestIndex];
    this._freeArrays.splice(bestIndex, 1);
    return result;
  }
  return new this._bufferType(requestedLength);

};

PoolAllocator.prototype.release = function(buffer) {
  this._freeArrays.push(buffer);
};

function NativeAllocator(bufferType) {
  this._bufferType = bufferType;
}

NativeAllocator.prototype.request = function(length) {
  return new this._bufferType(length);
};

NativeAllocator.prototype.release = function(buffer) {
};

exports.PoolAllocator = PoolAllocator;
exports.NativeAllocator = NativeAllocator;

return true;
})(this);

// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
(function(exports) {
"use strict";


function VertexArrayBase(gl, numVerts, float32Allocator) {
  this._gl = gl;
  this._vertBuffer = gl.createBuffer();
  this._float32Allocator = float32Allocator || null;
  this._ready = false;
  this._boundingSphere = null;
  var numFloats = this._FLOATS_PER_VERT * numVerts;
  this._vertData = float32Allocator.request(numFloats);
}

VertexArrayBase.prototype.setColor = function(index, r, g, b, a) {
  var colorStart = index * this._FLOATS_PER_VERT + this._COLOR_OFFSET;
  this._vertData[colorStart + 0] = r;
  this._vertData[colorStart + 1] = g;
  this._vertData[colorStart + 2] = b;
  this._vertData[colorStart + 3] = a;
  this._ready = false;
};

VertexArrayBase.prototype.getColor = function(index, color) {
  var colorStart = index * this._FLOATS_PER_VERT + this._COLOR_OFFSET;
  color[0] = this._vertData[colorStart + 0];
  color[1] = this._vertData[colorStart + 1];
  color[2] = this._vertData[colorStart + 2];
  color[3] = this._vertData[colorStart + 3];
  return color;
};

VertexArrayBase.prototype.setOpacity = function(index, a) {
  var colorStart = index * this._FLOATS_PER_VERT + this._COLOR_OFFSET;
  this._vertData[colorStart + 3] = a;
  this._ready = false;
};


VertexArrayBase.prototype.boundingSphere = function() {
  if (!this._boundingSphere) {
    this._boundingSphere = this._calculateBoundingSphere();
  }
  return this._boundingSphere;
};


VertexArrayBase.prototype._calculateBoundingSphere = function() {
  var numVerts = this.numVerts();
  if (numVerts === 0) {
    return null;
  }
  var center = vec3.create();
  var index, i;
  for (i = 0; i < numVerts; ++i) {
    index = i * this._FLOATS_PER_VERT;
    center[0] += this._vertData[index + 0];
    center[1] += this._vertData[index + 1];
    center[2] += this._vertData[index + 2];
  }
  vec3.scale(center, center, 1.0/numVerts);
  var radiusSquare = 0.0;
  for (i = 0; i < numVerts; ++i) {
    index = i * this._FLOATS_PER_VERT;
    var dx  = center[0] - this._vertData[index + 0];
    var dy  = center[1] - this._vertData[index + 1];
    var dz  = center[2] - this._vertData[index + 2];
    radiusSquare = Math.max(radiusSquare, dx*dx + dy*dy + dz*dz);
  }
  return new geom.Sphere(center, Math.sqrt(radiusSquare));
};

VertexArrayBase.prototype.destroy = function() {
  this._gl.deleteBuffer(this._vertBuffer);
  this._float32Allocator.release(this._vertData);
};

VertexArrayBase.prototype.bindBuffers = function() {
  this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertBuffer);
  if (this._ready) {
    return;
  }
  this._gl.bufferData(this._gl.ARRAY_BUFFER, this._vertData,
                      this._gl.STATIC_DRAW);
  this._ready = true;
};

// Helper method to calculate the squared bounding sphere radius of the sphere 
// centered on "sphereCenter" over multiple vertex arrays. 
VertexArrayBase.prototype.updateSquaredSphereRadius =  (function() {

  var transformedCenter = vec3.create();
  return function(sphereCenter, radius, transform) {
    var bounds = this.boundingSphere();
    if (!bounds) {
      return radius;
    }
    // Note: Math.max(radius, null) returns the radius for positive values 
    // of radius, which is exactly what we want.
    if (transform) {
      vec3.transformMat4(transformedCenter, bounds.center(), transform);
      return Math.max(vec3.sqrDist(transformedCenter, sphereCenter), radius);
    } 

    var sphereRadSquare = bounds.radius() * bounds.radius();
    return Math.max(vec3.sqrDist(bounds.center(), sphereCenter) + sphereRadSquare, radius);
  };
})();

VertexArrayBase.prototype.updateProjectionIntervals =  (function() {

  var transformedCenter = vec3.create();
  return function(xAxis, yAxis, zAxis, xInterval, yInterval, 
                  zInterval, transform) {
    var bounds = this.boundingSphere();
    if (!bounds) {
      return;
    }
    if (transform) {
      vec3.transformMat4(transformedCenter, bounds.center(), transform);
    } else {
      vec3.copy(transformedCenter, bounds.center());
    }
    var xProjected = vec3.dot(xAxis, transformedCenter);
    var yProjected = vec3.dot(yAxis, transformedCenter);
    var zProjected = vec3.dot(zAxis, transformedCenter);
    xInterval.update(xProjected - bounds.radius());
    xInterval.update(xProjected + bounds.radius());
    yInterval.update(yProjected - bounds.radius());
    yInterval.update(yProjected + bounds.radius());
    zInterval.update(zProjected - bounds.radius());
    zInterval.update(zProjected + bounds.radius());
  };
})();
exports.VertexArrayBase = VertexArrayBase;

})(this);

// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function(exports) {
"use strict";

function IndexedVertexArray(gl, numVerts, numIndices, 
                            float32Allocator, uint16Allocator) {
  VertexArrayBase.prototype.constructor.call(this, gl, numVerts, 
                                             float32Allocator);
  this._indexBuffer = gl.createBuffer();
  this._uint16Allocator = uint16Allocator;
  this._numVerts = 0;
  this._maxVerts = numVerts;
  this._numTriangles = 0;
  this._indexData = uint16Allocator.request(numIndices);
}

derive(IndexedVertexArray, VertexArrayBase);

IndexedVertexArray.prototype.destroy = function() {
  VertexArrayBase.prototype.destroy.call(this);
  this._gl.deleteBuffer(this._indexBuffer);
  this._uint16Allocator.release(this._indexData);
};

IndexedVertexArray.prototype.numVerts = function() { return this._numVerts; };
IndexedVertexArray.prototype.maxVerts = function() { return this._maxVerts; };
IndexedVertexArray.prototype.numIndices = function() { return this._numTriangles * 3; };

IndexedVertexArray.prototype.addVertex = function(pos, normal, color, objId) {
  var i = this._numVerts * this._FLOATS_PER_VERT;
  this._vertData[i++] = pos[0];
  this._vertData[i++] = pos[1];
  this._vertData[i++] = pos[2];
  this._vertData[i++] = normal[0];
  this._vertData[i++] = normal[1];
  this._vertData[i++] = normal[2];
  this._vertData[i++] = color[0];
  this._vertData[i++] = color[1];
  this._vertData[i++] = color[2];
  this._vertData[i++] = color[3];
  this._vertData[i++] = objId;
  this._numVerts += 1;
  this._ready = false;
};

IndexedVertexArray.prototype._FLOATS_PER_VERT = 11;
IndexedVertexArray.prototype._OBJID_OFFSET = 10;
IndexedVertexArray.prototype._COLOR_OFFSET = 6;
IndexedVertexArray.prototype._NORMAL_OFFSET = 3;
IndexedVertexArray.prototype._POS_OFFSET = 0;


IndexedVertexArray.prototype.addTriangle = function(idx1, idx2, idx3) {
  var index = 3 * this._numTriangles;
  if (index >= this._indexData.length) {
    return;
  }
  this._indexData[index++] = idx1;
  this._indexData[index++] = idx2;
  this._indexData[index++] = idx3;
  this._numTriangles += 1;
  this._ready = false;
};

IndexedVertexArray.prototype.bindBuffers = function() {
  var ready = this._ready;
  VertexArrayBase.prototype.bindBuffers.call(this);
  this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
  if (ready) {
    return;
  }
  this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, this._indexData,
                      this._gl.STATIC_DRAW);
};

IndexedVertexArray.prototype.bindAttribs = function(shader) {
  this._gl.enableVertexAttribArray(shader.posAttrib);
  this._gl.vertexAttribPointer(shader.posAttrib, 3, this._gl.FLOAT, false,
                               this._FLOATS_PER_VERT * 4, this._POS_OFFSET * 4);

  if (shader.normalAttrib !== -1) {
    this._gl.enableVertexAttribArray(shader.normalAttrib);
    this._gl.vertexAttribPointer(shader.normalAttrib, 3, this._gl.FLOAT, false,
                                 this._FLOATS_PER_VERT * 4,
                                 this._NORMAL_OFFSET * 4);
  }

  if (shader.colorAttrib !== -1) {
    this._gl.vertexAttribPointer(shader.colorAttrib, 4, this._gl.FLOAT, false,
                                 this._FLOATS_PER_VERT * 4,
                                 this._COLOR_OFFSET * 4);
    this._gl.enableVertexAttribArray(shader.colorAttrib);
  }
  if (shader.objIdAttrib !== -1) {
    this._gl.vertexAttribPointer(shader.objIdAttrib, 1, this._gl.FLOAT, false,
                                 this._FLOATS_PER_VERT * 4, this._OBJID_OFFSET * 4);
    this._gl.enableVertexAttribArray(shader.objIdAttrib);
  }
};

IndexedVertexArray.prototype.releaseAttribs = function(shader) {

  this._gl.disableVertexAttribArray(shader.posAttrib);
  if (shader.colorAttrib !== -1) {
    this._gl.disableVertexAttribArray(shader.colorAttrib);
  }
  if (shader.normalAttrib !== -1) {
    this._gl.disableVertexAttribArray(shader.normalAttrib);
  }
  if (shader.objIdAttrib !== -1) {
    this._gl.disableVertexAttribArray(shader.objIdAttrib);
  }
};

IndexedVertexArray.prototype.bind = function(shader) {
  this.bindBuffers();
  this.bindAttribs(shader);
};

// draws all triangles contained in the indexed vertex array using the provided
// shader. requires a call to bind() first.
IndexedVertexArray.prototype.draw = function() {
  this._gl.drawElements(this._gl.TRIANGLES, this._numTriangles * 3,
                        this._gl.UNSIGNED_SHORT, 0);
};

exports.IndexedVertexArray = IndexedVertexArray;

return true;
})(this);

// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function(exports) {
"use strict";

// (unindexed) vertex array for line-based geometries
function VertexArray(gl, numVerts, float32Allocator)  {
  VertexArrayBase.prototype.constructor.call(this, gl, numVerts, 
                                             float32Allocator);
  this._numLines = 0;
}

derive(VertexArray, VertexArrayBase);

VertexArray.prototype._FLOATS_PER_VERT = 8;
VertexArray.prototype._POS_OFFSET = 0;
VertexArray.prototype._COLOR_OFFSET = 3;
VertexArray.prototype._ID_OFFSET = 7;

VertexArray.prototype.numVerts = function() { return this._numLines * 2; };

VertexArray.prototype.addLine = function(startPos, startColor, endPos, 
                                         endColor, idOne, idTwo) {
  var index = this._FLOATS_PER_VERT * this._numLines * 2;
  this._vertData[index++] = startPos[0];
  this._vertData[index++] = startPos[1];
  this._vertData[index++] = startPos[2];
  this._vertData[index++] = startColor[0];
  this._vertData[index++] = startColor[1];
  this._vertData[index++] = startColor[2];
  this._vertData[index++] = startColor[3];
  this._vertData[index++] = idOne;
  this._vertData[index++] = endPos[0];
  this._vertData[index++] = endPos[1];
  this._vertData[index++] = endPos[2];
  this._vertData[index++] = endColor[0];
  this._vertData[index++] = endColor[1];
  this._vertData[index++] = endColor[2];
  this._vertData[index++] = endColor[3];
  this._vertData[index++] = idTwo;

  this._numLines += 1;
  this._ready = false;
  this._boundingSpehre = null;
};


VertexArray.prototype.bindAttribs = function(shader) {
  this._gl.vertexAttribPointer(shader.posAttrib, 3, this._gl.FLOAT, false,
                                this._FLOATS_PER_VERT * 4,
                                this._POS_OFFSET * 4);
  if (shader.colorAttrib !== -1) {
    this._gl.vertexAttribPointer(shader.colorAttrib, 4, this._gl.FLOAT, false,
                                 this._FLOATS_PER_VERT * 4,
                                 this._COLOR_OFFSET * 4);
    this._gl.enableVertexAttribArray(shader.colorAttrib);
  }
  this._gl.enableVertexAttribArray(shader.posAttrib);
  if (shader.objIdAttrib !== -1) {
    this._gl.vertexAttribPointer(shader.objIdAttrib, 1, this._gl.FLOAT, false,
                                  this._FLOATS_PER_VERT * 4,
                                  this._ID_OFFSET * 4);
    this._gl.enableVertexAttribArray(shader.objIdAttrib);
  }
};

VertexArray.prototype.releaseAttribs = function(shader) {
  this._gl.disableVertexAttribArray(shader.posAttrib);
  if (shader.colorAttrib !== -1) {
    this._gl.disableVertexAttribArray(shader.colorAttrib); }
  if (shader.objIdAttrib !== -1) {
    this._gl.disableVertexAttribArray(shader.objIdAttrib);
  }
};

VertexArray.prototype.bind = function(shader) {
  this.bindBuffers();
  this.bindAttribs(shader);
};

// draws all triangles contained in the indexed vertex array using the provided
// shader.
VertexArray.prototype.draw = function(symId) {
  this._gl.drawArrays(this._gl.LINES, 0, this._numLines * 2);
};



exports.VertexArray = VertexArray;

return true;
})(this);

// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function(exports) {
"use strict";

// LineChainData and MeshChainData are two internal classes that add molecule-
// specific attributes and functionality to the IndexedVertexArray and 
// VertexArray classes.
function LineChainData(chain, gl, numVerts, float32Allocator) {
  VertexArray.prototype.constructor.call(this, gl, numVerts, float32Allocator);
  this._chain = chain;
}

derive(LineChainData, VertexArray);

LineChainData.prototype.chain = function() { return this._chain; };


function MeshChainData(chain, gl, numVerts, numIndices, float32Allocator, 
                       uint16Allocator) {
  IndexedVertexArray.prototype.constructor.call(this, gl, numVerts, numIndices, 
                                                float32Allocator, 
                                                uint16Allocator);
  this._chain = chain;
}

MeshChainData.prototype.chain = function() { return this._chain; };

LineChainData.prototype.drawSymmetryRelated = function(cam, shader, transforms) {
  this.bind(shader);
  for (var i = 0; i < transforms.length; ++i) {
    cam.bind(shader, transforms[i]);
    this._gl.uniform1i(shader.symId, i);
    this.draw();
  }
  this.releaseAttribs(shader);
};

derive(MeshChainData, IndexedVertexArray);

MeshChainData.prototype.drawSymmetryRelated = LineChainData.prototype.drawSymmetryRelated;
exports.LineChainData = LineChainData;
exports.MeshChainData = MeshChainData;

return true;
})(this);

// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// contains classes for constructing geometry for spheres, cylinders and tubes.
(function(exports) {
"use strict";

function ProtoSphere(stacks, arcs) {
  this._arcs = arcs;
  this._stacks = stacks;
  this._indices = new Uint16Array(3 * arcs * stacks * 2);
  this._verts = new Float32Array(3 * arcs * stacks);
  var vert_angle = Math.PI / (stacks - 1);
  var horz_angle = Math.PI * 2.0 / arcs;
  var i, j;
  for (i = 0; i < this._stacks; ++i) {
    var radius = Math.sin(i * vert_angle);
    var z = Math.cos(i * vert_angle);
    for (j = 0; j < this._arcs; ++j) {
      var nx = radius * Math.cos(j * horz_angle);
      var ny = radius * Math.sin(j * horz_angle);
      this._verts[3 * (j + i * this._arcs)] = nx;
      this._verts[3 * (j + i * this._arcs) + 1] = ny;
      this._verts[3 * (j + i * this._arcs) + 2] = z;
    }
  }
  var index = 0;
  for (i = 0; i < this._stacks - 1; ++i) {
    for (j = 0; j < this._arcs; ++j) {
      this._indices[index] = (i) * this._arcs + j;
      this._indices[index + 1] = (i) * this._arcs + ((j + 1) % this._arcs);
      this._indices[index + 2] = (i + 1) * this._arcs + j;

      index += 3;

      this._indices[index] = (i) * this._arcs + ((j + 1) % this._arcs);
      this._indices[index + 1] =
          (i + 1) * this._arcs + ((j + 1) % this._arcs);
      this._indices[index + 2] = (i + 1) * this._arcs + j;
      index += 3;
    }
  }
}

ProtoSphere.prototype.addTransformed = (function() {

    var pos = vec3.create(), normal = vec3.create();

    return function(va, center, radius, color, objId) {
      var baseIndex = va.numVerts();
      for (var i = 0; i < this._stacks * this._arcs; ++i) {
        vec3.set(normal, this._verts[3 * i], this._verts[3 * i + 1],
                this._verts[3 * i + 2]);
        vec3.copy(pos, normal);
        vec3.scale(pos, pos, radius);
        vec3.add(pos, pos, center);
        va.addVertex(pos, normal, color, objId);
      }
      for (i = 0; i < this._indices.length / 3; ++i) {
        va.addTriangle(baseIndex + this._indices[i * 3],
                       baseIndex + this._indices[i * 3 + 1],
                       baseIndex + this._indices[i * 3 + 2]);
      }
  };
})();

ProtoSphere.prototype.numIndices = function() {
  return this._indices.length;
};

ProtoSphere.prototype.numVerts = function() {
  return this._verts.length / 3;
};

// A tube profile is a cross-section of a tube, e.g. a circle or a 'flat'
// square.
// They are used to control the style of helices, strands and coils for the
// cartoon render mode.
function TubeProfile(points, num, strength) {
  var interpolated =
      geom.catmullRomSpline(points, points.length / 3, num, strength, true);

  this._indices = new Uint16Array(interpolated.length * 2);
  this._verts = interpolated;
  this._normals = new Float32Array(interpolated.length);
  this._arcs = interpolated.length / 3;

  var normal = vec3.create(), pos = vec3.create();

  for (var i = 0; i < this._arcs; ++i) {
    var i_prev = i === 0 ? this._arcs - 1 : i - 1;
    var i_next = i === this._arcs - 1 ? 0 : i + 1;
    normal[0] = this._verts[3 * i_next + 1] - this._verts[3 * i_prev + 1];
    normal[1] = this._verts[3 * i_prev] - this._verts[3 * i_next];
    vec3.normalize(normal, normal);
    this._normals[3 * i] = normal[0];
    this._normals[3 * i + 1] = normal[1];
    this._normals[3 * i + 2] = normal[2];
  }

  for (i = 0; i < this._arcs; ++i) {
    this._indices[6 * i] = i;
    this._indices[6 * i + 1] = i + this._arcs;
    this._indices[6 * i + 2] = ((i + 1) % this._arcs) + this._arcs;
    this._indices[6 * i + 3] = i;
    this._indices[6 * i + 4] = ((i + 1) % this._arcs) + this._arcs;
    this._indices[6 * i + 5] = (i + 1) % this._arcs;
  }
}

TubeProfile.prototype.addTransformed = (function() {
  var pos = vec3.create(), normal = vec3.create();
  return function(vertArray, center, radius, rotation, color, first, offset, objId) {
    var baseIndex = vertArray.numVerts() - this._arcs;
    for (var i = 0; i < this._arcs; ++i) {
      vec3.set(pos, radius * this._verts[3 * i], 
               radius * this._verts[3 * i + 1], 0.0);
      vec3.transformMat3(pos, pos, rotation);
      vec3.add(pos, pos, center);
      vec3.set(normal, this._normals[3 * i], this._normals[3 * i + 1], 0.0);
      vec3.transformMat3(normal, normal, rotation);
      vertArray.addVertex(pos, normal, color, objId);
    }
    if (first) {
      return;
    }
    if (offset === 0) {
      // that's what happens most of the time, thus is has been optimized.
      for (i = 0; i < this._indices.length / 3; ++i) {
        vertArray.addTriangle(baseIndex + this._indices[i * 3],
                              baseIndex + this._indices[i * 3 + 1],
                              baseIndex + this._indices[i * 3 + 2]);
      }
      return;
    }
    for (i = 0; i < this._arcs; ++i) {
      vertArray.addTriangle(baseIndex + ((i + offset) % this._arcs),
                            baseIndex + i + this._arcs,
                            baseIndex + ((i + 1) % this._arcs) + this._arcs);
      vertArray.addTriangle(baseIndex + (i + offset) % this._arcs,
                            baseIndex + ((i + 1) % this._arcs) + this._arcs,
                            baseIndex + ((i + 1 + offset) % this._arcs));
    }

  };
})();

function ProtoCylinder(arcs) {
  this._arcs = arcs;
  this._indices = new Uint16Array(arcs * 3 * 2);
  this._verts = new Float32Array(3 * arcs * 2);
  this._normals = new Float32Array(3 * arcs * 2);
  var angle = Math.PI * 2 / this._arcs;
  for (var i = 0; i < this._arcs; ++i) {
    var cos_angle = Math.cos(angle * i);
    var sin_angle = Math.sin(angle * i);
    this._verts[3 * i] = cos_angle;
    this._verts[3 * i + 1] = sin_angle;
    this._verts[3 * i + 2] = -0.5;
    this._verts[3 * arcs + 3 * i] = cos_angle;
    this._verts[3 * arcs + 3 * i + 1] = sin_angle;
    this._verts[3 * arcs + 3 * i + 2] = 0.5;
    this._normals[3 * i] = cos_angle;
    this._normals[3 * i + 1] = sin_angle;
    this._normals[3 * arcs + 3 * i] = cos_angle;
    this._normals[3 * arcs + 3 * i + 1] = sin_angle;
  }
  for (i = 0; i < this._arcs; ++i) {
    this._indices[6 * i] = (i) % this._arcs;
    this._indices[6 * i + 1] = arcs + ((i + 1) % this._arcs);
    this._indices[6 * i + 2] = (i + 1) % this._arcs;

    this._indices[6 * i + 3] = (i) % this._arcs;
    this._indices[6 * i + 4] = arcs + ((i) % this._arcs);
    this._indices[6 * i + 5] = arcs + ((i + 1) % this._arcs);
  }
}

ProtoCylinder.prototype.numVerts = function() {
  return this._verts.length / 3;
};

ProtoCylinder.prototype.numIndices = function() {
  return this._indices.length;
};

ProtoCylinder.prototype.addTransformed = (function() {
  var pos = vec3.create(), normal = vec3.create();
  return function(va, center, length, radius, rotation, colorOne, colorTwo,
                  idOne, idTwo) {
    var baseIndex = va.numVerts();
    for (var i = 0; i < 2 * this._arcs; ++i) {
      vec3.set(pos, radius * this._verts[3 * i], radius * this._verts[3 * i + 1],
              length * this._verts[3 * i + 2]);
      vec3.transformMat3(pos, pos, rotation);
      vec3.add(pos, pos, center);
      vec3.set(normal, this._normals[3 * i], this._normals[3 * i + 1],
              this._normals[3 * i + 2]);
      vec3.transformMat3(normal, normal, rotation);
      var objId = i < this._arcs ? idOne : idTwo;
      va.addVertex(pos, normal, i < this._arcs ? colorOne : colorTwo, objId);
    }
    for (i = 0; i < this._indices.length / 3; ++i) {
      va.addTriangle(baseIndex + this._indices[i * 3],
                     baseIndex + this._indices[i * 3 + 1],
                     baseIndex + this._indices[i * 3 + 2]);
    }
  };
})();

exports.TubeProfile = TubeProfile;
exports.ProtoSphere = ProtoSphere;
exports.ProtoCylinder = ProtoCylinder;

})(this);


// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function(exports) {

"use strict";

function Range(min, max) {
  if (min === undefined || max === undefined) {
    this._empty = true;
    this._min = this._max = null;
  } else {
    this._empty = false;
    this._min = min;
    this._max = max;
  }
}

Range.prototype.min = function() {
  return this._min;
};
Range.prototype.max = function() {
  return this._max;
};
Range.prototype.length = function() {
  return this._max - this._min;
};
Range.prototype.empty = function() {
  return this._empty;
};
Range.prototype.center = function() {
  return (this._max + this._min) * 0.5;
};

Range.prototype.extend = function(amount) {
  this._min -= amount;
  this._max += amount;
};

Range.prototype.update = function(val) {
  if (!this._empty) {
    if (val < this._min) {
      this._min = val;
    } else if (val > this._max) {
      this._max = val;
    }
    return;
  }
  this._min = this._max = val;
  this._empty = false;
};

// A scene node holds a set of child nodes to be rendered on screen. Later on,
// the SceneNode might grow additional functionality commonly found in a scene
// graph, e.g. coordinate transformations.
function SceneNode(gl) {
  this._children = [];
  this._visible = true;
  this._name = name || '';
  this._gl = gl;
  this._order = 1;
}

SceneNode.prototype.order = function(order) {
  if (order !== undefined) {
    this._order = order;
  }
  return this._order;
};

SceneNode.prototype.add = function(node) {
  this._children.push(node);
};

SceneNode.prototype.draw = function(cam, shaderCatalog, style, pass) {
  for (var i = 0, e = this._children.length; i !== e; ++i) {
    this._children[i].draw(cam, shaderCatalog, style, pass);
  }
};

SceneNode.prototype.show = function() {
  this._visible = true;
};

SceneNode.prototype.hide = function() {
  this._visible = false;
};

SceneNode.prototype.name = function(name) {
  if (name !== undefined) {
    this._name = name;
  }
  return this._name;
};

SceneNode.prototype.destroy = function() {
  for (var i = 0; i < this._children.length; ++i) {
    this._children[i].destroy();
  }
};

SceneNode.prototype.visible = function() {
  return this._visible;
};

function BaseGeom(gl) {
  SceneNode.prototype.constructor.call(this, gl);
  this._idRanges = [];
  this._vertAssocs = [];
  this._showRelated = null;
}

derive(BaseGeom, SceneNode);

BaseGeom.prototype.setShowRelated = function(rel) {
  this._showRelated = rel;
  return rel;
};

BaseGeom.prototype.symWithIndex = function(index) {
  if (this.showRelated() === 'asym') {
    return null;
  }
  var assembly = this.structure().assembly(this.showRelated());
  if (!assembly) {
    return null;
  }
  var gen = assembly.generators();
  for (var i = 0 ; i < gen.length; ++i) {
    if (gen[i].matrices().length > index) {
      return gen[i].matrix(index);
    }
    index -= gen[i].matrices().length;
  }
  return null;
};

BaseGeom.prototype.showRelated = function() {
  return this._showRelated;
};

BaseGeom.prototype.select = function(what) {
  return this.structure().select(what);
};

BaseGeom.prototype.structure = function() {
  return this._vertAssocs[0]._structure;
};


BaseGeom.prototype.getColorForAtom = function(atom, color) {
  // FIXME: what to do in case there are multiple assocs?
  return this._vertAssocs[0].getColorForAtom(atom, color);
};

BaseGeom.prototype.addIdRange = function(range) {
  this._idRanges.push(range);
};

BaseGeom.prototype.destroy = function() {
  SceneNode.prototype.destroy.call(this);
  for (var i = 0; i < this._idRanges.length; ++i) {
    this._idRanges[i].recycle();
  }
};

function eachCentralAtomAsym(structure, callback) {
  structure.eachResidue(function(residue) {
    var centralAtom = residue.centralAtom();
    if (centralAtom === null) {
      return;
    }
    callback(centralAtom, centralAtom.pos());
  });
}

var eachCentralAtomSym = (function() {
  var transformedPos = vec3.create();
  return function(structure, gens, callback) {
    for (var i = 0; i < gens.length; ++i) {
      var gen = gens[i];
      var chains = structure.chainsByName(gen.chains());
      for (var j = 0; j < gen.matrices().length; ++j) {
        var matrix = gen.matrix(j);
        for (var k = 0; k < chains.length; ++k) {
          var chain = chains[k];
          for (var l = 0; l < chain.residues().length; ++l) {
            var centralAtom = chain.residues()[l].centralAtom();
            if (centralAtom === null) {
              continue;
            }
            vec3.transformMat4(transformedPos, centralAtom.pos(), matrix);
            callback(centralAtom, transformedPos);
          }
        }
      }
    }
  };
})();

BaseGeom.prototype.eachCentralAtom = function(callback) {
  var go = this;
  var structure = go.structure();
  var assembly = structure.assembly(go.showRelated());
  // in case there is no assembly, just loop over all the atoms contained
  // in the structure and invoke the callback as is
  if (assembly === null) {
    return eachCentralAtomAsym(structure, callback);
  }
  return eachCentralAtomSym(structure, assembly.generators(), callback);
};

BaseGeom.prototype.addVertAssoc = function(assoc) {
  this._vertAssocs.push(assoc);
};

// returns all vertex arrays that contain geometry for one of the specified
// chain names. Typically, there will only be one array for a given chain,
// but for larger chains with mesh geometries a single chain may be split
// across multiple vertex arrays.
BaseGeom.prototype._vertArraysInvolving = function(chains) {
  var vertArrays = this.vertArrays();
  var selectedArrays = [];
  var set = {};
  for (var ci = 0; ci < chains.length; ++ci) {
    set[chains[ci]] = true;
  }
  for (var i = 0; i < vertArrays.length; ++i) {
    if (set[vertArrays[i].chain()] === true) {
      selectedArrays.push(vertArrays[i]);
    }
  }
  return selectedArrays;
};


// draws vertex arrays by using the symmetry generators contained in assembly
BaseGeom.prototype._drawSymmetryRelated = function(cam, shader, assembly) {
  var gens = assembly.generators();
  for (var i = 0; i < gens.length; ++i) {
    var gen = gens[i];
    var affectedVertArrays = this._vertArraysInvolving(gen.chains());
    this._drawVertArrays(cam, shader, affectedVertArrays, gen.matrices());
  }
};

BaseGeom.prototype._updateProjectionIntervalsAsym = 
     function(xAxis, yAxis, zAxis, xInterval, yInterval, zInterval) {
    var vertArrays = this.vertArrays();
    for (var i = 0; i < vertArrays.length; ++i) {
      vertArrays[i].updateProjectionIntervals(xAxis, yAxis, zAxis, xInterval, 
                                              yInterval, zInterval);
    }
};

BaseGeom.prototype.updateProjectionIntervals =
    function(xAxis, yAxis, zAxis, xInterval, yInterval, zInterval) {
  if (!this._visible) {
    return;
  }
  var showRelated = this.showRelated();
  if (showRelated === 'asym') {
    return this._updateProjectionIntervalsAsym(xAxis, yAxis, zAxis, xInterval, 
                                               yInterval, zInterval);
  } 
  var assembly = this.structure().assembly(showRelated);
  // in case there is no assembly, fallback to asymmetric unit and bail out.
  if (!assembly) {
    console.error('no assembly', showRelated, 
                  'found. Falling back to asymmetric unit');
    return this._updateProjectionIntervalsAsym(xAxis, yAxis, zAxis, xInterval, 
                                               yInterval, zInterval);
  }
  var gens = assembly.generators();
  for (var i = 0; i < gens.length; ++i) {
    var gen = gens[i];
    var affectedVertArrays = this._vertArraysInvolving(gen.chains());
    for (var j = 0; j < gen.matrices().length; ++j) {
      for (var k = 0; k < affectedVertArrays.length; ++k) {
        var transform = gen.matrix(j);
        affectedVertArrays[k].updateProjectionIntervals(xAxis, yAxis, zAxis, 
                                                        xInterval, yInterval, 
                                                        zInterval, transform);
      }
    }
  }
};


// FIXME: investigate the performance cost of sharing code between updateSquaredSphereRadius
// and updateProjectionIntervals 
BaseGeom.prototype._updateSquaredSphereRadiusAsym = function(center, radius) {
    var vertArrays = this.vertArrays();
    for (var i = 0; i < vertArrays.length; ++i) {
      radius = vertArrays[i].updateSquaredSphereRadius(center, radius);
    }
    return radius;
};

BaseGeom.prototype.updateSquaredSphereRadius = function(center, radius) {
  if (!this._visible) {
    return radius;
  }
  var showRelated = this.showRelated();
  if (showRelated === 'asym') {
    return this._updateSquaredSphereRadiusAsym(center, radius);
  } 
  var assembly = this.structure().assembly(showRelated);
  // in case there is no assembly, fallback to asymmetric unit and bail out.
  if (!assembly) {
    console.error('no assembly', showRelated, 
                  'found. Falling back to asymmetric unit');
    return this._updateSquaredSphereRadiusAsym(center, radius);
  }
  var gens = assembly.generators();
  for (var i = 0; i < gens.length; ++i) {
    var gen = gens[i];
    var affectedVertArrays = this._vertArraysInvolving(gen.chains());
    for (var j = 0; j < gen.matrices().length; ++j) {
      for (var k = 0; k < affectedVertArrays.length; ++k) {
        var transform = gen.matrix(j);
        radius = affectedVertArrays[k].updateSquaredSphereRadius(center, radius);
      }
    }
  }
  return radius;
};

BaseGeom.prototype.draw = function(cam, shaderCatalog, style, pass) {

  if (!this._visible) {
    return;
  }

  var shader = this.shaderForStyleAndPass(shaderCatalog, style, pass);

  if (!shader) {
    return;
  }
  var showRelated = this.showRelated();
  if (showRelated === 'asym') {
    return this._drawVertArrays(cam, shader, this.vertArrays(), null);
  } 

  var assembly = this.structure().assembly(showRelated);
  // in case there is no assembly, fallback to asymmetric unit and bail out.
  if (!assembly) {
    console.error('no assembly', showRelated, 
                  'found. Falling back to asymmetric unit');
    return this._drawVertArrays(cam, shader, this.vertArrays(), null);
  }
  return this._drawSymmetryRelated(cam, shader, assembly);
};

BaseGeom.prototype.colorBy = function(colorFunc, view) {
  console.time('BaseGeom.colorBy');
  this._ready = false;
  view = view || this.structure();
  for (var i = 0; i < this._vertAssocs.length; ++i) {
    this._vertAssocs[i].recolor(colorFunc, view);
  }
  console.timeEnd('BaseGeom.colorBy');
};

BaseGeom.prototype.setOpacity = function(val, view) {
  console.time('BaseGeom.setOpacity');
  this._ready = false;
  view = view || this.structure();
  for (var i = 0; i < this._vertAssocs.length; ++i) {
    this._vertAssocs[i].setOpacity(val, view);
  }
  console.timeEnd('BaseGeom.setOpacity');
};

// Holds geometrical data for objects rendered as lines. For each vertex,
// the color and position is stored in an interleaved format.
function LineGeom(gl, float32Allocator) {
  BaseGeom.prototype.constructor.call(this, gl);
  this._vertArrays = [];
  this._float32Allocator = float32Allocator;
  this._vertAssocs = [];
  this._lineWidth = 1.0;
}

derive(LineGeom, BaseGeom);


LineGeom.prototype.addChainVertArray = function(chain, numVerts) {
  var va = new LineChainData(chain.name(), this._gl, numVerts, 
                             this._float32Allocator);
  this._vertArrays.push(va);
  return va;
};


LineGeom.prototype.setLineWidth = function(width) {
  this._lineWidth = width;
};

LineGeom.prototype.vertArrays = function() {
  return this._vertArrays;
};

LineGeom.prototype.shaderForStyleAndPass =
    function(shaderCatalog, style, pass) {
  if (pass === 'outline') {
    return null;
  }
  if (pass === 'select') {
    return shaderCatalog.select;
  }
  return shaderCatalog.lines;
};

LineGeom.prototype.destroy = function() {
  BaseGeom.prototype.destroy.call(this);
  for (var i = 0; i < this._vertArrays.length; ++i) {
    this._vertArrays[i].destroy();
  }
  this._vertArrays = [];
};

LineGeom.prototype._drawVertArrays = function(cam, shader, vertArrays, 
                                              additionalTransforms) {
  this._gl.lineWidth(this._lineWidth);
  var i;
  if (additionalTransforms) {
    for (i = 0; i < vertArrays.length; ++i) {
      vertArrays[i].drawSymmetryRelated(cam, shader, additionalTransforms);
    }
  } else {
    this._gl.uniform1i(shader.symId, 255);
    cam.bind(shader);
    for (i = 0; i < vertArrays.length; ++i) {
      vertArrays[i].bind(shader);
      vertArrays[i].draw();
      vertArrays[i].releaseAttribs(shader);
    }
  }
};

LineGeom.prototype.vertArray = function() { return this._va; };



// an (indexed) mesh geometry container
// ------------------------------------------------------------------------
//
// stores the vertex data in interleaved format. not doing so has severe
// performance penalties in WebGL, and severe means orders of magnitude
// slower than using an interleaved array.
//
// the vertex data is stored in the following format;
//
// Px Py Pz Nx Ny Nz Cr Cg Cb Ca Id
//
// , where P is the position, N the normal and C the color information
// of the vertex.
// 
// Uint16 index buffer limit
// -----------------------------------------------------------------------
//
// In WebGL, index arrays are restricted to uint16. The largest possible
// index value is smaller than the number of vertices required to display 
// larger molecules. To work around this, MeshGeom allows to split the
// render geometry across multiple indexed vertex arrays. 
function MeshGeom(gl, float32Allocator, uint16Allocator) {
  BaseGeom.prototype.constructor.call(this, gl);
  this._indexedVertArrays = [ ];
  this._float32Allocator = float32Allocator;
  this._uint16Allocator = uint16Allocator;
  this._remainingVerts = null;
  this._remainingIndices = null;
}

MeshGeom.prototype._boundedVertArraySize = function(size) {
  return Math.min(65536, size);
};

MeshGeom.prototype.addChainVertArray = function(chain, numVerts, numIndices) {
  this._remainingVerts = numVerts;
  this._remainingIndices = numIndices;
  var newVa = new MeshChainData(chain.name(), this._gl, 
                                this._boundedVertArraySize(numVerts), 
                                numIndices,
                                this._float32Allocator, 
                                this._uint16Allocator);
  this._indexedVertArrays.push(newVa);
  return newVa;
};

MeshGeom.prototype.addVertArray = function(numVerts, numIndices) {
  this._remainingVerts = numVerts;
  this._remainingIndices = numIndices;
  var newVa = new IndexedVertexArray(
    this._gl, this._boundedVertArraySize(numVerts), numIndices,
    this._float32Allocator, this._uint16Allocator);

  this._indexedVertArrays.push(newVa);
  return newVa;
};

MeshGeom.prototype.vertArrayWithSpaceFor = function(numVerts) {
  var currentVa = this._indexedVertArrays[this._indexedVertArrays.length - 1];
  var remaining = currentVa.maxVerts() - currentVa.numVerts();
  if (remaining >= numVerts) {
    return currentVa;
  }
  this._remainingVerts = this._remainingVerts - currentVa.numVerts();
  this._remainingIndices = this._remainingIndices - currentVa.numIndices();
  numVerts = this._boundedVertArraySize(this._remainingVerts);
  var newVa = null;
  if (currentVa instanceof MeshChainData) {
    newVa = new MeshChainData(currentVa.chain(), this._gl, numVerts, 
                              this._remainingIndices,
                              this._float32Allocator, 
                              this._uint16Allocator);
  } else {
    newVa = new IndexedVertexArray(this._gl, numVerts, this._remainingIndices,
      this._float32Allocator, this._uint16Allocator);
  } 
  this._indexedVertArrays.push(newVa);
  return newVa;
};


derive(MeshGeom, BaseGeom);

MeshGeom.prototype.vertArray = function(index) {
  return this._indexedVertArrays[index];
};

MeshGeom.prototype.destroy = function() {
  BaseGeom.prototype.destroy.call(this);
  for (var i = 0; i < this._indexedVertArrays.length; ++i) {
    this._indexedVertArrays[i].destroy();
  }
  this._indexedVertArrays = [];
};

MeshGeom.prototype.numVerts = function() {
  return this._indexedVertArrays[0].numVerts();
};

MeshGeom.prototype.shaderForStyleAndPass =
    function(shaderCatalog, style, pass) {
  if (pass === 'outline') {
    return shaderCatalog.outline;
  }
  if (pass === 'select') {
    return shaderCatalog.select;
  }
  var shader = shaderCatalog[style];
  return shader !== undefined ? shader : null;
};

MeshGeom.prototype._drawVertArrays = function(cam, shader, indexedVertArrays, 
                                              additionalTransforms) {
  var i;
  if (additionalTransforms) {
    for (i = 0; i < indexedVertArrays.length; ++i) {
      indexedVertArrays[i].drawSymmetryRelated(cam, shader, additionalTransforms);
    }
  } else {
    cam.bind(shader);
    this._gl.uniform1i(shader.symId, 255);
    for (i = 0; i < indexedVertArrays.length; ++i) {
      indexedVertArrays[i].bind(shader);
      indexedVertArrays[i].draw();
      indexedVertArrays[i].releaseAttribs(shader);
    }
  }
};

MeshGeom.prototype.vertArrays = function() {
  return this._indexedVertArrays;
};

MeshGeom.prototype.addVertex = function(pos, normal, color, objId) {
  var va = this._indexedVertArrays[0];
  va.addVertex(pos, normal, color, objId);
};

MeshGeom.prototype.addTriangle = function(idx1, idx2, idx3) {
  var va = this._indexedVertArrays[0];
  va.addTriangle(idx1, idx2, idx3);
};


function TextLabel(gl, canvas, context, pos, text) {
  SceneNode.prototype.constructor.call(this, gl);
  this._order = 100;
  this._pos = pos;
  this._interleavedBuffer = this._gl.createBuffer();
  this._interleavedData = new Float32Array(5 * 6);

  this._prepareText(canvas, context, text);

  var halfWidth = this._width / 2;
  var halfHeight = this._height / 2;
  this._interleavedData[0] = pos[0];
  this._interleavedData[1] = pos[1];
  this._interleavedData[2] = pos[2];
  this._interleavedData[3] = -halfWidth;
  this._interleavedData[4] = -halfHeight;

  this._interleavedData[5] = pos[0];
  this._interleavedData[6] = pos[1];
  this._interleavedData[7] = pos[2];
  this._interleavedData[8] = halfWidth;
  this._interleavedData[9] = halfHeight;

  this._interleavedData[10] = pos[0];
  this._interleavedData[11] = pos[1];
  this._interleavedData[12] = pos[2];
  this._interleavedData[13] = halfWidth;
  this._interleavedData[14] = -halfHeight;

  this._interleavedData[15] = pos[0];
  this._interleavedData[16] = pos[1];
  this._interleavedData[17] = pos[2];
  this._interleavedData[18] = -halfWidth;
  this._interleavedData[19] = -halfHeight;

  this._interleavedData[20] = pos[0];
  this._interleavedData[21] = pos[1];
  this._interleavedData[22] = pos[2];
  this._interleavedData[23] = -halfWidth;
  this._interleavedData[24] = halfHeight;

  this._interleavedData[25] = pos[0];
  this._interleavedData[26] = pos[1];
  this._interleavedData[27] = pos[2];
  this._interleavedData[28] = halfWidth;
  this._interleavedData[29] = halfHeight;
}

TextLabel.prototype.updateProjectionIntervals = function() {
  // text labels don't affect the projection interval. Don't do anything.
};

TextLabel.prototype.updateSquaredSphereRadius = function(center, radius) { 
  // text labels don't affect the bounding spheres. 
  return radius;
};

derive(TextLabel, SceneNode);

TextLabel.prototype._setupTextParameters = function(ctx) {
  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.font = '24px Verdana';
};


function smallestPowerOfTwo(size) {
  var s = 1;
  while (s < size) {
    s *= 2;
  }
  return s;
}

TextLabel.prototype._prepareText = function(canvas, ctx, text) {
  this._setupTextParameters(ctx);
  var estimatedWidth = ctx.measureText(text).width;
  var estimatedHeight = 24;
  canvas.width = smallestPowerOfTwo(estimatedWidth);
  canvas.height = smallestPowerOfTwo(estimatedHeight);
  this._setupTextParameters(ctx);
  ctx.fillStyle = '#666';
  ctx.globalAlpha = 0.5;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = 'black';
  ctx.lineWidth = 0.5;
  ctx.fillText(text, 0, canvas.height);
  ctx.strokeText(text, 0, canvas.height);
  this._texture = this._gl.createTexture();
  this._textureFromCanvas(this._texture, canvas);
  this._xScale = estimatedWidth / canvas.width;
  this._yScale = estimatedHeight / canvas.height;
  this._width = estimatedWidth * 0.002;
  this._height = estimatedHeight * 0.002;
};

TextLabel.prototype._textureFromCanvas = function(targetTexture, srcCanvas) {
  this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, true);
  this._gl.bindTexture(this._gl.TEXTURE_2D, targetTexture);
  this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA,
                      this._gl.UNSIGNED_BYTE, srcCanvas);
  this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER,
                         this._gl.LINEAR);
  this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER,
                         this._gl.LINEAR_MIPMAP_LINEAR);
  this._gl.generateMipmap(this._gl.TEXTURE_2D);
  this._gl.bindTexture(this._gl.TEXTURE_2D, null);
};

TextLabel.prototype.bind = function() {
  this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._interleavedBuffer);
  this._gl.activeTexture(this._gl.TEXTURE0);
  this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
  if (this._ready) {
    return;
  }
  this._gl.bufferData(this._gl.ARRAY_BUFFER, this._interleavedData,
                      this._gl.STATIC_DRAW);
  this._ready = true;
};

TextLabel.prototype.draw = function(cam, shaderCatalog, style, pass) {
  if (!this._visible) {
    return;
  }

  if (pass !== 'normal') {
    return;
  }
  var shader = shaderCatalog.text;
  cam.bind(shader);
  this.bind();
  this._gl.uniform1f(this._gl.getUniformLocation(shader, 'xScale'),
                     this._xScale);
  this._gl.uniform1f(this._gl.getUniformLocation(shader, 'yScale'),
                     this._yScale);
  this._gl.uniform1i(this._gl.getUniformLocation(shader, 'sampler'), 0);
  var vertAttrib = this._gl.getAttribLocation(shader, 'attrCenter');
  this._gl.enableVertexAttribArray(vertAttrib);
  this._gl.vertexAttribPointer(vertAttrib, 3, this._gl.FLOAT, false, 5 * 4,
                               0 * 4);
  var texAttrib = this._gl.getAttribLocation(shader, 'attrCorner');
  this._gl.vertexAttribPointer(texAttrib, 2, this._gl.FLOAT, false, 5 * 4,
                               3 * 4);
  this._gl.enableVertexAttribArray(texAttrib);
  this._gl.enable(this._gl.BLEND);
  this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
  this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
  this._gl.disableVertexAttribArray(vertAttrib);
  this._gl.disableVertexAttribArray(texAttrib);
  this._gl.disable(this._gl.BLEND);
};

// A continous range of object identifiers.
function ContinuousIdRange(pool, start, end) {
  this._pool = pool;
  this._start = start;
  this._next = start;
  this._end = end;
}

ContinuousIdRange.prototype.nextId = function(obj) {
  var id = this._next;
  this._next++;
  this._pool._objects[id] = obj;
  return id;
};
ContinuousIdRange.prototype.recycle = function() {
  this._pool.recycle(this);
};
ContinuousIdRange.prototype.length = function() {
  return this._end - this._start;
};

function UniqueObjectIdPool() {
  this._objects = {};
  this._unusedRangeStart = 0;
  this._free = [];
}

UniqueObjectIdPool.prototype.getContinuousRange = function(num) {
  // FIXME: keep the "free" list sorted, so we can binary search it
  // for a good match
  var bestIndex = -1;
  var bestLength = null;
  for (var i = 0; i < this._free.length; ++i) {
    var free = this._free[i];
    var length = free.length();
    if (length >= num && (bestLength === null || length < bestLength)) {
      bestLength = length;
      bestIndex = i;
    }
  }
  if (bestIndex !== -1) {
    var result = this._free[bestIndex];
    this._free.splice(bestIndex, 1);
    return result;
  }
  var start = this._unusedRangeStart;
  var end = start + num;
  if (end > 65536) {
    console.log('not enough free object ids.');
    return null;
  }
  this._unusedRangeStart = end;
  return new ContinuousIdRange(this, start, end);
};

UniqueObjectIdPool.prototype.recycle = function(range) {
  for (var i = range._start; i < range._next; ++i) {
    delete this._objects[i];
  }
  range._next = range._start;
  this._free.push(range);
};

UniqueObjectIdPool.prototype.objectForId = function(id) {
  return this._objects[id];
};

function OrientedBoundingBox(gl, center, halfExtents, 
                             float32Allocator, uint16Allocator) {
  LineGeom.prototype.constructor.call(this, gl, 24, float32Allocator, 
                                      uint16Allocator);
  var red = rgb.fromValues(1.0, 0.0, 0.0);
  var green = rgb.fromValues(0.0, 1.0, 0.0);
  var blue = rgb.fromValues(0.0, 0.0, 1.0);
  var tf = mat3.create();
  tf[0] = halfExtents[0][0];
  tf[1] = halfExtents[0][1];
  tf[2] = halfExtents[0][2];

  tf[3] = halfExtents[1][0];
  tf[4] = halfExtents[1][1];
  tf[5] = halfExtents[1][2];

  tf[6] = halfExtents[2][0];
  tf[7] = halfExtents[2][1];
  tf[8] = halfExtents[2][2];
  var a = vec3.create(), b = vec3.create();
  this.addLine(
      vec3.add(a, center, vec3.transformMat3(a, [ -1, -1, -1 ], tf)), red,
      vec3.add(b, center, vec3.transformMat3(b, [ 1, -1, -1 ], tf)), red, -1);

  this.addLine(
      vec3.add(a, center, vec3.transformMat3(a, [ 1, -1, -1 ], tf)), green,
      vec3.add(b, center, vec3.transformMat3(b, [ 1, 1, -1 ], tf)), green, -1);
  this.addLine(
      vec3.add(a, center, vec3.transformMat3(a, [ 1, 1, -1 ], tf)), red,
      vec3.add(b, center, vec3.transformMat3(b, [ -1, 1, -1 ], tf)), red, -1);
  this.addLine(vec3.add(a, center, vec3.transformMat3(a, [ -1, 1, -1 ], tf)),
               green,
               vec3.add(b, center, vec3.transformMat3(b, [ -1, -1, -1 ], tf)),
               green, -1);

  this.addLine(
      vec3.add(a, center, vec3.transformMat3(a, [ -1, -1, 1 ], tf)), red,
      vec3.add(b, center, vec3.transformMat3(b, [ 1, -1, 1 ], tf)), red, -1);
  this.addLine(
      vec3.add(a, center, vec3.transformMat3(a, [ 1, -1, 1 ], tf)), green,
      vec3.add(b, center, vec3.transformMat3(b, [ 1, 1, 1 ], tf)), green, -1);
  this.addLine(
      vec3.add(a, center, vec3.transformMat3(a, [ 1, 1, 1 ], tf)), red,
      vec3.add(b, center, vec3.transformMat3(b, [ -1, 1, 1 ], tf)), red, -1);
  this.addLine(
      vec3.add(a, center, vec3.transformMat3(a, [ -1, 1, 1 ], tf)), green,
      vec3.add(b, center, vec3.transformMat3(b, [ -1, -1, 1 ], tf)), green, -1);

  this.addLine(
      vec3.add(a, center, vec3.transformMat3(a, [ -1, -1, -1 ], tf)), blue,
      vec3.add(b, center, vec3.transformMat3(b, [ -1, -1, 1 ], tf)), blue, -1);
  this.addLine(
      vec3.add(a, center, vec3.transformMat3(a, [ 1, -1, -1 ], tf)), blue,
      vec3.add(b, center, vec3.transformMat3(b, [ 1, -1, 1 ], tf)), blue, -1);
  this.addLine(
      vec3.add(a, center, vec3.transformMat3(a, [ 1, 1, -1 ], tf)), blue,
      vec3.add(b, center, vec3.transformMat3(b, [ 1, 1, 1 ], tf)), blue, -1);
  this.addLine(
      vec3.add(a, center, vec3.transformMat3(a, [ -1, 1, -1 ], tf)), blue,
      vec3.add(b, center, vec3.transformMat3(b, [ -1, 1, 1 ], tf)), blue, -1);
}

derive(OrientedBoundingBox, LineGeom);

// don't do anything
OrientedBoundingBox.prototype.updateProjectionIntervals = function() {};

exports.SceneNode = SceneNode;
exports.OrientedBoundingBox = OrientedBoundingBox;
exports.AtomVertexAssoc = AtomVertexAssoc;
exports.TraceVertexAssoc = TraceVertexAssoc;
exports.MeshGeom = MeshGeom;
exports.LineGeom = LineGeom;
exports.TextLabel = TextLabel;
exports.UniqueObjectIdPool = UniqueObjectIdPool;
exports.Range = Range;
})(this);


// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var render = (function() {
  "use strict";

  var exports = {};

  var R = 0.7071;
  var COIL_POINTS = [ -R, -R, 0, R, -R, 0, R, R, 0, -R, R, 0 ];

  var HELIX_POINTS = [
    -6 * R,
    -1.0 * R,
    0,
    6 * R,
    -1.0 * R,
    0,
    6 * R,
    1.0 * R,
    0,
    -6 * R,
    1.0 * R,
    0
  ];
  var ARROW_POINTS = [
    -10 * R,
    -1.0 * R,
    0,
    10 * R,
    -1.0 * R,
    0,
    10 * R,
    1.0 * R,
    0,
    -10 * R,
    1.0 * R,
    0
  ];

// performs an in-place smoothing over 3 consecutive positions.
var inplaceStrandSmoothing = (function() {
  var bf = vec3.create(), af = vec3.create(), cf = vec3.create();
  return function(p, from, to, length) {
    from = Math.max(from, 1);
    to = Math.min(length - 1, to);
    var startIndex = 3 * (from - 1);
    vec3.set(bf, p[startIndex], p[startIndex + 1], p[startIndex + 2]);
    vec3.set(cf, p[3 * from], p[3 * from + 1], p[3 * from + 2]);
    for (var i = from; i < to; ++i) {
      startIndex = 3 * (i + 1);
      vec3.set(af, p[startIndex], p[startIndex + 1], p[startIndex + 2]);
      p[3 * i + 0] = af[0] * 0.25 + cf[0] * 0.50 + bf[0] * 0.25;
      p[3 * i + 1] = af[1] * 0.25 + cf[1] * 0.50 + bf[1] * 0.25;
      p[3 * i + 2] = af[2] * 0.25 + cf[2] * 0.50 + bf[2] * 0.25;
      vec3.copy(bf, cf);
      vec3.copy(cf, af);
    }
  };
})();

// derive a rotation matrix which rotates the z-axis onto tangent. when
// left is given and use_hint is true, x-axis is chosen to be as close
// as possible to left.
//
// upon returning, left will be modified to contain the updated left
// direction.
var buildRotation = (function() {
  return function(rotation, tangent, left, up, use_left_hint) {
    if (use_left_hint) { vec3.cross(up, tangent, left);
    } else {
  geom.ortho(up, tangent);
    }

    vec3.cross(left, up, tangent);
    vec3.normalize(up, up);
    vec3.normalize(left, left);
    rotation[0] = left[0];
    rotation[1] = left[1];
    rotation[2] = left[2];

    rotation[3] = up[0];
    rotation[4] = up[1];
    rotation[5] = up[2];

    rotation[6] = tangent[0];
    rotation[7] = tangent[1];
    rotation[8] = tangent[2];
}
;
})();

var spheresForChain = (function() {
  var color = vec4.fromValues(0.0, 0.0, 0.0, 1.0);

  return function(meshGeom, vertAssoc, options, chain) {
    var atomCount = chain.atomCount();
    var idRange = options.idPool.getContinuousRange(atomCount);
    var vertsPerSphere = options.protoSphere.numVerts();
    var indicesPerSphere = options.protoSphere.numIndices();
    var radius = 1.5 * options.radiusMultiplier;
    meshGeom.addIdRange(idRange);
    meshGeom.addChainVertArray(chain, vertsPerSphere*atomCount, 
                              indicesPerSphere*atomCount);
    chain.eachAtom(function(atom) {
      var va = meshGeom.vertArrayWithSpaceFor(vertsPerSphere);
      options.color.colorFor(atom, color, 0);
      var vertStart = va.numVerts();
      var objId = idRange.nextId({ geom: meshGeom, atom : atom });
      options.protoSphere.addTransformed(va, atom.pos(), radius, color, objId);
      var vertEnd = va.numVerts();
      vertAssoc.addAssoc(atom, va, vertStart, vertEnd);
    });
  };
})();

exports.spheres = function(structure, gl, options) {
  console.time('spheres');
  var protoSphere = new ProtoSphere(options.sphereDetail, options.sphereDetail);
  options.protoSphere = protoSphere;
  var geom = new MeshGeom(gl, options.float32Allocator, options.uint16Allocator);
  var vertAssoc = new AtomVertexAssoc(structure, true);
  geom.addVertAssoc(vertAssoc);
  geom.setShowRelated(options.showRelated);
  options.color.begin(structure);
  structure.eachChain(function(chain) {
    spheresForChain(geom, vertAssoc, options, chain);
  });
  options.color.end(structure);
  console.timeEnd('spheres');
  return geom;
};


var ballsAndSticksForChain = (function() {
  var midPoint = vec3.create(), dir = vec3.create();
  var color = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
  var left = vec3.create(), up = vec3.create();
  var rotation = mat3.create();
  return function(meshGeom, vertAssoc, options, chain) {
    // determine required number of vertices and indices for this chain
    var atomCount = chain.atomCount();
    var bondCount = 0;
    chain.eachAtom(function(a) { bondCount += a.bonds().length; });
    var numVerts = atomCount * options.protoSphere.numVerts() + 
                   bondCount * options.protoCyl.numVerts();
    var numIndices = atomCount * options.protoSphere.numIndices() + 
                     bondCount * options.protoCyl.numIndices();
    meshGeom.addChainVertArray(chain, numVerts, numIndices);
    var idRange = options.idPool.getContinuousRange(atomCount);
    meshGeom.addIdRange(idRange);
    // generate geometry for each atom
    chain.eachAtom(function(atom) {
      var atomVerts = options.protoSphere.numVerts() + 
                      atom.bondCount() * options.protoCyl.numVerts();
      var va = meshGeom.vertArrayWithSpaceFor(atomVerts);
      var vertStart = va.numVerts();
      var objId = idRange.nextId({ geom: meshGeom, atom : atom });

      options.color.colorFor(atom, color, 0);
      options.protoSphere.addTransformed(va, atom.pos(), options.radius, color,
                                         objId);
      atom.eachBond(function(bond) {
        bond.mid_point(midPoint);
        vec3.sub(dir, atom.pos(), midPoint);
        var length = vec3.length(dir);

        vec3.scale(dir, dir, 1.0/length);

        buildRotation(rotation, dir, left, up, false);

        vec3.add(midPoint, midPoint, atom.pos());
        vec3.scale(midPoint, midPoint, 0.5);
        options.protoCyl.addTransformed(va, midPoint, length, options.radius, 
                                        rotation, color, color, objId, objId);
      });
      var vertEnd = va.numVerts();
      vertAssoc.addAssoc(atom, va, vertStart, vertEnd);
    });
  };
})();

exports.ballsAndSticks = function(structure, gl, options) {
  console.time('ballsAndSticks');
  var vertAssoc = new AtomVertexAssoc(structure, true);
  var protoSphere = new ProtoSphere(options.sphereDetail, options.sphereDetail);
  var protoCyl = new ProtoCylinder(options.arcDetail);
  options.protoSphere = protoSphere;
  options.protoCyl = protoCyl;
  var meshGeom = new MeshGeom(gl, options.float32Allocator, 
                              options.uint16Allocator);
  meshGeom.addVertAssoc(vertAssoc);
  meshGeom.setShowRelated(options.showRelated);
  options.color.begin(structure);
  structure.eachChain(function(chain) {
    ballsAndSticksForChain(meshGeom, vertAssoc, options, chain);
  });
  options.color.end(structure);
  console.timeEnd('ballsAndSticks');
  return meshGeom;
};

var linesForChain = (function () {
  var mp = vec3.create();
  var clr = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
  return function(lineGeom, vertAssoc, chain, options) {
    var lineCount = 0;
    var atomCount = chain.atomCount();
    var idRange = options.idPool.getContinuousRange(atomCount);
    lineGeom.addIdRange(idRange);
    // determine number of required lines to draw the full structure
    chain.eachAtom(function(atom) {
      var numBonds = atom.bonds().length;
      if (numBonds) {
        lineCount += numBonds;
      } else {
        lineCount += 3;
      }
    });
    var va = lineGeom.addChainVertArray(chain, lineCount * 2);
    chain.eachAtom(function(atom) {
      // for atoms without bonds, we draw a small cross, otherwise these atoms
      // would be invisible on the screen.
      var vertStart = va.numVerts();
      var objId = idRange.nextId({ geom : lineGeom, atom: atom });
      if (atom.bonds().length) {
        atom.eachBond(function(bond) {
          bond.mid_point(mp);
          options.color.colorFor(atom, clr, 0);
          va.addLine(atom.pos(), clr, mp, clr, objId, objId);
        });
      } else {
        var cs = 0.2;
        var pos = atom.pos();
        options.color.colorFor(atom, clr, 0);
        va.addLine([ pos[0] - cs, pos[1], pos[2] ], clr,
                   [ pos[0] + cs, pos[1], pos[2] ], clr, objId, objId);
        va.addLine([ pos[0], pos[1] - cs, pos[2] ], clr,
                   [ pos[0], pos[1] + cs, pos[2] ], clr, objId, objId);
        va.addLine([ pos[0], pos[1], pos[2] - cs ], clr,
                   [ pos[0], pos[1], pos[2] + cs ], clr, objId, objId);
      }
      var vertEnd = va.numVerts();
      vertAssoc.addAssoc(atom, va, vertStart, vertEnd);
    });

  };
})();


exports.lines = function(structure, gl, options) {
  console.time('lines');
  var vertAssoc = new AtomVertexAssoc(structure, true);
  options.color.begin(structure);
  var lineCount = 0;
  var lineGeom = new LineGeom(gl, options.float32Allocator);
  lineGeom.setLineWidth(options.lineWidth);
  var va = lineGeom.vertArray();
  lineGeom.addVertAssoc(vertAssoc);
  lineGeom.setShowRelated(options.showRelated);
  structure.eachChain(function(chain) {
    linesForChain(lineGeom, vertAssoc, chain, options);
  });
  options.color.end(structure);
  console.timeEnd('lines');
  return lineGeom;
};

var _lineTraceNumVerts = function(traces) {
  var numVerts = 0;
  for (var i = 0; i < traces.length; ++i) {
    numVerts += 2 * (traces[i].length() - 1);
  }
  return numVerts;
};

var makeLineTrace = (function() {
  var colorOne = vec4.fromValues(0.0, 0.0, 0.0, 1.0), 
      colorTwo = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
  var posOne = vec3.create(), posTwo = vec3.create();

  return function makeLineTrace(lineGeom, vertAssoc, va, traceIndex, 
                                trace, options) {
    vertAssoc.addAssoc(traceIndex, va, 0, va.numVerts(),
                        va.numVerts() + 1);

    var colors = options.float32Allocator.request(trace.length() * 4);
    var idRange = options.idPool.getContinuousRange(trace.length());
    var idOne = idRange.nextId({ geom: lineGeom, 
                                 atom : trace.centralAtomAt(0) });
    var idTwo;
    lineGeom.addIdRange(idRange);
    for (var i = 1; i < trace.length(); ++i) {

      options.color.colorFor(trace.centralAtomAt(i - 1), colorOne, 0);
      colors[(i - 1) * 4 + 0] = colorOne[0];
      colors[(i - 1) * 4 + 1] = colorOne[1];
      colors[(i - 1) * 4 + 2] = colorOne[2];
      colors[(i - 1) * 4 + 3] = colorOne[3];
      options.color.colorFor(trace.centralAtomAt(i), colorTwo, 0);
      trace.posAt(posOne, i - 1);
      trace.posAt(posTwo, i);
      idTwo = idRange.nextId({ 
        geom: lineGeom, atom : trace.centralAtomAt(i)});
      va.addLine(posOne, colorOne, posTwo, colorTwo, idOne, idTwo);
      idOne = idTwo;
      idTwo = null;
      var vertEnd = va.numVerts();
      vertAssoc.addAssoc(traceIndex, va, i, vertEnd - 1,
                          vertEnd + ((i === trace.length() - 1) ? 0 : 1));
    }
    colors[trace.length() * 4 - 4] = colorTwo[0];
    colors[trace.length() * 4 - 3] = colorTwo[1];
    colors[trace.length() * 4 - 2] = colorTwo[2];
    colors[trace.length() * 4 - 1] = colorTwo[3];
    vertAssoc.setPerResidueColors(traceIndex, colors);
    return traceIndex + 1;
  };
})();

var lineTraceForChain = function(lineGeom, vertAssoc, options, traceIndex, 
                                 chain) {
  var backboneTraces =  chain.backboneTraces();
  var numVerts = _lineTraceNumVerts(backboneTraces);
  var va = lineGeom.addChainVertArray(chain, numVerts);
  for (var i = 0; i < backboneTraces.length; ++i) {
    traceIndex = makeLineTrace(lineGeom, vertAssoc, va, traceIndex, 
                               backboneTraces[i], options);
  }
  return traceIndex;


};
//--------------------------------------------------------------------------
// Some thoughts on trace-based render styles
//
//  * Backbone traces must be determined from the complete structure (Chain
//    as opposed to ChainView).
//
//  * For subsets, the trace must start midway between the residue before
//    the visible part, and end midway after the last visible residue.
//
//  * Curvature of trace subsets must be based on the full backbone trace.
//--------------------------------------------------------------------------
exports.lineTrace = function(structure, gl, options) {


  console.time('lineTrace');
  var vertAssoc = new TraceVertexAssoc(structure, 1, true);
  options.color.begin(structure);
  var chains = structure.chains();
  var lineGeom = new LineGeom(gl, options.float32Allocator);
  lineGeom.setLineWidth(options.lineWidth);
  var traceIndex = 0;
  structure.eachChain(function(chain) { 
    traceIndex = lineTraceForChain(lineGeom, vertAssoc, options, 
                                   traceIndex, chain);
  });
  lineGeom.addVertAssoc(vertAssoc);
  lineGeom.setShowRelated(options.showRelated);
  options.color.end(structure);
  console.timeEnd('lineTrace');
  return lineGeom;
};

var _slineNumVerts = function(traces, splineDetail) {
  var numVerts = 0;
  for (var i = 0; i < traces.length; ++i) {
    numVerts += 2 * (splineDetail * (traces[i].length() - 1) + 1);
  }
  return numVerts;
};

var slineMakeTrace = (function(trace) {
  var posOne = vec3.create(), posTwo = vec3.create();
  var colorOne = vec4.fromValues(0.0, 0.0, 0.0, 1.0), colorTwo = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
  return function(lineGeom, vertAssoc, va, options, traceIndex, trace) {
    var firstSlice = trace.fullTraceIndex(0);
    var positions = options.float32Allocator.request(trace.length() * 3);
    var colors = options.float32Allocator.request(trace.length() * 4);
    var objIds = [];
    var i, e;
    var idRange = options.idPool.getContinuousRange(trace.length());
    lineGeom.addIdRange(idRange);
    for (i = 0; i < trace.length(); ++i) {
      var atom = trace.centralAtomAt(i);
      trace.smoothPosAt(posOne, i, options.strength);
      options.color.colorFor(atom, colors, 4 * i);
      positions[i * 3] = posOne[0];
      positions[i * 3 + 1] = posOne[1];
      positions[i * 3 + 2] = posOne[2];
      objIds.push(idRange.nextId({ geom : lineGeom, atom : atom }));
    }
    var idStart = objIds[0], idEnd = 0;
    var sdiv = geom.catmullRomSpline(positions, trace.length(),
                                     options.splineDetail, options.strength,
                                     false, options.float32Allocator);
    var interpColors = interpolateColor(colors, options.splineDetail);
    var vertStart = va.numVerts();
    vertAssoc.addAssoc(traceIndex, va, firstSlice, vertStart, vertStart + 1);
    var halfSplineDetail = Math.floor(options.splineDetail / 2);
    var steps = geom.catmullRomSplineNumPoints(trace.length(),
                                               options.splineDetail, false);
    for (i = 1; i < steps; ++i) {
      posOne[0] = sdiv[3 * (i - 1)];
      posOne[1] = sdiv[3 * (i - 1) + 1];
      posOne[2] = sdiv[3 * (i - 1) + 2];
      posTwo[0] = sdiv[3 * (i - 0)];
      posTwo[1] = sdiv[3 * (i - 0) + 1];
      posTwo[2] = sdiv[3 * (i - 0) + 2];

      colorOne[0] = interpColors[4 * (i - 1) + 0];
      colorOne[1] = interpColors[4 * (i - 1) + 1];
      colorOne[2] = interpColors[4 * (i - 1) + 2];
      colorOne[3] = interpColors[4 * (i - 1) + 3];

      colorTwo[0] = interpColors[4 * (i - 0) + 0];
      colorTwo[1] = interpColors[4 * (i - 0) + 1];
      colorTwo[2] = interpColors[4 * (i - 0) + 2];
      colorTwo[3] = interpColors[4 * (i - 0) + 3];
      var index = Math.floor((i + halfSplineDetail) / options.splineDetail);
      idEnd = objIds[Math.min(objIds.length - 1, index)];
      va.addLine(posOne, colorOne, posTwo, colorTwo, idStart, idEnd);
      idStart = idEnd;
      var vertEnd = va.numVerts();
      vertAssoc.addAssoc(traceIndex, va, firstSlice + i, vertEnd - 1,
                         vertEnd + ((i === trace.length - 1) ? 0 : 1));
    }
    vertAssoc.setPerResidueColors(traceIndex, colors);
    options.float32Allocator.release(positions);
    options.float32Allocator.release(sdiv);
    return traceIndex + 1;
  };
})();

var slineForChain = function(lineGeom, vertAssoc, options, chain, traceIndex) {
  var backboneTraces = chain.backboneTraces();
  var numVerts = _slineNumVerts(backboneTraces, options.splineDetail);
  var va = lineGeom.addChainVertArray(chain, numVerts);
  for (var i = 0; i < backboneTraces.length; ++i) {
    traceIndex = slineMakeTrace(lineGeom, vertAssoc, va, options, 
                                traceIndex, backboneTraces[i]);
  }
  return traceIndex;
};

exports.sline = function(structure, gl, options) {
  console.time('sline');
  options.color.begin(structure);
  var vertAssoc =
      new TraceVertexAssoc(structure, options.splineDetail, 1, true);
  var lineGeom = new LineGeom(gl, options.float32Allocator);
  lineGeom.setLineWidth(options.lineWidth);
  lineGeom.setShowRelated(options.showRelated);
  var traceIndex = 0;
  structure.eachChain(function(chain) {
    traceIndex = slineForChain(lineGeom, vertAssoc, options, chain, traceIndex);
  });
  lineGeom.addVertAssoc(vertAssoc);
  options.color.end(structure);
  console.timeEnd('sline');
  return lineGeom;
};

var _traceNumVerts = function(traces, sphereNumVerts, cylNumVerts) {
  var numVerts = 0;
  for (var i = 0; i < traces.length; ++i) {
    numVerts += traces[i].length() * sphereNumVerts;
    numVerts += (traces[i].length() - 1) * cylNumVerts;
  }
  return numVerts;
};

var _traceNumIndices = function(traces, sphereNumIndices, cylNumIndices) {
  var numIndices = 0;
  for (var i = 0; i < traces.length; ++i) {
    numIndices += traces[i].length() * sphereNumIndices;
    numIndices += (traces[i].length() - 1) * cylNumIndices;
  }
  return numIndices;
};

var traceForChain = function(meshGeom, vertAssoc, options, traceIndex, chain) {
  // determine number of verts required to render the traces
  var traces = chain.backboneTraces();
  var numVerts = _traceNumVerts(traces, options.protoSphere.numVerts(),
                                options.protoCyl.numVerts());
  var numIndices = _traceNumIndices(traces, options.protoSphere.numIndices(),
                                    options.protoCyl.numIndices());
  meshGeom.addChainVertArray(chain, numVerts, numIndices);
  for (var ti = 0; ti < traces.length; ++ti) {
    _renderSingleTrace(meshGeom, vertAssoc, traces[ti], traceIndex, options);
    traceIndex++;
  }
  return traceIndex;
};

exports.trace = function(structure, gl, options) {
  console.time('trace');

  options.protoCyl = new ProtoCylinder(options.arcDetail);
  options.protoSphere =
      new ProtoSphere(options.sphereDetail, options.sphereDetail);

  var meshGeom = new MeshGeom(gl, options.float32Allocator, 
                              options.uint16Allocator);
  var vertAssoc = new TraceVertexAssoc(structure, 1, true);
  meshGeom.addVertAssoc(vertAssoc);
  meshGeom.setShowRelated(options.showRelated);

  options.color.begin(structure);
  var traceIndex = 0;
  structure.eachChain(function(chain) {
    traceIndex = traceForChain(meshGeom, vertAssoc, options, traceIndex, chain);
  });
  options.color.end(structure);

  console.timeEnd('trace');
  return meshGeom;
};

// calculates the number of vertices required for the cartoon and
// tube render styles
var _cartoonNumVerts = function(traces, vertsPerSlice, splineDetail) {
  var numVerts = 0;
  for (var i = 0; i < traces.length; ++i) {
    numVerts += ((traces[i].length() - 1) * splineDetail + 1) * vertsPerSlice;
    // triangles for capping the tube
    numVerts += 2;
  }
  return numVerts;
};

var _cartoonNumIndices = function(traces, vertsPerSlice, splineDetail) {
  var numIndices = 0;
  for (var i = 0; i < traces.length; ++i) {
    numIndices += (traces[i].length() * splineDetail - 1) * vertsPerSlice * 6;
    // triangles for capping the tube
    numIndices += 2 * 3 * vertsPerSlice;
  }
  return numIndices;
};

// creates the capped cylinders for DNA/RNA pointing towards the end of the bases.
var _addNucleotideSticks = (function() {
  var rotation = mat3.create();
  var up = vec3.create(), left = vec3.create(), dir = vec3.create();
  var center = vec3.create();
  var color = vec4.create();
  return function(meshGeom, vertAssoc, traces, options) {
    var radius = options.radius * 1.8;
    for (var i = 0; i < traces.length; ++i) {
      var trace = traces[i];
      var idRange = options.idPool.getContinuousRange(trace.length());
      for (var j = 0; j <  trace.length(); ++j) {
        var atomVerts = options.protoCyl.numVerts();
        var va = meshGeom.vertArrayWithSpaceFor(atomVerts);
        var vertStart = va.numVerts();
        var residue = trace.residueAt(j);
        var resName = residue.name();
        var startAtom = residue.atom('C3\'');
        var endAtom = null;
        if (resName === 'A' || resName === 'G' || resName === 'DA' || resName === 'DG') {
          endAtom = residue.atom('N1');
        } else {
          endAtom = residue.atom('N3');
        }
        if (endAtom === null || startAtom === null) {
          continue;
        }
        var objId = idRange.nextId({ geom: meshGeom, atom : endAtom });
        vec3.add(center, startAtom.pos(), endAtom.pos());
        vec3.scale(center, center, 0.5);

        options.color.colorFor(endAtom, color, 0);
        vec3.sub(dir, endAtom.pos(), startAtom.pos());
        var length = vec3.length(dir);
        vec3.scale(dir, dir, 1.0/length);
        buildRotation(rotation, dir, left, up, false);

        options.protoCyl.addTransformed(va, center, length, radius, 
                                        rotation, color, color, objId, objId);
        options.protoSphere.addTransformed(va, endAtom.pos(), radius, 
                                           color, objId);
        options.protoSphere.addTransformed(va, startAtom.pos(), radius, 
                                           color, objId);
        var vertEnd = va.numVerts();
        vertAssoc.addAssoc(endAtom, va, vertStart, vertEnd);
      }
    }
  };
})();

// generates the mesh geometry for displaying a single chain as either cartoon
// or tube (options.forceTube === true).
var cartoonForChain = function(meshGeom, vertAssoc, nucleotideAssoc, options, 
                               traceIndex, chain) {
  var traces = chain.backboneTraces();
  var numVerts = _cartoonNumVerts(traces, options.arcDetail * 4,
                                  options.splineDetail);
  var numIndices = _cartoonNumIndices(traces, options.arcDetail * 4,
                                      options.splineDetail);
  // figure out which of the traces consist of nucleic acids. They require additional 
  // space for rendering the sticks.
  var nucleicAcidTraces = [];
  var vertForBaseSticks = options.protoCyl.numVerts() + 
    2 * options.protoSphere.numVerts();
  var indicesForBaseSticks = options.protoCyl.numIndices() + 
    2 * options.protoSphere.numIndices();
  for (var i = 0; i < traces.length; ++i) {
    var trace = traces[i];
    if (trace.residueAt(0).isNucleotide()) {
      nucleicAcidTraces.push(trace);
      // each DNA/RNA base gets a double-capped cylinder
      numVerts += trace.length() * vertForBaseSticks;
      numIndices += trace.length() * indicesForBaseSticks;
    }
  }
  meshGeom.addChainVertArray(chain, numVerts, numIndices);
  for (var ti = 0; ti < traces.length; ++ti) {
    _cartoonForSingleTrace(meshGeom, vertAssoc, traces[ti], traceIndex, 
                           options);
    traceIndex++;
  }
  _addNucleotideSticks(meshGeom, nucleotideAssoc, nucleicAcidTraces, options);
  return traceIndex;
};

exports.cartoon = function(structure, gl, options) {
  console.time('cartoon');
  options.arrowSkip = Math.floor(options.splineDetail * 3 / 4);
  options.coilProfile = new TubeProfile(COIL_POINTS, options.arcDetail, 1.0);
  options.helixProfile = new TubeProfile(HELIX_POINTS, options.arcDetail, 0.1);
  options.strandProfile = new TubeProfile(HELIX_POINTS, options.arcDetail, 0.1);
  options.arrowProfile = new TubeProfile(ARROW_POINTS, options.arcDetail, 0.1);
  options.protoCyl = new ProtoCylinder(options.arcDetail * 4);
  options.protoSphere = new ProtoSphere(options.arcDetail * 4, options.arcDetail * 4);

  var meshGeom = new MeshGeom(gl, options.float32Allocator, 
                              options.uint16Allocator);
  var vertAssoc = new TraceVertexAssoc(structure, options.splineDetail, true);
  meshGeom.addVertAssoc(vertAssoc);
  meshGeom.setShowRelated(options.showRelated);

  options.color.begin(structure);

  var traceIndex = 0;
  // the following vert-assoc is for rendering of DNA/RNA. Create vertex assoc 
  // from N1/N3 atoms only, this will speed up recoloring later on, which when 
  // performed on the complete structure, is slower than recalculating the 
  // whole geometry.
  var selection = structure.select({anames: ['N1', 'N3']});
  var nucleotideAssoc = new AtomVertexAssoc(selection, true);
  meshGeom.addVertAssoc(nucleotideAssoc);
  structure.eachChain(function(chain) {
    traceIndex = cartoonForChain(meshGeom, vertAssoc, nucleotideAssoc, options, 
                                 traceIndex, chain);
  });

  options.color.end(structure);
  console.timeEnd('cartoon');
  return meshGeom;
};

exports.surface = (function() {
  var pos = vec3.create(), normal = vec3.create(), 
      color = vec4.fromValues(0.8, 0.8, 0.8, 1.0);
  return function(data, gl, options) {
    var offset = 0;
    var version = data.getUint32(0);
    offset += 4;
    var numVerts = data.getUint32(offset);
    offset += 4;
    var vertexStride = 4 * 6;
    var facesDataStart = vertexStride * numVerts + offset;
    var numFaces = data.getUint32(facesDataStart);
    var meshGeom = new MeshGeom(gl, options.float32Allocator,
                                options.uint16Allocator);
    meshGeom.setShowRelated('asym');
    var va = meshGeom.addVertArray(numVerts, numFaces * 3);
    var i;
    for (i = 0 ; i < numVerts; ++i) {
      vec3.set(pos, data.getFloat32(offset + 0), data.getFloat32(offset + 4),
               data.getFloat32(offset + 8));
      offset += 12;
      vec3.set(normal, data.getFloat32(offset + 0), data.getFloat32(offset + 4),
               data.getFloat32(offset + 8));
      offset += 12;
      va.addVertex(pos, normal, color, 0);
    }
    offset = facesDataStart + 4;
    for (i = 0 ; i < numFaces; ++i) {
      var idx0 = data.getUint32(offset + 0),
          idx1 = data.getUint32(offset + 4),
          idx2 = data.getUint32(offset + 8);
      offset += 12;
      va.addTriangle(idx0 - 1, idx2 -1, idx1 - 1);
    }
    return meshGeom;
  };
})();

var _cartoonAddTube = (function() {
  var rotation = mat3.create();
  var up = vec3.create();

  return function(vertArray, pos, left, ss, tangent, color, radius, first, options, 
                  offset, objId) {
    var prof = options.coilProfile;
    if (ss !== 'C' && !options.forceTube) {
      if (ss === 'H') {
        prof = options.helixProfile;
      } else if (ss === 'E') {
        prof = options.strandProfile;
      } else if (ss === 'A') {
        prof = options.arrowProfile;
      } 
    } else {
      if (first) {
        geom.ortho(left, tangent);
      } else {
        vec3.cross(left, up, tangent);
      }
    }

    buildRotation(rotation, tangent, left, up, true);
    prof.addTransformed(vertArray, pos, radius, rotation, color, first,
                        offset, objId);
  };
})();

// INTERNAL: fills positions, normals and colors from the information found in
// trace. The 3 arrays must already have the correct size (3*trace.length).
var _colorPosNormalsFromTrace = (function() {
  var pos = vec3.create();
  var normal = vec3.create(), lastNormal = vec3.create();

  return function(meshGeom, trace, colors, positions, normals, objIds, pool, 
                  options) {
    var strand_start = null, strand_end = null;
    var trace_length = trace.length();
    vec3.set(lastNormal, 0.0, 0.0, 0.0);
    for (var i = 0; i < trace_length; ++i) {
      objIds.push(pool.nextId({ geom : meshGeom, 
                                atom : trace.centralAtomAt(i)}));
      trace.smoothPosAt(pos, i, options.strength);
      positions[i * 3] = pos[0];
      positions[i * 3 + 1] = pos[1];
      positions[i * 3 + 2] = pos[2];

      trace.smoothNormalAt(normal, i, options.strength);

      var atom = trace.centralAtomAt(i);
      options.color.colorFor(atom, colors, i * 4);

      if (vec3.dot(normal, lastNormal) < 0) {
        vec3.scale(normal, normal, -1);
      }
      if (trace.residueAt(i).ss() === 'E' && !options.forceTube) {
        if (strand_start === null) {
          strand_start = i;
        }
        strand_end = i;
      }
      if (trace.residueAt(i).ss() === 'C' && strand_start !== null) {
        inplaceStrandSmoothing(positions, strand_start, strand_end, trace_length);
        inplaceStrandSmoothing(normals, strand_start, strand_end, trace_length);
        strand_start = null;
        strand_end = null;
      }
      normals[i * 3] = positions[3 * i] + normal[0] + lastNormal[0];
      normals[i * 3 + 1] = positions[3 * i + 1] + normal[1] + lastNormal[1];
      normals[i * 3 + 2] = positions[3 * i + 2] + normal[2] + lastNormal[2];
      vec3.copy(lastNormal, normal);
    }
  };
})();


function capTubeStart(va, baseIndex, numTubeVerts) {
  for (var i = 0; i < numTubeVerts - 1; ++i) {
    va.addTriangle(baseIndex, baseIndex + 1 + i, baseIndex + 2 + i);
  }
  va.addTriangle(baseIndex, baseIndex + numTubeVerts, baseIndex + 1);
}

function capTubeEnd(va, baseIndex, numTubeVerts) {
  var center = baseIndex + numTubeVerts;
  for (var i = 0; i < numTubeVerts - 1; ++i) {
    va.addTriangle(center, baseIndex + i + 1, baseIndex + i);
  }
  va.addTriangle(center, baseIndex, baseIndex + numTubeVerts - 1);
}

// constructs a cartoon representation for a single consecutive backbone
// trace.
var _cartoonForSingleTrace = (function() {

  var tangent = vec3.create(), pos = vec3.create(), left = vec3.create(),
      color = vec4.fromValues(0.0, 0.0, 0.0, 1.0), normal = vec3.create(), normal2 = vec3.create(),
      rot = mat3.create();

  return function(meshGeom, vertAssoc, trace, traceIndex, options) {
    var numVerts =
        _cartoonNumVerts([trace], options.arcDetail * 4, options.splineDetail);

    var positions = options.float32Allocator.request(trace.length() * 3);
    var colors = options.float32Allocator.request(trace.length() * 4);
    var normals = options.float32Allocator.request(trace.length() * 3);

    var objIds = [];
    var idRange = options.idPool.getContinuousRange(trace.length());
    _colorPosNormalsFromTrace(meshGeom, trace, colors, positions, normals, 
                              objIds, idRange, options);
    meshGeom.addIdRange(idRange);
    var vertArray = meshGeom.vertArrayWithSpaceFor(numVerts);
    var sdiv = geom.catmullRomSpline(positions, trace.length(),
                                      options.splineDetail, options.strength,
                                      false, options.float32Allocator);
    var normalSdiv = geom.catmullRomSpline(
        normals, trace.length(), options.splineDetail, options.strength, false,
        options.float32Allocator);
    vertAssoc.setPerResidueColors(traceIndex, colors);
    var radius = options.radius * (trace.residueAt(0).isAminoacid() ? 1.0 : 1.8);
    var interpColors = interpolateColor(colors, options.splineDetail);
    // handle start of trace. this could be moved inside the for-loop, but
    // at the expense of a conditional inside the loop. unrolling is
    // slightly faster.
    //
    // we repeat the following steps for the start, central section and end
    // of the profile: (a) assign position, normal, tangent and color, (b)
    // add tube (or rectangular profile for helices and strands).
    vec3.set(tangent, sdiv[3] - sdiv[0], sdiv[4] - sdiv[1], sdiv[5] - sdiv[2]);
    vec3.set(pos, sdiv[0], sdiv[1], sdiv[2]);
    vec3.set(normal, normalSdiv[0] - sdiv[0], normalSdiv[1] - sdiv[0],
              normalSdiv[2] - sdiv[2]);
    vec3.normalize(tangent, tangent);
    vec3.normalize(normal, normal);
    vec4.set(color, interpColors[0], interpColors[1], interpColors[2], 
             interpColors[3] );

    var vertStart = vertArray.numVerts();
    vertArray.addVertex(pos, [-tangent[0], -tangent[1], -tangent[2]], 
                        color, objIds[0]);
    _cartoonAddTube(vertArray, pos, normal, trace.residueAt(0), tangent,
                    color, radius, true, options, 0, objIds[0]);
    capTubeStart(vertArray, vertStart, options.arcDetail * 4);
    var vertEnd = vertArray.numVerts();
    var slice = 0;
    vertAssoc.addAssoc(traceIndex, vertArray, slice, vertStart, vertEnd);
    slice += 1;
    var halfSplineDetail = Math.floor(options.splineDetail / 2);

    // handle the bulk of the trace
    var steps = geom.catmullRomSplineNumPoints(trace.length(),
                                                options.splineDetail, false);

    for (var i = 1, e = steps; i < e; ++i) {
      // compute 3*i, 3*(i-1), 3*(i+1) once and reuse
      var ix3 = 3 * i, ix4 = 4 * i,  ipox3 = 3 * (i + 1), imox3 = 3 * (i - 1);

      vec3.set(pos, sdiv[ix3], sdiv[ix3 + 1], sdiv[ix3 + 2]);

      if (i === e -1) {
        vec3.set(tangent, sdiv[ix3] - sdiv[imox3],
                  sdiv[ix3 + 1] - sdiv[imox3 + 1],
                  sdiv[ix3 + 2] - sdiv[imox3 + 2]);
      } else {
        vec3.set(tangent, sdiv[ipox3] - sdiv[imox3],
                  sdiv[ipox3 + 1] - sdiv[imox3 + 1],
                  sdiv[ipox3 + 2] - sdiv[imox3 + 2]);
      }
      vec3.normalize(tangent, tangent);
      vec4.set(color, interpColors[ix4], interpColors[ix4 + 1],
                interpColors[ix4 + 2], interpColors[ix4 + 3]);

      var offset = 0; // <- set special handling of coil to helix,strand
                      //    transitions.
      var residueIndex = Math.floor(i / options.splineDetail);
      var prevResidueIndex = Math.floor((i - 1) / options.splineDetail);

      // used to determine whether we have to add an arrow profile. when the 
      // current residue is the last strand residue, the arrow tip has to land 
      // exactly on the first slice of the next residue. Because we would like 
      // to have larger arrows we use multiple slices for the arrow (set to 
      // 3/4 of splineDetail).
      var arrowEndIndex = Math.floor((i + options.arrowSkip) / options.splineDetail);
      var drawArrow = false;
      var thisSS = trace.residueAt(residueIndex).ss();
      if (!options.forceTube) {
        if (residueIndex !== prevResidueIndex) {
          // for helix and strand regions, we can't base the left vector
          // of the current residue on the previous one, since it determines
          // the orientation of the strand and helix profiles.
          //
          // frequently, the transition regions from coil to strand and helix
          // contain strong twists which severely hamper visual quality. there
          // is not problem however when transitioning from helix or strand
          // to coil or inside a helix or strand.
          //
          // to avoid these visual artifacts, we calculate the best fit between
          // the current normal and the normal "after" which gives us an offset
          // for stitching the two parts together.
          var prevSS = trace.residueAt(prevResidueIndex).ss();
          if (prevSS === 'C' && (thisSS === 'H' || thisSS === 'E')) {
            // we don't want to generate holes, so we have to make sure
            // the vertices of the rotated profile align with the previous
            // profile.
            vec3.set(normal2, normalSdiv[imox3] - sdiv[imox3],
                      normalSdiv[imox3 + 1] - sdiv[imox3 + 1],
                      normalSdiv[imox3 + 2] - sdiv[imox3 + 2]);
            vec3.normalize(normal2, normal2);
            var argAngle = 2 * Math.PI / (options.arcDetail * 4);
            var signedAngle = geom.signedAngle(normal, normal2, tangent);
            offset = Math.round(signedAngle / argAngle);
            offset = (offset + options.arcDetail * 4) % (options.arcDetail * 4);
          }
        }
        // figure out if we have to draw an arrow head
        if (arrowEndIndex !== residueIndex && arrowEndIndex < trace.length()) {
          var nextSS = trace.residueAt(arrowEndIndex).ss();
          if (nextSS === 'C' && thisSS === 'E') {
            drawArrow = true;
          }
        }
      }
      // only set normal *after* handling the coil -> helix,strand
      // transition, since we depend on the normal of the previous step.
      vec3.set(normal, normalSdiv[3 * i] - sdiv[ix3],
                normalSdiv[ix3 + 1] - sdiv[ix3 + 1],
                normalSdiv[ix3 + 2] - sdiv[ix3 + 2]);
      vec3.normalize(normal, normal);
      vertStart = vertArray.numVerts();
      var objIndex = Math.floor((i + halfSplineDetail) / options.splineDetail);
      var objId = objIds[Math.min(objIds.length - 1, objIndex)];
      _cartoonAddTube(vertArray, pos, normal, thisSS,
                      tangent, color, radius, false, options, offset, objId);
      if (drawArrow) {
        vertAssoc.addAssoc(traceIndex, vertArray, slice, vertStart, vertEnd);
        // FIXME: arrow has completely wrong normals. Profile normals are 
        // generate perpendicular to the direction of the tube. The arrow 
        // normals are anti-parallel to the direction of the tube.
        _cartoonAddTube(vertArray, pos, normal, 'A', 
                        tangent, color, radius, false, options, 0, objId);
        // We skip a few profiles to get a larger arrow.
        i += options.arrowSkip;
      }
      vertEnd = vertArray.numVerts();
      if (i === e -1) {
        vertEnd += 1;
      }
      vertAssoc.addAssoc(traceIndex, vertArray, slice, vertStart, vertEnd);
      slice += 1;
      if (drawArrow) {
        slice += options.arrowSkip;
      }
    }
    vertArray.addVertex(pos, tangent, color, objIds[objIds.length -1]);
    capTubeEnd(vertArray, vertStart, options.arcDetail * 4);
    options.float32Allocator.release(normals);
    options.float32Allocator.release(positions);
  };
})();


var _renderSingleTrace = (function() {
  var rotation = mat3.create();
  var dir = vec3.create(), left = vec3.create(), up = vec3.create(),
      midPoint = vec3.create(), caPrevPos = vec3.create(),
      caThisPos = vec3.create();
  var colorOne = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
  var colorTwo = vec4.fromValues(0.0, 0.0, 0.0, 1.0);

  return function(meshGeom, vertAssoc, trace, traceIndex, options) {
    if (trace.length() === 0) {
      return;
    }
    var idRange = options.idPool.getContinuousRange(trace.length());
    meshGeom.addIdRange(idRange);
    options.color.colorFor(trace.centralAtomAt(0), colorOne, 0);
    var numVerts = _traceNumVerts([trace], options.protoSphere.numVerts(), 
                                  options.protoCyl.numVerts());
    var va = meshGeom.vertArrayWithSpaceFor(numVerts);
    var vertStart = va.numVerts();
    trace.posAt(caPrevPos, 0);
    var idStart = idRange.nextId({ geom : meshGeom, 
                                   atom : trace.centralAtomAt(0)}), 
        idEnd = 0;
    options.protoSphere.addTransformed(va, caPrevPos, options.radius,
                                       colorOne, idStart);
    var vertEnd = null;
    vertAssoc.addAssoc(traceIndex, va, 0, vertStart, vertEnd);
    var colors = options.float32Allocator.request(trace.length() * 4);
    colors[0] = colorOne[0];
    colors[1] = colorOne[1];
    colors[2] = colorOne[2];
    colors[3] = colorOne[3];
    for (var i = 1; i < trace.length(); ++i) {
      idEnd = idRange.nextId({ geom : meshGeom, atom : trace.centralAtomAt(i)});
      trace.posAt(caPrevPos, i - 1);
      trace.posAt(caThisPos, i);
      options.color.colorFor(trace.centralAtomAt(i), colorTwo, 0);
      colors[i * 4 + 0] = colorTwo[0];
      colors[i * 4 + 1] = colorTwo[1];
      colors[i * 4 + 2] = colorTwo[2];
      colors[i * 4 + 3] = colorTwo[3];

      vec3.sub(dir, caThisPos, caPrevPos);
      var length = vec3.length(dir);

      vec3.scale(dir, dir, 1.0 / length);

      buildRotation(rotation, dir, left, up, false);

      vec3.copy(midPoint, caPrevPos);
      vec3.add(midPoint, midPoint, caThisPos);
      vec3.scale(midPoint, midPoint, 0.5);
      var endSphere = va.numVerts();
      options.protoCyl.addTransformed(va, midPoint, length,
                                      options.radius, rotation, colorOne,
                                      colorTwo, idStart, idEnd);
      vertEnd = va.numVerts();
      vertEnd = vertEnd - (vertEnd - endSphere) / 2;

      options.protoSphere.addTransformed(va, caThisPos, options.radius,
                                         colorTwo, idEnd);
      idStart = idEnd;
      vertAssoc.addAssoc(traceIndex, va, i, vertStart, vertEnd);
      vertStart = vertEnd;
      vec3.copy(colorOne, colorTwo);
    }
    vertAssoc.setPerResidueColors(traceIndex, colors);
    vertAssoc.addAssoc(traceIndex, va, trace.length() - 1, vertStart,
                        va.numVerts());
  };
})();


return exports;
})();

if(typeof(exports) !== 'undefined') {
  module.exports = render;
}

// Copyright (c) 2013-2014 Marco Biasini
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy 
// of this software and associated documentation files (the "Software"), to deal 
// in the Software without restriction, including without limitation the rights 
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
// copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
// SOFTWARE.

(function(exports) {
"use strict";

exports.rgb = {};
var rgb = exports.rgb;

exports.rgb.create = vec4.create;
exports.rgb.scale = vec4.scale;
exports.rgb.copy = vec4.copy;
exports.rgb.fromValues = vec4.fromValues;

exports.rgb.mix = function(out, colorOne, colorTwo, t) {
  var oneMinusT = 1.0 - t;
  out[0] = colorOne[0]*t+colorTwo[0]*oneMinusT;
  out[1] = colorOne[1]*t+colorTwo[1]*oneMinusT;
  out[2] = colorOne[2]*t+colorTwo[2]*oneMinusT;
  out[3] = colorOne[3]*t+colorTwo[3]*oneMinusT;
  return out;
};

var COLORS = {
  white :        rgb.fromValues(1.0,1.0 ,1.0,1.0),
  black :        rgb.fromValues(0.0,0.0 ,0.0,1.0),
  grey :         rgb.fromValues(0.5,0.5 ,0.5,1.0),
  lightgrey :    rgb.fromValues(0.8,0.8 ,0.8,1.0),
  darkgrey :     rgb.fromValues(0.3,0.3 ,0.3,1.0),
  red :          rgb.fromValues(1.0,0.0 ,0.0,1.0),
  darkred :      rgb.fromValues(0.5,0.0 ,0.0,1.0),
  lightred :     rgb.fromValues(1.0,0.5 ,0.5,1.0),
  green :        rgb.fromValues(0.0,1.0 ,0.0,1.0),
  darkgreen :    rgb.fromValues(0.0,0.5 ,0.0,1.0),
  lightgreen :   rgb.fromValues(0.5,1.0 ,0.5,1.0),
  blue :         rgb.fromValues(0.0,0.0 ,1.0,1.0),
  darkblue :     rgb.fromValues(0.0,0.0 ,0.5,1.0),
  lightblue :    rgb.fromValues(0.5,0.5 ,1.0,1.0),
  yellow :       rgb.fromValues(1.0,1.0 ,0.0,1.0),
  darkyellow :   rgb.fromValues(0.5,0.5 ,0.0,1.0),
  lightyellow :  rgb.fromValues(1.0,1.0 ,0.5,1.0),
  cyan :         rgb.fromValues(0.0,1.0 ,1.0,1.0),
  darkcyan :     rgb.fromValues(0.0,0.5 ,0.5,1.0),
  lightcyan :    rgb.fromValues(0.5,1.0 ,1.0,1.0),
  magenta :      rgb.fromValues(1.0,0.0 ,1.0,1.0),
  darkmagenta :  rgb.fromValues(0.5,0.0 ,0.5,1.0),
  lightmagenta : rgb.fromValues(1.0,0.5 ,1.0,1.0),
  orange :       rgb.fromValues(1.0,0.5 ,0.0,1.0),
  darkorange :   rgb.fromValues(0.5,0.25,0.0,1.0),
  lightorange :  rgb.fromValues(1.0,0.75,0.5,1.0)
};

// converts color strings to RGB. for now only supports color names. 
// hex triples will need to be added.
exports.forceRGB = function(color) {
  if (typeof color === 'string') {
    var lookup = COLORS[color];
    if (lookup !== undefined) {
      return lookup;
    }
    if (color.length > 0 && color[0] === '#') {
      var r, g, b, a;
      if (color.length === 4 || color.length === 5 ) {
        r = parseInt(color[1], 16);
        g = parseInt(color[2], 16);
        b = parseInt(color[3], 16);
        a = 15;
        if(color.length===5) {
          a = parseInt(color[4], 16);
        }
        var oneOver15 = 1/15.0;
        return rgb.fromValues(oneOver15 * r, oneOver15 * g, oneOver15 * b, oneOver15 * a);
      }
      if (color.length === 7 || color.length === 9) {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(3, 2), 16);
        b = parseInt(color.substr(5, 2), 16);
        a = 255;
        if(color.length===9) {
          a = parseInt(color.substr(7, 2), 16);
        }
        var oneOver255 = 1/255.0;
        return rgb.fromValues(oneOver255 * r, oneOver255 * g, oneOver255 * b, oneOver255 * a);
      }
    }
  }
  // in case no alpha component is provided, default alpha to 1.0
  if (color.length === 3) {
    return [color[0], color[1], color[2], 1.0];
  }
  return color;
};

function Gradient(colors, stops) {
  this._colors = colors;
  for (var i = 0; i < this._colors.length; ++i) {
    this._colors[i] = exports.forceRGB(this._colors[i]);
  }
  this._stops = stops;
}

Gradient.prototype.colorAt = function(out, value) {
  if (value <= this._stops[0]) {
    return vec4.copy(out, this._colors[0]);
  }
  if (value >= this._stops[this._stops.length-1]) {
    return vec4.copy(out, this._colors[this._stops.length-1]);
  }
  // could use a binary search here, but since most gradients
  // have a really small number of stops, that's not going to
  // help much.
  var lowerIndex = 0;
  for (var i = 0; i < this._stops.length; ++i) {
    if (this._stops[i] > value) {
      break;
    }
    lowerIndex = i;
  }
  var upperIndex = lowerIndex+1;
  var lowerStop = this._stops[lowerIndex];
  var upperStop = this._stops[upperIndex];
  var t = (value - lowerStop)/ (upperStop - lowerStop);
  return rgb.mix(out, this._colors[upperIndex], this._colors[lowerIndex], t);
};
var GRADIENTS = { };
// creates a new gradient from the given set of colors. 
// 
// colors must be a valid list of colors.
//
// when stops is set to 'equal', then the color stops are
// assumed to be equi distant on the interval 0,1. otherwise,
// stops must be  a list of floating point numbers with the 
// same length than colors.
exports.gradient = function(colors, stops) {
  if (typeof colors === 'string') {
    return GRADIENTS[colors];
  }
  stops = stops || 'equal';
  if (stops === 'equal') {
    stops = [];
    for (var i = 0; i < colors.length; ++i) {
      stops.push(i*1.0/(colors.length-1));
    }
  }
  return new Gradient(colors, stops);
};
var gradient = exports.gradient;

GRADIENTS.rainbow =gradient(['red', 'yellow', 'green', 'blue']);
GRADIENTS.reds = gradient(['lightred', 'darkred']);
GRADIENTS.greens = gradient(['lightgreen', 'darkgreen']);
GRADIENTS.blues = gradient(['lightblue', 'darkblue']);
GRADIENTS.trafficlight = gradient(['green', 'yellow', 'red']);
GRADIENTS.heatmap = gradient(['red', 'white', 'blue']);

function ColorOp(colorFunc, beginFunc, endFunc) {
  this.colorFor = colorFunc;
  this._beginFunc = beginFunc;
  this._endFunc = endFunc;
}

ColorOp.prototype.begin = function(obj) {
  if (this._beginFunc) {
    this._beginFunc(obj);
  }
};


ColorOp.prototype.end = function(obj) {
  if (this._endFunc) {
    this._endFunc(obj);
  }
};

exports.color = {};

exports.ColorOp = ColorOp;

exports.color.uniform = function(color) {
  color = exports.forceRGB(color);
  return new ColorOp(function(atom, out, index) {
    out[index+0] = color[0];
    out[index+1] = color[1];
    out[index+2] = color[2];
    out[index+3] = color[3];
  }, null, null);
};

exports.color.byElement = function() {
  return new ColorOp(function(atom, out, index) {
    var ele = atom.element();
    if (ele === 'C') {
      out[index] = 0.8; 
      out[index+1] = 0.8; 
      out[index+2] = 0.8; 
      out[index+3] = 1.0;
      return out;
    }
    if (ele === 'N') {
      out[index] = 0; 
      out[index+1] = 0; 
      out[index+2] = 1;
      out[index+3] = 1.0;
      return out;
    }
    if (ele === 'O') {
      out[index] = 1; 
      out[index+1] = 0; 
      out[index+2] = 0;
      out[index+3] = 1.0;
      return out;
    }
    if (ele === 'S') {
      out[index] = 0.8; 
      out[index+1] = 0.8; 
      out[index+2] = 0;
      out[index+3] = 1.0;
      return out;
    }
    if (ele === 'CA') {
      out[index] = 0.533; 
      out[index+1] = 0.533; 
      out[index+2] = 0.666;
      out[index+3] = 1.0;
      return out;
    }
    out[index] = 1; 
    out[index+1] = 0; 
    out[index+2] = 1;
    out[index+3] = 1.0;
    return out;
  }, null, null);
};

exports.color.bySS = function() {

  return new ColorOp(function(atom, out, index) {
    switch (atom.residue().ss()) {
      case 'C':
        out[index] = 0.8;   out[index+1] = 0.8; 
        out[index+2] = 0.8; out[index+3] = 1.0;
        return;
      case 'H':
        out[index] = 0.6;   out[index+1] = 0.6; 
        out[index+2] = 0.9; out[index+3] = 1.0;
        return;
      case 'E':
        out[index] = 0.2;   out[index+1] = 0.8; 
        out[index+2] = 0.2; out[index+3] = 1.0;
        return;
    }
  }, null, null);
};

exports.color.rainbow = function(grad) {
  if (!grad) {
    grad = gradient('rainbow');
  }
  var colorFunc = new ColorOp(function(a, out, index) {
    var idx = a.residue().index();
    var limits = this.chainLimits[a.residue().chain().name()];
    var t = 0.0;
    if (limits !== undefined) {
      t =  (idx - limits[0])/(limits[1]-limits[0]);
    } 
    var x = [1,1,1,1];
    grad.colorAt(x, t);
    out[index] = x[0];
    out[index+1] = x[1];
    out[index+2] = x[2];
    out[index+3] = x[3];
  }, function(obj) {
    var chains = obj.chains();
    this.chainLimits = {};
    for (var i = 0; i < chains.length; ++i) {
      var bb = chains[i].backboneTraces();
      if (bb.length === 0) {
        continue;
      }
      var minIndex = bb[0].residueAt(0).index(), 
          maxIndex = bb[0].residueAt(bb[0].length()-1).index();
      for (var j = 1; j < bb.length; ++j) {
        var bbj = bb[j];
        minIndex = Math.min(minIndex, bbj.residueAt(0).index());
        maxIndex = Math.max(maxIndex, bbj.residueAt(bbj.length()-1).index());
      }
      this.chainLimits[chains[i].name()] = [minIndex, maxIndex];
    }
  },function(obj) {
    this.chainLimits = null;
  });
  return colorFunc;
};

exports.color.ssSuccession = function(grad, coilColor) {
  if (!grad) {
    grad = gradient('rainbow');
  }
  if (!coilColor) {
    coilColor = forceRGB('lightgrey');
  }
  var colorFunc = new ColorOp(function(a, out, index) {
    var idx = a.residue().index();
    var limits = this.chainLimits[a.residue().chain().name()];
    var ssIndex = limits.indices[idx];
    if (ssIndex === -1) {
      out[index] = coilColor[0];
      out[index+1] = coilColor[1];
      out[index+2] = coilColor[2];
      out[index+3] = coilColor[3];
      return;
    }
    var t = 0.0;
    if (limits.max === null) {
    }
    if (limits.max !== null) {
      t =  ssIndex/(limits.max > 0 ? limits.max : 1);
    } 
    var x = [0,0,0,0];
    grad.colorAt(x, t);
    out[index] = x[0];
    out[index+1] = x[1];
    out[index+2] = x[2];
    out[index+3] = x[3];
  }, function(obj) {
    var chains = obj.chains();
    this.chainLimits = {};
    for (var i = 0; i < chains.length; ++i) {
      var residues = chains[i].residues();
      var maxIndex = null;
      var indices = {};
      var ssIndex = 0;
      var lastSS = 'C';
      for (var j = 0; j < residues.length; ++j) {
        var ss =  residues[j].ss();
        if (ss === 'C') {
          if (lastSS !== 'C') {
            ssIndex++;
          }
          indices[residues[j].index()] = -1;
        } else {
          maxIndex = ssIndex;
          indices[residues[j].index()] = ssIndex;
        }
        lastSS = ss;
      }
      this.chainLimits[chains[i].name()] = {
        indices : indices,
        max: maxIndex
      };
    }
  },function(obj) {
    this.chainLimits = null;
  });
  return colorFunc;
};

exports.color.byChain = function(grad) {
  if (!grad) {
    grad = gradient('rainbow');
  }
  var colorFunc = new ColorOp(function(a, out, index) {
    var idx = a.residue().index();
    var chainIndex = this.chainIndices[a.residue().chain().name()];
    var t =  chainIndex*this.scale;
    var x = [0,0,0,0];
    grad.colorAt(x, t);
    out[index+0] = x[0];
    out[index+1] = x[1];
    out[index+2] = x[2];
    out[index+3] = x[3];
  }, function(obj) {
    var chains = obj.chains();
    this.chainIndices = {};
    for (var i = 0; i < chains.length; ++i) {
      this.chainIndices[chains[i].name()] = i;
    }
    this.scale = chains.length > 1 ? 1.0/(chains.length-1) : 1.0;
  },function(obj) {
    this.chainIndices = null;
  });
  return colorFunc;
};

function getMinMaxRange(obj, iter, propName) {
  var min = null;
  var max = null;
  obj[iter](function(item) {
    var value = item.prop(propName);
    if (min === null && max === null) {
      min = max = value;
      return;
    }
    min = Math.min(min, value);
    max = Math.max(max, value);
  });
  return { min: min, max: max };
}

var gradColor = (function() {
  var color = vec4.create();
  return function(out, index, grad, t) {
    grad.colorAt(color, t);
    out[index+0] = color[0];
    out[index+1] = color[1];
    out[index+2] = color[2];
    out[index+3] = color[3];
  };
})();

function colorByItemProp(propName, grad, range, iter, item) {
  if (!grad) {
    grad = gradient('rainbow');
  }
  return new ColorOp(function(a, out, index) {
      var t = 0.0;
      if (this._min !== this._max) {
        t = (item(a).prop(propName) - this._min)/(this._max - this._min);
      }
      gradColor(out, index, grad, t);
    }, 
    function(obj) {
      if (range !== undefined) {
        this._min = range[0];
        this._max = range[1];
        return;
      }
      range = getMinMaxRange(obj, iter, propName);
      this._min = range.min;
      this._max = range.max;
    }, 
    function(obj) { }
  );
}

exports.color.byAtomProp = function(propName, grad, range) {
  return colorByItemProp(propName, grad, range, 'eachAtom', 
                         function(a) {return a;});
};

exports.color.byResidueProp = function(propName, grad, range) {
  return colorByItemProp(propName, grad, range, 'eachResidue', 
                         function(a) {return a.residue();});
};

// linearly interpolates the array of colors and returns it as a Float32Array
// color must be an array containing a sequence of R,G,B triples.
exports.interpolateColor = function(colors, num) {
  var out = new Float32Array((num*(colors.length/4-1) + 1)*4);
  var index = 0;
  var bf = vec4.create(), af = vec4.create();
  var delta = 1/num;
  for (var i = 0; i < colors.length/4-1; ++i) {
    vec4.set(bf, colors[4*i+0], colors[4*i+1], colors[4*i+2], colors[4*i+3]);
    vec4.set(af, colors[4*i+4], colors[4*i+5], colors[4*i+6], colors[4*i+7]);
    for (var j = 0; j < num; ++j) {
      var t = delta * j;
      out[index+0] = bf[0]*(1-t)+af[0]*t;
      out[index+1] = bf[1]*(1-t)+af[1]*t;
      out[index+2] = bf[2]*(1-t)+af[2]*t;
      out[index+3] = bf[3]*(1-t)+af[3]*t;
      index+=4;
    }
  }
  out[index+0] = af[0];
  out[index+1] = af[1];
  out[index+2] = af[2];
  out[index+3] = af[3];
  return out;
};



return true;
})(this);

// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

(function(exports) {

"use strict";

// A camera, providing us with a view into the 3D worlds. Handles projection,
// and modelview matrices and controls the global render parameters such as
  // shader and fog.
function Cam(gl) {
  this._projection = mat4.create();
  this._camModelView = mat4.create();
    this._modelView = mat4.create();
  this._rotation = mat4.create();
  this._translation = mat4.create();
  this._near = 0.10;
  this._far = 4000.0;
  this._fogNear = -5;
  this._fogFar = 50;
  this._fog = true;
  this._fovY = Math.PI * 45.0 / 180.0;
  this._paramsChanged = false;
  this._fogColor = vec3.fromValues(1, 1, 1);
  this._outlineColor = vec3.fromValues(0.1, 0.1, 0.1);
  this._center = vec3.create();
  this._zoom = 50;
  this._updateMat = true;
  this._gl = gl;
  this._currentShader = null;
  this.setViewportSize(gl.viewportWidth, gl.viewportHeight);
}


Cam.prototype.setRotation = function(rot) {
  if (rot.length === 16) {
    mat4.copy(this._rotation, rot);
  } else {
    this._rotation[0] = rot[0];
    this._rotation[1] = rot[1];
    this._rotation[2] = rot[2];
    this._rotation[3] = 0.0;
    this._rotation[4] = rot[3];
    this._rotation[5] = rot[4];
    this._rotation[6] = rot[5];
    this._rotation[7] = 0.0;
    this._rotation[8] = rot[6];
    this._rotation[9] = rot[7];
    this._rotation[10] = rot[8];
    this._rotation[11] = 0.0;
    this._rotation[12] = 0.0;
    this._rotation[13] = 0.0;
    this._rotation[14] = 0.0;
    this._rotation[15] = 1.0;
  }
  this._updateMat = true;
};

// returns the 3 main axes of the current camera rotation
Cam.prototype.mainAxes = function() {
  return[
    vec3.fromValues(this._rotation[0], this._rotation[4], this._rotation[8]),
    vec3.fromValues(this._rotation[1], this._rotation[5], this._rotation[9]),
    vec3.fromValues(this._rotation[2], this._rotation[6], this._rotation[10])
  ];
};

Cam.prototype.fieldOfViewY = function() {
  return this._fovY;
};

Cam.prototype.aspectRatio = function() {
  return this._width / this._height;
};

Cam.prototype.rotation = function() {
  return this._rotation;
};

Cam.prototype._updateIfRequired = function() {
  if (!this._updateMat) {
    return false;
  }
  mat4.identity(this._camModelView);
  mat4.translate(this._camModelView, this._camModelView,
                  [ -this._center[0], -this._center[1], -this._center[2] ]);
  mat4.mul(this._camModelView, this._rotation, this._camModelView);
  mat4.identity(this._translation);
  mat4.translate(this._translation, this._translation, [ 0, 0, -this._zoom ]);
  mat4.mul(this._camModelView, this._translation, this._camModelView);
  mat4.identity(this._projection);
  mat4.perspective(this._projection, this._fovY, this._width / this._height,
                    this._near, this._far);
  this._updateMat = false;
  return true;
};

Cam.prototype.setViewportSize = function(width, height) {
  this._updateMat = true;
  this._width = width;
  this._height = height;
};

Cam.prototype.setCenter = function(point) {
  this._updateMat = true;
  vec3.copy(this._center, point);
};

Cam.prototype.fog = function(value) {
  if (value !== undefined) {
    this._fog = value;
    this._paramsChanged = true;
  }
  return this._fog;
};

Cam.prototype.rotateZ = (function() {
    var tm = mat4.create();
    return function(delta) {
      mat4.identity(tm);
    this._updateMat = true;
    mat4.rotate(tm, tm, delta, [ 0, 0, 1 ]);
    mat4.mul(this._rotation, tm, this._rotation);
  };
})();

Cam.prototype.rotateX= (function(){
  var tm = mat4.create();
  return function(delta) {
    mat4.identity(tm);
  this._updateMat = true;
  mat4.rotate(tm, tm, delta, [ 1, 0, 0 ]);
  mat4.mul(this._rotation, tm, this._rotation);
  };
})();

Cam.prototype.rotateY = (function() {
  var tm = mat4.create();
  return function(delta) {
    mat4.identity(tm);
  this._updateMat = true;
  mat4.rotate(tm, tm, delta, [ 0, 1, 0 ]);
  mat4.mul(this._rotation, tm, this._rotation);
  };
})();

Cam.prototype.panX = function(delta) {
  return this.panXY(delta, 0);
};

Cam.prototype.panY = function(delta) {
  return this.panXY(0, delta);
};

Cam.prototype.panXY = (function () {
  var invertRotation = mat4.create();
  var newCenter = vec3.create();
  return function(deltaX, deltaY) {
    mat4.transpose(invertRotation, this._rotation);
  this._updateMat = true;
  vec3.set(newCenter, -deltaX, deltaY, 0);
  vec3.transformMat4(newCenter, newCenter, invertRotation);
  vec3.add(newCenter, newCenter, this._center);
  this.setCenter(newCenter);
  };
})();

Cam.prototype.nearOffset = function() { return this._near; };
Cam.prototype.farOffset = function() { return this._far; };


Cam.prototype.setNearFar = function(near, far) {
  if (near === this._near && far === this._far) {
    return;
  }
  this._near = near;
  this._far = far;
  this._updateMat = true;
};

Cam.prototype.setFogNearFar = function(near, far) {
  this._fogNear = near;
  this._fogFar = far;
  this._updateMat = true;
};

Cam.prototype.setZoom = function(zoom) {
  this._updateMat = true;
  this._zoom = zoom;
  return this._zoom;
};

Cam.prototype.zoom = function(delta) {
  if (delta === undefined) {
    return this._zoom;
  }
  this._updateMat = true;
  var factor = 1.0 + delta * 0.1;
  this._zoom = Math.min(1000.0, Math.max(2.0, factor * this._zoom));
  return this._zoom;
};

Cam.prototype.center = function() {
  return this._center;
};

Cam.prototype.currentShader = function() {
  return this._currentShader;
};

// sets all OpenGL parameters to make this camera active.
//
// among other things, it sets the follow uniforms on the shader:
//
// - projectionMat   - the 4x4 projection matrix
// - modelviewMat    - the 4x4 modelview matrix
// - rotationMat     - the rotational part of the modelview matrix
// - fog             - boolean indicating whether fog is enabled
// - fogNear,fogFar  - near and far offset of fog
// - fogColor        - the color of fog
// - outlineColor    - color to be used for the outline shader
Cam.prototype.bind = function(shader, additionalTransform) {
  var shaderChanged = false;
  if (this._currentShader !== shader) {
    this._currentShader = shader;
    this._gl.useProgram(shader);
    shaderChanged = true;
  }
  shaderChanged = this._updateIfRequired() || shaderChanged;

  // in case additionalTransform is given, multiply camera model view
  // with the matrix and use the product as the model view matrix. 
  if (additionalTransform) {
    mat4.mul(this._modelView, this._camModelView, additionalTransform);
    this._gl.uniformMatrix4fv(shader.modelview, false, this._modelView);
  } else {
    this._gl.uniformMatrix4fv(shader.modelview, false, this._camModelView);
  }

  // in case nothing changed, there is no need for us to set any other
  // parameters.
  if (!shaderChanged && !this._paramsChanged) {
    return;
  }
  this._paramsChanged = false;
  this._gl.uniformMatrix4fv(shader.projection, false, this._projection);
  if (shader.rotation) {
    this._gl.uniformMatrix4fv(shader.rotation, false, this._rotation);
  }
  this._gl.uniform1i(shader.fog, this._fog);
  var nearOffset =   this._zoom ;
  this._gl.uniform1f(shader.fogFar, this._fogFar + nearOffset);
  this._gl.uniform1f(shader.fogNear, this._fogNear + nearOffset);
  this._gl.uniform3fv(shader.fogColor, this._fogColor);
  this._gl.uniform3fv(shader.outlineColor, this._outlineColor);
};

exports.Cam = Cam;
})(this);


// Copyright (c) 2013-2014 Marco Biasini
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to 
// deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.

(function(exports) {

"use strict";

exports.shaders = {};

// line fragment shader, essentially uses the vertColor and adds some fog.
exports.shaders.LINES_FS = '\n\
precision highp float;\n\
\n\
varying vec4 vertColor;\n\
varying vec3 vertNormal;\n\
uniform float fogNear;\n\
uniform float fogFar;\n\
uniform vec3 fogColor;\n\
uniform bool fog;\n\
\n\
void main(void) {\n\
  gl_FragColor = vec4(vertColor);\n\
  if (gl_FragColor.a == 0.0) { discard; }\n\
  float depth = gl_FragCoord.z / gl_FragCoord.w;\n\
  if (fog) {\n\
    float fog_factor = smoothstep(fogNear, fogFar, depth);\n\
    gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w),\n\
                        fog_factor);\n\
  }\n\
}';

// hemilight fragment shader
exports.shaders.HEMILIGHT_FS = '\n\
precision highp float;\n\
\n\
varying vec4 vertColor;\n\
varying vec3 vertNormal;\n\
uniform float fogNear;\n\
uniform float fogFar;\n\
uniform vec3 fogColor;\n\
uniform bool fog;\n\
\n\
void main(void) {\n\
  float dp = dot(vertNormal, vec3(0.0, 0.0, 1.0));\n\
  float hemi = max(0.0, dp)*0.5+0.5;\n\
  hemi *= vertColor.a;\n\
  gl_FragColor = vec4(vertColor.rgb*hemi, vertColor.a);\n\
  if (gl_FragColor.a == 0.0) { discard; }\n\
  float depth = gl_FragCoord.z / gl_FragCoord.w;\n\
  if (fog) {\n\
    float fog_factor = smoothstep(fogNear, fogFar, depth);\n\
    gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w),\n\
                        fog_factor);\n\
  }\n\
}';

// hemilight vertex shader
exports.shaders.HEMILIGHT_VS = '\n\
attribute vec3 attrPos;\n\
attribute vec4 attrColor;\n\
attribute vec3 attrNormal;\n\
\n\
uniform mat4 projectionMat;\n\
uniform mat4 modelviewMat;\n\
varying vec4 vertColor;\n\
varying vec3 vertNormal;\n\
void main(void) {\n\
  gl_Position = projectionMat * modelviewMat * vec4(attrPos, 1.0);\n\
  vec4 n = (modelviewMat * vec4(attrNormal, 0.0));\n\
  vertNormal = n.xyz;\n\
  vertColor = attrColor;\n\
}';

// outline shader. mixes outlineColor with fogColor
exports.shaders.OUTLINE_FS = '\n\
precision highp float;\n\
varying float vertAlpha;\n\
\n\
uniform vec3 outlineColor;\n\
uniform float fogNear;\n\
uniform float fogFar;\n\
uniform vec3 fogColor;\n\
uniform bool fog;\n\
\n\
void main() {\n\
  gl_FragColor = vec4(outlineColor, vertAlpha);\n\
  if (gl_FragColor.a == 0.0) { discard; }\n\
  float depth = gl_FragCoord.z / gl_FragCoord.w;\n\
  if (fog) { \n\
    float fog_factor = smoothstep(fogNear, fogFar, depth);\n\
    gl_FragColor = mix(gl_FragColor, vec4(fogColor, vertAlpha),\n\
                        fog_factor);\n\
  }\n\
}';

// outline vertex shader. Expands vertices along the (in-screen) xy
// components of the normals.
exports.shaders.OUTLINE_VS = '\n\
precision highp float;\n\
\n\
attribute vec3 attrPos;\n\
attribute vec3 attrNormal;\n\
attribute vec4 attrColor;\n\
                                                                       \n\
uniform vec3 outlineColor;\n\
uniform mat4 projectionMat;\n\
uniform mat4 modelviewMat;\n\
varying float vertAlpha;\n\
\n\
void main(void) {\n\
  gl_Position = projectionMat * modelviewMat * vec4(attrPos, 1.0);\n\
  vec4 normal = modelviewMat * vec4(attrNormal, 0.0);\n\
  vertAlpha = attrColor.a;\n\
  gl_Position.xy += normal.xy*0.200;\n\
}';

exports.shaders.TEXT_VS = '\n\
precision highp float;\n\
\n\
attribute vec3 attrCenter;\n\
attribute vec2 attrCorner;\n\
uniform mat4 projectionMat;\n\
uniform mat4 modelviewMat;\n\
uniform mat4 rotationMat;\n\
varying vec2 vertTex;\n\
void main() { \n\
  gl_Position = projectionMat* modelviewMat* vec4(attrCenter, 1.0);\n\
  gl_Position.xy += attrCorner*gl_Position.w; \n\
  gl_Position.z -= gl_Position.w*0.0005;\n\
  vertTex = (attrCorner+abs(attrCorner))/(2.0*abs(attrCorner)); \n\
}';

exports.shaders.TEXT_FS = '\n\
precision highp float;\n\
\n\
uniform mat4 projectionMat;\n\
uniform mat4 modelviewMat;\n\
uniform sampler2D sampler;\n\
uniform float xScale;\n\
uniform float yScale;\n\
varying vec2 vertTex;\n\
void main() { \n\
  gl_FragColor = texture2D(sampler, vec2(vertTex.x*xScale, vertTex.y*yScale));\n\
}';

exports.shaders.SELECT_VS = '\n\
precision highp float;\n\
uniform mat4 projectionMat;\n\
uniform mat4 modelviewMat;\n\
attribute vec3 attrPos;\n\
attribute float attrObjId;\n\
\n\
varying float objId;\n\
\n\
void main(void) {\n\
  gl_Position = projectionMat * modelviewMat * vec4(attrPos, 1.0);\n\
  objId = attrObjId;\n\
}';

exports.shaders.SELECT_FS = '\n\
precision highp float;\n\
\n\
varying float objId;\n\
uniform int symId;\n\
\n\
int intMod(int x, int y) { \n\
  int z = x/y;\n\
  return x-y*z;\n\
}\n\
void main(void) {\n\
  // ints are only required to be 7bit...\n\
  int integralObjId = int(objId+0.5);\n\
  int red = intMod(integralObjId, 256);\n\
  integralObjId/=256;\n\
  int green = intMod(integralObjId, 256);\n\
  integralObjId/=256;\n\
  int blue = symId;\n\
  gl_FragColor = vec4(float(red), float(green), float(blue), 255.0)/255.0;\n\
}';
})(this);

// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

(function(exports) {

"use strict";

function FrameBuffer(gl, options) {
  this._width = options.width;
  this._height = options.height;
  this._colorBufferWidth = this._width;
  this._colorBufferHeight = this._height;
  this._gl = gl;
  this._colorHandle = this._gl.createFramebuffer();
  this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._colorHandle);
  this._depthHandle = this._gl.createRenderbuffer();
  this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, this._depthHandle);
  this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16,
                               this._width, this._height);
  this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER,
                                     this._gl.DEPTH_ATTACHMENT,
                                     this._gl.RENDERBUFFER, this._depthHandle);
  this._colorTexture = this._gl.createTexture();
  this._initColorBuffer();
}

FrameBuffer.prototype.width = function() { return this._width; };
FrameBuffer.prototype.height = function() { return this._height; };

FrameBuffer.prototype.bind = function() {
  this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._colorHandle);
  this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, this._depthHandle);
  if (this._colorBufferWidth !== this._width ||
      this._colorBufferHeight !== this._height) {
    this._resizeBuffers();
  }
  this._gl.viewport(0, 0, this._width, this._height);
};

FrameBuffer.prototype._initColorBuffer = function() {
  this.bind();
  var gl = this._gl;
  gl.bindTexture(gl.TEXTURE_2D, this._colorTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, 
                gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                                gl.TEXTURE_2D, this._colorTexture, 0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);

  this.release();
};

FrameBuffer.prototype._resizeBuffers = function() {
  this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, this._depthHandle);
  this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16,
                               this._width, this._height);
  this._gl.bindTexture(this._gl.TEXTURE_2D, this._colorTexture);
  this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._width,
                      this._height, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, 
                      null);
  this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0,
                                this._gl.TEXTURE_2D, this._colorTexture, 0);
  this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER,
                                     this._gl.DEPTH_ATTACHMENT,
                                     this._gl.RENDERBUFFER, this._depthHandle);
  this._gl.bindTexture(this._gl.TEXTURE_2D, null);
  this._colorBufferWidth = this._width;
  this._colorBufferHeight = this._height;
};

FrameBuffer.prototype.resize = function(width, height) {
  this._width = width;
  this._height = height;
};

FrameBuffer.prototype.release = function() {
  this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
  this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, null);
};

exports.FrameBuffer = FrameBuffer;

})(this);


// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

(function(exports) {
"use strict";

function Slab(near, far) {
  this.near = near;
  this.far = far;
}

function FixedSlab(options) {
  options = options || {};
  this._near = options.near || 0.1;
  this._far = options.far || 400.0;
}

FixedSlab.prototype.update = function() {
  return new Slab(this._near, this._far);
};

function AutoSlab(options) {
  this._far = 100.0;
}

AutoSlab.prototype.update = function(objects, cam) {
  var center = cam.center();
  var radius = null;
  for (var i = 0; i < objects.length; ++i) {
    var obj = objects[i];
    if (!obj.visible()) {
      continue;
    }
    radius = obj.updateSquaredSphereRadius(center, radius);
  }
  if (radius === null) {
    return null;
  }
  radius = Math.sqrt(radius);
  var zoom = cam.zoom();
  var newFar = (radius + zoom) * 1.05;
  var newNear = 0.1;//Math.max(0.1, zoom - radius);
  return new Slab(newNear, newFar);
};

exports.FixedSlab = FixedSlab;
exports.AutoSlab = AutoSlab;
exports.Slab = Slab;

})(this);

// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

(function(exports) {
"use strict";

// base for all animations, e.g. position transitions, slerping etc.
function Animation(from, to, duration) {
  this._from = from;
  this._to = to;
  this._duration = duration;
  this._left = duration;
  this._start = Date.now();
  this._looping = false;
  this._finished = false;
}

Animation.prototype.setLooping = function(looping) {
  this._looping = looping;
};

Animation.prototype.step = function() {
  var now = Date.now();
  var elapsed = now - this._start;
  var t;
  if (this._duration === 0) {
    t = 1.0;
  } else {
    if (this._looping) {
      var times = Math.floor(elapsed/this._duration);
      t = (elapsed - times * this._duration)/this._duration;
    } else {
      elapsed = Math.min(this._duration, elapsed);
      t = elapsed/this._duration;
      this._finished = t === 1.0;
    }
  }
  return this._setTo(t);
};

Animation.prototype._setTo = function(t) {
  var smoothInterval = (1 - Math.cos(t * Math.PI ) ) / 2;
  this._current = this._from * (1-smoothInterval) + this._to * smoothInterval;
  return this._current;
};

Animation.prototype.finished = function() {
  return this._finished;
};



function Move(from, to, duration) {
  Animation.prototype.constructor.call(this, vec3.clone(from), 
                                       vec3.clone(to), duration);
  this._current = vec3.clone(from);
}

derive(Move, Animation);

Move.prototype._setTo = function(t) {
  var smoothInterval = (1 - Math.cos(t * Math.PI ) ) / 2;
  vec3.lerp(this._current, this._from, this._to, smoothInterval);
  return this._current;
};

function Rotate(initialRotation, destinationRotation, duration) {
  var initial = mat3.create();
  var to = mat3.create();
  mat3.fromMat4(initial, initialRotation);
  mat3.fromMat4(to, destinationRotation);
  var initialQuat = quat.create();
  var toQuat = quat.create();
  quat.fromMat3(initialQuat, initial);
  quat.fromMat3(toQuat, to);
  this._current = mat3.create();
  Animation.prototype.constructor.call(this, initialQuat, toQuat, duration);
}

derive(Rotate, Animation);

Rotate.prototype._setTo = (function() {
  var quatRot = quat.create();
  
  return function(t) {
    quat.slerp(quatRot, this._from, this._to, t);
    mat3.fromQuat(this._current, quatRot);
    return this._current;
  };
})();

function RockAndRoll(rotation, axis, duration) {
  var initial = mat3.create();
  mat3.fromMat4(initial, rotation);
  Animation.prototype.constructor.call(this, initial, null, duration);
  this._axis = vec3.clone(axis);
  this.setLooping(true);
  this._current = mat3.create();
}

derive(RockAndRoll, Animation);

RockAndRoll.prototype._setTo = (function() {
  var axisRot = mat3.create();
  return function(t) {
    var angle = 0.2 * Math.sin(2 * t * Math.PI);
    geom.axisRotation(axisRot, this._axis, angle);
    mat3.mul(this._current, this._from, axisRot);
    return this._current;
  };
})();

exports.Move = Move;
exports.Rotate = Rotate;
exports.RockAndRoll = RockAndRoll;
exports.Animation = Animation;
return true;
})(this);

(function(exports) {

"use strict";
/**
 * options is optional. It currently handles attributes: highlighting, doubleClickZoom, zoomOnEnter
 */
function Selector(structure, pViewer, geom, options) {
  var that = this;
  this.options = options || {highlighting: 1, doubleClickZoom: 1, zoomOnEnter: 1};
  this.structure = structure;
  this.geom = geom;
  this.pViewer = pViewer;
  this.selectedResidues = [];
  this.existingColors = {};
  this.listeners = [];
  
  if (this.options.highlighting) {
    pViewer.addListener("atomClicked", function (picked, original) {
      that.atomSelected(picked, original);
    });
  }
  
  if (this.options.doubleClickZoom) {
    pViewer.addListener("atomDoubleClicked", function(picked, originalEvent) {
      var transformedPos = vec3.create();
      if (picked === null) {
        pViewer.fitTo(that.structure);
      }
      else {
        var newAtom = picked.object().atom;
        var pos = newAtom.pos();
        if (picked.transform()) {
          vec3.transformMat4(transformedPos, pos, picked.transform());
          pViewer.setCenter(transformedPos, 500);
        } else {
          pViewer.setCenter(pos, 500);
        }
      }
    });
  }
  if (this.options.zoomOnEnter) {
    pViewer.addListener('keypress', function(originalEvent) {
      console.log('keypressed');
      if (originalEvent.keyCode === 13) {
        
        var view = new mol.MolView(that.geom);
        view.addResidues(that.selectedResidues, true);
        pViewer.fitTo(view);
        originalEvent.preventDefault();
      }

    }, true);
  }
}

Selector.prototype.update = function(structure, geom) {
  this.structure = structure;
  this.geom = geom;
  this.selectedResidues = [];
  this.existingColors = {};

};

Selector.prototype.addSelectionListener = function(listener) {
  this.listeners.push(listener);
};

Selector.prototype.fireSelectionChanged = function(view) {
  var that = this;
  this.listeners.forEach(function (listener) {
    listener(that.selectedResidues, that.existingColors, view);
  });
};

Selector.prototype.addResidueSelection = function(selectedResidues) {
  var that = this;
  var view = new mol.MolView(this.geom);
  view.addResidues(selectedResidues, true);
  var changed = false;
  selectedResidues.forEach(function (residue) {
    
    if (typeof that.existingColors[residue.qualifiedName()] === 'undefined') {
      that.selectedResidues.push(residue);
      that.existingColors[residue.qualifiedName()] = rgb.create();
      that.geom.getColorForAtom(residue.atom(0), that.existingColors[residue.qualifiedName()]);
      changed = true;
    }
  });
  that.geom.colorBy(color.uniform('white'), view);
  if (changed) {
    that.fireSelectionChanged(view);
  }

};

var assignColour = function (out, index, colorArray) {
  out[index] = colorArray[0]; 
  out[index+1] = colorArray[1]; 
  out[index+2] = colorArray[2];
  out[index+3] = colorArray[3];
};

Selector.prototype.existingColorScheme = function () {
  var that = this;
  return new ColorOp(function(atom, out, index) {
    var residue = atom.residue();
    
    var color = that.existingColors[residue.qualifiedName()];
    if (color) {
      assignColour(out, index, color);
    }
  }, null, null);

};



Selector.prototype.clearSelection = function(selectedResidues) {
  var that = this;
  var all = false;
  if (typeof selectedResidues === 'undefined') {
    selectedResidues = this.selectedResidues;
    all = true;
  }
  var view = new mol.MolView(this.geom);
  view.addResidues(selectedResidues, true);
  that.geom.colorBy(that.existingColorScheme(), view);
  if (selectedResidues) {
    selectedResidues.forEach(function (residue) {
      delete that.existingColors[residue.qualifiedName()];
      
    });
  }
  if (all) {
    this.selectedResidues = [];
  }
  else {
    this.selectedResidues = this.selectedResidues.filter(function(r) {
      return selectedResidues.indexOf(r) === -1;
    }); 
  }
  that.fireSelectionChanged(view);
};

Selector.prototype.atomSelected = function(picked, originalEvent) {
  if (originalEvent.metaKey || originalEvent.shiftKey) {
    // do not clear selection
  }
  else {
    this.clearSelection();
  }
  if (picked) {
    var newAtom = picked.object().atom;
    var residue = newAtom.residue();
    if (originalEvent.shiftKey && this.lastResiduePicked && this.lastResiduePicked.chain() === residue.chain()) {
      var start = Math.min(this.lastResiduePicked.num(), residue.num());
      var end = Math.max(this.lastResiduePicked.num(), residue.num());
      var residues = residue.chain().residuesInRnumRange(start, end);
      this.addResidueSelection(residues);
    }
    else {
      this.addResidueSelection([residue]);
    }
    this.lastResiduePicked = residue;
    this.pViewer.requestRedraw();
  }
};

exports.Selector = Selector;

})(this);

// Copyright (c) 2013-2014 Marco Biasini
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to 
// deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.

(function(exports) {
"use strict";

function TouchHandler(element, viewer, cam) {
  this._element = element;
  this._element.addEventListener('touchmove', bind(this, this._touchMove));
  this._element.addEventListener('touchstart', bind(this, this._touchStart));
  this._element.addEventListener('touchend', bind(this, this._touchEnd));
  this._element.addEventListener('touchcancel', bind(this, this._touchEnd));
  this._touchState = {
    scale : 1.0,
    rotation : 0.0,
    center : null
  };
  this._lastSingleTap = null;
  this._viewer = viewer;
  this._cam = cam;
}

// calculates the relevant touch/gesture properties based on previous touch 
// state and the new event. It returns the new state with deltaScale, 
// deltaRotation and deltaCenter attached than can be used to control the 
// camera.
TouchHandler.prototype._extractEventAttributes = function(previousState, event) {
  var state = {};
  state.center = getCenter(event.targetTouches);
  state.pointers = [];
  for (var i = 0; i < event.targetTouches.length; ++i) {
    var t = event.targetTouches[i];
    state.pointers.push({ x: t.clientX, y : t.clientY });
  }
  state.numTouches = event.targetTouches.length;
  state.rotation = 0;
  state.scale = 1.0;
  state.deltaScale = 0.0;
  state.deltaRotation = 0.0;

  if (previousState.center) {
    state.deltaCenter = {
      x : state.center.x - previousState.center.x, 
      y : state.center.y - previousState.center.y
    };
  }

  if (previousState.numTouches !== 2 || state.numTouches !== 2) {
    return state;
  }
  if (previousState.initialPointers) {
    state.initialPointers = previousState.initialPointers;
  } else {
    state.initialPointers = previousState.pointers;
  }

  state.scale = getScale(state.initialPointers, state.pointers);
  state.deltaScale = state.scale - previousState.scale;
  state.rotation = getRotationAngle(state.initialPointers, state.pointers);
  state.deltaRotation = state.rotation - previousState.rotation;
  return state;
};


TouchHandler.prototype._touchMove = function(event) {
  event.preventDefault();
  var newState = this._extractEventAttributes(this._touchState, event);
  var deltaScale =  - newState.deltaScale * 4.0;
  if (deltaScale !== 0) {
    this._cam.zoom(deltaScale);
  }
  if (newState.numTouches === 2 && this._touchState.numTouches === 2) {
    // scale pan amount by current zoom value. This increases the camera
    // shift when far away from the image center. 
    this._cam.panXY(newState.deltaCenter.x * 0.001 * this._cam.zoom(),
                    newState.deltaCenter.y * 0.001 * this._cam.zoom());
  }
  var deltaZRotation =  - newState.deltaRotation;
  this._cam.rotateZ(deltaZRotation);
  // FIXME: ideally we would rotate the scene around the touch center.
  // This would feel more natural. Now when the touch center is far
  // away from the project center of the viewer, rotation is a little
  // awkward.
  if (newState.numTouches === 1 && this._touchState.numTouches === 1) {
      this._cam.rotateX(newState.deltaCenter.y * 0.005); 
      this._cam.rotateY(newState.deltaCenter.x * 0.005);
  }
  this._viewer.requestRedraw();
  this._touchState = newState;
};

function getCenter(touches) {
  var centerX = 0, centerY = 0;
  for (var i = 0; i < touches.length; ++i) {
    centerX += touches[i].clientX;
    centerY += touches[i].clientY;
  }
  centerX /= touches.length;
  centerY /= touches.length;
  return { x : centerX, y : centerY };
}

function distance(a, b) {
  var dx = b.x - a.x;
  var dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getScale(prevPointers, newPointers) {
  var prevD = distance(prevPointers[0], prevPointers[1]);
  var newD = distance(newPointers[0], newPointers[1]);
  return newD / (prevD === 0 ? 1 : prevD);
}

function getAngle(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.atan2(dy, dx);
}

function getRotationAngle(prevPointers, newPointers) {
  return getAngle(newPointers[1], newPointers[0]) - 
         getAngle(prevPointers[1], prevPointers[0]);
}


TouchHandler.prototype._touchStart = function(event) {
  event.preventDefault();
  if (event.targetTouches.length === 1) {
    // detect double tap
    var now = new Date().getTime();
    if (this._lastSingleTap !== null) {
      var delta = now - this._lastSingleTap;
      if (delta < 500) {
        this._viewer._mouseDoubleClick({ 
            clientX : event.targetTouches[0].clientX, 
            clientY : event.targetTouches[0].clientY });
      }
    }
    this._lastSingleTap = now;
  } else {
    this._lastSingleTap = null;
  }
  this._touchState = 
    this._extractEventAttributes(this._touchState, event);
};

TouchHandler.prototype._touchEnd = function(event) {
  event.preventDefault();
};

exports.TouchHandler = TouchHandler;
})(this);

// Copyright (c) 2013-2014 Marco Biasini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var pv = (function(){

"use strict";

// FIXME: Browser vendors tend to block quite a few graphic cards. Instead
//   of showing this very generic message, implement a per-browser
//   diagnostic. For example, when we detect that we are running a recent
//   Chrome and Webgl is not available, we should say that the user is
//   supposed to check chrome://gpu for details on why WebGL is not
//   available. Similar troubleshooting pages are available for other
//   browsers.
var WEBGL_NOT_SUPPORTED = '\
<div style="vertical-align:middle; text-align:center;">\
<h1>Oink</h1><p>Your browser does not support WebGL. \
You might want to try Chrome, Firefox, IE 11, or newer versions of Safari\
</p>\
<p>If you are using a recent version of one of the above browsers, your \
graphic card might be blocked. Check the browser documentation for details\
</p>\
</div>';



var requestAnimFrame = (function(){
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         function(callback) {
           window.setTimeout(callback, 1000 / 60);
         };
})();

function slabModeToStrategy(mode, options) {
  mode = mode || 'auto';
  if (mode === 'fixed') {
    return new FixedSlab(options);
  }
  if (mode === 'auto') {
    return new AutoSlab(options);
  }
  return null;
}

function PV(domElement, opts) {
  opts = opts || {};
  this._options = {
    width : (opts.width || 500),
    height : (opts.height || 500),
    animateTime : (opts.animateTime || 0),
    antialias : opts.antialias,
    quality : opts.quality || 'low',
    style : opts.style || 'hemilight',
    background : opts.background ? forceRGB(opts.background) : vec3.fromValues(1,1,1),
    slabMode : slabModeToStrategy(opts.slabMode),
    atomClick: opts.atomClick || null,
    fog : true,
    atomDoubleClick : 'center', // option is handled below
  };
  this._objects = [];
  this._domElement = domElement;
  this._redrawRequested = false;
  this._resize = false;
  this._lastTimestamp = null;
  this.listenerMap = {};
  // NOTE: make sure to only request features supported by all browsers,
  // not only browsers that support WebGL in this constructor. WebGL
  // detection only happens in PV._initGL. Once this happened, we are
  // save to use whatever feature pleases us, e.g. typed arrays, 2D 
  // contexts etc.
  this._canvas = document.createElement('canvas');
  // need to set a tab index to the parent div so that we can programatically set focus.
  // a value of -1 means the user cannot select it, as it can only be set programatically.
  this._domElement.setAttribute('tabindex', -1);
  this._textureCanvas = document.createElement('canvas');
  this._textureCanvas.style.display = 'none';
  this._objectIdManager = new UniqueObjectIdPool();
  var parentRect = domElement.getBoundingClientRect();
  if (this._options.width === 'auto') {
    this._options.width = parentRect.width;
  }
  if (this._options.height === 'auto') {
    this._options.height = parentRect.height;
  }
  if ('outline' in opts) {
    this._options.outline = opts.outline;
  } else {
    this._options.outline = true;
  }
  if ('atomDoubleClicked' in opts) {
    this._options.atomDoubleClick = opts.atomDoubleClick;
  }
  if ('fog' in opts) {
    this._options.fog = opts.fog;
  }
  this._ok = false;
  this._camAnim = { 
      center : null, zoom : null, 
      rotation : null 
  };
  this.quality(this._options.quality);
  this._canvas.width = this._options.width;
  this._canvas.height = this._options.height;
  this._domElement.appendChild(this._canvas);
  this._domElement.appendChild(this._textureCanvas);

  if (document.readyState === "complete" ||  
    document.readyState === "loaded" ||  
      document.readyState === "interactive") {
    this._initPV();
  } else {
    document.addEventListener('DOMContentLoaded', bind(this, this._initPV));
  }
  if (this._options.atomDoubleClick !== null) {
    this.addListener('atomDoubleClicked', this._options.atomDoubleClick);
  }
  if (this._options.atomClick !== null) {
    this.addListener('atomClicked', this._options.atomClick);
  }
}

PV.prototype._centerOnClicked = function(picked, originalEvent) {
  if (picked === null) {
    return;
  }
  var transformedPos = vec3.create();
  var newAtom = picked.object().atom;
  var pos = newAtom.pos();
  if (picked.transform()) {
    vec3.transformMat4(transformedPos, pos, picked.transform());
    this.setCenter(transformedPos, this._options.animateTime);
  } else {
    this.setCenter(pos, this._options.animateTime);
  }
};
  

// resizes the canvas, separated out from PV.resize because we want
// to call this function directly in a requestAnimationFrame together
// with rendering to avoid flickering.
PV.prototype._ensureSize = function() {
  if (!this._resize) {
    return;
  }
  this._resize = false;
  this._options.realWidth = this._options.width * this._options.samples;
  this._options.realHeight = this._options.height * this._options.samples;
  this._gl.viewport(0, 0, this._options.realWidth, this._options._realHeight);
  this._canvas.width = this._options.realWidth;
  this._canvas.height = this._options.realHeight;
  this._cam.setViewportSize(this._options.realWidth, this._options.realHeight);
  if (this._options.samples > 1) {
    this._initManualAntialiasing(this._options.samples);
  }
  this._pickBuffer.resize(this._options.width, this._options.height);
  this._entropyBuffer.resize(this.ENTROPY_BUFFER_WIDTH, this.ENTROPY_BUFFER_HEIGHT);
};

PV.prototype.resize = function(width, height) {
  if (width === this._options.width && height === this._options.height) {
    return;
  }
  this._resize = true;
  this._options.width = width;
  this._options.height = height;
  this.requestRedraw();
};

PV.prototype.fitParent = function() {
  var parentRect = this._domElement.getBoundingClientRect();
  this.resize(parentRect.width, parentRect.height);
};

PV.prototype.gl = function() {
  return this._gl;
};

PV.prototype.ok = function() {
  return this._ok;
};

PV.prototype.options = function(optName, value) {
  if (value !== undefined) {
    if (optName === 'fog') {
      this._cam.fog(value);
      this._options.fog = value;
      this.requestRedraw();
    } else {
      this._options[optName] = value;
    }
    return value;
  }
  return this._options[optName];
};

PV.prototype.quality = function(qual) {
  this._options.quality = qual;
  if (qual === 'high') {
    this._options.arcDetail = 4;
    this._options.sphereDetail = 16;
    this._options.splineDetail = 8;
    return;
  }
  if (qual === 'medium') {
    this._options.arcDetail = 3;
    this._options.sphereDetail = 10;
    this._options.splineDetail = 4;
    return;
  }
  if (qual === 'low') {
    this._options.arcDetail = 2;
    this._options.sphereDetail = 8;
    this._options.splineDetail = 2;
    return;
  }
  console.error('invalid quality argument', qual);
};

// returns the content of the WebGL context as a data URL element which can be
// inserted into an img element. This allows users to save a picture to disk
PV.prototype.imageData = function() {
  return this._canvas.toDataURL();
};

PV.prototype._initContext = function() {
  try {
    var contextOpts = {
      antialias : this._options.antialias,
      preserveDrawingBuffer : true // for image export
    };
    this._gl = this._canvas.getContext('experimental-webgl', contextOpts);
  }
  catch (err) {
    console.error('WebGL not supported', err);
    return false;
  }
  if (!this._gl) {
    console.error('WebGL not supported');
    return false;
  }
  return true;
};

PV.prototype._initManualAntialiasing = function(samples) {
  var scale_factor = 1.0 / samples;
  var trans_x = -(1 - scale_factor) * 0.5 * this._options.realWidth;
  var trans_y = -(1 - scale_factor) * 0.5 * this._options.realHeight;
  var translate = 'translate(' + trans_x + 'px, ' + trans_y + 'px)';
  var scale = 'scale(' + scale_factor + ', ' + scale_factor + ')';
  var transform = translate + ' ' + scale;

  this._canvas.style.webkitTransform = transform;
  this._canvas.style.transform = transform;
  this._canvas.style.ieTransform = transform;
  this._canvas.width = this._options.realWidth;
  this._canvas.height = this._options.realHeight;
};

PV.prototype._initPickBuffer = function() {
  var fbOptions = {
    width : this._options.width, height : this._options.height
  };
  this._pickBuffer = new FrameBuffer(this._gl, fbOptions);
};

PV.prototype.ENTROPY_BUFFER_WIDTH = 512;
PV.prototype.ENTROPY_BUFFER_HEIGHT = 512;

PV.prototype._initEntropyBuffer = function() {
  var fbOptions = {
    width : this.ENTROPY_BUFFER_WIDTH, height : this.ENTROPY_BUFFER_HEIGHT
  };
  this._entropyBuffer = new FrameBuffer(this._gl, fbOptions);
};

PV.prototype._initGL = function() {
  var samples = 1;
  if (!this._initContext()) {
    return false;
  }

  if (!this._gl.getContextAttributes().antialias && this._options.antialias) {
    samples = 2;
  }
  this._options.realWidth = this._options.width * samples;
  this._options.realHeight = this._options.height * samples;
  this._options.samples = samples;
  if (samples > 1) {
    this._initManualAntialiasing(samples);
  }
  this._gl.viewportWidth = this._options.realWidth;
  this._gl.viewportHeight = this._options.realHeight;

  this._gl.clearColor(this._options.background[0], this._options.background[1], this._options.background[2], 1.0);
  this._gl.lineWidth(2.0);
  this._gl.cullFace(this._gl.FRONT);
  this._gl.enable(this._gl.CULL_FACE);
  this._gl.enable(this._gl.DEPTH_TEST);
  this._initPickBuffer();
  this._initEntropyBuffer();
  return true;
};

PV.prototype._shaderFromString = function(shader_code, type) {
  var shader;
  if (type === 'fragment') {
    shader = this._gl.createShader(this._gl.FRAGMENT_SHADER);
  } else if (type === 'vertex') {
    shader = this._gl.createShader(this._gl.VERTEX_SHADER);
  } else {
    console.error('could not determine type for shader');
    return null;
  }
  this._gl.shaderSource(shader, shader_code);
  this._gl.compileShader(shader);
  if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
    console.error(this._gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
};

PV.prototype._initShader = function(vert_shader, frag_shader) {
  var fs = this._shaderFromString(frag_shader, 'fragment');
  var vs = this._shaderFromString(vert_shader, 'vertex');
  var shaderProgram = this._gl.createProgram();
  this._gl.attachShader(shaderProgram, vs);
  this._gl.attachShader(shaderProgram, fs);
  this._gl.linkProgram(shaderProgram);
  if (!this._gl.getProgramParameter(shaderProgram, this._gl.LINK_STATUS)) {
    console.error('could not initialise shaders');
    console.error(this._gl.getShaderInfoLog(shaderProgram));
    return null;
  }
  this._gl.clearColor(this._options.background[0], this._options.background[1], this._options.background[2], 1.0);
  this._gl.enable(this._gl.BLEND);
  this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
  this._gl.enable(this._gl.CULL_FACE);
  this._gl.enable(this._gl.DEPTH_TEST);

  // get vertex attribute location for the shader once to
  // avoid repeated calls to getAttribLocation/getUniformLocation
  var getAttribLoc = bind(this._gl, this._gl.getAttribLocation);
  var getUniformLoc = bind(this._gl, this._gl.getUniformLocation);
  shaderProgram.posAttrib = getAttribLoc(shaderProgram, 'attrPos');
  shaderProgram.colorAttrib = getAttribLoc(shaderProgram, 'attrColor');
  shaderProgram.normalAttrib = getAttribLoc(shaderProgram, 'attrNormal');
  shaderProgram.objIdAttrib = getAttribLoc(shaderProgram, 'attrObjId');
  shaderProgram.symId = getUniformLoc(shaderProgram, 'symId');
  shaderProgram.projection = getUniformLoc(shaderProgram, 'projectionMat');
  shaderProgram.modelview = getUniformLoc(shaderProgram, 'modelviewMat');
  shaderProgram.rotation = getUniformLoc(shaderProgram, 'rotationMat');
  shaderProgram.fog = getUniformLoc(shaderProgram, 'fog');
  shaderProgram.fogFar = getUniformLoc(shaderProgram, 'fogFar');
  shaderProgram.fogNear = getUniformLoc(shaderProgram, 'fogNear');
  shaderProgram.fogColor = getUniformLoc(shaderProgram, 'fogColor');
  shaderProgram.outlineColor = getUniformLoc(shaderProgram, 'outlineColor');

  return shaderProgram;
};

PV.prototype._mouseUp = function(event) {
  this._canvas.removeEventListener('mousemove', this._mouseRotateListener, false);
  this._canvas.removeEventListener('mousemove', this._mousePanListener, false);
  this._canvas.removeEventListener('mouseup', this._mouseUpListener, false);
  document.removeEventListener('mouseup', this._mouseUpListener, false);
  document.removeEventListener('mousemove', this._mouseRotateListener);
  document.removeEventListener('mousemove', this._mousePanListener);
};

PV.prototype._initPV = function() {
  if (!this._initGL()) {
    this._domElement.removeChild(this._canvas);
    this._domElement.innerHTML = WEBGL_NOT_SUPPORTED;
    this._domElement.style.width = this._options.width + 'px';
    this._domElement.style.height = this._options.height + 'px';
    return false;
  }
  this._ok = true;
  this._2dcontext = this._textureCanvas.getContext('2d');
  this._float32Allocator = new PoolAllocator(Float32Array);
  this._uint16Allocator = new PoolAllocator(Uint16Array);
  this._cam = new Cam(this._gl);
  this._cam.fog(this._options.fog);
  this._shaderCatalog = {
    hemilight : this._initShader(shaders.HEMILIGHT_VS, shaders.HEMILIGHT_FS),
    outline : this._initShader(shaders.OUTLINE_VS, shaders.OUTLINE_FS),
    lines : this._initShader(shaders.HEMILIGHT_VS, shaders.LINES_FS),
    text : this._initShader(shaders.TEXT_VS, shaders.TEXT_FS),
    select : this._initShader(shaders.SELECT_VS, shaders.SELECT_FS)
  };

  this._boundDraw = bind(this, this._draw);

  this._mousePanListener = bind(this, this._mousePan);
  this._mouseRotateListener = bind(this, this._mouseRotate);
  this._mouseUpListener = bind(this, this._mouseUp);

  // Firefox responds to the wheel event, whereas other browsers listen to
  // the mousewheel event. Register different event handlers, depending on
  // what properties are available.
  if ('onwheel' in this._canvas) {
  this._canvas.addEventListener('wheel', bind(this, this._mouseWheelFF),
                              false);
  } else {
  this._canvas.addEventListener('mousewheel', bind(this, this._mouseWheel),
                              false);
  }
  this._canvas.addEventListener('dblclick', bind(this, this._mouseDoubleClick),
                            false);
  this._canvas.addEventListener('mousedown', bind(this, this._mouseDown),
                            false);
  this._canvas.addEventListener('click', bind(this, this._click),
                            false);
  this._touchHandler = new TouchHandler(this._canvas, this, this._cam);

  return true;
};

PV.prototype.requestRedraw = function() {
  if (this._redrawRequested) {
    return;
  }
  this._redrawRequested = true;
//  console.log("entropy: " + this.computeEntropy(this._cam.rotation(), {type:'atom'}));
  requestAnimFrame(this._boundDraw);
};

PV.prototype._drawWithPass = function(pass) {
  for (var i = 0, e = this._objects.length; i !== e; ++i) {
    this._objects[i]
        .draw(this._cam, this._shaderCatalog, this._options.style, pass);
  }
};

PV.prototype.setCamera = function(rotation, center, zoom, ms) {
  
  ms |= 0;
  if (ms === 0) {
    this._cam.setCenter(center);
    this._cam.setRotation(rotation);
    this._cam.setZoom(zoom);
    this.requestRedraw();
    return;
  }
  this._camAnim.center = new Move(this._cam.center(), 
                                  vec3.clone(center), ms);
  this._camAnim.rotation = new Rotate(this._cam.rotation(), 
      mat4.clone(rotation), ms);

  this._camAnim.zoom = new Animation(this._cam.zoom(), 
      zoom, ms);
  this.requestRedraw();
};

// performs interpolation of current camera position
PV.prototype._animateCam = function() {
  var anotherRedraw = false;
  if (this._camAnim.center) {
    this._cam.setCenter(this._camAnim.center.step());
    if (this._camAnim.center.finished()) {
      this._camAnim.center = null;
    }
    anotherRedraw = true;
  }
  if (this._camAnim.rotation) {
    this._cam.setRotation(this._camAnim.rotation.step());
    if (this._camAnim.rotation.finished()) {
      this._camAnim.rotation = null;
    }
    anotherRedraw = true;
  }
  if (this._camAnim.zoom) {
    this._cam.setZoom(this._camAnim.zoom.step());
    if (this._camAnim.zoom.finished()) {
      this._camAnim.zoom = null;
    }
    anotherRedraw = true;
  }
  if (anotherRedraw) {
    this.requestRedraw();
  }
};

PV.prototype._draw = function() {
  this._redrawRequested = false;
  this._ensureSize();
  this._animateCam();
  var newSlab = this._options.slabMode.update(this._objects, this._cam);
  if (newSlab !== null) {
    this._cam.setNearFar(newSlab.near, newSlab.far);
  }

  this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
  this._gl.viewport(0, 0, this._options.realWidth, this._options.realHeight);
  this._gl.cullFace(this._gl.FRONT);
  this._gl.enable(this._gl.CULL_FACE);
  this._gl.enable(this._gl.BLEND);
  this._drawWithPass('normal');
  if (!this._options.outline) {
    return;
  }
  this._gl.cullFace(this._gl.BACK);
  this._gl.enable(this._gl.CULL_FACE);
  this._drawWithPass('outline');
};

PV.prototype.setCenter = function(center, ms) {
  ms |= 0;
  if (ms === 0) {
    this._cam.setCenter(center);
    return;
  }
  this._camAnim.center = new Move(this._cam.center(), 
                                  vec3.clone(center), ms);
  this.requestRedraw();
};

PV.prototype.setRotation = function(rotation, ms) {
  ms |= 0;
  if (ms === 0) {
    this._cam.setRotation(rotation);
    return;
  }
  this._camAnim.rotation = new Rotate(this._cam.rotation(), 
      mat4.clone(rotation), ms);
  this.requestRedraw();
};

PV.prototype.centerOn = function(what, ms) {
  this.setCenter(what.center(), ms);
};


PV.prototype.clear = function() {
  for (var i = 0; i < this._objects.length; ++i) {
    this._objects[i].destroy();
  }
  this._objects = [];
};

PV.prototype._mouseWheel = function(event) {
  this._cam.zoom(event.wheelDelta < 0 ? -1 : 1);
  event.preventDefault();
  this.requestRedraw();
};

PV.prototype._mouseWheelFF = function(event) {
  this._cam.zoom(event.deltaY < 0 ? 1 : -1);
  event.preventDefault();
  this.requestRedraw();
};

PV.prototype._mouseDoubleClick = (function() {
  return function(event) {
    var rect = this._canvas.getBoundingClientRect();
    var picked = this.pick(
        { x : event.clientX - rect.left, y : event.clientY - rect.top });
    this._dispatchPickedEvent(event, 'atomDoubleClicked', picked);
    this.requestRedraw();
  };
})();


PV.prototype.addListener = function(eventName, callback) {
  
  if (eventName === 'keypress' || eventName === 'keydown' || eventName === 'keyup') {
    // handle keypress events directly onto the parent domElement
    // mouse downs will make it have focus
    this._domElement.addEventListener(eventName, bind(this, callback),
        false);

  }
  else {
    var callbacks = this.listenerMap[eventName];
    if (typeof callbacks === 'undefined') {
      callbacks = [];
      this.listenerMap[eventName] = callbacks;
    }
    if (callback === 'center') {
      callbacks.push(bind(this, this._centerOnClicked));
    }
    else {
      callbacks.push(callback);
    }
  }
};

PV.prototype._dispatchPickedEvent = function(event, newEventName, picked) {
  var callbacks = this.listenerMap[newEventName];
  if (callbacks) {
    
    callbacks.forEach(function (callback) {
      callback(picked, event);
    });
  }
};

PV.prototype._click = function(event) {
  if (event.button !== 0) {
    return;
  }
  // make sure it isn't a double click
  var currentTime = (new Date()).getTime();
  if (currentTime - this.lastClickTime < 200) {
    
    var rect = this._canvas.getBoundingClientRect();
    var picked = this.pick(
        { x : event.clientX - rect.left, y : event.clientY - rect.top });
    this._dispatchPickedEvent(event, 'atomClicked', picked);
    event.preventDefault();
  } 
};

PV.prototype._mouseDown = function(event) {
  if (event.button !== 0) {
    return;
  }
  this._domElement.focus();
  
  var currentTime = (new Date()).getTime();
  this.lastClickTime = currentTime;
  
//  if (typeof this.lastClickTime === 'undefined' || (currentTime - this.lastClickTime > 300)) {
  event.preventDefault();
  if (event.shiftKey === true) {
    this._canvas.addEventListener('mousemove', this._mousePanListener, false);
    document.addEventListener('mousemove', this._mousePanListener, false);
  } else {
    this._canvas.addEventListener('mousemove', this._mouseRotateListener,
                                  false);
    document.addEventListener('mousemove', this._mouseRotateListener, false);
  }
  this._canvas.addEventListener('mouseup', this._mouseUpListener, false);
  document.addEventListener('mouseup', this._mouseUpListener, false);
  this._lastMousePos = { x : event.pageX, y : event.pageY };
};

PV.prototype._mouseRotate = function(event) {
  var newMousePos = { x : event.pageX, y : event.pageY };
  var delta = {
    x : newMousePos.x - this._lastMousePos.x,
    y : newMousePos.y - this._lastMousePos.y
  };

  var speed = 0.005;
  this._cam.rotateX(speed * delta.y);
  this._cam.rotateY(speed * delta.x);
  this._lastMousePos = newMousePos;
  this.requestRedraw();
};

PV.prototype._mousePan = function(event) {
  var newMousePos = { x : event.pageX, y : event.pageY };
  var delta = {
    x : newMousePos.x - this._lastMousePos.x,
    y : newMousePos.y - this._lastMousePos.y
  };

  var speed = 0.05;
  this._cam.panXY(speed * delta.x, speed * delta.y);
  this._lastMousePos = newMousePos;
  this.requestRedraw();
};

PV.prototype.RENDER_MODES =
    [ 'sline', 'lines', 'trace', 'lineTrace', 'cartoon', 'tube', 'spheres', 'ballsAndSticks' ];

/// simple dispatcher which allows to render using a certain style.
//  will bail out if the render mode does not exist.
PV.prototype.renderAs = function(name, structure, mode, opts) {
  var found = false;
  for (var i = 0; i < this.RENDER_MODES.length; ++i) {
    if (this.RENDER_MODES[i] === mode) {
      found = true;
      break;
    }
  }
  if (!found) {
    console.error('render mode', mode, 'not supported');
    return;
  }
  return this[mode](name, structure, opts);
};


PV.prototype._handleStandardOptions = function(opts) {
  opts = copy(opts);
  opts.float32Allocator = this._float32Allocator;
  opts.uint16Allocator = this._uint16Allocator;
  opts.idPool = this._objectIdManager;
  opts.showRelated = opts.showRelated || 'asym';
  return opts;
};


PV.prototype.lineTrace = function(name, structure, opts) {
  var options = this._handleStandardOptions(opts);
  options.color = options.color || color.uniform([ 1, 0, 1 ]);
  options.lineWidth = options.lineWidth || 4.0;

  var obj = render.lineTrace(structure, this._gl, options);
  return this.add(name, obj);
};

PV.prototype.spheres = function(name, structure, opts) {
  var options = this._handleStandardOptions(opts);
  options.color = options.color || color.byElement();
  options.sphereDetail = this.options('sphereDetail');
  options.radiusMultiplier = options.radiusMultiplier || 1.0;

  var obj = render.spheres(structure, this._gl, options);
  return this.add(name, obj);
};

PV.prototype.sline = function(name, structure, opts) {
  var options = this._handleStandardOptions(opts);
  options.color = options.color || color.uniform([ 1, 0, 1 ]);
  options.splineDetail = options.splineDetail || this.options('splineDetail');
  options.strength = options.strength || 1.0;
  options.lineWidth = options.lineWidth || 4.0;

  var obj = render.sline(structure, this._gl, options);
  return this.add(name, obj);
};

// internal method for debugging the auto-slabbing code. 
// not meant to be used otherwise. Will probably be removed again.
PV.prototype.boundingSpheres = function(gl, obj, options) {
  var vertArrays = obj.vertArrays();
  var mg = new MeshGeom(gl, options.float32Allocator, 
                        options.uint16Allocator);
  mg.order(100);
  var protoSphere = new ProtoSphere(16, 16);
  var vertsPerSphere = protoSphere.numVerts();
  var indicesPerSphere = protoSphere.numIndices();
  var vertAssoc = new AtomVertexAssoc(obj.structure());
  mg.setVertAssoc(vertAssoc);
  mg.addChainVertArray({ name : function() { return "a"; }}, 
                       vertArrays.length * vertsPerSphere,
                       indicesPerSphere * vertArrays.length);
  mg.setShowRelated('asym');
  var color = [0.5, 0.5, 0.5, 0.2];
  var va = mg.vertArrayWithSpaceFor(vertsPerSphere * vertArrays.length);
  for (var i = 0; i < vertArrays.length; ++i) {
    var bs = vertArrays[i].boundingSphere();
    protoSphere.addTransformed(va, bs.center(), bs.radius(), color, 0);
  }
  return mg;
};

PV.prototype.cartoon = function(name, structure, opts) {
  var options = this._handleStandardOptions(opts);
  options.color = options.color || color.bySS();
  options.strength = options.strength || 1.0;
  options.splineDetail = options.splineDetail || this.options('splineDetail');
  options.arcDetail = options.arcDetail || this.options('arcDetail');
  options.radius = options.radius || 0.3;
  options.forceTube = options.forceTube || false;
  var obj = render.cartoon(structure, this._gl, options);
  var added = this.add(name, obj);
  if (options.boundingSpheres) {
    var boundingSpheres = this.boundingSpheres(this._gl, obj, options);
    this.add(name+'.bounds', boundingSpheres);
  }
  return added;
};


PV.prototype.surface = function(name, data, opts) {
  var options = this._handleStandardOptions(opts);
  var obj = render.surface(data, this._gl, options);
  return this.add(name, obj);
};

// renders the protein using a smoothly interpolated tube, essentially
// identical to the cartoon render mode, but without special treatment for
// helices and strands.
PV.prototype.tube = function(name, structure, opts) {
  opts = opts || {};
  opts.forceTube = true;
  return this.cartoon(name, structure, opts);
};

PV.prototype.ballsAndSticks = function(name, structure, opts) {
  var options = this._handleStandardOptions(opts);

  options.color = options.color || color.byElement();
  options.radius = options.radius || 0.3;
  options.arcDetail = (options.arcDetail || this.options('arcDetail')) * 2;
  options.sphereDetail = options.sphereDetail || this.options('sphereDetail');

  var obj = render.ballsAndSticks(structure, this._gl, options);
  return this.add(name, obj);
};

PV.prototype.lines = function(name, structure, opts) {
  var options = this._handleStandardOptions(opts);
  options.color = options.color || color.byElement();
  options.lineWidth = options.lineWidth || 4.0;
  var obj = render.lines(structure, this._gl, options);
  return this.add(name, obj);
};

PV.prototype.trace = function(name, structure, opts) {
  var options = this._handleStandardOptions(opts);
  options.color = options.color || color.uniform([ 1, 0, 0 ]);
  options.radius = options.radius || 0.3;
  options.arcDetail = (options.arcDetail || this.options('arcDetail')) * 2;
  options.sphereDetail = options.sphereDetail || this.options('sphereDetail');

  var obj = render.trace(structure, this._gl, options);
  return this.add(name, obj);
};

PV.prototype.fitTo = function(what, slabMode) {
  var axes = this._cam.mainAxes();
  slabMode = slabMode || this._options.slabMode;
  var intervals = [ new Range(), new Range(), new Range() ];
  if (what instanceof SceneNode) {
    what.updateProjectionIntervals(axes[0], axes[1], axes[2], intervals[0],
                                   intervals[1], intervals[2]);
  } else if (what.eachAtom !== undefined) {
    what.eachAtom(function(atom) {
      var pos = atom.pos();
      for (var i = 0; i < 3; ++i) {
        intervals[i].update(vec3.dot(pos, axes[i]));
      }
    });
    for (var i = 0; i < 3; ++i) {
      intervals[i].extend(1.5);
    }
  }
  this._fitToIntervals(axes, intervals, slabMode);
};

PV.prototype._fitToIntervals = function(axes, intervals) {
  if (intervals[0].empty() || intervals[1].empty() || intervals[2].empty()) {
    console.error('could not determine interval. No objects shown?');
    return;
  }
  var cx = intervals[0].center();
  var cy = intervals[1].center();
  var cz = intervals[2].center();
  var center = [
    cx * axes[0][0] + cy * axes[1][0] + cz * axes[2][0],
    cx * axes[0][1] + cy * axes[1][1] + cz * axes[2][1],
    cx * axes[0][2] + cy * axes[1][2] + cz * axes[2][2]
  ];
  var fovY = this._cam.fieldOfViewY();
  var aspect = this._cam.aspectRatio();
  var inPlaneX = intervals[0].length() / aspect;
  var inPlaneY = intervals[1].length();
  var inPlane = Math.max(inPlaneX, inPlaneY) * 0.5;
  var distanceToFront =  inPlane / Math.tan(0.5 * fovY);
  var newZoom =
      (distanceToFront + 0.5*intervals[2].length());
  var grace = 0.5;
  var near = Math.max(distanceToFront - grace, 0.1);
  var far = 2 * grace + distanceToFront + intervals[2].length();
  this._cam.setNearFar(near,  far);
  this.setCamera(this._cam.rotation(), center, newZoom, this._options.animateTime);
  this.requestRedraw();
};

// adapt the zoom level to fit the viewport to all visible objects.
PV.prototype.autoZoom = function() {
  var axes = this._cam.mainAxes();
  var intervals = [ new Range(), new Range(), new Range() ];
  this.forEach(function(obj) {
    if (!obj.visible()) {
      return;
    }
    obj.updateProjectionIntervals(axes[0], axes[1], axes[2], intervals[0],
                                  intervals[1], intervals[2]);
  });
  this._fitToIntervals(axes, intervals);
};

PV.prototype.slabInterval = function() {
};

PV.prototype.autoSlab = function() {
  var slab = this._options._slabMode.update(this._objects, this._cam);
  if (slab !== null) {
    this._cam.setNearFar(slab.near, slab.far);
  }
  this.requestRedraw();
};

// enable disable rock and rolling of camera
PV.prototype.rockAndRoll = function(enable) {
  if (enable === true) {
    this._camAnim.rotation = new RockAndRoll(this._cam.rotation(), 
                                             [0, 1, 0], 2000);
    this.requestRedraw();
  } else if (enable === false) {
    this._camAnim.rotation = null;
    this.requestRedraw();
  }
  return this._camAnim.rotation !== null;
};

PV.prototype.slabMode = function(mode, options) {
  options = options || {};
  var strategy = slabModeToStrategy(mode, options);
  var slab = strategy.update(this._objects, this._cam);
  if (slab !== null) {
    this._cam.setNearFar(slab.near, slab.far);
  }
  this._options.slabMode = strategy;
  this.requestRedraw();
};

PV.prototype.computeEntropy = function(rotation, weight) {
  weight = weight || function(obj) { return 1; };
  var npix = {};
  var w = this._entropyBuffer.width();
  var h = this._entropyBuffer.height();
  var size = w * h;
  
  this.eachVisibleObject(rotation, function(obj) {
    var index = obj.atom.index();
    if (npix[index] === undefined) {
            npix[index] = 1;
    } else {
            npix[index]++;
    }
  });
  
  var visible = Object.keys(npix).length;
  console.log("number of visible atoms: " + visible);
  var e = 0;
  for (var obj in npix) {
    if (npix.hasOwnProperty(obj)) {
      var tmp = npix[obj]/size;    // > 0 by construction
      e += weight(obj) * tmp * Math.log(tmp) / Math.log(2);
    } 
  }

//  this._cam.setRotation(currentRotation);
  return {entropy: -e, visible: visible};
};

PV.prototype.eachVisibleObject = function(rotation, callback) {
  var w = this._entropyBuffer.width();
  var h = this._entropyBuffer.height();
  var size = w * h;
  var pixels = new Uint8Array(size * 4);
  
  var currentRotation = mat4.clone(this._cam.rotation());
  rotation = rotation || currentRotation;
  this._cam.setRotation(rotation);
  this._entropyBuffer.bind();
  this._drawPickingScene();
  
  this._gl.readPixels(0, 0, this._entropyBuffer.width(), this._entropyBuffer.height(),
      this._gl.RGBA, this._gl.UNSIGNED_BYTE, pixels);
  this._entropyBuffer.release();
  if (pixels.data) {
    pixels = pixels.data;
  }
  
  for (var p = 0; p < size; ++p) {
    var i = p * 4;
    if (pixels[i + 3] === 0) {
      continue;
    }
    var objId = pixels[i] | pixels[i + 1] << 8;
    var symIndex = pixels[i + 2];
    
    var obj = this._objectIdManager.objectForId(objId);
    if (obj !== undefined) {
      var x = Math.floor(p % w);
      var y = Math.floor(p / w);
      callback(obj, x, y);
    }
  }
  
  this._cam.setRotation(currentRotation);
  
};

PV.prototype.label = function(name, text, pos) {
  var label = new TextLabel(this._gl, this._textureCanvas, 
                            this._2dcontext, pos, text);
  this.add(name, label);
  return label;
};

// INTERNAL: draws scene into offscreen pick buffer with the "select"
// shader.
PV.prototype._drawPickingScene = function() {
  this._gl.clearColor(0.0, 0.0, 0.0, 0.0);
  this._gl.disable(this._gl.BLEND);
  this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
  this._gl.clearColor(this._options.background[0], this._options.background[1], this._options.background[2], 1.0);
  this._gl.cullFace(this._gl.FRONT);
  this._gl.enable(this._gl.CULL_FACE);
  this._drawWithPass('select');
};

function PickingResult(obj, symIndex, transform) {
  this._obj = obj;
  this._symIndex = symIndex;
  this._transform = transform;
}

PickingResult.prototype.object = function() { 
  return this._obj; 
};

PickingResult.prototype.symIndex = function() { 
  return this._symIndex; 
};

PickingResult.prototype.transform = function() { 
  return this._transform; 
};

PV.prototype.pick = function(pos) {
  this._pickBuffer.bind();
  this._drawPickingScene();
  var pixels = new Uint8Array(4);
  this._gl.readPixels(pos.x, this._options.height - pos.y, 1, 1,
                      this._gl.RGBA, this._gl.UNSIGNED_BYTE, pixels);
  this._pickBuffer.release();
  if (pixels.data) {
    pixels = pixels.data;
  }
  var pickedIds = {};
  if (pixels[3] === 0) {
    return null;
  }
  var objId = pixels[0] | pixels[1] << 8;
  var symIndex = pixels[2];

  var obj = this._objectIdManager.objectForId(objId);
  if (obj === undefined) {
    return null;
  }
  var transform = null;
  if (symIndex !== 255) {
    transform = obj.geom.symWithIndex(symIndex);
  }
  return new PickingResult(obj, symIndex < 255 ? symIndex : null,
                           transform);
};

PV.prototype.add = function(name, obj) {
  obj.name(name);
  this._objects.push(obj);
  this._objects.sort(function(lhs, rhs) { return lhs.order() - rhs.order(); });
  this.requestRedraw();
  return obj;
};

PV.prototype._globToRegex = function(glob) {
  var r = glob.replace('.', '\\.').replace('*', '.*');
  return new RegExp('^' + r + '$');
};

PV.prototype.forEach = function() {
  var callback, pattern = '*';
  if (arguments.length === 2) {
    callback = arguments[1];
    pattern = arguments[0];
  } else {
    callback = arguments[0];
  }
  var regex = this._globToRegex(pattern);
  for (var i = 0; i < this._objects.length; ++i) {
    var obj = this._objects[i];
    if (regex.test(obj.name())) {
      callback(obj, i);
    }
  }
};

PV.prototype.get = function(name) {
  for (var i = 0; i < this._objects.length; ++i) {
    if (this._objects[i].name() === name) {
      return this._objects[i];
    }
  }
  console.error('could not find object with name', name);
  return null;
};

PV.prototype.hide = function(glob) {
  this.forEach(glob, function(obj) { obj.hide(); });
};

PV.prototype.show = function(glob) {
  this.forEach(glob, function(obj) { obj.show(); });
};

// remove all objects whose names match the provided glob pattern from
// the viewer.
PV.prototype.rm = function(glob) {
  var newObjects = [];
  var regex = this._globToRegex(glob);
  for (var i = 0; i < this._objects.length; ++i) {
    var obj = this._objects[i];
    if (!regex.test(obj.name())) {
      newObjects.push(obj);
    } else {
      obj.destroy();
    }
  }
  this._objects = newObjects;
};

PV.prototype.all = function() {
  return this._objects;
};


return { Viewer : function(elem, options) { return new PV(elem, options);
}
}
;
})();

if(typeof(exports) !== 'undefined') {
    module.exports = pv;
}
