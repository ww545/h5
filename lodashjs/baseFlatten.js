const toString = Object.prototype.toString
function getTag(value) {
	if (value == null) {
		return value === undefined ? '[object Undefined]' : '[object Null]'
	}
	return toString.call(value)
}

function isObjectLike(value) {
	return typeof value === 'object' && value !== null
}

function isArguments(value) {
	return isObjectLike(value) && getTag(value) == '[object Arguments]'
}

const spreadableSymbol = Symbol.isConcatSpreadable
function isFlattenable(value) {
	return Array.isArray(value) || isArguments(value) ||
		!!(value && value[spreadableSymbol])
}

function baseFlatten(array, depth, predicate, isStrict, result) {
	predicate || (predicate = isFlattenable)
	result || (result = [])

	if (array == null) {
		return result
	}

	for (const value of array) {
		if (depth > 0 && predicate(value)) {
			if (depth > 1) {
				// Recursively flatten arrays (susceptible to call stack limits).
				baseFlatten(value, depth - 1, predicate, isStrict, result)
			} else {
				result.push(...value)
			}
		} else if (!isStrict) {
			result[result.length] = value
		}
	}
	return result
}
