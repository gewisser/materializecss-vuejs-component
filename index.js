
export function implodeObj(array, idsName, conditionKey, conditionVal) {
    var ret = '';

    if (!Array.isArray(array))
        return ret;

    array.forEach(function(item, i, arr) {
        if (item[conditionKey] == conditionVal) {
            if (ret !== '')
                ret += ',';

            ret+=item[idsName]
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
