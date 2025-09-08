(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		$elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}


var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $author$project$Model$gdpCsvUrl = '/data/world_data_2023.csv';
var $author$project$Model$olympiaCsvUrl = '/data/olympics_dataset.csv';
var $author$project$Model$populationCsvUrl = '/data/world_population_data.csv';
var $author$project$Model$GdpReceived = function (a) {
	return {$: 'GdpReceived', a: a};
};
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var $elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var $elm$http$Http$Timeout_ = {$: 'Timeout_'};
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $elm$http$Http$NetworkError = {$: 'NetworkError'};
var $elm$http$Http$Timeout = {$: 'Timeout'};
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 'BadUrl_':
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 'Timeout_':
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 'NetworkError_':
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 'BadStatus_':
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.statusCode));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectString = function (toMsg) {
	return A2(
		$elm$http$Http$expectStringResponse,
		toMsg,
		$elm$http$Http$resolve($elm$core$Result$Ok));
};
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.tracker;
							if (_v4.$ === 'Nothing') {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{body: $elm$http$Http$emptyBody, expect: r.expect, headers: _List_Nil, method: 'GET', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $author$project$Model$requestGdpCsv = function (url) {
	return $elm$http$Http$get(
		{
			expect: $elm$http$Http$expectString($author$project$Model$GdpReceived),
			url: url
		});
};
var $author$project$Model$OlympiaReceived = function (a) {
	return {$: 'OlympiaReceived', a: a};
};
var $author$project$Model$requestOlympiaCsv = function (url) {
	return $elm$http$Http$get(
		{
			expect: $elm$http$Http$expectString($author$project$Model$OlympiaReceived),
			url: url
		});
};
var $author$project$Model$PopulationReceived = function (a) {
	return {$: 'PopulationReceived', a: a};
};
var $author$project$Model$requestPopulationCsv = function (url) {
	return $elm$http$Http$get(
		{
			expect: $elm$http$Http$expectString($author$project$Model$PopulationReceived),
			url: url
		});
};
var $author$project$Model$init = _Utils_Tuple2(
	{
		axisOrder: _List_fromArray(
			['medals', 'pop', 'gdp', 'age']),
		draggingAxis: $elm$core$Maybe$Nothing,
		dropTargetAxis: $elm$core$Maybe$Nothing,
		error: $elm$core$Maybe$Nothing,
		gdpByCountry: $elm$core$Dict$empty,
		heatmapmodel: {columnLabels: _List_Nil, data: _List_Nil, rowLabels: _List_Nil, selected: $elm$core$Maybe$Nothing},
		hoverTable: $elm$core$Maybe$Nothing,
		loading: true,
		medalTable: _List_Nil,
		participations: _List_Nil,
		pcHover: $elm$core$Maybe$Nothing,
		pcmodel: {axes: _List_Nil, hovered: $elm$core$Maybe$Nothing, ranking: false, series: _List_Nil},
		populationByCountry: $elm$core$Dict$empty,
		ranking: true,
		sbcountry: '',
		sbmodel: {hovered: $elm$core$Maybe$Nothing, layout: _List_Nil, total: 0},
		showPcDebug: false,
		tableCriterion: 'medals',
		useRelative: false
	},
	$elm$core$Platform$Cmd$batch(
		_List_fromArray(
			[
				$author$project$Model$requestOlympiaCsv($author$project$Model$olympiaCsvUrl),
				$author$project$Model$requestPopulationCsv($author$project$Model$populationCsvUrl),
				$author$project$Model$requestGdpCsv($author$project$Model$gdpCsvUrl)
			])));
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $BrianHicks$elm_csv$Csv$Decode$FieldNamesFromFirstRow = {$: 'FieldNamesFromFirstRow'};
var $BrianHicks$elm_csv$Csv$Decode$ParsingError = function (a) {
	return {$: 'ParsingError', a: a};
};
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (result.$ === 'Ok') {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $BrianHicks$elm_csv$Csv$Decode$DecodingErrors = function (a) {
	return {$: 'DecodingErrors', a: a};
};
var $BrianHicks$elm_csv$Csv$Decode$OnlyColumn_ = {$: 'OnlyColumn_'};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $BrianHicks$elm_csv$Csv$Decode$NoFieldNamesOnFirstRow = {$: 'NoFieldNamesOnFirstRow'};
var $elm$core$String$trim = _String_trim;
var $BrianHicks$elm_csv$Csv$Decode$getFieldNames = F2(
	function (headers, rows) {
		var fromList = function (names) {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (name, _v2) {
						var soFar = _v2.a;
						var i = _v2.b;
						return _Utils_Tuple2(
							A3($elm$core$Dict$insert, name, i, soFar),
							i + 1);
					}),
				_Utils_Tuple2($elm$core$Dict$empty, 0),
				names).a;
		};
		switch (headers.$) {
			case 'NoFieldNames':
				return $elm$core$Result$Ok(
					_Utils_Tuple3(
						{available: false, names: $elm$core$Dict$empty},
						0,
						rows));
			case 'CustomFieldNames':
				var names = headers.a;
				return $elm$core$Result$Ok(
					_Utils_Tuple3(
						{
							available: true,
							names: fromList(names)
						},
						0,
						rows));
			default:
				if (!rows.b) {
					return $elm$core$Result$Err($BrianHicks$elm_csv$Csv$Decode$NoFieldNamesOnFirstRow);
				} else {
					var first = rows.a;
					var rest = rows.b;
					return $elm$core$Result$Ok(
						_Utils_Tuple3(
							{
								available: true,
								names: fromList(
									A2($elm$core$List$map, $elm$core$String$trim, first))
							},
							1,
							rest));
				}
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $BrianHicks$elm_csv$Csv$Decode$applyDecoder = F3(
	function (fieldNames, _v0, allRows) {
		var decode = _v0.a;
		var defaultLocation = $BrianHicks$elm_csv$Csv$Decode$OnlyColumn_;
		return A2(
			$elm$core$Result$andThen,
			function (_v1) {
				var resolvedNames = _v1.a;
				var firstRowNumber = _v1.b;
				var rows = _v1.c;
				return A2(
					$elm$core$Result$mapError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $BrianHicks$elm_csv$Csv$Decode$DecodingErrors, $elm$core$List$concat),
						$elm$core$List$reverse),
					A2(
						$elm$core$Result$map,
						$elm$core$List$reverse,
						A3(
							$elm$core$List$foldl,
							F2(
								function (row, _v2) {
									var soFar = _v2.a;
									var rowNum = _v2.b;
									return _Utils_Tuple2(
										function () {
											var _v3 = A4(decode, defaultLocation, resolvedNames, rowNum, row);
											if (_v3.$ === 'Ok') {
												var val = _v3.a;
												if (soFar.$ === 'Ok') {
													var values = soFar.a;
													return $elm$core$Result$Ok(
														A2($elm$core$List$cons, val, values));
												} else {
													var errs = soFar.a;
													return $elm$core$Result$Err(errs);
												}
											} else {
												var err = _v3.a;
												if (soFar.$ === 'Ok') {
													return $elm$core$Result$Err(
														_List_fromArray(
															[err]));
												} else {
													var errs = soFar.a;
													return $elm$core$Result$Err(
														A2($elm$core$List$cons, err, errs));
												}
											}
										}(),
										rowNum + 1);
								}),
							_Utils_Tuple2(
								$elm$core$Result$Ok(_List_Nil),
								firstRowNumber),
							rows).a));
			},
			A2($BrianHicks$elm_csv$Csv$Decode$getFieldNames, fieldNames, allRows));
	});
var $BrianHicks$elm_csv$Csv$Parser$AdditionalCharactersAfterClosingQuote = function (a) {
	return {$: 'AdditionalCharactersAfterClosingQuote', a: a};
};
var $BrianHicks$elm_csv$Csv$Parser$SourceEndedWithoutClosingQuote = function (a) {
	return {$: 'SourceEndedWithoutClosingQuote', a: a};
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Basics$ge = _Utils_ge;
var $BrianHicks$elm_csv$Csv$Parser$parse = F2(
	function (config, source) {
		var finalLength = $elm$core$String$length(source);
		var parseQuotedField = F4(
			function (isFieldSeparator, soFar, startOffset, endOffset) {
				parseQuotedField:
				while (true) {
					if ((endOffset - finalLength) >= 0) {
						return $elm$core$Result$Err($BrianHicks$elm_csv$Csv$Parser$SourceEndedWithoutClosingQuote);
					} else {
						if (A3($elm$core$String$slice, endOffset, endOffset + 1, source) === '\"') {
							var segment = A3($elm$core$String$slice, startOffset, endOffset, source);
							if (((endOffset + 1) - finalLength) >= 0) {
								return $elm$core$Result$Ok(
									_Utils_Tuple3(
										_Utils_ap(soFar, segment),
										endOffset + 1,
										false));
							} else {
								var next = A3($elm$core$String$slice, endOffset + 1, endOffset + 2, source);
								if (next === '\"') {
									var newPos = endOffset + 2;
									var $temp$isFieldSeparator = isFieldSeparator,
										$temp$soFar = soFar + (segment + '\"'),
										$temp$startOffset = newPos,
										$temp$endOffset = newPos;
									isFieldSeparator = $temp$isFieldSeparator;
									soFar = $temp$soFar;
									startOffset = $temp$startOffset;
									endOffset = $temp$endOffset;
									continue parseQuotedField;
								} else {
									if (isFieldSeparator(next)) {
										return $elm$core$Result$Ok(
											_Utils_Tuple3(
												_Utils_ap(soFar, segment),
												endOffset + 2,
												false));
									} else {
										if (next === '\n') {
											return $elm$core$Result$Ok(
												_Utils_Tuple3(
													_Utils_ap(soFar, segment),
													endOffset + 2,
													true));
										} else {
											if ((next === '\u000D') && (A3($elm$core$String$slice, endOffset + 2, endOffset + 3, source) === '\n')) {
												return $elm$core$Result$Ok(
													_Utils_Tuple3(
														_Utils_ap(soFar, segment),
														endOffset + 3,
														true));
											} else {
												return $elm$core$Result$Err($BrianHicks$elm_csv$Csv$Parser$AdditionalCharactersAfterClosingQuote);
											}
										}
									}
								}
							}
						} else {
							var $temp$isFieldSeparator = isFieldSeparator,
								$temp$soFar = soFar,
								$temp$startOffset = startOffset,
								$temp$endOffset = endOffset + 1;
							isFieldSeparator = $temp$isFieldSeparator;
							soFar = $temp$soFar;
							startOffset = $temp$startOffset;
							endOffset = $temp$endOffset;
							continue parseQuotedField;
						}
					}
				}
			});
		var parseComma = F4(
			function (row, rows, startOffset, endOffset) {
				parseComma:
				while (true) {
					if ((endOffset - finalLength) >= 0) {
						var finalField = A3($elm$core$String$slice, startOffset, endOffset, source);
						return ((finalField === '') && _Utils_eq(row, _List_Nil)) ? $elm$core$Result$Ok(
							$elm$core$List$reverse(rows)) : $elm$core$Result$Ok(
							$elm$core$List$reverse(
								A2(
									$elm$core$List$cons,
									$elm$core$List$reverse(
										A2($elm$core$List$cons, finalField, row)),
									rows)));
					} else {
						var first = A3($elm$core$String$slice, endOffset, endOffset + 1, source);
						if (first === ',') {
							var newPos = endOffset + 1;
							var $temp$row = A2(
								$elm$core$List$cons,
								A3($elm$core$String$slice, startOffset, endOffset, source),
								row),
								$temp$rows = rows,
								$temp$startOffset = newPos,
								$temp$endOffset = newPos;
							row = $temp$row;
							rows = $temp$rows;
							startOffset = $temp$startOffset;
							endOffset = $temp$endOffset;
							continue parseComma;
						} else {
							if (first === '\n') {
								var newPos = endOffset + 1;
								var $temp$row = _List_Nil,
									$temp$rows = A2(
									$elm$core$List$cons,
									$elm$core$List$reverse(
										A2(
											$elm$core$List$cons,
											A3($elm$core$String$slice, startOffset, endOffset, source),
											row)),
									rows),
									$temp$startOffset = newPos,
									$temp$endOffset = newPos;
								row = $temp$row;
								rows = $temp$rows;
								startOffset = $temp$startOffset;
								endOffset = $temp$endOffset;
								continue parseComma;
							} else {
								if ((first === '\u000D') && (A3($elm$core$String$slice, endOffset + 1, endOffset + 2, source) === '\n')) {
									var newPos = endOffset + 2;
									var $temp$row = _List_Nil,
										$temp$rows = A2(
										$elm$core$List$cons,
										$elm$core$List$reverse(
											A2(
												$elm$core$List$cons,
												A3($elm$core$String$slice, startOffset, endOffset, source),
												row)),
										rows),
										$temp$startOffset = newPos,
										$temp$endOffset = newPos;
									row = $temp$row;
									rows = $temp$rows;
									startOffset = $temp$startOffset;
									endOffset = $temp$endOffset;
									continue parseComma;
								} else {
									if (first === '\"') {
										var newPos = endOffset + 1;
										var _v0 = A4(
											parseQuotedField,
											function (c) {
												return c === ',';
											},
											'',
											newPos,
											newPos);
										if (_v0.$ === 'Ok') {
											var _v1 = _v0.a;
											var value = _v1.a;
											var afterQuotedField = _v1.b;
											var rowEnded = _v1.c;
											if (_Utils_cmp(afterQuotedField, finalLength) > -1) {
												return $elm$core$Result$Ok(
													$elm$core$List$reverse(
														A2(
															$elm$core$List$cons,
															$elm$core$List$reverse(
																A2($elm$core$List$cons, value, row)),
															rows)));
											} else {
												if (rowEnded) {
													var $temp$row = _List_Nil,
														$temp$rows = A2(
														$elm$core$List$cons,
														$elm$core$List$reverse(
															A2($elm$core$List$cons, value, row)),
														rows),
														$temp$startOffset = afterQuotedField,
														$temp$endOffset = afterQuotedField;
													row = $temp$row;
													rows = $temp$rows;
													startOffset = $temp$startOffset;
													endOffset = $temp$endOffset;
													continue parseComma;
												} else {
													var $temp$row = A2($elm$core$List$cons, value, row),
														$temp$rows = rows,
														$temp$startOffset = afterQuotedField,
														$temp$endOffset = afterQuotedField;
													row = $temp$row;
													rows = $temp$rows;
													startOffset = $temp$startOffset;
													endOffset = $temp$endOffset;
													continue parseComma;
												}
											}
										} else {
											var problem = _v0.a;
											return $elm$core$Result$Err(
												problem(
													$elm$core$List$length(rows) + 1));
										}
									} else {
										var $temp$row = row,
											$temp$rows = rows,
											$temp$startOffset = startOffset,
											$temp$endOffset = endOffset + 1;
										row = $temp$row;
										rows = $temp$rows;
										startOffset = $temp$startOffset;
										endOffset = $temp$endOffset;
										continue parseComma;
									}
								}
							}
						}
					}
				}
			});
		var parseHelp = F5(
			function (isFieldSeparator, row, rows, startOffset, endOffset) {
				parseHelp:
				while (true) {
					if ((endOffset - finalLength) >= 0) {
						var finalField = A3($elm$core$String$slice, startOffset, endOffset, source);
						return ((finalField === '') && _Utils_eq(row, _List_Nil)) ? $elm$core$Result$Ok(
							$elm$core$List$reverse(rows)) : $elm$core$Result$Ok(
							$elm$core$List$reverse(
								A2(
									$elm$core$List$cons,
									$elm$core$List$reverse(
										A2($elm$core$List$cons, finalField, row)),
									rows)));
					} else {
						var first = A3($elm$core$String$slice, endOffset, endOffset + 1, source);
						if (isFieldSeparator(first)) {
							var newPos = endOffset + 1;
							var $temp$isFieldSeparator = isFieldSeparator,
								$temp$row = A2(
								$elm$core$List$cons,
								A3($elm$core$String$slice, startOffset, endOffset, source),
								row),
								$temp$rows = rows,
								$temp$startOffset = newPos,
								$temp$endOffset = newPos;
							isFieldSeparator = $temp$isFieldSeparator;
							row = $temp$row;
							rows = $temp$rows;
							startOffset = $temp$startOffset;
							endOffset = $temp$endOffset;
							continue parseHelp;
						} else {
							if (first === '\n') {
								var newPos = endOffset + 1;
								var $temp$isFieldSeparator = isFieldSeparator,
									$temp$row = _List_Nil,
									$temp$rows = A2(
									$elm$core$List$cons,
									$elm$core$List$reverse(
										A2(
											$elm$core$List$cons,
											A3($elm$core$String$slice, startOffset, endOffset, source),
											row)),
									rows),
									$temp$startOffset = newPos,
									$temp$endOffset = newPos;
								isFieldSeparator = $temp$isFieldSeparator;
								row = $temp$row;
								rows = $temp$rows;
								startOffset = $temp$startOffset;
								endOffset = $temp$endOffset;
								continue parseHelp;
							} else {
								if ((first === '\u000D') && (A3($elm$core$String$slice, endOffset + 1, endOffset + 2, source) === '\n')) {
									var newPos = endOffset + 2;
									var $temp$isFieldSeparator = isFieldSeparator,
										$temp$row = _List_Nil,
										$temp$rows = A2(
										$elm$core$List$cons,
										$elm$core$List$reverse(
											A2(
												$elm$core$List$cons,
												A3($elm$core$String$slice, startOffset, endOffset, source),
												row)),
										rows),
										$temp$startOffset = newPos,
										$temp$endOffset = newPos;
									isFieldSeparator = $temp$isFieldSeparator;
									row = $temp$row;
									rows = $temp$rows;
									startOffset = $temp$startOffset;
									endOffset = $temp$endOffset;
									continue parseHelp;
								} else {
									if (first === '\"') {
										var newPos = endOffset + 1;
										var _v2 = A4(parseQuotedField, isFieldSeparator, '', newPos, newPos);
										if (_v2.$ === 'Ok') {
											var _v3 = _v2.a;
											var value = _v3.a;
											var afterQuotedField = _v3.b;
											var rowEnded = _v3.c;
											if (_Utils_cmp(afterQuotedField, finalLength) > -1) {
												return $elm$core$Result$Ok(
													$elm$core$List$reverse(
														A2(
															$elm$core$List$cons,
															$elm$core$List$reverse(
																A2($elm$core$List$cons, value, row)),
															rows)));
											} else {
												if (rowEnded) {
													var $temp$isFieldSeparator = isFieldSeparator,
														$temp$row = _List_Nil,
														$temp$rows = A2(
														$elm$core$List$cons,
														$elm$core$List$reverse(
															A2($elm$core$List$cons, value, row)),
														rows),
														$temp$startOffset = afterQuotedField,
														$temp$endOffset = afterQuotedField;
													isFieldSeparator = $temp$isFieldSeparator;
													row = $temp$row;
													rows = $temp$rows;
													startOffset = $temp$startOffset;
													endOffset = $temp$endOffset;
													continue parseHelp;
												} else {
													var $temp$isFieldSeparator = isFieldSeparator,
														$temp$row = A2($elm$core$List$cons, value, row),
														$temp$rows = rows,
														$temp$startOffset = afterQuotedField,
														$temp$endOffset = afterQuotedField;
													isFieldSeparator = $temp$isFieldSeparator;
													row = $temp$row;
													rows = $temp$rows;
													startOffset = $temp$startOffset;
													endOffset = $temp$endOffset;
													continue parseHelp;
												}
											}
										} else {
											var problem = _v2.a;
											return $elm$core$Result$Err(
												problem(
													$elm$core$List$length(rows) + 1));
										}
									} else {
										var $temp$isFieldSeparator = isFieldSeparator,
											$temp$row = row,
											$temp$rows = rows,
											$temp$startOffset = startOffset,
											$temp$endOffset = endOffset + 1;
										isFieldSeparator = $temp$isFieldSeparator;
										row = $temp$row;
										rows = $temp$rows;
										startOffset = $temp$startOffset;
										endOffset = $temp$endOffset;
										continue parseHelp;
									}
								}
							}
						}
					}
				}
			});
		var parseSemicolon = F4(
			function (row, rows, startOffset, endOffset) {
				parseSemicolon:
				while (true) {
					if ((endOffset - finalLength) >= 0) {
						var finalField = A3($elm$core$String$slice, startOffset, endOffset, source);
						return ((finalField === '') && _Utils_eq(row, _List_Nil)) ? $elm$core$Result$Ok(
							$elm$core$List$reverse(rows)) : $elm$core$Result$Ok(
							$elm$core$List$reverse(
								A2(
									$elm$core$List$cons,
									$elm$core$List$reverse(
										A2($elm$core$List$cons, finalField, row)),
									rows)));
					} else {
						var first = A3($elm$core$String$slice, endOffset, endOffset + 1, source);
						if (first === ';') {
							var newPos = endOffset + 1;
							var $temp$row = A2(
								$elm$core$List$cons,
								A3($elm$core$String$slice, startOffset, endOffset, source),
								row),
								$temp$rows = rows,
								$temp$startOffset = newPos,
								$temp$endOffset = newPos;
							row = $temp$row;
							rows = $temp$rows;
							startOffset = $temp$startOffset;
							endOffset = $temp$endOffset;
							continue parseSemicolon;
						} else {
							if (first === '\n') {
								var newPos = endOffset + 1;
								var $temp$row = _List_Nil,
									$temp$rows = A2(
									$elm$core$List$cons,
									$elm$core$List$reverse(
										A2(
											$elm$core$List$cons,
											A3($elm$core$String$slice, startOffset, endOffset, source),
											row)),
									rows),
									$temp$startOffset = newPos,
									$temp$endOffset = newPos;
								row = $temp$row;
								rows = $temp$rows;
								startOffset = $temp$startOffset;
								endOffset = $temp$endOffset;
								continue parseSemicolon;
							} else {
								if ((first === '\u000D') && (A3($elm$core$String$slice, endOffset + 1, endOffset + 2, source) === '\n')) {
									var newPos = endOffset + 2;
									var $temp$row = _List_Nil,
										$temp$rows = A2(
										$elm$core$List$cons,
										$elm$core$List$reverse(
											A2(
												$elm$core$List$cons,
												A3($elm$core$String$slice, startOffset, endOffset, source),
												row)),
										rows),
										$temp$startOffset = newPos,
										$temp$endOffset = newPos;
									row = $temp$row;
									rows = $temp$rows;
									startOffset = $temp$startOffset;
									endOffset = $temp$endOffset;
									continue parseSemicolon;
								} else {
									if (first === '\"') {
										var newPos = endOffset + 1;
										var _v4 = A4(
											parseQuotedField,
											function (c) {
												return c === ';';
											},
											'',
											newPos,
											newPos);
										if (_v4.$ === 'Ok') {
											var _v5 = _v4.a;
											var value = _v5.a;
											var afterQuotedField = _v5.b;
											var rowEnded = _v5.c;
											if (_Utils_cmp(afterQuotedField, finalLength) > -1) {
												return $elm$core$Result$Ok(
													$elm$core$List$reverse(
														A2(
															$elm$core$List$cons,
															$elm$core$List$reverse(
																A2($elm$core$List$cons, value, row)),
															rows)));
											} else {
												if (rowEnded) {
													var $temp$row = _List_Nil,
														$temp$rows = A2(
														$elm$core$List$cons,
														$elm$core$List$reverse(
															A2($elm$core$List$cons, value, row)),
														rows),
														$temp$startOffset = afterQuotedField,
														$temp$endOffset = afterQuotedField;
													row = $temp$row;
													rows = $temp$rows;
													startOffset = $temp$startOffset;
													endOffset = $temp$endOffset;
													continue parseSemicolon;
												} else {
													var $temp$row = A2($elm$core$List$cons, value, row),
														$temp$rows = rows,
														$temp$startOffset = afterQuotedField,
														$temp$endOffset = afterQuotedField;
													row = $temp$row;
													rows = $temp$rows;
													startOffset = $temp$startOffset;
													endOffset = $temp$endOffset;
													continue parseSemicolon;
												}
											}
										} else {
											var problem = _v4.a;
											return $elm$core$Result$Err(
												problem(
													$elm$core$List$length(rows) + 1));
										}
									} else {
										var $temp$row = row,
											$temp$rows = rows,
											$temp$startOffset = startOffset,
											$temp$endOffset = endOffset + 1;
										row = $temp$row;
										rows = $temp$rows;
										startOffset = $temp$startOffset;
										endOffset = $temp$endOffset;
										continue parseSemicolon;
									}
								}
							}
						}
					}
				}
			});
		var fieldSeparator = $elm$core$String$fromChar(config.fieldSeparator);
		return $elm$core$String$isEmpty(source) ? $elm$core$Result$Ok(_List_Nil) : (_Utils_eq(
			config.fieldSeparator,
			_Utils_chr(',')) ? A4(parseComma, _List_Nil, _List_Nil, 0, 0) : (_Utils_eq(
			config.fieldSeparator,
			_Utils_chr(';')) ? A4(parseSemicolon, _List_Nil, _List_Nil, 0, 0) : A5(
			parseHelp,
			function (s) {
				return _Utils_eq(s, fieldSeparator);
			},
			_List_Nil,
			_List_Nil,
			0,
			0)));
	});
var $BrianHicks$elm_csv$Csv$Decode$decodeCustom = F4(
	function (config, fieldNames, decoder, source) {
		return A2(
			$elm$core$Result$andThen,
			A2($BrianHicks$elm_csv$Csv$Decode$applyDecoder, fieldNames, decoder),
			A2(
				$elm$core$Result$mapError,
				$BrianHicks$elm_csv$Csv$Decode$ParsingError,
				A2($BrianHicks$elm_csv$Csv$Parser$parse, config, source)));
	});
var $BrianHicks$elm_csv$Csv$Decode$decodeCsv = $BrianHicks$elm_csv$Csv$Decode$decodeCustom(
	{
		fieldSeparator: _Utils_chr(',')
	});
var $BrianHicks$elm_csv$Csv$Decode$Decoder = function (a) {
	return {$: 'Decoder', a: a};
};
var $BrianHicks$elm_csv$Csv$Decode$Field_ = function (a) {
	return {$: 'Field_', a: a};
};
var $BrianHicks$elm_csv$Csv$Decode$field = F2(
	function (name, _v0) {
		var decoder = _v0.a;
		return $BrianHicks$elm_csv$Csv$Decode$Decoder(
			F3(
				function (_v1, fieldNames, row) {
					return A3(
						decoder,
						$BrianHicks$elm_csv$Csv$Decode$Field_(name),
						fieldNames,
						row);
				}));
	});
var $elm$core$String$filter = _String_filter;
var $BrianHicks$elm_csv$Csv$Decode$succeed = function (value) {
	return $BrianHicks$elm_csv$Csv$Decode$Decoder(
		F4(
			function (_v0, _v1, _v2, _v3) {
				return $elm$core$Result$Ok(value);
			}));
};
var $BrianHicks$elm_csv$Csv$Decode$into = $BrianHicks$elm_csv$Csv$Decode$succeed;
var $author$project$Model$normalizeCountry = function (name) {
	switch (name) {
		case 'Ivory Coast':
			return 'Côte d\'Ivoire';
		case 'Cote d\'Ivoire':
			return 'Côte d\'Ivoire';
		case 'DPR Korea':
			return 'North Korea';
		case 'Korea':
			return 'South Korea';
		case 'IR Iran':
			return 'Iran';
		case 'Czech Republic':
			return 'Czechia';
		case 'Czech Republic (Czechia)':
			return 'Czechia';
		case 'Republic of Ireland':
			return 'Ireland';
		case 'Chinese Taipei':
			return 'Taiwan';
		case 'Hong Kong, China':
			return 'Hong Kong';
		case 'Türkiye':
			return 'Turkey';
		case 'Republic of Moldova':
			return 'Moldova';
		case 'Great Britain':
			return 'United Kingdom';
		default:
			return name;
	}
};
var $BrianHicks$elm_csv$Csv$Decode$map2 = F3(
	function (transform, _v0, _v1) {
		var decodeA = _v0.a;
		var decodeB = _v1.a;
		return $BrianHicks$elm_csv$Csv$Decode$Decoder(
			F4(
				function (location, fieldNames, rowNum, row) {
					var _v2 = _Utils_Tuple2(
						A4(decodeA, location, fieldNames, rowNum, row),
						A4(decodeB, location, fieldNames, rowNum, row));
					if (_v2.a.$ === 'Ok') {
						if (_v2.b.$ === 'Ok') {
							var a = _v2.a.a;
							var b = _v2.b.a;
							return $elm$core$Result$Ok(
								A2(transform, a, b));
						} else {
							var b = _v2.b.a;
							return $elm$core$Result$Err(b);
						}
					} else {
						if (_v2.b.$ === 'Err') {
							var a = _v2.a.a;
							var b = _v2.b.a;
							return $elm$core$Result$Err(
								_Utils_ap(a, b));
						} else {
							var a = _v2.a.a;
							return $elm$core$Result$Err(a);
						}
					}
				}));
	});
var $BrianHicks$elm_csv$Csv$Decode$pipeline = $BrianHicks$elm_csv$Csv$Decode$map2(
	F2(
		function (value, fn) {
			return fn(value);
		}));
var $BrianHicks$elm_csv$Csv$Decode$ColumnNotFound = function (a) {
	return {$: 'ColumnNotFound', a: a};
};
var $BrianHicks$elm_csv$Csv$Decode$ExpectedOneColumn = function (a) {
	return {$: 'ExpectedOneColumn', a: a};
};
var $BrianHicks$elm_csv$Csv$Decode$FieldDecodingError = function (a) {
	return {$: 'FieldDecodingError', a: a};
};
var $BrianHicks$elm_csv$Csv$Decode$FieldNotFound = function (a) {
	return {$: 'FieldNotFound', a: a};
};
var $BrianHicks$elm_csv$Csv$Decode$FieldNotProvided = function (a) {
	return {$: 'FieldNotProvided', a: a};
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $BrianHicks$elm_csv$Csv$Decode$Column = function (a) {
	return {$: 'Column', a: a};
};
var $BrianHicks$elm_csv$Csv$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $BrianHicks$elm_csv$Csv$Decode$OnlyColumn = {$: 'OnlyColumn'};
var $BrianHicks$elm_csv$Csv$Decode$locationToColumn = F2(
	function (fieldNames, location) {
		switch (location.$) {
			case 'Column_':
				var i = location.a;
				return $BrianHicks$elm_csv$Csv$Decode$Column(i);
			case 'Field_':
				var name = location.a;
				return A2(
					$BrianHicks$elm_csv$Csv$Decode$Field,
					name,
					A2($elm$core$Dict$get, name, fieldNames));
			default:
				return $BrianHicks$elm_csv$Csv$Decode$OnlyColumn;
		}
	});
var $BrianHicks$elm_csv$Csv$Decode$fromString = function (convert) {
	return $BrianHicks$elm_csv$Csv$Decode$Decoder(
		F4(
			function (location, _v0, rowNum, row) {
				var names = _v0.names;
				var error = function (problem) {
					return $elm$core$Result$Err(
						_List_fromArray(
							[
								$BrianHicks$elm_csv$Csv$Decode$FieldDecodingError(
								{
									column: A2($BrianHicks$elm_csv$Csv$Decode$locationToColumn, names, location),
									problem: problem,
									row: rowNum
								})
							]));
				};
				switch (location.$) {
					case 'Column_':
						var colNum = location.a;
						var _v2 = $elm$core$List$head(
							A2($elm$core$List$drop, colNum, row));
						if (_v2.$ === 'Just') {
							var value = _v2.a;
							var _v3 = convert(value);
							if (_v3.$ === 'Ok') {
								var converted = _v3.a;
								return $elm$core$Result$Ok(converted);
							} else {
								var problem = _v3.a;
								return error(problem);
							}
						} else {
							return error(
								$BrianHicks$elm_csv$Csv$Decode$ColumnNotFound(colNum));
						}
					case 'Field_':
						var name = location.a;
						var _v4 = A2($elm$core$Dict$get, name, names);
						if (_v4.$ === 'Just') {
							var colNum = _v4.a;
							var _v5 = $elm$core$List$head(
								A2($elm$core$List$drop, colNum, row));
							if (_v5.$ === 'Just') {
								var value = _v5.a;
								var _v6 = convert(value);
								if (_v6.$ === 'Ok') {
									var converted = _v6.a;
									return $elm$core$Result$Ok(converted);
								} else {
									var problem = _v6.a;
									return error(problem);
								}
							} else {
								return error(
									$BrianHicks$elm_csv$Csv$Decode$FieldNotFound(name));
							}
						} else {
							return $elm$core$Result$Err(
								_List_fromArray(
									[
										$BrianHicks$elm_csv$Csv$Decode$FieldNotProvided(name)
									]));
						}
					default:
						if (!row.b) {
							return error(
								$BrianHicks$elm_csv$Csv$Decode$ColumnNotFound(0));
						} else {
							if (!row.b.b) {
								var only = row.a;
								var _v8 = convert(only);
								if (_v8.$ === 'Ok') {
									var converted = _v8.a;
									return $elm$core$Result$Ok(converted);
								} else {
									var problem = _v8.a;
									return error(problem);
								}
							} else {
								return error(
									$BrianHicks$elm_csv$Csv$Decode$ExpectedOneColumn(
										$elm$core$List$length(row)));
							}
						}
				}
			}));
};
var $BrianHicks$elm_csv$Csv$Decode$string = $BrianHicks$elm_csv$Csv$Decode$fromString($elm$core$Result$Ok);
var $elm$core$String$toFloat = _String_toFloat;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Model$decodeGdpCsv = function (body) {
	var parseMoneyOrZero = function (s) {
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$String$toFloat(
				A2(
					$elm$core$String$filter,
					function (c) {
						return $elm$core$Char$isDigit(c) || _Utils_eq(
							c,
							_Utils_chr('.'));
					},
					s)));
	};
	var decoder = A2(
		$BrianHicks$elm_csv$Csv$Decode$pipeline,
		A2($BrianHicks$elm_csv$Csv$Decode$field, 'GDP', $BrianHicks$elm_csv$Csv$Decode$string),
		A2(
			$BrianHicks$elm_csv$Csv$Decode$pipeline,
			A2($BrianHicks$elm_csv$Csv$Decode$field, 'Country', $BrianHicks$elm_csv$Csv$Decode$string),
			$BrianHicks$elm_csv$Csv$Decode$into(
				F2(
					function (country, gdpStr) {
						return {
							country: $author$project$Model$normalizeCountry(country),
							gdp: parseMoneyOrZero(gdpStr)
						};
					}))));
	var _v0 = A3($BrianHicks$elm_csv$Csv$Decode$decodeCsv, $BrianHicks$elm_csv$Csv$Decode$FieldNamesFromFirstRow, decoder, body);
	if (_v0.$ === 'Ok') {
		var rows = _v0.a;
		return $elm$core$Result$Ok(rows);
	} else {
		return $elm$core$Result$Err('CSV decode error (gdp)');
	}
};
var $BrianHicks$elm_csv$Csv$Decode$ExpectedInt = function (a) {
	return {$: 'ExpectedInt', a: a};
};
var $BrianHicks$elm_csv$Csv$Decode$int = $BrianHicks$elm_csv$Csv$Decode$fromString(
	function (value) {
		var _v0 = $elm$core$String$toInt(
			$elm$core$String$trim(value));
		if (_v0.$ === 'Just') {
			var parsed = _v0.a;
			return $elm$core$Result$Ok(parsed);
		} else {
			return $elm$core$Result$Err(
				$BrianHicks$elm_csv$Csv$Decode$ExpectedInt(value));
		}
	});
var $author$project$Model$participationDecoder = A2(
	$BrianHicks$elm_csv$Csv$Decode$pipeline,
	A2($BrianHicks$elm_csv$Csv$Decode$field, 'Medal', $BrianHicks$elm_csv$Csv$Decode$string),
	A2(
		$BrianHicks$elm_csv$Csv$Decode$pipeline,
		A2($BrianHicks$elm_csv$Csv$Decode$field, 'Event', $BrianHicks$elm_csv$Csv$Decode$string),
		A2(
			$BrianHicks$elm_csv$Csv$Decode$pipeline,
			A2($BrianHicks$elm_csv$Csv$Decode$field, 'Sport', $BrianHicks$elm_csv$Csv$Decode$string),
			A2(
				$BrianHicks$elm_csv$Csv$Decode$pipeline,
				A2($BrianHicks$elm_csv$Csv$Decode$field, 'City', $BrianHicks$elm_csv$Csv$Decode$string),
				A2(
					$BrianHicks$elm_csv$Csv$Decode$pipeline,
					A2($BrianHicks$elm_csv$Csv$Decode$field, 'Season', $BrianHicks$elm_csv$Csv$Decode$string),
					A2(
						$BrianHicks$elm_csv$Csv$Decode$pipeline,
						A2($BrianHicks$elm_csv$Csv$Decode$field, 'Year', $BrianHicks$elm_csv$Csv$Decode$int),
						A2(
							$BrianHicks$elm_csv$Csv$Decode$pipeline,
							A2($BrianHicks$elm_csv$Csv$Decode$field, 'NOC', $BrianHicks$elm_csv$Csv$Decode$string),
							A2(
								$BrianHicks$elm_csv$Csv$Decode$pipeline,
								A2($BrianHicks$elm_csv$Csv$Decode$field, 'Team', $BrianHicks$elm_csv$Csv$Decode$string),
								A2(
									$BrianHicks$elm_csv$Csv$Decode$pipeline,
									A2($BrianHicks$elm_csv$Csv$Decode$field, 'Sex', $BrianHicks$elm_csv$Csv$Decode$string),
									A2(
										$BrianHicks$elm_csv$Csv$Decode$pipeline,
										A2($BrianHicks$elm_csv$Csv$Decode$field, 'Name', $BrianHicks$elm_csv$Csv$Decode$string),
										A2(
											$BrianHicks$elm_csv$Csv$Decode$pipeline,
											A2($BrianHicks$elm_csv$Csv$Decode$field, 'player_id', $BrianHicks$elm_csv$Csv$Decode$int),
											$BrianHicks$elm_csv$Csv$Decode$into(
												function (playerId) {
													return function (name) {
														return function (sex) {
															return function (team) {
																return function (noc) {
																	return function (year) {
																		return function (season) {
																			return function (city) {
																				return function (sport) {
																					return function (event) {
																						return function (medal) {
																							return {
																								city: city,
																								event: event,
																								medal: medal,
																								name: name,
																								noc: noc,
																								playerId: playerId,
																								season: season,
																								sex: sex,
																								sport: sport,
																								team: $author$project$Model$normalizeCountry(team),
																								year: year
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												}))))))))))));
var $author$project$Model$decodeOlympiaCsv = function (body) {
	var _v0 = A3($BrianHicks$elm_csv$Csv$Decode$decodeCsv, $BrianHicks$elm_csv$Csv$Decode$FieldNamesFromFirstRow, $author$project$Model$participationDecoder, body);
	if (_v0.$ === 'Ok') {
		var rows = _v0.a;
		return $elm$core$Result$Ok(rows);
	} else {
		return $elm$core$Result$Err('CSV decode error');
	}
};
var $author$project$Model$decodePopulationCsv = function (body) {
	var parseIntOrZero = function (s) {
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$String$toInt(
				A2(
					$elm$core$String$filter,
					function (c) {
						return $elm$core$Char$isDigit(c);
					},
					s)));
	};
	var decoder = A2(
		$BrianHicks$elm_csv$Csv$Decode$pipeline,
		A2($BrianHicks$elm_csv$Csv$Decode$field, 'Med. Age', $BrianHicks$elm_csv$Csv$Decode$string),
		A2(
			$BrianHicks$elm_csv$Csv$Decode$pipeline,
			A2($BrianHicks$elm_csv$Csv$Decode$field, 'Population (2024)', $BrianHicks$elm_csv$Csv$Decode$string),
			A2(
				$BrianHicks$elm_csv$Csv$Decode$pipeline,
				A2($BrianHicks$elm_csv$Csv$Decode$field, 'Country', $BrianHicks$elm_csv$Csv$Decode$string),
				$BrianHicks$elm_csv$Csv$Decode$into(
					F3(
						function (country, popStr, ageStr) {
							return {
								country: $author$project$Model$normalizeCountry(country),
								medianAge: parseIntOrZero(ageStr),
								population: parseIntOrZero(popStr)
							};
						})))));
	var _v0 = A3($BrianHicks$elm_csv$Csv$Decode$decodeCsv, $BrianHicks$elm_csv$Csv$Decode$FieldNamesFromFirstRow, decoder, body);
	if (_v0.$ === 'Ok') {
		var rows = _v0.a;
		return $elm$core$Result$Ok(rows);
	} else {
		return $elm$core$Result$Err('CSV decode error (population)');
	}
};
var $elm_community$list_extra$List$Extra$findIndexHelp = F3(
	function (index, predicate, list) {
		findIndexHelp:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(index);
				} else {
					var $temp$index = index + 1,
						$temp$predicate = predicate,
						$temp$list = xs;
					index = $temp$index;
					predicate = $temp$predicate;
					list = $temp$list;
					continue findIndexHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$findIndex = $elm_community$list_extra$List$Extra$findIndexHelp(0);
var $elm_community$list_extra$List$Extra$elemIndex = function (x) {
	return $elm_community$list_extra$List$Extra$findIndex(
		$elm$core$Basics$eq(x));
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Model$filterByYear = F2(
	function (year, participations) {
		return A2(
			$elm$core$List$filter,
			function (p) {
				return _Utils_eq(p.year, year);
			},
			participations);
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$String$words = _String_words;
var $author$project$Model$filterSportsEventMedal = function (participations) {
	var updateDict = F2(
		function (p, dict) {
			var sKey = $elm$core$String$concat(
				$elm$core$String$words(
					$elm$core$String$concat(
						_List_fromArray(
							[p.event, p.sport, p.team, p.medal]))));
			var _v0 = A2($elm$core$Dict$get, sKey, dict);
			if (_v0.$ === 'Just') {
				return dict;
			} else {
				return A3($elm$core$Dict$insert, sKey, p, dict);
			}
		});
	var sportsEventsDict = A3($elm$core$List$foldl, updateDict, $elm$core$Dict$empty, participations);
	return $elm$core$Dict$values(sportsEventsDict);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Update$httpErrorToString = function (err) {
	switch (err.$) {
		case 'BadUrl':
			var u = err.a;
			return 'BadUrl: ' + u;
		case 'Timeout':
			return 'Timeout';
		case 'NetworkError':
			return 'NetworkError';
		case 'BadStatus':
			var s = err.a;
			return 'BadStatus: ' + $elm$core$String$fromInt(s);
		default:
			var msg = err.a;
			return 'BadBody: ' + msg;
	}
};
var $author$project$Model$manualGdpOverrides = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('Taiwan', 757340000000),
			_Utils_Tuple2('Hong Kong', 381070000000),
			_Utils_Tuple2('Kosovo', 10470000000),
			_Utils_Tuple2('Cabo Verde', 2588000000),
			_Utils_Tuple2('Puerto Rico', 117900000000)
		]));
var $author$project$Model$manualPopulationOverrides = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Kosovo',
			{medianAge: 32, population: 1772128})
		]));
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Model$axisLabel = function (aid) {
	switch (aid) {
		case 'medals':
			return 'Medaillenspiegel';
		case 'pop':
			return 'Einwohner';
		case 'gdp':
			return 'BIP';
		case 'age':
			return 'Median-Alter';
		default:
			return aid;
	}
};
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Model$toPCModel = function (model) {
	var safeDiv = F2(
		function (num, den) {
			return (den <= 0) ? 0 : (num / den);
		});
	var popBy = A2(
		$elm$core$Dict$map,
		F2(
			function (_v3, v) {
				return v.population;
			}),
		model.populationByCountry);
	var placementBy = $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (r) {
				return _Utils_Tuple2(
					r.country,
					_Utils_Tuple2(r.placement, r.total));
			},
			model.medalTable));
	var gdpBy = model.gdpByCountry;
	var countries = A2(
		$elm$core$List$filter,
		function (c) {
			return (c !== 'EOR') && (c !== 'AIN');
		},
		A2(
			$elm$core$List$map,
			function ($) {
				return $.country;
			},
			model.medalTable));
	var axes = A2(
		$elm$core$List$map,
		function (aid) {
			return {
				id: aid,
				label: $author$project$Model$axisLabel(aid)
			};
		},
		model.axisOrder);
	var ageBy = A2(
		$elm$core$Dict$map,
		F2(
			function (_v2, v) {
				return v.medianAge;
			}),
		model.populationByCountry);
	var getValue = F2(
		function (axisId, country) {
			if (model.useRelative) {
				var total_medals = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(9999, 0),
					A2($elm$core$Dict$get, country, placementBy)).b;
				switch (axisId) {
					case 'medals':
						return A2(
							$elm$core$Maybe$withDefault,
							_Utils_Tuple2(9999, 0),
							A2($elm$core$Dict$get, country, placementBy)).a;
					case 'pop':
						return A2(
							safeDiv,
							total_medals,
							A2(
								$elm$core$Maybe$withDefault,
								0,
								A2($elm$core$Dict$get, country, popBy)));
					case 'gdp':
						return A2(
							safeDiv,
							total_medals,
							A2(
								$elm$core$Maybe$withDefault,
								0,
								A2($elm$core$Dict$get, country, gdpBy)));
					case 'age':
						return A2(
							safeDiv,
							total_medals,
							A2(
								$elm$core$Maybe$withDefault,
								0,
								A2($elm$core$Dict$get, country, ageBy)));
					default:
						return 0;
				}
			} else {
				switch (axisId) {
					case 'medals':
						return A2(
							$elm$core$Maybe$withDefault,
							_Utils_Tuple2(9999, 0),
							A2($elm$core$Dict$get, country, placementBy)).a;
					case 'pop':
						return A2(
							$elm$core$Maybe$withDefault,
							0,
							A2($elm$core$Dict$get, country, popBy));
					case 'gdp':
						return A2(
							$elm$core$Maybe$withDefault,
							0,
							A2($elm$core$Dict$get, country, gdpBy));
					case 'age':
						return A2(
							$elm$core$Maybe$withDefault,
							0,
							A2($elm$core$Dict$get, country, ageBy));
					default:
						return 0;
				}
			}
		});
	var seriesFor = function (country) {
		return {
			name: country,
			values: A2(
				$elm$core$List$map,
				function (a) {
					return _Utils_Tuple2(
						a.id,
						A2(getValue, a.id, country));
				},
				axes)
		};
	};
	var series = A2($elm$core$List$map, seriesFor, countries);
	return {axes: axes, hovered: model.pcHover, ranking: model.ranking, series: series};
};
var $author$project$Model$recomputePcModel = function (m) {
	return _Utils_update(
		m,
		{
			pcmodel: $author$project$Model$toPCModel(m)
		});
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm_community$list_extra$List$Extra$splitAt = F2(
	function (n, xs) {
		return _Utils_Tuple2(
			A2($elm$core$List$take, n, xs),
			A2($elm$core$List$drop, n, xs));
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Model$stripTrailingDashDigits = function (s) {
	var parts = A2($elm$core$String$split, '-', s);
	var _v0 = $elm$core$List$reverse(parts);
	if (_v0.b) {
		var lastPart = _v0.a;
		var restRev = _v0.b;
		return (A2($elm$core$String$all, $elm$core$Char$isDigit, lastPart) && ($elm$core$List$length(parts) >= 2)) ? A2(
			$elm$core$String$join,
			'-',
			$elm$core$List$reverse(restRev)) : s;
	} else {
		return s;
	}
};
var $author$project$Model$normalizeTeamHM = function (team) {
	return $author$project$Model$stripTrailingDashDigits(team);
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $elm_community$list_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$List$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$List$cons, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$unique = function (list) {
	return A4($elm_community$list_extra$List$Extra$uniqueHelp, $elm$core$Basics$identity, _List_Nil, list, _List_Nil);
};
var $author$project$Model$toHMModel = function (parts) {
	var medalEntries = A2(
		$elm$core$List$filter,
		function (p) {
			return (p.medal !== 'No medal') && (p.medal !== 'NA');
		},
		$author$project$Model$filterSportsEventMedal(parts));
	var allYears = $elm_community$list_extra$List$Extra$unique(
		$elm$core$List$sort(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.year;
				},
				medalEntries)));
	var last7Years = function () {
		var n = $elm$core$List$length(allYears);
		var k = (n > 7) ? (n - 7) : 0;
		return A2($elm$core$List$drop, k, allYears);
	}();
	var addCount = F2(
		function (p, dict) {
			var rawTeam = (p.team !== '') ? p.team : p.noc;
			var team = $author$project$Model$normalizeTeamHM(
				$author$project$Model$normalizeCountry(rawTeam));
			if (($elm$core$String$length(team) <= 6) && (A2($elm$core$List$member, p.year, last7Years) && ((team !== 'EOR') && (team !== 'AIN')))) {
				var key = _Utils_Tuple2(team, p.year);
				return A3(
					$elm$core$Dict$update,
					key,
					function (m) {
						return $elm$core$Maybe$Just(
							A2($elm$core$Maybe$withDefault, 0, m) + 1);
					},
					dict);
			} else {
				return dict;
			}
		});
	var countsBy = A3($elm$core$List$foldl, addCount, $elm$core$Dict$empty, medalEntries);
	var teams = $elm$core$List$sort(
		$elm_community$list_extra$List$Extra$unique(
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				$elm$core$Dict$keys(countsBy))));
	var dataMatrix = A2(
		$elm$core$List$map,
		function (team) {
			return A2(
				$elm$core$List$map,
				function (y) {
					return A2(
						$elm$core$Maybe$withDefault,
						0,
						A2(
							$elm$core$Dict$get,
							_Utils_Tuple2(team, y),
							countsBy));
				},
				last7Years);
		},
		teams);
	return {
		columnLabels: A2($elm$core$List$map, $elm$core$String$fromInt, last7Years),
		data: dataMatrix,
		rowLabels: teams,
		selected: $elm$core$Maybe$Nothing
	};
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$Model$toMedalTable = function (participations) {
	var step = F2(
		function (_v8, _v9) {
			var idx = _v8.a;
			var c = _v8.b;
			var maybePrev = _v9.a;
			var prevRank = _v9.b;
			var acc = _v9.c;
			var triple = _Utils_Tuple3(c.gold, c.silver, c.bronze);
			var rank = function () {
				if (maybePrev.$ === 'Nothing') {
					return 1;
				} else {
					var prevTriple = maybePrev.a;
					return _Utils_eq(prevTriple, triple) ? prevRank : (idx + 1);
				}
			}();
			var row = {bronze: c.bronze, country: c.country, gold: c.gold, placement: rank, silver: c.silver, total: (c.gold + c.silver) + c.bronze};
			return _Utils_Tuple3(
				$elm$core$Maybe$Just(triple),
				rank,
				A2($elm$core$List$cons, row, acc));
		});
	var getLand = function (p) {
		return (p.team !== '') ? p.team : p.noc;
	};
	var addMedal = F2(
		function (medal, _v6) {
			var g = _v6.a;
			var s = _v6.b;
			var b = _v6.c;
			switch (medal) {
				case 'Gold':
					return _Utils_Tuple3(g + 1, s, b);
				case 'Silver':
					return _Utils_Tuple3(g, s + 1, b);
				case 'Bronze':
					return _Utils_Tuple3(g, s, b + 1);
				default:
					return _Utils_Tuple3(g, s, b);
			}
		});
	var medalsByCountry = A3(
		$elm$core$List$foldl,
		F2(
			function (p, dict) {
				if ((p.medal === 'Gold') || ((p.medal === 'Silver') || (p.medal === 'Bronze'))) {
					var land = $author$project$Model$normalizeCountry(
						getLand(p));
					var old = A2(
						$elm$core$Maybe$withDefault,
						_Utils_Tuple3(0, 0, 0),
						A2($elm$core$Dict$get, land, dict));
					return A3(
						$elm$core$Dict$insert,
						land,
						A2(addMedal, p.medal, old),
						dict);
				} else {
					return dict;
				}
			}),
		$elm$core$Dict$empty,
		participations);
	var rowsUnranked = A2(
		$elm$core$List$map,
		function (_v3) {
			var country = _v3.a;
			var _v4 = _v3.b;
			var g = _v4.a;
			var s = _v4.b;
			var b = _v4.c;
			return {bronze: b, country: country, gold: g, silver: s};
		},
		$elm$core$Dict$toList(medalsByCountry));
	var sorted = A2(
		$elm$core$List$sortWith,
		F2(
			function (a, b) {
				var _v1 = A2($elm$core$Basics$compare, b.gold, a.gold);
				if (_v1.$ === 'EQ') {
					var _v2 = A2($elm$core$Basics$compare, b.silver, a.silver);
					if (_v2.$ === 'EQ') {
						return A2($elm$core$Basics$compare, b.bronze, a.bronze);
					} else {
						var ord = _v2;
						return ord;
					}
				} else {
					var ord = _v1;
					return ord;
				}
			}),
		rowsUnranked);
	return function (_v0) {
		var rows = _v0.c;
		return $elm$core$List$reverse(rows);
	}(
		A3(
			$elm$core$List$foldl,
			step,
			_Utils_Tuple3($elm$core$Maybe$Nothing, 0, _List_Nil),
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, sorted)));
};
var $elm_community$list_extra$List$Extra$inits = A2(
	$elm$core$List$foldr,
	F2(
		function (e, acc) {
			return A2(
				$elm$core$List$cons,
				_List_Nil,
				A2(
					$elm$core$List$map,
					$elm$core$List$cons(e),
					acc));
		}),
	_List_fromArray(
		[_List_Nil]));
var $gampleman$elm_rosetree$Tree$label = function (_v0) {
	var v = _v0.a;
	return v;
};
var $elm_community$list_extra$List$Extra$last = function (items) {
	last:
	while (true) {
		if (!items.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!items.b.b) {
				var x = items.a;
				return $elm$core$Maybe$Just(x);
			} else {
				var rest = items.b;
				var $temp$items = rest;
				items = $temp$items;
				continue last;
			}
		}
	}
};
var $gampleman$elm_rosetree$Tree$Tree = F2(
	function (a, b) {
		return {$: 'Tree', a: a, b: b};
	});
var $gampleman$elm_rosetree$Tree$tree = $gampleman$elm_rosetree$Tree$Tree;
var $gampleman$elm_rosetree$Tree$defaultBottomUp = F4(
	function (s, _v0, l, c) {
		return _Utils_Tuple2(
			s,
			A2($gampleman$elm_rosetree$Tree$tree, l, c));
	});
var $gampleman$elm_rosetree$Tree$depthFirstTraversalHelp = F5(
	function (fLabel, fTree, state, acc, stack) {
		depthFirstTraversalHelp:
		while (true) {
			var _v0 = acc.todo;
			if (!_v0.b) {
				var _v1 = A4(
					fTree,
					state,
					A2(
						$elm$core$List$map,
						function ($) {
							return $.label;
						},
						stack),
					acc.label,
					$elm$core$List$reverse(acc.done));
				var state_ = _v1.a;
				var node = _v1.b;
				if (!stack.b) {
					return _Utils_Tuple2(state_, node);
				} else {
					var top = stack.a;
					var rest = stack.b;
					var $temp$fLabel = fLabel,
						$temp$fTree = fTree,
						$temp$state = state_,
						$temp$acc = _Utils_update(
						top,
						{
							done: A2($elm$core$List$cons, node, top.done)
						}),
						$temp$stack = rest;
					fLabel = $temp$fLabel;
					fTree = $temp$fTree;
					state = $temp$state;
					acc = $temp$acc;
					stack = $temp$stack;
					continue depthFirstTraversalHelp;
				}
			} else {
				var _v3 = _v0.a;
				var l = _v3.a;
				var chs = _v3.b;
				var rest = _v0.b;
				var ancestors = A2(
					$elm$core$List$cons,
					acc.label,
					A2(
						$elm$core$List$map,
						function ($) {
							return $.label;
						},
						stack));
				var _v4 = A4(fLabel, state, ancestors, l, chs);
				var state0 = _v4.a;
				var label_ = _v4.b;
				var children_ = _v4.c;
				if (!children_.b) {
					var _v6 = A4(fTree, state0, ancestors, label_, _List_Nil);
					var state_ = _v6.a;
					var newTree = _v6.b;
					var $temp$fLabel = fLabel,
						$temp$fTree = fTree,
						$temp$state = state_,
						$temp$acc = _Utils_update(
						acc,
						{
							done: A2($elm$core$List$cons, newTree, acc.done),
							todo: rest
						}),
						$temp$stack = stack;
					fLabel = $temp$fLabel;
					fTree = $temp$fTree;
					state = $temp$state;
					acc = $temp$acc;
					stack = $temp$stack;
					continue depthFirstTraversalHelp;
				} else {
					var cs = children_;
					var $temp$fLabel = fLabel,
						$temp$fTree = fTree,
						$temp$state = state0,
						$temp$acc = {done: _List_Nil, label: label_, todo: cs},
						$temp$stack = A2(
						$elm$core$List$cons,
						_Utils_update(
							acc,
							{todo: rest}),
						stack);
					fLabel = $temp$fLabel;
					fTree = $temp$fTree;
					state = $temp$state;
					acc = $temp$acc;
					stack = $temp$stack;
					continue depthFirstTraversalHelp;
				}
			}
		}
	});
var $gampleman$elm_rosetree$Tree$depthFirstTraversal = F4(
	function (convertLabel, convertTree, s, _v0) {
		var l = _v0.a;
		var c = _v0.b;
		var _v1 = A4(convertLabel, s, _List_Nil, l, c);
		var state_ = _v1.a;
		var label_ = _v1.b;
		var children_ = _v1.c;
		return A5(
			$gampleman$elm_rosetree$Tree$depthFirstTraversalHelp,
			convertLabel,
			convertTree,
			state_,
			{done: _List_Nil, label: label_, todo: children_},
			_List_Nil);
	});
var $gampleman$elm_rosetree$Tree$mapAccumulate = F3(
	function (f, state, t) {
		return A4(
			$gampleman$elm_rosetree$Tree$depthFirstTraversal,
			F4(
				function (s, _v0, l, c) {
					var _v1 = A2(f, s, l);
					var s_ = _v1.a;
					var l_ = _v1.b;
					return _Utils_Tuple3(s_, l_, c);
				}),
			$gampleman$elm_rosetree$Tree$defaultBottomUp,
			state,
			t);
	});
var $gampleman$elm_rosetree$Tree$map = F2(
	function (f, t) {
		return A3(
			$gampleman$elm_rosetree$Tree$mapAccumulate,
			F2(
				function (_v0, e) {
					return _Utils_Tuple2(
						_Utils_Tuple0,
						f(e));
				}),
			_Utils_Tuple0,
			t).b;
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $gampleman$elm_rosetree$Tree$Continue = function (a) {
	return {$: 'Continue', a: a};
};
var $gampleman$elm_rosetree$Tree$depthFirstFoldHelp = F5(
	function (f, acc, parents, trees, nextSets) {
		depthFirstFoldHelp:
		while (true) {
			if (!trees.b) {
				if (nextSets.b) {
					var _v2 = nextSets.a;
					var p = _v2.a;
					var set = _v2.b;
					var sets = nextSets.b;
					var $temp$f = f,
						$temp$acc = acc,
						$temp$parents = p,
						$temp$trees = set,
						$temp$nextSets = sets;
					f = $temp$f;
					acc = $temp$acc;
					parents = $temp$parents;
					trees = $temp$trees;
					nextSets = $temp$nextSets;
					continue depthFirstFoldHelp;
				} else {
					return acc;
				}
			} else {
				var _v3 = trees.a;
				var d = _v3.a;
				var ch = _v3.b;
				var rest = trees.b;
				var _v4 = A4(f, acc, parents, d, ch);
				if (_v4.$ === 'Continue') {
					var a = _v4.a;
					if (!ch.b) {
						var $temp$f = f,
							$temp$acc = a,
							$temp$parents = parents,
							$temp$trees = rest,
							$temp$nextSets = nextSets;
						f = $temp$f;
						acc = $temp$acc;
						parents = $temp$parents;
						trees = $temp$trees;
						nextSets = $temp$nextSets;
						continue depthFirstFoldHelp;
					} else {
						var xs = ch;
						var $temp$f = f,
							$temp$acc = a,
							$temp$parents = A2($elm$core$List$cons, d, parents),
							$temp$trees = xs,
							$temp$nextSets = A2(
							$elm$core$List$cons,
							_Utils_Tuple2(parents, rest),
							nextSets);
						f = $temp$f;
						acc = $temp$acc;
						parents = $temp$parents;
						trees = $temp$trees;
						nextSets = $temp$nextSets;
						continue depthFirstFoldHelp;
					}
				} else {
					var a = _v4.a;
					return a;
				}
			}
		}
	});
var $gampleman$elm_rosetree$Tree$depthFirstFold = F3(
	function (f, acc, t) {
		return A5(
			$gampleman$elm_rosetree$Tree$depthFirstFoldHelp,
			f,
			acc,
			_List_Nil,
			_List_fromArray(
				[t]),
			_List_Nil);
	});
var $gampleman$elm_rosetree$Tree$depth = function (t) {
	return A3(
		$gampleman$elm_rosetree$Tree$depthFirstFold,
		F4(
			function (s, a, _v0, c) {
				if (!c.b) {
					return $gampleman$elm_rosetree$Tree$Continue(
						A2(
							$elm$core$Basics$max,
							s,
							$elm$core$List$length(a)));
				} else {
					return $gampleman$elm_rosetree$Tree$Continue(s);
				}
			}),
		0,
		t);
};
var $gampleman$elm_visualization$Hierarchy$Treemap$dice = F4(
	function (_v0, _v1, value, children) {
		var x0 = _v1.x0;
		var x1 = _v1.x1;
		var y0 = _v1.y0;
		var y1 = _v1.y1;
		var k = (!value) ? 0 : ((x1 - x0) / value);
		return $elm$core$List$reverse(
			A3(
				$elm$core$List$foldl,
				F2(
					function (node, _v2) {
						var prevX = _v2.a;
						var lst = _v2.b;
						var nextX = prevX + (node * k);
						return _Utils_Tuple2(
							nextX,
							A2(
								$elm$core$List$cons,
								{x0: prevX, x1: nextX, y0: y0, y1: y1},
								lst));
					}),
				_Utils_Tuple2(x0, _List_Nil),
				children).b);
	});
var $gampleman$elm_rosetree$Tree$updateLabel = F2(
	function (f, _v0) {
		var v = _v0.a;
		var cs = _v0.b;
		return A2(
			$gampleman$elm_rosetree$Tree$Tree,
			f(v),
			cs);
	});
var $gampleman$elm_visualization$Hierarchy$Partition$layout = F2(
	function (opts, t) {
		var n = $gampleman$elm_rosetree$Tree$depth(t) + 1;
		var _v0 = opts.size;
		var dx = _v0.a;
		var dy = _v0.b;
		return A4(
			$gampleman$elm_rosetree$Tree$depthFirstTraversal,
			F4(
				function (s, a, l, c) {
					var p = opts.padding(l.node);
					var depth = $elm$core$List$length(a);
					var children = A3(
						$elm$core$List$map2,
						function (bb) {
							return $gampleman$elm_rosetree$Tree$updateLabel(
								function (cn) {
									return _Utils_update(
										cn,
										{bbox: bb});
								});
						},
						A4(
							$gampleman$elm_visualization$Hierarchy$Treemap$dice,
							depth,
							{x0: l.bbox.x0, x1: l.bbox.x1, y0: (dy * (depth + 1)) / n, y1: (dy * (depth + 2)) / n},
							l.value,
							A2(
								$elm$core$List$map,
								function (child) {
									return function ($) {
										return $.value;
									}(
										$gampleman$elm_rosetree$Tree$label(child));
								},
								c)),
						c);
					var bbox0 = {x0: l.bbox.x0, x1: l.bbox.x1 - p, y0: l.bbox.y0, y1: l.bbox.y1 - p};
					var bbox1 = (_Utils_cmp(bbox0.x1, bbox0.x0) < 0) ? _Utils_update(
						bbox0,
						{x0: (bbox0.x0 + bbox0.x1) / 2, x1: (bbox0.x0 + bbox0.x1) / 2}) : bbox0;
					var bbox2 = (_Utils_cmp(bbox0.y1, bbox0.y0) < 0) ? _Utils_update(
						bbox1,
						{y0: (bbox0.y0 + bbox0.y1) / 2, y1: (bbox0.y0 + bbox0.y1) / 2}) : bbox1;
					return _Utils_Tuple3(
						s,
						{height: bbox2.y1 - bbox2.y0, node: l.node, value: l.value, width: bbox2.x1 - bbox2.x0, x: bbox2.x0, y: bbox2.y0},
						children);
				}),
			F4(
				function (s, _v1, l, c) {
					return _Utils_Tuple2(
						s,
						A2($gampleman$elm_rosetree$Tree$tree, l, c));
				}),
			_Utils_Tuple0,
			A2(
				$gampleman$elm_rosetree$Tree$map,
				function (node) {
					return {
						bbox: {
							x0: opts.padding(node),
							x1: dx,
							y0: opts.padding(node),
							y1: dy / n
						},
						node: node,
						value: opts.value(node)
					};
				},
				t)).b;
	});
var $gampleman$elm_visualization$Hierarchy$processAttributes = function (assigner) {
	return $elm$core$List$foldl(
		F2(
			function (a, d) {
				if (a.$ === 'Batch') {
					var l = a.a;
					return A3($gampleman$elm_visualization$Hierarchy$processAttributes, assigner, d, l);
				} else {
					return A2(assigner, a, d);
				}
			}));
};
var $gampleman$elm_visualization$Hierarchy$partition = F2(
	function (attrs, value) {
		return $gampleman$elm_visualization$Hierarchy$Partition$layout(
			A3(
				$gampleman$elm_visualization$Hierarchy$processAttributes,
				F2(
					function (attr, d) {
						switch (attr.$) {
							case 'Size':
								var w = attr.a;
								var h = attr.b;
								return _Utils_update(
									d,
									{
										size: _Utils_Tuple2(w, h)
									});
							case 'Padding':
								var p = attr.a;
								return _Utils_update(
									d,
									{padding: p});
							default:
								return d;
						}
					}),
				{
					padding: $elm$core$Basics$always(0),
					size: _Utils_Tuple2(1, 1),
					value: value
				},
				attrs));
	});
var $elm$core$Basics$pi = _Basics_pi;
var $gampleman$elm_rosetree$Tree$singleton = function (v) {
	return A2($gampleman$elm_rosetree$Tree$Tree, v, _List_Nil);
};
var $gampleman$elm_visualization$Hierarchy$Size = F2(
	function (a, b) {
		return {$: 'Size', a: a, b: b};
	});
var $gampleman$elm_visualization$Hierarchy$size = $gampleman$elm_visualization$Hierarchy$Size;
var $gampleman$elm_rosetree$Tree$defaultTopDown = F4(
	function (s, _v0, l, c) {
		return _Utils_Tuple3(s, l, c);
	});
var $gampleman$elm_rosetree$Tree$sortWith = F2(
	function (compareFn, t) {
		return A4(
			$gampleman$elm_rosetree$Tree$depthFirstTraversal,
			$gampleman$elm_rosetree$Tree$defaultTopDown,
			F4(
				function (s, a, l, c) {
					return _Utils_Tuple2(
						s,
						A2(
							$gampleman$elm_rosetree$Tree$tree,
							l,
							A2(
								$elm$core$List$sortWith,
								compareFn(a),
								c)));
				}),
			_Utils_Tuple0,
			t).b;
	});
var $gampleman$elm_rosetree$Tree$children = function (_v0) {
	var c = _v0.b;
	return c;
};
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $gampleman$elm_rosetree$Tree$DisconnectedNodes = function (a) {
	return {$: 'DisconnectedNodes', a: a};
};
var $gampleman$elm_rosetree$Tree$DuplicateId = function (a) {
	return {$: 'DuplicateId', a: a};
};
var $gampleman$elm_rosetree$Tree$MultipleRoots = F2(
	function (a, b) {
		return {$: 'MultipleRoots', a: a, b: b};
	});
var $gampleman$elm_rosetree$Tree$NoRoot = {$: 'NoRoot'};
var $gampleman$elm_rosetree$Tree$NodeItsOwnParent = function (a) {
	return {$: 'NodeItsOwnParent', a: a};
};
var $gampleman$elm_rosetree$Tree$foldl = F3(
	function (f, acc, t) {
		return A3(
			$gampleman$elm_rosetree$Tree$depthFirstFold,
			F4(
				function (s, _v0, l, _v1) {
					return $gampleman$elm_rosetree$Tree$Continue(
						A2(f, l, s));
				}),
			acc,
			t);
	});
var $gampleman$elm_rosetree$Tree$length = function (t) {
	return A3(
		$gampleman$elm_rosetree$Tree$foldl,
		F2(
			function (_v0, x) {
				return x + 1;
			}),
		0,
		t);
};
var $gampleman$elm_rosetree$Tree$unfold = F2(
	function (f, seed) {
		return A4(
			$gampleman$elm_rosetree$Tree$depthFirstTraversal,
			F4(
				function (s, _v0, l, _v1) {
					var _v2 = f(l);
					var l_ = _v2.a;
					var c = _v2.b;
					return _Utils_Tuple3(
						s,
						l_,
						A2($elm$core$List$map, $gampleman$elm_rosetree$Tree$singleton, c));
				}),
			$gampleman$elm_rosetree$Tree$defaultBottomUp,
			_Utils_Tuple0,
			$gampleman$elm_rosetree$Tree$singleton(seed)).b;
	});
var $gampleman$elm_rosetree$Tree$stratify = F2(
	function (_v0, nodes) {
		var id = _v0.id;
		var parentId = _v0.parentId;
		var transform = _v0.transform;
		return A2(
			$elm$core$Result$andThen,
			function (_v5) {
				var maybeRoot = _v5.a;
				var parentBag = _v5.b;
				if (maybeRoot.$ === 'Just') {
					var root = maybeRoot.a;
					var completed = A2(
						$gampleman$elm_rosetree$Tree$unfold,
						function (_v7) {
							var itemId = _v7.a;
							var item = _v7.b;
							return _Utils_Tuple2(
								item,
								A2(
									$elm$core$Maybe$withDefault,
									_List_Nil,
									A2($elm$core$Dict$get, itemId, parentBag)));
						},
						root);
					return _Utils_eq(
						$gampleman$elm_rosetree$Tree$length(completed),
						$elm$core$List$length(nodes)) ? $elm$core$Result$Ok(completed) : $elm$core$Result$Err(
						$gampleman$elm_rosetree$Tree$DisconnectedNodes(completed));
				} else {
					return $elm$core$Result$Err($gampleman$elm_rosetree$Tree$NoRoot);
				}
			},
			A3(
				$elm$core$List$foldr,
				function (item) {
					return $elm$core$Result$andThen(
						function (_v1) {
							var maybeRoot = _v1.a;
							var parentBag = _v1.b;
							var seenIds = _v1.c;
							var node_ = transform(item);
							var nodeId = id(item);
							if (A2($elm$core$Set$member, nodeId, seenIds)) {
								return $elm$core$Result$Err(
									$gampleman$elm_rosetree$Tree$DuplicateId(node_));
							} else {
								var _v2 = parentId(item);
								if (_v2.$ === 'Nothing') {
									if (maybeRoot.$ === 'Nothing') {
										return $elm$core$Result$Ok(
											_Utils_Tuple3(
												$elm$core$Maybe$Just(
													_Utils_Tuple2(nodeId, node_)),
												parentBag,
												A2($elm$core$Set$insert, nodeId, seenIds)));
									} else {
										var _v4 = maybeRoot.a;
										var prevRoot = _v4.b;
										return $elm$core$Result$Err(
											A2($gampleman$elm_rosetree$Tree$MultipleRoots, node_, prevRoot));
									}
								} else {
									var actualNodeParentId = _v2.a;
									return _Utils_eq(actualNodeParentId, nodeId) ? $elm$core$Result$Err(
										$gampleman$elm_rosetree$Tree$NodeItsOwnParent(node_)) : $elm$core$Result$Ok(
										_Utils_Tuple3(
											maybeRoot,
											A3(
												$elm$core$Dict$update,
												actualNodeParentId,
												function (items) {
													return $elm$core$Maybe$Just(
														A2(
															$elm$core$List$cons,
															_Utils_Tuple2(nodeId, node_),
															A2($elm$core$Maybe$withDefault, _List_Nil, items)));
												},
												parentBag),
											A2($elm$core$Set$insert, nodeId, seenIds)));
								}
							}
						});
				},
				$elm$core$Result$Ok(
					_Utils_Tuple3($elm$core$Maybe$Nothing, $elm$core$Dict$empty, $elm$core$Set$empty)),
				nodes));
	});
var $gampleman$elm_rosetree$Tree$stratifyWithPath = F2(
	function (_v0, nodes) {
		var path = _v0.path;
		var createMissingNode = _v0.createMissingNode;
		return A2(
			$elm$core$Result$map,
			function (t) {
				var _v7 = $gampleman$elm_rosetree$Tree$children(t);
				if (_v7.b && (!_v7.b.b)) {
					var x = _v7.a;
					return x;
				} else {
					return t;
				}
			},
			A2(
				$elm$core$Result$mapError,
				function (e) {
					if (e.$ === 'DuplicateId') {
						var n = e.a;
						return path(n);
					} else {
						return _List_Nil;
					}
				},
				A2(
					$gampleman$elm_rosetree$Tree$stratify,
					{
						id: function ($) {
							return $.id;
						},
						parentId: function ($) {
							return $.parentId;
						},
						transform: function ($) {
							return $.node;
						}
					},
					function (n) {
						return $elm$core$List$isEmpty(n) ? _List_fromArray(
							[
								{
								id: _List_Nil,
								node: createMissingNode(_List_Nil),
								parentId: $elm$core$Maybe$Nothing
							}
							]) : n;
					}(
						$elm$core$List$reverse(
							$elm$core$List$concat(
								A3(
									$elm$core$List$foldl,
									F2(
										function (_v1, _v2) {
											var reversedPath = _v1.a;
											var item = _v1.b;
											var seenSoFar = _v2.a;
											var nodes_ = _v2.b;
											var wrapNode = F2(
												function (revPath, n) {
													if (!revPath.b) {
														return {id: _List_Nil, node: n, parentId: $elm$core$Maybe$Nothing};
													} else {
														var xs = revPath.b;
														return {
															id: revPath,
															node: n,
															parentId: $elm$core$Maybe$Just(xs)
														};
													}
												});
											var current = A2(wrapNode, reversedPath, item);
											var createParentNodes = F2(
												function (revPath, newNodes) {
													createParentNodes:
													while (true) {
														if (!revPath.b) {
															return A2($elm$core$Set$member, _List_Nil, seenSoFar) ? newNodes : A2(
																$elm$core$List$cons,
																A2(
																	wrapNode,
																	revPath,
																	createMissingNode(_List_Nil)),
																newNodes);
														} else {
															var xs = revPath.b;
															if (A2($elm$core$Set$member, revPath, seenSoFar)) {
																var $temp$revPath = xs,
																	$temp$newNodes = newNodes;
																revPath = $temp$revPath;
																newNodes = $temp$newNodes;
																continue createParentNodes;
															} else {
																var $temp$revPath = xs,
																	$temp$newNodes = A2(
																	$elm$core$List$cons,
																	A2(
																		wrapNode,
																		revPath,
																		createMissingNode(
																			$elm$core$List$reverse(revPath))),
																	newNodes);
																revPath = $temp$revPath;
																newNodes = $temp$newNodes;
																continue createParentNodes;
															}
														}
													}
												});
											var nodesToCreate = function () {
												if (!reversedPath.b) {
													return _List_fromArray(
														[current]);
												} else {
													var xs = reversedPath.b;
													return A2(
														createParentNodes,
														xs,
														_List_fromArray(
															[current]));
												}
											}();
											return _Utils_Tuple2(
												A3(
													$elm$core$List$foldl,
													function (i) {
														return $elm$core$Set$insert(i.id);
													},
													seenSoFar,
													nodesToCreate),
												A2($elm$core$List$cons, nodesToCreate, nodes_));
										}),
									_Utils_Tuple2($elm$core$Set$empty, _List_Nil),
									A2(
										$elm$core$List$sortBy,
										A2($elm$core$Basics$composeR, $elm$core$Tuple$first, $elm$core$List$length),
										A2(
											$elm$core$List$map,
											function (item) {
												return _Utils_Tuple2(
													$elm$core$List$reverse(
														path(item)),
													item);
											},
											nodes))).b))))));
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $gampleman$elm_rosetree$Tree$sumUp = F3(
	function (leaf, branch, t) {
		return A4(
			$gampleman$elm_rosetree$Tree$depthFirstTraversal,
			$gampleman$elm_rosetree$Tree$defaultTopDown,
			F4(
				function (s, _v0, l, c) {
					return _Utils_Tuple2(
						s,
						function () {
							if (!c.b) {
								return $gampleman$elm_rosetree$Tree$singleton(
									leaf(l));
							} else {
								return A2(
									$gampleman$elm_rosetree$Tree$tree,
									A2(
										branch,
										l,
										A2($elm$core$List$map, $gampleman$elm_rosetree$Tree$label, c)),
									c);
							}
						}());
				}),
			_Utils_Tuple0,
			t).b;
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $gampleman$elm_rosetree$Tree$foldr = F3(
	function (f, acc, t) {
		return A3(
			$elm$core$List$foldl,
			f,
			acc,
			A3($gampleman$elm_rosetree$Tree$foldl, $elm$core$List$cons, _List_Nil, t));
	});
var $gampleman$elm_rosetree$Tree$toList = function (t) {
	return A3($gampleman$elm_rosetree$Tree$foldr, $elm$core$List$cons, _List_Nil, t);
};
var $elm_community$list_extra$List$Extra$uniqueBy = F2(
	function (f, list) {
		return A4($elm_community$list_extra$List$Extra$uniqueHelp, f, _List_Nil, list, _List_Nil);
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Model$toSBModel = F2(
	function (parts, country) {
		var recordData = A2(
			$elm_community$list_extra$List$Extra$uniqueBy,
			function (r) {
				return r.sequence;
			},
			A2(
				$elm$core$List$map,
				function (p) {
					return {
						medalCount: 1,
						sequence: A2(
							$elm$core$List$append,
							_List_fromArray(
								[p.sport]),
							_List_fromArray(
								[p.event]))
					};
				},
				A2(
					$elm$core$List$filter,
					function (c) {
						return _Utils_eq(c.team, country) && (c.medal !== 'No medal');
					},
					parts)));
		var treeData = A2(
			$gampleman$elm_rosetree$Tree$sortWith,
			F3(
				function (_v0, a, b) {
					return A2(
						$elm$core$Basics$compare,
						$gampleman$elm_rosetree$Tree$label(b).medalCount,
						$gampleman$elm_rosetree$Tree$label(a).medalCount);
				}),
			A2(
				$gampleman$elm_rosetree$Tree$map,
				function (node) {
					return {
						category: A2(
							$elm$core$Maybe$withDefault,
							'end',
							$elm_community$list_extra$List$Extra$last(node.sequence)),
						medalCount: node.medalCount,
						sequence: node.sequence
					};
				},
				A3(
					$gampleman$elm_rosetree$Tree$sumUp,
					$elm$core$Basics$identity,
					F2(
						function (node, children) {
							return _Utils_update(
								node,
								{
									medalCount: $elm$core$List$sum(
										A2(
											$elm$core$List$map,
											function ($) {
												return $.medalCount;
											},
											children))
								});
						}),
					A2(
						$elm$core$Result$withDefault,
						$gampleman$elm_rosetree$Tree$singleton(
							{
								medalCount: 0,
								sequence: _List_fromArray(
									['Tree error'])
							}),
						A2(
							$gampleman$elm_rosetree$Tree$stratifyWithPath,
							{
								createMissingNode: function (path) {
									return {
										medalCount: 0,
										sequence: A2(
											$elm$core$Maybe$withDefault,
											_List_Nil,
											$elm_community$list_extra$List$Extra$last(path))
									};
								},
								path: function (item) {
									return $elm_community$list_extra$List$Extra$inits(item.sequence);
								}
							},
							recordData)))));
		var radius = 175;
		return {
			hovered: $elm$core$Maybe$Nothing,
			layout: A2(
				$elm$core$List$filter,
				function (d) {
					return d.width > 0.001;
				},
				A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$gampleman$elm_rosetree$Tree$toList(
							A3(
								$gampleman$elm_visualization$Hierarchy$partition,
								_List_fromArray(
									[
										A2($gampleman$elm_visualization$Hierarchy$size, 2 * $elm$core$Basics$pi, radius * radius)
									]),
								A2(
									$elm$core$Basics$composeR,
									function ($) {
										return $.medalCount;
									},
									$elm$core$Basics$toFloat),
								treeData))))),
			total: $gampleman$elm_rosetree$Tree$label(treeData).medalCount
		};
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $author$project$Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'OlympiaReceived':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var body = result.a;
					var _v2 = $author$project$Model$decodeOlympiaCsv(body);
					if (_v2.$ === 'Ok') {
						var parts = _v2.a;
						var filteredParts = $author$project$Model$filterSportsEventMedal(
							A2($author$project$Model$filterByYear, 2024, parts));
						var mt = $author$project$Model$toMedalTable(filteredParts);
						var base = _Utils_update(
							model,
							{
								error: $elm$core$Maybe$Nothing,
								heatmapmodel: $author$project$Model$toHMModel(parts),
								loading: false,
								medalTable: mt,
								participations: filteredParts,
								sbcountry: (model.sbcountry === '') ? 'Germany' : model.sbcountry,
								sbmodel: A2(
									$author$project$Model$toSBModel,
									filteredParts,
									(model.sbcountry === '') ? 'Germany' : model.sbcountry)
							});
						return _Utils_Tuple2(
							$author$project$Model$recomputePcModel(base),
							$elm$core$Platform$Cmd$none);
					} else {
						var decodeErr = _v2.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just(decodeErr),
									loading: false
								}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var httpErr = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								error: $elm$core$Maybe$Just(
									$author$project$Update$httpErrorToString(httpErr)),
								loading: false
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'PopulationReceived':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var body = result.a;
					var _v4 = $author$project$Model$decodePopulationCsv(body);
					if (_v4.$ === 'Ok') {
						var rows = _v4.a;
						var dict = $elm$core$Dict$fromList(
							A2(
								$elm$core$List$map,
								function (r) {
									return _Utils_Tuple2(
										r.country,
										{medianAge: r.medianAge, population: r.population});
								},
								rows));
						var merged = A2($elm$core$Dict$union, $author$project$Model$manualPopulationOverrides, dict);
						var base = _Utils_update(
							model,
							{populationByCountry: merged});
						return _Utils_Tuple2(
							$author$project$Model$recomputePcModel(base),
							$elm$core$Platform$Cmd$none);
					} else {
						var errStr = _v4.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just(errStr)
								}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var httpErr = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								error: $elm$core$Maybe$Just(
									$author$project$Update$httpErrorToString(httpErr))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'GdpReceived':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var body = result.a;
					var _v6 = $author$project$Model$decodeGdpCsv(body);
					if (_v6.$ === 'Ok') {
						var rows = _v6.a;
						var dict = $elm$core$Dict$fromList(
							A2(
								$elm$core$List$map,
								function (r) {
									return _Utils_Tuple2(r.country, r.gdp);
								},
								rows));
						var merged = A2($elm$core$Dict$union, $author$project$Model$manualGdpOverrides, dict);
						var base = _Utils_update(
							model,
							{gdpByCountry: merged});
						return _Utils_Tuple2(
							$author$project$Model$recomputePcModel(base),
							$elm$core$Platform$Cmd$none);
					} else {
						var errStr = _v6.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just(errStr)
								}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var httpErr = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								error: $elm$core$Maybe$Just(
									$author$project$Update$httpErrorToString(httpErr))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'HoverSB':
				var hover = msg.a;
				var modelSB = model.sbmodel;
				var updateSBData = _Utils_update(
					modelSB,
					{hovered: hover});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{sbmodel: updateSBData}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeSBCountry':
				var country = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							sbcountry: country,
							sbmodel: A2($author$project$Model$toSBModel, model.participations, country)
						}),
					$elm$core$Platform$Cmd$none);
			case 'SelectCountryFromTable':
				var country = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							sbcountry: country,
							sbmodel: A2($author$project$Model$toSBModel, model.participations, country)
						}),
					$elm$core$Platform$Cmd$none);
			case 'HoverMedalTable':
				var name = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{hoverTable: name}),
					$elm$core$Platform$Cmd$none);
			case 'NoOp':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'SetTableCriterion':
				var crit = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{tableCriterion: crit}),
					$elm$core$Platform$Cmd$none);
			case 'StartDragAxis':
				var axisId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							draggingAxis: $elm$core$Maybe$Just(axisId)
						}),
					$elm$core$Platform$Cmd$none);
			case 'DragOverAxis':
				var axisId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							dropTargetAxis: $elm$core$Maybe$Just(axisId)
						}),
					$elm$core$Platform$Cmd$none);
			case 'DropAxis':
				var targetId = msg.a;
				var newOrder = function () {
					var _v7 = model.draggingAxis;
					if (_v7.$ === 'Nothing') {
						return model.axisOrder;
					} else {
						var src = _v7.a;
						if (_Utils_eq(src, targetId)) {
							return model.axisOrder;
						} else {
							var without = A2(
								$elm$core$List$filter,
								$elm$core$Basics$neq(src),
								model.axisOrder);
							var srcIndex = A2(
								$elm$core$Maybe$withDefault,
								0,
								A2($elm_community$list_extra$List$Extra$elemIndex, src, model.axisOrder));
							if (targetId === '__end__') {
								return _Utils_ap(
									without,
									_List_fromArray(
										[src]));
							} else {
								if (targetId === '__start__') {
									return A2($elm$core$List$cons, src, without);
								} else {
									var targetIndexWithout = A2(
										$elm$core$Maybe$withDefault,
										0,
										A2($elm_community$list_extra$List$Extra$elemIndex, targetId, without));
									var targetIndexOriginal = A2(
										$elm$core$Maybe$withDefault,
										0,
										A2($elm_community$list_extra$List$Extra$elemIndex, targetId, model.axisOrder));
									var insertionIndex = (_Utils_cmp(srcIndex, targetIndexOriginal) < 0) ? (targetIndexWithout + 1) : targetIndexWithout;
									var _v8 = A2($elm_community$list_extra$List$Extra$splitAt, insertionIndex, without);
									var before = _v8.a;
									var after = _v8.b;
									return _Utils_ap(
										before,
										A2($elm$core$List$cons, src, after));
								}
							}
						}
					}
				}();
				return _Utils_Tuple2(
					$author$project$Model$recomputePcModel(
						_Utils_update(
							model,
							{axisOrder: newOrder, draggingAxis: $elm$core$Maybe$Nothing, dropTargetAxis: $elm$core$Maybe$Nothing})),
					$elm$core$Platform$Cmd$none);
			case 'ToggleRanking':
				var on = msg.a;
				return _Utils_Tuple2(
					$author$project$Model$recomputePcModel(
						_Utils_update(
							model,
							{ranking: on})),
					$elm$core$Platform$Cmd$none);
			case 'TogglePcMode':
				var on = msg.a;
				return _Utils_Tuple2(
					$author$project$Model$recomputePcModel(
						_Utils_update(
							model,
							{useRelative: on})),
					$elm$core$Platform$Cmd$none);
			case 'TogglePcDebug':
				var on = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{showPcDebug: on}),
					$elm$core$Platform$Cmd$none);
			case 'SetPcHover':
				var name = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{pcHover: name}),
					$elm$core$Platform$Cmd$none);
			case 'OnHoverHeatMap':
				var value = msg.a;
				var state = model.heatmapmodel;
				var newHeatMapModel = _Utils_update(
					state,
					{
						selected: $elm$core$Maybe$Just(value)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{heatmapmodel: newHeatMapModel}),
					$elm$core$Platform$Cmd$none);
			default:
				var state = model.heatmapmodel;
				var newHeatMapModel = _Utils_update(
					state,
					{selected: $elm$core$Maybe$Nothing});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{heatmapmodel: newHeatMapModel}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$View$headerSection = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
			A2($elm$html$Html$Attributes$style, 'padding', '20px'),
			A2($elm$html$Html$Attributes$style, 'background-color', '#f8f9fa')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('#medaillenspiegel'),
							A2($elm$html$Html$Attributes$style, 'margin', '0 15px'),
							A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
							A2($elm$html$Html$Attributes$style, 'color', '#007cba'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Medaillenspiegel')
						])),
					$elm$html$Html$text(' | '),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('#medaillenverteilung'),
							A2($elm$html$Html$Attributes$style, 'margin', '0 15px'),
							A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
							A2($elm$html$Html$Attributes$style, 'color', '#007cba'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Medaillenverteilung')
						])),
					$elm$html$Html$text(' | '),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('#parallele-koordinaten'),
							A2($elm$html$Html$Attributes$style, 'margin', '0 15px'),
							A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
							A2($elm$html$Html$Attributes$style, 'color', '#007cba'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Parallele Koordinaten')
						])),
					$elm$html$Html$text(' | '),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('#heatmap'),
							A2($elm$html$Html$Attributes$style, 'margin', '0 15px'),
							A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
							A2($elm$html$Html$Attributes$style, 'color', '#007cba'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Medaillen Entwicklung')
						]))
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin', '30px 0')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('https://upload.wikimedia.org/wikipedia/commons/5/5c/Olympic_rings_without_rims.svg'),
							$elm$html$Html$Attributes$alt('Olympische Ringe'),
							A2($elm$html$Html$Attributes$style, 'width', '300px'),
							A2($elm$html$Html$Attributes$style, 'height', 'auto')
						]),
					_List_Nil)
				])),
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'color', '#333'),
					A2($elm$html$Html$Attributes$style, 'margin', '20px 0'),
					A2($elm$html$Html$Attributes$style, 'font-size', '2.5em')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Analyse des Medaillenspiegels der Olympischen Sommerspiele 2024')
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'max-width', '800px'),
					A2($elm$html$Html$Attributes$style, 'margin', '0 auto'),
					A2($elm$html$Html$Attributes$style, 'padding', '20px'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '5px'),
					A2($elm$html$Html$Attributes$style, 'background-color', '#fff')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Diese interaktive Analyse führt Sie durch verschiedene Perspektiven auf die Medaillenverteilung der Olympischen Sommerspiele 2024. Scrollen Sie nach unten oder nutzen Sie die Navigation, um verschiedene Visualisierungen zu erkunden.')
						]))
				]))
		]));
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $author$project$Model$OnHoverHeatMap = function (a) {
	return {$: 'OnHoverHeatMap', a: a};
};
var $author$project$Model$OnLeaveHeatMap = {$: 'OnLeaveHeatMap'};
var $elm$html$Html$col = _VirtualDom_node('col');
var $elm$html$Html$colgroup = _VirtualDom_node('colgroup');
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 'RgbaSpace', a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$blue = A4($avh4$elm_color$Color$RgbaSpace, 52 / 255, 101 / 255, 164 / 255, 1.0);
var $gampleman$elm_visualization$Scale$convert = F2(
	function (_v0, value) {
		var scale = _v0.a;
		return A3(scale.convert, scale.domain, scale.range, value);
	});
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char.valueOf()) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $avh4$elm_color$Color$scaleFrom255 = function (c) {
	return c / 255;
};
var $avh4$elm_color$Color$rgb255 = F3(
	function (r, g, b) {
		return A4(
			$avh4$elm_color$Color$RgbaSpace,
			$avh4$elm_color$Color$scaleFrom255(r),
			$avh4$elm_color$Color$scaleFrom255(g),
			$avh4$elm_color$Color$scaleFrom255(b),
			1.0);
	});
var $gampleman$elm_visualization$Scale$Color$hexToColor = function (hex) {
	return function (s) {
		var r = A2(
			$elm$core$Result$withDefault,
			0,
			$rtfeldman$elm_hex$Hex$fromString(
				A3($elm$core$String$slice, 0, 2, s)));
		var g = A2(
			$elm$core$Result$withDefault,
			0,
			$rtfeldman$elm_hex$Hex$fromString(
				A3($elm$core$String$slice, 2, 4, s)));
		var b = A2(
			$elm$core$Result$withDefault,
			0,
			$rtfeldman$elm_hex$Hex$fromString(
				A3($elm$core$String$slice, 4, 6, s)));
		return A3($avh4$elm_color$Color$rgb255, r, g, b);
	}(
		A2($elm$core$String$dropLeft, 1, hex));
};
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $gampleman$elm_visualization$Interpolation$piecewise = F3(
	function (makeInterpolator, head, tail) {
		var n = $elm$core$List$length(tail);
		var interpolators = $elm$core$Array$fromList(
			$elm$core$List$reverse(
				A3(
					$elm$core$List$foldl,
					F2(
						function (item, _v0) {
							var prev = _v0.a;
							var accu = _v0.b;
							return _Utils_Tuple2(
								item,
								A2(
									$elm$core$List$cons,
									A2(makeInterpolator, prev, item),
									accu));
						}),
					_Utils_Tuple2(head, _List_Nil),
					tail).b));
		return function (t) {
			var tn = t * n;
			var i = A3(
				$elm$core$Basics$clamp,
				0,
				n - 1,
				$elm$core$Basics$floor(tn));
			return A2(
				$elm$core$Maybe$withDefault,
				head,
				A2(
					$elm$core$Maybe$map,
					function (fn) {
						return fn(tn - i);
					},
					A2($elm$core$Array$get, i, interpolators)));
		};
	});
var $gampleman$elm_visualization$Interpolation$float = F2(
	function (a, to) {
		var b = to - a;
		return function (t) {
			return a + (b * t);
		};
	});
var $gampleman$elm_visualization$Interpolation$gammaCorrected = F3(
	function (gamma, from, to) {
		if (gamma === 1) {
			return A2($gampleman$elm_visualization$Interpolation$float, from, to);
		} else {
			var y = 1 / gamma;
			var a = A2($elm$core$Basics$pow, from, gamma);
			var b = A2($elm$core$Basics$pow, to, gamma) - a;
			return function (t) {
				return A2($elm$core$Basics$pow, a + (t * b), y);
			};
		}
	});
var $gampleman$elm_visualization$Interpolation$map4 = F5(
	function (fn, a, b, c, d) {
		return function (t) {
			return A4(
				fn,
				a(t),
				b(t),
				c(t),
				d(t));
		};
	});
var $avh4$elm_color$Color$rgba = F4(
	function (r, g, b, a) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, a);
	});
var $avh4$elm_color$Color$toRgba = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	return {alpha: a, blue: b, green: g, red: r};
};
var $gampleman$elm_visualization$Interpolation$rgbWithGamma = F3(
	function (gamma, from, to) {
		var start = $avh4$elm_color$Color$toRgba(from);
		var end = $avh4$elm_color$Color$toRgba(to);
		var c = $gampleman$elm_visualization$Interpolation$gammaCorrected(gamma);
		return A5(
			$gampleman$elm_visualization$Interpolation$map4,
			$avh4$elm_color$Color$rgba,
			A2(c, start.red, end.red),
			A2(c, start.green, end.green),
			A2(c, start.blue, end.blue),
			A2($gampleman$elm_visualization$Interpolation$float, start.alpha, end.alpha));
	});
var $gampleman$elm_visualization$Interpolation$rgb = $gampleman$elm_visualization$Interpolation$rgbWithGamma(1.0);
var $elm$core$Basics$round = _Basics_round;
var $gampleman$elm_visualization$Scale$Color$toHexColorStrings = function (palette) {
	var n = $elm$core$Basics$round(
		$elm$core$String$length(palette) / 6);
	var f = function (i) {
		return '#' + A3($elm$core$String$slice, i * 6, (i + 1) * 6, palette);
	};
	return $elm$core$Array$toList(
		A2($elm$core$Array$initialize, n, f));
};
var $gampleman$elm_visualization$Scale$Color$mkPiecewiseInterpolator = function (values) {
	var hexColors = $gampleman$elm_visualization$Scale$Color$toHexColorStrings(values);
	var tail = A2(
		$elm$core$List$map,
		$gampleman$elm_visualization$Scale$Color$hexToColor,
		A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(hexColors)));
	var head = $gampleman$elm_visualization$Scale$Color$hexToColor(
		A2(
			$elm$core$Maybe$withDefault,
			'#fff',
			$elm$core$List$head(hexColors)));
	return A3($gampleman$elm_visualization$Interpolation$piecewise, $gampleman$elm_visualization$Interpolation$rgb, head, tail);
};
var $gampleman$elm_visualization$Scale$Color$lightMultiInterpolator = $gampleman$elm_visualization$Scale$Color$mkPiecewiseInterpolator('e0f1f2c4e9d0b0de9fd0e181f6e072f6c053f3993ef77440ef4a3c');
var $gampleman$elm_visualization$Statistics$extentBy = F2(
	function (fn, list) {
		var min = F2(
			function (a, b) {
				return (_Utils_cmp(
					fn(a),
					fn(b)) < 0) ? a : b;
			});
		var max = F2(
			function (a, b) {
				return (_Utils_cmp(
					fn(a),
					fn(b)) > 0) ? a : b;
			});
		var helper = F2(
			function (l, _v0) {
				helper:
				while (true) {
					var mini = _v0.a;
					var maxi = _v0.b;
					if (!l.b) {
						return _Utils_Tuple2(mini, maxi);
					} else {
						var x = l.a;
						var xs = l.b;
						var $temp$l = xs,
							$temp$_v0 = _Utils_Tuple2(
							A2(min, mini, x),
							A2(max, maxi, x));
						l = $temp$l;
						_v0 = $temp$_v0;
						continue helper;
					}
				}
			});
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var x = list.a;
			var xs = list.b;
			return $elm$core$Maybe$Just(
				A2(
					helper,
					xs,
					_Utils_Tuple2(x, x)));
		}
	});
var $gampleman$elm_visualization$Statistics$extent = $gampleman$elm_visualization$Statistics$extentBy($elm$core$Basics$identity);
var $gampleman$elm_visualization$Scale$Scale = function (a) {
	return {$: 'Scale', a: a};
};
var $gampleman$elm_visualization$Scale$Continuous$normalize = F2(
	function (a, b) {
		var c = b - a;
		return (!c) ? $elm$core$Basics$always(0.5) : ($elm$core$Basics$isNaN(c) ? $elm$core$Basics$always(0 / 0) : function (x) {
			return (x - a) / c;
		});
	});
var $gampleman$elm_visualization$Scale$Continuous$bimap = F3(
	function (_v0, _v1, interpolate) {
		var d0 = _v0.a;
		var d1 = _v0.b;
		var r0 = _v1.a;
		var r1 = _v1.b;
		var _v2 = (_Utils_cmp(d1, d0) < 0) ? _Utils_Tuple2(
			A2($gampleman$elm_visualization$Scale$Continuous$normalize, d1, d0),
			A2(interpolate, r1, r0)) : _Utils_Tuple2(
			A2($gampleman$elm_visualization$Scale$Continuous$normalize, d0, d1),
			A2(interpolate, r0, r1));
		var de = _v2.a;
		var re = _v2.b;
		return A2($elm$core$Basics$composeL, re, de);
	});
var $gampleman$elm_visualization$Scale$Continuous$convertTransform = F4(
	function (transform, interpolate, _v0, range) {
		var d0 = _v0.a;
		var d1 = _v0.b;
		return A2(
			$elm$core$Basics$composeR,
			transform,
			A3(
				$gampleman$elm_visualization$Scale$Continuous$bimap,
				_Utils_Tuple2(
					transform(d0),
					transform(d1)),
				range,
				interpolate));
	});
var $gampleman$elm_visualization$Scale$Continuous$invertTransform = F4(
	function (transform, untransform, _v0, range) {
		var d0 = _v0.a;
		var d1 = _v0.b;
		return A2(
			$elm$core$Basics$composeR,
			A3(
				$gampleman$elm_visualization$Scale$Continuous$bimap,
				range,
				_Utils_Tuple2(
					transform(d0),
					transform(d1)),
				$gampleman$elm_visualization$Interpolation$float),
			untransform);
	});
var $gampleman$elm_visualization$Scale$Continuous$fixPoint = F3(
	function (maxIterations, initialInput, fn) {
		var helper = F2(
			function (iters, _v0) {
				helper:
				while (true) {
					var a = _v0.a;
					var b = _v0.b;
					if (_Utils_cmp(iters + 1, maxIterations) > -1) {
						return b;
					} else {
						var _v1 = fn(b);
						var outA = _v1.a;
						var outB = _v1.b;
						if (_Utils_eq(outA, a)) {
							return b;
						} else {
							if (!outA) {
								return b;
							} else {
								var $temp$iters = iters + 1,
									$temp$_v0 = _Utils_Tuple2(outA, outB);
								iters = $temp$iters;
								_v0 = $temp$_v0;
								continue helper;
							}
						}
					}
				}
			});
		return A2(
			helper,
			1,
			fn(initialInput));
	});
var $elm$core$Basics$e = _Basics_e;
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $gampleman$elm_visualization$Scale$Continuous$e10 = $elm$core$Basics$sqrt(50);
var $gampleman$elm_visualization$Scale$Continuous$e2 = $elm$core$Basics$sqrt(2);
var $gampleman$elm_visualization$Scale$Continuous$e5 = $elm$core$Basics$sqrt(10);
var $gampleman$elm_visualization$Scale$Continuous$ln10 = A2($elm$core$Basics$logBase, $elm$core$Basics$e, 10);
var $gampleman$elm_visualization$Scale$Continuous$tickIncrement = F3(
	function (start, stop, count) {
		var step = (stop - start) / A2($elm$core$Basics$max, 0, count);
		var powr = $elm$core$Basics$floor(
			A2($elm$core$Basics$logBase, $elm$core$Basics$e, step) / $gampleman$elm_visualization$Scale$Continuous$ln10);
		var error = step / A2($elm$core$Basics$pow, 10, powr);
		var order = (_Utils_cmp(error, $gampleman$elm_visualization$Scale$Continuous$e10) > -1) ? 10 : ((_Utils_cmp(error, $gampleman$elm_visualization$Scale$Continuous$e5) > -1) ? 5 : ((_Utils_cmp(error, $gampleman$elm_visualization$Scale$Continuous$e2) > -1) ? 2 : 1));
		return (powr >= 0) ? (order * A2($elm$core$Basics$pow, 10, powr)) : ((-A2($elm$core$Basics$pow, 10, -powr)) / order);
	});
var $gampleman$elm_visualization$Scale$Continuous$withNormalizedDomain = F2(
	function (fn, _v0) {
		var a = _v0.a;
		var b = _v0.b;
		if (_Utils_cmp(a, b) < 0) {
			return fn(
				_Utils_Tuple2(a, b));
		} else {
			var _v1 = fn(
				_Utils_Tuple2(b, a));
			var d = _v1.a;
			var c = _v1.b;
			return _Utils_Tuple2(c, d);
		}
	});
var $gampleman$elm_visualization$Scale$Continuous$nice = F2(
	function (domain, count) {
		var computation = function (_v0) {
			var start = _v0.a;
			var stop = _v0.b;
			var step = A3($gampleman$elm_visualization$Scale$Continuous$tickIncrement, start, stop, count);
			return _Utils_Tuple2(
				step,
				(step > 0) ? _Utils_Tuple2(
					$elm$core$Basics$floor(start / step) * step,
					$elm$core$Basics$ceiling(stop / step) * step) : ((step < 0) ? _Utils_Tuple2(
					$elm$core$Basics$ceiling(start * step) / step,
					$elm$core$Basics$floor(stop * step) / step) : _Utils_Tuple2(start, stop)));
		};
		return A2(
			$gampleman$elm_visualization$Scale$Continuous$withNormalizedDomain,
			function (dmn) {
				return A3($gampleman$elm_visualization$Scale$Continuous$fixPoint, 10, dmn, computation);
			},
			domain);
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $gampleman$elm_visualization$Scale$Continuous$exponent = function (num) {
	var helper = F2(
		function (soFar, x) {
			helper:
			while (true) {
				if (!x) {
					return soFar;
				} else {
					if (x < 1) {
						var $temp$soFar = 1 + soFar,
							$temp$x = x * 10;
						soFar = $temp$soFar;
						x = $temp$x;
						continue helper;
					} else {
						return soFar;
					}
				}
			}
		});
	return A2(helper, 0, num);
};
var $gampleman$elm_visualization$Scale$Continuous$precisionFixed = function (step) {
	return A2(
		$elm$core$Basics$max,
		0,
		$gampleman$elm_visualization$Scale$Continuous$exponent(
			$elm$core$Basics$abs(step)));
};
var $gampleman$elm_visualization$Statistics$tickStep = F3(
	function (start, stop, count) {
		var step0 = $elm$core$Basics$abs(stop - start) / A2($elm$core$Basics$max, 0, count);
		var step1 = A2(
			$elm$core$Basics$pow,
			10,
			$elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Basics$e, step0) / A2($elm$core$Basics$logBase, $elm$core$Basics$e, 10)));
		var error = step0 / step1;
		var step2 = (_Utils_cmp(
			error,
			$elm$core$Basics$sqrt(50)) > -1) ? (step1 * 10) : ((_Utils_cmp(
			error,
			$elm$core$Basics$sqrt(10)) > -1) ? (step1 * 5) : ((_Utils_cmp(
			error,
			$elm$core$Basics$sqrt(2)) > -1) ? (step1 * 2) : step1));
		return (_Utils_cmp(stop, start) < 0) ? (-step2) : step2;
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $gampleman$elm_visualization$Scale$Continuous$toFixed = F2(
	function (precision, value) {
		var power_ = A2($elm$core$Basics$pow, 10, precision);
		var pad = function (num) {
			_v0$2:
			while (true) {
				if (num.b) {
					if (num.b.b) {
						if (!num.b.b.b) {
							var x = num.a;
							var _v1 = num.b;
							var y = _v1.a;
							return _List_fromArray(
								[
									x,
									A3(
									$elm$core$String$padRight,
									precision,
									_Utils_chr('0'),
									y)
								]);
						} else {
							break _v0$2;
						}
					} else {
						var val = num.a;
						return (precision > 0) ? _List_fromArray(
							[
								val,
								A3(
								$elm$core$String$padRight,
								precision,
								_Utils_chr('0'),
								'')
							]) : _List_fromArray(
							[val]);
					}
				} else {
					break _v0$2;
				}
			}
			var val = num;
			return val;
		};
		return A2(
			$elm$core$String$join,
			'.',
			pad(
				A2(
					$elm$core$String$split,
					'.',
					$elm$core$String$fromFloat(
						$elm$core$Basics$round(value * power_) / power_))));
	});
var $gampleman$elm_visualization$Scale$Continuous$tickFormat = F2(
	function (_v0, count) {
		var start = _v0.a;
		var stop = _v0.b;
		return $gampleman$elm_visualization$Scale$Continuous$toFixed(
			$gampleman$elm_visualization$Scale$Continuous$precisionFixed(
				A3($gampleman$elm_visualization$Statistics$tickStep, start, stop, count)));
	});
var $elmcraft$core_extra$Float$Extra$range = F3(
	function (start, stop, step) {
		if (!step) {
			return _List_Nil;
		} else {
			var n = A2(
				$elm$core$Basics$max,
				0,
				$elm$core$Basics$ceiling((stop - start) / step));
			var helper = F2(
				function (i, list) {
					helper:
					while (true) {
						if (i >= 0) {
							var $temp$i = i - 1,
								$temp$list = A2($elm$core$List$cons, start + (step * i), list);
							i = $temp$i;
							list = $temp$list;
							continue helper;
						} else {
							return list;
						}
					}
				});
			return A2(helper, n - 1, _List_Nil);
		}
	});
var $gampleman$elm_visualization$Statistics$range = $elmcraft$core_extra$Float$Extra$range;
var $gampleman$elm_visualization$Statistics$ticks = F3(
	function (start, stop, count) {
		var step = A3($gampleman$elm_visualization$Statistics$tickStep, start, stop, count);
		var end = ($elm$core$Basics$floor(stop / step) * step) + (step / 2);
		var beg = $elm$core$Basics$ceiling(start / step) * step;
		return A3($gampleman$elm_visualization$Statistics$range, beg, end, step);
	});
var $gampleman$elm_visualization$Scale$Continuous$ticks = F2(
	function (_v0, count) {
		var start = _v0.a;
		var end = _v0.b;
		return A3($gampleman$elm_visualization$Statistics$ticks, start, end, count);
	});
var $gampleman$elm_visualization$Scale$Continuous$scaleWithTransform = F4(
	function (transform, untransform, range_, domain_) {
		return {
			convert: A2($gampleman$elm_visualization$Scale$Continuous$convertTransform, transform, $gampleman$elm_visualization$Interpolation$float),
			domain: domain_,
			invert: A2($gampleman$elm_visualization$Scale$Continuous$invertTransform, transform, untransform),
			nice: $gampleman$elm_visualization$Scale$Continuous$nice,
			range: range_,
			rangeExtent: F2(
				function (_v0, r) {
					return r;
				}),
			tickFormat: $gampleman$elm_visualization$Scale$Continuous$tickFormat,
			ticks: $gampleman$elm_visualization$Scale$Continuous$ticks
		};
	});
var $gampleman$elm_visualization$Scale$Continuous$linear = A2($gampleman$elm_visualization$Scale$Continuous$scaleWithTransform, $elm$core$Basics$identity, $elm$core$Basics$identity);
var $gampleman$elm_visualization$Scale$linear = F2(
	function (range_, domain_) {
		return $gampleman$elm_visualization$Scale$Scale(
			A2($gampleman$elm_visualization$Scale$Continuous$linear, range_, domain_));
	});
var $author$project$Components$HeatMap$normalize = function (data) {
	return A2(
		$gampleman$elm_visualization$Scale$linear,
		_Utils_Tuple2(0, 1),
		A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, 1),
			$gampleman$elm_visualization$Statistics$extent(data)));
};
var $author$project$Components$HeatMap$scale0to50 = $author$project$Components$HeatMap$normalize(
	A2(
		$elm$core$List$map,
		$elm$core$Basics$toFloat,
		A2($elm$core$List$range, 0, 50)));
var $author$project$Components$HeatMap$colorSchemeGet = function (cellValue) {
	return $elm$core$Basics$isNaN(cellValue) ? $avh4$elm_color$Color$blue : ((cellValue > 50) ? $gampleman$elm_visualization$Scale$Color$lightMultiInterpolator(1.0) : $gampleman$elm_visualization$Scale$Color$lightMultiInterpolator(
		A2($gampleman$elm_visualization$Scale$convert, $author$project$Components$HeatMap$scale0to50, cellValue)));
};
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlJson(value));
	});
var $elm$html$Html$Attributes$property = $elm$virtual_dom$VirtualDom$property;
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Components$HeatMap$emptyCellContent = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'height', '1px')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$property,
					'innerHTML',
					$elm$json$Json$Encode$string('&nbsp;'))
				]),
			_List_Nil)
		]));
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onMouseLeave = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseleave',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseOver = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseover',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $avh4$elm_color$Color$rgb = F3(
	function (r, g, b) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, 1.0);
	});
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Components$HeatMap$drawCells = F2(
	function (quadHeatMapCells, hmmodel) {
		var maxRowLength = A2(
			$elm$core$Maybe$withDefault,
			1,
			$elm$core$List$maximum(
				A2($elm$core$List$map, $elm$core$List$length, quadHeatMapCells)));
		var firstColumn = function (rowIndex) {
			var labelText = A2(
				$elm$core$Maybe$withDefault,
				'',
				$elm$core$List$head(
					A2($elm$core$List$drop, rowIndex, hmmodel.rowLabels)));
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-size', '60%'),
							A2($elm$html$Html$Attributes$style, 'text-align', 'right')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(labelText)
						]))
				]);
		};
		var fillColor = F3(
			function (row, col, cellvalue) {
				var color = $author$project$Components$HeatMap$colorSchemeGet(cellvalue);
				return $avh4$elm_color$Color$toCssString(
					function () {
						var _v1 = hmmodel.selected;
						if (_v1.$ === 'Just') {
							var cellWithPosition = _v1.a;
							if (_Utils_eq(row, cellWithPosition.row) && _Utils_eq(col, cellWithPosition.column)) {
								var rgb = $avh4$elm_color$Color$toRgba(color);
								var darkConst = 0.75;
								return A3($avh4$elm_color$Color$rgb, rgb.red * darkConst, rgb.green * darkConst, rgb.blue * darkConst);
							} else {
								return color;
							}
						} else {
							return color;
						}
					}());
			});
		var cellWidth = $elm$core$String$fromFloat(75 / maxRowLength) + '%';
		var cellHeight = function (hei) {
			return $elm$core$String$fromFloat(100 / hei) + '%';
		}(
			1 + $elm$core$List$length(quadHeatMapCells));
		var firstRowLabels = function (labels) {
			return A2(
				$elm$html$Html$tr,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'height', cellHeight)
					]),
				A2(
					$elm$core$List$map,
					function (text) {
						return A2(
							$elm$html$Html$td,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '60%'),
									A2($elm$html$Html$Attributes$style, 'text-align', 'center')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(text)
								]));
					},
					A2($elm$core$List$cons, '', labels)));
		};
		var cellAttributes = F3(
			function (row, col, cell) {
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$Attributes$style,
						'background-color',
						A3(fillColor, row, col, cell.value)),
						A2($elm$html$Html$Attributes$style, 'border', '2px solid black'),
						$elm$html$Html$Attributes$title(cell.message),
						$elm$html$Html$Events$onMouseOver(
						$author$project$Model$OnHoverHeatMap(
							{column: col, message: cell.message, row: row, value: cell.value})),
						$elm$html$Html$Events$onMouseLeave($author$project$Model$OnLeaveHeatMap)
					]);
			});
		var toTableRow = F2(
			function (rowIndex, cellList) {
				return A2(
					$elm$html$Html$tr,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'height', cellHeight)
						]),
					_Utils_ap(
						firstColumn(rowIndex),
						A2(
							$elm$core$List$indexedMap,
							function (col) {
								return function (cell) {
									if (cell.$ === 'Just') {
										var c = cell.a;
										return A2(
											$elm$html$Html$td,
											A3(cellAttributes, rowIndex, col, c),
											_List_fromArray(
												[$author$project$Components$HeatMap$emptyCellContent]));
									} else {
										return A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'background-color', '#000000ff'),
													A2($elm$html$Html$Attributes$style, 'border', '2px solid black')
												]),
											_List_fromArray(
												[$author$project$Components$HeatMap$emptyCellContent]));
									}
								};
							},
							cellList)));
			});
		var rows = function (tableRows) {
			return A2(
				$elm$core$List$cons,
				firstRowLabels(hmmodel.columnLabels),
				tableRows);
		}(
			A2($elm$core$List$indexedMap, toTableRow, quadHeatMapCells));
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', 'auto'),
					A2($elm$html$Html$Attributes$style, 'border-collapse', 'collapse')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$colgroup,
					_List_Nil,
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$col,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'width', '15%')
								]),
							_List_Nil),
						A2(
							$elm$core$List$repeat,
							maxRowLength,
							A2(
								$elm$html$Html$col,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'width', cellWidth)
									]),
								_List_Nil)))),
					A2(
					$elm$html$Html$tbody,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'height', 'auto')
						]),
					rows)
				]));
	});
var $author$project$Components$HeatMap$legend = function (_v0) {
	var ticks = A2(
		$elm$core$List$map,
		function (i) {
			return i * 5;
		},
		A2($elm$core$List$range, 0, 10));
	var swatch = function (v) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'width', '24px'),
					A2($elm$html$Html$Attributes$style, 'height', '12px'),
					A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
					A2(
					$elm$html$Html$Attributes$style,
					'background-color',
					$avh4$elm_color$Color$toCssString(
						$author$project$Components$HeatMap$colorSchemeGet(v)))
				]),
			_List_Nil);
	};
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
						A2($elm$html$Html$Attributes$style, 'color', '#555'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '4px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Legend (medals per cell, 0 … 50+)')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
						A2($elm$html$Html$Attributes$style, 'gap', '6px')
					]),
				A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
								A2($elm$html$Html$Attributes$style, 'color', '#555')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('0')
							])),
					_Utils_ap(
						A2($elm$core$List$map, swatch, ticks),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
										A2($elm$html$Html$Attributes$style, 'color', '#555')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('50+')
									]))
							]))))
			]));
};
var $author$project$Components$HeatMap$heatmap = function (hmmodel) {
	var maxRowLength = A2(
		$elm$core$Maybe$withDefault,
		1,
		$elm$core$List$maximum(
			A2($elm$core$List$map, $elm$core$List$length, hmmodel.data)));
	var quadHeatMapCells = A2(
		$elm$core$List$map,
		function (row) {
			var missingCells = maxRowLength - $elm$core$List$length(row);
			return (missingCells > 0) ? A2(
				$elm$core$List$append,
				row,
				A2($elm$core$List$repeat, missingCells, $elm$core$Maybe$Nothing)) : row;
		},
		A2(
			$elm$core$List$map,
			$elm$core$List$map(
				function (v) {
					return $elm$core$Maybe$Just(
						{
							column: 0,
							message: $elm$core$String$fromFloat(v),
							row: 0,
							value: v
						});
				}),
			hmmodel.data));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '500px'),
				A2($elm$html$Html$Attributes$style, 'border', 'solid 1px black'),
				A2($elm$html$Html$Attributes$style, 'padding', '8px'),
				A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
				A2($elm$html$Html$Attributes$style, 'gap', '8px')
			]),
		_List_fromArray(
			[
				A2($author$project$Components$HeatMap$drawCells, quadHeatMapCells, hmmodel),
				$author$project$Components$HeatMap$legend(hmmodel)
			]));
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $author$project$View$nextLink = function (target) {
	return A2(
		$elm$html$Html$a,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$href(target),
				A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
				A2($elm$html$Html$Attributes$style, 'padding', '10px 16px'),
				A2($elm$html$Html$Attributes$style, 'background-color', '#007cba'),
				A2($elm$html$Html$Attributes$style, 'color', '#fff'),
				A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
				A2($elm$html$Html$Attributes$style, 'text-decoration', 'none')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Weiter')
			]));
};
var $author$project$View$heatmapSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('heatmap'),
				A2($elm$html$Html$Attributes$style, 'margin', '60px 0'),
				A2($elm$html$Html$Attributes$style, 'padding', '20px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'max-width', '900px'),
						A2($elm$html$Html$Attributes$style, 'margin', '0 auto')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'left'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px'),
								A2($elm$html$Html$Attributes$style, 'color', '#333')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('4. Medaillen Entwicklung')
							])),
						function () {
						if (model.loading) {
							return A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Lade Daten...')
									]));
						} else {
							var _v0 = model.error;
							if (_v0.$ === 'Just') {
								var err = _v0.a;
								return A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', '#b00020')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Fehler beim Laden: ' + err)
										]));
							} else {
								return $elm$html$Html$text('');
							}
						}
					}(),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'gap', '12px')
							]),
						_List_fromArray(
							[
								$author$project$Components$HeatMap$heatmap(model.heatmapmodel),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
										A2($elm$html$Html$Attributes$style, 'color', '#555')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Tip: Hover cells to see values. Only the last 7 Olympics and countries with ≤6 letters are shown for performance.')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'text-align', 'right'),
						A2($elm$html$Html$Attributes$style, 'max-width', '900px'),
						A2($elm$html$Html$Attributes$style, 'margin', '10px auto 0')
					]),
				_List_fromArray(
					[
						$author$project$View$nextLink('#medaillenspiegel')
					]))
			]));
};
var $author$project$Model$HoverMedalTable = function (a) {
	return {$: 'HoverMedalTable', a: a};
};
var $author$project$Model$SelectCountryFromTable = function (a) {
	return {$: 'SelectCountryFromTable', a: a};
};
var $author$project$Model$SetTableCriterion = function (a) {
	return {$: 'SetTableCriterion', a: a};
};
var $author$project$View$roundTo = F2(
	function (n, v) {
		var factor = A2($elm$core$Basics$pow, 10, n);
		return $elm$core$Basics$round(v * factor) / factor;
	});
var $elm_community$list_extra$List$Extra$dropWhile = F2(
	function (predicate, list) {
		dropWhile:
		while (true) {
			if (!list.b) {
				return _List_Nil;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					var $temp$predicate = predicate,
						$temp$list = xs;
					predicate = $temp$predicate;
					list = $temp$list;
					continue dropWhile;
				} else {
					return list;
				}
			}
		}
	});
var $elm$core$String$fromList = _String_fromList;
var $author$project$View$trimFloat = function (s) {
	if (A2($elm$core$String$contains, '.', s)) {
		var noZeros = $elm$core$String$fromList(
			$elm$core$List$reverse(
				function (cs) {
					if (cs.b && ('.' === cs.a.valueOf())) {
						var rest = cs.b;
						return rest;
					} else {
						return cs;
					}
				}(
					A2(
						$elm_community$list_extra$List$Extra$dropWhile,
						function (c) {
							return _Utils_eq(
								c,
								_Utils_chr('0'));
						},
						$elm$core$List$reverse(
							$elm$core$String$toList(s))))));
		return (noZeros === '-0') ? '0' : noZeros;
	} else {
		return s;
	}
};
var $author$project$View$formatFixed = F2(
	function (n, v) {
		return $author$project$View$trimFloat(
			$elm$core$String$fromFloat(
				A2($author$project$View$roundTo, n, v)));
	});
var $author$project$View$formatRelativeValue = F2(
	function (axisId, v) {
		switch (axisId) {
			case 'pop':
				var threshold = 0.001;
				var per1M = v * 1.0e6;
				var a = $elm$core$Basics$abs(per1M);
				if (!per1M) {
					return '0';
				} else {
					if (_Utils_cmp(a, threshold) < 0) {
						return '<0.001';
					} else {
						var decs = (a >= 100) ? 0 : ((a >= 10) ? 1 : ((a >= 1) ? 2 : ((a >= 0.1) ? 3 : 4)));
						return A2($author$project$View$formatFixed, decs, per1M);
					}
				}
			case 'gdp':
				var threshold = 0.001;
				var per1B = v * 1.0e9;
				var a = $elm$core$Basics$abs(per1B);
				if (!per1B) {
					return '0';
				} else {
					if (_Utils_cmp(a, threshold) < 0) {
						return '<0.001';
					} else {
						var decs = (a >= 100) ? 0 : ((a >= 10) ? 1 : ((a >= 1) ? 2 : ((a >= 0.1) ? 3 : 4)));
						return A2($author$project$View$formatFixed, decs, per1B);
					}
				}
			case 'age':
				return A2($author$project$View$formatFixed, 3, v);
			default:
				return A2($author$project$View$formatFixed, 3, v);
		}
	});
var $author$project$View$formatWithSuffix = function (v) {
	var absV = $elm$core$Basics$abs(v);
	return (absV >= 1.0e12) ? (A2($author$project$View$formatFixed, 1, v / 1.0e12) + 'T') : ((absV >= 1.0e9) ? (A2($author$project$View$formatFixed, 1, v / 1.0e9) + 'B') : ((absV >= 1.0e6) ? (A2($author$project$View$formatFixed, 1, v / 1.0e6) + 'M') : ((absV >= 1.0e3) ? (A2($author$project$View$formatFixed, 0, v / 1.0e3) + 'K') : A2($author$project$View$formatFixed, 0, v))));
};
var $author$project$View$formatPcValue = F3(
	function (useRelative, axisId, v) {
		if (useRelative) {
			return A2($author$project$View$formatRelativeValue, axisId, v);
		} else {
			switch (axisId) {
				case 'pop':
					return $author$project$View$formatWithSuffix(v);
				case 'gdp':
					return $author$project$View$formatWithSuffix(v);
				case 'age':
					return A2($author$project$View$formatFixed, 0, v);
				default:
					return A2($author$project$View$formatFixed, 0, v);
			}
		}
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Events$onMouseEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseenter',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$View$medaillenspiegelSection = function (model) {
	var selectedId = model.tableCriterion;
	var relHeader = function () {
		switch (selectedId) {
			case 'pop':
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$th,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'padding', '12px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Model$axisLabel('pop') + ' (Wert)')
							])),
						A2(
						$elm$html$Html$th,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'padding', '12px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Med/Pop')
							]))
					]);
			case 'gdp':
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$th,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'padding', '12px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Model$axisLabel('gdp') + ' (Wert)')
							])),
						A2(
						$elm$html$Html$th,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'padding', '12px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Med/GDP')
							]))
					]);
			case 'age':
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$th,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'padding', '12px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Model$axisLabel('age') + ' (Wert)')
							])),
						A2(
						$elm$html$Html$th,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'padding', '12px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Med/Age')
							]))
					]);
			default:
				return _List_Nil;
		}
	}();
	var popBy = A2(
		$elm$core$Dict$map,
		F2(
			function (_v5, v) {
				return v.population;
			}),
		model.populationByCountry);
	var medalTotalBy = $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (r) {
				return _Utils_Tuple2(r.country, r.total);
			},
			model.medalTable));
	var gdpBy = model.gdpByCountry;
	var ageBy = A2(
		$elm$core$Dict$map,
		F2(
			function (_v4, v) {
				return v.medianAge;
			}),
		model.populationByCountry);
	var relByCountry = function () {
		switch (selectedId) {
			case 'pop':
				return A3(
					$elm$core$Dict$foldl,
					F3(
						function (country, pop, acc) {
							var m = A2(
								$elm$core$Maybe$withDefault,
								0,
								A2($elm$core$Dict$get, country, medalTotalBy));
							return (pop <= 0) ? acc : A3($elm$core$Dict$insert, country, m / pop, acc);
						}),
					$elm$core$Dict$empty,
					popBy);
			case 'gdp':
				return A3(
					$elm$core$Dict$foldl,
					F3(
						function (country, gdp, acc) {
							var m = A2(
								$elm$core$Maybe$withDefault,
								0,
								A2($elm$core$Dict$get, country, medalTotalBy));
							return (gdp <= 0) ? acc : A3($elm$core$Dict$insert, country, m / gdp, acc);
						}),
					$elm$core$Dict$empty,
					gdpBy);
			case 'age':
				return A3(
					$elm$core$Dict$foldl,
					F3(
						function (country, age, acc) {
							var m = A2(
								$elm$core$Maybe$withDefault,
								0,
								A2($elm$core$Dict$get, country, medalTotalBy));
							return (age <= 0) ? acc : A3($elm$core$Dict$insert, country, m / age, acc);
						}),
					$elm$core$Dict$empty,
					ageBy);
			default:
				return $elm$core$Dict$empty;
		}
	}();
	var rankByCountry = function () {
		if (selectedId === 'medals') {
			return $elm$core$Dict$fromList(
				A2(
					$elm$core$List$map,
					function (r) {
						return _Utils_Tuple2(r.country, r.placement);
					},
					model.medalTable));
		} else {
			var namesSorted = A2(
				$elm$core$List$map,
				function ($) {
					return $.country;
				},
				A2(
					$elm$core$List$sortWith,
					F2(
						function (a, b) {
							return A2(
								$elm$core$Basics$compare,
								A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($elm$core$Dict$get, b.country, relByCountry)),
								A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($elm$core$Dict$get, a.country, relByCountry)));
						}),
					model.medalTable));
			return $elm$core$Dict$fromList(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (i, name) {
							return _Utils_Tuple2(name, i + 1);
						}),
					namesSorted));
		}
	}();
	var sortedRows = (selectedId === 'medals') ? A2(
		$elm$core$List$sortBy,
		function ($) {
			return $.placement;
		},
		model.medalTable) : A2(
		$elm$core$List$sortWith,
		F2(
			function (a, b) {
				return A2(
					$elm$core$Basics$compare,
					A2(
						$elm$core$Maybe$withDefault,
						0,
						A2($elm$core$Dict$get, b.country, relByCountry)),
					A2(
						$elm$core$Maybe$withDefault,
						0,
						A2($elm$core$Dict$get, a.country, relByCountry)));
			}),
		model.medalTable);
	var absByCountry = function () {
		switch (selectedId) {
			case 'pop':
				return popBy;
			case 'gdp':
				return gdpBy;
			case 'age':
				return ageBy;
			default:
				return $elm$core$Dict$empty;
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('medaillenspiegel'),
				A2($elm$html$Html$Attributes$style, 'margin', '60px 0'),
				A2($elm$html$Html$Attributes$style, 'padding', '20px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'max-width', '900px'),
						A2($elm$html$Html$Attributes$style, 'margin', '0 auto')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'left'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px'),
								A2($elm$html$Html$Attributes$style, 'color', '#333')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('1. Medaillenspiegel')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'max-width', '950px'),
								A2($elm$html$Html$Attributes$style, 'margin', '8px auto 0'),
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'color', '#555'),
								A2($elm$html$Html$Attributes$style, 'font-size', '12px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Tip: Click any table row to select the country and jump to its medal distribution below.')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin', '8px 0 16px 0'),
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'flex'),
										A2($elm$html$Html$Attributes$style, 'gap', '8px'),
										A2($elm$html$Html$Attributes$style, 'align-items', 'center')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Kriterium für Ranking:')
											])),
										A2(
										$elm$html$Html$select,
										_List_fromArray(
											[
												$elm$html$Html$Events$onInput($author$project$Model$SetTableCriterion)
											]),
										A2(
											$elm$core$List$map,
											function (ax) {
												return _Utils_eq(ax.id, selectedId) ? A2(
													$elm$html$Html$option,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$selected(true),
															$elm$html$Html$Attributes$value(ax.id)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(
															$author$project$Model$axisLabel(ax.id))
														])) : A2(
													$elm$html$Html$option,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$value(ax.id)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(
															$author$project$Model$axisLabel(ax.id))
														]));
											},
											model.pcmodel.axes))
									])),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href('#parallele-koordinaten'),
										A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
										A2($elm$html$Html$Attributes$style, 'padding', '8px 12px'),
										A2($elm$html$Html$Attributes$style, 'background-color', '#007cba'),
										A2($elm$html$Html$Attributes$style, 'color', '#fff'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'text-decoration', 'none')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Vergleiche Kriterien')
									]))
							])),
						function () {
						if (model.loading) {
							return A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Lade Daten...')
									]));
						} else {
							var _v0 = model.error;
							if (_v0.$ === 'Just') {
								var err = _v0.a;
								return A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', '#b00020')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Fehler beim Laden: ' + err)
										]));
							} else {
								return $elm$html$Html$text('');
							}
						}
					}(),
						A2(
						$elm$html$Html$table,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'width', '100%'),
								A2($elm$html$Html$Attributes$style, 'border-collapse', 'collapse')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$thead,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$tr,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'background-color', '#007cba'),
												A2($elm$html$Html$Attributes$style, 'color', 'white')
											]),
										_Utils_ap(
											_List_fromArray(
												[
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'text-align', 'left'),
															A2($elm$html$Html$Attributes$style, 'padding', '12px')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Platz')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'text-align', 'left'),
															A2($elm$html$Html$Attributes$style, 'padding', '12px')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Land')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
															A2($elm$html$Html$Attributes$style, 'padding', '12px')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Gold')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
															A2($elm$html$Html$Attributes$style, 'padding', '12px')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Silber')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
															A2($elm$html$Html$Attributes$style, 'padding', '12px')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Bronze')
														])),
													A2(
													$elm$html$Html$th,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
															A2($elm$html$Html$Attributes$style, 'padding', '12px')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Gesamt')
														]))
												]),
											relHeader))
									])),
								A2(
								$elm$html$Html$tbody,
								_List_Nil,
								A2(
									$elm$core$List$map,
									function (r) {
										var rowCursor = 'pointer';
										var relVal = A2($elm$core$Dict$get, r.country, relByCountry);
										var rankVal = A2(
											$elm$core$Maybe$withDefault,
											r.placement,
											A2($elm$core$Dict$get, r.country, rankByCountry));
										var isHovered = _Utils_eq(
											model.hoverTable,
											$elm$core$Maybe$Just(r.country));
										var rowBg = isHovered ? '#e6f5ff' : 'transparent';
										var absVal = A2($elm$core$Dict$get, r.country, absByCountry);
										return A2(
											$elm$html$Html$tr,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid #ddd'),
													A2($elm$html$Html$Attributes$style, 'background-color', rowBg),
													A2($elm$html$Html$Attributes$style, 'cursor', rowCursor),
													$elm$html$Html$Events$onMouseEnter(
													$author$project$Model$HoverMedalTable(
														$elm$core$Maybe$Just(r.country))),
													$elm$html$Html$Events$onMouseLeave(
													$author$project$Model$HoverMedalTable($elm$core$Maybe$Nothing)),
													$elm$html$Html$Events$onClick(
													$author$project$Model$SelectCountryFromTable(r.country))
												]),
											_Utils_ap(
												_List_fromArray(
													[
														A2(
														$elm$html$Html$td,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$style, 'padding', '0')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$a,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$href('#medaillenverteilung'),
																		A2($elm$html$Html$Attributes$style, 'display', 'block'),
																		A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																		A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																		A2($elm$html$Html$Attributes$style, 'text-decoration', 'none')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text(
																		$elm$core$String$fromInt(rankVal))
																	]))
															])),
														A2(
														$elm$html$Html$td,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$style, 'padding', '0')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$a,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$href('#medaillenverteilung'),
																		A2($elm$html$Html$Attributes$style, 'display', 'block'),
																		A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																		A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																		A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
																		A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text(r.country)
																	]))
															])),
														A2(
														$elm$html$Html$td,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$style, 'padding', '0')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$a,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$href('#medaillenverteilung'),
																		A2($elm$html$Html$Attributes$style, 'display', 'block'),
																		A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																		A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																		A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
																		A2($elm$html$Html$Attributes$style, 'text-align', 'center')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text(
																		$elm$core$String$fromInt(r.gold))
																	]))
															])),
														A2(
														$elm$html$Html$td,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$style, 'padding', '0')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$a,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$href('#medaillenverteilung'),
																		A2($elm$html$Html$Attributes$style, 'display', 'block'),
																		A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																		A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																		A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
																		A2($elm$html$Html$Attributes$style, 'text-align', 'center')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text(
																		$elm$core$String$fromInt(r.silver))
																	]))
															])),
														A2(
														$elm$html$Html$td,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$style, 'padding', '0')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$a,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$href('#medaillenverteilung'),
																		A2($elm$html$Html$Attributes$style, 'display', 'block'),
																		A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																		A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																		A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
																		A2($elm$html$Html$Attributes$style, 'text-align', 'center')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text(
																		$elm$core$String$fromInt(r.bronze))
																	]))
															])),
														A2(
														$elm$html$Html$td,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$style, 'padding', '0')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$a,
																_Utils_ap(
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('#medaillenverteilung'),
																			A2($elm$html$Html$Attributes$style, 'display', 'block'),
																			A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																			A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																			A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
																			A2($elm$html$Html$Attributes$style, 'text-align', 'center')
																		]),
																	(selectedId === 'medals') ? _List_fromArray(
																		[
																			A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
																		]) : _List_Nil),
																_List_fromArray(
																	[
																		$elm$html$Html$text(
																		$elm$core$String$fromInt(r.total))
																	]))
															]))
													]),
												function () {
													switch (selectedId) {
														case 'pop':
															return _List_fromArray(
																[
																	A2(
																	$elm$html$Html$td,
																	_List_fromArray(
																		[
																			A2($elm$html$Html$Attributes$style, 'padding', '0')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$a,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$href('#medaillenverteilung'),
																					A2($elm$html$Html$Attributes$style, 'display', 'block'),
																					A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																					A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																					A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
																					A2($elm$html$Html$Attributes$style, 'text-align', 'center')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text(
																					A2(
																						$elm$core$Maybe$withDefault,
																						'-',
																						A2(
																							$elm$core$Maybe$map,
																							A2($author$project$View$formatPcValue, false, 'pop'),
																							absVal)))
																				]))
																		])),
																	A2(
																	$elm$html$Html$td,
																	_List_fromArray(
																		[
																			A2($elm$html$Html$Attributes$style, 'padding', '0')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$a,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$href('#medaillenverteilung'),
																					A2($elm$html$Html$Attributes$style, 'display', 'block'),
																					A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																					A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																					A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
																					A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
																					A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text(
																					A2(
																						$elm$core$Maybe$withDefault,
																						'-',
																						A2(
																							$elm$core$Maybe$map,
																							$author$project$View$formatRelativeValue('pop'),
																							relVal)))
																				]))
																		]))
																]);
														case 'gdp':
															return _List_fromArray(
																[
																	A2(
																	$elm$html$Html$td,
																	_List_fromArray(
																		[
																			A2($elm$html$Html$Attributes$style, 'padding', '0')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$a,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$href('#medaillenverteilung'),
																					A2($elm$html$Html$Attributes$style, 'display', 'block'),
																					A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																					A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																					A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
																					A2($elm$html$Html$Attributes$style, 'text-align', 'center')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text(
																					A2(
																						$elm$core$Maybe$withDefault,
																						'-',
																						A2(
																							$elm$core$Maybe$map,
																							A2($author$project$View$formatPcValue, false, 'gdp'),
																							absVal)))
																				]))
																		])),
																	A2(
																	$elm$html$Html$td,
																	_List_fromArray(
																		[
																			A2($elm$html$Html$Attributes$style, 'padding', '0')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$a,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$href('#medaillenverteilung'),
																					A2($elm$html$Html$Attributes$style, 'display', 'block'),
																					A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																					A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																					A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
																					A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
																					A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text(
																					A2(
																						$elm$core$Maybe$withDefault,
																						'-',
																						A2(
																							$elm$core$Maybe$map,
																							$author$project$View$formatRelativeValue('gdp'),
																							relVal)))
																				]))
																		]))
																]);
														case 'age':
															return _List_fromArray(
																[
																	A2(
																	$elm$html$Html$td,
																	_List_fromArray(
																		[
																			A2($elm$html$Html$Attributes$style, 'padding', '0')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$a,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$href('#medaillenverteilung'),
																					A2($elm$html$Html$Attributes$style, 'display', 'block'),
																					A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																					A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																					A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
																					A2($elm$html$Html$Attributes$style, 'text-align', 'center')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text(
																					A2(
																						$elm$core$Maybe$withDefault,
																						'-',
																						A2(
																							$elm$core$Maybe$map,
																							A2($author$project$View$formatPcValue, false, 'age'),
																							absVal)))
																				]))
																		])),
																	A2(
																	$elm$html$Html$td,
																	_List_fromArray(
																		[
																			A2($elm$html$Html$Attributes$style, 'padding', '0')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$a,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$href('#medaillenverteilung'),
																					A2($elm$html$Html$Attributes$style, 'display', 'block'),
																					A2($elm$html$Html$Attributes$style, 'padding', '10px'),
																					A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
																					A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
																					A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
																					A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text(
																					A2(
																						$elm$core$Maybe$withDefault,
																						'-',
																						A2(
																							$elm$core$Maybe$map,
																							$author$project$View$formatRelativeValue('age'),
																							relVal)))
																				]))
																		]))
																]);
														default:
															return _List_Nil;
													}
												}()));
									},
									sortedRows))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'text-align', 'right'),
						A2($elm$html$Html$Attributes$style, 'max-width', '900px'),
						A2($elm$html$Html$Attributes$style, 'margin', '10px auto 0')
					]),
				_List_fromArray(
					[
						$author$project$View$nextLink('#medaillenverteilung')
					]))
			]));
};
var $author$project$Model$ChangeSBCountry = function (a) {
	return {$: 'ChangeSBCountry', a: a};
};
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm_community$typed_svg$TypedSvg$Types$AnchorMiddle = {$: 'AnchorMiddle'};
var $elm_community$typed_svg$TypedSvg$Types$Paint = function (a) {
	return {$: 'Paint', a: a};
};
var $elm_community$typed_svg$TypedSvg$Types$Translate = F2(
	function (a, b) {
		return {$: 'Translate', a: a, b: b};
	});
var $elm$core$Basics$acos = _Basics_acos;
var $folkertdev$one_true_path_experiment$LowLevel$Command$EllipticalArc = function (a) {
	return {$: 'EllipticalArc', a: a};
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$arcTo = $folkertdev$one_true_path_experiment$LowLevel$Command$EllipticalArc;
var $folkertdev$svg_path_lowlevel$Path$LowLevel$LargestArc = {$: 'LargestArc'};
var $folkertdev$one_true_path_experiment$LowLevel$Command$largestArc = $folkertdev$svg_path_lowlevel$Path$LowLevel$LargestArc;
var $folkertdev$svg_path_lowlevel$Path$LowLevel$SmallestArc = {$: 'SmallestArc'};
var $folkertdev$one_true_path_experiment$LowLevel$Command$smallestArc = $folkertdev$svg_path_lowlevel$Path$LowLevel$SmallestArc;
var $gampleman$elm_visualization$Shape$Pie$boolToArc = function (b) {
	return b ? $folkertdev$one_true_path_experiment$LowLevel$Command$largestArc : $folkertdev$one_true_path_experiment$LowLevel$Command$smallestArc;
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$Clockwise = {$: 'Clockwise'};
var $folkertdev$one_true_path_experiment$LowLevel$Command$clockwise = $folkertdev$svg_path_lowlevel$Path$LowLevel$Clockwise;
var $folkertdev$svg_path_lowlevel$Path$LowLevel$CounterClockwise = {$: 'CounterClockwise'};
var $folkertdev$one_true_path_experiment$LowLevel$Command$counterClockwise = $folkertdev$svg_path_lowlevel$Path$LowLevel$CounterClockwise;
var $gampleman$elm_visualization$Shape$Pie$boolToDirection = function (b) {
	return b ? $folkertdev$one_true_path_experiment$LowLevel$Command$counterClockwise : $folkertdev$one_true_path_experiment$LowLevel$Command$clockwise;
};
var $elm$core$Basics$cos = _Basics_cos;
var $folkertdev$one_true_path_experiment$SubPath$Empty = {$: 'Empty'};
var $folkertdev$one_true_path_experiment$SubPath$empty = $folkertdev$one_true_path_experiment$SubPath$Empty;
var $gampleman$elm_visualization$Shape$Pie$epsilon = 1.0e-12;
var $elm$core$Basics$truncate = _Basics_truncate;
var $gampleman$elm_visualization$Shape$Pie$mod = F2(
	function (a, b) {
		var frac = a / b;
		return (frac - (frac | 0)) * b;
	});
var $folkertdev$one_true_path_experiment$LowLevel$Command$MoveTo = function (a) {
	return {$: 'MoveTo', a: a};
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$moveTo = $folkertdev$one_true_path_experiment$LowLevel$Command$MoveTo;
var $elm$core$Basics$not = _Basics_not;
var $elm$core$Basics$sin = _Basics_sin;
var $folkertdev$one_true_path_experiment$SubPath$SubPath = function (a) {
	return {$: 'SubPath', a: a};
};
var $folkertdev$elm_deque$Deque$Deque = function (a) {
	return {$: 'Deque', a: a};
};
var $folkertdev$elm_deque$Internal$rebalance = function (deque) {
	var sizeF = deque.sizeF;
	var sizeR = deque.sizeR;
	var front = deque.front;
	var rear = deque.rear;
	var size1 = ((sizeF + sizeR) / 2) | 0;
	var size2 = (sizeF + sizeR) - size1;
	var balanceConstant = 4;
	if ((sizeF + sizeR) < 2) {
		return deque;
	} else {
		if (_Utils_cmp(sizeF, (balanceConstant * sizeR) + 1) > 0) {
			var newRear = _Utils_ap(
				rear,
				$elm$core$List$reverse(
					A2($elm$core$List$drop, size1, front)));
			var newFront = A2($elm$core$List$take, size1, front);
			return {front: newFront, rear: newRear, sizeF: size1, sizeR: size2};
		} else {
			if (_Utils_cmp(sizeR, (balanceConstant * sizeF) + 1) > 0) {
				var newRear = A2($elm$core$List$take, size1, rear);
				var newFront = _Utils_ap(
					front,
					$elm$core$List$reverse(
						A2($elm$core$List$drop, size1, rear)));
				return {front: newFront, rear: newRear, sizeF: size1, sizeR: size2};
			} else {
				return deque;
			}
		}
	}
};
var $folkertdev$elm_deque$Internal$fromList = function (list) {
	return $folkertdev$elm_deque$Internal$rebalance(
		{
			front: list,
			rear: _List_Nil,
			sizeF: $elm$core$List$length(list),
			sizeR: 0
		});
};
var $folkertdev$elm_deque$Deque$fromList = A2($elm$core$Basics$composeL, $folkertdev$elm_deque$Deque$Deque, $folkertdev$elm_deque$Internal$fromList);
var $folkertdev$one_true_path_experiment$SubPath$with = F2(
	function (moveto, drawtos) {
		return $folkertdev$one_true_path_experiment$SubPath$SubPath(
			{
				drawtos: $folkertdev$elm_deque$Deque$fromList(drawtos),
				moveto: moveto
			});
	});
var $gampleman$elm_visualization$Shape$Pie$arc_ = F6(
	function (x, y, radius, a0, a1, ccw) {
		var r = $elm$core$Basics$abs(radius);
		if (!r) {
			return $folkertdev$one_true_path_experiment$SubPath$empty;
		} else {
			var tau = 2 * $elm$core$Basics$pi;
			var dy = r * $elm$core$Basics$sin(a0);
			var y0_ = y + dy;
			var dx = r * $elm$core$Basics$cos(a0);
			var x0_ = x + dx;
			var origin = $folkertdev$one_true_path_experiment$LowLevel$Command$moveTo(
				_Utils_Tuple2(x0_, y0_));
			var da = ccw ? (a0 - a1) : (a1 - a0);
			var cw = $gampleman$elm_visualization$Shape$Pie$boolToDirection(!ccw);
			if (_Utils_cmp(da, tau - $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) {
				return A2(
					$folkertdev$one_true_path_experiment$SubPath$with,
					origin,
					_List_fromArray(
						[
							$folkertdev$one_true_path_experiment$LowLevel$Command$arcTo(
							_List_fromArray(
								[
									{
									arcFlag: $folkertdev$one_true_path_experiment$LowLevel$Command$largestArc,
									direction: cw,
									radii: _Utils_Tuple2(r, r),
									target: _Utils_Tuple2(x - dx, y - dy),
									xAxisRotate: 0
								}
								])),
							$folkertdev$one_true_path_experiment$LowLevel$Command$arcTo(
							_List_fromArray(
								[
									{
									arcFlag: $folkertdev$one_true_path_experiment$LowLevel$Command$largestArc,
									direction: cw,
									radii: _Utils_Tuple2(r, r),
									target: _Utils_Tuple2(x0_, y0_),
									xAxisRotate: 0
								}
								]))
						]));
			} else {
				var da_ = (da < 0) ? (A2($gampleman$elm_visualization$Shape$Pie$mod, da, tau) + tau) : da;
				return A2(
					$folkertdev$one_true_path_experiment$SubPath$with,
					origin,
					_List_fromArray(
						[
							$folkertdev$one_true_path_experiment$LowLevel$Command$arcTo(
							_List_fromArray(
								[
									{
									arcFlag: $gampleman$elm_visualization$Shape$Pie$boolToArc(
										_Utils_cmp(da_, $elm$core$Basics$pi) > -1),
									direction: cw,
									radii: _Utils_Tuple2(r, r),
									target: _Utils_Tuple2(
										x + (r * $elm$core$Basics$cos(a1)),
										y + (r * $elm$core$Basics$sin(a1))),
									xAxisRotate: 0
								}
								]))
						]));
			}
		}
	});
var $elm$core$Basics$atan2 = _Basics_atan2;
var $folkertdev$one_true_path_experiment$LowLevel$Command$ClosePath = {$: 'ClosePath'};
var $folkertdev$one_true_path_experiment$LowLevel$Command$closePath = $folkertdev$one_true_path_experiment$LowLevel$Command$ClosePath;
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $folkertdev$elm_deque$Internal$empty = {front: _List_Nil, rear: _List_Nil, sizeF: 0, sizeR: 0};
var $folkertdev$elm_deque$Internal$popBack = function (deque) {
	var front = deque.front;
	var rear = deque.rear;
	var _v0 = _Utils_Tuple2(front, rear);
	if (!_v0.b.b) {
		if (!_v0.a.b) {
			return _Utils_Tuple2($elm$core$Maybe$Nothing, $folkertdev$elm_deque$Internal$empty);
		} else {
			if (!_v0.a.b.b) {
				var _v1 = _v0.a;
				var x = _v1.a;
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(x),
					$folkertdev$elm_deque$Internal$empty);
			} else {
				return _Utils_Tuple2($elm$core$Maybe$Nothing, $folkertdev$elm_deque$Internal$empty);
			}
		}
	} else {
		var _v2 = _v0.b;
		var r = _v2.a;
		var rs = _v2.b;
		return _Utils_Tuple2(
			$elm$core$Maybe$Just(r),
			$folkertdev$elm_deque$Internal$rebalance(
				{front: deque.front, rear: rs, sizeF: deque.sizeF, sizeR: deque.sizeR - 1}));
	}
};
var $folkertdev$elm_deque$Deque$unwrap = function (_v0) {
	var boundedDeque = _v0.a;
	return boundedDeque;
};
var $folkertdev$elm_deque$Deque$popBack = A2(
	$elm$core$Basics$composeL,
	A2(
		$elm$core$Basics$composeL,
		$elm$core$Tuple$mapSecond($folkertdev$elm_deque$Deque$Deque),
		$folkertdev$elm_deque$Internal$popBack),
	$folkertdev$elm_deque$Deque$unwrap);
var $folkertdev$elm_deque$Deque$mapAbstract = F2(
	function (f, _v0) {
		var _abstract = _v0.a;
		return $folkertdev$elm_deque$Deque$Deque(
			f(_abstract));
	});
var $folkertdev$elm_deque$Deque$pushBack = F2(
	function (elem, _v0) {
		var deque = _v0.a;
		return A2(
			$folkertdev$elm_deque$Deque$mapAbstract,
			$folkertdev$elm_deque$Internal$rebalance,
			$folkertdev$elm_deque$Deque$Deque(
				{
					front: deque.front,
					rear: A2($elm$core$List$cons, elem, deque.rear),
					sizeF: deque.sizeF,
					sizeR: deque.sizeR + 1
				}));
	});
var $folkertdev$one_true_path_experiment$SubPath$close = function (subpath) {
	if (subpath.$ === 'Empty') {
		return $folkertdev$one_true_path_experiment$SubPath$Empty;
	} else {
		var moveto = subpath.a.moveto;
		var drawtos = subpath.a.drawtos;
		var _v1 = $folkertdev$elm_deque$Deque$popBack(drawtos);
		if ((_v1.a.$ === 'Just') && (_v1.a.a.$ === 'ClosePath')) {
			var _v2 = _v1.a.a;
			var preceding = _v1.b;
			return subpath;
		} else {
			return $folkertdev$one_true_path_experiment$SubPath$SubPath(
				{
					drawtos: A2($folkertdev$elm_deque$Deque$pushBack, $folkertdev$one_true_path_experiment$LowLevel$Command$closePath, drawtos),
					moveto: moveto
				});
		}
	}
};
var $folkertdev$one_true_path_experiment$SubPath$firstPoint = function (_v0) {
	var moveto = _v0.moveto;
	var p = moveto.a;
	return p;
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$LineTo = function (a) {
	return {$: 'LineTo', a: a};
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$lineTo = $folkertdev$one_true_path_experiment$LowLevel$Command$LineTo;
var $folkertdev$one_true_path_experiment$SubPath$map2 = F3(
	function (f, sub1, sub2) {
		var _v0 = _Utils_Tuple2(sub1, sub2);
		if (_v0.a.$ === 'Empty') {
			if (_v0.b.$ === 'Empty') {
				var _v1 = _v0.a;
				var _v2 = _v0.b;
				return $folkertdev$one_true_path_experiment$SubPath$Empty;
			} else {
				var _v3 = _v0.a;
				var subpath = _v0.b;
				return subpath;
			}
		} else {
			if (_v0.b.$ === 'Empty') {
				var subpath = _v0.a;
				var _v4 = _v0.b;
				return subpath;
			} else {
				var a = _v0.a.a;
				var b = _v0.b.a;
				return A2(f, a, b);
			}
		}
	});
var $folkertdev$one_true_path_experiment$SubPath$pushBack = F2(
	function (drawto, data) {
		return _Utils_update(
			data,
			{
				drawtos: A2($folkertdev$elm_deque$Deque$pushBack, drawto, data.drawtos)
			});
	});
var $folkertdev$elm_deque$Internal$length = function (deque) {
	return deque.sizeF + deque.sizeR;
};
var $folkertdev$elm_deque$Internal$isEmpty = function (deque) {
	return !$folkertdev$elm_deque$Internal$length(deque);
};
var $folkertdev$elm_deque$Deque$isEmpty = A2($elm$core$Basics$composeL, $folkertdev$elm_deque$Internal$isEmpty, $folkertdev$elm_deque$Deque$unwrap);
var $folkertdev$elm_deque$Deque$append = F2(
	function (p, q) {
		var x = p.a;
		var y = q.a;
		return $folkertdev$elm_deque$Deque$isEmpty(p) ? q : ($folkertdev$elm_deque$Deque$isEmpty(q) ? p : $folkertdev$elm_deque$Deque$Deque(
			{
				front: _Utils_ap(
					x.front,
					$elm$core$List$reverse(x.rear)),
				rear: $elm$core$List$reverse(
					_Utils_ap(
						y.front,
						$elm$core$List$reverse(y.rear))),
				sizeF: x.sizeF + x.sizeR,
				sizeR: y.sizeF + y.sizeR
			}));
	});
var $folkertdev$one_true_path_experiment$SubPath$unsafeConcatenate = F2(
	function (a, b) {
		return _Utils_update(
			a,
			{
				drawtos: A2($folkertdev$elm_deque$Deque$append, a.drawtos, b.drawtos)
			});
	});
var $folkertdev$one_true_path_experiment$SubPath$connect = function () {
	var helper = F2(
		function (right, left) {
			return $folkertdev$one_true_path_experiment$SubPath$SubPath(
				A2(
					$folkertdev$one_true_path_experiment$SubPath$unsafeConcatenate,
					A2(
						$folkertdev$one_true_path_experiment$SubPath$pushBack,
						$folkertdev$one_true_path_experiment$LowLevel$Command$lineTo(
							_List_fromArray(
								[
									$folkertdev$one_true_path_experiment$SubPath$firstPoint(right)
								])),
						left),
					right));
		});
	return $folkertdev$one_true_path_experiment$SubPath$map2(helper);
}();
var $gampleman$elm_visualization$Shape$Pie$cornerTangents = F7(
	function (x0, y0, x1, y1, r1, rc, cw) {
		var y01 = y0 - y1;
		var x01 = x0 - x1;
		var r = r1 - rc;
		var lo = (cw ? rc : (-rc)) / $elm$core$Basics$sqrt(
			A2($elm$core$Basics$pow, x01, 2) + A2($elm$core$Basics$pow, y01, 2));
		var ox = lo * y01;
		var x10 = x1 + ox;
		var x11 = x0 + ox;
		var x00 = (x11 + x10) / 2;
		var oy = (-lo) * x01;
		var y10 = y1 + oy;
		var y11 = y0 + oy;
		var y00 = (y11 + y10) / 2;
		var dy = y10 - y11;
		var dx = x10 - x11;
		var dd = (x11 * y10) - (x10 * y11);
		var d2 = A2($elm$core$Basics$pow, dx, 2) + A2($elm$core$Basics$pow, dy, 2);
		var d = ((dy < 0) ? (-1) : 1) * $elm$core$Basics$sqrt(
			A2(
				$elm$core$Basics$max,
				0,
				(A2($elm$core$Basics$pow, r, 2) * d2) - A2($elm$core$Basics$pow, dd, 2)));
		var cy1 = (((-dd) * dx) + (dy * d)) / d2;
		var dy1 = cy1 - y00;
		var cy0 = (((-dd) * dx) - (dy * d)) / d2;
		var dy0 = cy0 - y00;
		var cx1 = ((dd * dy) + (dx * d)) / d2;
		var dx1 = cx1 - x00;
		var cx0 = ((dd * dy) - (dx * d)) / d2;
		var dx0 = cx0 - x00;
		var _v0 = (_Utils_cmp(
			A2($elm$core$Basics$pow, dx0, 2) + A2($elm$core$Basics$pow, dy0, 2),
			A2($elm$core$Basics$pow, dx1, 2) + A2($elm$core$Basics$pow, dy1, 2)) > 0) ? _Utils_Tuple2(cx1, cy1) : _Utils_Tuple2(cx0, cy0);
		var fcx = _v0.a;
		var fxy = _v0.b;
		return {cx: fcx, cy: fxy, x01: -ox, x11: fcx * ((r1 / r) - 1), y01: -oy, y11: fxy * ((r1 / r) - 1)};
	});
var $gampleman$elm_visualization$Shape$Pie$intersect = F8(
	function (x0, y0, x1, y1, x2, y2, x3, y3) {
		var y32 = y3 - y2;
		var y10 = y1 - y0;
		var x32 = x3 - x2;
		var x10 = x1 - x0;
		var t = ((x32 * (y0 - y2)) - (y32 * (x0 - x2))) / ((y32 * x10) - (x32 * y10));
		return _Utils_Tuple2(x0 + (t * x10), y0 + (t * y10));
	});
var $folkertdev$elm_deque$Internal$foldl = F3(
	function (f, initial, deque) {
		return function (initial_) {
			return A3($elm$core$List$foldr, f, initial_, deque.rear);
		}(
			A3($elm$core$List$foldl, f, initial, deque.front));
	});
var $folkertdev$elm_deque$Deque$foldl = F2(
	function (f, initial) {
		return A2(
			$elm$core$Basics$composeL,
			A2($folkertdev$elm_deque$Internal$foldl, f, initial),
			$folkertdev$elm_deque$Deque$unwrap);
	});
var $folkertdev$one_true_path_experiment$LowLevel$Command$updateCursorState = F2(
	function (drawto, state) {
		var noControlPoint = function (currentState) {
			return _Utils_update(
				currentState,
				{previousControlPoint: $elm$core$Maybe$Nothing});
		};
		var maybeUpdateCursor = function (coordinate) {
			return _Utils_update(
				state,
				{
					cursor: A2($elm$core$Maybe$withDefault, state.cursor, coordinate)
				});
		};
		var _v0 = state.cursor;
		var cursorX = _v0.a;
		var cursorY = _v0.b;
		switch (drawto.$) {
			case 'LineTo':
				var coordinates = drawto.a;
				return noControlPoint(
					maybeUpdateCursor(
						$elm_community$list_extra$List$Extra$last(coordinates)));
			case 'CurveTo':
				var coordinates = drawto.a;
				var _v2 = $elm_community$list_extra$List$Extra$last(coordinates);
				if (_v2.$ === 'Nothing') {
					return state;
				} else {
					var _v3 = _v2.a;
					var control1 = _v3.a;
					var control2 = _v3.b;
					var target = _v3.c;
					return _Utils_update(
						state,
						{
							cursor: target,
							previousControlPoint: $elm$core$Maybe$Just(control2)
						});
				}
			case 'QuadraticBezierCurveTo':
				var coordinates = drawto.a;
				var _v4 = $elm_community$list_extra$List$Extra$last(coordinates);
				if (_v4.$ === 'Nothing') {
					return state;
				} else {
					var _v5 = _v4.a;
					var control = _v5.a;
					var target = _v5.b;
					return _Utils_update(
						state,
						{
							cursor: target,
							previousControlPoint: $elm$core$Maybe$Just(control)
						});
				}
			case 'EllipticalArc':
				var _arguments = drawto.a;
				return noControlPoint(
					maybeUpdateCursor(
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.target;
							},
							$elm_community$list_extra$List$Extra$last(_arguments))));
			default:
				return noControlPoint(state);
		}
	});
var $folkertdev$one_true_path_experiment$SubPath$finalCursorState = function (_v0) {
	var moveto = _v0.moveto;
	var drawtos = _v0.drawtos;
	var _v1 = moveto;
	var start = _v1.a;
	var initial = {cursor: start, previousControlPoint: $elm$core$Maybe$Nothing, start: start};
	return A3($folkertdev$elm_deque$Deque$foldl, $folkertdev$one_true_path_experiment$LowLevel$Command$updateCursorState, initial, drawtos);
};
var $folkertdev$one_true_path_experiment$SubPath$finalPoint = A2(
	$elm$core$Basics$composeR,
	$folkertdev$one_true_path_experiment$SubPath$finalCursorState,
	function ($) {
		return $.cursor;
	});
var $ianmackenzie$elm_units$Quantity$Quantity = function (a) {
	return {$: 'Quantity', a: a};
};
var $ianmackenzie$elm_units$Quantity$float = function (value) {
	return $ianmackenzie$elm_units$Quantity$Quantity(value);
};
var $ianmackenzie$elm_geometry$Geometry$Types$Vector2d = function (a) {
	return {$: 'Vector2d', a: a};
};
var $ianmackenzie$elm_geometry$Vector2d$xy = F2(
	function (_v0, _v1) {
		var x = _v0.a;
		var y = _v1.a;
		return $ianmackenzie$elm_geometry$Geometry$Types$Vector2d(
			{x: x, y: y});
	});
var $ianmackenzie$elm_geometry$Vector2d$fromTuple = F2(
	function (toQuantity, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return A2(
			$ianmackenzie$elm_geometry$Vector2d$xy,
			toQuantity(x),
			toQuantity(y));
	});
var $folkertdev$elm_deque$Internal$map = F2(
	function (f, deque) {
		return {
			front: A2($elm$core$List$map, f, deque.front),
			rear: A2($elm$core$List$map, f, deque.rear),
			sizeF: deque.sizeF,
			sizeR: deque.sizeR
		};
	});
var $folkertdev$elm_deque$Deque$map = function (f) {
	return $folkertdev$elm_deque$Deque$mapAbstract(
		$folkertdev$elm_deque$Internal$map(f));
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$CurveTo = function (a) {
	return {$: 'CurveTo', a: a};
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$QuadraticBezierCurveTo = function (a) {
	return {$: 'QuadraticBezierCurveTo', a: a};
};
var $folkertdev$one_true_path_experiment$LowLevel$Command$mapTuple2 = F2(
	function (f, _v0) {
		var a = _v0.a;
		var b = _v0.b;
		return _Utils_Tuple2(
			f(a),
			f(b));
	});
var $folkertdev$one_true_path_experiment$LowLevel$Command$mapTuple3 = F2(
	function (f, _v0) {
		var a = _v0.a;
		var b = _v0.b;
		var c = _v0.c;
		return _Utils_Tuple3(
			f(a),
			f(b),
			f(c));
	});
var $folkertdev$one_true_path_experiment$LowLevel$Command$mapCoordinateDrawTo = F2(
	function (f, drawto) {
		switch (drawto.$) {
			case 'LineTo':
				var coordinates = drawto.a;
				return $folkertdev$one_true_path_experiment$LowLevel$Command$LineTo(
					A2($elm$core$List$map, f, coordinates));
			case 'CurveTo':
				var coordinates = drawto.a;
				return $folkertdev$one_true_path_experiment$LowLevel$Command$CurveTo(
					A2(
						$elm$core$List$map,
						$folkertdev$one_true_path_experiment$LowLevel$Command$mapTuple3(f),
						coordinates));
			case 'QuadraticBezierCurveTo':
				var coordinates = drawto.a;
				return $folkertdev$one_true_path_experiment$LowLevel$Command$QuadraticBezierCurveTo(
					A2(
						$elm$core$List$map,
						$folkertdev$one_true_path_experiment$LowLevel$Command$mapTuple2(f),
						coordinates));
			case 'EllipticalArc':
				var _arguments = drawto.a;
				return $folkertdev$one_true_path_experiment$LowLevel$Command$EllipticalArc(
					A2(
						$elm$core$List$map,
						function (argument) {
							return _Utils_update(
								argument,
								{
									target: f(argument.target)
								});
						},
						_arguments));
			default:
				return $folkertdev$one_true_path_experiment$LowLevel$Command$ClosePath;
		}
	});
var $folkertdev$one_true_path_experiment$SubPath$mapCoordinateInstructions = F2(
	function (f, _v0) {
		var moveto = _v0.moveto;
		var drawtos = _v0.drawtos;
		var coordinate = moveto.a;
		return {
			drawtos: A2(
				$folkertdev$elm_deque$Deque$map,
				$folkertdev$one_true_path_experiment$LowLevel$Command$mapCoordinateDrawTo(f),
				drawtos),
			moveto: $folkertdev$one_true_path_experiment$LowLevel$Command$MoveTo(
				f(coordinate))
		};
	});
var $ianmackenzie$elm_geometry$Vector2d$minus = F2(
	function (_v0, _v1) {
		var v2 = _v0.a;
		var v1 = _v1.a;
		return $ianmackenzie$elm_geometry$Geometry$Types$Vector2d(
			{x: v1.x - v2.x, y: v1.y - v2.y});
	});
var $ianmackenzie$elm_geometry$Vector2d$plus = F2(
	function (_v0, _v1) {
		var v2 = _v0.a;
		var v1 = _v1.a;
		return $ianmackenzie$elm_geometry$Geometry$Types$Vector2d(
			{x: v1.x + v2.x, y: v1.y + v2.y});
	});
var $ianmackenzie$elm_units$Quantity$toFloat = function (_v0) {
	var value = _v0.a;
	return value;
};
var $ianmackenzie$elm_geometry$Vector2d$xComponent = function (_v0) {
	var v = _v0.a;
	return $ianmackenzie$elm_units$Quantity$Quantity(v.x);
};
var $ianmackenzie$elm_geometry$Vector2d$yComponent = function (_v0) {
	var v = _v0.a;
	return $ianmackenzie$elm_units$Quantity$Quantity(v.y);
};
var $ianmackenzie$elm_geometry$Vector2d$toTuple = F2(
	function (fromQuantity, vector) {
		return _Utils_Tuple2(
			fromQuantity(
				$ianmackenzie$elm_geometry$Vector2d$xComponent(vector)),
			fromQuantity(
				$ianmackenzie$elm_geometry$Vector2d$yComponent(vector)));
	});
var $folkertdev$one_true_path_experiment$SubPath$continue = function () {
	var helper = F2(
		function (right, left) {
			var distance = A2(
				$ianmackenzie$elm_geometry$Vector2d$minus,
				A2(
					$ianmackenzie$elm_geometry$Vector2d$fromTuple,
					$ianmackenzie$elm_units$Quantity$float,
					$folkertdev$one_true_path_experiment$SubPath$firstPoint(right)),
				A2(
					$ianmackenzie$elm_geometry$Vector2d$fromTuple,
					$ianmackenzie$elm_units$Quantity$float,
					$folkertdev$one_true_path_experiment$SubPath$finalPoint(left)));
			var mapper = A2(
				$elm$core$Basics$composeL,
				A2(
					$elm$core$Basics$composeL,
					$ianmackenzie$elm_geometry$Vector2d$toTuple($ianmackenzie$elm_units$Quantity$toFloat),
					$ianmackenzie$elm_geometry$Vector2d$plus(distance)),
				$ianmackenzie$elm_geometry$Vector2d$fromTuple($ianmackenzie$elm_units$Quantity$float));
			return $folkertdev$one_true_path_experiment$SubPath$SubPath(
				A2(
					$folkertdev$one_true_path_experiment$SubPath$unsafeConcatenate,
					left,
					A2($folkertdev$one_true_path_experiment$SubPath$mapCoordinateInstructions, mapper, right)));
		});
	return $folkertdev$one_true_path_experiment$SubPath$map2(helper);
}();
var $gampleman$elm_visualization$Shape$Pie$makeArc = F6(
	function (x, y, radius, a0, a1, ccw) {
		return $folkertdev$one_true_path_experiment$SubPath$continue(
			A6($gampleman$elm_visualization$Shape$Pie$arc_, x, y, radius, a0, a1, ccw));
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$Basics$asin = _Basics_asin;
var $gampleman$elm_visualization$Shape$Pie$myAsin = function (x) {
	return (x >= 1) ? ($elm$core$Basics$pi / 2) : ((_Utils_cmp(x, -1) < 1) ? ((-$elm$core$Basics$pi) / 2) : $elm$core$Basics$asin(x));
};
var $gampleman$elm_visualization$Shape$Pie$arc = function (arcData) {
	var _v0 = (_Utils_cmp(arcData.innerRadius, arcData.outerRadius) > 0) ? _Utils_Tuple2(arcData.outerRadius, arcData.innerRadius) : _Utils_Tuple2(arcData.innerRadius, arcData.outerRadius);
	var r0 = _v0.a;
	var r1 = _v0.b;
	if (_Utils_cmp(r1, $gampleman$elm_visualization$Shape$Pie$epsilon) < 1) {
		return _List_fromArray(
			[
				$folkertdev$one_true_path_experiment$SubPath$close(
				A2(
					$folkertdev$one_true_path_experiment$SubPath$with,
					$folkertdev$one_true_path_experiment$LowLevel$Command$moveTo(
						_Utils_Tuple2(0, 0)),
					_List_Nil))
			]);
	} else {
		var a1 = arcData.endAngle - ($elm$core$Basics$pi / 2);
		var a0 = arcData.startAngle - ($elm$core$Basics$pi / 2);
		var cw = _Utils_cmp(a1, a0) > 0;
		var da = $elm$core$Basics$abs(a1 - a0);
		if (_Utils_cmp(da, (2 * $elm$core$Basics$pi) - $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) {
			var p = A7(
				$gampleman$elm_visualization$Shape$Pie$makeArc,
				0,
				0,
				r1,
				a0,
				a1,
				!cw,
				A2(
					$folkertdev$one_true_path_experiment$SubPath$with,
					$folkertdev$one_true_path_experiment$LowLevel$Command$moveTo(
						_Utils_Tuple2(
							r1 * $elm$core$Basics$cos(a0),
							r1 * $elm$core$Basics$sin(a0))),
					_List_Nil));
			return (_Utils_cmp(r0, $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) ? _List_fromArray(
				[
					p,
					$folkertdev$one_true_path_experiment$SubPath$close(
					A7(
						$gampleman$elm_visualization$Shape$Pie$makeArc,
						0,
						0,
						r0,
						a1,
						a0,
						cw,
						A2(
							$folkertdev$one_true_path_experiment$SubPath$with,
							$folkertdev$one_true_path_experiment$LowLevel$Command$moveTo(
								_Utils_Tuple2(
									r0 * $elm$core$Basics$cos(a1),
									r0 * $elm$core$Basics$sin(a1))),
							_List_Nil)))
				]) : _List_fromArray(
				[
					$folkertdev$one_true_path_experiment$SubPath$close(p)
				]);
		} else {
			var rc = A2(
				$elm$core$Basics$min,
				$elm$core$Basics$abs(r1 - r0) / 2,
				arcData.cornerRadius);
			var ap = arcData.padAngle / 2;
			var rp = (_Utils_cmp(ap, $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) ? ((arcData.padRadius > 0) ? arcData.padRadius : $elm$core$Basics$sqrt(
				A2($elm$core$Basics$pow, r0, 2) + A2($elm$core$Basics$pow, r1, 2))) : 0;
			var _v1 = function () {
				if (_Utils_cmp(rp, $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) {
					var p1 = $gampleman$elm_visualization$Shape$Pie$myAsin(
						(rp / r1) * $elm$core$Basics$sin(ap));
					return (_Utils_cmp(da - (p1 * 2), $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) ? (cw ? _Utils_Tuple3(a0 + p1, a1 - p1, da - (p1 * 2)) : _Utils_Tuple3(a0 - p1, a1 + p1, da - (p1 * 2))) : _Utils_Tuple3((a0 + a1) / 2, (a0 + a1) / 2, 0);
				} else {
					return _Utils_Tuple3(a0, a1, da);
				}
			}();
			var a01 = _v1.a;
			var a11 = _v1.b;
			var da1 = _v1.c;
			var x01 = r1 * $elm$core$Basics$cos(a01);
			var y01 = r1 * $elm$core$Basics$sin(a01);
			var x11 = r1 * $elm$core$Basics$cos(a11);
			var y11 = r1 * $elm$core$Basics$sin(a11);
			var _v2 = function () {
				if (_Utils_cmp(rp, $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) {
					var p0 = $gampleman$elm_visualization$Shape$Pie$myAsin(
						(rp / r0) * $elm$core$Basics$sin(ap));
					return (_Utils_cmp(da - (p0 * 2), $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) ? (cw ? _Utils_Tuple3(a0 + p0, a1 - p0, da - (p0 * 2)) : _Utils_Tuple3(a0 - p0, a1 + p0, da - (p0 * 2))) : _Utils_Tuple3((a0 + a1) / 2, (a0 + a1) / 2, 0);
				} else {
					return _Utils_Tuple3(a0, a1, da);
				}
			}();
			var a00 = _v2.a;
			var a10 = _v2.b;
			var da0 = _v2.c;
			var x00 = r0 * $elm$core$Basics$cos(a00);
			var y00 = r0 * $elm$core$Basics$sin(a00);
			var x10 = r0 * $elm$core$Basics$cos(a10);
			var y10 = r0 * $elm$core$Basics$sin(a10);
			var _v3 = (_Utils_cmp(da0, $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) ? A8($gampleman$elm_visualization$Shape$Pie$intersect, x01, y01, x00, y00, x11, y11, x10, y10) : _Utils_Tuple2(x10, y10);
			var ocx = _v3.a;
			var ocy = _v3.b;
			var _v4 = _Utils_Tuple2(x11 - ocx, y11 - ocy);
			var bx = _v4.a;
			var by = _v4.b;
			var _v5 = _Utils_Tuple2(x01 - ocx, y01 - ocy);
			var ax = _v5.a;
			var ay = _v5.b;
			var _v6 = function () {
				if ((_Utils_cmp(rc, $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) && (_Utils_cmp(da, $elm$core$Basics$pi) < 0)) {
					var lc = $elm$core$Basics$sqrt(
						A2($elm$core$Basics$pow, ocx, 2) + A2($elm$core$Basics$pow, ocy, 2));
					var kc = 1 / $elm$core$Basics$sin(
						$elm$core$Basics$acos(
							((ax * bx) + (ay * by)) / ($elm$core$Basics$sqrt(
								A2($elm$core$Basics$pow, ax, 2) + A2($elm$core$Basics$pow, ay, 2)) * $elm$core$Basics$sqrt(
								A2($elm$core$Basics$pow, bx, 2) + A2($elm$core$Basics$pow, by, 2)))) / 2);
					return _Utils_Tuple2(
						A2($elm$core$Basics$min, rc, (r0 - lc) / (kc - 1)),
						A2($elm$core$Basics$min, rc, (r1 - lc) / (kc + 1)));
				} else {
					return _Utils_Tuple2(rc, rc);
				}
			}();
			var rc0 = _v6.a;
			var rc1 = _v6.b;
			var outerRing = function () {
				if (_Utils_cmp(da1, $gampleman$elm_visualization$Shape$Pie$epsilon) < 1) {
					return A2(
						$folkertdev$one_true_path_experiment$SubPath$with,
						$folkertdev$one_true_path_experiment$LowLevel$Command$moveTo(
							_Utils_Tuple2(x01, y01)),
						_List_Nil);
				} else {
					if (_Utils_cmp(rc1, $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) {
						var t1 = A7($gampleman$elm_visualization$Shape$Pie$cornerTangents, x11, y11, x10, y10, r1, rc1, cw);
						var t0 = A7($gampleman$elm_visualization$Shape$Pie$cornerTangents, x00, y00, x01, y01, r1, rc1, cw);
						var p = A2(
							$folkertdev$one_true_path_experiment$SubPath$with,
							$folkertdev$one_true_path_experiment$LowLevel$Command$moveTo(
								_Utils_Tuple2(t0.cx + t0.x01, t0.cy + t0.y01)),
							_List_Nil);
						return (_Utils_cmp(rc1, rc) < 0) ? A7(
							$gampleman$elm_visualization$Shape$Pie$makeArc,
							t0.cx,
							t0.cy,
							rc1,
							A2($elm$core$Basics$atan2, t0.y01, t0.x01),
							A2($elm$core$Basics$atan2, t1.y01, t1.x01),
							!cw,
							p) : A7(
							$gampleman$elm_visualization$Shape$Pie$makeArc,
							t1.cx,
							t1.cy,
							rc1,
							A2($elm$core$Basics$atan2, t1.y11, t1.x11),
							A2($elm$core$Basics$atan2, t1.y01, t1.x01),
							!cw,
							A7(
								$gampleman$elm_visualization$Shape$Pie$makeArc,
								0,
								0,
								r1,
								A2($elm$core$Basics$atan2, t0.cy + t0.y11, t0.cx + t0.x11),
								A2($elm$core$Basics$atan2, t1.cy + t1.y11, t1.cx + t1.x11),
								!cw,
								A7(
									$gampleman$elm_visualization$Shape$Pie$makeArc,
									t0.cx,
									t0.cy,
									rc1,
									A2($elm$core$Basics$atan2, t0.y01, t0.x01),
									A2($elm$core$Basics$atan2, t0.y11, t0.x11),
									!cw,
									p)));
					} else {
						return A7(
							$gampleman$elm_visualization$Shape$Pie$makeArc,
							0,
							0,
							r1,
							a01,
							a11,
							!cw,
							A2(
								$folkertdev$one_true_path_experiment$SubPath$with,
								$folkertdev$one_true_path_experiment$LowLevel$Command$moveTo(
									_Utils_Tuple2(x01, y01)),
								_List_Nil));
					}
				}
			}();
			if ((_Utils_cmp(r0, $gampleman$elm_visualization$Shape$Pie$epsilon) < 1) || (_Utils_cmp(da0, $gampleman$elm_visualization$Shape$Pie$epsilon) < 1)) {
				return _List_fromArray(
					[
						$folkertdev$one_true_path_experiment$SubPath$close(
						A2(
							$folkertdev$one_true_path_experiment$SubPath$connect,
							A2(
								$folkertdev$one_true_path_experiment$SubPath$with,
								$folkertdev$one_true_path_experiment$LowLevel$Command$moveTo(
									_Utils_Tuple2(x10, y10)),
								_List_Nil),
							outerRing))
					]);
			} else {
				if (_Utils_cmp(rc0, $gampleman$elm_visualization$Shape$Pie$epsilon) > 0) {
					var t1 = A7($gampleman$elm_visualization$Shape$Pie$cornerTangents, x01, y01, x00, y00, r0, -rc0, cw);
					var t0 = A7($gampleman$elm_visualization$Shape$Pie$cornerTangents, x10, y10, x11, y11, r0, -rc0, cw);
					var p = A2(
						$folkertdev$one_true_path_experiment$SubPath$connect,
						A2(
							$folkertdev$one_true_path_experiment$SubPath$with,
							$folkertdev$one_true_path_experiment$LowLevel$Command$moveTo(
								_Utils_Tuple2(t0.cx + t0.x01, t0.cy + t0.y01)),
							_List_Nil),
						outerRing);
					return (_Utils_cmp(rc0, rc) < 0) ? _List_fromArray(
						[
							$folkertdev$one_true_path_experiment$SubPath$close(
							A7(
								$gampleman$elm_visualization$Shape$Pie$makeArc,
								t0.cx,
								t0.cy,
								rc0,
								A2($elm$core$Basics$atan2, t0.y01, t0.x01),
								A2($elm$core$Basics$atan2, t1.y01, t1.x01),
								!cw,
								p))
						]) : _List_fromArray(
						[
							$folkertdev$one_true_path_experiment$SubPath$close(
							A7(
								$gampleman$elm_visualization$Shape$Pie$makeArc,
								t1.cx,
								t1.cy,
								rc0,
								A2($elm$core$Basics$atan2, t1.y11, t1.x11),
								A2($elm$core$Basics$atan2, t1.y01, t1.x01),
								!cw,
								A7(
									$gampleman$elm_visualization$Shape$Pie$makeArc,
									0,
									0,
									r0,
									A2($elm$core$Basics$atan2, t0.cy + t0.y11, t0.cx + t0.x11),
									A2($elm$core$Basics$atan2, t1.cy + t1.y11, t1.cx + t1.x11),
									cw,
									A7(
										$gampleman$elm_visualization$Shape$Pie$makeArc,
										t0.cx,
										t0.cy,
										rc0,
										A2($elm$core$Basics$atan2, t0.y01, t0.x01),
										A2($elm$core$Basics$atan2, t0.y11, t0.x11),
										!cw,
										p))))
						]);
				} else {
					return _List_fromArray(
						[
							$folkertdev$one_true_path_experiment$SubPath$close(
							A2(
								$folkertdev$one_true_path_experiment$SubPath$connect,
								A6($gampleman$elm_visualization$Shape$Pie$arc_, 0, 0, r0, a10, a00, cw),
								outerRing))
						]);
				}
			}
		}
	}
};
var $gampleman$elm_visualization$Shape$arc = $gampleman$elm_visualization$Shape$Pie$arc;
var $author$project$Components$Sunburst$sb_h = 450;
var $author$project$Components$Sunburst$sb_w = 500;
var $author$project$Components$Sunburst$radius = A2($elm$core$Basics$min, $author$project$Components$Sunburst$sb_w, $author$project$Components$Sunburst$sb_h) / 2;
var $author$project$Components$Sunburst$arc = function (s) {
	return $gampleman$elm_visualization$Shape$arc(
		{
			cornerRadius: 0,
			endAngle: s.x + s.width,
			innerRadius: $elm$core$Basics$sqrt(s.y),
			outerRadius: $elm$core$Basics$sqrt(s.y + s.height) - 1,
			padAngle: 1 / $author$project$Components$Sunburst$radius,
			padRadius: $author$project$Components$Sunburst$radius,
			startAngle: s.x
		});
};
var $avh4$elm_color$Color$black = A4($avh4$elm_color$Color$RgbaSpace, 0 / 255, 0 / 255, 0 / 255, 1.0);
var $gampleman$elm_visualization$Scale$Ordinal$convertHelp = F4(
	function (d, r, used, needle) {
		convertHelp:
		while (true) {
			var _v0 = _Utils_Tuple2(d, r);
			if (!_v0.a.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				if (!_v0.b.b) {
					var _v1 = _v0.a;
					var $temp$d = d,
						$temp$r = $elm$core$List$reverse(used),
						$temp$used = _List_Nil,
						$temp$needle = needle;
					d = $temp$d;
					r = $temp$r;
					used = $temp$used;
					needle = $temp$needle;
					continue convertHelp;
				} else {
					var _v2 = _v0.a;
					var x = _v2.a;
					var xs = _v2.b;
					var _v3 = _v0.b;
					var y = _v3.a;
					var ys = _v3.b;
					if (_Utils_eq(x, needle)) {
						return $elm$core$Maybe$Just(y);
					} else {
						var $temp$d = xs,
							$temp$r = ys,
							$temp$used = A2($elm$core$List$cons, y, used),
							$temp$needle = needle;
						d = $temp$d;
						r = $temp$r;
						used = $temp$used;
						needle = $temp$needle;
						continue convertHelp;
					}
				}
			}
		}
	});
var $gampleman$elm_visualization$Scale$Ordinal$convert = F3(
	function (domain, range, val) {
		if (!range.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			return A4($gampleman$elm_visualization$Scale$Ordinal$convertHelp, domain, range, _List_Nil, val);
		}
	});
var $gampleman$elm_visualization$Scale$ordinal = F2(
	function (range_, domain_) {
		return $gampleman$elm_visualization$Scale$Scale(
			{convert: $gampleman$elm_visualization$Scale$Ordinal$convert, domain: domain_, range: range_});
	});
var $gampleman$elm_visualization$Scale$Color$tableau10 = _List_fromArray(
	[
		A3($avh4$elm_color$Color$rgb255, 78, 121, 167),
		A3($avh4$elm_color$Color$rgb255, 242, 142, 44),
		A3($avh4$elm_color$Color$rgb255, 225, 87, 89),
		A3($avh4$elm_color$Color$rgb255, 118, 183, 178),
		A3($avh4$elm_color$Color$rgb255, 89, 161, 79),
		A3($avh4$elm_color$Color$rgb255, 237, 201, 73),
		A3($avh4$elm_color$Color$rgb255, 175, 122, 161),
		A3($avh4$elm_color$Color$rgb255, 255, 157, 167),
		A3($avh4$elm_color$Color$rgb255, 156, 117, 95),
		A3($avh4$elm_color$Color$rgb255, 186, 176, 171)
	]);
var $author$project$Components$Sunburst$colorScale = A2(
	$gampleman$elm_visualization$Scale$ordinal,
	A2(
		$elm$core$List$cons,
		A3($avh4$elm_color$Color$rgb, 0.5, 0.5, 0.5),
		$gampleman$elm_visualization$Scale$Color$tableau10),
	_List_fromArray(
		['Swimming', 'Athletics']));
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $folkertdev$elm_deque$Deque$empty = $folkertdev$elm_deque$Deque$Deque($folkertdev$elm_deque$Internal$empty);
var $folkertdev$one_true_path_experiment$LowLevel$Command$merge = F2(
	function (instruction1, instruction2) {
		var _v0 = _Utils_Tuple2(instruction1, instruction2);
		_v0$5:
		while (true) {
			switch (_v0.a.$) {
				case 'LineTo':
					if (_v0.b.$ === 'LineTo') {
						var p1 = _v0.a.a;
						var p2 = _v0.b.a;
						return $elm$core$Result$Ok(
							$folkertdev$one_true_path_experiment$LowLevel$Command$LineTo(
								_Utils_ap(p1, p2)));
					} else {
						break _v0$5;
					}
				case 'CurveTo':
					if (_v0.b.$ === 'CurveTo') {
						var p1 = _v0.a.a;
						var p2 = _v0.b.a;
						return $elm$core$Result$Ok(
							$folkertdev$one_true_path_experiment$LowLevel$Command$CurveTo(
								_Utils_ap(p1, p2)));
					} else {
						break _v0$5;
					}
				case 'QuadraticBezierCurveTo':
					if (_v0.b.$ === 'QuadraticBezierCurveTo') {
						var p1 = _v0.a.a;
						var p2 = _v0.b.a;
						return $elm$core$Result$Ok(
							$folkertdev$one_true_path_experiment$LowLevel$Command$QuadraticBezierCurveTo(
								_Utils_ap(p1, p2)));
					} else {
						break _v0$5;
					}
				case 'EllipticalArc':
					if (_v0.b.$ === 'EllipticalArc') {
						var p1 = _v0.a.a;
						var p2 = _v0.b.a;
						return $elm$core$Result$Ok(
							$folkertdev$one_true_path_experiment$LowLevel$Command$EllipticalArc(
								_Utils_ap(p1, p2)));
					} else {
						break _v0$5;
					}
				default:
					if (_v0.b.$ === 'ClosePath') {
						var _v1 = _v0.a;
						var _v2 = _v0.b;
						return $elm$core$Result$Ok($folkertdev$one_true_path_experiment$LowLevel$Command$ClosePath);
					} else {
						break _v0$5;
					}
			}
		}
		return $elm$core$Result$Err(
			_Utils_Tuple2(instruction1, instruction2));
	});
var $folkertdev$elm_deque$Internal$toList = function (deque) {
	return _Utils_ap(
		deque.front,
		$elm$core$List$reverse(deque.rear));
};
var $folkertdev$elm_deque$Deque$toList = A2($elm$core$Basics$composeL, $folkertdev$elm_deque$Internal$toList, $folkertdev$elm_deque$Deque$unwrap);
var $folkertdev$one_true_path_experiment$SubPath$compressHelper = function (drawtos) {
	var folder = F2(
		function (instruction, _v3) {
			var previous = _v3.a;
			var accum = _v3.b;
			var _v2 = A2($folkertdev$one_true_path_experiment$LowLevel$Command$merge, previous, instruction);
			if (_v2.$ === 'Ok') {
				var merged = _v2.a;
				return _Utils_Tuple2(merged, accum);
			} else {
				return _Utils_Tuple2(
					instruction,
					A2($elm$core$List$cons, previous, accum));
			}
		});
	var _v0 = $folkertdev$elm_deque$Deque$toList(drawtos);
	if (!_v0.b) {
		return $folkertdev$elm_deque$Deque$empty;
	} else {
		var first = _v0.a;
		var rest = _v0.b;
		return $folkertdev$elm_deque$Deque$fromList(
			$elm$core$List$reverse(
				function (_v1) {
					var a = _v1.a;
					var b = _v1.b;
					return A2($elm$core$List$cons, a, b);
				}(
					A3(
						$elm$core$List$foldl,
						folder,
						_Utils_Tuple2(first, _List_Nil),
						rest))));
	}
};
var $folkertdev$one_true_path_experiment$SubPath$compress = function (subpath) {
	if (subpath.$ === 'Empty') {
		return $folkertdev$one_true_path_experiment$SubPath$Empty;
	} else {
		var data = subpath.a;
		return $folkertdev$one_true_path_experiment$SubPath$SubPath(
			_Utils_update(
				data,
				{
					drawtos: $folkertdev$one_true_path_experiment$SubPath$compressHelper(data.drawtos)
				}));
	}
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$DecimalPlaces = function (a) {
	return {$: 'DecimalPlaces', a: a};
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$decimalPlaces = $folkertdev$svg_path_lowlevel$Path$LowLevel$DecimalPlaces;
var $folkertdev$one_true_path_experiment$SubPath$defaultConfig = {decimalPlaces: $elm$core$Maybe$Nothing, mergeAdjacent: false};
var $folkertdev$one_true_path_experiment$SubPath$optionFolder = F2(
	function (option, config) {
		if (option.$ === 'DecimalPlaces') {
			var n = option.a;
			return _Utils_update(
				config,
				{
					decimalPlaces: $elm$core$Maybe$Just(n)
				});
		} else {
			return _Utils_update(
				config,
				{mergeAdjacent: true});
		}
	});
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute = {$: 'Absolute'};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$ClosePath = {$: 'ClosePath'};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$CurveTo = F2(
	function (a, b) {
		return {$: 'CurveTo', a: a, b: b};
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$EllipticalArc = F2(
	function (a, b) {
		return {$: 'EllipticalArc', a: a, b: b};
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$LineTo = F2(
	function (a, b) {
		return {$: 'LineTo', a: a, b: b};
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$QuadraticBezierCurveTo = F2(
	function (a, b) {
		return {$: 'QuadraticBezierCurveTo', a: a, b: b};
	});
var $folkertdev$one_true_path_experiment$LowLevel$Command$toLowLevelDrawTo = function (drawto) {
	switch (drawto.$) {
		case 'LineTo':
			var coordinates = drawto.a;
			return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$LineTo, $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute, coordinates);
		case 'CurveTo':
			var coordinates = drawto.a;
			return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$CurveTo, $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute, coordinates);
		case 'QuadraticBezierCurveTo':
			var coordinates = drawto.a;
			return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$QuadraticBezierCurveTo, $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute, coordinates);
		case 'EllipticalArc':
			var _arguments = drawto.a;
			return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$EllipticalArc, $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute, _arguments);
		default:
			return $folkertdev$svg_path_lowlevel$Path$LowLevel$ClosePath;
	}
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$MoveTo = F2(
	function (a, b) {
		return {$: 'MoveTo', a: a, b: b};
	});
var $folkertdev$one_true_path_experiment$LowLevel$Command$toLowLevelMoveTo = function (_v0) {
	var target = _v0.a;
	return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$MoveTo, $folkertdev$svg_path_lowlevel$Path$LowLevel$Absolute, target);
};
var $folkertdev$one_true_path_experiment$SubPath$toLowLevel = function (subpath) {
	if (subpath.$ === 'Empty') {
		return $elm$core$Maybe$Nothing;
	} else {
		var moveto = subpath.a.moveto;
		var drawtos = subpath.a.drawtos;
		return $elm$core$Maybe$Just(
			{
				drawtos: A2(
					$elm$core$List$map,
					$folkertdev$one_true_path_experiment$LowLevel$Command$toLowLevelDrawTo,
					$folkertdev$elm_deque$Deque$toList(drawtos)),
				moveto: $folkertdev$one_true_path_experiment$LowLevel$Command$toLowLevelMoveTo(moveto)
			});
	}
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$defaultConfig = {floatFormatter: $elm$core$String$fromFloat};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$roundTo = F2(
	function (n, value) {
		if (!n) {
			return $elm$core$String$fromInt(
				$elm$core$Basics$round(value));
		} else {
			var sign = (value < 0.0) ? '-' : '';
			var exp = A2($elm$core$Basics$pow, 10, n);
			var raised = $elm$core$Basics$abs(
				$elm$core$Basics$round(value * exp));
			var decimals = raised % exp;
			return (!decimals) ? _Utils_ap(
				sign,
				$elm$core$String$fromInt((raised / exp) | 0)) : (sign + ($elm$core$String$fromInt((raised / exp) | 0) + ('.' + $elm$core$String$fromInt(decimals))));
		}
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$optionFolder = F2(
	function (option, config) {
		var n = option.a;
		return _Utils_update(
			config,
			{
				floatFormatter: $folkertdev$svg_path_lowlevel$Path$LowLevel$roundTo(n)
			});
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$accumulateOptions = A2($elm$core$List$foldl, $folkertdev$svg_path_lowlevel$Path$LowLevel$optionFolder, $folkertdev$svg_path_lowlevel$Path$LowLevel$defaultConfig);
var $folkertdev$svg_path_lowlevel$Path$LowLevel$isEmpty = function (command) {
	switch (command.$) {
		case 'LineTo':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'Horizontal':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'Vertical':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'CurveTo':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'SmoothCurveTo':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'QuadraticBezierCurveTo':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'SmoothQuadraticBezierCurveTo':
			var mode = command.a;
			var coordinates = command.b;
			return $elm$core$List$isEmpty(coordinates);
		case 'EllipticalArc':
			var mode = command.a;
			var _arguments = command.b;
			return $elm$core$List$isEmpty(_arguments);
		default:
			return false;
	}
};
var $elm$core$Char$toLower = _Char_toLower;
var $elm$core$Char$toUpper = _Char_toUpper;
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter = F2(
	function (mode, character) {
		if (mode.$ === 'Absolute') {
			return $elm$core$String$fromChar(
				$elm$core$Char$toUpper(character));
		} else {
			return $elm$core$String$fromChar(
				$elm$core$Char$toLower(character));
		}
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate = F2(
	function (config, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return config.floatFormatter(x) + (',' + config.floatFormatter(y));
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate2 = F2(
	function (config, _v0) {
		var c1 = _v0.a;
		var c2 = _v0.b;
		return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, c1) + (' ' + A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, c2));
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate3 = F2(
	function (config, _v0) {
		var c1 = _v0.a;
		var c2 = _v0.b;
		var c3 = _v0.c;
		return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, c1) + (' ' + (A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, c2) + (' ' + A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, c3))));
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$encodeFlags = function (_v0) {
	var arcFlag = _v0.a;
	var direction = _v0.b;
	var _v1 = _Utils_Tuple2(arcFlag, direction);
	if (_v1.a.$ === 'LargestArc') {
		if (_v1.b.$ === 'Clockwise') {
			var _v2 = _v1.a;
			var _v3 = _v1.b;
			return _Utils_Tuple2(1, 0);
		} else {
			var _v6 = _v1.a;
			var _v7 = _v1.b;
			return _Utils_Tuple2(1, 1);
		}
	} else {
		if (_v1.b.$ === 'Clockwise') {
			var _v4 = _v1.a;
			var _v5 = _v1.b;
			return _Utils_Tuple2(0, 0);
		} else {
			var _v8 = _v1.a;
			var _v9 = _v1.b;
			return _Utils_Tuple2(0, 1);
		}
	}
};
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyEllipticalArcArgument = F2(
	function (config, _v0) {
		var radii = _v0.radii;
		var xAxisRotate = _v0.xAxisRotate;
		var arcFlag = _v0.arcFlag;
		var direction = _v0.direction;
		var target = _v0.target;
		var _v1 = $folkertdev$svg_path_lowlevel$Path$LowLevel$encodeFlags(
			_Utils_Tuple2(arcFlag, direction));
		var arc = _v1.a;
		var sweep = _v1.b;
		return A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, radii),
					$elm$core$String$fromFloat(xAxisRotate),
					$elm$core$String$fromInt(arc),
					$elm$core$String$fromInt(sweep),
					A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, target)
				]));
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyDrawTo = F2(
	function (config, command) {
		if ($folkertdev$svg_path_lowlevel$Path$LowLevel$isEmpty(command)) {
			return '';
		} else {
			switch (command.$) {
				case 'LineTo':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('L')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate(config),
								coordinates)));
				case 'Horizontal':
					var mode = command.a;
					var coordinates = command.b;
					return $elm$core$List$isEmpty(coordinates) ? '' : _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('H')),
						A2(
							$elm$core$String$join,
							' ',
							A2($elm$core$List$map, $elm$core$String$fromFloat, coordinates)));
				case 'Vertical':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('V')),
						A2(
							$elm$core$String$join,
							' ',
							A2($elm$core$List$map, $elm$core$String$fromFloat, coordinates)));
				case 'CurveTo':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('C')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate3(config),
								coordinates)));
				case 'SmoothCurveTo':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('S')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate2(config),
								coordinates)));
				case 'QuadraticBezierCurveTo':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('Q')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate2(config),
								coordinates)));
				case 'SmoothQuadraticBezierCurveTo':
					var mode = command.a;
					var coordinates = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('T')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate(config),
								coordinates)));
				case 'EllipticalArc':
					var mode = command.a;
					var _arguments = command.b;
					return _Utils_ap(
						A2(
							$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCharacter,
							mode,
							_Utils_chr('A')),
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyEllipticalArcArgument(config),
								_arguments)));
				default:
					return 'Z';
			}
		}
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyMoveTo = F2(
	function (config, _v0) {
		var mode = _v0.a;
		var coordinate = _v0.b;
		if (mode.$ === 'Absolute') {
			return 'M' + A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, coordinate);
		} else {
			return 'm' + A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyCoordinate, config, coordinate);
		}
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$toStringSubPath = F2(
	function (config, _v0) {
		var moveto = _v0.moveto;
		var drawtos = _v0.drawtos;
		return A2($folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyMoveTo, config, moveto) + (' ' + A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$folkertdev$svg_path_lowlevel$Path$LowLevel$stringifyDrawTo(config),
				drawtos)));
	});
var $folkertdev$svg_path_lowlevel$Path$LowLevel$toStringWith = F2(
	function (options, subpaths) {
		var config = $folkertdev$svg_path_lowlevel$Path$LowLevel$accumulateOptions(options);
		return A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$folkertdev$svg_path_lowlevel$Path$LowLevel$toStringSubPath(config),
				subpaths));
	});
var $folkertdev$one_true_path_experiment$SubPath$toStringWith = F2(
	function (options, subpath) {
		var config = A3($elm$core$List$foldl, $folkertdev$one_true_path_experiment$SubPath$optionFolder, $folkertdev$one_true_path_experiment$SubPath$defaultConfig, options);
		var lowLevelOptions = function () {
			var _v0 = config.decimalPlaces;
			if (_v0.$ === 'Nothing') {
				return _List_Nil;
			} else {
				var n = _v0.a;
				return _List_fromArray(
					[
						$folkertdev$svg_path_lowlevel$Path$LowLevel$decimalPlaces(n)
					]);
			}
		}();
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeL,
					$folkertdev$svg_path_lowlevel$Path$LowLevel$toStringWith(lowLevelOptions),
					$elm$core$List$singleton),
				$folkertdev$one_true_path_experiment$SubPath$toLowLevel(
					(config.mergeAdjacent ? $folkertdev$one_true_path_experiment$SubPath$compress : $elm$core$Basics$identity)(subpath))));
	});
var $folkertdev$one_true_path_experiment$SubPath$toString = function (subpath) {
	return A2($folkertdev$one_true_path_experiment$SubPath$toStringWith, _List_Nil, subpath);
};
var $folkertdev$one_true_path_experiment$Path$toString = A2(
	$elm$core$Basics$composeL,
	$elm$core$String$join(' '),
	$elm$core$List$map($folkertdev$one_true_path_experiment$SubPath$toString));
var $folkertdev$one_true_path_experiment$Path$element = F2(
	function (path, attributes) {
		return A2(
			$elm$svg$Svg$path,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$d(
					$folkertdev$one_true_path_experiment$Path$toString(path)),
				attributes),
			_List_Nil);
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm_community$typed_svg$TypedSvg$Core$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm_community$typed_svg$TypedSvg$TypesToStrings$paintToString = function (paint) {
	switch (paint.$) {
		case 'Paint':
			var color = paint.a;
			return $avh4$elm_color$Color$toCssString(color);
		case 'CSSVariable':
			var string = paint.a;
			return $elm$core$String$concat(
				_List_fromArray(
					['var(' + (string + ')')]));
		case 'Reference':
			var string = paint.a;
			return $elm$core$String$concat(
				_List_fromArray(
					['url(#', string, ')']));
		case 'ContextFill':
			return 'context-fill';
		case 'ContextStroke':
			return 'context-stroke';
		default:
			return 'none';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$fill = A2(
	$elm$core$Basics$composeL,
	$elm_community$typed_svg$TypedSvg$Core$attribute('fill'),
	$elm_community$typed_svg$TypedSvg$TypesToStrings$paintToString);
var $elm_community$typed_svg$TypedSvg$Attributes$fontFamily = function (families) {
	if (!families.b) {
		return A2($elm_community$typed_svg$TypedSvg$Core$attribute, 'font-family', 'inherit');
	} else {
		return A2(
			$elm_community$typed_svg$TypedSvg$Core$attribute,
			'font-family',
			A2($elm$core$String$join, ', ', families));
	}
};
var $elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString = function (length) {
	switch (length.$) {
		case 'Cm':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'cm';
		case 'Em':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'em';
		case 'Ex':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'ex';
		case 'In':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'in';
		case 'Mm':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'mm';
		case 'Num':
			var x = length.a;
			return $elm$core$String$fromFloat(x);
		case 'Pc':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'pc';
		case 'Percent':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + '%';
		case 'Pt':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'pt';
		case 'Px':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'px';
		default:
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'rem';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$fontSize = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'font-size',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Types$Px = function (a) {
	return {$: 'Px', a: a};
};
var $elm_community$typed_svg$TypedSvg$Types$px = $elm_community$typed_svg$TypedSvg$Types$Px;
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$fontSize(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm$virtual_dom$VirtualDom$nodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_nodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm_community$typed_svg$TypedSvg$Core$node = $elm$virtual_dom$VirtualDom$nodeNS('http://www.w3.org/2000/svg');
var $elm_community$typed_svg$TypedSvg$g = $elm_community$typed_svg$TypedSvg$Core$node('g');
var $elm$virtual_dom$VirtualDom$lazy2 = _VirtualDom_lazy2;
var $elm$svg$Svg$Lazy$lazy2 = $elm$virtual_dom$VirtualDom$lazy2;
var $author$project$Model$HoverSB = function (a) {
	return {$: 'HoverSB', a: a};
};
var $elm_community$typed_svg$TypedSvg$Types$PaintNone = {$: 'PaintNone'};
var $author$project$Components$Sunburst$mouseArc = function (s) {
	return $gampleman$elm_visualization$Shape$arc(
		{
			cornerRadius: 0,
			endAngle: s.x + s.width,
			innerRadius: $elm$core$Basics$sqrt(s.y),
			outerRadius: $author$project$Components$Sunburst$radius,
			padAngle: 0,
			padRadius: 0,
			startAngle: s.x
		});
};
var $elm_community$typed_svg$TypedSvg$Events$on = $elm$virtual_dom$VirtualDom$on;
var $elm_community$typed_svg$TypedSvg$Events$simpleOn = function (name) {
	return function (msg) {
		return A2(
			$elm_community$typed_svg$TypedSvg$Events$on,
			name,
			$elm$virtual_dom$VirtualDom$Normal(
				$elm$json$Json$Decode$succeed(msg)));
	};
};
var $elm_community$typed_svg$TypedSvg$Events$onMouseEnter = $elm_community$typed_svg$TypedSvg$Events$simpleOn('mouseenter');
var $elm_community$typed_svg$TypedSvg$Events$onMouseLeave = $elm_community$typed_svg$TypedSvg$Events$simpleOn('mouseleave');
var $elm_community$typed_svg$TypedSvg$Attributes$pointerEvents = $elm_community$typed_svg$TypedSvg$Core$attribute('pointer-events');
var $author$project$Components$Sunburst$mouseInteractionArcs = F2(
	function (segments, total) {
		return A2(
			$elm_community$typed_svg$TypedSvg$g,
			_List_fromArray(
				[
					$elm_community$typed_svg$TypedSvg$Attributes$pointerEvents('all'),
					$elm_community$typed_svg$TypedSvg$Events$onMouseLeave(
					$author$project$Model$HoverSB($elm$core$Maybe$Nothing))
				]),
			A2(
				$elm$core$List$map,
				function (item) {
					return A2(
						$folkertdev$one_true_path_experiment$Path$element,
						$author$project$Components$Sunburst$mouseArc(item),
						_List_fromArray(
							[
								$elm_community$typed_svg$TypedSvg$Attributes$fill($elm_community$typed_svg$TypedSvg$Types$PaintNone),
								$elm_community$typed_svg$TypedSvg$Events$onMouseEnter(
								$author$project$Model$HoverSB(
									$elm$core$Maybe$Just(
										{percentage: (100 * item.value) / total, sequence: item.node.sequence})))
							]));
				},
				segments));
	});
var $elm_community$typed_svg$TypedSvg$svg = $elm_community$typed_svg$TypedSvg$Core$node('svg');
var $elm_community$typed_svg$TypedSvg$Core$text = $elm$virtual_dom$VirtualDom$text;
var $elm_community$typed_svg$TypedSvg$TypesToStrings$anchorAlignmentToString = function (anchorAlignment) {
	switch (anchorAlignment.$) {
		case 'AnchorInherit':
			return 'inherit';
		case 'AnchorStart':
			return 'start';
		case 'AnchorMiddle':
			return 'middle';
		default:
			return 'end';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$textAnchor = function (anchorAlignment) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'text-anchor',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$anchorAlignmentToString(anchorAlignment));
};
var $elm_community$typed_svg$TypedSvg$text_ = $elm_community$typed_svg$TypedSvg$Core$node('text');
var $elm_community$typed_svg$TypedSvg$TypesToStrings$transformToString = function (xform) {
	var tr = F2(
		function (name, args) {
			return $elm$core$String$concat(
				_List_fromArray(
					[
						name,
						'(',
						A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, $elm$core$String$fromFloat, args)),
						')'
					]));
		});
	switch (xform.$) {
		case 'Matrix':
			var a = xform.a;
			var b = xform.b;
			var c = xform.c;
			var d = xform.d;
			var e = xform.e;
			var f = xform.f;
			return A2(
				tr,
				'matrix',
				_List_fromArray(
					[a, b, c, d, e, f]));
		case 'Rotate':
			var a = xform.a;
			var x = xform.b;
			var y = xform.c;
			return A2(
				tr,
				'rotate',
				_List_fromArray(
					[a, x, y]));
		case 'Scale':
			var x = xform.a;
			var y = xform.b;
			return A2(
				tr,
				'scale',
				_List_fromArray(
					[x, y]));
		case 'SkewX':
			var x = xform.a;
			return A2(
				tr,
				'skewX',
				_List_fromArray(
					[x]));
		case 'SkewY':
			var y = xform.a;
			return A2(
				tr,
				'skewY',
				_List_fromArray(
					[y]));
		default:
			var x = xform.a;
			var y = xform.b;
			return A2(
				tr,
				'translate',
				_List_fromArray(
					[x, y]));
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$transform = function (transforms) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'transform',
		A2(
			$elm$core$String$join,
			' ',
			A2($elm$core$List$map, $elm_community$typed_svg$TypedSvg$TypesToStrings$transformToString, transforms)));
};
var $elm_community$typed_svg$TypedSvg$Attributes$viewBox = F4(
	function (minX, minY, vWidth, vHeight) {
		return A2(
			$elm_community$typed_svg$TypedSvg$Core$attribute,
			'viewBox',
			A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					$elm$core$String$fromFloat,
					_List_fromArray(
						[minX, minY, vWidth, vHeight]))));
	});
var $elm_community$typed_svg$TypedSvg$Attributes$y = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'y',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$y = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$y(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $author$project$Components$Sunburst$sunburst = function (sbmodel) {
	var format = function (f) {
		return A2(
			$elm$core$String$left,
			5,
			$elm$core$String$fromFloat(f)) + '%';
	};
	var _v0 = function () {
		var _v1 = sbmodel.hovered;
		if (_v1.$ === 'Just') {
			var sequence = _v1.a.sequence;
			return $elm$core$Set$fromList(
				$elm_community$list_extra$List$Extra$inits(sequence));
		} else {
			return $elm$core$Set$empty;
		}
	}();
	return A2(
		$elm_community$typed_svg$TypedSvg$svg,
		_List_fromArray(
			[
				A4($elm_community$typed_svg$TypedSvg$Attributes$viewBox, 0, 0, $author$project$Components$Sunburst$sb_w, $author$project$Components$Sunburst$sb_h)
			]),
		_List_fromArray(
			[
				A2(
				$elm_community$typed_svg$TypedSvg$g,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$transform(
						_List_fromArray(
							[
								A2($elm_community$typed_svg$TypedSvg$Types$Translate, $author$project$Components$Sunburst$radius, $author$project$Components$Sunburst$radius)
							]))
					]),
				_List_fromArray(
					[
						A2(
						$elm_community$typed_svg$TypedSvg$g,
						_List_Nil,
						(!sbmodel.total) ? _List_fromArray(
							[
								A2(
								$elm_community$typed_svg$TypedSvg$text_,
								_List_Nil,
								_List_fromArray(
									[
										$elm_community$typed_svg$TypedSvg$Core$text('Keine Medaillen gewonnen')
									]))
							]) : A2(
							$elm$core$List$map,
							function (item) {
								return A2(
									$folkertdev$one_true_path_experiment$Path$element,
									$author$project$Components$Sunburst$arc(item),
									_List_fromArray(
										[
											$elm_community$typed_svg$TypedSvg$Attributes$fill(
											$elm_community$typed_svg$TypedSvg$Types$Paint(
												A2(
													$elm$core$Maybe$withDefault,
													$avh4$elm_color$Color$black,
													A2($gampleman$elm_visualization$Scale$convert, $author$project$Components$Sunburst$colorScale, item.node.category))))
										]));
							},
							sbmodel.layout)),
						A3($elm$svg$Svg$Lazy$lazy2, $author$project$Components$Sunburst$mouseInteractionArcs, sbmodel.layout, sbmodel.total),
						function () {
						var _v2 = sbmodel.hovered;
						if (_v2.$ === 'Just') {
							var percentage = _v2.a.percentage;
							var sequence = _v2.a.sequence;
							return A2(
								$elm_community$typed_svg$TypedSvg$g,
								_List_fromArray(
									[
										$elm_community$typed_svg$TypedSvg$Attributes$textAnchor($elm_community$typed_svg$TypedSvg$Types$AnchorMiddle),
										$elm_community$typed_svg$TypedSvg$Attributes$fontFamily(
										_List_fromArray(
											['sans-serif'])),
										$elm_community$typed_svg$TypedSvg$Attributes$fill(
										$elm_community$typed_svg$TypedSvg$Types$Paint(
											A3($avh4$elm_color$Color$rgb, 0.5, 0.5, 0.5)))
									]),
								_List_fromArray(
									[
										A2(
										$elm_community$typed_svg$TypedSvg$text_,
										_List_fromArray(
											[
												$elm_community$typed_svg$TypedSvg$Attributes$InPx$fontSize(28),
												$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(-15)
											]),
										_List_fromArray(
											[
												$elm_community$typed_svg$TypedSvg$Core$text(
												format(percentage))
											])),
										A2(
										$elm_community$typed_svg$TypedSvg$text_,
										_List_fromArray(
											[
												$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(15)
											]),
										_List_fromArray(
											[
												$elm_community$typed_svg$TypedSvg$Core$text(
												A2(
													$elm$core$Maybe$withDefault,
													'',
													$elm_community$list_extra$List$Extra$last(sequence)))
											]))
									]));
						} else {
							return $elm_community$typed_svg$TypedSvg$Core$text('');
						}
					}()
					]))
			]));
};
var $author$project$View$medaillenverteilungSection = function (model) {
	var countries = $elm$core$Set$toList(
		$elm$core$Set$fromList(
			A2(
				$elm$core$List$map,
				function (p) {
					return (p.team !== '') ? p.team : p.noc;
				},
				model.participations)));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('medaillenverteilung'),
				A2($elm$html$Html$Attributes$style, 'margin', '60px 0'),
				A2($elm$html$Html$Attributes$style, 'padding', '20px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'max-width', '900px'),
						A2($elm$html$Html$Attributes$style, 'margin', '0 auto')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-align', 'left'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px'),
								A2($elm$html$Html$Attributes$style, 'color', '#333')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('2. Medaillenverteilung')
							])),
						function () {
						if (model.loading) {
							return A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Lade Daten...')
									]));
						} else {
							var _v0 = model.error;
							if (_v0.$ === 'Just') {
								var err = _v0.a;
								return A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', '#b00020')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Fehler beim Laden: ' + err)
										]));
							} else {
								return $elm$html$Html$text('');
							}
						}
					}(),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								$author$project$Components$Sunburst$sunburst(model.sbmodel),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'width', '300px'),
										A2($elm$html$Html$Attributes$style, 'display', 'flex'),
										A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
										A2($elm$html$Html$Attributes$style, 'align-items', 'center')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h3,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Selected Country')
											])),
										A2(
										$elm$html$Html$select,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'width', '150px'),
												$elm$html$Html$Events$onInput($author$project$Model$ChangeSBCountry)
											]),
										A2(
											$elm$core$List$map,
											function (p) {
												return _Utils_eq(p, model.sbcountry) ? A2(
													$elm$html$Html$option,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$selected(true),
															$elm$html$Html$Attributes$value(p)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(p)
														])) : A2(
													$elm$html$Html$option,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$value(p)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(p)
														]));
											},
											countries))
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'text-align', 'right'),
						A2($elm$html$Html$Attributes$style, 'max-width', '900px'),
						A2($elm$html$Html$Attributes$style, 'margin', '10px auto 0')
					]),
				_List_fromArray(
					[
						$author$project$View$nextLink('#parallele-koordinaten')
					]))
			]));
};
var $author$project$Model$DragOverAxis = function (a) {
	return {$: 'DragOverAxis', a: a};
};
var $author$project$Model$DropAxis = function (a) {
	return {$: 'DropAxis', a: a};
};
var $author$project$Model$SetPcHover = function (a) {
	return {$: 'SetPcHover', a: a};
};
var $author$project$Model$StartDragAxis = function (a) {
	return {$: 'StartDragAxis', a: a};
};
var $author$project$Model$TogglePcDebug = function (a) {
	return {$: 'TogglePcDebug', a: a};
};
var $author$project$Model$TogglePcMode = function (a) {
	return {$: 'TogglePcMode', a: a};
};
var $author$project$Model$ToggleRanking = function (a) {
	return {$: 'ToggleRanking', a: a};
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$html$Html$Attributes$draggable = _VirtualDom_attribute('draggable');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $elm_community$typed_svg$TypedSvg$Types$AnchorStart = {$: 'AnchorStart'};
var $elm_community$typed_svg$TypedSvg$Types$Opacity = function (a) {
	return {$: 'Opacity', a: a};
};
var $noahzgordon$elm_color_extra$Color$Interpolate$RGB = {$: 'RGB'};
var $elm_community$typed_svg$TypedSvg$Attributes$d = $elm_community$typed_svg$TypedSvg$Core$attribute('d');
var $elm_community$list_extra$List$Extra$getAt = F2(
	function (idx, xs) {
		return (idx < 0) ? $elm$core$Maybe$Nothing : $elm$core$List$head(
			A2($elm$core$List$drop, idx, xs));
	});
var $elm_community$typed_svg$TypedSvg$Attributes$height = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'height',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$height = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$height(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $gampleman$elm_visualization$Shape$Generators$line = F2(
	function (curve, data) {
		var makeCurves = F2(
			function (datum, _v3) {
				var prev = _v3.a;
				var list = _v3.b;
				var _v0 = _Utils_Tuple3(prev, datum, list);
				if (_v0.b.$ === 'Nothing') {
					var _v1 = _v0.b;
					var l = _v0.c;
					return _Utils_Tuple2(false, l);
				} else {
					if (!_v0.a) {
						var point = _v0.b.a;
						var l = _v0.c;
						return _Utils_Tuple2(
							true,
							A2(
								$elm$core$List$cons,
								_List_fromArray(
									[point]),
								l));
					} else {
						if (_v0.c.b) {
							var p1 = _v0.b.a;
							var _v2 = _v0.c;
							var ps = _v2.a;
							var l = _v2.b;
							return _Utils_Tuple2(
								true,
								A2(
									$elm$core$List$cons,
									A2($elm$core$List$cons, p1, ps),
									l));
						} else {
							var p1 = _v0.b.a;
							var l = _v0.c;
							return _Utils_Tuple2(
								true,
								A2(
									$elm$core$List$cons,
									_List_fromArray(
										[p1]),
									l));
						}
					}
				}
			});
		return A2(
			$elm$core$List$map,
			curve,
			A3(
				$elm$core$List$foldr,
				makeCurves,
				_Utils_Tuple2(false, _List_Nil),
				data).b);
	});
var $gampleman$elm_visualization$Shape$line = $gampleman$elm_visualization$Shape$Generators$line;
var $elm_community$typed_svg$TypedSvg$line = $elm_community$typed_svg$TypedSvg$Core$node('line');
var $folkertdev$one_true_path_experiment$Curve$linear = function (points) {
	if (!points.b) {
		return $folkertdev$one_true_path_experiment$SubPath$empty;
	} else {
		var x = points.a;
		var xs = points.b;
		return A2(
			$folkertdev$one_true_path_experiment$SubPath$with,
			$folkertdev$one_true_path_experiment$LowLevel$Command$moveTo(x),
			_List_fromArray(
				[
					$folkertdev$one_true_path_experiment$LowLevel$Command$lineTo(xs)
				]));
	}
};
var $gampleman$elm_visualization$Shape$linearCurve = $folkertdev$one_true_path_experiment$Curve$linear;
var $noahzgordon$elm_color_extra$Color$Convert$colorToXyz = function (cl) {
	var c = function (ch) {
		var ch_ = (ch > 4.045e-2) ? A2($elm$core$Basics$pow, (ch + 5.5e-2) / 1.055, 2.4) : (ch / 12.92);
		return ch_ * 100;
	};
	var _v0 = $avh4$elm_color$Color$toRgba(cl);
	var red = _v0.red;
	var green = _v0.green;
	var blue = _v0.blue;
	var b = c(blue);
	var g = c(green);
	var r = c(red);
	return {x: ((r * 0.4124) + (g * 0.3576)) + (b * 0.1805), y: ((r * 0.2126) + (g * 0.7152)) + (b * 7.22e-2), z: ((r * 1.93e-2) + (g * 0.1192)) + (b * 0.9505)};
};
var $noahzgordon$elm_color_extra$Color$Convert$xyzToLab = function (_v0) {
	var x = _v0.x;
	var y = _v0.y;
	var z = _v0.z;
	var c = function (ch) {
		return (ch > 8.856e-3) ? A2($elm$core$Basics$pow, ch, 1 / 3) : ((7.787 * ch) + (16 / 116));
	};
	var x_ = c(x / 95.047);
	var y_ = c(y / 100);
	var z_ = c(z / 108.883);
	return {a: 500 * (x_ - y_), b: 200 * (y_ - z_), l: (116 * y_) - 16};
};
var $noahzgordon$elm_color_extra$Color$Convert$colorToLab = A2($elm$core$Basics$composeR, $noahzgordon$elm_color_extra$Color$Convert$colorToXyz, $noahzgordon$elm_color_extra$Color$Convert$xyzToLab);
var $elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * $elm$core$Basics$pi) / 180;
};
var $noahzgordon$elm_color_extra$Color$Interpolate$degree180 = $elm$core$Basics$degrees(180);
var $noahzgordon$elm_color_extra$Color$Interpolate$degree360 = $elm$core$Basics$degrees(360);
var $avh4$elm_color$Color$hsla = F4(
	function (hue, sat, light, alpha) {
		var _v0 = _Utils_Tuple3(hue, sat, light);
		var h = _v0.a;
		var s = _v0.b;
		var l = _v0.c;
		var m2 = (l <= 0.5) ? (l * (s + 1)) : ((l + s) - (l * s));
		var m1 = (l * 2) - m2;
		var hueToRgb = function (h__) {
			var h_ = (h__ < 0) ? (h__ + 1) : ((h__ > 1) ? (h__ - 1) : h__);
			return ((h_ * 6) < 1) ? (m1 + (((m2 - m1) * h_) * 6)) : (((h_ * 2) < 1) ? m2 : (((h_ * 3) < 2) ? (m1 + (((m2 - m1) * ((2 / 3) - h_)) * 6)) : m1));
		};
		var b = hueToRgb(h - (1 / 3));
		var g = hueToRgb(h);
		var r = hueToRgb(h + (1 / 3));
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, alpha);
	});
var $noahzgordon$elm_color_extra$Color$Convert$labToXyz = function (_v0) {
	var l = _v0.l;
	var a = _v0.a;
	var b = _v0.b;
	var y = (l + 16) / 116;
	var c = function (ch) {
		var ch_ = (ch * ch) * ch;
		return (ch_ > 8.856e-3) ? ch_ : ((ch - (16 / 116)) / 7.787);
	};
	return {
		x: c(y + (a / 500)) * 95.047,
		y: c(y) * 100,
		z: c(y - (b / 200)) * 108.883
	};
};
var $noahzgordon$elm_color_extra$Color$Convert$xyzToColor = function (_v0) {
	var x = _v0.x;
	var y = _v0.y;
	var z = _v0.z;
	var z_ = z / 100;
	var y_ = y / 100;
	var x_ = x / 100;
	var r = ((x_ * 3.2404542) + (y_ * (-1.5371385))) + (z_ * (-0.4986));
	var g = ((x_ * (-0.969266)) + (y_ * 1.8760108)) + (z_ * 4.1556e-2);
	var c = function (ch) {
		var ch_ = (ch > 3.1308e-3) ? ((1.055 * A2($elm$core$Basics$pow, ch, 1 / 2.4)) - 5.5e-2) : (12.92 * ch);
		return A3($elm$core$Basics$clamp, 0, 1, ch_);
	};
	var b = ((x_ * 5.56434e-2) + (y_ * (-0.2040259))) + (z_ * 1.0572252);
	return A3(
		$avh4$elm_color$Color$rgb,
		c(r),
		c(g),
		c(b));
};
var $noahzgordon$elm_color_extra$Color$Convert$labToColor = A2($elm$core$Basics$composeR, $noahzgordon$elm_color_extra$Color$Convert$labToXyz, $noahzgordon$elm_color_extra$Color$Convert$xyzToColor);
var $noahzgordon$elm_color_extra$Color$Interpolate$linear = F3(
	function (t, i1, i2) {
		return i1 + ((i2 - i1) * t);
	});
var $avh4$elm_color$Color$toHsla = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var minColor = A2(
		$elm$core$Basics$min,
		r,
		A2($elm$core$Basics$min, g, b));
	var maxColor = A2(
		$elm$core$Basics$max,
		r,
		A2($elm$core$Basics$max, g, b));
	var l = (minColor + maxColor) / 2;
	var s = _Utils_eq(minColor, maxColor) ? 0 : ((l < 0.5) ? ((maxColor - minColor) / (maxColor + minColor)) : ((maxColor - minColor) / ((2 - maxColor) - minColor)));
	var h1 = _Utils_eq(maxColor, r) ? ((g - b) / (maxColor - minColor)) : (_Utils_eq(maxColor, g) ? (2 + ((b - r) / (maxColor - minColor))) : (4 + ((r - g) / (maxColor - minColor))));
	var h2 = h1 * (1 / 6);
	var h3 = $elm$core$Basics$isNaN(h2) ? 0 : ((h2 < 0) ? (h2 + 1) : h2);
	return {alpha: a, hue: h3, lightness: l, saturation: s};
};
var $noahzgordon$elm_color_extra$Color$Interpolate$interpolate = F4(
	function (space, cl1, cl2, t) {
		var i = $noahzgordon$elm_color_extra$Color$Interpolate$linear(t);
		switch (space.$) {
			case 'RGB':
				var cl2_ = $avh4$elm_color$Color$toRgba(cl2);
				var cl1_ = $avh4$elm_color$Color$toRgba(cl1);
				return A4(
					$avh4$elm_color$Color$rgba,
					A2(i, cl1_.red, cl2_.red),
					A2(i, cl1_.green, cl2_.green),
					A2(i, cl1_.blue, cl2_.blue),
					A2(i, cl1_.alpha, cl2_.alpha));
			case 'HSL':
				var cl2_ = $avh4$elm_color$Color$toHsla(cl2);
				var h2 = cl2_.hue;
				var cl1_ = $avh4$elm_color$Color$toHsla(cl1);
				var h1 = cl1_.hue;
				var dH = ((_Utils_cmp(h2, h1) > 0) && (_Utils_cmp(h2 - h1, $noahzgordon$elm_color_extra$Color$Interpolate$degree180) > 0)) ? ((h2 - h1) + $noahzgordon$elm_color_extra$Color$Interpolate$degree360) : (((_Utils_cmp(h2, h1) < 0) && (_Utils_cmp(h1 - h2, $noahzgordon$elm_color_extra$Color$Interpolate$degree180) > 0)) ? ((h2 + $noahzgordon$elm_color_extra$Color$Interpolate$degree360) - h1) : (h2 - h1));
				return A4(
					$avh4$elm_color$Color$hsla,
					h1 + (t * dH),
					A2(i, cl1_.saturation, cl2_.saturation),
					A2(i, cl1_.lightness, cl2_.lightness),
					A2(i, cl1_.alpha, cl2_.alpha));
			default:
				var lab2 = $noahzgordon$elm_color_extra$Color$Convert$colorToLab(cl2);
				var lab1 = $noahzgordon$elm_color_extra$Color$Convert$colorToLab(cl1);
				return $noahzgordon$elm_color_extra$Color$Convert$labToColor(
					{
						a: A2(i, lab1.a, lab2.a),
						b: A2(i, lab1.b, lab2.b),
						l: A2(i, lab1.l, lab2.l)
					});
		}
	});
var $noahzgordon$elm_color_extra$Color$Gradient$calculateColor = F4(
	function (space, _v0, _v1, t) {
		var t1 = _v0.a;
		var cl1 = _v0.b;
		var t2 = _v1.a;
		var cl2 = _v1.b;
		return (!t) ? cl1 : ((t === 1) ? cl2 : A4($noahzgordon$elm_color_extra$Color$Interpolate$interpolate, space, cl1, cl2, (t - t1) / (t2 - t1)));
	});
var $noahzgordon$elm_color_extra$Color$Gradient$getNextGradientStop = F2(
	function (currentStop, gradient) {
		var nextStop = $elm$core$List$head(gradient);
		if (nextStop.$ === 'Just') {
			var s = nextStop.a;
			return _Utils_Tuple2(
				s,
				A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(gradient)));
		} else {
			return _Utils_Tuple2(currentStop, gradient);
		}
	});
var $noahzgordon$elm_color_extra$Color$Gradient$calculateGradient = F5(
	function (space, stop1, stop2, gradient, t) {
		if (_Utils_cmp(stop2.a, t) < 0) {
			var stop1_ = stop2;
			var _v0 = A2($noahzgordon$elm_color_extra$Color$Gradient$getNextGradientStop, stop2, gradient);
			var stop2_ = _v0.a;
			var gradient_ = _v0.b;
			return {
				gradient: gradient_,
				palette: _List_fromArray(
					[
						A4($noahzgordon$elm_color_extra$Color$Gradient$calculateColor, space, stop1_, stop2_, t)
					]),
				stop1: stop1_,
				stop2: stop2_
			};
		} else {
			return {
				gradient: gradient,
				palette: _List_fromArray(
					[
						A4($noahzgordon$elm_color_extra$Color$Gradient$calculateColor, space, stop1, stop2, t)
					]),
				stop1: stop1,
				stop2: stop2
			};
		}
	});
var $noahzgordon$elm_color_extra$Color$Gradient$adjustGradient = F3(
	function (space, t, _v0) {
		var stop1 = _v0.stop1;
		var stop2 = _v0.stop2;
		var gradient = _v0.gradient;
		var palette = _v0.palette;
		var newInfo = A5($noahzgordon$elm_color_extra$Color$Gradient$calculateGradient, space, stop1, stop2, gradient, t);
		return {
			gradient: newInfo.gradient,
			palette: _Utils_ap(newInfo.palette, palette),
			stop1: newInfo.stop1,
			stop2: newInfo.stop2
		};
	});
var $noahzgordon$elm_color_extra$Color$Gradient$linearGradientFromStops = F3(
	function (space, stops, size) {
		var purifiedStops = A2(
			$elm$core$List$sortBy,
			function (_v4) {
				var t = _v4.a;
				return t;
			},
			A2(
				$elm$core$List$filter,
				function (_v3) {
					var t = _v3.a;
					return (t >= 0) && (t <= 1);
				},
				stops));
		var stop1 = $elm$core$List$head(purifiedStops);
		if (stop1.$ === 'Just') {
			var s1 = stop1.a;
			var l = size - 1;
			var stops_ = A2(
				$elm$core$List$map,
				function (i) {
					return i / l;
				},
				A2($elm$core$List$range, 0, l));
			var currentStops = A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(purifiedStops));
			var _v1 = A2($noahzgordon$elm_color_extra$Color$Gradient$getNextGradientStop, s1, currentStops);
			var s2 = _v1.a;
			var g = _v1.b;
			return $elm$core$List$reverse(
				function (_v2) {
					var palette = _v2.palette;
					return palette;
				}(
					A3(
						$elm$core$List$foldl,
						$noahzgordon$elm_color_extra$Color$Gradient$adjustGradient(space),
						{gradient: g, palette: _List_Nil, stop1: s1, stop2: s2},
						stops_)));
		} else {
			return _List_Nil;
		}
	});
var $noahzgordon$elm_color_extra$Color$Gradient$linearGradient = F3(
	function (space, palette, size) {
		var l = $elm$core$List$length(palette) - 1;
		var gr = A3(
			$elm$core$List$map2,
			F2(
				function (i, cl) {
					return _Utils_Tuple2(i / l, cl);
				}),
			A2($elm$core$List$range, 0, l),
			palette);
		return A3($noahzgordon$elm_color_extra$Color$Gradient$linearGradientFromStops, space, gr, size);
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm_community$typed_svg$TypedSvg$path = $elm_community$typed_svg$TypedSvg$Core$node('path');
var $elm_community$typed_svg$TypedSvg$rect = $elm_community$typed_svg$TypedSvg$Core$node('rect');
var $elm_community$typed_svg$TypedSvg$Attributes$stroke = A2(
	$elm$core$Basics$composeL,
	$elm_community$typed_svg$TypedSvg$Core$attribute('stroke'),
	$elm_community$typed_svg$TypedSvg$TypesToStrings$paintToString);
var $elm_community$typed_svg$TypedSvg$TypesToStrings$opacityToString = function (opacity) {
	if (opacity.$ === 'Opacity') {
		var n = opacity.a;
		return $elm$core$String$fromFloat(n);
	} else {
		return 'inherit';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$strokeOpacity = A2(
	$elm$core$Basics$composeL,
	$elm_community$typed_svg$TypedSvg$Core$attribute('stroke-opacity'),
	$elm_community$typed_svg$TypedSvg$TypesToStrings$opacityToString);
var $elm_community$typed_svg$TypedSvg$Attributes$strokeWidth = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'stroke-width',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $gampleman$elm_visualization$Scale$ticks = F2(
	function (_v0, count) {
		var scale = _v0.a;
		return A2(scale.ticks, scale.domain, count);
	});
var $elm_community$typed_svg$TypedSvg$Attributes$width = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'width',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$width = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$width(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$x = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'x',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$x = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$x(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$x1 = function (position) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'x1',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(position));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$x1 = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$x1(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$x2 = function (position) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'x2',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(position));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$x2 = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$x2(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$y1 = function (position) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'y1',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(position));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$y1 = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$y1(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Attributes$y2 = function (position) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'y2',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(position));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$y2 = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$y2(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $author$project$Components$ParallelCoordinates$view = F5(
	function (cfg, axes, seriesList, hoveredName, onHover) {
		var valuesForAxis = function (aid) {
			return A2(
				$elm$core$List$filterMap,
				function (s) {
					return A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$second,
						$elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function (_v11) {
									var id = _v11.a;
									return _Utils_eq(id, aid);
								},
								s.values)));
				},
				seriesList);
		};
		var seedPalette = _List_fromArray(
			[
				A3($avh4$elm_color$Color$rgb255, 49, 54, 149),
				A3($avh4$elm_color$Color$rgb255, 69, 117, 180),
				A3($avh4$elm_color$Color$rgb255, 116, 173, 209),
				A3($avh4$elm_color$Color$rgb255, 171, 217, 233),
				A3($avh4$elm_color$Color$rgb255, 224, 243, 248),
				A3($avh4$elm_color$Color$rgb255, 254, 224, 144),
				A3($avh4$elm_color$Color$rgb255, 253, 174, 97),
				A3($avh4$elm_color$Color$rgb255, 244, 109, 67),
				A3($avh4$elm_color$Color$rgb255, 215, 48, 39),
				A3($avh4$elm_color$Color$rgb255, 165, 0, 38)
			]);
		var rightLabelMargin = 60;
		var ranksForAxis = function (aid) {
			var sortedDesc = $elm$core$List$reverse(
				$elm$core$List$sort(
					valuesForAxis(aid)));
			var uniques = $elm_community$list_extra$List$Extra$unique(sortedDesc);
			return $elm$core$Dict$fromList(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (i, v) {
							return _Utils_Tuple2(v, i + 1);
						}),
					uniques));
		};
		var paletteSize = 256;
		var medalsFor = function (s) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(
					$elm$core$Maybe$map,
					$elm$core$Tuple$second,
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (_v10) {
								var id = _v10.a;
								return id === 'medals';
							},
							s.values))));
		};
		var minMedals = A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$minimum(
				A2($elm$core$List$map, medalsFor, seriesList)));
		var maxRank = function (aid) {
			return A2(
				$elm$core$Basics$max,
				1,
				$elm$core$List$length(
					$elm_community$list_extra$List$Extra$unique(
						valuesForAxis(aid))));
		};
		var maxMedals = A2(
			$elm$core$Maybe$withDefault,
			1,
			$elm$core$List$maximum(
				A2($elm$core$List$map, medalsFor, seriesList)));
		var span = function () {
			var d = maxMedals - minMedals;
			return (!d) ? 1 : d;
		}();
		var normMedals = function (v) {
			return _Utils_eq(maxMedals, minMedals) ? 0.5 : ((maxMedals - v) / span);
		};
		var gradientPalette = A3($noahzgordon$elm_color_extra$Color$Gradient$linearGradient, $noahzgordon$elm_color_extra$Color$Interpolate$RGB, seedPalette, paletteSize);
		var gradientColor = function (t) {
			var idx = function () {
				var x = $elm$core$Basics$round(t * (paletteSize - 1));
				return A3($elm$core$Basics$clamp, 0, paletteSize - 1, x);
			}();
			return A2(
				$elm$core$Maybe$withDefault,
				A3($avh4$elm_color$Color$rgb255, 165, 0, 38),
				A2($elm_community$list_extra$List$Extra$getAt, idx, gradientPalette));
		};
		var globalMaxRank = A2(
			$elm$core$Maybe$withDefault,
			1,
			$elm$core$List$maximum(
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.id;
						},
						maxRank),
					axes)));
		var formatTick = F2(
			function (axisId, v) {
				switch (axisId) {
					case 'pop':
						return (v >= 1.0e9) ? ($elm$core$String$fromFloat(
							$elm$core$Basics$round(v / 1.0e8) / 10) + 'B') : ((v >= 1.0e6) ? ($elm$core$String$fromFloat(
							$elm$core$Basics$round(v / 1.0e5) / 10) + 'M') : ((v >= 1.0e3) ? ($elm$core$String$fromFloat(
							$elm$core$Basics$round(v / 1.0e2) / 10) + 'K') : $elm$core$String$fromInt(
							$elm$core$Basics$round(v))));
					case 'gdp':
						return (v >= 1.0e12) ? ($elm$core$String$fromFloat(
							$elm$core$Basics$round(v / 1.0e11) / 10) + 'T') : ((v >= 1.0e9) ? ($elm$core$String$fromFloat(
							$elm$core$Basics$round(v / 1.0e8) / 10) + 'B') : ((v >= 1.0e6) ? ($elm$core$String$fromFloat(
							$elm$core$Basics$round(v / 1.0e5) / 10) + 'M') : $elm$core$String$fromInt(
							$elm$core$Basics$round(v))));
					case 'age':
						return $elm$core$String$fromInt(
							$elm$core$Basics$round(v));
					default:
						return $elm$core$String$fromInt(
							$elm$core$Basics$round(v));
				}
			});
		var extent = function (vals) {
			var _v8 = _Utils_Tuple2(
				$elm$core$List$minimum(vals),
				$elm$core$List$maximum(vals));
			if ((_v8.a.$ === 'Just') && (_v8.b.$ === 'Just')) {
				var lo = _v8.a.a;
				var hi = _v8.b.a;
				return _Utils_eq(lo, hi) ? _Utils_Tuple2(lo - 1, hi + 1) : _Utils_Tuple2(lo, hi);
			} else {
				return _Utils_Tuple2(0, 1);
			}
		};
		var yScales = A2(
			$elm$core$List$map,
			function (a) {
				if (cfg.ranking) {
					return _Utils_Tuple2(
						a.id,
						A2(
							$gampleman$elm_visualization$Scale$linear,
							_Utils_Tuple2(cfg.height - cfg.padding, cfg.padding),
							_Utils_Tuple2(globalMaxRank, 1)));
				} else {
					if (a.id === 'medals') {
						return _Utils_Tuple2(
							a.id,
							A2(
								$gampleman$elm_visualization$Scale$linear,
								_Utils_Tuple2(cfg.height - cfg.padding, cfg.padding),
								_Utils_Tuple2(
									maxRank(a.id),
									1)));
					} else {
						var _v7 = extent(
							valuesForAxis(a.id));
						var lo = _v7.a;
						var hi = _v7.b;
						return _Utils_Tuple2(
							a.id,
							A2(
								$gampleman$elm_visualization$Scale$linear,
								_Utils_Tuple2(cfg.height - cfg.padding, cfg.padding),
								_Utils_Tuple2(lo, hi)));
					}
				}
			},
			axes);
		var yScaleFor = function (aid) {
			return A2(
				$elm$core$Maybe$withDefault,
				A2(
					$gampleman$elm_visualization$Scale$linear,
					_Utils_Tuple2(cfg.height - cfg.padding, cfg.padding),
					_Utils_Tuple2(0, 1)),
				A2(
					$elm$core$Maybe$map,
					$elm$core$Tuple$second,
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (_v6) {
								var id = _v6.a;
								return _Utils_eq(id, aid);
							},
							yScales))));
		};
		var dimCount = A2(
			$elm$core$Basics$max,
			2,
			$elm$core$List$length(axes));
		var xScale = A2(
			$gampleman$elm_visualization$Scale$linear,
			_Utils_Tuple2(cfg.padding, cfg.width - cfg.padding),
			_Utils_Tuple2(0, dimCount - 1));
		var hoverLabel = function () {
			if (hoveredName.$ === 'Nothing') {
				return _List_Nil;
			} else {
				var name = hoveredName.a;
				var mSeries = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (s) {
							return _Utils_eq(s.name, name);
						},
						seriesList));
				if (mSeries.$ === 'Nothing') {
					return _List_Nil;
				} else {
					var s = mSeries.a;
					var xLast = A2($gampleman$elm_visualization$Scale$convert, xScale, dimCount - 1);
					var lastIndex = dimCount - 1;
					var lastAxis = A2(
						$elm$core$Maybe$withDefault,
						{id: '', label: ''},
						$elm$core$List$head(
							A2($elm$core$List$drop, lastIndex, axes)));
					var v0 = A2(
						$elm$core$Maybe$withDefault,
						0,
						A2(
							$elm$core$Maybe$map,
							$elm$core$Tuple$second,
							$elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (_v5) {
										var id = _v5.a;
										return _Utils_eq(id, lastAxis.id);
									},
									s.values))));
					var vPlot = cfg.ranking ? ((lastAxis.id === 'medals') ? A3($elm$core$Basics$clamp, 1, globalMaxRank, v0) : A2(
						$elm$core$Maybe$withDefault,
						1,
						A2(
							$elm$core$Dict$get,
							v0,
							ranksForAxis(lastAxis.id)))) : ((lastAxis.id === 'medals') ? A3(
						$elm$core$Basics$clamp,
						1,
						maxRank(lastAxis.id),
						v0) : v0);
					var rawTy = A2(
						$gampleman$elm_visualization$Scale$convert,
						yScaleFor(lastAxis.id),
						vPlot);
					var ty = A3($elm$core$Basics$clamp, cfg.padding + 4, (cfg.height - cfg.padding) - 4, rawTy);
					var gapRight = 22;
					var tx = xLast + gapRight;
					return _List_fromArray(
						[
							A2(
							$elm_community$typed_svg$TypedSvg$text_,
							_List_fromArray(
								[
									$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(tx),
									$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(ty - 6),
									$elm_community$typed_svg$TypedSvg$Attributes$textAnchor($elm_community$typed_svg$TypedSvg$Types$AnchorStart),
									$elm_community$typed_svg$TypedSvg$Attributes$fontSize(
									$elm_community$typed_svg$TypedSvg$Types$px(12))
								]),
							_List_fromArray(
								[
									$elm_community$typed_svg$TypedSvg$Core$text(name)
								]))
						]);
				}
			}
		}();
		var axisSvg = function (_v2) {
			var i = _v2.a;
			var a = _v2.b;
			var ys = yScaleFor(a.id);
			var yTop = cfg.padding;
			var yBot = cfg.height - cfg.padding;
			var yAt = function (t) {
				return A2($gampleman$elm_visualization$Scale$convert, ys, t);
			};
			var xPos = A2($gampleman$elm_visualization$Scale$convert, xScale, i);
			var ticks = A2($gampleman$elm_visualization$Scale$ticks, ys, 5);
			var isRankAxis = cfg.ranking || (a.id === 'medals');
			var tickLabel = function (t) {
				return isRankAxis ? $elm$core$String$fromInt(
					$elm$core$Basics$round(t)) : A2(formatTick, a.id, t);
			};
			return A2(
				$elm_community$typed_svg$TypedSvg$g,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$transform(
						_List_fromArray(
							[
								A2($elm_community$typed_svg$TypedSvg$Types$Translate, xPos, 0)
							]))
					]),
				_List_fromArray(
					[
						A2(
						$elm_community$typed_svg$TypedSvg$rect,
						_List_fromArray(
							[
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(-1),
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(yTop),
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(2),
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(yBot - yTop),
								$elm_community$typed_svg$TypedSvg$Attributes$fill(
								$elm_community$typed_svg$TypedSvg$Types$Paint(
									A3($avh4$elm_color$Color$rgb255, 200, 200, 200)))
							]),
						_List_Nil),
						A2(
						$elm_community$typed_svg$TypedSvg$g,
						_List_Nil,
						A2(
							$elm$core$List$map,
							function (t) {
								var yy = yAt(t);
								return A2(
									$elm_community$typed_svg$TypedSvg$g,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm_community$typed_svg$TypedSvg$line,
											_List_fromArray(
												[
													$elm_community$typed_svg$TypedSvg$Attributes$InPx$x1(-4),
													$elm_community$typed_svg$TypedSvg$Attributes$InPx$y1(yy),
													$elm_community$typed_svg$TypedSvg$Attributes$InPx$x2(4),
													$elm_community$typed_svg$TypedSvg$Attributes$InPx$y2(yy),
													$elm_community$typed_svg$TypedSvg$Attributes$stroke(
													$elm_community$typed_svg$TypedSvg$Types$Paint(
														A3($avh4$elm_color$Color$rgb255, 180, 180, 180))),
													$elm_community$typed_svg$TypedSvg$Attributes$strokeWidth(
													$elm_community$typed_svg$TypedSvg$Types$px(1))
												]),
											_List_Nil),
											A2(
											$elm_community$typed_svg$TypedSvg$text_,
											_List_fromArray(
												[
													$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(8),
													$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(yy + 3),
													$elm_community$typed_svg$TypedSvg$Attributes$textAnchor($elm_community$typed_svg$TypedSvg$Types$AnchorStart),
													$elm_community$typed_svg$TypedSvg$Attributes$fontSize(
													$elm_community$typed_svg$TypedSvg$Types$px(10))
												]),
											_List_fromArray(
												[
													$elm_community$typed_svg$TypedSvg$Core$text(
													tickLabel(t))
												]))
										]));
							},
							ticks)),
						A2(
						$elm_community$typed_svg$TypedSvg$text_,
						_List_fromArray(
							[
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$x(0),
								$elm_community$typed_svg$TypedSvg$Attributes$InPx$y(cfg.padding - 12),
								$elm_community$typed_svg$TypedSvg$Attributes$textAnchor($elm_community$typed_svg$TypedSvg$Types$AnchorMiddle),
								$elm_community$typed_svg$TypedSvg$Attributes$fontSize(
								$elm_community$typed_svg$TypedSvg$Types$px(12))
							]),
						_List_fromArray(
							[
								$elm_community$typed_svg$TypedSvg$Core$text(a.label)
							]))
					]));
		};
		var axisPositions = A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, axes);
		var lineSvg = function (s) {
			var yAt = F2(
				function (aid, v) {
					return A2(
						$gampleman$elm_visualization$Scale$convert,
						yScaleFor(aid),
						v);
				});
			var xAt = function (i) {
				return A2($gampleman$elm_visualization$Scale$convert, xScale, i);
			};
			var valsById = $elm$core$Dict$fromList(s.values);
			var valueFor = function (aid) {
				return A2($elm$core$Dict$get, aid, valsById);
			};
			var toPlottable = F2(
				function (a, v0) {
					return cfg.ranking ? ((a.id === 'medals') ? A3($elm$core$Basics$clamp, 1, globalMaxRank, v0) : A2(
						$elm$core$Maybe$withDefault,
						1,
						A2(
							$elm$core$Maybe$map,
							function (r) {
								return A3($elm$core$Basics$clamp, 1, globalMaxRank, r);
							},
							A2(
								$elm$core$Dict$get,
								v0,
								ranksForAxis(a.id))))) : ((a.id === 'medals') ? A3(
						$elm$core$Basics$clamp,
						1,
						maxRank(a.id),
						v0) : v0);
				});
			var ptFor = function (_v1) {
				var i = _v1.a;
				var a = _v1.b;
				return A2(
					$elm$core$Maybe$map,
					function (v0) {
						var v = A2(toPlottable, a, v0);
						return _Utils_Tuple2(
							xAt(i),
							A2(yAt, a.id, v));
					},
					valueFor(a.id));
			};
			var pts = A2($elm$core$List$filterMap, ptFor, axisPositions);
			var isHovered = _Utils_eq(
				A2($elm$core$Maybe$withDefault, '', hoveredName),
				s.name);
			var faded = function () {
				if (hoveredName.$ === 'Nothing') {
					return false;
				} else {
					return !isHovered;
				}
			}();
			var col = gradientColor(
				normMedals(
					medalsFor(s)));
			var builder = A2(
				$gampleman$elm_visualization$Shape$line,
				$gampleman$elm_visualization$Shape$linearCurve,
				A2($elm$core$List$map, $elm$core$Maybe$Just, pts));
			return A2(
				$elm_community$typed_svg$TypedSvg$path,
				_List_fromArray(
					[
						$elm_community$typed_svg$TypedSvg$Attributes$d(
						$folkertdev$one_true_path_experiment$Path$toString(builder)),
						$elm_community$typed_svg$TypedSvg$Attributes$stroke(
						$elm_community$typed_svg$TypedSvg$Types$Paint(col)),
						$elm_community$typed_svg$TypedSvg$Attributes$strokeWidth(
						$elm_community$typed_svg$TypedSvg$Types$px(
							isHovered ? 3 : 1.2)),
						$elm_community$typed_svg$TypedSvg$Attributes$strokeOpacity(
						$elm_community$typed_svg$TypedSvg$Types$Opacity(
							faded ? 0.15 : 1)),
						$elm_community$typed_svg$TypedSvg$Attributes$fill($elm_community$typed_svg$TypedSvg$Types$PaintNone),
						A2(
						$elm$html$Html$Events$on,
						'mouseenter',
						$elm$json$Json$Decode$succeed(
							onHover(
								$elm$core$Maybe$Just(s.name)))),
						A2(
						$elm$html$Html$Events$on,
						'mouseleave',
						$elm$json$Json$Decode$succeed(
							onHover($elm$core$Maybe$Nothing)))
					]),
				_List_Nil);
		};
		return A2(
			$elm_community$typed_svg$TypedSvg$svg,
			_List_fromArray(
				[
					A4($elm_community$typed_svg$TypedSvg$Attributes$viewBox, 0, 0, cfg.width + rightLabelMargin, cfg.height),
					$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(cfg.width + rightLabelMargin),
					$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(cfg.height)
				]),
			_List_fromArray(
				[
					A2(
					$elm_community$typed_svg$TypedSvg$g,
					_List_Nil,
					A2($elm$core$List$map, axisSvg, axisPositions)),
					A2(
					$elm_community$typed_svg$TypedSvg$g,
					_List_Nil,
					A2($elm$core$List$map, lineSvg, seriesList)),
					A2($elm_community$typed_svg$TypedSvg$g, _List_Nil, hoverLabel)
				]));
	});
var $author$project$View$parallelekoordinatensection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('parallele-koordinaten'),
				A2($elm$html$Html$Attributes$style, 'margin', '60px 0'),
				A2($elm$html$Html$Attributes$style, 'padding', '20px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin', '0 0 16px 0')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('3. Parallele Koordinaten')
					])),
				function () {
				var series = model.pcmodel.series;
				var cfg = {height: 520, padding: 50, ranking: model.pcmodel.ranking, width: 950};
				var axes = model.pcmodel.axes;
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
									A2($elm$html$Html$Attributes$style, 'gap', '8px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px')
								]),
							$elm$core$List$concat(
								_List_fromArray(
									[
										_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_Utils_ap(
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'padding', '4px 8px'),
														A2(
														$elm$html$Html$Attributes$style,
														'border',
														_Utils_eq(
															model.dropTargetAxis,
															$elm$core$Maybe$Just('__start__')) ? '2px dashed #007cba' : '1px solid #ccc'),
														A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
														A2($elm$html$Html$Attributes$style, 'color', '#777'),
														A2(
														$elm$html$Html$Events$preventDefaultOn,
														'dragover',
														A2(
															$elm$json$Json$Decode$map,
															function (_v0) {
																return _Utils_Tuple2(
																	$author$project$Model$DragOverAxis('__start__'),
																	true);
															},
															$elm$json$Json$Decode$value)),
														A2(
														$elm$html$Html$Events$preventDefaultOn,
														'drop',
														A2(
															$elm$json$Json$Decode$map,
															function (_v1) {
																return _Utils_Tuple2(
																	$author$project$Model$DropAxis('__start__'),
																	true);
															},
															$elm$json$Json$Decode$value))
													]),
												_Utils_eq(
													model.dropTargetAxis,
													$elm$core$Maybe$Just('__start__')) ? _List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'background-color', '#eaf5ff')
													]) : _List_Nil),
											_List_fromArray(
												[
													$elm$html$Html$text('Drop am Anfang')
												]))
										]),
										A2(
										$elm$core$List$map,
										function (a) {
											return A2(
												$elm$html$Html$span,
												_Utils_ap(
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'padding', '4px 8px'),
															A2(
															$elm$html$Html$Attributes$style,
															'border',
															_Utils_eq(
																model.dropTargetAxis,
																$elm$core$Maybe$Just(a.id)) ? '2px solid #007cba' : '1px solid #ccc'),
															A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
															A2($elm$html$Html$Attributes$style, 'cursor', 'grab'),
															$elm$html$Html$Attributes$draggable('true'),
															A2(
															$elm$html$Html$Events$on,
															'dragstart',
															$elm$json$Json$Decode$succeed(
																$author$project$Model$StartDragAxis(a.id))),
															A2(
															$elm$html$Html$Events$preventDefaultOn,
															'dragover',
															A2(
																$elm$json$Json$Decode$map,
																function (_v2) {
																	return _Utils_Tuple2(
																		$author$project$Model$DragOverAxis(a.id),
																		true);
																},
																$elm$json$Json$Decode$value)),
															A2(
															$elm$html$Html$Events$preventDefaultOn,
															'drop',
															A2(
																$elm$json$Json$Decode$map,
																function (_v3) {
																	return _Utils_Tuple2(
																		$author$project$Model$DropAxis(a.id),
																		true);
																},
																$elm$json$Json$Decode$value))
														]),
													_Utils_eq(
														model.dropTargetAxis,
														$elm$core$Maybe$Just(a.id)) ? _List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'background-color', '#eaf5ff')
														]) : _List_Nil),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$a,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$href('#medaillenspiegel'),
																$elm$html$Html$Events$onClick(
																$author$project$Model$SetTableCriterion(a.id)),
																A2($elm$html$Html$Attributes$style, 'color', '#007cba'),
																A2(
																$elm$html$Html$Attributes$style,
																'text-decoration',
																_Utils_eq(model.tableCriterion, a.id) ? 'underline' : 'none')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(a.label)
															]))
													]));
										},
										axes),
										_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_Utils_ap(
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'padding', '4px 8px'),
														A2(
														$elm$html$Html$Attributes$style,
														'border',
														_Utils_eq(
															model.dropTargetAxis,
															$elm$core$Maybe$Just('__end__')) ? '2px dashed #007cba' : '1px dashed #ccc'),
														A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
														A2($elm$html$Html$Attributes$style, 'color', '#777'),
														A2(
														$elm$html$Html$Events$preventDefaultOn,
														'dragover',
														A2(
															$elm$json$Json$Decode$map,
															function (_v4) {
																return _Utils_Tuple2(
																	$author$project$Model$DragOverAxis('__end__'),
																	true);
															},
															$elm$json$Json$Decode$value)),
														A2(
														$elm$html$Html$Events$preventDefaultOn,
														'drop',
														A2(
															$elm$json$Json$Decode$map,
															function (_v5) {
																return _Utils_Tuple2(
																	$author$project$Model$DropAxis('__end__'),
																	true);
															},
															$elm$json$Json$Decode$value))
													]),
												_Utils_eq(
													model.dropTargetAxis,
													$elm$core$Maybe$Just('__end__')) ? _List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'background-color', '#eaf5ff')
													]) : _List_Nil),
											_List_fromArray(
												[
													$elm$html$Html$text('Drop ans Ende')
												]))
										])
									]))),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'max-width', '950px'),
									A2($elm$html$Html$Attributes$style, 'margin', '8px auto 0'),
									A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
									A2($elm$html$Html$Attributes$style, 'color', '#555'),
									A2($elm$html$Html$Attributes$style, 'font-size', '12px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Tip: You can reorder the axes by dragging the axis labels above the chart (drag and drop).')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Tip: Click any axis label above to jump to the medal table and set that criterion.')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px'),
									A2($elm$html$Html$Attributes$style, 'gap', '8px'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Ranking')
										])),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('checkbox'),
											$elm$html$Html$Attributes$checked(model.ranking),
											$elm$html$Html$Events$onCheck($author$project$Model$ToggleRanking)
										]),
									_List_Nil),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin-left', '16px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Relative (Medaillen / Pop, GDP, Age)')
										])),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('checkbox'),
											$elm$html$Html$Attributes$checked(model.useRelative),
											$elm$html$Html$Events$onCheck($author$project$Model$TogglePcMode)
										]),
									_List_Nil),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin-left', '16px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Tabelle')
										])),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('checkbox'),
											$elm$html$Html$Attributes$checked(model.showPcDebug),
											$elm$html$Html$Events$onCheck($author$project$Model$TogglePcDebug)
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
								]),
							_List_fromArray(
								[
									A5($author$project$Components$ParallelCoordinates$view, cfg, axes, series, model.pcHover, $author$project$Model$SetPcHover)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'max-width', '750px'),
									A2($elm$html$Html$Attributes$style, 'margin', '8px auto 0'),
									A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
									A2($elm$html$Html$Attributes$style, 'color', '#555'),
									A2($elm$html$Html$Attributes$style, 'font-size', '12px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Note: EOR (Refugee Olympic Team) and AIN (Individual Neutral Athletes) are not countries. Therefore, there are no values for population, GDP or age, which is why they are not included in this ranking.')
										]))
								])),
							function () {
							if (model.showPcDebug) {
								var placementBy = $elm$core$Dict$fromList(
									A2(
										$elm$core$List$filterMap,
										function (s) {
											return A2(
												$elm$core$Maybe$map,
												function (_v11) {
													var v = _v11.b;
													return _Utils_Tuple2(
														s.name,
														$elm$core$Basics$round(v));
												},
												$elm$core$List$head(
													A2(
														$elm$core$List$filter,
														function (_v10) {
															var id = _v10.a;
															return id === 'medals';
														},
														s.values)));
										},
										series));
								var rows = A2(
									$elm$core$List$sortWith,
									F2(
										function (a, b) {
											return A2(
												$elm$core$Basics$compare,
												A2(
													$elm$core$Maybe$withDefault,
													9999,
													A2($elm$core$Dict$get, a, placementBy)),
												A2(
													$elm$core$Maybe$withDefault,
													9999,
													A2($elm$core$Dict$get, b, placementBy)));
										}),
									A2(
										$elm$core$List$map,
										function ($) {
											return $.name;
										},
										series));
								var nonMedalAxes = A2(
									$elm$core$List$filter,
									function (a) {
										return a.id !== 'medals';
									},
									axes);
								var medalSumBy = $elm$core$Dict$fromList(
									A2(
										$elm$core$List$map,
										function (r) {
											return _Utils_Tuple2(r.country, r.total);
										},
										model.medalTable));
								var headerCells = function () {
									var valueHeaders = A2(
										$elm$core$List$concatMap,
										function (a) {
											if (a.id === 'medals') {
												return _List_fromArray(
													[
														A2(
														$elm$html$Html$th,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
																A2($elm$html$Html$Attributes$style, 'padding', '6px')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('Medaillenspiegel')
															])),
														A2(
														$elm$html$Html$th,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
																A2($elm$html$Html$Attributes$style, 'padding', '6px')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('Medaillen')
															]))
													]);
											} else {
												var labelSuffix = function () {
													if (model.useRelative) {
														var _v9 = a.id;
														switch (_v9) {
															case 'pop':
																return ' (pro 1M)';
															case 'gdp':
																return ' (pro $1B)';
															case 'age':
																return ' (rel.)';
															default:
																return ' (rel.)';
														}
													} else {
														return ' (Wert)';
													}
												}();
												return _List_fromArray(
													[
														A2(
														$elm$html$Html$th,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
																A2($elm$html$Html$Attributes$style, 'padding', '6px')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(
																_Utils_ap(a.label, labelSuffix))
															]))
													]);
											}
										},
										axes);
									var rankHeaders = A2(
										$elm$core$List$map,
										function (a) {
											return A2(
												$elm$html$Html$th,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
														A2($elm$html$Html$Attributes$style, 'padding', '6px')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(a.label + ' (Rang)')
													]));
										},
										nonMedalAxes);
									return A2(
										$elm$core$List$cons,
										A2(
											$elm$html$Html$th,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'text-align', 'left'),
													A2($elm$html$Html$Attributes$style, 'padding', '6px')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Land')
												])),
										_Utils_ap(valueHeaders, rankHeaders));
								}();
								var axisValuesBy = $elm$core$Dict$fromList(
									A2(
										$elm$core$List$map,
										function (a) {
											return _Utils_Tuple2(
												a.id,
												$elm$core$Dict$fromList(
													A2(
														$elm$core$List$filterMap,
														function (s) {
															return A2(
																$elm$core$Maybe$map,
																function (_v8) {
																	var v = _v8.b;
																	return _Utils_Tuple2(s.name, v);
																},
																$elm$core$List$head(
																	A2(
																		$elm$core$List$filter,
																		function (_v7) {
																			var id = _v7.a;
																			return _Utils_eq(id, a.id);
																		},
																		s.values)));
														},
														series)));
										},
										axes));
								var rankDictByAxis = $elm$core$Dict$fromList(
									A2(
										$elm$core$List$map,
										function (a) {
											var vals = $elm$core$List$reverse(
												$elm$core$List$sort(
													$elm$core$Dict$values(
														A2(
															$elm$core$Maybe$withDefault,
															$elm$core$Dict$empty,
															A2($elm$core$Dict$get, a.id, axisValuesBy)))));
											var uniques = $elm_community$list_extra$List$Extra$unique(vals);
											var dict = $elm$core$Dict$fromList(
												A2(
													$elm$core$List$indexedMap,
													F2(
														function (i, v) {
															return _Utils_Tuple2(v, i + 1);
														}),
													uniques));
											return _Utils_Tuple2(a.id, dict);
										},
										nonMedalAxes));
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'max-width', '1000px'),
											A2($elm$html$Html$Attributes$style, 'margin', '16px auto'),
											A2($elm$html$Html$Attributes$style, 'font-size', '12px')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$table,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'width', '100%'),
													A2($elm$html$Html$Attributes$style, 'border-collapse', 'collapse')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$thead,
													_List_Nil,
													_List_fromArray(
														[
															A2($elm$html$Html$tr, _List_Nil, headerCells)
														])),
													A2(
													$elm$html$Html$tbody,
													_List_Nil,
													A2(
														$elm$core$List$map,
														function (name) {
															var valueTds = A2(
																$elm$core$List$concatMap,
																function (a) {
																	var _v6 = a.id;
																	if (_v6 === 'medals') {
																		return _List_fromArray(
																			[
																				A2(
																				$elm$html$Html$td,
																				_List_fromArray(
																					[
																						A2($elm$html$Html$Attributes$style, 'padding', '4px'),
																						A2($elm$html$Html$Attributes$style, 'text-align', 'center')
																					]),
																				_List_fromArray(
																					[
																						$elm$html$Html$text(
																						$elm$core$String$fromInt(
																							A2(
																								$elm$core$Maybe$withDefault,
																								0,
																								A2($elm$core$Dict$get, name, placementBy))))
																					])),
																				A2(
																				$elm$html$Html$td,
																				_List_fromArray(
																					[
																						A2($elm$html$Html$Attributes$style, 'padding', '4px'),
																						A2($elm$html$Html$Attributes$style, 'text-align', 'center')
																					]),
																				_List_fromArray(
																					[
																						$elm$html$Html$text(
																						$elm$core$String$fromInt(
																							A2(
																								$elm$core$Maybe$withDefault,
																								0,
																								A2($elm$core$Dict$get, name, medalSumBy))))
																					]))
																			]);
																	} else {
																		var vVal = A2(
																			$elm$core$Maybe$withDefault,
																			0,
																			A2(
																				$elm$core$Dict$get,
																				name,
																				A2(
																					$elm$core$Maybe$withDefault,
																					$elm$core$Dict$empty,
																					A2($elm$core$Dict$get, a.id, axisValuesBy))));
																		return _List_fromArray(
																			[
																				A2(
																				$elm$html$Html$td,
																				_List_fromArray(
																					[
																						A2($elm$html$Html$Attributes$style, 'padding', '4px'),
																						A2($elm$html$Html$Attributes$style, 'text-align', 'center')
																					]),
																				_List_fromArray(
																					[
																						$elm$html$Html$text(
																						A3($author$project$View$formatPcValue, model.useRelative, a.id, vVal))
																					]))
																			]);
																	}
																},
																axes);
															var rankTds = A2(
																$elm$core$List$map,
																function (a) {
																	var v = A2(
																		$elm$core$Maybe$withDefault,
																		0,
																		A2(
																			$elm$core$Dict$get,
																			name,
																			A2(
																				$elm$core$Maybe$withDefault,
																				$elm$core$Dict$empty,
																				A2($elm$core$Dict$get, a.id, axisValuesBy))));
																	var r = A2(
																		$elm$core$Maybe$withDefault,
																		0,
																		A2(
																			$elm$core$Dict$get,
																			v,
																			A2(
																				$elm$core$Maybe$withDefault,
																				$elm$core$Dict$empty,
																				A2($elm$core$Dict$get, a.id, rankDictByAxis))));
																	return A2(
																		$elm$html$Html$td,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$style, 'padding', '4px'),
																				A2($elm$html$Html$Attributes$style, 'text-align', 'center')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text(
																				$elm$core$String$fromInt(r))
																			]));
																},
																nonMedalAxes);
															return A2(
																$elm$html$Html$tr,
																_List_fromArray(
																	[
																		A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid #eee')
																	]),
																A2(
																	$elm$core$List$cons,
																	A2(
																		$elm$html$Html$td,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$style, 'padding', '4px'),
																				A2($elm$html$Html$Attributes$style, 'text-align', 'left')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text(name)
																			])),
																	_Utils_ap(valueTds, rankTds)));
														},
														rows))
												]))
										]));
							} else {
								return $elm$html$Html$text('');
							}
						}()
						]));
			}(),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'text-align', 'right')
					]),
				_List_fromArray(
					[
						$author$project$View$nextLink('#heatmap')
					]))
			]));
};
var $author$project$View$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-family', 'Arial, sans-serif')
			]),
		_List_fromArray(
			[
				$author$project$View$headerSection,
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'max-width', '1200px'),
						A2($elm$html$Html$Attributes$style, 'margin', '0 auto'),
						A2($elm$html$Html$Attributes$style, 'padding', '20px')
					]),
				_List_fromArray(
					[
						$author$project$View$medaillenspiegelSection(model),
						$author$project$View$medaillenverteilungSection(model),
						$author$project$View$parallelekoordinatensection(model),
						$author$project$View$heatmapSection(model)
					]))
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		init: function (_v0) {
			return $author$project$Model$init;
		},
		subscriptions: function (_v1) {
			return $elm$core$Platform$Sub$none;
		},
		update: $author$project$Update$update,
		view: $author$project$View$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));