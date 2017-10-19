/**
 * Returns a string from the 'idsName' keys separated by a comma with the value of the key 'conditionKey' equals 'conditionVal'
 * @param array
 * @param idsName
 * @param conditionKey
 * @param conditionVal
 * @returns {string}
 */
export function implodeObj(array, idsName, conditionKey, conditionVal) {
    var ret = '';

    if (!Array.isArray(array))
        return ret;

    array.forEach(function(item, i, arr) {
        if (item[conditionKey] !== undefined && item[conditionKey] == conditionVal) {
            if (ret !== '')
                ret += ',';

            ret+=item[idsName]
        }
    });

    return ret;
}

/**
 * Returns an array of objects if the object key in the source array 'conditionKey' is equal to 'conditionVal'.
 * The 'conditionKey' key is removed.
 * The original object does not change.
 *
 * @param array
 * @param conditionKey
 * @param conditionVal
 * @param otionalDeleteKey {Array}
 * @returns {Array}
 */

export function getArrayIf(array, conditionKey, conditionVal, otionalDeleteKey) {
    var ret = [];

    if (!Array.isArray(array))
        return ret;

    array.forEach(function(item, i, arr) {
        if (item[conditionKey] !== undefined && item[conditionKey] == conditionVal) {
            var ck = {};
            Object.assign(ck, item);
            delete ck[conditionKey];

            if (otionalDeleteKey != undefined && Array.isArray(otionalDeleteKey)) {
                otionalDeleteKey.forEach(function(item) {
                    delete ck[item];
                })
            }

            ret.push(ck)
        }
    });

    return ret;
}

/**
 * Checks whether the target belongs to an element with a class or id 'parent'
 * import {hasParent} from 'materializecss-vuejs-component'
 * @param stop - The parent class or id beyond which you can not go up
 * @param parent - Seeking parent
 * @param target - The purpose of the desired parent
 * @returns {boolean}
 */

export function hasParent(stop, parent, target) {
    var ret = false;
    var cur_parent = target.target;

    while ( cur_parent !== undefined && ((cur_parent.classList !== undefined && !cur_parent.classList.contains(stop)) || cur_parent.id != stop)) {
        if ((cur_parent.classList !== undefined && cur_parent.classList.contains(parent)) || cur_parent.id == parent) {
            ret = true;
            break;
        } else cur_parent = cur_parent.parentNode;
    }

    return ret;
}

var typeOf = require('kind-of');
var rename = require('rename-keys');

/**
 * Iterates over an array of objects or an object and allows you to rename the name of the object key.
 * For nested arrays with objects, use 'deep-rename-keys' ( npm install --save deep-rename-keys )
 * @param obj - array or object necessary for the transformation
 * @param cbk - callback function where you can change the name of the object key or array
 * @param cbitem - callback function where you can change an array element
 * @returns {Array, Object}
 */

export function renameKeys(obj, cbk, cbitem) {
    var type = typeOf(obj);

    if (type !== 'object' && type !== 'array') {
        throw new Error('expected an object');
    }

    if (type === 'object') {
        return rename(obj, cbk);
    }

    var res = [];

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var val = obj[key];

            if (typeOf(cbitem) === 'function')
                cbitem(val);

            if (typeOf(val) === 'object') {
                res[key] = rename(val, cbk);
            } else {
                res[key] = val;
            }
        }
    }
    return res;
}




/**
 * Plugin Vuejs for moving some components of material design into an external block. For example, Dropdown - drop-down list block
 * This plug-in must necessarily be connected to the project!!
 *
 * import {callout} from 'materializecss-vuejs-component';
 * Vue.use(callout);
 *
 * @type {{install: callout.install}}
 */

export var callout = {
    install: function (Vue, options) {
        Vue.directive('callout', {
            inserted: function (el, binding, vnode, oldVnode) {
                var bc = 'materializecss-callout';

                var mc = document.getElementById(bc);

                if (mc == undefined) {
                    mc = document.createElement('div');
                    mc.id = bc;

                    document.body.appendChild(mc);
                }

                mc.insertBefore(el.firstChild, mc.firstChild);
            }
        })
    }
};
