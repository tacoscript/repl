webpackJsonp([3],{

/***/ 119:
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },

/***/ 163:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(25), __esModule: true };

/***/ },

/***/ 237:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.ArrayPattern = exports.ObjectPattern = exports.RestProperty = exports.SpreadProperty = exports.SpreadElement = undefined;
	
	var _stringify = __webpack_require__(350);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	exports.Identifier = Identifier;
	exports.RestElement = RestElement;
	exports.ObjectExpression = ObjectExpression;
	exports.ObjectMethod = ObjectMethod;
	exports.ObjectProperty = ObjectProperty;
	exports.ArrayExpression = ArrayExpression;
	exports.RegExpLiteral = RegExpLiteral;
	exports.BooleanLiteral = BooleanLiteral;
	exports.NullLiteral = NullLiteral;
	exports.NumericLiteral = NumericLiteral;
	exports.StringLiteral = StringLiteral;
	
	var _babelTypes = __webpack_require__(1);
	
	var t = _interopRequireWildcard(_babelTypes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Identifier(node) {
	  // FIXME: We hang variance off Identifer to support Flow's def-site variance.
	  // This is a terrible hack, but changing type annotations to use a new,
	  // dedicated node would be a breaking change. This should be cleaned up in
	  // the next major.
	  if (node.variance) {
	    if (node.variance === "plus") {
	      this.token("+");
	    } else if (node.variance === "minus") {
	      this.token("-");
	    }
	  }
	
	  this.word(node.name);
	} /* eslint max-len: 0 */
	/* eslint quotes: 0 */
	
	function RestElement(node) {
	  this.token("...");
	  this.print(node.argument, node);
	}
	
	exports.SpreadElement = RestElement;
	exports.SpreadProperty = RestElement;
	exports.RestProperty = RestElement;
	function ObjectExpression(node) {
	  var props = node.properties;
	
	  this.token("{");
	  this.printInnerComments(node);
	
	  if (props.length) {
	    this.space();
	    this.printList(props, node, { indent: true, statement: true });
	    this.space();
	  }
	
	  this.token("}");
	}
	
	exports.ObjectPattern = ObjectExpression;
	function ObjectMethod(node) {
	  this.printJoin(node.decorators, node);
	  this._method(node);
	}
	
	function ObjectProperty(node) {
	  this.printJoin(node.decorators, node);
	
	  if (node.computed) {
	    this.token("[");
	    this.print(node.key, node);
	    this.token("]");
	  } else {
	    // print `({ foo: foo = 5 } = {})` as `({ foo = 5 } = {});`
	    if (t.isAssignmentPattern(node.value) && t.isIdentifier(node.key) && node.key.name === node.value.left.name) {
	      this.print(node.value, node);
	      return;
	    }
	
	    this.print(node.key, node);
	
	    // shorthand!
	    if (node.shorthand && t.isIdentifier(node.key) && t.isIdentifier(node.value) && node.key.name === node.value.name) {
	      return;
	    }
	  }
	
	  this.token(":");
	  this.space();
	  this.print(node.value, node);
	}
	
	function ArrayExpression(node) {
	  var elems = node.elements;
	  var len = elems.length;
	
	  this.token("[");
	  this.printInnerComments(node);
	
	  for (var i = 0; i < elems.length; i++) {
	    var elem = elems[i];
	    if (elem) {
	      if (i > 0) this.space();
	      this.print(elem, node);
	      if (i < len - 1) this.token(",");
	    } else {
	      // If the array expression ends with a hole, that hole
	      // will be ignored by the interpreter, but if it ends with
	      // two (or more) holes, we need to write out two (or more)
	      // commas so that the resulting code is interpreted with
	      // both (all) of the holes.
	      this.token(",");
	    }
	  }
	
	  this.token("]");
	}
	
	exports.ArrayPattern = ArrayExpression;
	function RegExpLiteral(node) {
	  this.word("/" + node.pattern + "/" + node.flags);
	}
	
	function BooleanLiteral(node) {
	  this.word(node.value ? "true" : "false");
	}
	
	function NullLiteral() {
	  this.word("null");
	}
	
	function NumericLiteral(node) {
	  var raw = this.getPossibleRaw(node);
	
	  this.number(raw == null ? node.value + "" : raw);
	}
	
	function StringLiteral(node, parent) {
	  var raw = this.getPossibleRaw(node);
	  if (raw != null) {
	    this.token(raw);
	    return;
	  }
	
	  var val = (0, _stringify2.default)(node.value);
	
	  // escape illegal js but valid json unicode characters
	  val = val.replace(/[\u000A\u000D\u2028\u2029]/g, function (c) {
	    return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
	  });
	
	  if (this.format.quotes === "single" && !t.isJSX(parent)) {
	    // remove double quotes
	    val = val.slice(1, -1);
	
	    // unescape double quotes
	    val = val.replace(/\\"/g, '"');
	
	    // escape single quotes
	    val = val.replace(/'/g, "\\'");
	
	    // add single quotes
	    val = "'" + val + "'";
	  }
	
	  return this.token(val);
	}

/***/ },

/***/ 238:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(538);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(537);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },

/***/ 348:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.CodeGenerator = undefined;
	
	var _classCallCheck2 = __webpack_require__(119);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(541);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(540);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	exports.default = function (ast, opts, code) {
	  var gen = new Generator(ast, opts, code);
	  return gen.generate();
	};
	
	var _detectIndent = __webpack_require__(840);
	
	var _detectIndent2 = _interopRequireDefault(_detectIndent);
	
	var _sourceMap = __webpack_require__(532);
	
	var _sourceMap2 = _interopRequireDefault(_sourceMap);
	
	var _babelMessages = __webpack_require__(165);
	
	var messages = _interopRequireWildcard(_babelMessages);
	
	var _printer = __webpack_require__(531);
	
	var _printer2 = _interopRequireDefault(_printer);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Babel's code generator, turns an ast into code, maintaining sourcemaps,
	 * user preferences, and valid output.
	 */
	
	var Generator = function (_Printer) {
	  (0, _inherits3.default)(Generator, _Printer);
	
	  function Generator(ast, opts, code) {
	    (0, _classCallCheck3.default)(this, Generator);
	
	    opts = opts || {};
	
	    var tokens = ast.tokens || [];
	    var format = normalizeOptions(code, opts, tokens);
	    var map = opts.sourceMaps ? new _sourceMap2.default(opts, code) : null;
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, _Printer.call(this, format, map, tokens));
	
	    _this.ast = ast;
	    return _this;
	  }
	
	  /**
	   * Generate code and sourcemap from ast.
	   *
	   * Appends comments that weren't attached to any node to the end of the generated output.
	   */
	
	  Generator.prototype.generate = function generate() {
	    return _Printer.prototype.generate.call(this, this.ast);
	  };
	
	  return Generator;
	}(_printer2.default);
	
	/**
	 * Normalize generator options, setting defaults.
	 *
	 * - Detects code indentation.
	 * - If `opts.compact = "auto"` and the code is over 100KB, `compact` will be set to `true`.
	 */
	
	function normalizeOptions(code, opts, tokens) {
	  var style = "  ";
	  if (code && typeof code === "string") {
	    var indent = (0, _detectIndent2.default)(code).indent;
	    if (indent && indent !== " ") style = indent;
	  }
	
	  var format = {
	    auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
	    auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
	    shouldPrintComment: opts.shouldPrintComment,
	    retainLines: opts.retainLines,
	    comments: opts.comments == null || opts.comments,
	    compact: opts.compact,
	    minified: opts.minified,
	    concise: opts.concise,
	    quotes: opts.quotes || findCommonStringDelimiter(code, tokens),
	    indent: {
	      adjustMultilineComment: true,
	      style: style,
	      base: 0
	    }
	  };
	
	  if (format.minified) {
	    format.compact = true;
	
	    format.shouldPrintComment = format.shouldPrintComment || function () {
	      return format.comments;
	    };
	  } else {
	    format.shouldPrintComment = format.shouldPrintComment || function (value) {
	      return format.comments || value.indexOf("@license") >= 0 || value.indexOf("@preserve") >= 0;
	    };
	  }
	
	  if (format.compact === "auto") {
	    format.compact = code.length > 100000; // 100KB
	
	    if (format.compact) {
	      console.error("[BABEL] " + messages.get("codeGeneratorDeopt", opts.filename, "100KB"));
	    }
	  }
	
	  if (format.compact) {
	    format.indent.adjustMultilineComment = false;
	  }
	
	  return format;
	}
	
	/**
	 * Determine if input code uses more single or double quotes.
	 */
	function findCommonStringDelimiter(code, tokens) {
	  var occurences = {
	    single: 0,
	    double: 0
	  };
	
	  var checked = 0;
	
	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i];
	    if (token.type.label !== "string") continue;
	
	    var raw = code.slice(token.start, token.end);
	    if (raw[0] === "'") {
	      occurences.single++;
	    } else {
	      occurences.double++;
	    }
	
	    checked++;
	    if (checked >= 3) break;
	  }
	  if (occurences.single > occurences.double) {
	    return "single";
	  } else {
	    return "double";
	  }
	}
	
	/**
	 * We originally exported the Generator class above, but to make it extra clear that it is a private API,
	 * we have moved that to an internal class instance and simplified the interface to the two public methods
	 * that we wish to support.
	 */
	
	var CodeGenerator = exports.CodeGenerator = function () {
	  function CodeGenerator(ast, opts, code) {
	    (0, _classCallCheck3.default)(this, CodeGenerator);
	
	    this._generator = new Generator(ast, opts, code);
	  }
	
	  CodeGenerator.prototype.generate = function generate() {
	    return this._generator.generate();
	  };
	
	  return CodeGenerator;
	}();

/***/ },

/***/ 349:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _getIterator2 = __webpack_require__(163);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	var _keys = __webpack_require__(351);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	exports.needsWhitespace = needsWhitespace;
	exports.needsWhitespaceBefore = needsWhitespaceBefore;
	exports.needsWhitespaceAfter = needsWhitespaceAfter;
	exports.needsParens = needsParens;
	
	var _whitespace = __webpack_require__(530);
	
	var _whitespace2 = _interopRequireDefault(_whitespace);
	
	var _parentheses = __webpack_require__(529);
	
	var parens = _interopRequireWildcard(_parentheses);
	
	var _babelTypes = __webpack_require__(1);
	
	var t = _interopRequireWildcard(_babelTypes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function expandAliases(obj) {
	  var newObj = {};
	
	  function add(type, func) {
	    var fn = newObj[type];
	    newObj[type] = fn ? function (node, parent, stack) {
	      var result = fn(node, parent, stack);
	
	      return result == null ? func(node, parent, stack) : result;
	    } : func;
	  }
	
	  for (var _iterator = (0, _keys2.default)(obj), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
	    var _ref;
	
	    if (_isArray) {
	      if (_i >= _iterator.length) break;
	      _ref = _iterator[_i++];
	    } else {
	      _i = _iterator.next();
	      if (_i.done) break;
	      _ref = _i.value;
	    }
	
	    var type = _ref;
	
	
	    var aliases = t.FLIPPED_ALIAS_KEYS[type];
	    if (aliases) {
	      for (var _iterator2 = aliases, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
	        var _ref2;
	
	        if (_isArray2) {
	          if (_i2 >= _iterator2.length) break;
	          _ref2 = _iterator2[_i2++];
	        } else {
	          _i2 = _iterator2.next();
	          if (_i2.done) break;
	          _ref2 = _i2.value;
	        }
	
	        var alias = _ref2;
	
	        add(alias, obj[type]);
	      }
	    } else {
	      add(type, obj[type]);
	    }
	  }
	
	  return newObj;
	}
	
	// Rather than using `t.is` on each object property, we pre-expand any type aliases
	// into concrete types so that the 'find' call below can be as fast as possible.
	var expandedParens = expandAliases(parens);
	var expandedWhitespaceNodes = expandAliases(_whitespace2.default.nodes);
	var expandedWhitespaceList = expandAliases(_whitespace2.default.list);
	
	function find(obj, node, parent, printStack) {
	  var fn = obj[node.type];
	  return fn ? fn(node, parent, printStack) : null;
	}
	
	function isOrHasCallExpression(node) {
	  if (t.isCallExpression(node)) {
	    return true;
	  }
	
	  if (t.isMemberExpression(node)) {
	    return isOrHasCallExpression(node.object) || !node.computed && isOrHasCallExpression(node.property);
	  } else {
	    return false;
	  }
	}
	
	function needsWhitespace(node, parent, type) {
	  if (!node) return 0;
	
	  if (t.isExpressionStatement(node)) {
	    node = node.expression;
	  }
	
	  var linesInfo = find(expandedWhitespaceNodes, node, parent);
	
	  if (!linesInfo) {
	    var items = find(expandedWhitespaceList, node, parent);
	    if (items) {
	      for (var i = 0; i < items.length; i++) {
	        linesInfo = needsWhitespace(items[i], node, type);
	        if (linesInfo) break;
	      }
	    }
	  }
	
	  return linesInfo && linesInfo[type] || 0;
	}
	
	function needsWhitespaceBefore(node, parent) {
	  return needsWhitespace(node, parent, "before");
	}
	
	function needsWhitespaceAfter(node, parent) {
	  return needsWhitespace(node, parent, "after");
	}
	
	function needsParens(node, parent, printStack) {
	  if (!parent) return false;
	
	  if (t.isNewExpression(parent) && parent.callee === node) {
	    if (isOrHasCallExpression(node)) return true;
	  }
	
	  return find(expandedParens, node, parent, printStack);
	}

/***/ },

/***/ 350:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(79), __esModule: true };

/***/ },

/***/ 351:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(80), __esModule: true };

/***/ },

/***/ 519:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _classCallCheck2 = __webpack_require__(119);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _trimEnd = __webpack_require__(1013);
	
	var _trimEnd2 = _interopRequireDefault(_trimEnd);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SPACES_RE = /^[ \t]+$/;
	
	/**
	 * The Buffer class exists to manage the queue of tokens being pushed onto the output string
	 * in such a way that the final string buffer is treated as write-only until the final .get()
	 * call. This allows V8 to optimize the output efficiently by not requiring it to store the
	 * string in contiguous memory.
	 */
	
	var Buffer = function () {
	  function Buffer(map) {
	    (0, _classCallCheck3.default)(this, Buffer);
	    this._map = null;
	    this._buf = [];
	    this._last = "";
	    this._queue = [];
	    this._position = {
	      line: 1,
	      column: 0
	    };
	    this._sourcePosition = {
	      line: null,
	      column: null,
	      filename: null
	    };
	
	    this._map = map;
	  }
	
	  /**
	   * Get the final string output from the buffer, along with the sourcemap if one exists.
	   */
	
	  Buffer.prototype.get = function get() {
	    this._flush();
	
	    return {
	      code: (0, _trimEnd2.default)(this._buf.join("")),
	      map: this._map ? this._map.get() : null
	    };
	  };
	
	  /**
	   * Add a string to the buffer that cannot be reverted.
	   */
	
	  Buffer.prototype.append = function append(str) {
	    this._flush();
	    var _sourcePosition = this._sourcePosition;
	    var line = _sourcePosition.line;
	    var column = _sourcePosition.column;
	    var filename = _sourcePosition.filename;
	
	    this._append(str, line, column, filename);
	  };
	
	  /**
	   * Add a string to the buffer than can be reverted.
	   */
	
	  Buffer.prototype.queue = function queue(str) {
	    // Drop trailing spaces when a newline is inserted.
	    if (str === "\n") while (this._queue.length > 0 && SPACES_RE.test(this._queue[0][0])) {
	      this._queue.shift();
	    }var _sourcePosition2 = this._sourcePosition;
	    var line = _sourcePosition2.line;
	    var column = _sourcePosition2.column;
	    var filename = _sourcePosition2.filename;
	
	    this._queue.unshift([str, line, column, filename]);
	  };
	
	  Buffer.prototype._flush = function _flush() {
	    var item = void 0;
	    while (item = this._queue.pop()) {
	      this._append.apply(this, item);
	    }
	  };
	
	  Buffer.prototype._append = function _append(str, line, column, filename) {
	    // If there the line is ending, adding a new mapping marker is redundant
	    if (this._map && str[0] !== "\n") {
	      this._map.mark(this._position.line, this._position.column, line, column, filename);
	    }
	
	    this._buf.push(str);
	    this._last = str[str.length - 1];
	
	    for (var i = 0; i < str.length; i++) {
	      if (str[i] === "\n") {
	        this._position.line++;
	        this._position.column = 0;
	      } else {
	        this._position.column++;
	      }
	    }
	  };
	
	  Buffer.prototype.removeTrailingNewline = function removeTrailingNewline() {
	    if (this._queue.length > 0 && this._queue[0][0] === "\n") this._queue.shift();
	  };
	
	  Buffer.prototype.removeLastSemicolon = function removeLastSemicolon() {
	    if (this._queue.length > 0 && this._queue[0][0] === ";") this._queue.shift();
	  };
	
	  Buffer.prototype.endsWith = function endsWith(suffix) {
	    // Fast path to avoid iterating over this._queue.
	    if (suffix.length === 1) {
	      var last = void 0;
	      if (this._queue.length > 0) {
	        var str = this._queue[0][0];
	        last = str[str.length - 1];
	      } else {
	        last = this._last;
	      }
	
	      return last === suffix;
	    }
	
	    var end = this._last + this._queue.reduce(function (acc, item) {
	      return item[0] + acc;
	    }, "");
	    if (suffix.length <= end.length) {
	      return end.slice(-suffix.length) === suffix;
	    }
	
	    // We assume that everything being matched is at most a single token plus some whitespace,
	    // which everything currently is, but otherwise we'd have to expand _last or check _buf.
	    return false;
	  };
	
	  Buffer.prototype.hasContent = function hasContent() {
	    return this._queue.length > 0 || !!this._last;
	  };
	
	  /**
	   * Sets a given position as the current source location so generated code after this call
	   * will be given this position in the sourcemap.
	   */
	
	  Buffer.prototype.source = function source(prop, loc) {
	    if (prop && !loc) return;
	
	    var pos = loc ? loc[prop] : null;
	
	    this._sourcePosition.line = pos ? pos.line : null;
	    this._sourcePosition.column = pos ? pos.column : null;
	    this._sourcePosition.filename = loc && loc.filename || null;
	  };
	
	  /**
	   * Call a callback with a specific source location and restore on completion.
	   */
	
	  Buffer.prototype.withSource = function withSource(prop, loc, cb) {
	    if (!this._map) return cb();
	
	    // Use the call stack to manage a stack of "source location" data.
	    var originalLine = this._sourcePosition.line;
	    var originalColumn = this._sourcePosition.column;
	    var originalFilename = this._sourcePosition.filename;
	
	    this.source(prop, loc);
	
	    cb();
	
	    this._sourcePosition.line = originalLine;
	    this._sourcePosition.column = originalColumn;
	    this._sourcePosition.filename = originalFilename;
	  };
	
	  Buffer.prototype.getCurrentColumn = function getCurrentColumn() {
	    var extra = this._queue.reduce(function (acc, item) {
	      return item[0] + acc;
	    }, "");
	    var lastIndex = extra.lastIndexOf("\n");
	
	    return lastIndex === -1 ? this._position.column + extra.length : extra.length - 1 - lastIndex;
	  };
	
	  Buffer.prototype.getCurrentLine = function getCurrentLine() {
	    var extra = this._queue.reduce(function (acc, item) {
	      return item[0] + acc;
	    }, "");
	
	    var count = 0;
	    for (var i = 0; i < extra.length; i++) {
	      if (extra[i] === "\n") count++;
	    }
	
	    return this._position.line + count;
	  };
	
	  return Buffer;
	}();
	
	exports.default = Buffer;
	module.exports = exports["default"];

/***/ },

/***/ 520:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.File = File;
	exports.Program = Program;
	exports.BlockStatement = BlockStatement;
	exports.Noop = Noop;
	exports.Directive = Directive;
	
	var _types = __webpack_require__(237);
	
	Object.defineProperty(exports, "DirectiveLiteral", {
	  enumerable: true,
	  get: function get() {
	    return _types.StringLiteral;
	  }
	});
	function File(node) {
	  this.print(node.program, node);
	}
	
	function Program(node) {
	  this.printInnerComments(node, false);
	
	  this.printSequence(node.directives, node);
	  if (node.directives && node.directives.length) this.newline();
	
	  this.printSequence(node.body, node);
	}
	
	function BlockStatement(node) {
	  this.token("{");
	  this.printInnerComments(node);
	  if (node.body.length) {
	    this.newline();
	
	    this.printSequence(node.directives, node, { indent: true });
	    if (node.directives && node.directives.length) this.newline();
	
	    this.printSequence(node.body, node, { indent: true });
	    this.removeTrailingNewline();
	
	    this.source("end", node.loc);
	
	    if (!this.endsWith("\n")) this.newline();
	
	    this.rightBrace();
	  } else {
	    this.source("end", node.loc);
	    this.token("}");
	  }
	}
	
	function Noop() {}
	
	function Directive(node) {
	  this.print(node.value, node);
	  this.semicolon();
	}

/***/ },

/***/ 521:
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.ClassDeclaration = ClassDeclaration;
	exports.ClassBody = ClassBody;
	exports.ClassProperty = ClassProperty;
	exports.ClassMethod = ClassMethod;
	function ClassDeclaration(node) {
	  this.printJoin(node.decorators, node);
	  this.word("class");
	
	  if (node.id) {
	    this.space();
	    this.print(node.id, node);
	  }
	
	  this.print(node.typeParameters, node);
	
	  if (node.superClass) {
	    this.space();
	    this.word("extends");
	    this.space();
	    this.print(node.superClass, node);
	    this.print(node.superTypeParameters, node);
	  }
	
	  if (node.implements) {
	    this.space();
	    this.word("implements");
	    this.space();
	    this.printList(node.implements, node);
	  }
	
	  this.space();
	  this.print(node.body, node);
	}
	
	exports.ClassExpression = ClassDeclaration;
	function ClassBody(node) {
	  this.token("{");
	  this.printInnerComments(node);
	  if (node.body.length === 0) {
	    this.token("}");
	  } else {
	    this.newline();
	
	    this.indent();
	    this.printSequence(node.body, node);
	    this.dedent();
	
	    if (!this.endsWith("\n")) this.newline();
	
	    this.rightBrace();
	  }
	}
	
	function ClassProperty(node) {
	  this.printJoin(node.decorators, node);
	
	  if (node.static) {
	    this.word("static");
	    this.space();
	  }
	  this.print(node.key, node);
	  this.print(node.typeAnnotation, node);
	  if (node.value) {
	    this.space();
	    this.token("=");
	    this.space();
	    this.print(node.value, node);
	  }
	  this.semicolon();
	}
	
	function ClassMethod(node) {
	  this.printJoin(node.decorators, node);
	
	  if (node.static) {
	    this.word("static");
	    this.space();
	  }
	
	  if (node.kind === "constructorCall") {
	    this.word("call");
	    this.space();
	  }
	
	  this._method(node);
	}

/***/ },

/***/ 522:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.LogicalExpression = exports.BinaryExpression = exports.AwaitExpression = exports.YieldExpression = undefined;
	exports.UnaryExpression = UnaryExpression;
	exports.DoExpression = DoExpression;
	exports.ParenthesizedExpression = ParenthesizedExpression;
	exports.UpdateExpression = UpdateExpression;
	exports.ConditionalExpression = ConditionalExpression;
	exports.NewExpression = NewExpression;
	exports.SequenceExpression = SequenceExpression;
	exports.ThisExpression = ThisExpression;
	exports.Super = Super;
	exports.Decorator = Decorator;
	exports.CallExpression = CallExpression;
	exports.EmptyStatement = EmptyStatement;
	exports.ExpressionStatement = ExpressionStatement;
	exports.AssignmentPattern = AssignmentPattern;
	exports.AssignmentExpression = AssignmentExpression;
	exports.BindExpression = BindExpression;
	exports.MemberExpression = MemberExpression;
	exports.MetaProperty = MetaProperty;
	
	var _isNumber = __webpack_require__(226);
	
	var _isNumber2 = _interopRequireDefault(_isNumber);
	
	var _babelTypes = __webpack_require__(1);
	
	var t = _interopRequireWildcard(_babelTypes);
	
	var _node = __webpack_require__(349);
	
	var n = _interopRequireWildcard(_node);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function UnaryExpression(node) {
	  if (node.operator === "void" || node.operator === "delete" || node.operator === "typeof") {
	    this.word(node.operator);
	    this.space();
	  } else {
	    this.token(node.operator);
	  }
	
	  this.print(node.argument, node);
	} /* eslint max-len: 0 */
	
	function DoExpression(node) {
	  this.word("do");
	  this.space();
	  this.print(node.body, node);
	}
	
	function ParenthesizedExpression(node) {
	  this.token("(");
	  this.print(node.expression, node);
	  this.token(")");
	}
	
	function UpdateExpression(node) {
	  if (node.prefix) {
	    this.token(node.operator);
	    this.print(node.argument, node);
	  } else {
	    this.print(node.argument, node);
	    this.token(node.operator);
	  }
	}
	
	function ConditionalExpression(node) {
	  this.print(node.test, node);
	  this.space();
	  this.token("?");
	  this.space();
	  this.print(node.consequent, node);
	  this.space();
	  this.token(":");
	  this.space();
	  this.print(node.alternate, node);
	}
	
	function NewExpression(node, parent) {
	  this.word("new");
	  this.space();
	  this.print(node.callee, node);
	  if (node.arguments.length === 0 && this.format.minified && !t.isCallExpression(parent, { callee: node }) && !t.isMemberExpression(parent) && !t.isNewExpression(parent)) return;
	
	  this.token("(");
	  this.printList(node.arguments, node);
	  this.token(")");
	}
	
	function SequenceExpression(node) {
	  this.printList(node.expressions, node);
	}
	
	function ThisExpression() {
	  this.word("this");
	}
	
	function Super() {
	  this.word("super");
	}
	
	function Decorator(node) {
	  this.token("@");
	  this.print(node.expression, node);
	  this.newline();
	}
	
	function commaSeparatorNewline() {
	  this.token(",");
	  this.newline();
	
	  if (!this.endsWith("\n")) this.space();
	}
	
	function CallExpression(node) {
	  this.print(node.callee, node);
	
	  this.token("(");
	
	  var isPrettyCall = node._prettyCall;
	
	  var separator = void 0;
	  if (isPrettyCall) {
	    separator = commaSeparatorNewline;
	    this.newline();
	    this.indent();
	  }
	
	  this.printList(node.arguments, node, { separator: separator });
	
	  if (isPrettyCall) {
	    this.newline();
	    this.dedent();
	  }
	
	  this.token(")");
	}
	
	function buildYieldAwait(keyword) {
	  return function (node) {
	    this.word(keyword);
	
	    if (node.delegate) {
	      this.token("*");
	    }
	
	    if (node.argument) {
	      this.space();
	      var terminatorState = this.startTerminatorless();
	      this.print(node.argument, node);
	      this.endTerminatorless(terminatorState);
	    }
	  };
	}
	
	var YieldExpression = exports.YieldExpression = buildYieldAwait("yield");
	var AwaitExpression = exports.AwaitExpression = buildYieldAwait("await");
	
	function EmptyStatement() {
	  this.semicolon(true /* force */);
	}
	
	function ExpressionStatement(node) {
	  this.print(node.expression, node);
	  this.semicolon();
	}
	
	function AssignmentPattern(node) {
	  this.print(node.left, node);
	  this.space();
	  this.token("=");
	  this.space();
	  this.print(node.right, node);
	}
	
	function AssignmentExpression(node, parent) {
	  // Somewhere inside a for statement `init` node but doesn't usually
	  // needs a paren except for `in` expressions: `for (a in b ? a : b;;)`
	  var parens = this.inForStatementInitCounter && node.operator === "in" && !n.needsParens(node, parent);
	
	  if (parens) {
	    this.token("(");
	  }
	
	  this.print(node.left, node);
	
	  this.space();
	  if (node.operator === "in" || node.operator === "instanceof") {
	    this.word(node.operator);
	  } else {
	    this.token(node.operator);
	  }
	  this.space();
	
	  this.print(node.right, node);
	
	  if (parens) {
	    this.token(")");
	  }
	}
	
	function BindExpression(node) {
	  this.print(node.object, node);
	  this.token("::");
	  this.print(node.callee, node);
	}
	
	exports.BinaryExpression = AssignmentExpression;
	exports.LogicalExpression = AssignmentExpression;
	function MemberExpression(node) {
	  this.print(node.object, node);
	
	  if (!node.computed && t.isMemberExpression(node.property)) {
	    throw new TypeError("Got a MemberExpression for MemberExpression property");
	  }
	
	  var computed = node.computed;
	  if (t.isLiteral(node.property) && (0, _isNumber2.default)(node.property.value)) {
	    computed = true;
	  }
	
	  if (computed) {
	    this.token("[");
	    this.print(node.property, node);
	    this.token("]");
	  } else {
	    this.token(".");
	    this.print(node.property, node);
	  }
	}
	
	function MetaProperty(node) {
	  this.print(node.meta, node);
	  this.token(".");
	  this.print(node.property, node);
	}

/***/ },

/***/ 523:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.TypeParameterDeclaration = exports.StringLiteralTypeAnnotation = exports.NumericLiteralTypeAnnotation = exports.GenericTypeAnnotation = exports.ClassImplements = undefined;
	exports.AnyTypeAnnotation = AnyTypeAnnotation;
	exports.ArrayTypeAnnotation = ArrayTypeAnnotation;
	exports.BooleanTypeAnnotation = BooleanTypeAnnotation;
	exports.BooleanLiteralTypeAnnotation = BooleanLiteralTypeAnnotation;
	exports.NullLiteralTypeAnnotation = NullLiteralTypeAnnotation;
	exports.DeclareClass = DeclareClass;
	exports.DeclareFunction = DeclareFunction;
	exports.DeclareInterface = DeclareInterface;
	exports.DeclareModule = DeclareModule;
	exports.DeclareTypeAlias = DeclareTypeAlias;
	exports.DeclareVariable = DeclareVariable;
	exports.ExistentialTypeParam = ExistentialTypeParam;
	exports.FunctionTypeAnnotation = FunctionTypeAnnotation;
	exports.FunctionTypeParam = FunctionTypeParam;
	exports.InterfaceExtends = InterfaceExtends;
	exports._interfaceish = _interfaceish;
	exports.InterfaceDeclaration = InterfaceDeclaration;
	exports.IntersectionTypeAnnotation = IntersectionTypeAnnotation;
	exports.MixedTypeAnnotation = MixedTypeAnnotation;
	exports.NullableTypeAnnotation = NullableTypeAnnotation;
	
	var _types = __webpack_require__(237);
	
	Object.defineProperty(exports, "NumericLiteralTypeAnnotation", {
	  enumerable: true,
	  get: function get() {
	    return _types.NumericLiteral;
	  }
	});
	Object.defineProperty(exports, "StringLiteralTypeAnnotation", {
	  enumerable: true,
	  get: function get() {
	    return _types.StringLiteral;
	  }
	});
	exports.NumberTypeAnnotation = NumberTypeAnnotation;
	exports.StringTypeAnnotation = StringTypeAnnotation;
	exports.ThisTypeAnnotation = ThisTypeAnnotation;
	exports.TupleTypeAnnotation = TupleTypeAnnotation;
	exports.TypeofTypeAnnotation = TypeofTypeAnnotation;
	exports.TypeAlias = TypeAlias;
	exports.TypeAnnotation = TypeAnnotation;
	exports.TypeParameter = TypeParameter;
	exports.TypeParameterInstantiation = TypeParameterInstantiation;
	exports.ObjectTypeAnnotation = ObjectTypeAnnotation;
	exports.ObjectTypeCallProperty = ObjectTypeCallProperty;
	exports.ObjectTypeIndexer = ObjectTypeIndexer;
	exports.ObjectTypeProperty = ObjectTypeProperty;
	exports.QualifiedTypeIdentifier = QualifiedTypeIdentifier;
	exports.UnionTypeAnnotation = UnionTypeAnnotation;
	exports.TypeCastExpression = TypeCastExpression;
	exports.VoidTypeAnnotation = VoidTypeAnnotation;
	
	var _babelTypes = __webpack_require__(1);
	
	var t = _interopRequireWildcard(_babelTypes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function AnyTypeAnnotation() {
	  this.word("any");
	} /* eslint max-len: 0 */
	
	function ArrayTypeAnnotation(node) {
	  this.print(node.elementType, node);
	  this.token("[");
	  this.token("]");
	}
	
	function BooleanTypeAnnotation() {
	  this.word("bool");
	}
	
	function BooleanLiteralTypeAnnotation(node) {
	  this.word(node.value ? "true" : "false");
	}
	
	function NullLiteralTypeAnnotation() {
	  this.word("null");
	}
	
	function DeclareClass(node) {
	  this.word("declare");
	  this.space();
	  this.word("class");
	  this.space();
	  this._interfaceish(node);
	}
	
	function DeclareFunction(node) {
	  this.word("declare");
	  this.space();
	  this.word("function");
	  this.space();
	  this.print(node.id, node);
	  this.print(node.id.typeAnnotation.typeAnnotation, node);
	  this.semicolon();
	}
	
	function DeclareInterface(node) {
	  this.word("declare");
	  this.space();
	  this.InterfaceDeclaration(node);
	}
	
	function DeclareModule(node) {
	  this.word("declare");
	  this.space();
	  this.word("module");
	  this.space();
	  this.print(node.id, node);
	  this.space();
	  this.print(node.body, node);
	}
	
	function DeclareTypeAlias(node) {
	  this.word("declare");
	  this.space();
	  this.TypeAlias(node);
	}
	
	function DeclareVariable(node) {
	  this.word("declare");
	  this.space();
	  this.word("var");
	  this.space();
	  this.print(node.id, node);
	  this.print(node.id.typeAnnotation, node);
	  this.semicolon();
	}
	
	function ExistentialTypeParam() {
	  this.token("*");
	}
	
	function FunctionTypeAnnotation(node, parent) {
	  this.print(node.typeParameters, node);
	  this.token("(");
	  this.printList(node.params, node);
	
	  if (node.rest) {
	    if (node.params.length) {
	      this.token(",");
	      this.space();
	    }
	    this.token("...");
	    this.print(node.rest, node);
	  }
	
	  this.token(")");
	
	  // this node type is overloaded, not sure why but it makes it EXTREMELY annoying
	  if (parent.type === "ObjectTypeProperty" || parent.type === "ObjectTypeCallProperty" || parent.type === "DeclareFunction") {
	    this.token(":");
	  } else {
	    this.space();
	    this.token("=>");
	  }
	
	  this.space();
	  this.print(node.returnType, node);
	}
	
	function FunctionTypeParam(node) {
	  this.print(node.name, node);
	  if (node.optional) this.token("?");
	  this.token(":");
	  this.space();
	  this.print(node.typeAnnotation, node);
	}
	
	function InterfaceExtends(node) {
	  this.print(node.id, node);
	  this.print(node.typeParameters, node);
	}
	
	exports.ClassImplements = InterfaceExtends;
	exports.GenericTypeAnnotation = InterfaceExtends;
	function _interfaceish(node) {
	  this.print(node.id, node);
	  this.print(node.typeParameters, node);
	  if (node.extends.length) {
	    this.space();
	    this.word("extends");
	    this.space();
	    this.printList(node.extends, node);
	  }
	  if (node.mixins && node.mixins.length) {
	    this.space();
	    this.word("mixins");
	    this.space();
	    this.printList(node.mixins, node);
	  }
	  this.space();
	  this.print(node.body, node);
	}
	
	function InterfaceDeclaration(node) {
	  this.word("interface");
	  this.space();
	  this._interfaceish(node);
	}
	
	function andSeparator() {
	  this.space();
	  this.token("&");
	  this.space();
	}
	
	function IntersectionTypeAnnotation(node) {
	  this.printJoin(node.types, node, { separator: andSeparator });
	}
	
	function MixedTypeAnnotation() {
	  this.word("mixed");
	}
	
	function NullableTypeAnnotation(node) {
	  this.token("?");
	  this.print(node.typeAnnotation, node);
	}
	
	function NumberTypeAnnotation() {
	  this.word("number");
	}
	
	function StringTypeAnnotation() {
	  this.word("string");
	}
	
	function ThisTypeAnnotation() {
	  this.word("this");
	}
	
	function TupleTypeAnnotation(node) {
	  this.token("[");
	  this.printList(node.types, node);
	  this.token("]");
	}
	
	function TypeofTypeAnnotation(node) {
	  this.word("typeof");
	  this.space();
	  this.print(node.argument, node);
	}
	
	function TypeAlias(node) {
	  this.word("type");
	  this.space();
	  this.print(node.id, node);
	  this.print(node.typeParameters, node);
	  this.space();
	  this.token("=");
	  this.space();
	  this.print(node.right, node);
	  this.semicolon();
	}
	
	function TypeAnnotation(node) {
	  this.token(":");
	  this.space();
	  if (node.optional) this.token("?");
	  this.print(node.typeAnnotation, node);
	}
	
	function TypeParameter(node) {
	  if (node.variance === "plus") {
	    this.token("+");
	  } else if (node.variance === "minus") {
	    this.token("-");
	  }
	
	  this.word(node.name);
	
	  if (node.bound) {
	    this.print(node.bound, node);
	  }
	
	  if (node.default) {
	    this.space();
	    this.token("=");
	    this.space();
	    this.print(node.default, node);
	  }
	}
	
	function TypeParameterInstantiation(node) {
	  this.token("<");
	  this.printList(node.params, node, {});
	  this.token(">");
	}
	
	exports.TypeParameterDeclaration = TypeParameterInstantiation;
	function ObjectTypeAnnotation(node) {
	  var _this = this;
	
	  this.token("{");
	  var props = node.properties.concat(node.callProperties, node.indexers);
	
	  if (props.length) {
	    this.space();
	
	    this.printJoin(props, node, {
	      indent: true,
	      statement: true,
	      iterator: function iterator() {
	        if (props.length !== 1) {
	          _this.semicolon();
	          _this.space();
	        }
	      }
	    });
	
	    this.space();
	  }
	
	  this.token("}");
	}
	
	function ObjectTypeCallProperty(node) {
	  if (node.static) {
	    this.word("static");
	    this.space();
	  }
	  this.print(node.value, node);
	}
	
	function ObjectTypeIndexer(node) {
	  if (node.static) {
	    this.word("static");
	    this.space();
	  }
	  this.token("[");
	  this.print(node.id, node);
	  this.token(":");
	  this.space();
	  this.print(node.key, node);
	  this.token("]");
	  this.token(":");
	  this.space();
	  this.print(node.value, node);
	}
	
	function ObjectTypeProperty(node) {
	  if (node.static) {
	    this.word("static");
	    this.space();
	  }
	  this.print(node.key, node);
	  if (node.optional) this.token("?");
	  if (!t.isFunctionTypeAnnotation(node.value)) {
	    this.token(":");
	    this.space();
	  }
	  this.print(node.value, node);
	}
	
	function QualifiedTypeIdentifier(node) {
	  this.print(node.qualification, node);
	  this.token(".");
	  this.print(node.id, node);
	}
	
	function orSeparator() {
	  this.space();
	  this.token("|");
	  this.space();
	}
	
	function UnionTypeAnnotation(node) {
	  this.printJoin(node.types, node, { separator: orSeparator });
	}
	
	function TypeCastExpression(node) {
	  this.token("(");
	  this.print(node.expression, node);
	  this.print(node.typeAnnotation, node);
	  this.token(")");
	}
	
	function VoidTypeAnnotation() {
	  this.word("void");
	}

/***/ },

/***/ 524:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _getIterator2 = __webpack_require__(163);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	exports.JSXAttribute = JSXAttribute;
	exports.JSXIdentifier = JSXIdentifier;
	exports.JSXNamespacedName = JSXNamespacedName;
	exports.JSXMemberExpression = JSXMemberExpression;
	exports.JSXSpreadAttribute = JSXSpreadAttribute;
	exports.JSXExpressionContainer = JSXExpressionContainer;
	exports.JSXText = JSXText;
	exports.JSXElement = JSXElement;
	exports.JSXOpeningElement = JSXOpeningElement;
	exports.JSXClosingElement = JSXClosingElement;
	exports.JSXEmptyExpression = JSXEmptyExpression;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function JSXAttribute(node) {
	  this.print(node.name, node);
	  if (node.value) {
	    this.token("=");
	    this.print(node.value, node);
	  }
	}
	
	function JSXIdentifier(node) {
	  this.word(node.name);
	}
	
	function JSXNamespacedName(node) {
	  this.print(node.namespace, node);
	  this.token(":");
	  this.print(node.name, node);
	}
	
	function JSXMemberExpression(node) {
	  this.print(node.object, node);
	  this.token(".");
	  this.print(node.property, node);
	}
	
	function JSXSpreadAttribute(node) {
	  this.token("{");
	  this.token("...");
	  this.print(node.argument, node);
	  this.token("}");
	}
	
	function JSXExpressionContainer(node) {
	  this.token("{");
	  this.print(node.expression, node);
	  this.token("}");
	}
	
	function JSXText(node) {
	  this.token(node.value);
	}
	
	function JSXElement(node) {
	  var open = node.openingElement;
	  this.print(open, node);
	  if (open.selfClosing) return;
	
	  this.indent();
	  for (var _iterator = node.children, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
	    var _ref;
	
	    if (_isArray) {
	      if (_i >= _iterator.length) break;
	      _ref = _iterator[_i++];
	    } else {
	      _i = _iterator.next();
	      if (_i.done) break;
	      _ref = _i.value;
	    }
	
	    var child = _ref;
	
	    this.print(child, node);
	  }
	  this.dedent();
	
	  this.print(node.closingElement, node);
	}
	
	function spaceSeparator() {
	  this.space();
	}
	
	function JSXOpeningElement(node) {
	  this.token("<");
	  this.print(node.name, node);
	  if (node.attributes.length > 0) {
	    this.space();
	    this.printJoin(node.attributes, node, { separator: spaceSeparator });
	  }
	  if (node.selfClosing) {
	    this.space();
	    this.token("/>");
	  } else {
	    this.token(">");
	  }
	}
	
	function JSXClosingElement(node) {
	  this.token("</");
	  this.print(node.name, node);
	  this.token(">");
	}
	
	function JSXEmptyExpression() {}

/***/ },

/***/ 525:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.FunctionDeclaration = undefined;
	exports._params = _params;
	exports._method = _method;
	exports.FunctionExpression = FunctionExpression;
	exports.ArrowFunctionExpression = ArrowFunctionExpression;
	
	var _babelTypes = __webpack_require__(1);
	
	var t = _interopRequireWildcard(_babelTypes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _params(node) {
	  var _this = this;
	
	  this.print(node.typeParameters, node);
	  this.token("(");
	  this.printList(node.params, node, {
	    iterator: function iterator(node) {
	      if (node.optional) _this.token("?");
	      _this.print(node.typeAnnotation, node);
	    }
	  });
	  this.token(")");
	
	  if (node.returnType) {
	    this.print(node.returnType, node);
	  }
	}
	
	function _method(node) {
	  var kind = node.kind;
	  var key = node.key;
	
	  if (kind === "method" || kind === "init") {
	    if (node.generator) {
	      this.token("*");
	    }
	  }
	
	  if (kind === "get" || kind === "set") {
	    this.word(kind);
	    this.space();
	  }
	
	  if (node.async) {
	    this.word("async");
	    this.space();
	  }
	
	  if (node.computed) {
	    this.token("[");
	    this.print(key, node);
	    this.token("]");
	  } else {
	    this.print(key, node);
	  }
	
	  this._params(node);
	  this.space();
	  this.print(node.body, node);
	}
	
	function FunctionExpression(node) {
	  if (node.async) {
	    this.word("async");
	    this.space();
	  }
	  this.word("function");
	  if (node.generator) this.token("*");
	
	  if (node.id) {
	    this.space();
	    this.print(node.id, node);
	  } else {
	    this.space();
	  }
	
	  this._params(node);
	  this.space();
	  this.print(node.body, node);
	}
	
	exports.FunctionDeclaration = FunctionExpression;
	function ArrowFunctionExpression(node) {
	  if (node.async) {
	    this.word("async");
	    this.space();
	  }
	
	  if (node.params.length === 1 && t.isIdentifier(node.params[0])) {
	    this.print(node.params[0], node);
	  } else {
	    this._params(node);
	  }
	
	  this.space();
	  this.token("=>");
	  this.space();
	
	  this.print(node.body, node);
	}

/***/ },

/***/ 526:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.ImportSpecifier = ImportSpecifier;
	exports.ImportDefaultSpecifier = ImportDefaultSpecifier;
	exports.ExportDefaultSpecifier = ExportDefaultSpecifier;
	exports.ExportSpecifier = ExportSpecifier;
	exports.ExportNamespaceSpecifier = ExportNamespaceSpecifier;
	exports.ExportAllDeclaration = ExportAllDeclaration;
	exports.ExportNamedDeclaration = ExportNamedDeclaration;
	exports.ExportDefaultDeclaration = ExportDefaultDeclaration;
	exports.ImportDeclaration = ImportDeclaration;
	exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier;
	
	var _babelTypes = __webpack_require__(1);
	
	var t = _interopRequireWildcard(_babelTypes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function ImportSpecifier(node) {
	  this.print(node.imported, node);
	  if (node.local && node.local.name !== node.imported.name) {
	    this.space();
	    this.word("as");
	    this.space();
	    this.print(node.local, node);
	  }
	}
	
	function ImportDefaultSpecifier(node) {
	  this.print(node.local, node);
	}
	
	function ExportDefaultSpecifier(node) {
	  this.print(node.exported, node);
	}
	
	function ExportSpecifier(node) {
	  this.print(node.local, node);
	  if (node.exported && node.local.name !== node.exported.name) {
	    this.space();
	    this.word("as");
	    this.space();
	    this.print(node.exported, node);
	  }
	}
	
	function ExportNamespaceSpecifier(node) {
	  this.token("*");
	  this.space();
	  this.word("as");
	  this.space();
	  this.print(node.exported, node);
	}
	
	function ExportAllDeclaration(node) {
	  this.word("export");
	  this.space();
	  this.token("*");
	  if (node.exported) {
	    this.space();
	    this.word("as");
	    this.space();
	    this.print(node.exported, node);
	  }
	  this.space();
	  this.word("from");
	  this.space();
	  this.print(node.source, node);
	  this.semicolon();
	}
	
	function ExportNamedDeclaration() {
	  this.word("export");
	  this.space();
	  ExportDeclaration.apply(this, arguments);
	}
	
	function ExportDefaultDeclaration() {
	  this.word("export");
	  this.space();
	  this.word("default");
	  this.space();
	  ExportDeclaration.apply(this, arguments);
	}
	
	function ExportDeclaration(node) {
	  if (node.declaration) {
	    var declar = node.declaration;
	    this.print(declar, node);
	    if (!t.isStatement(declar)) this.semicolon();
	  } else {
	    if (node.exportKind === "type") {
	      this.word("type");
	      this.space();
	    }
	
	    var specifiers = node.specifiers.slice(0);
	
	    // print "special" specifiers first
	    var hasSpecial = false;
	    while (true) {
	      var first = specifiers[0];
	      if (t.isExportDefaultSpecifier(first) || t.isExportNamespaceSpecifier(first)) {
	        hasSpecial = true;
	        this.print(specifiers.shift(), node);
	        if (specifiers.length) {
	          this.token(",");
	          this.space();
	        }
	      } else {
	        break;
	      }
	    }
	
	    if (specifiers.length || !specifiers.length && !hasSpecial) {
	      this.token("{");
	      if (specifiers.length) {
	        this.space();
	        this.printList(specifiers, node);
	        this.space();
	      }
	      this.token("}");
	    }
	
	    if (node.source) {
	      this.space();
	      this.word("from");
	      this.space();
	      this.print(node.source, node);
	    }
	
	    this.semicolon();
	  }
	}
	
	function ImportDeclaration(node) {
	  this.word("import");
	  this.space();
	
	  if (node.importKind === "type" || node.importKind === "typeof") {
	    this.word(node.importKind);
	    this.space();
	  }
	
	  var specifiers = node.specifiers.slice(0);
	  if (specifiers && specifiers.length) {
	    // print "special" specifiers first
	    while (true) {
	      var first = specifiers[0];
	      if (t.isImportDefaultSpecifier(first) || t.isImportNamespaceSpecifier(first)) {
	        this.print(specifiers.shift(), node);
	        if (specifiers.length) {
	          this.token(",");
	          this.space();
	        }
	      } else {
	        break;
	      }
	    }
	
	    if (specifiers.length) {
	      this.token("{");
	      this.space();
	      this.printList(specifiers, node);
	      this.space();
	      this.token("}");
	    }
	
	    this.space();
	    this.word("from");
	    this.space();
	  }
	
	  this.print(node.source, node);
	  this.semicolon();
	}
	
	function ImportNamespaceSpecifier(node) {
	  this.token("*");
	  this.space();
	  this.word("as");
	  this.space();
	  this.print(node.local, node);
	}

/***/ },

/***/ 527:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.ThrowStatement = exports.BreakStatement = exports.ReturnStatement = exports.ContinueStatement = exports.ForOfStatement = exports.ForInStatement = undefined;
	
	var _getIterator2 = __webpack_require__(163);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	exports.WithStatement = WithStatement;
	exports.IfStatement = IfStatement;
	exports.ForStatement = ForStatement;
	exports.WhileStatement = WhileStatement;
	exports.DoWhileStatement = DoWhileStatement;
	exports.LabeledStatement = LabeledStatement;
	exports.TryStatement = TryStatement;
	exports.CatchClause = CatchClause;
	exports.SwitchStatement = SwitchStatement;
	exports.SwitchCase = SwitchCase;
	exports.DebuggerStatement = DebuggerStatement;
	exports.VariableDeclaration = VariableDeclaration;
	exports.VariableDeclarator = VariableDeclarator;
	
	var _babelTypes = __webpack_require__(1);
	
	var t = _interopRequireWildcard(_babelTypes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function WithStatement(node) {
	  this.word("with");
	  this.space();
	  this.token("(");
	  this.print(node.object, node);
	  this.token(")");
	  this.printBlock(node);
	}
	
	function IfStatement(node) {
	  this.word("if");
	  this.space();
	  this.token("(");
	  this.print(node.test, node);
	  this.token(")");
	  this.space();
	
	  var needsBlock = node.alternate && t.isIfStatement(getLastStatement(node.consequent));
	  if (needsBlock) {
	    this.token("{");
	    this.newline();
	    this.indent();
	  }
	
	  this.printAndIndentOnComments(node.consequent, node);
	
	  if (needsBlock) {
	    this.dedent();
	    this.newline();
	    this.token("}");
	  }
	
	  if (node.alternate) {
	    if (this.endsWith("}")) this.space();
	    this.word("else");
	    this.space();
	    this.printAndIndentOnComments(node.alternate, node);
	  }
	}
	
	// Recursively get the last statement.
	function getLastStatement(statement) {
	  if (!t.isStatement(statement.body)) return statement;
	  return getLastStatement(statement.body);
	}
	
	function ForStatement(node) {
	  this.word("for");
	  this.space();
	  this.token("(");
	
	  this.inForStatementInitCounter++;
	  this.print(node.init, node);
	  this.inForStatementInitCounter--;
	  this.token(";");
	
	  if (node.test) {
	    this.space();
	    this.print(node.test, node);
	  }
	  this.token(";");
	
	  if (node.update) {
	    this.space();
	    this.print(node.update, node);
	  }
	
	  this.token(")");
	  this.printBlock(node);
	}
	
	function WhileStatement(node) {
	  this.word("while");
	  this.space();
	  this.token("(");
	  this.print(node.test, node);
	  this.token(")");
	  this.printBlock(node);
	}
	
	var buildForXStatement = function buildForXStatement(op) {
	  return function (node) {
	    this.word("for");
	    this.space();
	    this.token("(");
	    this.print(node.left, node);
	    this.space();
	    this.word(op);
	    this.space();
	    this.print(node.right, node);
	    this.token(")");
	    this.printBlock(node);
	  };
	};
	
	var ForInStatement = exports.ForInStatement = buildForXStatement("in");
	var ForOfStatement = exports.ForOfStatement = buildForXStatement("of");
	
	function DoWhileStatement(node) {
	  this.word("do");
	  this.space();
	  this.print(node.body, node);
	  this.space();
	  this.word("while");
	  this.space();
	  this.token("(");
	  this.print(node.test, node);
	  this.token(")");
	  this.semicolon();
	}
	
	function buildLabelStatement(prefix) {
	  var key = arguments.length <= 1 || arguments[1] === undefined ? "label" : arguments[1];
	
	  return function (node) {
	    this.word(prefix);
	
	    var label = node[key];
	    if (label) {
	      this.space();
	
	      var terminatorState = this.startTerminatorless();
	      this.print(label, node);
	      this.endTerminatorless(terminatorState);
	    }
	
	    this.semicolon();
	  };
	}
	
	var ContinueStatement = exports.ContinueStatement = buildLabelStatement("continue");
	var ReturnStatement = exports.ReturnStatement = buildLabelStatement("return", "argument");
	var BreakStatement = exports.BreakStatement = buildLabelStatement("break");
	var ThrowStatement = exports.ThrowStatement = buildLabelStatement("throw", "argument");
	
	function LabeledStatement(node) {
	  this.print(node.label, node);
	  this.token(":");
	  this.space();
	  this.print(node.body, node);
	}
	
	function TryStatement(node) {
	  this.word("try");
	  this.space();
	  this.print(node.block, node);
	  this.space();
	
	  // Esprima bug puts the catch clause in a `handlers` array.
	  // see https://code.google.com/p/esprima/issues/detail?id=433
	  // We run into this from regenerator generated ast.
	  if (node.handlers) {
	    this.print(node.handlers[0], node);
	  } else {
	    this.print(node.handler, node);
	  }
	
	  if (node.finalizer) {
	    this.space();
	    this.word("finally");
	    this.space();
	    this.print(node.finalizer, node);
	  }
	}
	
	function CatchClause(node) {
	  this.word("catch");
	  this.space();
	  this.token("(");
	  this.print(node.param, node);
	  this.token(")");
	  this.space();
	  this.print(node.body, node);
	}
	
	function SwitchStatement(node) {
	  this.word("switch");
	  this.space();
	  this.token("(");
	  this.print(node.discriminant, node);
	  this.token(")");
	  this.space();
	  this.token("{");
	
	  this.printSequence(node.cases, node, {
	    indent: true,
	    addNewlines: function addNewlines(leading, cas) {
	      if (!leading && node.cases[node.cases.length - 1] === cas) return -1;
	    }
	  });
	
	  this.token("}");
	}
	
	function SwitchCase(node) {
	  if (node.test) {
	    this.word("case");
	    this.space();
	    this.print(node.test, node);
	    this.token(":");
	  } else {
	    this.word("default");
	    this.token(":");
	  }
	
	  if (node.consequent.length) {
	    this.newline();
	    this.printSequence(node.consequent, node, { indent: true });
	  }
	}
	
	function DebuggerStatement() {
	  this.word("debugger");
	  this.semicolon();
	}
	
	function variableDeclarationIdent() {
	  // "let " or "var " indentation.
	  this.token(",");
	  this.newline();
	  if (this.endsWith("\n")) for (var i = 0; i < 4; i++) {
	    this.space(true);
	  }
	}
	
	function constDeclarationIdent() {
	  // "const " indentation.
	  this.token(",");
	  this.newline();
	  if (this.endsWith("\n")) for (var i = 0; i < 6; i++) {
	    this.space(true);
	  }
	}
	
	function VariableDeclaration(node, parent) {
	  this.word(node.kind);
	  this.space();
	
	  var hasInits = false;
	  // don't add whitespace to loop heads
	  if (!t.isFor(parent)) {
	    for (var _iterator = node.declarations, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
	      var _ref;
	
	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }
	
	      var declar = _ref;
	
	      if (declar.init) {
	        // has an init so let's split it up over multiple lines
	        hasInits = true;
	      }
	    }
	  }
	
	  //
	  // use a pretty separator when we aren't in compact mode, have initializers and don't have retainLines on
	  // this will format declarations like:
	  //
	  //   let foo = "bar", bar = "foo";
	  //
	  // into
	  //
	  //   let foo = "bar",
	  //       bar = "foo";
	  //
	
	  var separator = void 0;
	  if (hasInits) {
	    separator = node.kind === "const" ? constDeclarationIdent : variableDeclarationIdent;
	  }
	
	  //
	
	  this.printList(node.declarations, node, { separator: separator });
	
	  if (t.isFor(parent)) {
	    // don't give semicolons to these nodes since they'll be inserted in the parent generator
	    if (parent.left === node || parent.init === node) return;
	  }
	
	  this.semicolon();
	}
	
	function VariableDeclarator(node) {
	  this.print(node.id, node);
	  this.print(node.id.typeAnnotation, node);
	  if (node.init) {
	    this.space();
	    this.token("=");
	    this.space();
	    this.print(node.init, node);
	  }
	}

/***/ },

/***/ 528:
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.TaggedTemplateExpression = TaggedTemplateExpression;
	exports.TemplateElement = TemplateElement;
	exports.TemplateLiteral = TemplateLiteral;
	function TaggedTemplateExpression(node) {
	  this.print(node.tag, node);
	  this.print(node.quasi, node);
	}
	
	function TemplateElement(node, parent) {
	  var isFirst = parent.quasis[0] === node;
	  var isLast = parent.quasis[parent.quasis.length - 1] === node;
	
	  var value = (isFirst ? "`" : "}") + node.value.raw + (isLast ? "`" : "${");
	
	  if (!isFirst) this.space();
	  this.token(value);
	  if (!isLast) this.space();
	}
	
	function TemplateLiteral(node) {
	  var quasis = node.quasis;
	
	  for (var i = 0; i < quasis.length; i++) {
	    this.print(quasis[i], node);
	
	    if (i + 1 < quasis.length) {
	      this.print(node.expressions[i], node);
	    }
	  }
	}

/***/ },

/***/ 529:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.AwaitExpression = exports.FunctionTypeAnnotation = undefined;
	exports.NullableTypeAnnotation = NullableTypeAnnotation;
	exports.UpdateExpression = UpdateExpression;
	exports.ObjectExpression = ObjectExpression;
	exports.Binary = Binary;
	exports.BinaryExpression = BinaryExpression;
	exports.SequenceExpression = SequenceExpression;
	exports.YieldExpression = YieldExpression;
	exports.ClassExpression = ClassExpression;
	exports.UnaryLike = UnaryLike;
	exports.FunctionExpression = FunctionExpression;
	exports.ArrowFunctionExpression = ArrowFunctionExpression;
	exports.ConditionalExpression = ConditionalExpression;
	exports.AssignmentExpression = AssignmentExpression;
	
	var _babelTypes = __webpack_require__(1);
	
	var t = _interopRequireWildcard(_babelTypes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var PRECEDENCE = {
	  "||": 0,
	  "&&": 1,
	  "|": 2,
	  "^": 3,
	  "&": 4,
	  "==": 5,
	  "===": 5,
	  "!=": 5,
	  "!==": 5,
	  "<": 6,
	  ">": 6,
	  "<=": 6,
	  ">=": 6,
	  in: 6,
	  instanceof: 6,
	  ">>": 7,
	  "<<": 7,
	  ">>>": 7,
	  "+": 8,
	  "-": 8,
	  "*": 9,
	  "/": 9,
	  "%": 9,
	  "**": 10
	};
	
	function NullableTypeAnnotation(node, parent) {
	  return t.isArrayTypeAnnotation(parent);
	}
	
	exports.FunctionTypeAnnotation = NullableTypeAnnotation;
	function UpdateExpression(node, parent) {
	  if (t.isMemberExpression(parent) && parent.object === node) {
	    // (foo++).test()
	    return true;
	  }
	
	  return false;
	}
	
	function ObjectExpression(node, parent, printStack) {
	  return isFirstInStatement(printStack, { considerArrow: true });
	}
	
	function Binary(node, parent) {
	  if ((t.isCallExpression(parent) || t.isNewExpression(parent)) && parent.callee === node) {
	    return true;
	  }
	
	  if (t.isUnaryLike(parent)) {
	    return true;
	  }
	
	  if (t.isMemberExpression(parent) && parent.object === node) {
	    return true;
	  }
	
	  if (t.isBinary(parent)) {
	    var parentOp = parent.operator;
	    var parentPos = PRECEDENCE[parentOp];
	
	    var nodeOp = node.operator;
	    var nodePos = PRECEDENCE[nodeOp];
	
	    if (parentPos > nodePos) {
	      return true;
	    }
	
	    // Logical expressions with the same precedence don't need parens.
	    if (parentPos === nodePos && parent.right === node && !t.isLogicalExpression(parent)) {
	      return true;
	    }
	  }
	
	  return false;
	}
	
	function BinaryExpression(node, parent) {
	  if (node.operator === "in") {
	    // let i = (1 in []);
	    if (t.isVariableDeclarator(parent)) {
	      return true;
	    }
	
	    // for ((1 in []);;);
	    if (t.isFor(parent)) {
	      return true;
	    }
	  }
	
	  return false;
	}
	
	function SequenceExpression(node, parent) {
	  if (t.isForStatement(parent)) {
	    // Although parentheses wouldn"t hurt around sequence
	    // expressions in the head of for loops, traditional style
	    // dictates that e.g. i++, j++ should not be wrapped with
	    // parentheses.
	    return false;
	  }
	
	  if (t.isExpressionStatement(parent) && parent.expression === node) {
	    return false;
	  }
	
	  if (t.isReturnStatement(parent)) {
	    return false;
	  }
	
	  if (t.isThrowStatement(parent)) {
	    return false;
	  }
	
	  if (t.isSwitchStatement(parent) && parent.discriminant === node) {
	    return false;
	  }
	
	  if (t.isWhileStatement(parent) && parent.test === node) {
	    return false;
	  }
	
	  if (t.isIfStatement(parent) && parent.test === node) {
	    return false;
	  }
	
	  if (t.isForInStatement(parent) && parent.right === node) {
	    return false;
	  }
	
	  // Otherwise err on the side of overparenthesization, adding
	  // explicit exceptions above if this proves overzealous.
	  return true;
	}
	
	function YieldExpression(node, parent) {
	  return t.isBinary(parent) || t.isUnaryLike(parent) || t.isCallExpression(parent) || t.isMemberExpression(parent) || t.isNewExpression(parent);
	}
	
	exports.AwaitExpression = YieldExpression;
	function ClassExpression(node, parent, printStack) {
	  return isFirstInStatement(printStack, { considerDefaultExports: true });
	}
	
	function UnaryLike(node, parent) {
	  if (t.isMemberExpression(parent, { object: node })) {
	    return true;
	  }
	
	  if (t.isCallExpression(parent, { callee: node }) || t.isNewExpression(parent, { callee: node })) {
	    return true;
	  }
	
	  return false;
	}
	
	function FunctionExpression(node, parent, printStack) {
	  return isFirstInStatement(printStack, { considerDefaultExports: true });
	}
	
	function ArrowFunctionExpression(node, parent) {
	  // export default (function () {});
	  if (t.isExportDeclaration(parent)) {
	    return true;
	  }
	
	  if (t.isBinaryExpression(parent) || t.isLogicalExpression(parent)) {
	    return true;
	  }
	
	  if (t.isUnaryExpression(parent)) {
	    return true;
	  }
	
	  return UnaryLike(node, parent);
	}
	
	function ConditionalExpression(node, parent) {
	  if (t.isUnaryLike(parent)) {
	    return true;
	  }
	
	  if (t.isBinary(parent)) {
	    return true;
	  }
	
	  if (t.isConditionalExpression(parent, { test: node })) {
	    return true;
	  }
	
	  return UnaryLike(node, parent);
	}
	
	function AssignmentExpression(node) {
	  if (t.isObjectPattern(node.left)) {
	    return true;
	  } else {
	    return ConditionalExpression.apply(undefined, arguments);
	  }
	}
	
	// Walk up the print stack to deterimine if our node can come first
	// in statement.
	function isFirstInStatement(printStack) {
	  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  var _ref$considerArrow = _ref.considerArrow;
	  var considerArrow = _ref$considerArrow === undefined ? false : _ref$considerArrow;
	  var _ref$considerDefaultE = _ref.considerDefaultExports;
	  var considerDefaultExports = _ref$considerDefaultE === undefined ? false : _ref$considerDefaultE;
	
	  var i = printStack.length - 1;
	  var node = printStack[i];
	  i--;
	  var parent = printStack[i];
	  while (i > 0) {
	    if (t.isExpressionStatement(parent, { expression: node })) {
	      return true;
	    }
	
	    if (considerDefaultExports && t.isExportDefaultDeclaration(parent, { declaration: node })) {
	      return true;
	    }
	
	    if (considerArrow && t.isArrowFunctionExpression(parent, { body: node })) {
	      return true;
	    }
	
	    if (t.isCallExpression(parent, { callee: node }) || t.isSequenceExpression(parent) && parent.expressions[0] === node || t.isMemberExpression(parent, { object: node }) || t.isConditional(parent, { test: node }) || t.isBinary(parent, { left: node }) || t.isAssignmentExpression(parent, { left: node })) {
	      node = parent;
	      i--;
	      parent = printStack[i];
	    } else {
	      return false;
	    }
	  }
	
	  return false;
	}

/***/ },

/***/ 530:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _isBoolean = __webpack_require__(469);
	
	var _isBoolean2 = _interopRequireDefault(_isBoolean);
	
	var _each = __webpack_require__(313);
	
	var _each2 = _interopRequireDefault(_each);
	
	var _map = __webpack_require__(999);
	
	var _map2 = _interopRequireDefault(_map);
	
	var _babelTypes = __webpack_require__(1);
	
	var t = _interopRequireWildcard(_babelTypes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Crawl a node to test if it contains a CallExpression, a Function, or a Helper.
	 *
	 * @example
	 * crawl(node)
	 * // { hasCall: false, hasFunction: true, hasHelper: false }
	 */
	
	function crawl(node) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  if (t.isMemberExpression(node)) {
	    crawl(node.object, state);
	    if (node.computed) crawl(node.property, state);
	  } else if (t.isBinary(node) || t.isAssignmentExpression(node)) {
	    crawl(node.left, state);
	    crawl(node.right, state);
	  } else if (t.isCallExpression(node)) {
	    state.hasCall = true;
	    crawl(node.callee, state);
	  } else if (t.isFunction(node)) {
	    state.hasFunction = true;
	  } else if (t.isIdentifier(node)) {
	    state.hasHelper = state.hasHelper || isHelper(node.callee);
	  }
	
	  return state;
	}
	
	/**
	 * Test if a node is or has a helper.
	 */
	
	function isHelper(node) {
	  if (t.isMemberExpression(node)) {
	    return isHelper(node.object) || isHelper(node.property);
	  } else if (t.isIdentifier(node)) {
	    return node.name === "require" || node.name[0] === "_";
	  } else if (t.isCallExpression(node)) {
	    return isHelper(node.callee);
	  } else if (t.isBinary(node) || t.isAssignmentExpression(node)) {
	    return t.isIdentifier(node.left) && isHelper(node.left) || isHelper(node.right);
	  } else {
	    return false;
	  }
	}
	
	function isType(node) {
	  return t.isLiteral(node) || t.isObjectExpression(node) || t.isArrayExpression(node) || t.isIdentifier(node) || t.isMemberExpression(node);
	}
	
	/**
	 * Tests for node types that need whitespace.
	 */
	
	exports.nodes = {
	
	  /**
	   * Test if AssignmentExpression needs whitespace.
	   */
	
	  AssignmentExpression: function AssignmentExpression(node) {
	    var state = crawl(node.right);
	    if (state.hasCall && state.hasHelper || state.hasFunction) {
	      return {
	        before: state.hasFunction,
	        after: true
	      };
	    }
	  },
	
	
	  /**
	   * Test if SwitchCase needs whitespace.
	   */
	
	  SwitchCase: function SwitchCase(node, parent) {
	    return {
	      before: node.consequent.length || parent.cases[0] === node
	    };
	  },
	
	
	  /**
	   * Test if LogicalExpression needs whitespace.
	   */
	
	  LogicalExpression: function LogicalExpression(node) {
	    if (t.isFunction(node.left) || t.isFunction(node.right)) {
	      return {
	        after: true
	      };
	    }
	  },
	
	
	  /**
	   * Test if Literal needs whitespace.
	   */
	
	  Literal: function Literal(node) {
	    if (node.value === "use strict") {
	      return {
	        after: true
	      };
	    }
	  },
	
	
	  /**
	   * Test if CallExpression needs whitespace.
	   */
	
	  CallExpression: function CallExpression(node) {
	    if (t.isFunction(node.callee) || isHelper(node)) {
	      return {
	        before: true,
	        after: true
	      };
	    }
	  },
	
	
	  /**
	   * Test if VariableDeclaration needs whitespace.
	   */
	
	  VariableDeclaration: function VariableDeclaration(node) {
	    for (var i = 0; i < node.declarations.length; i++) {
	      var declar = node.declarations[i];
	
	      var enabled = isHelper(declar.id) && !isType(declar.init);
	      if (!enabled) {
	        var state = crawl(declar.init);
	        enabled = isHelper(declar.init) && state.hasCall || state.hasFunction;
	      }
	
	      if (enabled) {
	        return {
	          before: true,
	          after: true
	        };
	      }
	    }
	  },
	
	
	  /**
	   * Test if IfStatement needs whitespace.
	   */
	
	  IfStatement: function IfStatement(node) {
	    if (t.isBlockStatement(node.consequent)) {
	      return {
	        before: true,
	        after: true
	      };
	    }
	  }
	};
	
	/**
	 * Test if Property or SpreadProperty needs whitespace.
	 */
	
	exports.nodes.ObjectProperty = exports.nodes.ObjectTypeProperty = exports.nodes.ObjectMethod = exports.nodes.SpreadProperty = function (node, parent) {
	  if (parent.properties[0] === node) {
	    return {
	      before: true
	    };
	  }
	};
	
	/**
	 * Returns lists from node types that need whitespace.
	 */
	
	exports.list = {
	
	  /**
	   * Return VariableDeclaration declarations init properties.
	   */
	
	  VariableDeclaration: function VariableDeclaration(node) {
	    return (0, _map2.default)(node.declarations, "init");
	  },
	
	
	  /**
	   * Return VariableDeclaration elements.
	   */
	
	  ArrayExpression: function ArrayExpression(node) {
	    return node.elements;
	  },
	
	
	  /**
	   * Return VariableDeclaration properties.
	   */
	
	  ObjectExpression: function ObjectExpression(node) {
	    return node.properties;
	  }
	};
	
	/**
	 * Add whitespace tests for nodes and their aliases.
	 */
	
	(0, _each2.default)({
	  Function: true,
	  Class: true,
	  Loop: true,
	  LabeledStatement: true,
	  SwitchStatement: true,
	  TryStatement: true
	}, function (amounts, type) {
	  if ((0, _isBoolean2.default)(amounts)) {
	    amounts = { after: amounts, before: amounts };
	  }
	
	  (0, _each2.default)([type].concat(t.FLIPPED_ALIAS_KEYS[type] || []), function (type) {
	    exports.nodes[type] = function () {
	      return amounts;
	    };
	  });
	});

/***/ },

/***/ 531:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _assign = __webpack_require__(534);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _getIterator2 = __webpack_require__(163);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	var _stringify = __webpack_require__(350);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _weakSet = __webpack_require__(539);
	
	var _weakSet2 = _interopRequireDefault(_weakSet);
	
	var _classCallCheck2 = __webpack_require__(119);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _find = __webpack_require__(467);
	
	var _find2 = _interopRequireDefault(_find);
	
	var _findLast = __webpack_require__(989);
	
	var _findLast2 = _interopRequireDefault(_findLast);
	
	var _isInteger = __webpack_require__(998);
	
	var _isInteger2 = _interopRequireDefault(_isInteger);
	
	var _repeat = __webpack_require__(470);
	
	var _repeat2 = _interopRequireDefault(_repeat);
	
	var _buffer = __webpack_require__(519);
	
	var _buffer2 = _interopRequireDefault(_buffer);
	
	var _node = __webpack_require__(349);
	
	var n = _interopRequireWildcard(_node);
	
	var _whitespace = __webpack_require__(533);
	
	var _whitespace2 = _interopRequireDefault(_whitespace);
	
	var _babelTypes = __webpack_require__(1);
	
	var t = _interopRequireWildcard(_babelTypes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint max-len: 0 */
	
	var SCIENTIFIC_NOTATION = /e/i;
	var ZERO_DECIMAL_INTEGER = /\.0+$/;
	var NON_DECIMAL_LITERAL = /^0[box]/;
	
	var Printer = function () {
	  function Printer(format, map, tokens) {
	    (0, _classCallCheck3.default)(this, Printer);
	    this.inForStatementInitCounter = 0;
	    this._printStack = [];
	    this._indent = 0;
	    this._insideAux = false;
	    this._printedCommentStarts = {};
	    this._parenPushNewlineState = null;
	    this._printAuxAfterOnNextUserNode = false;
	    this._printedComments = new _weakSet2.default();
	    this._endsWithInteger = false;
	    this._endsWithWord = false;
	
	    this.format = format || {};
	    this._buf = new _buffer2.default(map);
	    this._whitespace = tokens.length > 0 ? new _whitespace2.default(tokens) : null;
	  }
	
	  Printer.prototype.generate = function generate(ast) {
	    this.print(ast);
	    this._maybeAddAuxComment();
	
	    return this._buf.get();
	  };
	
	  /**
	   * Increment indent size.
	   */
	
	  Printer.prototype.indent = function indent() {
	    if (this.format.compact || this.format.concise) return;
	
	    this._indent++;
	  };
	
	  /**
	   * Decrement indent size.
	   */
	
	  Printer.prototype.dedent = function dedent() {
	    if (this.format.compact || this.format.concise) return;
	
	    this._indent--;
	  };
	
	  /**
	   * Add a semicolon to the buffer.
	   */
	
	  Printer.prototype.semicolon = function semicolon() {
	    var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	    this._maybeAddAuxComment();
	    this._append(";", !force /* queue */);
	  };
	
	  /**
	   * Add a right brace to the buffer.
	   */
	
	  Printer.prototype.rightBrace = function rightBrace() {
	    if (this.format.minified) {
	      this._buf.removeLastSemicolon();
	    }
	    this.token("}");
	  };
	
	  /**
	   * Add a space to the buffer unless it is compact.
	   */
	
	  Printer.prototype.space = function space() {
	    var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	    if (this.format.compact) return;
	
	    if (this._buf.hasContent() && !this.endsWith(" ") && !this.endsWith("\n") || force) {
	      this._space();
	    }
	  };
	
	  /**
	   * Writes a token that can't be safely parsed without taking whitespace into account.
	   */
	
	  Printer.prototype.word = function word(str) {
	    if (this._endsWithWord) this._space();
	
	    this._maybeAddAuxComment();
	    this._append(str);
	
	    this._endsWithWord = true;
	  };
	
	  /**
	   * Writes a number token so that we can validate if it is an integer.
	   */
	
	  Printer.prototype.number = function number(str) {
	    this.word(str);
	
	    // Integer tokens need special handling because they cannot have '.'s inserted
	    // immediately after them.
	    this._endsWithInteger = (0, _isInteger2.default)(+str) && !NON_DECIMAL_LITERAL.test(str) && !SCIENTIFIC_NOTATION.test(str) && !ZERO_DECIMAL_INTEGER.test(str) && str[str.length - 1] !== ".";
	  };
	
	  /**
	   * Writes a simple token.
	   */
	
	  Printer.prototype.token = function token(str) {
	    // space is mandatory to avoid outputting <!--
	    // http://javascript.spec.whatwg.org/#comment-syntax
	    if (str === "--" && this.endsWith("!") ||
	
	    // Need spaces for operators of the same kind to avoid: `a+++b`
	    str[0] === "+" && this.endsWith("+") || str[0] === "-" && this.endsWith("-") ||
	
	    // Needs spaces to avoid changing '34' to '34.', which would still be a valid number.
	    str[0] === "." && this._endsWithInteger) {
	      this._space();
	    }
	
	    this._maybeAddAuxComment();
	    this._append(str);
	  };
	
	  /**
	   * Add a newline (or many newlines), maintaining formatting.
	   */
	
	  Printer.prototype.newline = function newline(i) {
	    if (this.format.retainLines || this.format.compact) return;
	
	    if (this.format.concise) {
	      this.space();
	      return;
	    }
	
	    // never allow more than two lines
	    if (this.endsWith("\n\n")) return;
	
	    if (typeof i !== "number") i = 1;
	
	    i = Math.min(2, i);
	    if (this.endsWith("{\n") || this.endsWith(":\n")) i--;
	    if (i <= 0) return;
	
	    for (var j = 0; j < i; j++) {
	      this._newline();
	    }
	  };
	
	  Printer.prototype.endsWith = function endsWith(str) {
	    return this._buf.endsWith(str);
	  };
	
	  Printer.prototype.removeTrailingNewline = function removeTrailingNewline() {
	    this._buf.removeTrailingNewline();
	  };
	
	  Printer.prototype.source = function source(prop, loc) {
	    this._catchUp(prop, loc);
	
	    this._buf.source(prop, loc);
	  };
	
	  Printer.prototype.withSource = function withSource(prop, loc, cb) {
	    this._catchUp(prop, loc);
	
	    this._buf.withSource(prop, loc, cb);
	  };
	
	  Printer.prototype._space = function _space() {
	    this._append(" ", true /* queue */);
	  };
	
	  Printer.prototype._newline = function _newline() {
	    this._append("\n", true /* queue */);
	  };
	
	  Printer.prototype._append = function _append(str) {
	    var queue = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	    this._maybeAddParen(str);
	    this._maybeIndent(str);
	
	    if (queue) this._buf.queue(str);else this._buf.append(str);
	
	    this._endsWithWord = false;
	    this._endsWithInteger = false;
	  };
	
	  Printer.prototype._maybeIndent = function _maybeIndent(str) {
	    // we've got a newline before us so prepend on the indentation
	    if (this._indent && this.endsWith("\n") && str[0] !== "\n") {
	      this._buf.queue(this._getIndent());
	    }
	  };
	
	  Printer.prototype._maybeAddParen = function _maybeAddParen(str) {
	    // see startTerminatorless() instance method
	    var parenPushNewlineState = this._parenPushNewlineState;
	    if (!parenPushNewlineState) return;
	    this._parenPushNewlineState = null;
	
	    var i = void 0;
	    for (i = 0; i < str.length && str[i] === " "; i++) {
	      continue;
	    }if (i === str.length) return;
	
	    var cha = str[i];
	    if (cha === "\n" || cha === "/") {
	      // we're going to break this terminator expression so we need to add a parentheses
	      this.token("(");
	      this.indent();
	      parenPushNewlineState.printed = true;
	    }
	  };
	
	  Printer.prototype._catchUp = function _catchUp(prop, loc) {
	    if (!this.format.retainLines) return;
	
	    // catch up to this nodes newline if we're behind
	    var pos = loc ? loc[prop] : null;
	    if (pos && pos.line !== null) {
	      var count = pos.line - this._buf.getCurrentLine();
	
	      for (var i = 0; i < count; i++) {
	        this._newline();
	      }
	    }
	  };
	
	  /**
	   * Get the current indent.
	   */
	
	  Printer.prototype._getIndent = function _getIndent() {
	    return (0, _repeat2.default)(this.format.indent.style, this._indent);
	  };
	
	  /**
	   * Set some state that will be modified if a newline has been inserted before any
	   * non-space characters.
	   *
	   * This is to prevent breaking semantics for terminatorless separator nodes. eg:
	   *
	   *    return foo;
	   *
	   * returns `foo`. But if we do:
	   *
	   *   return
	   *   foo;
	   *
	   *  `undefined` will be returned and not `foo` due to the terminator.
	   */
	
	  Printer.prototype.startTerminatorless = function startTerminatorless() {
	    return this._parenPushNewlineState = {
	      printed: false
	    };
	  };
	
	  /**
	   * Print an ending parentheses if a starting one has been printed.
	   */
	
	  Printer.prototype.endTerminatorless = function endTerminatorless(state) {
	    if (state.printed) {
	      this.dedent();
	      this.newline();
	      this.token(")");
	    }
	  };
	
	  Printer.prototype.print = function print(node, parent) {
	    var _this = this;
	
	    if (!node) return;
	
	    var oldConcise = this.format.concise;
	    if (node._compact) {
	      this.format.concise = true;
	    }
	
	    var printMethod = this[node.type];
	    if (!printMethod) {
	      throw new ReferenceError("unknown node of type " + (0, _stringify2.default)(node.type) + " with constructor " + (0, _stringify2.default)(node && node.constructor.name));
	    }
	
	    this._printStack.push(node);
	
	    var oldInAux = this._insideAux;
	    this._insideAux = !node.loc;
	    this._maybeAddAuxComment(this._insideAux && !oldInAux);
	
	    var needsParens = n.needsParens(node, parent, this._printStack);
	    if (needsParens) this.token("(");
	
	    this._printLeadingComments(node, parent);
	
	    var loc = t.isProgram(node) || t.isFile(node) ? null : node.loc;
	    this.withSource("start", loc, function () {
	      _this[node.type](node, parent);
	    });
	
	    this._printTrailingComments(node, parent);
	
	    if (needsParens) this.token(")");
	
	    // end
	    this._printStack.pop();
	
	    this.format.concise = oldConcise;
	    this._insideAux = oldInAux;
	  };
	
	  Printer.prototype._maybeAddAuxComment = function _maybeAddAuxComment(enteredPositionlessNode) {
	    if (enteredPositionlessNode) this._printAuxBeforeComment();
	    if (!this._insideAux) this._printAuxAfterComment();
	  };
	
	  Printer.prototype._printAuxBeforeComment = function _printAuxBeforeComment() {
	    if (this._printAuxAfterOnNextUserNode) return;
	    this._printAuxAfterOnNextUserNode = true;
	
	    var comment = this.format.auxiliaryCommentBefore;
	    if (comment) {
	      this._printComment({
	        type: "CommentBlock",
	        value: comment
	      });
	    }
	  };
	
	  Printer.prototype._printAuxAfterComment = function _printAuxAfterComment() {
	    if (!this._printAuxAfterOnNextUserNode) return;
	    this._printAuxAfterOnNextUserNode = false;
	
	    var comment = this.format.auxiliaryCommentAfter;
	    if (comment) {
	      this._printComment({
	        type: "CommentBlock",
	        value: comment
	      });
	    }
	  };
	
	  Printer.prototype.getPossibleRaw = function getPossibleRaw(node) {
	    if (this.format.minified) return;
	
	    var extra = node.extra;
	    if (extra && extra.raw != null && extra.rawValue != null && node.value === extra.rawValue) {
	      return extra.raw;
	    }
	  };
	
	  Printer.prototype.printJoin = function printJoin(nodes, parent) {
	    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	    if (!nodes || !nodes.length) return;
	
	    if (opts.indent) this.indent();
	
	    var newlineOpts = {
	      addNewlines: opts.addNewlines
	    };
	
	    for (var i = 0; i < nodes.length; i++) {
	      var node = nodes[i];
	      if (!node) continue;
	
	      if (opts.statement) this._printNewline(true, node, parent, newlineOpts);
	
	      this.print(node, parent);
	
	      if (opts.iterator) {
	        opts.iterator(node, i);
	      }
	
	      if (opts.separator && i < nodes.length - 1) {
	        opts.separator.call(this);
	      }
	
	      if (opts.statement) this._printNewline(false, node, parent, newlineOpts);
	    }
	
	    if (opts.indent) this.dedent();
	  };
	
	  Printer.prototype.printAndIndentOnComments = function printAndIndentOnComments(node, parent) {
	    var indent = !!node.leadingComments;
	    if (indent) this.indent();
	    this.print(node, parent);
	    if (indent) this.dedent();
	  };
	
	  Printer.prototype.printBlock = function printBlock(parent) {
	    var node = parent.body;
	
	    if (!t.isEmptyStatement(node)) {
	      this.space();
	    }
	
	    this.print(node, parent);
	  };
	
	  Printer.prototype._printTrailingComments = function _printTrailingComments(node, parent) {
	    this._printComments(this._getComments(false, node, parent));
	  };
	
	  Printer.prototype._printLeadingComments = function _printLeadingComments(node, parent) {
	    this._printComments(this._getComments(true, node, parent));
	  };
	
	  Printer.prototype.printInnerComments = function printInnerComments(node) {
	    var indent = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	
	    if (!node.innerComments) return;
	    if (indent) this.indent();
	    this._printComments(node.innerComments);
	    if (indent) this.dedent();
	  };
	
	  Printer.prototype.printSequence = function printSequence(nodes, parent) {
	    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	    opts.statement = true;
	    return this.printJoin(nodes, parent, opts);
	  };
	
	  Printer.prototype.printList = function printList(items, parent) {
	    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	    if (opts.separator == null) {
	      opts.separator = commaSeparator;
	    }
	
	    return this.printJoin(items, parent, opts);
	  };
	
	  Printer.prototype._printNewline = function _printNewline(leading, node, parent, opts) {
	    var _this2 = this;
	
	    // Fast path since 'this.newline' does nothing when not tracking lines.
	    if (this.format.retainLines || this.format.compact) return;
	
	    // Fast path for concise since 'this.newline' just inserts a space when
	    // concise formatting is in use.
	    if (this.format.concise) {
	      this.space();
	      return;
	    }
	
	    var lines = 0;
	
	    if (node.start != null && !node._ignoreUserWhitespace && this._whitespace) {
	      // user node
	      if (leading) {
	        var _comments = node.leadingComments;
	        var _comment = _comments && (0, _find2.default)(_comments, function (comment) {
	          return !!comment.loc && _this2.format.shouldPrintComment(comment.value);
	        });
	
	        lines = this._whitespace.getNewlinesBefore(_comment || node);
	      } else {
	        var _comments2 = node.trailingComments;
	        var _comment2 = _comments2 && (0, _findLast2.default)(_comments2, function (comment) {
	          return !!comment.loc && _this2.format.shouldPrintComment(comment.value);
	        });
	
	        lines = this._whitespace.getNewlinesAfter(_comment2 || node);
	      }
	    } else {
	      // generated node
	      if (!leading) lines++; // always include at least a single line after
	      if (opts.addNewlines) lines += opts.addNewlines(leading, node) || 0;
	
	      var needs = n.needsWhitespaceAfter;
	      if (leading) needs = n.needsWhitespaceBefore;
	      if (needs(node, parent)) lines++;
	
	      // generated nodes can't add starting file whitespace
	      if (!this._buf.hasContent()) lines = 0;
	    }
	
	    this.newline(lines);
	  };
	
	  Printer.prototype._getComments = function _getComments(leading, node) {
	    // Note, we use a boolean flag here instead of passing in the attribute name as it is faster
	    // because this is called extremely frequently.
	    return node && (leading ? node.leadingComments : node.trailingComments) || [];
	  };
	
	  Printer.prototype._printComment = function _printComment(comment) {
	    var _this3 = this;
	
	    if (!this.format.shouldPrintComment(comment.value)) return;
	
	    // Some plugins use this to mark comments as removed using the AST-root 'comments' property,
	    // where they can't manually mutate the AST node comment lists.
	    if (comment.ignore) return;
	
	    if (this._printedComments.has(comment)) return;
	    this._printedComments.add(comment);
	
	    if (comment.start != null) {
	      if (this._printedCommentStarts[comment.start]) return;
	      this._printedCommentStarts[comment.start] = true;
	    }
	
	    // whitespace before
	    this.newline(this._whitespace ? this._whitespace.getNewlinesBefore(comment) : 0);
	
	    if (!this.endsWith("[") && !this.endsWith("{")) this.space();
	
	    var val = comment.type === "CommentLine" ? "//" + comment.value + "\n" : "/*" + comment.value + "*/";
	
	    //
	    if (comment.type === "CommentBlock" && this.format.indent.adjustMultilineComment) {
	      var offset = comment.loc && comment.loc.start.column;
	      if (offset) {
	        var newlineRegex = new RegExp("\\n\\s{1," + offset + "}", "g");
	        val = val.replace(newlineRegex, "\n");
	      }
	
	      var indentSize = Math.max(this._getIndent().length, this._buf.getCurrentColumn());
	      val = val.replace(/\n(?!$)/g, "\n" + (0, _repeat2.default)(" ", indentSize));
	    }
	
	    this.withSource("start", comment.loc, function () {
	      _this3._append(val);
	    });
	
	    // whitespace after
	    this.newline((this._whitespace ? this._whitespace.getNewlinesAfter(comment) : 0) + (
	    // Subtract one to account for the line force-added above.
	    comment.type === "CommentLine" ? -1 : 0));
	  };
	
	  Printer.prototype._printComments = function _printComments(comments) {
	    if (!comments || !comments.length) return;
	
	    for (var _iterator = comments, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
	      var _ref;
	
	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }
	
	      var _comment3 = _ref;
	
	      this._printComment(_comment3);
	    }
	  };
	
	  return Printer;
	}();
	
	exports.default = Printer;
	
	
	function commaSeparator() {
	  this.token(",");
	  this.space();
	}
	
	var _arr = [__webpack_require__(528), __webpack_require__(522), __webpack_require__(527), __webpack_require__(521), __webpack_require__(525), __webpack_require__(526), __webpack_require__(237), __webpack_require__(523), __webpack_require__(520), __webpack_require__(524)];
	for (var _i2 = 0; _i2 < _arr.length; _i2++) {
	  var generator = _arr[_i2];
	  (0, _assign2.default)(Printer.prototype, generator);
	}
	module.exports = exports["default"];

/***/ },

/***/ 532:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _keys = __webpack_require__(351);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _typeof2 = __webpack_require__(238);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _classCallCheck2 = __webpack_require__(119);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _sourceMap = __webpack_require__(339);
	
	var _sourceMap2 = _interopRequireDefault(_sourceMap);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Build a sourcemap.
	 */
	
	var SourceMap = function () {
	  function SourceMap(opts, code) {
	    var _this = this;
	
	    (0, _classCallCheck3.default)(this, SourceMap);
	
	    this._opts = opts;
	    this._map = new _sourceMap2.default.SourceMapGenerator({
	      file: opts.sourceMapTarget,
	      sourceRoot: opts.sourceRoot
	    });
	
	    if (typeof code === "string") {
	      this._map.setSourceContent(opts.sourceFileName, code);
	    } else if ((typeof code === "undefined" ? "undefined" : (0, _typeof3.default)(code)) === "object") {
	      (0, _keys2.default)(code).forEach(function (sourceFileName) {
	        _this._map.setSourceContent(sourceFileName, code[sourceFileName]);
	      });
	    }
	  }
	
	  /**
	   * Get the sourcemap.
	   */
	
	  SourceMap.prototype.get = function get() {
	    return this._map.toJSON();
	  };
	
	  /**
	   * Mark the current generated position with a source position. May also be passed null line/column
	   * values to insert a mapping to nothing.
	   */
	
	  SourceMap.prototype.mark = function mark(generatedLine, generatedColumn, line, column, filename) {
	    // Adding an empty mapping at the start of a generated line just clutters the map.
	    if (this._lastGenLine !== generatedLine && line === null) return;
	
	    // If this mapping points to the same source location as the last one, we can ignore it since
	    // the previous one covers it.
	    if (this._lastGenLine === generatedLine && this._lastSourceLine === line && this._lastSourceColumn === column) {
	      return;
	    }
	
	    this._lastGenLine = generatedLine;
	    this._lastSourceLine = line;
	    this._lastSourceColumn = column;
	
	    this._map.addMapping({
	      generated: {
	        line: generatedLine,
	        column: generatedColumn
	      },
	      source: line == null ? null : filename || this._opts.sourceFileName,
	      original: line == null ? null : {
	        line: line,
	        column: column
	      }
	    });
	  };
	
	  return SourceMap;
	}();
	
	exports.default = SourceMap;
	module.exports = exports["default"];

/***/ },

/***/ 533:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _classCallCheck2 = __webpack_require__(119);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Get whitespace around tokens.
	 */
	
	var Whitespace = function () {
	  function Whitespace(tokens) {
	    (0, _classCallCheck3.default)(this, Whitespace);
	
	    this.tokens = tokens;
	    this.used = {};
	  }
	
	  /**
	   * Count all the newlines before a node.
	   */
	
	  Whitespace.prototype.getNewlinesBefore = function getNewlinesBefore(node) {
	    var startToken = void 0;
	    var endToken = void 0;
	    var tokens = this.tokens;
	
	    var index = this._findToken(function (token) {
	      return token.start - node.start;
	    }, 0, tokens.length);
	    if (index >= 0) {
	      while (index && node.start === tokens[index - 1].start) {
	        --index;
	      }startToken = tokens[index - 1];
	      endToken = tokens[index];
	    }
	
	    return this._getNewlinesBetween(startToken, endToken);
	  };
	
	  /**
	   * Count all the newlines after a node.
	   */
	
	  Whitespace.prototype.getNewlinesAfter = function getNewlinesAfter(node) {
	    var startToken = void 0;
	    var endToken = void 0;
	    var tokens = this.tokens;
	
	    var index = this._findToken(function (token) {
	      return token.end - node.end;
	    }, 0, tokens.length);
	    if (index >= 0) {
	      while (index && node.end === tokens[index - 1].end) {
	        --index;
	      }startToken = tokens[index];
	      endToken = tokens[index + 1];
	      if (endToken.type.label === ",") endToken = tokens[index + 2];
	    }
	
	    if (endToken && endToken.type.label === "eof") {
	      return 1;
	    } else {
	      return this._getNewlinesBetween(startToken, endToken);
	    }
	  };
	
	  /**
	   * Count all the newlines between two tokens.
	   */
	
	  Whitespace.prototype._getNewlinesBetween = function _getNewlinesBetween(startToken, endToken) {
	    if (!endToken || !endToken.loc) return 0;
	
	    var start = startToken ? startToken.loc.end.line : 1;
	    var end = endToken.loc.start.line;
	    var lines = 0;
	
	    for (var line = start; line < end; line++) {
	      if (typeof this.used[line] === "undefined") {
	        this.used[line] = true;
	        lines++;
	      }
	    }
	
	    return lines;
	  };
	
	  /**
	   * Find a token between start and end.
	   */
	
	  Whitespace.prototype._findToken = function _findToken(test, start, end) {
	    if (start >= end) return -1;
	    var middle = start + end >>> 1;
	    var match = test(this.tokens[middle]);
	    if (match < 0) {
	      return this._findToken(test, middle + 1, end);
	    } else if (match > 0) {
	      return this._findToken(test, start, middle);
	    } else if (match === 0) {
	      return middle;
	    }
	    return -1;
	  };
	
	  return Whitespace;
	}();
	
	exports.default = Whitespace;
	module.exports = exports["default"];

/***/ },

/***/ 534:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(102), __esModule: true };

/***/ },

/***/ 535:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(40), __esModule: true };

/***/ },

/***/ 536:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(66), __esModule: true };

/***/ },

/***/ 537:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(41), __esModule: true };

/***/ },

/***/ 538:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(26), __esModule: true };

/***/ },

/***/ 539:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(803), __esModule: true };

/***/ },

/***/ 540:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(536);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(535);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(238);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }
	
	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },

/***/ 541:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(238);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },

/***/ 803:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(204);
	__webpack_require__(144);
	__webpack_require__(835);
	module.exports = __webpack_require__(11).WeakSet;

/***/ },

/***/ 835:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var weak = __webpack_require__(402);
	
	// 23.4 WeakSet Objects
	__webpack_require__(271)('WeakSet', function(get){
	  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.4.3.1 WeakSet.prototype.add(value)
	  add: function add(value){
	    return weak.def(this, value, true);
	  }
	}, weak, false, true);

/***/ },

/***/ 840:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var repeating = __webpack_require__(1107);
	
	// detect either spaces or tabs but not both to properly handle tabs
	// for indentation and spaces for alignment
	var INDENT_RE = /^(?:( )+|\t+)/;
	
	function getMostUsed(indents) {
		var result = 0;
		var maxUsed = 0;
		var maxWeight = 0;
	
		for (var n in indents) {
			var indent = indents[n];
			var u = indent[0];
			var w = indent[1];
	
			if (u > maxUsed || u === maxUsed && w > maxWeight) {
				maxUsed = u;
				maxWeight = w;
				result = +n;
			}
		}
	
		return result;
	}
	
	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}
	
		// used to see if tabs or spaces are the most used
		var tabs = 0;
		var spaces = 0;
	
		// remember the size of previous line's indentation
		var prev = 0;
	
		// remember how many indents/unindents as occurred for a given size
		// and how much lines follow a given indentation
		//
		// indents = {
		//    3: [1, 0],
		//    4: [1, 5],
		//    5: [1, 0],
		//   12: [1, 0],
		// }
		var indents = {};
	
		// pointer to the array of last used indent
		var current;
	
		// whether the last action was an indent (opposed to an unindent)
		var isIndent;
	
		str.split(/\n/g).forEach(function (line) {
			if (!line) {
				// ignore empty lines
				return;
			}
	
			var indent;
			var matches = line.match(INDENT_RE);
	
			if (!matches) {
				indent = 0;
			} else {
				indent = matches[0].length;
	
				if (matches[1]) {
					spaces++;
				} else {
					tabs++;
				}
			}
	
			var diff = indent - prev;
			prev = indent;
	
			if (diff) {
				// an indent or unindent has been detected
	
				isIndent = diff > 0;
	
				current = indents[isIndent ? diff : -diff];
	
				if (current) {
					current[0]++;
				} else {
					current = indents[diff] = [1, 0];
				}
			} else if (current) {
				// if the last action was an indent, increment the weight
				current[1] += +isIndent;
			}
		});
	
		var amount = getMostUsed(indents);
	
		var type;
		var actual;
		if (!amount) {
			type = null;
			actual = '';
		} else if (spaces >= tabs) {
			type = 'space';
			actual = repeating(' ', amount);
		} else {
			type = 'tab';
			actual = repeating('\t', amount);
		}
	
		return {
			amount: amount,
			type: type,
			indent: actual
		};
	};


/***/ },

/***/ 925:
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;
	
	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = end > length ? length : end;
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;
	
	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}
	
	module.exports = baseSlice;


/***/ },

/***/ 930:
/***/ function(module, exports, __webpack_require__) {

	var baseSlice = __webpack_require__(925);
	
	/**
	 * Casts `array` to a slice if it's needed.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {number} start The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the cast slice.
	 */
	function castSlice(array, start, end) {
	  var length = array.length;
	  end = end === undefined ? length : end;
	  return (!start && end >= length) ? array : baseSlice(array, start, end);
	}
	
	module.exports = castSlice;


/***/ },

/***/ 931:
/***/ function(module, exports, __webpack_require__) {

	var baseIndexOf = __webpack_require__(305);
	
	/**
	 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
	 * that is not found in the character symbols.
	 *
	 * @private
	 * @param {Array} strSymbols The string symbols to inspect.
	 * @param {Array} chrSymbols The character symbols to find.
	 * @returns {number} Returns the index of the last unmatched string symbol.
	 */
	function charsEndIndex(strSymbols, chrSymbols) {
	  var index = strSymbols.length;
	
	  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	  return index;
	}
	
	module.exports = charsEndIndex;


/***/ },

/***/ 983:
/***/ function(module, exports) {

	/** Used to compose unicode character classes. */
	var rsAstralRange = '\\ud800-\\udfff',
	    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
	    rsComboSymbolsRange = '\\u20d0-\\u20f0',
	    rsVarRange = '\\ufe0e\\ufe0f';
	
	/** Used to compose unicode capture groups. */
	var rsAstral = '[' + rsAstralRange + ']',
	    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
	    rsFitz = '\\ud83c[\\udffb-\\udfff]',
	    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
	    rsNonAstral = '[^' + rsAstralRange + ']',
	    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
	    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
	    rsZWJ = '\\u200d';
	
	/** Used to compose unicode regexes. */
	var reOptMod = rsModifier + '?',
	    rsOptVar = '[' + rsVarRange + ']?',
	    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
	    rsSeq = rsOptVar + reOptMod + rsOptJoin,
	    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
	
	/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
	var reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
	
	/**
	 * Converts `string` to an array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function stringToArray(string) {
	  return string.match(reComplexSymbol);
	}
	
	module.exports = stringToArray;


/***/ },

/***/ 989:
/***/ function(module, exports, __webpack_require__) {

	var createFind = __webpack_require__(455),
	    findLastIndex = __webpack_require__(990);
	
	/**
	 * This method is like `_.find` except that it iterates over elements of
	 * `collection` from right to left.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.0.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to search.
	 * @param {Function} [predicate=_.identity]
	 *  The function invoked per iteration.
	 * @param {number} [fromIndex=collection.length-1] The index to search from.
	 * @returns {*} Returns the matched element, else `undefined`.
	 * @example
	 *
	 * _.findLast([1, 2, 3, 4], function(n) {
	 *   return n % 2 == 1;
	 * });
	 * // => 3
	 */
	var findLast = createFind(findLastIndex);
	
	module.exports = findLast;


/***/ },

/***/ 990:
/***/ function(module, exports, __webpack_require__) {

	var baseFindIndex = __webpack_require__(303),
	    baseIteratee = __webpack_require__(69),
	    toInteger = __webpack_require__(111);
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeMin = Math.min;
	
	/**
	 * This method is like `_.findIndex` except that it iterates over elements
	 * of `collection` from right to left.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.0.0
	 * @category Array
	 * @param {Array} array The array to search.
	 * @param {Function} [predicate=_.identity]
	 *  The function invoked per iteration.
	 * @param {number} [fromIndex=array.length-1] The index to search from.
	 * @returns {number} Returns the index of the found element, else `-1`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'active': true },
	 *   { 'user': 'fred',    'active': false },
	 *   { 'user': 'pebbles', 'active': false }
	 * ];
	 *
	 * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
	 * // => 2
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.findLastIndex(users, { 'user': 'barney', 'active': true });
	 * // => 0
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.findLastIndex(users, ['active', false]);
	 * // => 2
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.findLastIndex(users, 'active');
	 * // => 0
	 */
	function findLastIndex(array, predicate, fromIndex) {
	  var length = array ? array.length : 0;
	  if (!length) {
	    return -1;
	  }
	  var index = length - 1;
	  if (fromIndex !== undefined) {
	    index = toInteger(fromIndex);
	    index = fromIndex < 0
	      ? nativeMax(length + index, 0)
	      : nativeMin(index, length - 1);
	  }
	  return baseFindIndex(array, baseIteratee(predicate, 3), index, true);
	}
	
	module.exports = findLastIndex;


/***/ },

/***/ 998:
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(111);
	
	/**
	 * Checks if `value` is an integer.
	 *
	 * **Note:** This method is based on
	 * [`Number.isInteger`](https://mdn.io/Number/isInteger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
	 * @example
	 *
	 * _.isInteger(3);
	 * // => true
	 *
	 * _.isInteger(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isInteger(Infinity);
	 * // => false
	 *
	 * _.isInteger('3');
	 * // => false
	 */
	function isInteger(value) {
	  return typeof value == 'number' && value == toInteger(value);
	}
	
	module.exports = isInteger;


/***/ },

/***/ 999:
/***/ function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(105),
	    baseIteratee = __webpack_require__(69),
	    baseMap = __webpack_require__(447),
	    isArray = __webpack_require__(12);
	
	/**
	 * Creates an array of values by running each element in `collection` thru
	 * `iteratee`. The iteratee is invoked with three arguments:
	 * (value, index|key, collection).
	 *
	 * Many lodash methods are guarded to work as iteratees for methods like
	 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
	 *
	 * The guarded methods are:
	 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
	 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
	 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
	 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 * @example
	 *
	 * function square(n) {
	 *   return n * n;
	 * }
	 *
	 * _.map([4, 8], square);
	 * // => [16, 64]
	 *
	 * _.map({ 'a': 4, 'b': 8 }, square);
	 * // => [16, 64] (iteration order is not guaranteed)
	 *
	 * var users = [
	 *   { 'user': 'barney' },
	 *   { 'user': 'fred' }
	 * ];
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.map(users, 'user');
	 * // => ['barney', 'fred']
	 */
	function map(collection, iteratee) {
	  var func = isArray(collection) ? arrayMap : baseMap;
	  return func(collection, baseIteratee(iteratee, 3));
	}
	
	module.exports = map;


/***/ },

/***/ 1013:
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(307),
	    castSlice = __webpack_require__(930),
	    charsEndIndex = __webpack_require__(931),
	    stringToArray = __webpack_require__(983),
	    toString = __webpack_require__(152);
	
	/** Used to match leading and trailing whitespace. */
	var reTrimEnd = /\s+$/;
	
	/**
	 * Removes trailing whitespace or specified characters from `string`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category String
	 * @param {string} [string=''] The string to trim.
	 * @param {string} [chars=whitespace] The characters to trim.
	 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	 * @returns {string} Returns the trimmed string.
	 * @example
	 *
	 * _.trimEnd('  abc  ');
	 * // => '  abc'
	 *
	 * _.trimEnd('-_-abc-_-', '_-');
	 * // => '-_-abc'
	 */
	function trimEnd(string, chars, guard) {
	  string = toString(string);
	  if (string && (guard || chars === undefined)) {
	    return string.replace(reTrimEnd, '');
	  }
	  if (!string || !(chars = baseToString(chars))) {
	    return string;
	  }
	  var strSymbols = stringToArray(string),
	      end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
	
	  return castSlice(strSymbols, 0, end).join('');
	}
	
	module.exports = trimEnd;


/***/ },

/***/ 1107:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var isFinite = __webpack_require__(148);
	
	module.exports = function (str, n) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string as the first argument');
		}
	
		if (n < 0 || !isFinite(n)) {
			throw new TypeError('Expected a finite positive number');
		}
	
		var ret = '';
	
		do {
			if (n & 1) {
				ret += str;
			}
	
			str += str;
		} while (n = n >> 1);
	
		return ret;
	};


/***/ }

});