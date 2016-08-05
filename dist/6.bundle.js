webpackJsonp([6],{

/***/ 443:
/*!*********************************!*\
  !*** ./~/horchata/lib/index.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.registerPluginModule = exports.registerPlugin = exports.whitespace = exports.tokComments = exports.Token = exports.Lexer = exports.codePointToString = exports.contextTypes = exports.TokContext = exports.keywordTypes = exports.tokTypes = exports.TokenType = exports.version = exports.name = undefined;
	
	var _package = __webpack_require__(/*! ../package.json */ 442);
	
	Object.defineProperty(exports, "name", {
	  enumerable: true,
	  get: function get() {
	    return _package.name;
	  }
	});
	Object.defineProperty(exports, "version", {
	  enumerable: true,
	  get: function get() {
	    return _package.version;
	  }
	});
	
	var _types = __webpack_require__(/*! ./lexer/types */ 444);
	
	Object.defineProperty(exports, "TokenType", {
	  enumerable: true,
	  get: function get() {
	    return _types.TokenType;
	  }
	});
	Object.defineProperty(exports, "tokTypes", {
	  enumerable: true,
	  get: function get() {
	    return _types.types;
	  }
	});
	Object.defineProperty(exports, "keywordTypes", {
	  enumerable: true,
	  get: function get() {
	    return _types.keywords;
	  }
	});
	
	var _contextTypes = __webpack_require__(/*! ./lexer/context-types */ 446);
	
	Object.defineProperty(exports, "TokContext", {
	  enumerable: true,
	  get: function get() {
	    return _contextTypes.TokContext;
	  }
	});
	Object.defineProperty(exports, "contextTypes", {
	  enumerable: true,
	  get: function get() {
	    return _contextTypes.types;
	  }
	});
	
	var _identifier = __webpack_require__(/*! ./util/identifier */ 447);
	
	Object.defineProperty(exports, "codePointToString", {
	  enumerable: true,
	  get: function get() {
	    return _identifier.codePointToString;
	  }
	});
	
	var _lexer = __webpack_require__(/*! ./lexer */ 450);
	
	Object.defineProperty(exports, "Token", {
	  enumerable: true,
	  get: function get() {
	    return _lexer.Token;
	  }
	});
	exports.parse = parse;
	exports.lex = lex;
	
	var _plugin = __webpack_require__(/*! ./plugin */ 465);
	
	Object.defineProperty(exports, "registerPlugin", {
	  enumerable: true,
	  get: function get() {
	    return _plugin.registerPlugin;
	  }
	});
	Object.defineProperty(exports, "registerPluginModule", {
	  enumerable: true,
	  get: function get() {
	    return _plugin.registerPluginModule;
	  }
	});
	
	__webpack_require__(/*! ./lexer/context */ 622);
	
	__webpack_require__(/*! ./lexer/indentation */ 623);
	
	__webpack_require__(/*! ./lexer/serialization */ 498);
	
	var _lexer2 = _interopRequireDefault(_lexer);
	
	var _comments = __webpack_require__(/*! ./lexer/comments */ 464);
	
	var _tokComments = _interopRequireWildcard(_comments);
	
	var _whitespace2 = __webpack_require__(/*! ./util/whitespace.js */ 451);
	
	var _whitespace = _interopRequireWildcard(_whitespace2);
	
	var _file = __webpack_require__(/*! ./file */ 474);
	
	var _file2 = _interopRequireDefault(_file);
	
	var _parser = __webpack_require__(/*! ./parser */ 467);
	
	var _parser2 = _interopRequireDefault(_parser);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.Lexer = _lexer2.default;
	exports.tokComments = _tokComments;
	exports.whitespace = _whitespace;
	
	// Main API
	
	// The main interface is a `parse` function that takes a code string and
	// returns an abstract syntax tree as specified by [estree]. Additional
	// ast nodes are documented in the doc/ folder.
	//
	// [estree]: https://github.com/estree/estree
	
	function parse(input, options) {
	  return new _parser2.default(options).parse(input);
	}
	
	// TODO: test this function
	function lex(input, options) {
	  var lexer = new _lexer2.default(options);
	  var file = new _file2.default(input, options);
	  lexer.open(file);
	  lexer.nextToken();
	  while (lexer.next()) {}
	  var tokens = lexer.state.tokens;
	  lexer.close();
	  return tokens;
	}
	
	// Plugin API

/***/ },

/***/ 444:
/*!***************************************!*\
  !*** ./~/horchata/lib/lexer/types.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.types = exports.keywords = exports.TokenType = undefined;
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 445);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	// ## Token types
	
	// The assignment of fine-grained, information-carrying type objects
	// allows the tokenizer to store the information it has about a
	// token in a way that is very cheap for the parser to look up.
	
	// All keyword token type variables start with an underscore, to make them
	// easy to recognize.
	
	// The `beforeExpr` property is used to disambiguate between regular
	// expressions and divisions. It is set on all token types that can
	// be followed by an expression (thus, a slash after them would be a
	// regular expression). See [`context.js`](./context.js).
	//
	// The `continuesExpr` property is also used to disambiguate
	// whether or not a newline must be escaped to continue an expression,
	// and if extended indentation is required to continue an expression
	// in statement headers like `if` and `while`.
	//
	// The `startsExpr` property is used to indicate when a token starts
	// any type of expression statement. See [`context.js`](./context.js).
	//
	// `isLoop` marks a keyword as starting a loop, which is important
	// to know when parsing a label, in order to allow or disallow
	// continue jumps to that label.
	//
	// `continuesPreviousLine` marks a token that, if it is the first token in a
	// new line, preceding newlines and indents are ignored (indents still must
	// be consistent)
	// TODO: add consistent lookahead for continuesPreviousLine.
	
	var TokenType = exports.TokenType = function () {
	  function TokenType(label, alias) {
	    var conf = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	    (0, _classCallCheck3.default)(this, TokenType);
	
	    // metadata
	    this.label = label;
	    this.alias = alias; // esprima style token name
	    this.keyword = conf.keyword;
	    this.code = conf.code;
	    this.babylonName = conf.babylonName;
	    this.estreeValue = conf.estreeValue || null;
	
	    // parsing
	    this.beforeExpr = !!conf.beforeExpr;
	    this.continuesExpr = !!conf.continuesExpr;
	    this.startsExpr = !!conf.startsExpr;
	    this.startsStmt = !!conf.startsStmt;
	    this.startsArguments = !!conf.startsArguments;
	    this.continuesPreviousLine = !!conf.continuesPreviousLine;
	    // operator precedence parsing
	    this.rightAssociative = !!conf.rightAssociative;
	    this.isLoop = !!conf.isLoop;
	    this.isAssign = !!conf.isAssign;
	    this.prefix = !!conf.prefix;
	    this.postfix = !!conf.postfix;
	    this.binop = conf.binop || null;
	    // TODO: allow specifiying custom binops via plugins, that can plug into the OPP
	    this.binopRequiresPlugin = conf.binopRequiresPlugin || false;
	    if (this.binop != null) this.binopExpressionName = conf.binopExpressionName || "BinaryExpression";
	    this.updateContext = null;
	
	    // serialization
	    this.forceSpaceWhenAfter = {};
	    this.formattingSpaceAfter = false;
	    this.formattingSpaceWhenAfter = {};
	  }
	
	  TokenType.prototype.toCode = function toCode(token) {
	    return "" + (this.code || token.value);
	  };
	
	  return TokenType;
	}();
	
	function binop(name, prec) {
	  return new TokenType(name, "Punctuator", { beforeExpr: true, continuesExpr: true, binop: prec });
	}
	function punctuator(name, conf) {
	  return new TokenType(name, "Punctuator", conf);
	}
	
	// Map keyword names to token types.
	var keywords = exports.keywords = {};
	
	// Succinct definitions of keyword token types
	var kw = function kw(name) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var alias = arguments.length <= 2 || arguments[2] === undefined ? "Keyword" : arguments[2];
	
	  options.keyword = name;
	  options.code = name;
	  var type = new TokenType(name, alias, options);
	  keywords[name] = type;
	  return type;
	};
	var beforeExpr = { beforeExpr: true },
	    startsExpr = { startsExpr: true },
	    startsStmt = { startsStmt: true },
	    continuesPreviousLine = { continuesPreviousLine: true },
	    loopHeader = { beforeExpr: true, startsExpr: true, isLoop: true };
	
	var types = exports.types = {
	  num: new TokenType("num", "NumericLiteral", startsExpr),
	  // value in format {}
	  regexp: new TokenType("regexp", "RegularExpressionLiteral", startsExpr),
	  string: new TokenType("string", "StringLiteral", startsExpr),
	  name: new TokenType("name", "IdentifierName", startsExpr),
	
	  eof: new TokenType("eof", "EOF"),
	  unknown: new TokenType("unknown"), // for fixed lookahead
	  tab: new TokenType("tab", "WhiteSpaceLeading"),
	  indent: new TokenType("indent", "Indent"),
	  dedent: new TokenType("dedent", "Dedent"),
	  whitespace: new TokenType("whitespace", "WhiteSpace"),
	  newline: new TokenType("newline", "LineTerminator", { beforeExpr: true, continuesExpr: true }),
	
	  blockCommentStart: new TokenType("#*", "CommentHead"),
	  blockCommentBody: new TokenType("blockcomment", "CommentBody"),
	  blockCommentEnd: new TokenType("*#", "CommentTail"),
	  lineCommentStart: new TokenType("#", "CommentHead"),
	  lineCommentBody: new TokenType("linecomment", "CommentBody"),
	
	  // Punctuation token types.
	  bracketL: punctuator("[", { beforeExpr: true, startsExpr: true }),
	  bracketR: punctuator("]"),
	  braceL: punctuator("{", { beforeExpr: true, startsExpr: true }),
	  braceR: punctuator("}"),
	  parenL: punctuator("(", { beforeExpr: true, startsExpr: true }),
	  parenR: punctuator(")"),
	  comma: punctuator(",", beforeExpr),
	  semi: punctuator(";", { beforeExpr: true, continuesExpr: true }), // double semicolons are used like single semicolons.
	  doublesemi: punctuator(";;", beforeExpr), // single semicolons are used for sequence expressions in tacoscript
	  colon: punctuator(":", { beforeExpr: true, continuesExpr: true }),
	  doubleColon: punctuator("::", { beforeExpr: true, continuesExpr: true }),
	  dot: punctuator(".", continuesPreviousLine),
	
	  // TODO: ? is a null coalescing operator, like c#. Also used by flow
	  question: punctuator("?", { beforeExpr: true, continuesExpr: true }), // only used by flow
	  // TODO: ?., ?[ are soak coalescing prop access operators, like coffeescript
	  soak: punctuator("?.", continuesPreviousLine),
	  soakBracketL: punctuator("?[", continuesPreviousLine),
	  // TODO: ?(, ?! is the soak coalescing call operators, like coffeescript
	  soakParenL: punctuator("?(", { beforeExpr: true, startsExpr: true }),
	  interrobang: punctuator("?!", { beforeExpr: true, startsExpr: true }),
	
	  // also includes =>>, ->, ->>, +>, +>>, +=>, +=>>
	  arrow: punctuator("=>", { beforeExpr: true, startsExpr: true }),
	  ellipsis: punctuator("...", beforeExpr),
	
	  template: new TokenType("template", "Template"),
	  backQuote: punctuator("`", startsExpr),
	  dollarBraceL: punctuator("${", { beforeExpr: true, startsExpr: true, continuesExpr: true }),
	  at: punctuator("@"),
	  excl: punctuator("!", { beforeExpr: true, startsExpr: true, startsArguments: true }),
	
	  // Operators. These carry several kinds of properties to help the
	  // parser use them properly (the presence of these properties is
	  // what categorizes them as operators).
	  //
	  // `binop`, when present, specifies that this operator is a binary
	  // operator, and will refer to its precedence.
	  //
	  // `prefix` and `postfix` mark the operator as a prefix or postfix
	  // unary operator.
	  //
	  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
	  // binary operators with a very low precedence, that should result
	  // in AssignmentExpression nodes.
	
	  eq: punctuator("=", { beforeExpr: true, continuesExpr: true, isAssign: true }),
	  assign: punctuator("_=", { beforeExpr: true, continuesExpr: true, isAssign: true }),
	  incDec: punctuator("++/--", { prefix: true, postfix: true, startsExpr: true }),
	  bitwiseNOT: punctuator("~", { beforeExpr: true, continuesExpr: true, prefix: true, startsExpr: true, babylonName: "prefix" }),
	  _not: kw("not", { beforeExpr: true, continuesExpr: true, prefix: true, startsExpr: true, babylonName: "prefix", estreeValue: "!" }),
	  _or: kw("or", { binop: 1, beforeExpr: true, continuesExpr: true, binopExpressionName: "LogicalExpression", babylonName: "logicalOR", estreeValue: "||" }),
	  _and: kw("and", { binop: 2, beforeExpr: true, continuesExpr: true, binopExpressionName: "LogicalExpression", babylonName: "logicalAND", estreeValue: "&&" }),
	  bitwiseOR: binop("|", 3),
	  bitwiseXOR: binop("^", 4),
	  bitwiseAND: binop("&", 5),
	  // Either form of equality (is/isnt/like/unlike or ===/!==/==/!=) are parsable,
	  // but one or the other is always generated. is/isnt/like/unlike is the default.
	  // TODO: throw an error when mixing types.
	  _is: kw("is", { binop: 6, beforeExpr: true, continuesExpr: true, babylonName: "equality", estreeValue: "===" }),
	  _isnt: kw("isnt", { binop: 6, beforeExpr: true, continuesExpr: true, babylonName: "equality", estreeValue: "!==" }),
	  _like: kw("like", { binop: 6, beforeExpr: true, continuesExpr: true, babylonName: "equality", estreeValue: "==" }),
	  _unlike: kw("unlike", { binop: 6, beforeExpr: true, continuesExpr: true, babylonName: "equality", estreeValue: "!=" }),
	  equality: binop("==", 6),
	  relational: binop("</>", 7),
	  _in: kw("in", { binop: 7, beforeExpr: true, continuesExpr: true }),
	  _instanceof: kw("instanceof", { binop: 7, beforeExpr: true, continuesExpr: true }),
	  bitShift: binop("<</>>", 8),
	  plusMin: punctuator("+/-", { binop: 9, beforeExpr: true, continuesExpr: true, prefix: true, startsExpr: true }),
	  modulo: binop("%", 10),
	  positiveModulo: binop("%%", 10), // See lydell/frappe '"useful" modulo'
	  star: binop("*", 10),
	  slash: binop("/", 10),
	  exponent: punctuator("**", { binop: 11, beforeExpr: true, continuesExpr: true, rightAssociative: true })
	};
	
	kw = function kw(name) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var alias = arguments.length <= 2 || arguments[2] === undefined ? "Keyword" : arguments[2];
	
	  options.keyword = name;
	  options.code = name;
	  var type = new TokenType(name, alias, options);
	  types["_" + name] = keywords[name] = type;
	};
	
	kw("typeof", { beforeExpr: true, continuesExpr: true, prefix: true, startsExpr: true });
	kw("void", { beforeExpr: true, continuesExpr: true, prefix: true, startsExpr: true });
	kw("delete", { beforeExpr: true, continuesExpr: true, prefix: true, startsExpr: true });
	// declarations
	kw("var", startsStmt);
	kw("let", startsStmt);
	kw("const", startsStmt);
	kw("extern", startsStmt);
	kw("function", startsStmt); // startsExpr // in tacoscript, function is only used as a declaration
	// control flow
	kw("then", { beforeExpr: true, continuesExpr: true, startsExpr: true });
	kw("if", { beforeExpr: true, continuesExpr: true, startsExpr: true });
	kw("else", { beforeExpr: true, startsExpr: true });
	kw("switch", { beforeExpr: true, continuesExpr: true, startsExpr: true });
	kw("case", beforeExpr);
	kw("default", beforeExpr);
	// iteration
	kw("for", loopHeader);
	kw("update", { beforeExpr: true, continuesExpr: true, startsExpr: true });
	kw("upto", { beforeExpr: true, continuesExpr: true, startsExpr: true });
	kw("downto", { beforeExpr: true, continuesExpr: true, startsExpr: true });
	kw("while", loopHeader);
	kw("do", loopHeader);
	kw("continue", startsStmt);
	kw("break", startsStmt);
	kw("return", { beforeExpr: true, startsStmt: true });
	kw("of", beforeExpr); // TODO: add binop via plugin for `contains`
	// exceptions
	kw("throw", { beforeExpr: true, startsStmt: true });
	kw("try", startsStmt);
	kw("catch");
	kw("finally");
	// blocks
	kw("with", { beforeExpr: true, continuesExpr: true, startsStmt: true });
	// expression modifiers
	kw("new", { beforeExpr: true, continuesExpr: true, startsExpr: true });
	kw("yield", { beforeExpr: true, startsExpr: true });
	kw("await", { beforeExpr: true, startsExpr: true });
	// classes
	kw("static", { continuesExpr: true });
	kw("class", startsStmt);
	kw("extends", beforeExpr);
	kw("private");
	kw("protected");
	kw("public");
	kw("get", { continuesExpr: true });
	kw("set", { continuesExpr: true });
	// modules
	kw("export", { continuesExpr: true });
	kw("import", { continuesExpr: true });
	kw("from", { continuesExpr: true });
	kw("as", { continuesExpr: true }); // NOTE: not included in es2016 keywords
	// special types
	kw("null", startsExpr, "NullLiteral");
	kw("true", startsExpr, "BooleanLiteral");
	kw("false", startsExpr, "BooleanLiteral");
	kw("this", startsExpr);
	kw("super", startsExpr);
	
	kw("debugger", startsStmt);
	kw("pass", startsStmt);

/***/ },

/***/ 445:
/*!**************************************************************!*\
  !*** ./~/horchata/~/babel-runtime/helpers/classCallCheck.js ***!
  \**************************************************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },

/***/ 446:
/*!***********************************************!*\
  !*** ./~/horchata/lib/lexer/context-types.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.types = exports.TokContext = undefined;
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 445);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var TokContext = exports.TokContext = function TokContext(token, isExpr, preserveSpace, override) {
	  (0, _classCallCheck3.default)(this, TokContext);
	
	  this.token = token;
	  this.isExpr = !!isExpr;
	  this.preserveSpace = !!preserveSpace;
	  this.override = override;
	};
	
	// TODO: document context types and reason(s) for needing a new context for each
	
	
	var types = exports.types = {
	  stmt: new TokContext("statement", false),
	  decl_expr: new TokContext("var", true),
	  return_expr: new TokContext("return", true),
	  obj_expr: new TokContext("{", true),
	  tmpl_expr: new TokContext("${", true),
	  // implicit parenthises for keyword block starters
	  stmt_head: new TokContext("keyword", false),
	  paren_expr: new TokContext("(", true),
	  tmpl_str: new TokContext("`", true, true, function (lexer) {
	    return lexer.readTmplToken();
	  }),
	  func_expr: new TokContext("function", true)
	};

/***/ },

/***/ 447:
/*!*******************************************!*\
  !*** ./~/horchata/lib/util/identifier.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.keywords = exports.reservedWords = undefined;
	exports.isIdentifierStart = isIdentifierStart;
	exports.isIdentifierChar = isIdentifierChar;
	exports.codePointToString = codePointToString;
	
	var _identifierStartData = __webpack_require__(/*! ./_identifierStartData */ 448);
	
	var _identifierContData = __webpack_require__(/*! ./_identifierContData */ 449);
	
	var _types = __webpack_require__(/*! ../lexer/types */ 444);
	
	// ## Keywords & reserved words
	// Other than eval and arguments, all of these words are treated as keywords in
	// tacoscript, and when used (in a valid context) as a variable name
	// (identifier), will have the prefix `\$`
	
	/*
	 * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	// These two files are autogenerated by packages/horchata/bin/generate-identifier-regex.js
	
	// regarding the codes:
	// These are a run-length and offset encoded representation of the
	// >0xffff code points that are a valid part of identifiers. The
	// offset starts at 0x10000, and each pair of numbers represents an
	// offset to the next range, and then a size of the range. They were
	// generated by tools/generate-identifier-regex.js
	var reservedWords = exports.reservedWords = {
	  es2015: ["enum", "await"],
	  strict: ["implements", "interface", "let", "package", "private", "protected", "public", "static", "yield"],
	  strictBind: ["eval", "arguments"],
	  keywords: ["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "with", "true", "false", "instanceof", "typeof", "void", "delete", "new", "in", "this", "let", "const", "class", "extends", "export", "import", "yield", "super"],
	  tacoscript: [] // will be populated below
	};
	
	var keywords = exports.keywords = reservedWords.keywords;
	
	for (var keyword in _types.keywords) {
	  if (keywords.indexOf(keyword) < 0) {
	    reservedWords.tacoscript.push(keyword);
	  }
	}
	
	// ## Character categories
	
	var nonASCIIidentifierStart = new RegExp("[" + _identifierStartData.nonASCIIidentifierStartChars + "]");
	var nonASCIIidentifier = new RegExp("[" + _identifierStartData.nonASCIIidentifierStartChars + _identifierContData.nonASCIIidentifierChars + "]");
	
	// This has a complexity linear to the value of the code. The
	// assumption is that looking up astral identifier characters is
	// rare.
	function isInAstralSet(code, set) {
	  var pos = 0x10000;
	  for (var i = 0; i < set.length; i += 2) {
	    pos += set[i];
	    if (pos > code) return false;
	
	    pos += set[i + 1];
	    if (pos >= code) return true;
	  }
	}
	
	// Test whether a given character code starts an identifier.
	
	function isIdentifierStart(code) {
	  if (code < 65) return code === 36;
	  if (code < 91) return true;
	  if (code < 97) return code === 95;
	  if (code < 123) return true;
	  if (code <= 0xffff) return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
	  return isInAstralSet(code, _identifierStartData.astralIdentifierStartCodes);
	}
	
	// Test whether a given character is part of an identifier.
	
	function isIdentifierChar(code) {
	  if (code < 48) return code === 36;
	  if (code < 58) return true;
	  if (code < 65) return false;
	  if (code < 91) return true;
	  if (code < 97) return code === 95;
	  if (code < 123) return true;
	  if (code <= 0xffff) return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
	  return isInAstralSet(code, _identifierStartData.astralIdentifierStartCodes) || isInAstralSet(code, _identifierContData.astralIdentifierCodes);
	}
	
	function codePointToString(code) {
	  // UTF-16 Decoding
	  if (code <= 0xFFFF) return String.fromCharCode(code);
	  code -= 0x10000;
	  return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00);
	}

/***/ },

/***/ 448:
/*!*****************************************************!*\
  !*** ./~/horchata/lib/util/_identifierStartData.js ***!
  \*****************************************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var nonASCIIidentifierStartChars = exports.nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠ-ࢴऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿕ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞭꞰ-ꞷꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭥꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
	var astralIdentifierStartCodes = exports.astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 17, 26, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 99, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 26, 45, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 785, 52, 76, 44, 33, 24, 27, 35, 42, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 287, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 86, 25, 391, 63, 32, 0, 449, 56, 1288, 921, 103, 110, 18, 195, 2749, 1070, 4050, 582, 8634, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 881, 68, 12, 0, 67, 12, 16481, 1, 3071, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 4149, 196, 1340, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42710, 42, 4148, 12, 221, 3, 5761, 10591, 541];

/***/ },

/***/ 449:
/*!****************************************************!*\
  !*** ./~/horchata/lib/util/_identifierContData.js ***!
  \****************************************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var nonASCIIidentifierChars = exports.nonASCIIidentifierChars = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࣤ-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఃా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ഁ-ഃാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ංඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ູົຼ່-ໍ໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠐-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏ᦰ-ᧀᧈᧉ᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭ᳲ-᳴᳸᳹᷀-᷵᷼-᷿‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯꘠-꘩꙯ꙴ-꙽ꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧꢀꢁꢴ-꣄꣐-꣙꣠-꣱꤀-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︭︳︴﹍-﹏０-９＿";
	var astralIdentifierCodes = exports.astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 1306, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 52, 0, 13, 2, 49, 13, 16, 9, 83, 11, 168, 11, 6, 9, 8, 2, 57, 0, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 316, 19, 13, 9, 214, 6, 3, 8, 112, 16, 16, 9, 82, 12, 9, 9, 535, 9, 20855, 9, 135, 4, 60, 6, 26, 9, 1016, 45, 17, 3, 19723, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 4305, 6, 792618, 239];

/***/ },

/***/ 450:
/*!***************************************!*\
  !*** ./~/horchata/lib/lexer/index.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.Token = undefined;
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 445);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _types = __webpack_require__(/*! ./types */ 444);
	
	var _identifier = __webpack_require__(/*! ../util/identifier */ 447);
	
	var _whitespace = __webpack_require__(/*! ../util/whitespace */ 451);
	
	var _state = __webpack_require__(/*! ./state */ 452);
	
	var _state2 = _interopRequireDefault(_state);
	
	var _options = __webpack_require__(/*! ../options */ 460);
	
	var _location = __webpack_require__(/*! ../util/location */ 459);
	
	var _comments = __webpack_require__(/*! ./comments */ 464);
	
	var _token = __webpack_require__(/*! ./token */ 458);
	
	var _token2 = _interopRequireDefault(_token);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// export {default as Token} from "./token";
	
	var blockCommentJs = _comments.blockCommentMeta['/*']; /*
	                                                        * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	                                                        * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	                                                        *
	                                                        * See LICENSE for full license text
	                                                        */
	
	// TODO: rename to lexer everywhere in the code.
	
	exports.Token = _token2.default;
	
	
	function keywordRegexp(words) {
	  return new RegExp("^(" + words.join("|") + ")$");
	}
	
	/**
	 * The Lexer / Tokenizer. Based on acorn / babylon's tokenizer, with indentation
	 * detection partially based on python, partly handwritten.
	 *
	 * See context.js and indentation.js for methods not directly included here.
	 */
	
	var Lexer = function () {
	  // TODO: move input to parse(), change otions os that it only contains options
	  // that are generic, no options that pertain to the source file
	
	  function Lexer() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    (0, _classCallCheck3.default)(this, Lexer);
	
	    this.options = (0, _options.getOptions)(options);
	
	    // Construct regexes for reserved words, according to settings
	    this.keywordsJs = keywordRegexp([].concat(_identifier.keywords));
	    this.keywords = keywordRegexp([].concat(_identifier.keywords, _identifier.reservedWords.tacoscript));
	    this.reservedWords = keywordRegexp(_identifier.reservedWords.es2015);
	    this.reservedWordsStrict = keywordRegexp([].concat(_identifier.reservedWords.es2015, _identifier.reservedWords.strict));
	    this.reservedWordsStrictBind = keywordRegexp([].concat(_identifier.reservedWords.es2015, _identifier.reservedWords.strict, _identifier.reservedWords.strictBind));
	
	    // These will be populated by `open()`
	    this.file = this.input = this.state = null;
	  }
	
	  Lexer.prototype.raise = function raise(pos, message) {
	    throw new Error(message + " at pos " + pos);
	  };
	
	  Lexer.prototype.assert = function assert(assertion) {
	    if (!assertion) {
	      this.raise(this.state.pos, "Assertion failed");
	    }
	  };
	
	  Lexer.prototype.hasFeature = function hasFeature(featureName) {
	    // equivalent to babylon "hasPlugin"
	    return this.options.features['*'] || this.options.features[featureName];
	  };
	
	  // call this prior to start parsing
	  // TODO: who's responsible for creating the file object?
	
	
	  Lexer.prototype.open = function open(file) {
	    this.file = file;
	    this.input = this.file.input;
	    this.state = new _state2.default();
	    this.state.init(this.options, this.file);
	  };
	
	  Lexer.prototype.close = function close() {
	    this.file = this.input = this.state = null;
	  };
	
	  // TODO: parse hash bang line as comment
	
	  // Retrieve the next token for the parser
	
	
	  Lexer.prototype.next = function next() {
	    this.state.index++;
	
	    return this.nextToken();
	  };
	
	  Lexer.prototype.nextToken = function nextToken() {
	    var token = null;
	    if (this.state.tokens.length <= this.state.index) {
	      token = this.readNextToken();
	    }
	
	    this.state.prev = this.state.cur;
	    this.state.cur = this.state.tokens[this.state.index];
	    if (this.state.tokens.length > this.state.index + 1) {
	      this.state.next = this.state.tokens[this.state.index + 1];
	    } else {
	      this.state.resetNext();
	    }
	    return token;
	  };
	
	  // Read a single token & update the lexer state
	
	
	  Lexer.prototype.readNextToken = function readNextToken() {
	    this.state.prevLexType = this.state.lex.type;
	
	    if (this.state.nextIndentation !== this.state.indentation) {
	      if (this.state.nextIndentation > this.state.indentation) {
	        return this.finishToken(_types.types.indent);
	      } else {
	        if (this.state.prevLexType === _types.types.newline) {
	          return this.finishToken(_types.types.dedent);
	        } else {
	          return this.finishToken(_types.types.newline);
	        }
	      }
	    }
	
	    var curContext = this.curContext();
	    if (curContext == null || !curContext.preserveSpace) {
	      if (this.state.eol && this.state.pos !== this.state.eolPos) {
	        this.skipIndentation();
	      }
	      // newlines are significant, so this only skips comments and non-indentation whitespace
	      this.skipNonTokens();
	    }
	    this.state.containsOctal = false;
	    this.state.octalPosition = null;
	
	    this.startTokenLex();
	
	    if (this.state.pos >= this.input.length) {
	      if (this.state.indentation > 0) {
	        this.state.nextIndentation = 0;
	        return this.finishToken(_types.types.newline);
	      }
	      if (this.state.lex.type !== _types.types.eof || this.state.tokens.length === 0) {
	        return this.finishToken(_types.types.eof);
	      } else {
	        return;
	      }
	    }
	
	    if (curContext.override) return curContext.override(this);else return this.readToken(this.fullCharCodeAtPos());
	  };
	
	  // Read n tokens (usually for lookahead)
	
	
	  Lexer.prototype.readNextTokens = function readNextTokens(count) {
	    for (var i = count; i >= 0; i--) {
	      this.readNextToken();
	    }
	  };
	
	  Lexer.prototype.startTokenLex = function startTokenLex() {
	    this.state.lex.start = this.state.pos;
	    if (this.options.locations) this.state.lex.startLoc = this.state.curPosition();
	  };
	
	  Lexer.prototype.finishTokenLex = function finishTokenLex(type, val) {
	    var lex = this.state.lex;
	    lex.type = type;
	    lex.value = val; // or read value from pos - 1
	    lex.end = this.state.pos;
	    lex.endLoc = this.state.curPosition();
	    lex.index = this.state.tokens.length;
	  };
	
	  // Called at the end of each token. Sets type, val, end, endLoc.
	
	
	  Lexer.prototype.finishToken = function finishToken(type, val) {
	    if (val === undefined) val = type.label;
	    var prevType = this.state.lex.type;
	    this.finishTokenLex(type, val);
	    this.updateContext(type, prevType);
	
	    if (type === _types.types.indent) ++this.state.indentation;else if (type === _types.types.dedent) --this.state.indentation;
	
	    var token = _token2.default.fromState(this.state.lex);
	
	    this.endToken(token);
	
	    // Lookahead to see if the newline should actually be ignored, and ignore it if so
	    if (token.type === _types.types.newline) {
	      var nextToken = this.readNextToken();
	
	      if (nextToken.type.continuesPreviousLine) {
	        // convert newline token to whitespace, for sourceElementsTokens
	        token.type = _types.types.whitespace;
	        token.value = { code: this.input.slice(token.start, token.end) };
	        // TODO: coalesce sequential whitespace sourceElements
	
	        // remove newline from concrete tokens
	        this.assert(this.state.tokens.pop() === nextToken);
	        this.assert(this.state.tokens.pop() === token);
	        this.state.tokens.push(nextToken);
	        token = nextToken;
	        token.meta.continuedPreviousLine = true;
	      }
	    }
	
	    return token;
	  };
	
	  Lexer.prototype.ensureLookahead = function ensureLookahead() {
	    var count = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	
	    var needed = this.state.index + count - (this.state.tokens.length - 1);
	    if (needed > 0) {
	      this.readNextTokens(needed);
	      if (this.state.next.type === _types.types.unknown) {
	        this.state.next = this.state.tokens[this.state.index + 1];
	      }
	    }
	    return true;
	  };
	
	  Lexer.prototype.readToken = function readToken(code) {
	    if (!this.state.eol && (0, _whitespace.isNewline)(code)) {
	      // lookahead to check for indentation change in the next line, if the next char is a newline
	      if (this.hasIndentationChanged(code)) {
	        if (this.state.nextIndentation > this.state.indentation) {
	          return this.finishToken(_types.types.indent);
	        } else {
	          return this.finishToken(_types.types.newline);
	        }
	      }
	    }
	    return this.readConcreteToken(code);
	  };
	
	  Lexer.prototype.readConcreteToken = function readConcreteToken(code) {
	    // Identifier or keyword. '\uXXXX' sequences are allowed in
	    // identifiers, so '\' also dispatches to that.
	    if ((0, _identifier.isIdentifierStart)(code) || code === 92 /* '\' */) {
	        return this.readWord();
	      }
	    return this.getTokenFromCode(code);
	  };
	
	  Lexer.prototype.fullCharCodeAtPos = function fullCharCodeAtPos() {
	    var code = this.input.charCodeAt(this.state.pos);
	    if (code <= 0xd7ff || code > 0xe000) return code; // single char code
	
	    var next = this.input.charCodeAt(this.state.pos + 1);
	    // TODO: figure out how this magic is and document it. from acorn.
	    return (code << 10) + next - 0x35fdc00;
	  };
	
	  // based on acorn's skipSpace
	  // parse & skip whitespace and comments
	
	
	  Lexer.prototype.skipNonTokens = function skipNonTokens() {
	    var _this = this;
	
	    var end = arguments.length <= 0 || arguments[0] === undefined ? this.input.length : arguments[0];
	
	    var storeWhitespace = function storeWhitespace(start, end, startLoc, endLoc) {
	      _this.endNonToken(new _token2.default(_types.types.whitespace, { code: _this.input.slice(start, end) }, start, end, startLoc, endLoc, _this.state));
	    };
	    var start = this.state.pos;
	    var startLoc = this.state.curPosition();
	    while (this.state.pos < end) {
	      var ch = this.input.charCodeAt(this.state.pos);
	      // TODO: see if micro-optimization of order of checking ch is worth it
	
	      // newline characters:  10, 8232, 8233, 13 (when followed by 10)
	      var nextCh = void 0,
	          chIsNewline = void 0;
	      if (ch === 92 && (0, _whitespace.isNewline)(nextCh = this.input.charCodeAt(this.state.pos + 1))) {
	        // skip escaped newlines
	        this.state.pos += nextCh === 13 && this.input.charCodeAt(this.state.pos + 2) === 10 ? 3 : 2;
	        this.state.curLine++;this.state.lineStart = this.state.pos;
	      } else if ((!(chIsNewline = (0, _whitespace.isNewline)(ch)) || this.state.lex && this.state.lex.type.continuesExpr) && (
	      // skip
	      ch === 32 || ch === 160 || ch > 8 && ch < 14 || ch >= 5760 && _whitespace.nonASCIIwhitespace.test(String.fromCharCode(ch)))) {
	        // skip non-significant whitespace
	        ++this.state.pos;
	        if (chIsNewline) {
	          this.state.curLine++;this.state.lineStart = this.state.pos;
	        }
	      } else {
	        if (this.state.pos > start) {
	          storeWhitespace(start, this.state.pos, startLoc, this.state.curPosition());
	        }
	        if (ch === 35) {
	          // '#'
	          var next = this.input.charCodeAt(this.state.pos + 1);
	          if (next === 42 || next === 37) {
	            // '*', '%'
	            this.skipBlockComment();
	          } else if (next === 35 && this.input.charCodeAt(this.state.pos + 2) === 35 && (0, _whitespace.isNewline)(this.input.charCodeAt(this.state.pos + 3))) {
	            this.skipBlockComment(3);
	          } else {
	            this.skipLineComment();
	          }
	          start = this.state.pos;
	          startLoc = this.state.curPosition();
	        } else {
	          break;
	        }
	      }
	    }
	    if (this.state.pos >= end && this.state.pos > start) {
	      storeWhitespace(start, this.state.pos, startLoc, this.state.curPosition());
	    }
	  };
	
	  Lexer.prototype._startCommentNode = function _startCommentNode(loc) {
	    return {
	      type: "",
	      start: this.state.pos,
	      end: 0,
	      tokenStart: this.state.sourceElementsTokens.length,
	      tokenEnd: 0,
	      index: this.state.comments.length,
	      loc: new _location.SourceLocation(this.state, loc)
	    };
	  };
	
	  Lexer.prototype._finishCommentNode = function _finishCommentNode(node, type, loc) {
	    node.type = type;
	    node.end = this.state.pos;
	    node.tokenEnd = this.state.sourceElementsTokens.length;
	    node.loc.end = loc;
	    return node;
	  };
	
	  Lexer.prototype.skipLineComment = function skipLineComment() {
	    var startLength = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	
	    var start = this.state.pos;
	    var startLoc = this.state.curPosition(),
	        endLoc = void 0;
	    var node = this._startCommentNode(startLoc);
	    this.state.pos += startLength;
	    var startKind = this.input.slice(start, this.state.pos);
	    this.endNonToken(new _token2.default(_types.types.lineCommentStart, { kind: startKind, code: startKind, index: node.index }, start, this.state.pos, startLoc, this.state.curPosition(), this.state));
	
	    start = this.state.pos;
	    startLoc = this.state.curPosition();
	    for (var ch; ch = this.input.charCodeAt(this.state.pos), this.state.pos < this.input.length && !(0, _whitespace.isNewline)(ch); ++this.state.pos) {}
	
	    var raw = this.input.slice(start, this.state.pos);
	    var commentBody = raw;
	    if (/ +\*/.test(commentBody)) {
	      commentBody = commentBody.slice(1);
	    }
	    node.value = commentBody;
	    this.endNonToken(new _token2.default(_types.types.lineCommentBody, { kind: startKind, code: raw, value: commentBody, index: node.index }, start, this.state.pos, startLoc, endLoc = this.state.curPosition(), this.state));
	    this.state.comments.push(this._finishCommentNode(node, "CommentLine", endLoc));
	  };
	
	  Lexer.prototype.skipBlockComment = function skipBlockComment() {
	    var startLength = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];
	
	    var start = this.state.pos;
	    var startLoc = this.state.curPosition(),
	        endLoc = void 0;
	    var node = this._startCommentNode(startLoc);
	    this.state.pos += startLength;
	    var commentKind = this.input.slice(start, this.state.pos);
	    var meta = _comments.blockCommentMeta[commentKind];
	    this.endNonToken(new _token2.default(_types.types.blockCommentStart, { kind: commentKind, code: commentKind, index: node.index }, start, this.state.pos, startLoc, this.state.curPosition(), this.state));
	
	    start = this.state.pos;
	    startLoc = this.state.curPosition();
	    var end = this.input.indexOf(meta.terminator, this.state.pos);
	    // TODO: make sure that ending `###` is alone on a line (and starts alone on a line)
	    if (end === -1) this.raise(this.state.pos, "Unterminated comment");
	    this.state.pos = end;
	
	    // properly set curLine
	    _whitespace.lineBreakG.lastIndex = start;
	    var match = void 0;
	    while ((match = _whitespace.lineBreakG.exec(this.input)) && match.index < this.state.pos) {
	      ++this.state.curLine;
	      this.state.lineStart = match.index + match[0].length;
	    }
	    _whitespace.lineBreakG.lastIndex = 0; // reset lineBreakG
	
	    var raw = this.input.slice(start, this.state.pos);
	    var commentBody = raw;
	    // TODO: move to "encode/decode comment" function
	    if (meta.isCanonical) commentBody = commentBody.replace(meta.terminatorEscapeSubRe, meta.terminatorSub);
	    commentBody = node.value = commentBody.replace(blockCommentJs.terminatorSubRe, blockCommentJs.terminatorEscapeSub);
	
	    this.endNonToken(new _token2.default(_types.types.blockCommentBody, { kind: commentKind, code: raw, value: commentBody, index: node.index }, start, this.state.pos, startLoc, this.state.curPosition(), this.state));
	
	    start = this.state.pos;
	    startLoc = this.state.curPosition();
	    this.state.pos += 2;
	    this.endNonToken(new _token2.default(_types.types.blockCommentEnd, { kind: commentKind, code: this.input.slice(start, this.state.pos), index: node.index }, start, this.state.pos, startLoc, endLoc = this.state.curPosition(), this.state));
	
	    if (meta.isCanonical) this.state.comments.push(this._finishCommentNode(node, "CommentBlock", endLoc));
	  };
	
	  Lexer.prototype._isCommentStart = function _isCommentStart(ch, pos) {
	    if (ch === 35) return true; // '#'
	    if (this.state.inModule) return false;
	    var next = this.input.charCodeAt(pos + 1);
	    // <!--
	    if (ch === 60 && next === 33 && this.input.charCodeAt(pos + 2) === 45 && this.input.charCodeAt(pos + 3) === 45) return true;
	    // -->
	    if (ch === 45 && next === 45 && this.input.charCodeAt(pos + 2) === 62) return true;
	    return false;
	  };
	
	  // Simplified version of skipComment for indentation detection
	  // possible optimization: store the locations found here so that this can be done quickly
	
	
	  Lexer.prototype._findCommentEnd = function _findCommentEnd(ch, pos) {
	    var next = this.input.charCodeAt(pos + 1);
	    var isXmlLine = !this.state.inModule && ch !== 35;
	    var blockCommentKind = !isXmlLine && (next === 42 ? "#*" : next === 37 ? "#$" : next === 35 && this.input.charCodeAt(this.state.pos + 2) === 35 && (0, _whitespace.isNewline)(this.input.charCodeAt(this.state.pos + 3)) ? "###" : false);
	    if (blockCommentKind) {
	      var meta = _comments.blockCommentMeta[blockCommentKind];
	      var end = this.input.indexOf(meta.terminator, pos + meta.startLen);
	      // TODO: make sure that ending `###` is alone on a line (and starts alone on a line)
	      if (end === -1) this.raise(pos, "Unterminated comment");
	      pos = end + meta.endLen;
	    } else {
	      _whitespace.lineBreakG.lastIndex = pos;
	      var match = _whitespace.lineBreakG.exec(this.input);
	      pos = match ? match.index : this.input.length;
	      _whitespace.lineBreakG.lastIndex = 0; // reset lineBreakG
	    }
	    return pos;
	  };
	
	  Lexer.prototype.finishArrow = function finishArrow() {
	    var len = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];
	
	    var start = this.state.pos;
	    this.state.pos += len + ~ ~(this.input.charCodeAt(this.state.pos + len) === 62); // =>/=>>
	    return this.finishToken(_types.types.arrow, this.input.slice(start, this.state.pos));
	  };
	
	  Lexer.prototype.finishEqOrType = function finishEqOrType(type) {
	    var start = this.state.pos;
	    ++this.state.pos;
	    var next = this.input.charCodeAt(this.state.pos);
	    if (next === 61) {
	      ++this.state.pos;
	      return this.finishToken(_types.types.eq, this.input.slice(start, this.state.pos));
	    }
	    return this.finishToken(type);
	  };
	
	  // ### Token reading
	
	  // This is the function that is called to fetch the next token. It
	  // is somewhat obscure, because it works in character codes rather
	  // than characters, and because operator parsing has been inlined
	  // into it.
	  //
	  // All in the name of speed. And because it's a little bit more
	  // flexible than regex.
	  //
	
	  // TODO: allow extension of each of these token endpoints to allow custom
	  // multichar tokens.
	
	
	  Lexer.prototype.getTokenFromCode = function getTokenFromCode(code) {
	    switch (code) {
	      // newlines are significant!
	      case 13:
	        if (this.input.charCodeAt(this.state.pos + 1) === 10) {
	          ++this.state.pos;
	        }
	      case 10:case 8232:case 8233:
	        ++this.state.pos;
	        ++this.state.curLine;
	        this.state.lineStart = this.state.pos;
	        return this.finishToken(_types.types.newline);
	
	      // The interpretation of a dot depends on whether it is followed
	      // by a digit or another two dots.
	      case 46:
	        // '.'
	        // TODO: use "readNumberStartingWithDot" (that just calls readNumber, but it's for readability :))
	        return this.readToken_dot();
	
	      // Punctuation tokens.
	      case 40:
	        ++this.state.pos;return this.finishToken(_types.types.parenL); // '('
	      case 41:
	        ++this.state.pos;return this.finishToken(_types.types.parenR); // ')'
	      case 44:
	        ++this.state.pos;return this.finishToken(_types.types.comma); // ','
	      case 91:
	        ++this.state.pos;return this.finishToken(_types.types.bracketL); // '['
	      case 93:
	        ++this.state.pos;return this.finishToken(_types.types.bracketR); // ']'
	      case 123:
	        ++this.state.pos;return this.finishToken(_types.types.braceL); // '{'
	      case 125:
	        ++this.state.pos;return this.finishToken(_types.types.braceR); // '}'
	
	      case 59:
	        return this.readToken_semi(); // ';'
	      case 33:
	        return this.readToken_excl(); // '!'
	
	      case 58:
	        if (this.input.charCodeAt(this.state.pos + 1) === 58) {
	          this.state.pos += 2;
	          return this.finishToken(_types.types.doubleColon, '::');
	        } else {
	          ++this.state.pos;
	          return this.finishToken(_types.types.colon);
	        }
	
	      case 63:
	        ++this.state.pos;return this.finishToken(_types.types.question);
	      // TODO: figure out alternate syntax for 'this' shorthand. Probably `@.`, but no standalone
	      case 64:
	        ++this.state.pos;return this.finishToken(_types.types.at);
	
	      case 96:
	        // '`'
	        ++this.state.pos;
	        return this.finishToken(_types.types.backQuote);
	
	      case 48:
	        // '0'
	        var next = this.input.charCodeAt(this.state.pos + 1);
	        if (next === 120 || next === 88) return this.readRadixNumber(16); // '0x', '0X' - hex number
	        if (next === 111 || next === 79) return this.readRadixNumber(8); // '0o', '0O' - octal number
	        if (next === 98 || next === 66) return this.readRadixNumber(2); // '0b', '0B' - binary number
	      // Anything else beginning with a digit is an integer, octal
	      // number, or float.
	      case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
	        // 1-9
	        return this.readNumber();
	
	      // Quotes produce strings.
	      case 34:case 39:
	        // '"', "'"
	        return this.readString(code);
	
	      // Operators are parsed inline in tiny state machines. '=' (61) is
	      // often referred to. `finishOp` simply skips the amount of
	      // characters it is given as second argument, and returns a token
	      // of the type given by its first argument.
	
	      case 47:
	        // '/'
	        return this.readToken_slash();
	
	      case 37:
	        return this.finishEqOrType(_types.types.modulo); // '%'
	      case 124:
	        return this.finishEqOrType(_types.types.bitwiseOR); // '|'
	      case 38:
	        return this.finishEqOrType(_types.types.bitwiseAND); // '&'
	      case 94:
	        return this.finishEqOrType(_types.types.bitwiseXOR); // '^'
	
	      case 42:
	        return this.readToken_star(); //'*'
	
	      case 43:case 45:
	        // '+-'
	        return this.readToken_plus_min(code);
	
	      case 60:case 62:
	        // '<>'
	        return this.readToken_lt_gt(code);
	
	      case 61:
	        // '='
	        return this.readToken_eq();
	
	      case 126:
	        // '~'
	        ++this.state.pos;
	        return this.finishToken(_types.types.bitwiseNOT);
	    }
	    this.raise(this.state.pos, "Unexpected character '" + (0, _identifier.codePointToString)(code) + "' (" + code + ")");
	  };
	
	  // NOTE: please alphabetize read* functions
	
	  // Read an integer, octal integer, or floating-point number.
	
	
	  Lexer.prototype.readNumber = function readNumber(startsWithDot) {
	    var start = this.state.pos;
	    var isFloat = false;
	    var octal = this.input.charCodeAt(this.state.pos) === 48;
	    if (!startsWithDot && this.readNumber_int(10) === null) this.raise(start, "Invalid number");
	
	    var next = this.input.charCodeAt(this.state.pos);
	    if (next === 46) {
	      // '.'
	      ++this.state.pos;
	      this.readNumber_int(10);
	      isFloat = true;
	      next = this.input.charCodeAt(this.state.pos);
	    }
	    if (next === 69 || next === 101) {
	      // 'eE'
	      next = this.input.charCodeAt(++this.state.pos);
	      if (next === 43 || next === 45) ++this.state.pos; // '+-'
	      if (this.readNumber_int(10) === null) this.raise(start, "Invalid number");
	      isFloat = true;
	    }
	    if ((0, _identifier.isIdentifierStart)(this.fullCharCodeAtPos())) this.raise(this.state.pos, "Identifier directly after number");
	
	    var str = this.input.slice(start, this.state.pos);
	    var val = void 0;
	    if (isFloat) {
	      val = parseFloat(str);
	    } else if (!octal || str.length === 1) {
	      val = parseInt(str, 10);
	    } else if (/[89]/.test(str) || !this.isOctalValid()) {
	      this.raise(start, "Invalid number");
	    } else {
	      val = parseInt(str, 8);
	    }
	    // TODO: also store raw source
	    return this.finishToken(_types.types.num, val);
	  };
	
	  // Read an integer in the given radix. Return null if zero digits
	  // were read, the integer value otherwise. When `len` is given, this
	  // will return `null` unless the integer has exactly `len` digits.
	
	  // Also used for reading escape sequences
	
	
	  Lexer.prototype.readNumber_int = function readNumber_int(radix, len) {
	    var start = this.state.pos;
	    var total = 0;
	    for (var i = 0, end = len == null ? Infinity : len; i < end; ++i) {
	      var code = this.input.charCodeAt(this.state.pos);
	      var val = void 0;
	      if (code >= 97) {
	        val = code - 97 + 10; // a-z
	      } else if (code >= 65) {
	          val = code - 65 + 10; // A-Z
	        } else if (code >= 48 && code <= 57) {
	            val = code - 48; // 0-9
	          } else {
	              val = Infinity;
	            }
	      if (val >= radix) break;
	      ++this.state.pos;
	      total = total * radix + val;
	    }
	    if (this.state.pos === start || len != null && this.state.pos - start !== len) return null;
	
	    return total;
	  };
	
	  Lexer.prototype.readRadixNumber = function readRadixNumber(radix) {
	    this.state.pos += 2; // 0x
	    var val = this.readNumber_int(radix);
	    if (val == null) this.raise(this.state.lex.start + 2, "Expected number in radix " + radix);
	    if ((0, _identifier.isIdentifierStart)(this.fullCharCodeAtPos())) this.raise(this.state.pos, "Identifier directly after number");
	    return this.finishToken(_types.types.num, val);
	  };
	
	  // Read a string value, interpreting backslash-escapes.
	
	  Lexer.prototype.readCodePoint = function readCodePoint() {
	    var ch = this.input.charCodeAt(this.state.pos);
	    var code = void 0;
	
	    if (ch === 123) {
	      var codePos = ++this.state.pos;
	      code = this.readHexChar(this.input.indexOf('}', this.state.pos) - this.state.pos);
	      ++this.state.pos;
	      if (code > 0x10FFFF) this.raise(codePos, "Code point out of bounds");
	    } else {
	      code = this.readHexChar(4);
	    }
	    return code;
	  };
	
	  Lexer.prototype.readRegexp = function readRegexp() {
	    var escaped = void 0,
	        inClass = void 0,
	        start = this.state.pos;
	    for (;;) {
	      if (this.state.pos >= this.input.length) this.raise(start, "Unterminated regular expression");
	      var ch = this.input.charAt(this.state.pos);
	      if (_whitespace.lineBreak.test(ch)) {
	        this.raise(start, "Unterminated regular expression");
	      }
	      if (escaped) {
	        escaped = false;
	      } else {
	        if (ch === "[") {
	          inClass = true;
	        } else if (ch === "]" && inClass) {
	          inClass = false;
	        } else if (ch === "/" && !inClass) {
	          break;
	        }
	        escaped = ch === "\\";
	      }
	      ++this.state.pos;
	    }
	    var pattern = this.input.slice(start, this.state.pos);
	    ++this.state.pos;
	    // Need to use `readWordSingle` because '\uXXXX' sequences are allowed
	    // here (don't ask).
	    var flags = this.readWordSingle(true);
	    if (flags) {
	      var validFlags = /^[gmsiyu]*$/;
	      if (!validFlags.test(flags)) this.raise(start, "Invalid regular expression flag");
	    }
	    return this.finishToken(_types.types.regexp, {
	      pattern: pattern,
	      flags: flags
	    });
	  };
	
	  Lexer.prototype.readString = function readString(quoteChar) {
	    var out = "";
	    var chunkStart = ++this.state.pos;
	    for (;;) {
	      if (this.state.pos >= this.input.length) this.raise(this.state.lex.start, "Unterminated string constant");
	      var ch = this.input.charCodeAt(this.state.pos);
	      if (ch === quoteChar) break;
	      if (ch === 92) {
	        // '\'
	        out += this.input.slice(chunkStart, this.state.pos);
	        out += this.readEscapedChar(false);
	        chunkStart = this.state.pos;
	      } else {
	        if ((0, _whitespace.isNewline)(ch)) this.raise(this.state.lex.start, "Unterminated string constant");
	        ++this.state.pos;
	      }
	    }
	    out += this.input.slice(chunkStart, this.state.pos++);
	    return this.finishToken(_types.types.string, out);
	  };
	
	  Lexer.prototype.readToken_dot = function readToken_dot() {
	    var next = this.input.charCodeAt(this.state.pos + 1);
	    if (next >= 48 && next <= 57) return this.readNumber(true);
	    var nextnext = this.input.charCodeAt(this.state.pos + 2);
	    if (next === 46 && nextnext === 46) {
	      this.state.pos += 3;
	      return this.finishToken(_types.types.ellipsis);
	    } else {
	      ++this.state.pos;
	      return this.finishToken(_types.types.dot);
	    }
	  };
	
	  Lexer.prototype.readToken_eq = function readToken_eq() {
	    var next = this.input.charCodeAt(this.state.pos + 1);
	    if (next === 62) {
	      // '=>'
	      return this.finishArrow();
	    }
	    ++this.state.pos;
	    if (this.finishTokenMaybe_equality("=", next)) return;
	    return this.finishToken(_types.types.eq, "=");
	  };
	
	  Lexer.prototype.readToken_excl = function readToken_excl() {
	    ++this.state.pos;
	    if (this.finishTokenMaybe_equality("!", this.input.charCodeAt(this.state.pos))) return;
	    return this.finishToken(_types.types.excl);
	  };
	
	  Lexer.prototype.finishTokenMaybe_equality = function finishTokenMaybe_equality(prefix, next) {
	    if (next === 61) {
	      if (this.input.charCodeAt(this.state.pos + 1) === 61) {
	        this.state.pos += 2;
	        return this.finishToken(_types.types.equality, prefix + "==");
	      } else {
	        ++this.state.pos;
	        return this.finishToken(_types.types.equality, prefix + "=");
	      }
	    } else {
	      return false;
	    }
	  };
	
	  Lexer.prototype.readToken_lt_gt = function readToken_lt_gt(code) {
	    // '<>'
	    var start = this.state.pos;
	    var next = this.input.charCodeAt(this.state.pos + 1);
	    var size = 1;
	
	    if (next === code) {
	      size = code === 62 && this.input.charCodeAt(this.state.pos + 2) === 62 ? 3 : 2;
	      if (this.input.charCodeAt(this.state.pos + size) === 61) {
	        this.state.pos += size + 1;
	        return this.finishToken(_types.types.assign, this.input.slice(start, this.state.pos));
	      }
	      this.state.pos += size;
	      return this.finishToken(_types.types.bitShift, this.input.slice(start, this.state.pos));
	    }
	
	    if (!this.state.inModule && next === 33 && code === 60 && this.input.charCodeAt(this.state.pos + 2) === 45 && this.input.charCodeAt(this.state.pos + 3) === 45) {
	      // `<!--`, an XML-style comment that should be interpreted as a line comment
	      this.skipLineComment(4);
	      this.skipNonTokens();
	      return this.readNextToken();
	    }
	
	    if (next === 61) size = 2;
	
	    this.state.pos += size;
	    return this.finishToken(_types.types.relational, this.input.slice(start, this.state.pos));
	  };
	
	  Lexer.prototype.readToken_plus_min = function readToken_plus_min(code) {
	    var next = this.input.charCodeAt(this.state.pos + 1);
	    var nextnext = this.input.charCodeAt(this.state.pos + 2);
	    if (next === code) {
	      if (!this.state.inModule && next === 45 && nextnext === 62 && _whitespace.lineBreak.test(this.input.slice(this.state.prev.end, this.state.pos))) {
	        // A `-->` line comment
	        this.skipLineComment(3);
	        this.skipNonTokens();
	        return this.readNextToken();
	      }
	      this.state.pos += 2;
	      return this.finishToken(_types.types.incDec, next === 45 ? '--' : '++');
	    }
	    if (next === 61) {
	      // =
	      if (code === 43 && nextnext === 62) {
	        // +=>
	        return this.finishArrow(3);
	      }
	      this.state.pos += 2;
	      return this.finishToken(_types.types.assign, code === 45 ? "-=" : "+=");
	    }
	    if (next === 62) {
	      return this.finishArrow();
	    }
	    ++this.state.pos;
	    return this.finishToken(_types.types.plusMin, code === 45 ? "-" : "+");
	  };
	
	  Lexer.prototype.readToken_semi = function readToken_semi() {
	    if (this.input.charCodeAt(this.state.pos + 1) === 59) {
	      this.state.pos += 2;
	      return this.finishToken(_types.types.doublesemi); // ';;'
	    } else {
	        ++this.state.pos;
	        return this.finishToken(_types.types.semi); // ';'
	      }
	  };
	
	  Lexer.prototype.readToken_slash = function readToken_slash() {
	    // '/'
	    if (this.state.exprAllowed) {
	      ++this.state.pos;
	      return this.readRegexp();
	    }
	    ++this.state.pos;
	    if (this.input.charCodeAt(this.state.pos) === 61) {
	      ++this.state.pos;
	      return this.finishToken(_types.types.assign, "/=");
	    }
	    return this.finishToken(_types.types.slash, "/");
	  };
	
	  Lexer.prototype.readToken_star = function readToken_star() {
	    // ensure that *=> is tokenized as star & `=>` arrow and not `*=` assign and relational `>`
	
	    var start = this.state.pos;
	    ++this.state.pos;
	    var next = this.input.charCodeAt(this.state.pos);
	
	    if (next === 61 && this.input.charCodeAt(this.state.pos + 1) !== 62) {
	      ++this.state.pos;
	      return this.finishToken(_types.types.eq, this.input.slice(start, this.state.pos));
	    }
	    return this.finishToken(_types.types.star);
	  };
	
	  // Read an identifier or keyword token
	
	
	  Lexer.prototype.readWord = function readWord() {
	    var word = this.readWordSingle();
	    if (!this.state.containsEsc && this.keywords.test(word)) {
	      return this.finishKeyword(word);
	    }
	    return this.finishToken(_types.types.name, { value: word, raw: this.input.slice(this.state.lex.start, this.state.pos) });
	  };
	
	  Lexer.prototype.finishKeyword = function finishKeyword(word) {
	    var type = _types.keywords[word];
	
	    // if (type === tt._upto || type === tt._downto) {
	    //   throw new Error("Not Implemented");
	    //   if (this.input.charCodeAt(this.state.pos) === 61) { // upto=, downto=
	    //     // TODO
	    //   }
	    // }
	
	    return this.finishToken(type, word);
	  };
	
	  // Read an identifier, and return it as a string. Sets `state.containsEsc`
	  // to whether the word contained a '\u' escape, or if it started with `\$`
	  //
	  // Incrementally adds only escaped chars, adding other chunks as-is
	  // as a micro-optimization.
	
	  Lexer.prototype.readWordSingle = function readWordSingle(allowEmpty) {
	    this.state.containsEsc = false;
	    var word = "";
	    var first = true;
	    var chunkStart = this.state.pos;
	
	    while (this.state.pos < this.input.length) {
	      var ch = this.fullCharCodeAtPos();
	      if ((0, _identifier.isIdentifierChar)(ch)) {
	        this.state.pos += ch <= 0xffff ? 1 : 2;
	      } else if (ch === 92) {
	        // "\"
	        this.state.containsEsc = true;
	        word += this.input.slice(chunkStart, this.state.pos);
	
	        var escStart = this.state.pos;
	        ++this.state.pos;
	        // Tacoscript-specific syntax: reserved words can be used as identifiers
	        // when started with "\$"; for the purpose of parsing the actual name,
	        // just skip the "\$"
	
	        if (first && this.input.charCodeAt(this.state.pos) === 36) {
	          ++this.state.pos;
	          chunkStart = this.state.pos;
	          first = false;
	          continue;
	        }
	        if (this.input.charCodeAt(this.state.pos) !== 117) {
	          // "u"
	          this.raise(this.state.pos, "Expected Unicode escape sequence \\uXXXX");
	        }
	
	        ++this.state.pos;
	        var esc = this.readCodePoint();
	        if (!(first ? _identifier.isIdentifierStart : _identifier.isIdentifierChar)(esc)) {
	          this.raise(escStart, "Invalid Unicode escape");
	        }
	        word += (0, _identifier.codePointToString)(esc);
	        chunkStart = this.state.pos;
	      } else {
	        break;
	      }
	      first = false;
	    }
	    word += this.input.slice(chunkStart, this.state.pos);
	    if (!allowEmpty && word.length <= 0) {
	      this.raise(this.state.pos, "Invalid Identifier name");
	    }
	    return word;
	  };
	
	  Lexer.prototype.readHexChar = function readHexChar(len) {
	    var codePos = this.pos;
	    var n = this.readNumber_int(16, len);
	    if (n === null) this.raise(codePos, "Bad character escape sequence");
	    return n;
	  };
	
	  // Used to read escaped characters
	
	  Lexer.prototype.readEscapedChar = function readEscapedChar(inTemplate) {
	    ++this.state.pos;
	    var ch = this.input.charCodeAt(this.state.pos);
	    ++this.state.pos;
	    switch (ch) {
	      case 110:
	        return "\n"; // 'n' -> '\n'
	      case 114:
	        return "\r"; // 'r' -> '\r'
	      case 120:
	        return String.fromCharCode(this.readHexChar(2)); // 'x'
	      case 117:
	        return (0, _identifier.codePointToString)(this.readCodePoint()); // 'u'
	      case 116:
	        return "\t"; // 't' -> '\t'
	      case 98:
	        return "\b"; // 'b' -> '\b'
	      case 118:
	        return "\u000b"; // 'v' -> '\u000b'
	      case 102:
	        return "\f"; // 'f' -> '\f'
	      case 13:
	        if (this.input.charCodeAt(this.state.pos) === 10) ++this.state.pos; // '\r\n'
	      // fallthrough
	      case 10:
	        // ' \n'
	        if (this.options.locations) {
	          this.state.lineStart = this.state.pos;++this.state.curLine;
	        }
	        return "";
	      default:
	        if (ch >= 48 && ch <= 55) {
	          var octalStr = this.input.substr(this.state.pos - 1, 3).match(/^[0-7]+/)[0];
	          var octal = parseInt(octalStr, 8);
	          if (octal > 255) {
	            octalStr = octalStr.slice(0, -1);
	            octal = parseInt(octalStr, 8);
	          }
	          if (octal > 0 && (this.state.strict || inTemplate)) {
	            this.raise(this.state.pos - 2, "Octal literal in " + (inTemplate ? "template" : "strict mode"));
	          }
	          this.state.pos += octalStr.length - 1;
	          return String.fromCharCode(octal);
	        }
	        return String.fromCharCode(ch);
	    }
	  };
	
	  ////////////// Template Tokenization //////////////
	
	  Lexer.prototype.readTmplToken = function readTmplToken() {
	    var out = "";
	    var chunkStart = this.state.pos;
	    for (;;) {
	      if (this.state.pos >= this.input.length) this.raise(this.state.start, "Unterminated template");
	      var ch = this.input.charCodeAt(this.state.pos);
	      if (ch === 96 || ch === 36 && this.input.charCodeAt(this.state.pos + 1) === 123) {
	        // '``', `${`
	        if (this.state.pos === this.state.lex.start && this.state.prevLexType === _types.types.template) {
	          if (ch === 36) {
	            this.state.pos += 2;
	            return this.finishToken(_types.types.dollarBraceL);
	          } else {
	            ++this.state.pos;
	            return this.finishToken(_types.types.backQuote);
	          }
	        } else {
	          out += this.input.slice(chunkStart, this.state.pos);
	          return this.finishToken(_types.types.template, out);
	        }
	      } else if (ch === 92) {
	        out += this.input.slice(chunkStart, this.state.pos);
	        out += this.readEscapedChar(true);
	        chunkStart = this.state.pos;
	      } else if ((0, _whitespace.isNewline)(ch)) {
	        out += this.input.slice(chunkStart, this.state.pos);
	        ++this.state.pos;
	        switch (ch) {
	          case 13:
	            if (this.input.charCodeAt(this.state.pos) === 10) ++this.state.pos;
	          // fallthrough
	          case 10:
	            out += "\n";
	            break;
	          default:
	            out += String.fromCharCode(ch);
	        }
	        ++this.state.curLine;
	        this.state.lineStart = this.state.pos;
	        chunkStart = this.state.pos;
	      } else {
	        ++this.state.pos;
	      }
	    }
	  };
	
	  ////////////// Token Storage //////////////
	
	  // TODO: rename these to "store"
	
	  Lexer.prototype.endToken = function endToken(token) {
	    this.state.tokens.push(token);
	    this.endSourceElementToken(token);
	  };
	
	  Lexer.prototype.endNonToken = function endNonToken(token) {
	    this.endSourceElementToken(token);
	  };
	
	  Lexer.prototype.endSourceElementToken = function endSourceElementToken(token) {
	    this.state.sourceElementsTokens.push(token);
	  };
	
	  return Lexer;
	}();
	
	exports.default = Lexer;

/***/ },

/***/ 451:
/*!*******************************************!*\
  !*** ./~/horchata/lib/util/whitespace.js ***!
  \*******************************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.isNewline = isNewline;
	/*
	 * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	// Matches a whole line break (where CRLF is considered a single
	// line break). Used to count lines.
	
	var lineBreak = exports.lineBreak = /\r\n?|\n|\u2028|\u2029/;
	var lineBreakG = exports.lineBreakG = new RegExp(lineBreak.source, "g");
	
	function isNewline(code) {
	  return code === 10 || code === 13 || code === 0x2028 || code === 0x2029;
	}
	// export {isNewline as isNewLine};
	
	var nonASCIIwhitespace = exports.nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;

/***/ },

/***/ 452:
/*!***************************************!*\
  !*** ./~/horchata/lib/lexer/state.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _extends2 = __webpack_require__(/*! babel-runtime/helpers/extends */ 453);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 445);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _types = __webpack_require__(/*! ./types */ 444);
	
	var _token = __webpack_require__(/*! ./token */ 458);
	
	var _token2 = _interopRequireDefault(_token);
	
	var _location = __webpack_require__(/*! ../util/location */ 459);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var State = function () {
	  function State() {
	    (0, _classCallCheck3.default)(this, State);
	  }
	
	  State.prototype.init = function init(options, inputFile) {
	    // TODO: decide if non-strict should be supported
	    this.options = options;
	    this.warnings = [];
	    this.comments = [];
	
	    //////// File ////////
	
	    this.inputFile = inputFile;
	
	    this.sourceFile = this.options.sourceFile;
	
	    // Used to signal to callers of `readWord1` whether the word
	    // contained any escape sequences. This is needed because words with
	    // escape sequences must not be interpreted as keywords.
	    this.containsEsc = false;
	
	    // Figure out if it's a module code.
	    this.strict = this.inModule = this.options.sourceType === "module";
	
	    //////// Character ////////
	
	    // The current position of the tokenizer in the input.
	    this.pos = this.lineStart = 0;
	    this.curLine = 1;
	
	    // The current indent level
	    this.indentation = 0;
	    this.nextIndentation = 0;
	    // The detected whitespace used for indentation
	    // This must be consistent through the file, or else it is a syntax error
	    this.indentString = null;
	    this.indentCharCode = -1;
	    this.indentRepeat = -1;
	
	    // When tokenizing, we lookahead past a newline, athen insert the indent token before the newline
	    this.indentStart = -1;
	    this.indentEnd = -1;
	
	    //////// Context ////////
	
	    // Used to signal that we have already checked for indentation changes after
	    // any upcoming newlines. Set to false after an indent or detent (or no
	    // indentation change token) has been pushed, and reset to true after a newline
	    // has been pushed.
	    // Used to signal if we will be skipping upcoming indentation
	    // This is set in `readIndentationMaybe` and unset in `skipIndentation`
	    this.eol = true;
	
	    // Flags to track whether we are in a function, a method, a generator, an async function.
	    // inFunction is used for validity of `return`
	    // inMethod is for `super`
	    // TODO: check spec to see if super is allowed in any functions, add tests
	    // inGenerator is for `yield`
	    // inAsync is for `await`
	    this.inFunction = this.inMethod = this.inGenerator = this.inAsync = false;
	
	    // Flag for if we're in the deader of a "for" loop, to decidee if `while`
	    // is for starting a loop or just to start the `test`
	    this.inForHeaderInit = false;
	
	    // Labels in scope.
	    this.labels = [];
	
	    // List of currently declared decorators, awaiting attachment
	    this.decorators = [];
	
	    // The context stack is used to superficially track syntactic
	    // context to predict whether a regular expression is allowed in a
	    // given position.
	    this.context = this.initialContext();
	    this.exprAllowed = true;
	
	    // used to communicate to children in the recursive descent if statements
	    // are allowed in the given context
	    // TODO: replace with a stack
	    this.statementAllowed = true;
	
	    //////// Token ////////
	
	    // All tokens parsed, will be attached to the file node at the end of parsing
	    this.tokens = [];
	    // currently processed token. allows re-use of lookahead
	    this.index = 0;
	    // All tokens and non-tokens parsed
	    this.sourceElementsTokens = [];
	    // Where the sourceElements go
	    this.sourceElementsKey = options.sourceElementsKey || 'sourceElements';
	
	    var curPosition = this.curPosition();
	    // Properties of the token that the lexer is currently extracting
	    this.lex = {
	      // Its type
	      type: _types.types.eof,
	      // For tokens that include more information than their type, the value
	      value: null,
	      // Its index in the token array
	      index: this.tokens.length,
	      // Its start and end offset
	      start: this.pos,
	      end: this.pos,
	      // And, if locations are used, the {line, column} object
	      // corresponding to those offsets
	      startLoc: curPosition,
	      endLoc: curPosition,
	
	      sourceFile: this.sourceFile
	    };
	    this.prevLexType = _types.types.eof;
	
	    // Information for the current token that the parser is analysing
	    var placeHolderToken = new _token2.default(_types.types.eof, null, 0, 0, curPosition, curPosition, this);
	    placeHolderToken.index = 0;
	    this.cur = this.prev = this.next = placeHolderToken;
	
	    // Used to signify information about the start of a potential anonymous
	    // function expression
	    // Equivalent to acorn & babylon's potentialArrowAt
	    this.potentialLambdaOn = (0, _extends3.default)({}, this.cur);
	  };
	
	  State.prototype.curPosition = function curPosition() {
	    return new _location.Position(this.curLine, this.pos - this.lineStart);
	  };
	
	  State.prototype.clone = function clone() {
	    var clone = new State();
	    for (var k in this) {
	      switch (k) {
	        case 'tokens':case 'sourceElementsTokens':
	          break;
	        case 'cur':case 'prev':
	          clone[k] = (0, _extends3.default)({}, this[k]);break;
	        case 'context':
	          clone.context = [].concat(this.context);break;
	        default:
	          clone[k] = this[k];
	      }
	    }
	    return clone;
	  };
	
	  State.prototype.resetNext = function resetNext() {
	    var nullPosition = new _location.Position(1, 0);
	    this.next = {
	      // Its type
	      type: _types.types.unknown,
	      // For tokens that include more information than their type, the value
	      value: null,
	      // Its index in the token array
	      index: -1,
	      // Its start and end offset
	      start: -1,
	      end: -1,
	      // And, if locations are used, the {line, column} object
	      // corresponding to those offsets
	      startLoc: nullPosition,
	      endLoc: nullPosition,
	
	      sourceFile: this.sourceFile
	    };
	  };
	
	  return State;
	}();
	
	exports.default = State;

/***/ },

/***/ 453:
/*!*******************************************************!*\
  !*** ./~/horchata/~/babel-runtime/helpers/extends.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _assign = __webpack_require__(/*! ../core-js/object/assign */ 454);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};

/***/ },

/***/ 454:
/*!*************************************************************!*\
  !*** ./~/horchata/~/babel-runtime/core-js/object/assign.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/assign */ 455), __esModule: true };

/***/ },

/***/ 458:
/*!***************************************!*\
  !*** ./~/horchata/lib/lexer/token.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 445);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _types = __webpack_require__(/*! ./types */ 444);
	
	var _location = __webpack_require__(/*! ../util/location */ 459);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Token = function () {
	  function Token(type, value, start, end, startLoc, endLoc) {
	    var parent = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];
	    var meta = arguments.length <= 7 || arguments[7] === undefined ? {} : arguments[7];
	    (0, _classCallCheck3.default)(this, Token);
	
	    this.type = type;
	    this.value = value;
	    this.start = start;
	    this.end = end;
	    this.meta = meta;
	    this.loc = new _location.SourceLocation(parent, startLoc, endLoc);
	    this.index = -1;
	  }
	
	  Token.fromCode = function fromCode(code) {
	    return Token.fromState(Token.stateFromCode(code));
	  };
	
	  Token.fromState = function fromState(spec) {
	    var token = new Token(spec.type, spec.value, spec.start, spec.end, spec.startLoc, spec.endLoc, spec, spec.meta);
	    token.index = spec.index;
	    return token;
	  };
	
	  // should not be used on regex, etc.
	
	  Token.stateFromCode = function stateFromCode(code, defaultType) {
	    // TODO: just use the tokenizer to do this
	    // make sure to design the tokenizer to make this easy
	    var cacheState = Token._fromCodeCache[code];
	    if (cacheState) return cacheState;
	
	    for (var key in _types.types) {
	      var type = _types.types[key];
	      if (type.code === code) {
	        return Token._fromCodeCache[code] = { type: type };
	      }
	    }
	    switch (code) {
	      case "=>":case "=>>":
	      case "->":case "->>":
	      case "+>":case "+>>":
	      case "+=>":case "+=>>":
	        return Token._fromCodeCache[code] = { type: _types.types.arrow, value: code };
	      case "+=":case "-=":
	      case "/=":case "*=":case "**=":case "%=":
	      case "|=":case "&=":case "^=":
	      case "<<=":case ">>=":case ">>>=":
	        return Token._fromCodeCache[code] = { type: _types.types.assign, value: code };
	      case "++":case "--":
	        return Token._fromCodeCache[code] = { type: _types.types.incDec, value: code };
	      case "==":case "===":case "!=":case "!==":
	        return Token._fromCodeCache[code] = { type: _types.types.equality, value: code };
	      case "<":case "<=":case ">":case ">=":
	        return Token._fromCodeCache[code] = { type: _types.types.relational, value: code };
	      case "<<":case ">>":case ">>>":
	        return Token._fromCodeCache[code] = { type: _types.types.bitShift, value: code };
	      case "+":case "-":
	        return Token._fromCodeCache[code] = { type: _types.types.plusMin, value: code };
	      case ";":
	        return Token._fromCodeCache[code] = { type: _types.types.semi };
	      case ";;":
	        return Token._fromCodeCache[code] = { type: _types.types.doublesemi };
	    }
	    if (defaultType) {
	      return { type: defaultType, value: code };
	    }
	    throw new Error("Cannot construct token from code \"" + code + "\"");
	  };
	
	  return Token;
	}();
	
	Token._fromCodeCache = {};
	exports.default = Token;

/***/ },

/***/ 459:
/*!*****************************************!*\
  !*** ./~/horchata/lib/util/location.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SourceLocation = exports.Position = undefined;
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 445);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	exports.getLineInfo = getLineInfo;
	
	var _whitespace = __webpack_require__(/*! ./whitespace */ 451);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// These are used when `options.locations` is on, for the
	// `startLoc` and `endLoc` properties.
	
	var Position = exports.Position = function () {
	  function Position(line, col) {
	    (0, _classCallCheck3.default)(this, Position);
	
	    this.line = line;
	    this.column = col;
	  }
	
	  Position.prototype.offset = function offset(n) {
	    return new Position(this.line, this.column + n);
	  };
	
	  Position.prototype.clone = function clone() {
	    return this.offset(0);
	  };
	
	  return Position;
	}(); /*
	      * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	      * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	      *
	      * See LICENSE for full license text
	      */
	
	var SourceLocation = exports.SourceLocation = function () {
	  function SourceLocation(parent, start, end) {
	    (0, _classCallCheck3.default)(this, SourceLocation);
	
	    this.start = start;
	    this.end = end;
	    if (parent.sourceFile !== null) this.source = parent.sourceFile;else if (parent.source !== null) this.source = parent.source;
	  }
	
	  SourceLocation.prototype.clone = function clone() {
	    return new SourceLocation(this, this.start && this.start.clone(), this.end && this.end.clone());
	  };
	
	  return SourceLocation;
	}();
	
	// The `getLineInfo` function is mostly useful when the
	// `locations` option is off (for performance reasons) and you
	// want to find the line/column position for a given character
	// offset. `input` should be the code string that the offset refers
	// into.
	
	function getLineInfo(input, offset) {
	  for (var line = 1, cur = 0;;) {
	    _whitespace.lineBreakG.lastIndex = cur;
	    var match = _whitespace.lineBreakG.exec(input);
	    if (match && match.index < offset) {
	      ++line;
	      cur = match.index + match[0].length;
	    } else {
	      return new Position(line, offset - cur);
	    }
	  }
	}
	
	// TODO: use https://github.com/lydell/line-numbers or babel-code-frame to
	// display parsing errors

/***/ },

/***/ 460:
/*!***********************************!*\
  !*** ./~/horchata/lib/options.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.defaultOptions = undefined;
	
	var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ 461);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	exports.getOptions = getOptions;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var emptyObject = {};
	
	var defaultOptions = exports.defaultOptions = {
	  filename: null,
	
	  // The two source types have different static semantics.
	  // The added "expression" source type is like wrapping a script in parenthises,
	  // and allows return outside of functions
	  sourceType: "module", // or "script" (todo), or "expression" (todo)
	
	  // When enabled, a return at the top level is not considered an
	  // error.
	  // TODO: rename to allow return in any statement context, same with super
	  // TODO: actually, just move to validator plugins.
	  allowReturnOutsideFunction: false,
	
	  // When enabled, `super` is allowed anywhere.
	  allowSuperOutsideMethod: false,
	
	  // When enabled, `new.target` is allowed anywhere.
	  allowNewTargetOutsideFunction: false,
	
	  // map of plugins with their options
	  plugins: emptyObject,
	
	  // Construct a CST with the sourceElements, according to the estree CST proposal spec
	  // https://github.com/gibson042/estree/blob/gh-41/spec.md
	  sourceElements: true,
	  sourceElementsKey: 'sourceElements',
	
	  // When `locations` is on, `loc` properties holding objects with
	  // `start` and `end` properties in `{line, column}` form (with
	  // line being 1-based and column 0-based) will be attached to the
	  // nodes.
	  locations: true,
	
	  // Nodes have their start and end characters offsets recorded in
	  // `start` and `end` properties (directly on the node, rather than
	  // the `loc` object, which holds line/column data. To also add a
	  // [semi-standardized][range] `range` property holding a `[start,
	  // end]` array with the same numbers, set the `ranges` option to
	  // `true`.
	  //
	  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
	  ranges: false,
	
	  createParenthesizedExpressionNodes: false,
	
	  // When enabled, import/export statements are not constrained to
	  // appearing at the top level of the program.
	  allowImportExportEverywhere: false,
	
	  // When enabled, leading strings at the top level are parsed as
	  // expression statements and not directives
	  noTopLevelDirectives: false,
	
	  // When enabled, allows the creation of arrow function generators.
	  // These cannot be directly expressed in vanilla es2015+, however
	  // babel transforms them properly into es5 and older.
	  allowArrowFunctionGenerators: false,
	
	  // Features, for simple parsing extensions needed for foundational plugins
	
	  features: {
	    exclCall: true,
	    statementNoParenCall: false,
	    implicitReturnFunctions: false,
	    lexicallyBoundNamedFunctions: false,
	    strudelThisMember: false,
	    externDeclarations: false
	  }
	
	};
	
	// TODO: callbacks will be only added via plugin
	
	// TODO: create a `loose` preset that allows all of these "allowSomethingSomewhere"
	
	// TODO: https://github.com/jmeas/sourcemap-options
	// Interpret and default an options object
	
	function getOptions(opts) {
	  return _getOptions(opts, defaultOptions);
	}
	
	function _getOptions(opts, spec) {
	  var options = {};
	  for (var key in spec) {
	    if (spec[key] !== null && (0, _typeof3.default)(spec[key]) === "object") {
	      if (spec[key] === emptyObject) {
	        options[key] = opts[key] || {};
	      } else {
	        options[key] = _getOptions(opts[key] || {}, spec[key]);
	      }
	    } else {
	      options[key] = opts && key in opts ? opts[key] : spec[key];
	    }
	  }
	  return options;
	}

/***/ },

/***/ 461:
/*!******************************************************!*\
  !*** ./~/horchata/~/babel-runtime/helpers/typeof.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(/*! ../core-js/symbol/iterator */ 462);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(/*! ../core-js/symbol */ 463);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },

/***/ 462:
/*!***************************************************************!*\
  !*** ./~/horchata/~/babel-runtime/core-js/symbol/iterator.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol/iterator */ 397), __esModule: true };

/***/ },

/***/ 463:
/*!******************************************************!*\
  !*** ./~/horchata/~/babel-runtime/core-js/symbol.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol */ 400), __esModule: true };

/***/ },

/***/ 464:
/*!******************************************!*\
  !*** ./~/horchata/lib/lexer/comments.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.blockCommentMeta = undefined;
	
	var _whitespace = __webpack_require__(/*! ../util/whitespace */ 451);
	
	// Comment formatting metadata
	
	var blockCommentMeta = exports.blockCommentMeta = {
	  "#*": {
	    terminator: "*#",
	    terminatorRe: /\*#/,
	    terminatorSub: "*$1#",
	    terminatorSubRe: /\*( *)#/g,
	    terminatorEscapeSub: "* $1#",
	    terminatorEscapeSubRe: /\* ( *)#/g,
	    isCanonical: true, // this is the only block comment type that will be included in generation
	    startLen: 2,
	    endLen: 2
	  },
	  // formatting directives
	  "#%": {
	    terminator: "%#",
	    terminatorRe: /%#/,
	    startLen: 2,
	    endLen: 2
	  },
	  // commented code. Will _not_ be included in cst
	  "###": {
	    terminator: "###",
	    terminatorRe: new RegExp(_whitespace.lineBreak.source + "###"),
	    startLen: 3,
	    endLen: 3
	  },
	  "/*": {
	    terminator: "*/",
	    terminatorRe: /\*\//,
	    terminatorSub: "*$1/",
	    terminatorSubRe: /\*( *)\//g,
	    terminatorEscapeSub: "* $1/",
	    terminatorEscapeSubRe: /\* ( *)\//g,
	    startLen: 2,
	    endLen: 2,
	    isJs: true
	  }
	};

/***/ },

/***/ 465:
/*!**********************************!*\
  !*** ./~/horchata/lib/plugin.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _getIterator2 = __webpack_require__(/*! babel-runtime/core-js/get-iterator */ 466);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	exports.registerPlugin = registerPlugin;
	exports.registerPluginModule = registerPluginModule;
	exports.loadModule = loadModule;
	exports.initModule = initModule;
	
	var _lexer = __webpack_require__(/*! ./lexer */ 450);
	
	var _lexer2 = _interopRequireDefault(_lexer);
	
	var _parser = __webpack_require__(/*! ./parser */ 467);
	
	var _parser2 = _interopRequireDefault(_parser);
	
	var _types = __webpack_require__(/*! ./lexer/types */ 444);
	
	var _contextTypes = __webpack_require__(/*! ./lexer/context-types */ 446);
	
	var _serialization = __webpack_require__(/*! ./lexer/serialization */ 498);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Flexible API
	function registerPlugin(name, load, init) {
	  _parser2.default.addPlugin(name, load);
	  if (init != null) init(_parser2.default.prototype, _lexer2.default.prototype);
	}
	
	// Simplified module API
	// Plugin registry API
	
	function registerPluginModule(name, parser, lexer) {
	  registerPlugin(name, loadModule(parser, lexer), initModule(parser, lexer));
	}
	
	function loadModule(parserModule, lexerModule) {
	  var parserExtenders = [];
	  var lexerExtenders = [];
	
	  if (lexerModule) for (var method in lexerModule) {
	    if (method !== '__esModule' && /^extend[A-Z]/.test(method)) {
	      var extender = { name: removeExtendPrefix(method), function: lexerModule[method] };
	      parserExtenders.push(extender);
	      lexerExtenders.push(extender);
	    }
	  }
	
	  for (var _method in parserModule) {
	    if (_method !== '__esModule' && /^extend[A-Z]/.test(_method)) {
	      var _extender = { name: removeExtendPrefix(_method), function: parserModule[_method] };
	      parserExtenders.push(_extender);
	    }
	  }
	
	  return function (instance) {
	    if (instance.__isParser) {
	      for (var _iterator = parserExtenders, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
	        var _ref;
	
	        if (_isArray) {
	          if (_i >= _iterator.length) break;
	          _ref = _iterator[_i++];
	        } else {
	          _i = _iterator.next();
	          if (_i.done) break;
	          _ref = _i.value;
	        }
	
	        var _extender2 = _ref;
	
	        instance.extend(_extender2.name, _extender2.function);
	      }
	    } else {
	      for (var _iterator2 = lexerExtenders, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
	        var _ref2;
	
	        if (_isArray2) {
	          if (_i2 >= _iterator2.length) break;
	          _ref2 = _iterator2[_i2++];
	        } else {
	          _i2 = _iterator2.next();
	          if (_i2.done) break;
	          _ref2 = _i2.value;
	        }
	
	        var _extender3 = _ref2;
	
	        instance.extend(_extender3.name, _extender3.function);
	      }
	    }
	  };
	}
	
	function removeExtendPrefix(s) {
	  return String.fromCharCode(s.charCodeAt(6) + 32) + s.slice(7);
	}
	
	function defaultUpdateContext(type) {
	  this.state.exprAllowed = type.beforeExpr;
	}
	
	function initModule(parserModule, lexerModule) {
	  return function (pp, lp) {
	
	    if (lexerModule) {
	
	      if (lexerModule.tokenTypes) {
	        for (var typeKey in lexerModule.tokenTypes) {
	          if (typeKey in _types.types) throw new Error("Token type \"" + typeKey + "\" already defined");
	          _types.types[typeKey] = lexerModule.tokenTypes[typeKey];
	        }
	        (0, _serialization.added)();
	      }
	
	      if (lexerModule.contextTypes) {
	        for (var _typeKey in lexerModule.contextTypes) {
	          if (_typeKey in _contextTypes.types) throw new Error("Context type \"" + _typeKey + "\" already defined");
	          _contextTypes.types[_typeKey] = lexerModule.contextTypes[_typeKey];
	        }
	      }
	
	      if (lexerModule.updateContext) {
	        for (var ttKey in lexerModule.updateContext) {
	          _types.types[ttKey].updateContext = lexerModule.updateContext[ttKey](_types.types[ttKey].updateContext || defaultUpdateContext);
	        }
	      }
	
	      for (var method in lexerModule) {
	        if (method !== '__esModule' && !/^extend[A-Z]|^(token|context)Types$|^updateContext$/.test(method)) {
	          if (method in lp) throw new Error("Lexer method \"" + method + "\" already defined");
	          lp[method] = lexerModule[method];
	        }
	      }
	    }
	
	    for (var _method2 in parserModule) {
	      if (_method2 !== '__esModule' && !/^extend[A-Z]/.test(_method2)) {
	        if (_method2 in pp) throw new Error("Parser method \"" + _method2 + "\" already defined");
	        pp[_method2] = parserModule[_method2];
	      }
	    }
	  };
	}

/***/ },

/***/ 466:
/*!************************************************************!*\
  !*** ./~/horchata/~/babel-runtime/core-js/get-iterator.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/get-iterator */ 333), __esModule: true };

/***/ },

/***/ 467:
/*!****************************************!*\
  !*** ./~/horchata/lib/parser/index.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.plugins = undefined;
	
	var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ 454);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 468);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 445);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ 470);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ 471);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _lexer = __webpack_require__(/*! ../lexer */ 450);
	
	var _lexer2 = _interopRequireDefault(_lexer);
	
	var _file = __webpack_require__(/*! ../file */ 474);
	
	var _file2 = _interopRequireDefault(_file);
	
	var _location = __webpack_require__(/*! ../util/location */ 459);
	
	var _cst = __webpack_require__(/*! ../postprocessors/cst */ 479);
	
	var _cst2 = _interopRequireDefault(_cst);
	
	var _comments = __webpack_require__(/*! ../postprocessors/comments */ 484);
	
	var _comments2 = _interopRequireDefault(_comments);
	
	var _types = __webpack_require__(/*! ../lexer/types */ 444);
	
	var _helpers = __webpack_require__(/*! ./methods/helpers */ 485);
	
	var helperMethods = _interopRequireWildcard(_helpers);
	
	var _node = __webpack_require__(/*! ./methods/node */ 486);
	
	var nodeMethods = _interopRequireWildcard(_node);
	
	var _types2 = __webpack_require__(/*! ./methods/types */ 487);
	
	var typesMethods = _interopRequireWildcard(_types2);
	
	var _validation = __webpack_require__(/*! ./methods/validation */ 488);
	
	var validationMethods = _interopRequireWildcard(_validation);
	
	var _base = __webpack_require__(/*! ./types/base */ 490);
	
	var baseParsers = _interopRequireWildcard(_base);
	
	var _classes = __webpack_require__(/*! ./types/classes */ 491);
	
	var classesParsers = _interopRequireWildcard(_classes);
	
	var _expressions = __webpack_require__(/*! ./types/expressions */ 492);
	
	var expressionsParsers = _interopRequireWildcard(_expressions);
	
	var _literals = __webpack_require__(/*! ./types/literals */ 493);
	
	var literalsParsers = _interopRequireWildcard(_literals);
	
	var _methods = __webpack_require__(/*! ./types/methods */ 494);
	
	var methodsParsers = _interopRequireWildcard(_methods);
	
	var _modules = __webpack_require__(/*! ./types/modules */ 495);
	
	var modulesParsers = _interopRequireWildcard(_modules);
	
	var _statements = __webpack_require__(/*! ./types/statements */ 496);
	
	var statementsParsers = _interopRequireWildcard(_statements);
	
	var _templateLiterals = __webpack_require__(/*! ./types/template-literals */ 497);
	
	var templateLiteralsParsers = _interopRequireWildcard(_templateLiterals);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Registered plugins
	/*
	 * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	var plugins = exports.plugins = {};
	
	var Parser = function (_Lexer) {
	  (0, _inherits3.default)(Parser, _Lexer);
	
	  Parser.addPlugin = function addPlugin(name, initializer) {
	    var currentPlugin = plugins[name];
	    if (currentPlugin != null && currentPlugin !== initializer) {
	      throw new Error("Plugin '" + name + "' conflicts with another plugin");
	    }
	    plugins[name] = initializer;
	  };
	
	  function Parser(options, input) {
	    (0, _classCallCheck3.default)(this, Parser);
	
	
	    // Load plugins
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, _Lexer.call(this, options, input));
	
	    _this.__isParser = true;
	    _this.loadPlugins(_this.options.plugins);
	    return _this;
	  }
	
	  Parser.prototype.extend = function extend(name, f) {
	    this[name] = f(this[name], Parser.prototype);
	  };
	
	  Parser.prototype.loadPlugins = function loadPlugins(pluginConfigs) {
	    for (var name in pluginConfigs) {
	      var plugin = plugins[name];
	      if (!plugin) throw new Error("Plugin '" + name + "' not found");
	      plugin(this, pluginConfigs[name]);
	    }
	  };
	
	  Parser.prototype.parse = function parse(text, metadata) {
	    var file = new _file2.default(text, this.options, metadata);
	    this.open(file); // set up tokenizer
	    var program = this.startNode();
	    this.nextToken();
	
	    // skip past leading newlines
	    // TODO: this should be handled in the tokenizer
	    //       leading newlines should be treated as normal whitespace
	    while (this.eat(_types.types.newline)) {}
	
	    file = this.parseTopLevel(file, program);
	    file.comments = this.state.comments;
	    // TODO: add option
	    (0, _cst2.default)(file, this.state.sourceElementsTokens, this.options);
	    (0, _comments2.default)(file, this.options);
	    this.close();
	    // TODO: strip _childReferences
	    return file;
	  };
	
	  // TODO: take a vinyl file as input, or vinyl-like file object
	
	
	  Parser.prototype.parseFile = function parseFile() {
	    throw new Error("Not Implemented");
	  };
	
	  //////// Core Parser methods ////////
	
	  // Check if the next token matches `type`
	
	
	  Parser.prototype.match = function match(type) {
	    return this.state.cur.type === type;
	  };
	
	  // Check if the lookahead token matches `type`
	
	
	  Parser.prototype.matchNext = function matchNext(type) {
	    this.ensureLookahead();
	    return this.state.next.type === type;
	  };
	
	  Parser.prototype.matchPrev = function matchPrev(type) {
	    return this.state.prev.type === type;
	  };
	
	  // Predicate that tests whether the next token is of the given
	  // type, and if yes, consumes it as a side effect.
	
	
	  Parser.prototype.eat = function eat(type) {
	    if (this.match(type)) {
	      this.next();
	      return true;
	    }
	    return false;
	  };
	
	  //////// Utility methods ////////
	
	  // Raise an unexpected token error
	
	
	  Parser.prototype.unexpected = function unexpected(pos) {
	    var message = "Unexpected Token";
	    if (pos == null) {
	      pos = this.state.cur.start;
	    }
	    var token = pos === this.state.cur.start ? this.state.cur : pos === this.state.prev.start ? this.state.prev : null;
	    if (token == null) for (var i = this.state.index - 2; i >= 0; i--) {
	      if (this.state.tokens[i].start === pos) token = this.state.tokens[i];
	    }
	    if (token) {
	      message += ": " + token.type.key + " (" + (0, _stringify2.default)(token.value) + ")";
	    }
	    this.raise(pos, message);
	  };
	
	  // This function is used to raise exceptions on parse errors. It
	  // takes an offset integer (into the current `input`) to indicate
	  // the location of the error, attaches the position to the end
	  // of the error message, and then raises a `SyntaxError` with that
	  // message.
	
	
	  Parser.prototype.raise = function raise(pos, message) {
	    throw this._createSyntaxError(pos, message);
	  };
	
	  Parser.prototype.abort = function abort(message) {
	    this.raise(this.state.pos, message);
	  };
	
	  Parser.prototype.warn = function warn(pos, message) {
	    this.state.warnings.push(this._createSyntaxError(pos, message));
	  };
	
	  Parser.prototype._createSyntaxError = function _createSyntaxError(pos, message) {
	    var loc = (0, _location.getLineInfo)(this.input, pos);
	    var err = new SyntaxError(message + " (" + loc.line + ":" + loc.column + ")");
	    err.pos = pos;
	    err.loc = loc;
	    err.raisedAt = this.pos;
	    return err;
	  };
	
	  return Parser;
	}(_lexer2.default);
	
	exports.default = Parser;
	var _arr = [helperMethods, nodeMethods, typesMethods, validationMethods, baseParsers, classesParsers, expressionsParsers, literalsParsers, methodsParsers, modulesParsers, statementsParsers, templateLiteralsParsers];
	
	for (var _i = 0; _i < _arr.length; _i++) {
	  var parserMethods = _arr[_i];
	  (0, _assign2.default)(Parser.prototype, parserMethods);
	}

/***/ },

/***/ 468:
/*!**************************************************************!*\
  !*** ./~/horchata/~/babel-runtime/core-js/json/stringify.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/json/stringify */ 469), __esModule: true };

/***/ },

/***/ 470:
/*!*************************************************************************!*\
  !*** ./~/horchata/~/babel-runtime/helpers/possibleConstructorReturn.js ***!
  \*************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ 461);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },

/***/ 471:
/*!********************************************************!*\
  !*** ./~/horchata/~/babel-runtime/helpers/inherits.js ***!
  \********************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(/*! ../core-js/object/set-prototype-of */ 472);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(/*! ../core-js/object/create */ 473);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ 461);
	
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

/***/ 472:
/*!***********************************************************************!*\
  !*** ./~/horchata/~/babel-runtime/core-js/object/set-prototype-of.js ***!
  \***********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/set-prototype-of */ 417), __esModule: true };

/***/ },

/***/ 473:
/*!*************************************************************!*\
  !*** ./~/horchata/~/babel-runtime/core-js/object/create.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/create */ 421), __esModule: true };

/***/ },

/***/ 474:
/*!********************************!*\
  !*** ./~/horchata/lib/file.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 445);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ 470);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ 471);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _node = __webpack_require__(/*! ./parser/node */ 475);
	
	var _node2 = _interopRequireDefault(_node);
	
	var _location = __webpack_require__(/*! ./util/location */ 459);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// TODO: allow simple conversion to and from vinyl files. maybe.
	
	var File = function (_Node) {
	  (0, _inherits3.default)(File, _Node);
	
	  function File(input, options) {
	    var metadata = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	    (0, _classCallCheck3.default)(this, File);
	
	
	    // TODO: allow input to be a buffer or a stream
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, _Node.call(this, { options: options }, { start: 0, startLoc: new _location.Position(1, 0), index: 0 }));
	
	    _this.input = input;
	    _this.filename = metadata.filename;
	
	    _this.type = "File";
	    // populated by the parser
	    _this.program = null;
	    // will be populated by the tokenizer once it detects the indent style
	    _this.format = { indent: null };
	    // populated by from the tokenizer's `state` after parsing is complete
	    _this.tokens = null;
	    _this.sourceElementsTokens = null;
	    _this.comments = null;
	    // populated by parser after parsing is complete
	    _this.map = null;
	
	    // internal
	    _this._childReferences = [];
	    return _this;
	  }
	
	  File.prototype.toJSON = function toJSON() {
	    var _ref;
	
	    return _ref = {
	      type: this.type,
	      sourceLanguage: this.sourceLanguage,
	      sourceType: this.sourceType,
	      program: this.program,
	      filename: this.filename,
	      format: this.format,
	      tokens: this.tokens
	    }, _ref[this._sourceElementsKey] = this[this._sourceElementsKey], _ref.comments = this.comments, _ref;
	  };
	
	  return File;
	}(_node2.default);
	
	exports.default = File;

/***/ },

/***/ 475:
/*!***************************************!*\
  !*** ./~/horchata/lib/parser/node.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _getIterator2 = __webpack_require__(/*! babel-runtime/core-js/get-iterator */ 466);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	var _keys = __webpack_require__(/*! babel-runtime/core-js/object/keys */ 476);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 445);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _location = __webpack_require__(/*! ../util/location */ 459);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Node = function () {
	  function Node(state, token) {
	    (0, _classCallCheck3.default)(this, Node);
	
	    this.type = "";
	    this.start = token.start;
	    this.end = 0;
	    this.tokenStart = token.index;
	    this.tokenEnd = 0;
	    if (state.options.locations) {
	      this.loc = new _location.SourceLocation(state, token.startLoc != null ? token.startLoc : token.loc.start);
	    }
	    if (state.options.directSourceFile) {
	      this.sourceFile = token.sourceFile || state.options.directSourceFile;
	    }
	    if (state.options.ranges) {
	      this.range = [token.start, 0];
	    }
	    if (state.options.sourceElements) {
	      this._sourceElementsKey = state.options.sourceElementsKey || 'sourceElements';
	      this[this._sourceElementsKey] = [];
	    }
	  }
	
	  Node.prototype.__clone = function __clone() {
	    var clone = new Node({ options: {} }, {});
	    for (var k in this) {
	      clone[k] = this[k];
	    }if ("range" in this) {
	      clone.range = [this.range[0], this.range[1]];
	    }
	    if ("sourceElements" in this) {
	      clone.sourceElements = [];
	    }
	    return clone;
	  };
	
	  Node.prototype.toJSON = function toJSON() {
	    var out = {};
	    for (var _iterator = (0, _keys2.default)(this), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
	      var _ref;
	
	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }
	
	      var k = _ref;
	
	      if (k[0] !== "_") {
	        out[k] = this[k];
	      }
	    }
	    return out;
	  };
	
	  return Node;
	}(); /*
	      * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	      * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	      *
	      * See LICENSE for full license text
	      */
	
	exports.default = Node;
	
	Object.defineProperty(Node.prototype, "__isNode", { value: true });

/***/ },

/***/ 476:
/*!***********************************************************!*\
  !*** ./~/horchata/~/babel-runtime/core-js/object/keys.js ***!
  \***********************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/keys */ 477), __esModule: true };

/***/ },

/***/ 479:
/*!**********************************************!*\
  !*** ./~/horchata/lib/postprocessors/cst.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.Postprocessor = undefined;
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 468);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 445);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	exports.default = function (ast, tokens, options) {
	  new Postprocessor(options).process(ast, tokens);return ast;
	};
	
	var _tacoscriptCstUtils = __webpack_require__(/*! tacoscript-cst-utils */ 480);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Postprocessor that attaches CST nodes to the AST
	 *
	 */
	
	var Postprocessor = exports.Postprocessor = function () {
	  function Postprocessor() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    (0, _classCallCheck3.default)(this, Postprocessor);
	
	    this.sourceElementsKey = options.sourceElementsKey || 'sourceElements';
	  }
	
	  Postprocessor.prototype.process = function process(ast, tokens) {
	    this.ast = ast;
	    this.tokens = tokens;
	    this.index = 0;
	    this.traverse(ast);
	    if (this.index < this.tokens.length) {
	      throw new Error("All tokens not consumed");
	    }
	  };
	
	  Postprocessor.prototype.nextSourceTokenIndex = function nextSourceTokenIndex(el, node) {
	    if (el.extra && el.extra.tokenIndex != null) return el.extra.tokenIndex;
	    if (node) return (0, _tacoscriptCstUtils.tokenStartOf)(node);
	    throw new Error("Cannot get index of el " + (0, _stringify2.default)(el));
	  };
	
	  // TODO: convert to use a traverse helper, similar to babel's traversal helpers
	
	
	  Postprocessor.prototype.traverse = function traverse(node) {
	    var state = { list: {} };
	    var children = node._childReferences || [];
	    var i = 0;
	    var nextChild = children[i];
	    var nextNode = (0, _tacoscriptCstUtils.dereference)(node, nextChild, state);
	
	    var sourceElements = node[this.sourceElementsKey];
	
	    // TODO: simplify control flow
	    while (this.index < this.tokens.length) {
	      var token = this.tokens[this.index];
	      while (token != null && (!nextChild || nextChild.element == null || (token.index !== -1 ? token.index < this.nextSourceTokenIndex(nextChild, nextNode) : token.start < (nextChild.start || (0, _tacoscriptCstUtils.startOf)(nextNode))) || false) && (!nextNode || !nextNode.__isNode || token.index < (0, _tacoscriptCstUtils.tokenStartOf)(nextNode)) && token.end <= node.end && token.index <= node.tokenEnd && true) {
	        var tokenJson = {
	          element: token.type.alias,
	          value: token.end - token.start > 0 ? token.type.toCode(token, this.ast) : "",
	          start: token.start,
	          end: token.end,
	          loc: token.loc.clone(),
	          extra: { tokenValue: token.value, tokenType: token.type.key }
	        };
	        if (token.index >= 0) tokenJson.extra.tokenIndex = token.index;
	        sourceElements.push(tokenJson);
	
	        this.index++;
	        token = this.tokens[this.index];
	      }
	      if (nextChild) {
	        sourceElements.push(nextChild);
	        if (!nextChild.element && nextNode != null) {
	          this.traverse(nextNode);
	        } else {
	          if (token && token.index != null && token.index === nextChild.extra.tokenIndex) {
	            // sourceElement is for a token, skip the token, since it's already been included while parsing
	            this.index++;
	          }
	        }
	        i += 1;
	        nextChild = children[i];
	        nextNode = (0, _tacoscriptCstUtils.dereference)(node, nextChild, state);
	      } else {
	        break;
	      }
	    }
	    if (nextChild || i < children.length) {
	      throw new Error("all children not consumed");
	    }
	  };
	
	  return Postprocessor;
	}();

/***/ },

/***/ 480:
/*!*********************************************!*\
  !*** ./~/tacoscript-cst-utils/lib/index.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _render = __webpack_require__(/*! ./render */ 481);
	
	Object.defineProperty(exports, "render", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_render).default;
	  }
	});
	
	var _dereference = __webpack_require__(/*! ./dereference */ 482);
	
	Object.defineProperty(exports, "dereference", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_dereference).default;
	  }
	});
	
	var _nodeStart = __webpack_require__(/*! ./node-start */ 483);
	
	Object.defineProperty(exports, "startLocOf", {
	  enumerable: true,
	  get: function get() {
	    return _nodeStart.startLocOf;
	  }
	});
	Object.defineProperty(exports, "startOf", {
	  enumerable: true,
	  get: function get() {
	    return _nodeStart.startOf;
	  }
	});
	Object.defineProperty(exports, "tokenStartOf", {
	  enumerable: true,
	  get: function get() {
	    return _nodeStart.tokenStartOf;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },

/***/ 481:
/*!**********************************************!*\
  !*** ./~/tacoscript-cst-utils/lib/render.js ***!
  \**********************************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.default = render;
	
	// Render by depth-first reference traversal
	
	function render(node) {
	  var sourceElementsKey = arguments.length <= 1 || arguments[1] === undefined ? "sourceElements" : arguments[1];
	  var path = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
	
	  if (node == null) throw new Error("Illegal reference at " + path);
	  var lists = {};
	  if (node[sourceElementsKey] === undefined) throw new Error('"' + sourceElementsKey + '" missing at ' + path);
	  return node[sourceElementsKey].map(function (el) {
	    if (el.reference) {
	      var _el$reference$split = el.reference.split('#');
	
	      var key = _el$reference$split[0];
	      var list = _el$reference$split[1];
	
	      if (list === "next") {
	        var i = lists[key] || 0;
	        lists[key] = i + 1;
	        if (el.element) {
	          return el.value != null ? el.value : node[el.reference];
	        } else {
	          return render(node[key][i], sourceElementsKey, path + '.' + key + '[' + i + ']');
	        }
	      } else {
	        if (el.element) {
	          return el.value != null ? el.value : node[el.reference];
	        } else {
	          return render(node[key], sourceElementsKey, path + '.' + key);
	        }
	      }
	    } else if (el.element !== "EOF") {
	      return el.value;
	    }
	  }).join("");
	}

/***/ },

/***/ 482:
/*!***************************************************!*\
  !*** ./~/tacoscript-cst-utils/lib/dereference.js ***!
  \***************************************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.default = dereference;
	function dereference(parent, childReference, state) {
	  if (childReference === undefined) return undefined;
	
	  var _childReference$refer = childReference.reference.split('#');
	
	  var key = _childReference$refer[0];
	  var list = _childReference$refer[1];
	
	  var node = void 0;
	  if (list === "next") {
	    var i = state.list[key] || 0;
	    node = parent[key][i];
	    state.list[key] = i + 1;
	  } else {
	    node = parent[key];
	  }
	  return node;
	}

/***/ },

/***/ 483:
/*!**************************************************!*\
  !*** ./~/tacoscript-cst-utils/lib/node-start.js ***!
  \**************************************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.startTarget = startTarget;
	exports.startOf = startOf;
	exports.startLocOf = startLocOf;
	exports.tokenStartOf = tokenStartOf;
	function startTarget(node) {
	  if (node.type === "ClassMethod" || node.type === "ObjectMethod" || node.type === "ObjectProperty" || node.type === "ClassDeclaration" || node.type === "ClassExpression" || false) {
	    if (node.decorators != null && node.decorators.length > 0) {
	      return node.decorators[0];
	    }
	  }
	  return node;
	}
	
	function startOf(node) {
	  return startTarget(node).start;
	}
	function startLocOf(node) {
	  return startTarget(node).loc.start;
	}
	function tokenStartOf(node) {
	  return startTarget(node).tokenStart;
	}

/***/ },

/***/ 484:
/*!***************************************************!*\
  !*** ./~/horchata/lib/postprocessors/comments.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.Postprocessor = undefined;
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 445);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	exports.default = function (ast, options) {
	  new Postprocessor(options).process(ast);return ast;
	};
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Postprocessor = exports.Postprocessor = function () {
	  function Postprocessor() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    (0, _classCallCheck3.default)(this, Postprocessor);
	
	    this.sourceElementsKey = options.sourceElementsKey || 'sourceElements';
	  }
	
	  Postprocessor.prototype.process = function process(ast) {
	    this.ast = ast;
	    this.traverse(ast);
	  };
	
	  Postprocessor.prototype.dereference = function dereference(parent, childReference, state) {
	    if (childReference === undefined) return undefined;
	
	    var _childReference$refer = childReference.reference.split('#');
	
	    var key = _childReference$refer[0];
	    var list = _childReference$refer[1];
	
	    var node = void 0;
	    if (list === "next") {
	      var i = state.list[key] || 0;
	      node = parent[key][i];
	      state.list[key] = i + 1;
	    } else {
	      node = parent[key];
	    }
	    return node;
	  };
	
	  // TODO: convert to use a traverse helper, similar to babel's traversal helpers
	
	
	  Postprocessor.prototype.traverse = function traverse(node) {
	    var lastChild = void 0;
	    var state = { list: {} };
	    var unclaimedComments = node.innerComments || [];
	    delete node.innerComments;
	    var sourceElements = node[this.sourceElementsKey];
	    for (var len = sourceElements.length, i = 0; i < len; i++) {
	      var el = sourceElements[i];
	      if (el.element === "CommentBody") {
	        unclaimedComments.push(this.ast.comments[el.extra.tokenValue.index]);
	      }
	      if (el.reference) {
	        var child = this.dereference(node, el, state);
	        if (!el.element) {
	          if (unclaimedComments.length) {
	            this.assignComments(child, unclaimedComments);
	            unclaimedComments = [];
	          }
	          this.traverse(child);
	          lastChild = child;
	        }
	      }
	    }
	    if (unclaimedComments.length) {
	      if (lastChild) {
	        lastChild.trailingComments = unclaimedComments;
	      } else {
	        this.assignComments(node, unclaimedComments);
	      }
	    }
	  };
	
	  Postprocessor.prototype.assignComments = function assignComments(node, unclaimedComments) {
	    var i = 0;
	    var nodeStart = node.start;
	    for (; i < unclaimedComments.length; i++) {
	      if (unclaimedComments[i].start >= nodeStart) break;
	    }
	    if (i > 0) {
	      node.leadingComments = (node.leadingComments || []).concat(unclaimedComments.slice(0, i));
	    }
	    if (i < unclaimedComments.length) {
	      var firstInnerIndex = i;
	      var nodeEndLine = node.loc.end.line - 1;
	      if (node.type === "Program") {
	        i = unclaimedComments.length;
	      } else for (; i < unclaimedComments.length; i++) {
	        var c = unclaimedComments[i];
	        if (c.type === "CommentLine" && c.loc.start.line >= nodeEndLine) break;
	      }
	      if (i > firstInnerIndex) {
	        node.innerComments = (node.innerComments || []).concat(unclaimedComments.slice(firstInnerIndex, i));
	      }
	      if (i < unclaimedComments.length) {
	        node.trailingComments = (node.trailingComments || []).concat(unclaimedComments.slice(i));
	      }
	    }
	  };
	
	  return Postprocessor;
	}(); /**
	      * Performs comment attachment from the cst.
	      */

/***/ },

/***/ 485:
/*!**************************************************!*\
  !*** ./~/horchata/lib/parser/methods/helpers.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.parseIndentableList = parseIndentableList;
	exports._getLineInfo = _getLineInfo;
	
	var _types = __webpack_require__(/*! ../../lexer/types */ 444);
	
	var _location = __webpack_require__(/*! ../../util/location */ 459);
	
	// TODO: comment this
	// TODO: eventually, this could be replaced by a pass through the tokenizer
	//       where the newlines, etc. are replaced by commas where appropriate
	function parseIndentableList(close, context, inner) {
	  var allowTrailingComma = context.allowTrailingComma;
	  var _context$separator = context.separator;
	  var separator = _context$separator === undefined ? _types.types.comma : _context$separator;
	  var noTerminator = context.noTerminator;
	
	  var indented = false;
	  var first = true;
	
	  var firstSeparatorStart = void 0,
	      firstConcreteSeparatorStart = void 0;
	
	  if (this.eat(_types.types.newline)) {
	    // must be empty
	    if (close !== null) {
	      this.eat(close) || this.unexpected();
	    }
	    return {};
	  }
	
	  if (close === null && this.state.cur.meta.continuedPreviousLine) return {};
	
	  loop: while (close === null || !this.match(close)) {
	    if (!indented) {
	      indented = this.eat(_types.types.indent);
	      if (indented && first) {
	        firstSeparatorStart = this.state.prev.start;
	        first = false;
	      }
	    }
	
	    if (first) {
	      first = false;
	    } else {
	      if (firstSeparatorStart === undefined) firstSeparatorStart = this.state.cur.start;
	      if (this.eat(separator)) {
	        if (firstConcreteSeparatorStart === undefined) firstConcreteSeparatorStart = this.state.prev.start;
	        indented && this.eat(_types.types.newline); // TODO: allow a strict mode where commas + newlines aren't allowed
	      } else if (indented && (this.eat(_types.types.newline) || this.matchPrev(_types.types.newline))) {/* do nothing */} else if (close === null && (noTerminator || this.matchLineTerminator({ ignoredNewline: true }) || this.matchPrev(_types.types.newline))) {
	            break;
	          } else this.unexpected();
	    }
	
	    if (indented && this.eat(_types.types.dedent)) {
	      indented = false;
	      if (close !== null) {
	        this.eat(_types.types.newline);
	        this.match(close) || this.unexpected();
	      }
	      break;
	    } else if (allowTrailingComma) {
	      if (allowTrailingComma !== "indent" || indented) {
	        if (close === null ? this.matchLineTerminator({ ignoredNewline: true }) : this.match(close)) {
	          break;
	        }
	      }
	    }
	    this.eat(_types.types.newline);
	
	    switch (inner.call(this, {})) {
	      case "break":
	        break loop;
	    }
	  }
	
	  if (close !== null) {
	    var isClosed = this.eat(close);
	    if (indented) {
	      this.eat(_types.types.newline);
	      this.eat(_types.types.dedent) || this.unexpected();
	    }
	    // TODO: allow ellipsis after dedent just before close
	    if (!isClosed) this.eat(close) || this.unexpected();
	  } else {
	    if (indented) {
	      this.eat(_types.types.dedent) || this.unexpected();
	    } else {
	      noTerminator || this.eatLineTerminator({ ignoredNewline: true }) || this.matchPrev(_types.types.newline) || this.unexpected();
	    }
	  }
	  return { firstSeparatorStart: firstSeparatorStart, firstConcreteSeparatorStart: firstConcreteSeparatorStart };
	}
	
	function _getLineInfo(pos) {
	  return (0, _location.getLineInfo)(this.input, pos);
	}

/***/ },

/***/ 486:
/*!***********************************************!*\
  !*** ./~/horchata/lib/parser/methods/node.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _getIterator2 = __webpack_require__(/*! babel-runtime/core-js/get-iterator */ 466);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	var _extends2 = __webpack_require__(/*! babel-runtime/helpers/extends */ 453);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	exports.startNode = startNode;
	exports.finishNode = finishNode;
	exports._toChildReferenceToken = _toChildReferenceToken;
	exports.popReference = popReference;
	exports.assign = assign;
	exports.unassign = unassign;
	exports.assignRaw = assignRaw;
	exports.add = add;
	exports.addAll = addAll;
	exports.addExtra = addExtra;
	exports.addRaw = addRaw;
	exports.assignToken = assignToken;
	
	var _node = __webpack_require__(/*! ../node */ 475);
	
	var _node2 = _interopRequireDefault(_node);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Start an AST node, attaching location information.
	
	function startNode() {
	  var token = arguments.length <= 0 || arguments[0] === undefined ? this.state.cur : arguments[0];
	
	  var node = new _node2.default(this, token);
	  node._childReferences = [];
	  return node;
	}
	
	// Finish an AST node, adding `type` and `end` properties.
	
	/*
	 * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	// All code for adding cst data _during_ parsing is included in these methods.
	// When an option to not add cst data is added, these functions should be
	// overridden to not set (see http://jsperf.com/if-vs-override for approach)
	
	function finishNode(node, type) {
	  var token = arguments.length <= 2 || arguments[2] === undefined ? this.state.prev : arguments[2];
	
	  node.type = type;
	  node.end = token.end;
	  node.tokenEnd = token.index;
	  if (this.options.locations) {
	    node.loc.end = token.endLoc != null ? token.endLoc : token.loc.end;
	  }
	  if (this.options.ranges) {
	    node.range[1] = token.end;
	  }
	  return node;
	}
	
	function _toChildReferenceToken(token, reference, value) {
	  var element = {};
	  if (reference) element.reference = reference;
	  if (!reference || token.type.estreeValue !== null) element.value = token.value;else if (value != null) element.value = value;
	  element = (0, _extends3.default)({}, element, {
	    element: token.type.alias,
	    start: token.start,
	    end: token.end,
	    loc: token.loc.clone(),
	    extra: { tokenValue: token.value, tokenIndex: token.index, tokenType: token.type.key }
	  });
	  return element;
	}
	
	function popReference(parent, expected) {
	  var el = parent._childReferences.pop();
	  if (expected && el.reference !== expected) throw new Error("Replacing incorrect reference");
	  return true;
	}
	
	function assign(parent, key, value) {
	  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	
	  // TODO: throw error if already set
	  parent[key] = value;
	
	  var token = options.token;
	
	  if (token) {
	    parent._childReferences.push(this._toChildReferenceToken(token, key));
	  } else if (value != null) {
	    if (value.__isNode || value instanceof _node2.default) {
	      // TODO: store cst info
	      parent._childReferences.push({ reference: key });
	    } else {
	      // warn or try to infer the relevent token
	      console.log("assigning a non-node value without relevant token", parent, key);
	      console.trace();
	    }
	  }
	  return value;
	}
	
	function unassign(parent, key) {
	  var value = parent[key];
	  // Currently only supports unassigning simple values
	  if (value.__isNode) throw new Error("Not Implemented");
	  delete parent[key];
	
	  // Update partial CST
	  var el = void 0,
	      index = -1;
	  for (var i = 0, len = parent._childReferences.length; i < len; i++) {
	    var testEl = parent._childReferences[i];
	    if (testEl.reference === key) {
	      index = i;
	      el = testEl;
	      break;
	    }
	  }
	  if (index !== -1) {
	    parent._childReferences.splice(index, 1);
	  }
	  return !!el;
	}
	
	function assignRaw(node, key, value) {
	  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	  var _options$token = options.token;
	  var token = _options$token === undefined ? this.state.cur : _options$token;
	  // TODO: throw error if already set
	
	  node[key] = value;
	  var raw = void 0;
	  if (options.noExtra) {
	    raw = this.input.slice(token.start, token.end);
	  } else {
	    this.addRaw(node, token);
	    raw = node.extra.raw;
	  }
	  node._childReferences.push(this._toChildReferenceToken(token, key, raw));
	  return value;
	}
	
	function add(parent, key, node) {
	  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	
	  (parent[key] == null ? parent[key] = [] : parent[key]).push(node);
	
	  // store cst info
	  var token = options.token;
	
	  var el = { reference: key + '#next' };
	
	  // When the node cannot store its own data, it's stored here. Primarily used
	  // for `pass`
	  if (token) {
	    el.element = token.type.alias;
	    el.value = token.type.toCode(token, this.state);
	    el.start = token.start;
	    el.end = token.end;
	    el.loc = token.loc.clone();
	    el.extra = { tokenValue: token.value, tokenIndex: token.index };
	  }
	  parent._childReferences.push(el);
	  return node;
	}
	
	function addAll(parent, key, nodes, options) {
	  for (var _iterator = nodes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
	    var _ref;
	
	    if (_isArray) {
	      if (_i >= _iterator.length) break;
	      _ref = _iterator[_i++];
	    } else {
	      _i = _iterator.next();
	      if (_i.done) break;
	      _ref = _i.value;
	    }
	
	    var node = _ref;
	
	    this.add(parent, key, node, options);
	  }
	}
	
	function addExtra(parent, key, value) {
	  (parent.extra == null ? parent.extra = {} : parent.extra)[key] = value;
	  return value;
	}
	
	function addRaw(node) {
	  var token = arguments.length <= 1 || arguments[1] === undefined ? this.state.cur : arguments[1];
	
	  this.addExtra(node, "raw", this.input.slice(token.start, token.end));
	}
	
	function assignToken(node, key, value) {
	  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	  var _options$token2 = options.token;
	  var token = _options$token2 === undefined ? this.state.cur : _options$token2;
	
	  node._childReferences.push(this._toChildReferenceToken(token, key, value));
	  return node;
	}

/***/ },

/***/ 487:
/*!************************************************!*\
  !*** ./~/horchata/lib/parser/methods/types.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.isForKeyword = isForKeyword;
	exports.matchDecoratorSymbol = matchDecoratorSymbol;
	exports.matchForKeyword = matchForKeyword;
	exports.isLineTerminator = isLineTerminator;
	exports.isConcreteLineTerminator = isConcreteLineTerminator;
	exports.matchLineTerminator = matchLineTerminator;
	exports.matchPrevTerminator = matchPrevTerminator;
	exports.matchNextTerminator = matchNextTerminator;
	exports.eatLineTerminator = eatLineTerminator;
	
	var _types = __webpack_require__(/*! ../../lexer/types */ 444);
	
	// TODO: move to tokenizer, since this deals with token types and not node parsing. maybe
	
	function isForKeyword(type) {
	  // will be extended by simple range loop plugin, for `upto` and `downto`
	  return type === _types.types._in || type === _types.types._of;
	}
	
	function matchDecoratorSymbol() {
	  var strudelThisMember = arguments.length <= 0 || arguments[0] === undefined ? this.hasFeature("strudelThisMember") : arguments[0];
	
	  return !strudelThisMember ? this.match(_types.types.at) : this.match(_types.types.relational) && this.state.cur.value === ">";
	}
	
	function matchForKeyword() {
	  return this.isForKeyword(this.state.cur.type);
	}
	
	function isLineTerminator(type) {
	  return this.isConcreteLineTerminator(type) || this.state.indentation === 0 && type === _types.types.eof || false;
	}
	
	function isConcreteLineTerminator(type) {
	  return type === _types.types.newline || type === _types.types.doublesemi || false;
	}
	
	function matchLineTerminator() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var token = this.state.cur;
	  return this.isLineTerminator(token.type) || options.ignoredNewline && token.meta.continuedPreviousLine;
	}
	
	function matchPrevTerminator() {
	  return this.isLineTerminator(this.state.prev.type);
	}
	
	function matchNextTerminator() {
	  this.ensureLookahead();
	  return this.isLineTerminator(this.state.next.type);
	}
	
	function eatLineTerminator() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  if (this.matchLineTerminator(options)) {
	    if (this.isConcreteLineTerminator(this.state.cur.type)) {
	      this.next();
	    }
	    return true;
	  } else if (options.allowPrev && this.matchPrevTerminator()) {
	    return true;
	  }
	  return false;
	}

/***/ },

/***/ 488:
/*!*****************************************************!*\
  !*** ./~/horchata/lib/parser/methods/validation.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _create = __webpack_require__(/*! babel-runtime/core-js/object/create */ 473);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _getIterator2 = __webpack_require__(/*! babel-runtime/core-js/get-iterator */ 466);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	exports.checkReferencedList = checkReferencedList;
	exports.checkAssignable = checkAssignable;
	exports.checkClassMethodName = checkClassMethodName;
	exports.checkClassConstructorProperties = checkClassConstructorProperties;
	exports.checkClassMethodProperties = checkClassMethodProperties;
	exports.checkDeclaration = checkDeclaration;
	exports.checkDecorators = checkDecorators;
	exports.checkExpressionOperatorLeft = checkExpressionOperatorLeft;
	exports.checkExpression = checkExpression;
	exports.checkFunctionBody = checkFunctionBody;
	exports.checkArrowExpressionFunction = checkArrowExpressionFunction;
	exports.checkExport = checkExport;
	exports.checkFunctionAssignable = checkFunctionAssignable;
	exports.checkGetterSetterProperty = checkGetterSetterProperty;
	exports.checkIdentifierName = checkIdentifierName;
	exports.checkJump = checkJump;
	exports.checkLabelName = checkLabelName;
	exports.checkMetaProperty = checkMetaProperty;
	exports.checkParams = checkParams;
	exports.checkPropClash = checkPropClash;
	exports.checkPropRedefinition = checkPropRedefinition;
	exports.checkShorthandPropertyBinding = checkShorthandPropertyBinding;
	exports.preCheckSuper = preCheckSuper;
	exports.checkSuper = checkSuper;
	exports.checkTryStatement = checkTryStatement;
	exports.checkWithStatementAllowed = checkWithStatementAllowed;
	exports.checkUnaryExpression = checkUnaryExpression;
	exports.isOctalValid = isOctalValid;
	
	var _types = __webpack_require__(/*! ../../lexer/types */ 444);
	
	var _helpers = __webpack_require__(/*! ../helpers */ 489);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// To be overridden by plugins
	// equivalent to "toReferencedList" in babylon, used by flow plugin
	/*
	 * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	function checkReferencedList(expressions) {
	  return expressions;
	}
	
	// equivalent to "checkLVal"
	// will be used by a validator plugin
	function checkAssignable() /*node, assignableContext = {}*/{
	  // let isBinding = !!assignableContext.isBinding;
	  // let checkClashes = !!assignableContext.checkClashes;
	  // TODO
	}
	
	function checkClassMethodName(method) {
	  // disallow static prototype method
	  if (method.static && (0, _helpers.isIdentifierOrStringLiteral)(method.key, "prototype")) {
	    this.raise(method.key.start, "Classes may not have static property named prototype");
	  }
	}
	
	function checkClassConstructorProperties(method) {
	  // note that this function gets called twice, once before parsing the
	  // arguments and once after parsing the arrow
	  if (method.kind === "get") this.raise(method.key.start, "Constructor can't have get modifier");
	  if (method.kind === "set") this.raise(method.key.start, "Constructor can't have set modifier");
	  if (method.generator) this.raise(method.key.start, "Constructor can't be a generator");
	  if (method.async) this.raise(method.key.start, "Constructor can't be an async function");
	}
	
	function checkClassMethodProperties(method) {
	  // disallow decorators on class constructors
	  if ((method.kind === "constructor" || method.kind === "constructorCall") && method.decorators) {
	    this.raise(method.start, "You can't attach decorators to a class constructor");
	  }
	}
	
	function checkDeclaration(decl, kind, declarationContext) {
	  if (!decl.init) {
	    var isFor = !!declarationContext.isFor;
	    if (kind === _types.types._const && !this.matchForKeyword()) {
	      // const requires an initializer or use in `for ... in` or `for ... of`
	      this.unexpected();
	    } else if (decl.id.type !== "Identifier" && !(isFor && this.matchForKeyword())) {
	      this.raise(this.state.prev.end, "Complex binding patterns require an initialization value");
	    }
	  }
	  return decl;
	}
	
	function checkDecorators() {
	  // TODO
	  // checks are moved to other functions, so that plugins can override them for extended syntax.
	  // i.e. allow adding decorators to standalone functions
	  // let allowExport = this.state.statementAllowed
	}
	
	function checkExpressionOperatorLeft(node) {
	  var left = node.left;
	
	  if (node.operator === "**" && left.type === "UnaryExpression" && left.extra && !left.extra.parenthesizedArgument) {
	    this.raise(left.argument.start, "Illegal expression. Wrap left hand side or entire exponentiation in parentheses.");
	  }
	}
	
	function checkExpression(node, expressionContext) {
	  var pos = expressionContext.shorthandDefaultPos && expressionContext.shorthandDefaultPos.start;
	  if (pos) this.raise(pos, "Shorthand property assignments are valid only in destructuring patterns");
	}
	
	function checkFunctionBody(node) {
	  // the following is from babylon.
	
	  // If this is a strict mode function, verify that argument names
	  // are not repeated, and it does not try to bind the words `eval`
	  // or `arguments`.
	  var checkLVal = this.state.strict;
	  var checkLValStrict = false;
	  var isStrict = false;
	
	  // normal function
	  if (node.body.directives.length) {
	    for (var _iterator = node.body.directives, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
	      var _ref;
	
	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }
	
	      var directive = _ref;
	
	      if (directive.value.value === "use strict") {
	        isStrict = true;
	        checkLVal = true;
	        checkLValStrict = true;
	        break;
	      }
	    }
	  }
	
	  //
	  if (isStrict && node.id && node.id.type === "Identifier" && node.id.name === "yield") {
	    this.raise(node.id.start, "Binding yield in strict mode");
	  }
	
	  if (checkLVal) {
	    this.checkFunctionAssignable(node, checkLValStrict);
	  }
	}
	
	function checkArrowExpressionFunction(node) {
	  this.checkFunctionAssignable(node);
	}
	
	function checkExport(node) {
	  if (this.state.decorators.length) {
	    var isClass = node.declaration && (node.declaration.type === "ClassDeclaration" || node.declaration.type === "ClassExpression");
	    if (!node.declaration || !isClass) {
	      this.raise(node.start, "Decorators can only be used on an export when exporting a class");
	    }
	  }
	}
	
	function checkFunctionAssignable(node, setStrict) {
	  var nameHash = (0, _create2.default)(null);
	  var oldStrict = this.state.strict;
	  if (setStrict) this.state.strict = true;
	  if (node.id) {
	    this.checkAssignable(node.id, { isBinding: true });
	  }
	  if (node.params != null) {
	    for (var _iterator2 = node.params, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
	      var _ref2;
	
	      if (_isArray2) {
	        if (_i2 >= _iterator2.length) break;
	        _ref2 = _iterator2[_i2++];
	      } else {
	        _i2 = _iterator2.next();
	        if (_i2.done) break;
	        _ref2 = _i2.value;
	      }
	
	      var param = _ref2;
	
	      this.checkAssignable(param, { isBinding: true, checkClashes: nameHash });
	    }
	  }
	  this.state.strict = oldStrict;
	}
	
	function checkGetterSetterProperty(prop) {
	  var paramCount = prop.kind === "get" ? 0 : 1;
	  if (prop.params.length !== paramCount) {
	    var start = prop.start;
	    if (prop.kind === "get") {
	      this.raise(start, "getter should have no params");
	    } else {
	      this.raise(start, "setter should have exactly one param");
	    }
	  }
	}
	
	function checkIdentifierName(identifierContext) {
	  var allowKeywords = !!identifierContext.allowKeywords;
	  // TODO: see if this still triggers with escaped words in
	  if (!allowKeywords && !this.state.containsEsc && (this.state.strict ? this.reservedWordsStrict : this.reservedWords).test(this.state.cur.value.value)) {
	    this.raise(this.state.cur.start, "The keyword '" + this.state.cur.value.value + "' is reserved");
	  }
	}
	
	function checkJump(node, keyword) {
	  var isBreak = keyword === "break";
	  // Verify that there is an actual destination to break or
	  // continue to.
	  var i = void 0;
	  for (i = 0; i < this.state.labels.length; ++i) {
	    var label = this.state.labels[i];
	    if (node.label == null || label.name === node.label.name) {
	      if (label.kind != null && (isBreak || label.kind === "loop")) break;
	      if (node.label && isBreak) break;
	    }
	  }
	  // if not found
	  if (i === this.state.labels.length) this.raise(node.start, "Unsyntactic " + keyword);
	}
	
	function checkLabelName(name, labelNode) {
	  for (var i = 0; i < this.state.labels.length; ++i) {
	    var label = this.state.labels[i];
	    if (label.name === name) {
	      this.raise(labelNode.start, "Label '" + name + "' is already declared");
	    }
	  }
	}
	
	function checkMetaProperty(node) {
	  if (!this.state.inFunction && !this.options.allowNewTargetOutsideFunction) {
	    this.raise(node.start, "new.target can only be used in functions");
	  }
	}
	
	// Checks function params for various disallowed patterns such as using "eval"
	// or "arguments" and duplicate parameters.
	
	function checkParams(node) {
	  var nameHash = {};
	  for (var i = 0; i < node.params.length; i++) {
	    this.checkAssignable(node.params[i], true, nameHash);
	  }
	}
	
	// Check if property name clashes with already added.
	// Object/class getters and setters are not allowed to clash —
	// either with each other or with an init property — and in
	// strict mode, init properties are also not allowed to be repeated.
	function checkPropClash(prop, propHash) {
	  if (prop.computed) return;
	
	  var key = prop.key;
	
	  var name = void 0;
	
	  switch (key.type) {
	    case "Identifier":
	      name = key.name;break;
	    case "StringLiteral":case "NumericLiteral":
	      name = String(key.value);break;
	    default:
	      return;
	  }
	  var kind = prop.kind;
	
	  if (name === "__proto__" && kind === "init") {
	    if (propHash.proto) this.raise(key.start, "Redefinition of __proto__ property");
	    propHash.proto = true;
	  }
	}
	
	function checkPropRedefinition(name, prop, propHash) {
	  var kind = prop.kind;
	  var key = prop.key;
	
	  name = "$" + name;
	  var other = propHash[name];
	  if (other) {
	    var isGetSet = kind !== "init";
	    if ((this.strict || isGetSet) && other[kind] || !(isGetSet ^ other.init)) this.raise(key.start, "Redefinition of property");
	  } else {
	    other = propHash[name] = {
	      init: false,
	      get: false,
	      set: false
	    };
	  }
	  other[kind] = true;
	}
	
	function checkShorthandPropertyBinding(prop) {
	  // TODO: allow if escaped
	  if (this.keywordsJs.test(prop.key.name) || (this.state.strict ? this.reservedWordsStrictBind : this.reservedWords).test(prop.key.name)) {
	    this.raise(prop.key.start, "Binding " + prop.key.name);
	  }
	}
	
	function preCheckSuper() {
	  if (!this.state.inMethod && !this.options.allowSuperOutsideMethod) {
	    this.raise(this.state.cur.start, "`super` can only be used in a method");
	  }
	}
	
	function checkSuper(node) {
	  if (this.match(_types.types.parenL) && this.state.inMethod !== "constructor" && !this.options.allowSuperOutsideMethod) {
	    this.raise(node.start, "super() outside of class constructor");
	  }
	}
	
	function checkTryStatement(node) {
	  if (!node.handler && !node.finalizer) {
	    this.raise(node.start, "Missing catch or finally clause");
	  }
	}
	
	function checkWithStatementAllowed() {
	  if (this.state.strict) this.raise(this.state.cur.start, "'with' in strict mode");
	}
	
	// TODO: add the following as a plugin
	/*
	parser.extend("checkTryStatement", function(inner) {
	  if (!node.handler && !node.finalizer) {
	    this.assign(node, "handler", this.startNode());
	    let param = this.startNode();
	    param.name = "_";
	    this.assign(node.handler, "param", this.finishNode(param, "Identifier"));
	    let body = this.startNode();
	    body = this.initBlockBody(body, {});
	    this.assign(node.handler, "body", this.finishNode(param, "BlockStatement"));
	  }
	  return inner.call(this);
	});
	*/
	
	function checkUnaryExpression(node) {
	  return;
	  // TODO: move to plugin
	  if (this.state.strict && node.operator === "delete" && node.argument.type === "Identifier") {
	    this.raise(node.start, "Deleting local variable in strict mode");
	  }
	}
	
	function isOctalValid() {
	  return true;
	  // return !this.state.strict;
	}

/***/ },

/***/ 489:
/*!******************************************!*\
  !*** ./~/horchata/lib/parser/helpers.js ***!
  \******************************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.isIdentifierOrStringLiteral = isIdentifierOrStringLiteral;
	function isIdentifierOrStringLiteral(key, name) {
	  return key.type === "Identifier" && key.name === name || key.type === "StringLiteral" && key.value === name || false;
	}

/***/ },

/***/ 490:
/*!*********************************************!*\
  !*** ./~/horchata/lib/parser/types/base.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.parseTopLevel = parseTopLevel;
	exports.parseDirective = parseDirective;
	exports.parseBlockStatement = parseBlockStatement;
	exports.parseBlock = parseBlock;
	exports.initBlockBody = initBlockBody;
	exports.parseBlockBody = parseBlockBody;
	
	var _types = __webpack_require__(/*! ../../lexer/types */ 444);
	
	// Top Level Parsing
	
	// Parse a program. Initializes the parser, reads any number of
	// statements, and wraps them in a Program node.  Optionally takes a
	// `program` argument.  If present, the statements will be appended
	// to its body instead of creating a new node.
	
	function parseTopLevel(file, program) {
	  program.sourceType = this.options.sourceType;
	  program.sourceLanguage = this.options.sourceLanguage || 'tacoscript';
	
	  program = this.parseBlockBody(program, { allowDirectives: !this.options.noTopLevelDirectives, isTopLevel: true });
	
	  this.assign(file, "program", this.finishNode(program, "Program"));
	  file.comments = this.state.comments;
	  file.tokens = this.state.tokens;
	  file.warnings = this.state.warnings;
	
	  return this.finishNode(file, "File");
	}
	
	// expected cur.type: tt.string
	/*
	 * Copyright (C) 2012-2015 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	function parseDirective() {
	  var directiveLiteral = this.startNode();
	  var directive = this.startNode();
	
	  var raw = this.input.slice(this.state.cur.start, this.state.cur.end);
	  var value = raw.slice(1, -1); // remove quotes
	
	  this.assignRaw(directiveLiteral, "value", value);
	
	  this.next();
	
	  this.assign(directive, "value", this.finishNode(directiveLiteral, "DirectiveLiteral"));
	  this.eatLineTerminator() || this.unexpected();
	  return this.finishNode(directive, "Directive");
	}
	
	function parseBlockStatement(node) {
	  var blockContext = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  this.next();
	  return this.parseBlock(blockContext, node);
	}
	
	// this can be any kind of block, not just detached (`!`) blocks
	function parseBlock() {
	  var blockContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var node = arguments[1];
	  var allowConcise = blockContext.allowConcise;
	  var implicitReturn = blockContext.implicitReturn;
	
	  if (node === undefined) node = this.startNode();
	  if (this.eatLineTerminator()) {
	    node = this.initBlockBody(node, blockContext);
	  } else if (this.eat(_types.types.indent)) {
	    this.eat(_types.types.newline);
	    node = this.parseBlockBody(node, blockContext);
	  } else if (allowConcise) {
	    node = this.initBlockBody(node, blockContext);
	    if (this.state.cur.type.startsExpr || this.state.cur.type.startsStmt) {
	      do {
	        this.add(node, "body", this.parseStatement());
	      } while (this.eat(_types.types.doublesemi));
	    }
	  } else {
	    this.unexpected();
	  }
	  return this.finishNode(node, (implicitReturn ? "ImplicitReturn" : "") + "BlockStatement");
	}
	
	function initBlockBody(node, blockContext) {
	  node.body = [];
	  if (blockContext.allowDirectives) node.directives = [];
	  return node;
	}
	
	// Parse a sequence of statements, seaparated by newlines, and enclosed in an
	// indentation level. Handles `"use strict"` declarations when
	// `blockContext.allowDirectives` is true
	
	function parseBlockBody(node) {
	  var blockContext = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  var allowDirectives = !!blockContext.allowDirectives;
	  // const allowStrict = !!blockContext.isFunction;
	  var isTopLevel = !!blockContext.isTopLevel;
	  var end = isTopLevel ? _types.types.eof : _types.types.dedent;
	
	  this.initBlockBody(node, blockContext);
	
	  var oldStrict = this.state.strict;
	  var finishedDirectives = false;
	  while (!this.eat(end)) {
	    if (allowDirectives && !finishedDirectives && this.match(_types.types.string) && this.matchNextTerminator()) {
	      var directive = this.parseDirective();
	      if (!oldStrict && directive.value === "use strict") this.state.strict = true;
	      this.add(node, "directives", directive);
	      continue;
	    }
	    finishedDirectives = true;
	    this.add(node, "body", this.parseStatement(true, isTopLevel));
	    this.eat(_types.types.newline);
	  }
	  if (!isTopLevel) {
	    this.eatLineTerminator();
	  }
	  this.state.strict = oldStrict;
	  return node;
	}

/***/ },

/***/ 491:
/*!************************************************!*\
  !*** ./~/horchata/lib/parser/types/classes.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.parseClassDeclaration = parseClassDeclaration;
	exports.parseClassExpression = parseClassExpression;
	exports.parseClassId = parseClassId;
	exports.parseClassSuper = parseClassSuper;
	exports.isClassProperty = isClassProperty;
	exports.isClassConstructor = isClassConstructor;
	exports.parseClassBody = parseClassBody;
	exports.parseClassProperty = parseClassProperty;
	
	var _types = __webpack_require__(/*! ../../lexer/types */ 444);
	
	var _helpers = __webpack_require__(/*! ../helpers */ 489);
	
	// Parse a class declaration
	/*
	 * Copyright (C) 2012-2015 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	function parseClassDeclaration(node) {
	  var classContext = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  this.consumeDecorators(node);
	
	  this.next();
	  node = this.parseClassId(node, classContext);
	  node = this.parseClassSuper(node, classContext);
	  this.assign(node, "body", this.parseClassBody(true, classContext));
	  return this.finishNode(node, "ClassDeclaration");
	}
	
	// Parse a class expression literal
	function parseClassExpression() {
	  var classContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  classContext.optionalId = true;
	  var node = this.startNode();
	
	  // TODO: start node at location of first decorator instead of class. maybe.
	  this.consumeDecorators(node);
	
	  this.next();
	  node = this.parseClassId(node, classContext);
	  node = this.parseClassSuper(node, classContext);
	  this.assign(node, "body", this.parseClassBody(false, classContext));
	  return this.finishNode(node, "ClassExpression");
	}
	
	function parseClassId(node, classContext) {
	  var optionalId = !!classContext.optionalId;
	
	  if (this.match(_types.types.name)) this.assign(node, "id", this.parseIdentifier());else if (optionalId) node.id = null;else this.unexpected();
	
	  return node;
	}
	
	function parseClassSuper(node) {
	  this.assign(node, "superClass", this.eat(_types.types._extends) ? this.parseExpressionSubscripts({}) : null);
	  return node;
	}
	
	function isClassProperty() {
	  return this.match(_types.types.eq) || this.matchLineTerminator();
	}
	
	function isClassConstructor(method) {
	  return method.kind !== "constructorCall" && !method.static && (0, _helpers.isIdentifierOrStringLiteral)(method.key, "constructor") && true;
	}
	
	function parseClassBody(isDeclaration, classContext) {
	  var _this = this;
	
	  var node = this.startNode();
	  var hasConstructor = false;
	  var hasConstructorCall = false;
	  var decorators = [];
	  var isMultiline = false;
	  node.body = [];
	
	  var end = void 0;
	  if (this.eat(_types.types.indent)) {
	    isMultiline = true;
	    end = function end() {
	      return _this.eat(_types.types.dedent);
	    };
	    this.eat(_types.types.newline);
	  } else if (this.eat(_types.types._then)) {
	    end = function end() {
	      return _this.eat(_types.types.newline) || _this.match(_types.types.eof);
	    };
	  } else {
	    if (isDeclaration) this.eatLineTerminator() || this.unexpected();
	    return this.finishNode(node, "ClassBody");
	  }
	
	  // class bodies are implicitly strict
	  var oldStrict = this.state.strict;
	  this.state.strict = true;
	
	  var strudelThisMember = this.hasFeature("strudelThisMember");
	
	  while (!end()) {
	    if (this.eatLineTerminator()) continue;
	
	    if (this.matchDecoratorSymbol(strudelThisMember)) {
	      decorators.push(this.parseDecorator());
	      continue;
	    }
	
	    var method = this.startNode();
	
	    if (decorators.length) {
	      this.addAll(method, "decorators", decorators);
	      decorators = [];
	    }
	
	    method.static = this.eat(_types.types._static);
	    if (method.static) this.assignToken(method, "static", "static", { token: this.state.prev });
	
	    if (!this.matchNext(_types.types.eq) && !this.matchNext(_types.types.parenL)) {
	      if (this.eat(_types.types._get)) {
	        this.assign(method, "kind", "get", { token: this.state.prev });
	      } else if (this.eat(_types.types._set)) {
	        this.assign(method, "kind", "set", { token: this.state.prev });
	      }
	    }
	
	    method = this.parsePropertyName(method);
	
	    if (method.key.type === "Identifier" && !method.computed && method.kind !== "get" && method.kind !== "set") {
	      if (this.isClassProperty()) {
	        this.add(node, "body", this.parseClassProperty(method));
	        continue;
	      } else if (method.key.name === "call" && this.match(_types.types.name) && this.state.cur.value === "constructor") {
	        if (hasConstructorCall) {
	          this.raise(method.start, "Duplicate constructor call");
	        }
	        this.assign(method, "kind", "constructorCall", { token: this.state.prev });
	        hasConstructorCall = true;
	      }
	    }
	
	    if (method.kind == null) method.kind = "method";
	
	    if (!method.computed) {
	      var isConstructor = this.isClassConstructor(method);
	      if (isConstructor) {
	        if (hasConstructor) this.raise(method.key.start, "Duplicate constructor");
	        this.checkClassConstructorProperties(method);
	        method.kind = "constructor";
	        hasConstructor = true;
	      }
	      this.checkClassMethodName(method);
	    }
	
	    this.checkClassMethodProperties(method);
	    method = this.parseClassMethod(method, classContext);
	
	    if (method.kind === "get" || method.kind === "set") {
	      this.checkGetterSetterProperty(method);
	    }
	    this.add(node, "body", this.finishNode(method, method.lexicallyBound ? "ClassArrowMethod" : "ClassMethod"));
	  }
	
	  if (decorators.length) this.raise(this.state.start, "Class has trailing decorators");
	
	  if (!isDeclaration && isMultiline) {
	    this.eat(_types.types.newline);
	  }
	
	  node = this.finishNode(node, "ClassBody");
	  this.state.strict = oldStrict;
	  return node;
	}
	
	function parseClassProperty(node) {
	  this.assign(node, "value", this.eat(_types.types.eq) ? this.parseExpressionMaybeKeywordOrAssignment({}) : null);
	  this.eatLineTerminator();
	  return this.finishNode(node, "ClassProperty");
	}

/***/ },

/***/ 492:
/*!****************************************************!*\
  !*** ./~/horchata/lib/parser/types/expressions.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _extends2 = __webpack_require__(/*! babel-runtime/helpers/extends */ 453);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	exports.parseExpression = parseExpression;
	exports.parseExpressionMaybeSequence = parseExpressionMaybeSequence;
	exports.parseExpressionMaybeKeywordOrAssignment = parseExpressionMaybeKeywordOrAssignment;
	exports.parseConditionalExpression = parseConditionalExpression;
	exports.parseOtherKeywordExpression = parseOtherKeywordExpression;
	exports.parseExpressionOperators = parseExpressionOperators;
	exports.parseExpressionOperator = parseExpressionOperator;
	exports.parseExpressionMaybeUnary = parseExpressionMaybeUnary;
	exports.parseExpressionPrefix = parseExpressionPrefix;
	exports.parseExpressionPostfix = parseExpressionPostfix;
	exports.isArrowExpression = isArrowExpression;
	exports.isNoContinuationCallType = isNoContinuationCallType;
	exports.parseExpressionSubscripts = parseExpressionSubscripts;
	exports.parseSubscripts = parseSubscripts;
	exports.parseCallExpressionArguments = parseCallExpressionArguments;
	exports.parseExpressionAtomic = parseExpressionAtomic;
	exports.parseNoCallExpression = parseNoCallExpression;
	exports.parseBindExpression = parseBindExpression;
	exports.parseNew = parseNew;
	exports.parseNewCall = parseNewCall;
	exports.parseMaybeNoParenCall = parseMaybeNoParenCall;
	exports.parseSuper = parseSuper;
	exports.parseThisMemberExpression = parseThisMemberExpression;
	exports.parseWithExpression = parseWithExpression;
	exports.parseWithExpressionBody = parseWithExpressionBody;
	exports.parseYieldExpression = parseYieldExpression;
	exports.parseParenAndDistinguishExpression = parseParenAndDistinguishExpression;
	exports.finishParseParenAndDistinguishExpression = finishParseParenAndDistinguishExpression;
	
	var _types = __webpack_require__(/*! ../../lexer/types */ 444);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// ### Expression parsing
	
	// These nest, from the most general expression type at the top to
	// 'atomic', nondivisible expression types at the bottom. Most of
	// the functions will simply let the function(s) below them parse,
	// and, *if* the syntactic construct they handle is present, wrap
	// the AST node that the inner parser gave them in another node.
	
	// Parse a full expression. The expressionContext is used to:
	// * forbid the `in` operator (in for loops initalization expressions)
	// * provide reference for storing '=' operator inside shorthand
	//   property assignment in contexts where both object expression
	//   and object pattern might appear (so it's possible to raise
	//   delayed syntax error at correct position).
	
	// main entry point into expression parsing. Can be used by plugins
	// since `;` is used for the sequence operator and `,` is only used for lists,
	// this should be used wherever `parseMaybeAssign` would be in acorn or babylon.
	function parseExpression() {
	  var expressionContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var callbacks = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  return this.parseExpressionMaybeSequence(expressionContext, callbacks);
	}
	
	// precedence: 0
	/*
	 * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	// A recursive descent parser operates by defining functions for all
	// syntactic elements, and recursively calling those, each function
	// advancing the input stream and returning an AST node. Precedence
	// of constructs (for example, the fact that `!x[1]` means `!(x[1])`
	// instead of `(!x)[1]` is handled by the fact that the parser
	// function that parses unary prefix operators is called first, and
	// in turn calls the function that parses `[]` subscripts — that
	// way, it'll receive the node for `x[1]` already parsed, and wraps
	// *that* in the unary operator node.
	//
	// Horchata uses an [operator precedence parser][opp] (inherited from
	// Acorn) to handle binary
	// operator precedence, because it is much more compact than using
	// the technique outlined above, which uses different, nesting
	// functions to specify precedence, for all of the ten binary
	// precedence levels that JavaScript defines.
	//
	// However, the non-left-to-right associative operators use recursive descent.
	//
	// See also: [the MDN Operator Precedence page][MDNOP]
	//
	// [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser
	// [MDNOP]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
	
	function parseExpressionMaybeSequence(expressionContext) {
	  var callbacks = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  var start = this.state.cur;
	  var expr = this.parseExpressionMaybeKeywordOrAssignment(expressionContext, callbacks);
	  if (this.match(_types.types.semi)) {
	    var node = this.startNode(start);
	    this.add(node, "expressions", expr);
	    while (this.eat(_types.types.semi)) {
	      this.add(node, "expressions", this.parseExpressionMaybeKeywordOrAssignment(expressionContext, callbacks));
	    }
	    this.checkReferencedList(node.expressions);
	    return this.finishNode(node, "SequenceExpression");
	  }
	  return expr;
	}
	
	// Parse an expression, with the highest level being an AssignmentExpression
	// This includes applications of // operators like `+=`.
	
	// Also, because of the leading if on conditional expressions, they have
	// a higher precedence than assignment expressions
	
	// precedence: 2, 3, 4
	// equivalent to parseMaybeAssign.
	function parseExpressionMaybeKeywordOrAssignment(expressionContext) {
	  var callbacks = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  var node = void 0;
	  switch (this.state.cur.type) {
	    case _types.types._yield:
	      node = this.parseYieldExpression();break;
	    case _types.types._with:
	      node = this.parseWithExpression();break;
	    case _types.types._if:
	      var cstart = this.state.cur;
	      this.next();
	      node = this.parseConditionalExpression(cstart);
	      break;
	    default:
	      var maybeOtherExpressionNode = this.parseOtherKeywordExpression();
	      if (maybeOtherExpressionNode) {
	        node = maybeOtherExpressionNode;
	        break;
	      }
	
	      var failOnShorthandAssign = expressionContext.shorthandDefaultPos == null;
	      if (failOnShorthandAssign) {
	        expressionContext.shorthandDefaultPos = { start: 0 };
	      }
	
	      var start = this.state.cur;
	
	      // tacoscript arrow functions _always_ have arguments surrounded by parens
	      // TODO: add plugin extension point here for custom function syntax, to
	      // accomodate [frappe lambdas][fl], etc from within a plugin
	      // fl: https://github.com/lydell/frappe#consistently-short-arrow-function-syntax
	      if (this.match(_types.types.parenL)) {
	        this.state.potentialLambdaOn = start;
	      }
	
	      // tacoscript conditional expressions always start with `if` or `if!`,
	      // so we don't need a parseMaybeConditional
	      node = this.parseExpressionOperators(expressionContext);
	      if (callbacks.afterLeftParse) {
	        node = callbacks.afterLeftParse.call(this, node, start);
	      }
	
	      if (this.state.cur.type.isAssign) {
	        var left = node;
	        var type = this.state.cur.type;
	        node = this.startNode(start);
	        left = this.assign(node, "left", this.convertLeftAssign(left, type));
	        expressionContext.shorthandDefaultPos.start = 0; // reset because shorthand default was used correctly
	
	        this.assign(node, "operator", this.state.cur.value, { token: this.state.cur });
	
	        this.checkAssignable(left);
	        this.next();
	
	        var right = this.parseExpressionMaybeKeywordOrAssignment(expressionContext);
	        right = this.assign(node, "right", this.convertRightAssign(right, type));
	        node = this.finishNode(node, "AssignmentExpression");
	        break;
	      }
	
	    // TODO: add plugin hook here
	  }
	  return node;
	}
	
	// expects the `if` to already be on `cur`, and the `!` to maybe be next.
	function parseConditionalExpression(start) {
	  var expressionContext = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  var node = this.startNode(start);
	  this.eat(_types.types.excl);
	  this.assign(node, "test", this.parseExpression());
	
	  this.eat(_types.types._then) || this.unexpected();
	  this.assign(node, "consequent", this.parseExpression());
	
	  this.eat(_types.types._else) || this.unexpected();
	  this.assign(node, "alternate", this.parseExpression({ isFor: expressionContext.isFor }));
	
	  return this.finishNode(node, "ConditionalExpression");
	}
	
	function parseOtherKeywordExpression() {
	  // Purposefully left empty for plugins. See docs/horchata-plugins.md#empty-functions
	  return null;
	}
	
	// TODO: make sure to unset "isFor" when it becomes irrelevent
	// isFor is equivalent to "noIn", since we could introduce more `for` iteration keywords
	// that could also be used as operators.
	
	// Start the precedence parser
	function parseExpressionOperators(expressionContext) {
	  var callType = expressionContext.callType;
	  var isFor = expressionContext.isFor;
	
	  var start = this.state.cur;
	  var node = this.parseExpressionMaybeUnary(expressionContext);
	  if (expressionContext.shorthandDefaultPos && expressionContext.shorthandDefaultPos.start) {
	    return node;
	  }
	  return this.parseExpressionOperator(node, start, -1, { callType: callType, isFor: isFor });
	}
	
	// Parse binary operators with the operator precedence parsing
	// algorithm. `left` is the left-hand side of the operator.
	// `minPrec` provides context that allows the function to stop and
	// defer further parser to one of its callers when it encounters an
	// operator that has a lower precedence than the set it is parsing.
	function parseExpressionOperator(node, start, minPrec, expressionContext) {
	  var prec = this.state.cur.type.binop;
	  if (prec != null && !(expressionContext.isFor && this.match(_types.types._in)) && prec > minPrec) {
	    var left = node;
	    node = this.startNode(start);
	    this.assign(node, "left", left);
	    this.assign(node, "operator", this.state.cur.type.estreeValue || this.state.cur.value, { token: this.state.cur });
	    this.checkExpressionOperatorLeft(node);
	
	    var op = this.state.cur.type;
	    this.next();
	
	    // rightStart needs to be stored here, since `parseExpressionMaybeUnary` will advance the parser
	    var rightStart = this.state.cur;
	    this.assign(node, "right", this.parseExpressionOperator(this.parseExpressionMaybeUnary(), rightStart, op.rightAssociative ? prec - 1 : prec, expressionContext));
	    node = this.finishNode(node, op.binopExpressionName);
	    node = this.parseExpressionOperator(node, start, minPrec, expressionContext);
	  }
	  return node;
	}
	
	// Parse unary operators, both prefix and postfix.
	function parseExpressionMaybeUnary() {
	  var expressionContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  expressionContext = (0, _extends3.default)({}, expressionContext, { isFor: false }); // `in` is allowed in unary operators
	  var node = void 0;
	  if (this.state.cur.type.prefix) {
	    node = this.parseExpressionPrefix(expressionContext);
	  } else {
	    var start = this.state.cur;
	    node = this.parseExpressionSubscripts(expressionContext);
	    if (expressionContext.shorthandDefaultPos && expressionContext.shorthandDefaultPos.start) {
	      // noop
	    } else while (this.state.cur.type.postfix) {
	        node = this.parseExpressionPostfix(node, start);
	      }
	  }
	  return node;
	}
	
	function parseExpressionPrefix(expressionContext) {
	  var callType = expressionContext.callType;
	
	  var isUpdate = this.match(_types.types.incDec);
	  var node = this.startNode();
	  this.assign(node, "operator", this.state.cur.type.estreeValue || this.state.cur.value, { token: this.state.cur });
	  node.prefix = true;
	  this.next();
	
	  // should be able to infer from child
	  // this.addExtra(node, "parenthesizedArgument", type === tt.parenL);
	  this.assign(node, "argument", this.parseExpressionMaybeUnary({ callType: callType }));
	  // this.addExtra(node, "parenthesizedArgument", node.argument.extra != null && node.argument.extra.parenthesized);
	
	  if (expressionContext.shorthandDefaultPos && expressionContext.shorthandDefaultPos.start) {
	    this.unexpected(expressionContext.shorthandDefaultPos.start);
	  }
	
	  if (isUpdate) {
	    this.checkAssignable(node.argument);
	  } else {
	    this.checkUnaryExpression(node);
	  }
	  return this.finishNode(node, isUpdate ? "UpdateExpression" : "UnaryExpression");
	}
	
	function parseExpressionPostfix(exprNode, start) {
	  var node = this.startNode(start);
	  node.prefix = false;
	  this.assign(node, "argument", exprNode);
	  this.assign(node, "operator", this.state.cur.value, { token: this.state.cur });
	  this.checkAssignable(exprNode);
	  this.next();
	  return this.finishNode(node, "UpdateExpression");
	}
	
	function isArrowExpression(node) {
	  return node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression" && node.id;
	}
	
	function isNoContinuationCallType(callType) {
	  return callType === "excl" || callType === "stmt"; // the other callType is "paren"
	}
	
	// Parse call, dot, and `[]`-subscript expressions.
	function parseExpressionSubscripts(expressionContext) {
	  var callType = expressionContext.callType;
	
	  var start = this.state.cur;
	  var potentialLambdaOn = this.state.potentialLambdaOn;
	  var node = this.parseExpressionAtomic(expressionContext);
	
	  // check if we just parsed an arrow-type function expression
	  var skipArrowSubscripts = this.isArrowExpression(node) && start.start === potentialLambdaOn.start;
	
	  if (skipArrowSubscripts || expressionContext.shorthandDefaultPos && expressionContext.shorthandDefaultPos.start) {
	    return node;
	  }
	
	  return this.parseSubscripts(node, start, { noContinuation: this.isNoContinuationCallType(callType) }, expressionContext);
	}
	
	function parseSubscripts(base, start) {
	  var subscriptContext = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	  var expressionContext = arguments[3];
	  var noCall = subscriptContext.noCall;
	  var noContinuation = subscriptContext.noContinuation;
	
	  var node = base;
	  for (;;) {
	    if (noContinuation && this.state.cur.meta.continuedPreviousLine) break;
	
	    if (!noCall && this.eat(_types.types.doubleColon)) {
	      node = this.startNode(start);
	      this.assign(node, "object", base);
	      this.assign(node, "callee", this.parseNoCallExpression(expressionContext));
	      node = this.parseSubscripts(this.finishNode(node, "BindExpression"), start, subscriptContext, expressionContext);
	      break;
	    } else if (this.eat(_types.types.dot)) {
	      node = this.startNode(start);
	      this.assign(node, "object", base);
	      this.assign(node, "property", this.parseIdentifier({ allowKeywords: true }));
	      node.computed = false;
	      base = node = this.finishNode(node, "MemberExpression");
	    } else if (this.eat(_types.types.bracketL)) {
	      node = this.startNode(start);
	      this.assign(node, "object", base);
	      this.assign(node, "property", this.parseExpression());
	      node.computed = true;
	      this.eat(_types.types.bracketR) || this.unexpected();
	      base = node = this.finishNode(node, "MemberExpression");
	    } else if (!noCall && this.eat(_types.types.parenL)) {
	      node = this.startNode(start);
	      this.assign(node, "callee", base);
	      node = this.parseCallExpressionArguments(node, _types.types.parenR, { callType: "paren" });
	      base = node = this.finishNode(node, "CallExpression");
	      this.checkReferencedList(node.arguments);
	    } else if (!noCall && this.hasFeature("exclCall") && this.eat(_types.types.excl)) {
	      node = this.startNode(start);
	      this.assign(node, "callee", base);
	      node = this.parseCallExpressionArguments(node, null, { callType: "excl" });
	      base = node = this.finishNode(node, "CallExpression");
	      this.checkReferencedList(node.arguments);
	    } else if (this.match(_types.types.backQuote)) {
	      node = this.startNode(start);
	      this.assign(node, "tag", base);
	      this.assign(node, "quasi", this.parseTemplate());
	      base = node = this.finishNode(node, "TaggedTemplateExpression");
	    } else {
	      break;
	    }
	  }
	  return node;
	}
	
	function parseCallExpressionArguments(node, close) {
	  var _this = this;
	
	  var expressionContext = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	  var callType = expressionContext.callType;
	
	  node.arguments = [];
	
	  this.parseIndentableList(close, (0, _extends3.default)({}, expressionContext, {
	    allowTrailingComma: this.isNoContinuationCallType(callType) ? 'indent' : true,
	    noTerminator: true
	  }), function () {
	    var argument = void 0;
	    if (_this.match(_types.types.ellipsis)) {
	      argument = _this.parseSpread(expressionContext);
	    } else {
	      argument = _this.parseExpression(expressionContext);
	    }
	    _this.add(node, "arguments", argument);
	  });
	
	  if (callType && callType !== "paren") {
	    this.addExtra(node, "callType", expressionContext.callType);
	  }
	
	  return node;
	}
	
	// Parse an atomic expression — an expression that can't be split.
	// This is either a single token that is an expression, an
	// expression started by a keyword like `function` or `new`, or an
	// expression wrapped in punctuation like `()`, `[]`, or `{}`.
	function parseExpressionAtomic() {
	  var expressionContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var node = void 0;
	  var canBeArrow = this.state.potentialLambdaOn.start === this.state.cur.start;
	  switch (this.state.cur.type) {
	    case _types.types._super:
	      node = this.parseSuper(node);
	      break;
	    case _types.types._this:
	      // TODO: move to a parse function
	      node = this.startNode();
	      this.next();
	      node = this.finishNode(node, "ThisExpression");
	      break;
	
	    case _types.types.name:
	      node = this.parseIdentifier();
	      // NOTE: tacoscript arrow expressions _must_ have parens, so don't worry about
	      // arrows here.
	      break;
	
	    case _types.types.regexp:
	      // TODO: move to literals
	      var value = this.state.cur.value;
	      node = this.parseLiteral(value.value, "RegExpLiteral");
	      this.addRaw(node, this.state.prev);
	      node.pattern = value.pattern;
	      node.flags = value.flags;
	      break;
	
	    // TODO: store cst info.
	    case _types.types.num:
	      node = this.parseLiteral(this.state.cur.value, "NumericLiteral");
	      break;
	
	    case _types.types.string:
	      node = this.parseLiteral(this.state.cur.value, "StringLiteral");
	      break;
	
	    case _types.types._null:
	      // TODO: move to literals
	      node = this.startNode();
	      this.next();
	      node = this.finishNode(node, "NullLiteral");
	      break;
	
	    case _types.types._true:case _types.types._false:
	      // TODO: move to literals
	      node = this.startNode();
	      this.assignRaw(node, "value", this.match(_types.types._true));
	      this.next();
	      node = this.finishNode(node, "BooleanLiteral");
	      break;
	
	    case _types.types.parenL:
	      node = this.parseParenAndDistinguishExpression(null, (0, _extends3.default)({}, expressionContext, { canBeArrow: canBeArrow }));
	      break;
	
	    case _types.types.bracketL:
	      node = this.parseArrayLiteral(expressionContext);
	      break;
	
	    case _types.types.braceL:
	      node = this.parseObjectLiteral(expressionContext);
	      break;
	
	    case _types.types._function:
	      node = this.parseFunctionExpressionNamed();
	      break;
	
	    case _types.types.at:
	      if (this.hasFeature("strudelThisMember")) {
	        node = this.parseThisMemberExpression();
	        break;
	      } else {
	        this.parseDecorators();
	      }
	    // fallthrough
	    case _types.types.relational:
	      if (this.state.cur.value === ">" && this.hasFeature("strudelThisMember")) {
	        this.parseDecorators();
	      } else {
	        this.unexpected();
	      }
	    // fallthrough
	
	    case _types.types._class:
	      node = this.parseClassExpression();
	      break;
	
	    case _types.types._new:
	      node = this.parseNew(expressionContext);
	      break;
	
	    case _types.types.backQuote:
	      node = this.parseTemplate();
	      break;
	
	    // TODO:
	    // case tt._do:
	
	    case _types.types.doubleColon:
	      node = this.parseBindExpression(expressionContext);
	      break;
	
	    default:
	      this.unexpected();
	  }
	  return node;
	}
	
	function parseNoCallExpression(expressionContext) {
	  var callType = expressionContext.callType;
	
	  var start = this.state.cur;
	  return this.parseSubscripts(this.parseExpressionAtomic(), start, { noCall: true, noContinuation: this.isNoContinuationCallType(callType) }, expressionContext);
	}
	
	// The remaining functions here are for parsing atomic expressions, alphabetized
	
	function parseBindExpression(expressionContext) {
	  var node = this.startNode();
	  this.next();
	  node.object = null;
	  var callee = this.assign(node, "callee", this.parseNoCallExpression(expressionContext));
	  if (callee.type !== "MemberExpression") {
	    this.raise(callee.start, "Binding should be performed on object property.");
	  }
	  return this.finishNode(node, "BindExpression");
	}
	
	// New's precedence is slightly tricky. It must allow its argument
	// to be a `[]` or dot subscript expression, but not a call — at
	// least, not without wrapping it in parentheses. Thus, it uses the
	// `noCall` option of `parseSubscripts` to prevent the parser from
	// consuming the arugment list.
	
	function parseNew(expressionContext) {
	  var node = this.startNode();
	  var meta = this.parseIdentifier({ allowKeywords: true, convertKeywordToken: false }); // also eats the `new`
	  if (this.eat(_types.types.dot)) {
	    this.assign(node, "meta", meta);
	    this.assign(node, "property", this.parseIdentifier({ allowKeywords: true }));
	
	    if (node.property.name !== "target") {
	      this.raise(node.property.start, "The only valid meta property for new is new.target");
	    }
	    this.checkMetaProperty(node);
	    node = this.finishNode(node, "MetaProperty");
	  } else {
	    node = this.parseNewCall(node, undefined, {}, expressionContext);
	  }
	  return node;
	}
	
	// With noParenCalls, new's precedence is even trickier. It must allow
	// a new to be invoked as a paren-less call, or, if there are parens,
	// for the result of the new to be invoked. Even though it usually
	// doesn't make sense to do this, it's still required for completion.
	
	// new Function "foo", "console.log(foo)"
	// vs
	// new Function("foo", "console.log(foo)") "bar"
	
	// In the latter case, this actually will return a "CallExpression", with
	// the "NewExpression" as the callee.
	
	function parseNewCall(node, start) {
	  var newContext = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	  var expressionContext = arguments[3];
	  var callType = newContext.callType;
	
	  this.assign(node, "callee", this.parseNoCallExpression(expressionContext));
	  if (this.eat(_types.types.parenL)) {
	    node = this.parseCallExpressionArguments(node, _types.types.parenR, { callType: "paren" });
	    node = this.finishNode(node, "NewExpression");
	
	    if (callType === 'stmt') {
	      // new Function("foo", "console.log(foo)") "bar"
	      node = this.parseMaybeNoParenCall(node, start);
	    }
	  } else if (this.hasFeature("exclCall") && this.eat(_types.types.excl)) {
	    node = this.parseCallExpressionArguments(node, null, { callType: "excl" });
	    node = this.finishNode(node, "NewExpression");
	  } else if (callType === 'stmt') {
	    if (this.match(_types.types.indent) || !this.matchLineTerminator()) {
	      node = this.parseCallExpressionArguments(node, null, { callType: callType });
	    } else {
	      node.arguments = [];
	      this.addExtra(node, "noParens", true);
	    }
	    node = this.finishNode(node, "NewExpression");
	  } else {
	    node.arguments = [];
	    this.addExtra(node, "noParens", true);
	    node = this.finishNode(node, "NewExpression");
	  }
	  return node;
	}
	
	function parseMaybeNoParenCall(expr, start) {
	  var node = expr;
	
	  if (this.match(_types.types.indent) || !this.matchLineTerminator()) {
	    node = this.startNode(start);
	    this.assign(node, "callee", expr);
	    node = this.parseCallExpressionArguments(node, null, { callType: "stmt" });
	    node = this.finishNode(node, "CallExpression");
	  }
	  return node;
	}
	
	function parseSuper() {
	  this.preCheckSuper();
	  var node = this.startNode();
	  this.next();
	  if (!this.match(_types.types.parenL) && !this.match(_types.types.bracketL) && !this.match(_types.types.dot)) {
	    this.unexpected();
	  }
	
	  this.checkSuper(node);
	  return this.finishNode(node, "Super");
	}
	
	function parseThisMemberExpression() {
	  var node = this.startNode();
	  this.next();
	  this.assign(node, "property", this.parseIdentifier({ allowKeywords: true }));
	  return this.finishNode(node, "ThisMemberExpression");
	}
	
	function parseWithExpression() {
	  var start = arguments.length <= 0 || arguments[0] === undefined ? this.state.cur : arguments[0];
	
	  var node = this.startNode(start);
	  if (start === this.state.cur) {
	    this.eat(_types.types._with) || this.unexpected();
	  }
	  return this.parseWithExpressionBody(node);
	}
	
	function parseWithExpressionBody(node) {
	  this.abort("Deprecated with statements require `!` after `with`. Enable a with expression plugin (such as iife-with) to use with expressions.");
	}
	
	// Parses yield expression inside generator.
	function parseYieldExpression() {
	  var node = this.startNode();
	  this.next();
	  if (this.matchLineTerminator() || !this.match(_types.types.star) && !this.state.cur.type.startsExpr) {
	    node.delegate = false;
	    node.argument = null;
	  } else {
	    node.delegate = this.eat(_types.types.star);
	    if (node.delegate) this.assignToken(node, "delegate", "*", { token: this.state.prev });
	    this.assign(node, "argument", this.parseExpressionMaybeKeywordOrAssignment({}));
	  }
	  return this.finishNode(node, "YieldExpression");
	}
	
	// Parse an expression grouped by parenthises -- could be
	// * an expression
	// * a comprehension
	// * arguments for an anonymous function
	// * anything else that a plugin might want to add (ex. flow type annotations)
	// Our job is to distinguish which of these things it is, and
	function parseParenAndDistinguishExpression(start) {
	  var expressionContext = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  if (start == null) start = this.state.cur;
	
	  var node = this.startNode(start);
	
	  this.next();
	
	  return this.finishParseParenAndDistinguishExpression(node, expressionContext);
	}
	
	// overridden by iife and generator expression plugins
	function finishParseParenAndDistinguishExpression(node, expressionContext) {
	  var _this2 = this;
	
	  var canBeArrow = expressionContext.canBeArrow;
	
	  var maybeFunction = node;
	  maybeFunction.params = [];
	
	  var childExpressionContext = {
	    shorthandDefaultPos: { start: 0 }
	  };
	  var spreadStart = void 0;
	
	  var _parseIndentableList = this.parseIndentableList(_types.types.parenR, expressionContext, function () {
	    var element = void 0;
	    if (_this2.match(_types.types.ellipsis)) {
	      spreadStart = _this2.state.cur.start;
	      _this2.add(maybeFunction, "params", _this2.parseRest());
	      return "break";
	    } else {
	      element = _this2.parseExpression(childExpressionContext); // , {afterLeftParse: this.parseParenItem}
	    }
	    _this2.add(maybeFunction, "params", element);
	  });
	
	  var firstConcreteSeparatorStart = _parseIndentableList.firstConcreteSeparatorStart;
	
	
	  var maybeGenerator = this.match(_types.types.star);
	  if (canBeArrow && (this.match(_types.types.arrow) || maybeGenerator && this.matchNext(_types.types.arrow))) {
	    node = this.parseArrowExpression(maybeFunction, {}, childExpressionContext);
	  } else if (maybeFunction.params.length === 0) {
	    this.unexpected(this.state.prev.start);
	  } else if (spreadStart) {
	    this.unexpected(spreadStart);
	  } else if (childExpressionContext.shorthandDefaultPos.start) {
	    this.unexpected(childExpressionContext.shorthandDefaultPos.start);
	  } else if (firstConcreteSeparatorStart) {
	    this.unexpected(firstConcreteSeparatorStart);
	  } else if (maybeFunction.params.length > 1) {
	    this.raise(this.state.pos, "Arguments list is not attached to a function");
	  } else {
	    node = maybeFunction.params[0];
	    this.addExtra(node, "parenthesized", true);
	    this.addExtra(node, "parenStart", maybeFunction.start);
	    this.addExtra(node, "parenEnd", maybeFunction.end);
	    (node.extra.parens == null ? node.extra.parens = [] : node.extra.parens).push({
	      start: maybeFunction.start,
	      end: maybeFunction.end
	    });
	  }
	
	  return node;
	}

/***/ },

/***/ 493:
/*!*************************************************!*\
  !*** ./~/horchata/lib/parser/types/literals.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _create = __webpack_require__(/*! babel-runtime/core-js/object/create */ 473);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _extends2 = __webpack_require__(/*! babel-runtime/helpers/extends */ 453);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	exports.convertLeftAssign = convertLeftAssign;
	exports.convertRightAssign = convertRightAssign;
	exports.toAssignable = toAssignable;
	exports.toAssignableList = toAssignableList;
	exports.toArguments = toArguments;
	exports.parseDeclarationAssignable = parseDeclarationAssignable;
	exports.parseBindingAtomic = parseBindingAtomic;
	exports.parseBindingList = parseBindingList;
	exports.parseSpread = parseSpread;
	exports.parseRest = parseRest;
	exports.parseAssignableListItemTypes = parseAssignableListItemTypes;
	exports.parseMaybeDefault = parseMaybeDefault;
	exports.parseIdentifier = parseIdentifier;
	exports.parseLiteral = parseLiteral;
	exports.parseArrayLiteral = parseArrayLiteral;
	exports.parseExpressionList = parseExpressionList;
	exports.parseObjectLiteral = parseObjectLiteral;
	exports.parseObjectBinding = parseObjectBinding;
	exports.parseObject = parseObject;
	exports.parsePropertyName = parsePropertyName;
	exports.parsePropertyValue = parsePropertyValue;
	
	var _types = __webpack_require__(/*! ../../lexer/types */ 444);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function convertLeftAssign(node, tokType) {
	  if (tokType === _types.types.eq) {
	    return this.toAssignable(node);
	  }
	  return node;
	} // "atomics" and types.
	// TOOD: rename "types" in generator to "literals"
	
	// this file is roughly equivalent to lval from acorn and babylon
	// and also contains content from expression in acorn/babel
	// Ident(ifier), Templates, Obj literal, Obj binding, properties, array literals & bindings
	
	// this differs from acorn and babylon in that this function checks the token's
	// type so that custom lval patterns can be invented. If someone wants to do
	// that. >_<
	
	function convertRightAssign(node /*, tokType*/) {
	  return node;
	}
	
	// Convert existing, already parsed expression atom to assignable pattern
	// if possible.
	function toAssignable(node) {
	  var assignableContext = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  if (node == null) return node;
	  var isBinding = assignableContext.isBinding;
	  // TODO: finish converting this function.
	
	  switch (node.type) {
	    case "Identifier":
	    case "ObjectPattern":
	    case "ArrayPattern":
	    case "AssignmentPattern":
	      // already assignable
	      break;
	
	    // TODO: rcreate a child object that is a "Converter" that performs these kinds
	    // of tasks
	    case "ObjectExpression":
	      node.type = "ObjectPattern";
	      for (var i = 0; i < node.properties.length; i++) {
	        var prop = node.properties[i];
	        if (prop.kind !== "init") this.raise(prop.key.start, "Object pattern can't contain getter or setter");
	        this.toAssignable(prop.value, assignableContext);
	      }
	      break;
	
	    case "ArrayExpression":
	      node.type = "ArrayPattern";
	      this.toAssignableList(node.elements, assignableContext);
	      break;
	
	    case "AssignmentExpression":
	      if (node.operator === "=") {
	        node.type = "AssignmentPattern";
	        this.unassign(node, "operator");
	      } else {
	        this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
	        break;
	      }
	      break;
	
	    case "ParenthesizedExpression":
	      node.expression = this.toAssignable(node.expression, assignableContext);
	      break;
	
	    case "MemberExpression":
	    case "ThisMemberExpression":
	      if (!isBinding) break;
	
	    default:
	      this.raise(node.start, "Assigning to rvalue");
	  }
	  return node;
	}
	
	// Convert list of expression atoms to binding list.
	function toAssignableList(exprList) {
	  var assignableContext = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var isBinding = assignableContext.isBinding;
	
	  var end = exprList.length;
	  if (end) {
	    var last = exprList[end - 1];
	    if (last && last.type == "RestElement") {
	      --end;
	    } else if (last && last.type == "SpreadElement") {
	      // Convert SpreadElement to RestElement
	      last.type = "RestElement";
	      var node = last.argument;
	      node = this.toAssignable(node, assignableContext);
	      if (node.type !== "Identifier" && node.type !== "MemberExpression" && node.type !== "ArrayPattern") {
	        this.unexpected(node.start);
	      }
	      --end;
	    }
	
	    if (isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
	      this.unexpected(last.argument.start);
	    }
	  }
	  for (var i = 0; i < end; i++) {
	    exprList[i] = this.toAssignable(exprList[i], assignableContext);
	  }
	  return exprList;
	}
	
	function toArguments(elements) {
	  return this.toAssignableList(elements, { isBinding: true });
	}
	
	// equivalent to parseVarId / parseVarHead
	function parseDeclarationAssignable(node) {
	  this.assign(node, "id", this.parseBindingAtomic());
	  this.checkAssignable(node.id, { isBinding: true });
	  return node;
	}
	
	// Parses lvalue (assignable) atom.
	// equivalent to parseBindingAtom
	function parseBindingAtomic() {
	  switch (this.state.cur.type) {
	
	    case _types.types.name:
	      return this.parseIdentifier();
	
	    case _types.types.bracketL:
	      var node = this.startNode();
	      this.next();
	      node = this.parseBindingList(node, "elements", _types.types.bracketR, { allowEmpty: true, allowTrailingComma: true });
	      return this.finishNode(node, "ArrayPattern");
	
	    case _types.types.braceL:
	      return this.parseObjectBinding();
	
	    default:
	      this.unexpected();
	  }
	}
	
	function parseBindingList(parent, key, close) {
	  var _this = this;
	
	  var bindingListContext = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	  var allowEmpty = bindingListContext.allowEmpty;
	
	  parent[key] = [];
	
	  this.parseIndentableList(close, bindingListContext, function () {
	    var node = void 0,
	        token = void 0;
	    if (allowEmpty && _this.eat(_types.types._pass)) {
	      node = null;
	      token = _this.state.prev;
	    } else if (_this.match(_types.types.ellipsis)) {
	      node = _this.parseRest();
	    } else {
	      node = _this.parseMaybeDefault();
	    }
	    node = _this.parseAssignableListItemTypes(node);
	    _this.add(parent, key, node, { token: token });
	  });
	
	  return parent;
	}
	
	// TODO: move this and parseRest into literals
	function parseSpread(expressionContext) {
	  var node = this.startNode();
	  this.next();
	  this.assign(node, "argument", this.parseExpressionMaybeKeywordOrAssignment(expressionContext));
	  return this.finishNode(node, "SpreadElement");
	}
	
	function parseRest() {
	  var identifierContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var node = this.startNode();
	  this.next();
	  this.assign(node, "argument", this.parseIdentifier(identifierContext));
	  return this.finishNode(node, "RestElement");
	}
	
	// for flow? probably.
	function parseAssignableListItemTypes(param) {
	  return param;
	}
	
	// Parses assignment pattern around given atom if possible.
	function parseMaybeDefault(start, left) {
	  if (start == null) start = this.state.cur;
	  if (left == null) left = this.parseBindingAtomic();
	  var node = void 0;
	  if (this.eat(_types.types.eq)) {
	    node = this.startNode(start);
	    this.assign(node, "left", left);
	    this.assign(node, "right", this.parseExpression());
	    node = this.finishNode(node, "AssignmentPattern");
	  } else {
	    node = left;
	  }
	  return node;
	}
	
	// Parse the next token as an identifier. If `allowKeywords` is true (used
	// when parsing properties), it will also convert keywords into
	// identifiers, including the token type.
	function parseIdentifier() {
	  var identifierContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  // equivalent to `liberal` in acorn/babylon
	  var allowKeywords = !!identifierContext.allowKeywords;
	  var convertKeywordToken = !(identifierContext.convertKeywordToken === false);
	  var isOptional = !!identifierContext.isOptional;
	
	  var node = this.startNode();
	  if (this.match(_types.types.name)) {
	    this.checkIdentifierName(identifierContext);
	    this.assignRaw(node, "name", this.state.cur.value.value);
	  } else if (allowKeywords && this.state.cur.type.keyword) {
	    var name = this.state.cur.type.keyword;
	    if (convertKeywordToken) this.state.cur.type = _types.types.name;
	    this.assignRaw(node, "name", name);
	    // TODO: set this value accordingly
	    // this.state.cur.value = {}
	  } else if (isOptional) {
	      return null;
	    } else {
	      this.unexpected();
	    }
	
	  this.next();
	  return this.finishNode(node, "Identifier");
	}
	
	function parseLiteral(value, type) {
	  var node = this.startNode();
	  this.assignRaw(node, "value", value);
	  this.next();
	  return this.finishNode(node, type);
	}
	
	// override me to implement array comprehensions, etc.
	function parseArrayLiteral(expressionContext) {
	  var node = this.startNode();
	  this.next();
	  node = this.parseExpressionList(node, "elements", _types.types.bracketR, (0, _extends3.default)({}, expressionContext, { allowEmpty: true, allowTrailingComma: true }));
	  return this.finishNode(node, "ArrayExpression");
	}
	
	// TODO: use for call expressions.
	function parseExpressionList(parent, key, close, expressionContext) {
	  var _this2 = this;
	
	  var allowEmpty = expressionContext.allowEmpty;
	
	  parent[key] = [];
	  this.parseIndentableList(close, expressionContext, function () {
	    var node = void 0,
	        token = void 0;
	    if (allowEmpty && _this2.eat(_types.types._pass)) {
	      node = null;
	      token = _this2.state.prev;
	    } else if (_this2.match(_types.types.ellipsis)) {
	      node = _this2.parseSpread(expressionContext);
	    } else {
	      node = _this2.parseExpression();
	    }
	    _this2.add(parent, key, node, { token: token });
	  });
	
	  return parent;
	}
	
	// Parse an object literal
	function parseObjectLiteral(expressionContext) {
	  return this.parseObject(false, expressionContext);
	}
	
	// Parse an object binding pattern
	function parseObjectBinding() {
	  return this.parseObject(true, {});
	}
	
	function parseObject(isPattern, expressionContext) {
	  var _this3 = this;
	
	  var decorators = [];
	  var propHash = (0, _create2.default)(null);
	  var node = this.startNode();
	  node.properties = [];
	
	  this.next();
	
	  var atDecorator = !this.hasFeature("strudelThisMember");
	
	  this.parseIndentableList(_types.types.braceR, { allowTrailingComma: true }, function () {
	    var propertyContext = {};
	
	    while (atDecorator ? _this3.match(_types.types.at) : _this3.match(_types.types.relational) && _this3.state.cur.value === ">") {
	      decorators.push(_this3.parseDecorator());
	      _this3.eat(_types.types.newline);
	    }
	
	    var prop = void 0;
	    var start = void 0;
	    if (_this3.match(_types.types.ellipsis)) {
	      if (decorators.length > 0) _this3.raise(_this3.state.cur.start, "Decorators cannot be attached to an ellipsis");
	      prop = isPattern ? _this3.parseRest() : _this3.parseSpread(expressionContext);
	    } else {
	      prop = _this3.startNode();
	
	      _this3.addAll(prop, "decorators", decorators);
	      decorators = [];
	
	      prop.method = false;
	      prop.shorthand = false;
	
	      if (isPattern || expressionContext.shorthandDefaultPos) {
	        start = _this3.state.cur;
	      }
	
	      if (!isPattern && !_this3.matchNext(_types.types.colon) && !_this3.matchNext(_types.types.parenL)) {
	        if (_this3.eat(_types.types._get)) {
	          propertyContext.kind = "get";
	        } else if (_this3.eat(_types.types._set)) {
	          propertyContext.kind = "set";
	        }
	      }
	
	      prop = _this3.parsePropertyName(prop);
	      prop = _this3.parsePropertyValue(prop, start, isPattern, propertyContext, expressionContext);
	
	      _this3.checkPropClash(prop, propHash);
	    }
	    _this3.add(node, "properties", prop);
	  });
	
	  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
	}
	
	function parsePropertyName(prop) {
	  if (this.eat(_types.types.bracketL)) {
	    prop.computed = true;
	    this.assign(prop, "key", this.parseExpression());
	    this.eat(_types.types.bracketR) || this.unexpected();
	  } else {
	    prop.computed = false;
	    this.assign(prop, "key", this.match(_types.types.num) || this.match(_types.types.string) ? this.parseExpressionAtomic() : this.parseIdentifier({ allowKeywords: true }));
	  }
	  return prop;
	}
	
	function parsePropertyValue(prop, start, isPattern, propertyContext, expressionContext) {
	  if (propertyContext.kind === "get" || propertyContext.kind === "set") {
	    prop.kind = propertyContext.kind;
	    prop = this.parseMethod(prop);
	    this.checkGetterSetterProperty(prop);
	    // TODO: check if a setter is allowed to return a value, and deny arrows if so
	    prop = this.finishNode(prop, prop.lexicallyBound ? "ObjectArrowMethod" : "ObjectMethod");
	  } else if (this.match(_types.types.parenL)) {
	    prop.kind = "method";
	    prop.method = true;
	    prop = this.parseMethod(prop, { allowEmpty: true });
	    prop = this.finishNode(prop, prop.lexicallyBound ? "ObjectArrowMethod" : "ObjectMethod");
	  } else if (this.eat(_types.types.colon)) {
	    prop.kind = "init";
	    this.assign(prop, "value", isPattern ? this.parseMaybeDefault() : this.parseExpression(expressionContext));
	    prop = this.finishNode(prop, "ObjectProperty");
	  } else if (!prop.computed && prop.key.type === "Identifier") {
	    prop.kind = "init";
	    this.popReference(prop, "key"); // since this is shorthand, only the value will be in sourceElements
	    if (isPattern) {
	      this.checkShorthandPropertyBinding(prop);
	      this.assign(prop, "value", this.parseMaybeDefault(start, prop.key.__clone()));
	    } else if (this.match(_types.types.eq) && expressionContext.shorthandDefaultPos) {
	      if (!expressionContext.shorthandDefaultPos.start) {
	        expressionContext.shorthandDefaultPos.start = this.state.cur.start;
	      }
	      this.assign(prop, "value", this.parseMaybeDefault(start, prop.key.__clone()));
	    } else {
	      this.assign(prop, "value", prop.key.__clone());
	    }
	    prop.shorthand = true;
	    this.addExtra(prop, "shorthand", true);
	    prop = this.finishNode(prop, "ObjectProperty");
	  } else {
	    this.unexpected();
	  }
	  return prop;
	}

/***/ },

/***/ 494:
/*!************************************************!*\
  !*** ./~/horchata/lib/parser/types/methods.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.initFunction = initFunction;
	exports.parseMethod = parseMethod;
	exports.parseClassMethod = parseClassMethod;
	exports.parseArrowExpression = parseArrowExpression;
	exports.parseArrowExpressionFunction = parseArrowExpressionFunction;
	exports.ensureArrowExpressionBodyMetadata = ensureArrowExpressionBodyMetadata;
	exports.parseFunctionBody = parseFunctionBody;
	exports.parseFunctionDeclaration = parseFunctionDeclaration;
	exports.parseFunctionExpressionNamed = parseFunctionExpressionNamed;
	exports.parseFunctionNamed = parseFunctionNamed;
	exports.parseFunctionParams = parseFunctionParams;
	exports.parseArrowNamed = parseArrowNamed;
	exports.maybeTransformArrowFunctionBody = maybeTransformArrowFunctionBody;
	
	var _types = __webpack_require__(/*! ../../lexer/types */ 444);
	
	// Initialize empty function node.
	
	function initFunction(node) {
	  node.id = null;
	  node.generator = false;
	  node.expression = false;
	  node.async = false;
	}
	
	// Parse object or class method.
	/*
	 * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	function parseMethod(node) {
	  var functionContext = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var callbacks = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  var oldInMethod = this.state.inMethod;
	  this.state.inMethod = node.kind || true;
	  this.initFunction(node);
	  node = this.parseFunctionParams(node, functionContext);
	  node = this.parseArrowNamed(node, functionContext);
	  var afterArrowParse = callbacks.afterArrowParse;
	
	  if (afterArrowParse) afterArrowParse.call(this, node, functionContext);
	  node = this.parseFunctionBody(node, functionContext);
	  this.state.inMethod = oldInMethod;
	  return node;
	}
	
	function parseClassMethod(method, functionContext) {
	  return this.parseMethod(method, functionContext, {
	    afterArrowParse: function afterArrowParse(method /*, functionContext*/) {
	      if (method.kind === "constructor") {
	        this.checkClassConstructorProperties(method);
	      }
	    }
	  });
	}
	
	// Parse arrow function expression with given parameters.
	
	// current token position is on the '*' or the arrow (of any arrow type)
	// so the first job of this function is to figure out what kind of function this is.
	function parseArrowExpression(node) {
	  this.initFunction(node);
	  node.params = this.toArguments(node.params);
	  node.generator = this.eat(_types.types.star);
	  var generatorPos = void 0;
	  if (node.generator) {
	    this.assignToken(node, "generator", "*", { token: this.state.prev });
	    generatorPos = this.state.prev.start;
	  }
	
	  var isArrowFunction = void 0,
	      implicitReturn = void 0;
	  var arrow = this.state.cur;
	  this.next();
	  switch (arrow.value) {
	    case '+=>':case '+=>>':
	      node.async = true;
	    // fallthrough
	    case '=>':case '=>>':
	      if (node.generator && !this.options.allowArrowFunctionGenerators) {
	        this.raise(generatorPos, "Arrow functions cannot be generators");
	      }
	      isArrowFunction = true;
	      implicitReturn = arrow.value === '=>>' || arrow.value === '+=>>';
	      if (implicitReturn && !this.hasFeature('implicitReturnFunctions')) {
	        node = this.parseArrowExpressionFunction(node);
	      } else {
	        node = this.parseFunctionBody(node, { allowConcise: true, implicitReturn: implicitReturn });
	        if (implicitReturn) node = this.maybeTransformArrowFunctionBody(node);
	      }
	      break;
	
	    case '+>':case '+>>':
	      node.async = true;
	    // fallthrough
	    case '->':case '->>':
	      isArrowFunction = false;
	      var functionContext = { allowConcise: true };
	      if (arrow.value === '->>' || arrow.value === '+>>') {
	        functionContext.implicitReturn = true;
	      }
	      node = this.parseFunctionBody(node, functionContext);
	      break;
	    default:
	      this.unexpected();
	  }
	  node = this.finishNode(node, isArrowFunction ? "ArrowFunctionExpression" : "FunctionExpression");
	  return node;
	}
	
	function parseArrowExpressionFunction(node) {
	  var indent = this.eat(_types.types.indent);
	  if (indent) this.eat(_types.types.newline);
	  // TODO: override to allow implicit return expressions with a body
	  this.assign(node, "body", this.parseExpression());
	  if (indent) {
	    this.eat(_types.types.newline);
	    this.eat(_types.types.dedent) || this.unexpected();
	  }
	  // TODO: move this to validation functions
	  this.ensureArrowExpressionBodyMetadata(node.body);
	  node.expression = true;
	  this.checkArrowExpressionFunction(node);
	  return node;
	}
	
	function ensureArrowExpressionBodyMetadata(expr) {
	  if (expr.type === "ObjectExpression" && !(expr.extra != null && expr.extra.parenthesized)) {
	    this.addExtra(expr, "parenthesized", true);
	    this.addExtra(expr, "fakeParens", true);
	  }
	}
	
	// Parse function body and check parameters.
	
	function parseFunctionBody(node) {
	  var functionContext = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  var allowConcise = !!functionContext.allowConcise;
	  var implicitReturn = !!functionContext.implicitReturn;
	  // Start a new scope with regard to labels and the `inFunction`
	  // flag (restore them to their old value afterwards).
	
	  // TODO: pass this down in the recursive descent in a `scope` argument instead of
	  // storing in state.
	  var oldInFunc = this.state.inFunction;
	  var oldinForHeaderInit = this.state.inForHeaderInit;
	  var oldInGen = this.state.inGenerator;
	  var oldLabels = this.state.labels;
	  this.state.inFunction = true;
	  this.state.inGenerator = node.generator;
	  this.state.labels = [];
	
	  this.assign(node, "body", this.parseBlock({ allowDirectives: true, allowConcise: allowConcise, implicitReturn: implicitReturn }));
	  node.expression = false;
	
	  this.state.inFunction = oldInFunc;
	  this.state.inForHeaderInit = oldinForHeaderInit;
	  this.state.inGenerator = oldInGen;
	  this.state.labels = oldLabels;
	
	  this.checkFunctionBody(node);
	  return node;
	}
	
	function parseFunctionDeclaration(node) {
	  var functionContext = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  this.next();
	  this.initFunction(node);
	  functionContext.isStatement = true;
	  functionContext.allowConcise = true;
	  node = this.parseFunctionNamed(node, {}, functionContext);
	  return this.finishNode(node, node.lexicallyBound ? "ArrowFunctionDeclaration" : "FunctionDeclaration");
	}
	
	function parseFunctionExpressionNamed() {
	  var node = this.startNode();
	  this.next();
	  this.initFunction(node);
	  node = this.parseFunctionNamed(node, {}, { allowConcise: true });
	  return this.finishNode(node, node.lexicallyBound ? "NamedArrowFunctionExpression" : "FunctionExpression");
	}
	
	function parseFunctionNamed(node, identifierContext, functionContext) {
	  this.assign(node, "id", this.parseIdentifier(identifierContext));
	  node = this.parseFunctionParams(node, functionContext);
	  node = this.parseArrowNamed(node, functionContext);
	  node = this.parseFunctionBody(node, functionContext);
	  return node;
	}
	
	function parseFunctionParams(node /*, functionContext*/) {
	  this.eat(_types.types.parenL) || this.unexpected();
	  return this.parseBindingList(node, "params", _types.types.parenR, { allowTrailingComma: true });
	}
	
	function parseArrowNamed(node, functionContext) {
	  node.generator = this.eat(_types.types.star);
	  if (node.generator) this.assignToken(node, "generator", "*", { token: this.state.prev });
	  this.match(_types.types.arrow) || this.unexpected();
	
	  switch (this.state.cur.value) {
	    case '->>':case '=>>':case '+>>':case '+=>>':
	      if (this.hasFeature('implicitReturnFunctions')) functionContext.implicitReturn = true;else this.raise(this.state.cur.start, '"implicitReturnFunctions" not enabled');
	  }
	
	  switch (this.state.cur.value) {
	    case '=>':case '=>>':case '+=>':case '+=>>':
	      if (this.hasFeature('lexicallyBoundNamedFunctions')) node.lexicallyBound = true;else this.raise(this.state.cur.start, '"lexicallyBoundNamedFunctions" not enabled');
	  }
	
	  switch (this.state.cur.value) {
	    case '+>':case '+>>':case '+=>':case '+=>>':
	      node.async = true;
	    // fallthrough
	    case '->':case '->>':case '=>':case '=>>':
	      this.next();
	      break;
	    default:
	      this.unexpected();
	  }
	  return node;
	}
	
	function maybeTransformArrowFunctionBody(node) {
	  var body = node.body;
	  if (body.type === "ImplicitReturnBlockStatement" && body.body.length === 1 && body.body[0].type === "ExpressionStatement") {
	    var expr = body.body[0].expression;
	
	    node.body = expr;
	    this.ensureArrowExpressionBodyMetadata(node.body);
	    node.expression = true;
	    this.checkArrowExpressionFunction(node);
	
	    if (body.start != null) expr.start = body.start;
	    if (body.end != null) expr.end = body.end;
	    if (body.tokenStart != null) expr.tokenStart = body.tokenStart;
	    if (body.tokenEnd != null) expr.tokenEnd = body.tokenEnd;
	    if (body.loc != null) expr.loc = body.loc;
	  }
	  return node;
	}

/***/ },

/***/ 495:
/*!************************************************!*\
  !*** ./~/horchata/lib/parser/types/modules.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.parseExport = parseExport;
	exports.parseExportFrom = parseExportFrom;
	exports.parseExportSpecifiers = parseExportSpecifiers;
	exports.isExportDefaultSpecifier = isExportDefaultSpecifier;
	exports.parseExportDeclaration = parseExportDeclaration;
	exports.parseImport = parseImport;
	exports.parseImportSpecifiers = parseImportSpecifiers;
	
	var _types = __webpack_require__(/*! ../../lexer/types */ 444);
	
	// Parses module export declaration.
	function parseExport(node) {
	  var nodeType = "ExportNamedDeclaration";
	  this.next();
	  // export * from '...'
	  if (this.match(_types.types.star)) {
	    var firstSpecifier = this.startNode();
	    this.next();
	    if (this.eat(_types.types._as)) {
	      firstSpecifier.exported = this.parseIdentifier();
	      this.add(node, "specifiers", this.finishNode(firstSpecifier, "ExportNamespaceSpecifier"));
	      if (this.eat(_types.types.comma)) node = this.parseExportSpecifiers(node);
	      node = this.parseExportFrom(node);
	    } else {
	      nodeType = "ExportAllDeclaration";
	      node = this.parseExportFrom(node);
	    }
	  } else if (this.isExportDefaultSpecifier()) {
	    throw new Error("Not Implemented");
	  } else if (this.eat(_types.types._default)) {
	    // TODO: move to "parseExportDefaultDeclaration()"
	    var expr = this.startNode();
	    if (this.eat(_types.types._function)) {
	      expr = this.parseFunctionNamed(expr, { isOptional: true }, {});
	      expr = this.finishNode(expr, expr.lexicallyBound ? "ArrowFunctionDeclaration" : "FunctionDeclaration");
	    } else if (this.match(_types.types._class)) {
	      expr = this.parseClassDeclaration(expr, { optionalId: true });
	    } else {
	      expr = this.parseExpressionMaybeKeywordOrAssignment({});
	      this.eatLineTerminator();
	    }
	    this.assign(node, "declaration", expr);
	    nodeType = "ExportDefaultDeclaration";
	  } else if (this.state.cur.type.keyword) {
	    node.specifiers = [];
	    node.source = null;
	    this.assign(node, "declaration", this.parseExportDeclaration(node));
	  } else {
	    // export { x, y as z } [from '...']
	    node.declaration = null;
	    node = this.parseExportSpecifiers(node);
	    node = this.parseExportFrom(node, { isOptional: true });
	  }
	
	  this.checkExport(node);
	  node = this.consumeDecorators(node);
	  return this.finishNode(node, nodeType);
	} /*
	   * Copyright (C) 2012-2015 by various contributors (see doc/ACORN_AUTHORS)
	   * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	   *
	   * See LICENSE for full license text
	   */
	
	function parseExportFrom(node) {
	  var exportFromContext = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  var isOptional = !!exportFromContext.isOptional;
	  node.source = null;
	  if (this.eat(_types.types._from)) {
	    if (!this.match(_types.types.string)) this.unexpected();
	    this.assign(node, "source", this.parseExpressionAtomic());
	  } else if (!isOptional) this.unexpected();
	  this.eatLineTerminator();
	  return node;
	}
	
	// Parses a comma-separated list of module exports.
	function parseExportSpecifiers(parent) {
	  var _this = this;
	
	  if (!parent.specifiers) parent.specifiers = [];
	  var needsFrom = void 0;
	
	  // export { x, y as z } [from '...']
	  this.eat(_types.types.braceL) || this.unexpected();
	
	  this.parseIndentableList(_types.types.braceR, { allowTrailingComma: true }, function () {
	    var isDefault = _this.match(_types.types._default);
	    if (isDefault && !needsFrom) needsFrom = true;
	
	    var node = _this.startNode();
	    _this.assign(node, "local", _this.parseIdentifier({ allowKeywords: isDefault, convertKeywordToken: false }));
	    if (_this.eat(_types.types._as)) {
	      _this.assign(node, "exported", _this.parseIdentifier({ allowKeywords: true }));
	    } else {
	      _this.popReference(node, "local");
	      _this.assign(node, "exported", node.local.__clone());
	    }
	    _this.add(parent, "specifiers", _this.finishNode(node, "ExportSpecifier"));
	  });
	
	  // https://github.com/ember-cli/ember-cli/pull/3739
	  if (needsFrom && !this.match(_types.types._from)) {
	    this.unexpected();
	  }
	
	  return parent;
	}
	
	function isExportDefaultSpecifier() {
	  if (this.match(_types.types.name)) {
	    // TODO: flow plugin should ignore flow-specific contextual keywords
	    return true;
	  }
	
	  if (!this.match(_types.types._default)) {
	    return false;
	  }
	  this.ensureLookahead();
	  return this.matchNext(_types.types.comma) || this.matchNext(_types.types._from);
	}
	
	function parseExportDeclaration() {
	  return this.parseStatement();
	}
	
	// Parses module import declarations
	function parseImport(node) {
	  this.next();
	
	  if (this.match(_types.types.string)) {
	    node.specifiers = [];
	    this.addExtra(node, "noBrace", true);
	    this.assign(node, "source", this.parseExpressionAtomic());
	  } else {
	    node.specifiers = [];
	    node = this.parseImportSpecifiers(node);
	    this.eat(_types.types._from) || this.unexpected();
	    this.match(_types.types.string) || this.unexpected();
	    this.assign(node, "source", this.parseExpressionAtomic());
	  }
	  this.eatLineTerminator();
	  return this.finishNode(node, "ImportDeclaration");
	}
	
	// Parses a comma-separated list of module imports.
	function parseImportSpecifiers(node) {
	  var _this2 = this;
	
	  var hasDefault = false;
	  if (this.match(_types.types.name)) {
	    // import defaultObj, { x, y as z } from '...'
	    var specifier = this.startNode();
	    this.assign(specifier, "local", this.parseIdentifier());
	    this.checkAssignable(specifier.local, { isBinding: true });
	    this.add(node, "specifiers", this.finishNode(specifier, "ImportDefaultSpecifier"));
	    hasDefault = true;
	  }
	  if (!hasDefault || this.eat(_types.types.comma)) {
	    if (this.match(_types.types.star)) {
	      var _specifier = this.startNode();
	      this.next();
	      this.eat(_types.types._as) || this.unexpected();
	      this.assign(_specifier, "local", this.parseIdentifier());
	      this.checkAssignable(_specifier.local, { isBinding: true });
	      this.add(node, "specifiers", this.finishNode(_specifier, "ImportNamespaceSpecifier"));
	    } else {
	      this.eat(_types.types.braceL) || this.unexpected();
	      this.parseIndentableList(_types.types.braceR, { allowTrailingComma: true }, function () {
	        var specifier = _this2.startNode();
	        _this2.assign(specifier, "imported", _this2.parseIdentifier({ allowKeywords: true }));
	        if (_this2.eat(_types.types._as)) {
	          _this2.assign(specifier, "local", _this2.parseIdentifier());
	        } else {
	          _this2.assign(specifier, "local", specifier.imported.__clone());
	          _this2.popReference(specifier, "local");
	        }
	        _this2.checkAssignable(specifier.local, { isBinding: true });
	        _this2.add(node, "specifiers", _this2.finishNode(specifier, "ImportSpecifier"));
	      });
	    }
	  }
	  return node;
	}

/***/ },

/***/ 496:
/*!***************************************************!*\
  !*** ./~/horchata/lib/parser/types/statements.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _extends2 = __webpack_require__(/*! babel-runtime/helpers/extends */ 453);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	exports.parseStatement = parseStatement;
	exports.parseOtherStatement = parseOtherStatement;
	exports.parseDoExpressionStatement = parseDoExpressionStatement;
	exports.parseDecorators = parseDecorators;
	exports.parseDecorator = parseDecorator;
	exports.consumeDecorators = consumeDecorators;
	exports.parseBreakStatement = parseBreakStatement;
	exports.parseContinueStatement = parseContinueStatement;
	exports.parseJump = parseJump;
	exports.parseDebuggerStatement = parseDebuggerStatement;
	exports.parseDoStatement = parseDoStatement;
	exports.parseEmptyStatement = parseEmptyStatement;
	exports.parseForStatement = parseForStatement;
	exports.parseFor = parseFor;
	exports.parseForIn = parseForIn;
	exports.parseIfStatementOrConditionalExpression = parseIfStatementOrConditionalExpression;
	exports.parseIfStatement = parseIfStatement;
	exports.parseLabeledStatement = parseLabeledStatement;
	exports.parseReturnStatement = parseReturnStatement;
	exports.parseStatementBody = parseStatementBody;
	exports.parseStatementBlock = parseStatementBlock;
	exports.parseSwitchStatementMaybeSafe = parseSwitchStatementMaybeSafe;
	exports.parseSwitchStatement = parseSwitchStatement;
	exports.parseSwitchCaseBody = parseSwitchCaseBody;
	exports.parseSafeSwitchStatement = parseSafeSwitchStatement;
	exports.parseThrowStatement = parseThrowStatement;
	exports.parseTryStatement = parseTryStatement;
	exports.parseWhileStatement = parseWhileStatement;
	exports.parseWithStatementMaybeAlt = parseWithStatementMaybeAlt;
	exports.parseWithStatement = parseWithStatement;
	exports.parseDeclarationStatement = parseDeclarationStatement;
	exports.parseDeclaration = parseDeclaration;
	exports.parseExpressionStatement = parseExpressionStatement;
	
	var _types = __webpack_require__(/*! ../../lexer/types */ 444);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Atoms for marking loops
	var loopLabel = { kind: "loop" },
	    switchLabel = { kind: "switch" };
	
	// ### Statement parsing
	
	// TODO: convert to use `statementContext` instead of explicit
	//       `declaration` and `topLevel`
	/*
	 * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	function parseStatement() {
	  var declaration = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	  var topLevel = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	  var parentStatementAllowed = this.state.statementAllowed;
	  this.state.statementAllowed = true;
	  var decoratorLoc = void 0;
	
	  if (this.matchDecoratorSymbol()) {
	    decoratorLoc = this.state.cur.start;
	    this.parseDecorators();
	  }
	
	  // Most types of statements are recognized by the keyword they
	  // start with. Many are trivial to parse, some require a bit of
	  // complexity.
	
	  var start = this.state.cur;
	  var node = this.startNode();
	
	  switch (start.type) {
	    // Keywords
	    case _types.types._break:
	      node = this.parseBreakStatement(node);break;
	    case _types.types._class:
	      if (!declaration) this.unexpected();
	      node = this.parseClassDeclaration(node);break;
	    case _types.types._continue:
	      node = this.parseContinueStatement(node);break;
	    case _types.types._debugger:
	      node = this.parseDebuggerStatement(node);break;
	    case _types.types._do:
	      node = this.parseDoStatement(node);break;
	    case _types.types._export:
	      if (!this.options.allowImportExportEverywhere && !topLevel) {
	        this.raise(this.start, "`export` may only appear at the top level");
	      }
	      node = this.parseExport(node);break;
	    case _types.types._for:
	      node = this.parseForStatement(node);break;
	    case _types.types._function:
	      if (!declaration) this.unexpected();
	      node = this.parseFunctionDeclaration(node);break;
	    case _types.types._if:
	      node = this.parseIfStatementOrConditionalExpression(node);break;
	    case _types.types._import:
	      if (!this.options.allowImportExportEverywhere && !topLevel) {
	        this.raise(this.start, "`import` may only appear at the top level");
	      }
	      node = this.parseImport(node);break;
	    case _types.types._pass:
	      node = this.parseEmptyStatement(node);break;
	    case _types.types._return:
	      node = this.parseReturnStatement(node);break;
	    case _types.types._switch:
	      node = this.parseSwitchStatementMaybeSafe(node);break;
	    case _types.types._throw:
	      node = this.parseThrowStatement(node);break;
	    case _types.types._try:
	      node = this.parseTryStatement(node);break;
	    case _types.types._while:
	      node = this.parseWhileStatement(node);break;
	    case _types.types._with:
	      node = this.parseWithStatementMaybeAlt(node);break;
	
	    // Variable declaration
	    case _types.types._extern:
	      if (!this.hasFeature("externDeclarations")) {
	        this.raise(this.state.cur.start, '"externDeclarations" not enabled');
	      }
	    case _types.types._let:
	    case _types.types._const:
	      if (!declaration) this.unexpected();
	    // fallthrough
	    case _types.types._var:
	      node = this.parseDeclarationStatement(node, this.state.cur);break;
	
	    // Symbols
	    case _types.types.excl:
	      node = this.parseBlockStatement(node);break;
	
	    case _types.types._new:
	      if (this.hasFeature("statementNoParenCall") && !this.matchNext(_types.types.dot)) {
	        var _expr = this.startNode();
	        this.next();
	        node = this.parseExpressionStatement(node, this.parseNewCall(_expr, start, { callType: "stmt" }, {}));
	        break;
	      } // else fallthrough
	    default:
	      var maybeOtherStatementNode = this.parseOtherStatement(node);
	      if (maybeOtherStatementNode) {
	        node = maybeOtherStatementNode;
	        break;
	      }
	      // If the statement does not start with a statement keyword or a
	      // brace, it's an ExpressionStatement or LabeledStatement. We
	      // simply start parsing an expression, and afterwards, if the
	      // next token is a colon and the expression was a simple
	      // Identifier node, we switch to interpreting it as a label.
	
	      var maybeName = this.state.cur.value.value || this.state.cur.value;
	      var expr = this.parseExpression();
	
	      if (start.type === _types.types.name && expr.type === "Identifier" && this.eat(_types.types.colon)) {
	        node = this.parseLabeledStatement(node, maybeName, expr);
	      } else {
	        if (this.hasFeature("statementNoParenCall")) {
	          var maybeNoParenCall = this.parseMaybeNoParenCall(expr, start);
	          node = this.parseExpressionStatement(node, this.parseSubscripts(maybeNoParenCall, start, {}, {}));
	        } else {
	          node = this.parseExpressionStatement(node, expr);
	        }
	      }
	
	      if (this.state.decorators.length) {
	        this.raise(decoratorLoc, "Leading decorators must be attached to a compatible statement");
	      }
	  }
	
	  this.state.statementAllowed = parentStatementAllowed;
	  return node;
	}
	
	function parseOtherStatement() {
	  // Purposefully left empty for plugins. See docs/horchata-plugins.md#empty-functions
	
	  // TODO: move this document to docs
	  // Purposefully left empty. This is a point where it is useful for plugins
	  // to be able to extend. However, even though this function does nothing,
	  // `inner()` should still be called for all of the other plugins.
	
	  // plugins should return the node that they parsed, and should check
	  // the result of inner before trying to parse a statement themselves
	
	  // Eventually, this should be extended with better interaction between the
	  // differing precedence levels of different plugins
	  // TODO: look at sweet.js for prior art.
	
	  // usually would start with
	  // let startType = this.state.cur.type;
	  // switch(startType) { case tt._myType: ...}
	  // or
	  // if (match(tt._myType)) ...
	  return null;
	}
	
	// statement within a "do" expression
	function parseDoExpressionStatement() {
	  this.parseStatement(false);
	}
	
	function parseDecorators() {
	  var atDecorator = !this.hasFeature("strudelThisMember");
	  while (atDecorator ? this.match(_types.types.at) : this.match(_types.types.relational) && this.state.cur.value === ">") {
	    this.state.decorators.push(this.parseDecorator());
	  }
	  this.checkDecorators();
	  this.eat(_types.types.newline);
	}
	
	function parseDecorator() {
	  var node = this.startNode();
	  this.next();
	  // TODO: see if we should be more restrictive than JavaScript.
	  //       currently, we disallow expressions that don't make sense as decorators.
	  // this.assign(node, "expression", this.parseExpression());
	  this.assign(node, "expression", this.parseExpressionSubscripts({}));
	  return this.finishNode(node, "Decorator");
	}
	
	function consumeDecorators(node) {
	  this.addAll(node, "decorators", this.state.decorators);
	  this.state.decorators = [];
	  return node;
	}
	
	//// Statement parsers by type ////
	
	function parseBreakStatement(node) {
	  return this.finishNode(this.parseJump(node, "break"), "BreakStatement");
	}
	
	function parseContinueStatement(node) {
	  return this.finishNode(this.parseJump(node, "continue"), "ContinueStatement");
	}
	
	function parseJump(node, keyword) {
	  this.next();
	  if (this.match(_types.types.name)) {
	    this.assign(node, "label", this.parseIdentifier());
	  } else {
	    node.label = null;
	  }
	  this.eatLineTerminator() || this.unexpected();
	
	  this.checkJump(node, keyword);
	  return node;
	}
	
	function parseDebuggerStatement(node) {
	  this.next();
	  this.eatLineTerminator() || this.unexpected();
	  return this.finishNode(node, "DebuggerStatement");
	}
	
	function parseDoStatement(node) {
	  this.next();
	  this.state.labels.push(loopLabel);
	  this.assign(node, "body", this.parseStatementBody());
	  this.state.labels.pop();
	  this.eat(_types.types._while) || this.unexpected();
	  this.assign(node, "test", this.parseExpression());
	  this.eatLineTerminator({ allowPrev: true }) || this.unexpected();
	  return this.finishNode(node, "DoWhileStatement");
	}
	
	function parseEmptyStatement(node) {
	  this.next();
	  this.eatLineTerminator() || this.unexpected();
	  return this.finishNode(node, "EmptyStatement");
	}
	
	// Disambiguating between a `for` and a `for`/`in` or `for`/`of`
	// loop is non-trivial. Basically, we have to parse the init `var`
	// statement or expression, disallowing the `in` operator (see
	// the second parameter to `parseExpression`), and then check
	// whether the next token is `in` or `of`. When there is no init
	// part (`while` immediately after the `for`), it is a regular
	// `for` loop.
	
	function parseForStatement(node) {
	  this.next();
	  this.state.labels.push(loopLabel);
	
	  if (this.match(_types.types._while) || this.match(_types.types._update) || this.match(_types.types.indent) || this.match(_types.types._then) || this.match(_types.types.newline) || this.match(_types.types.eof) || false) {
	    node = this.parseFor(node, null);
	  } else if (this.match(_types.types._var) || this.match(_types.types._let) || this.match(_types.types._const)) {
	    var init = this.startNode();
	    var varToken = this.state.cur;
	    this.next();
	    init = this.parseDeclaration(init, varToken, { isFor: true });
	    init = this.finishNode(init, "VariableDeclaration");
	    if ((this.match(_types.types._in) || this.match(_types.types._of)) && init.declarations.length === 1 && (varToken.kind === _types.types._var || !init.declarations[0].init)) {
	      node = this.parseForIn(node, init);
	    } else {
	      node = this.parseFor(node, init);
	    }
	  } else {
	    var expressionContext = { isFor: true, shorthandDefaultPos: { start: 0 } };
	    var _init = this.parseExpression(expressionContext);
	    if (this.match(_types.types._in) || this.match(_types.types._of)) {
	      this.toAssignable(_init);
	      this.checkAssignable(_init);
	      node = this.parseForIn(node, _init);
	    } else {
	      this.checkExpression(_init, expressionContext);
	      node = this.parseFor(node, _init);
	    }
	  }
	  this.state.labels.pop();
	  return node;
	}
	
	// Parse a regular `for` loop. The disambiguation code in
	// `parseStatement` will already have parsed the init statement or
	// expression.
	
	function parseFor(node, init) {
	  this.assign(node, "init", init);
	  this.assign(node, "test", this.eat(_types.types._while) ? this.parseExpression() : null);
	  this.assign(node, "update", this.eat(_types.types._update) ? this.parseExpression() : null);
	  this.assign(node, "body", this.parseStatementBody());
	  return this.finishNode(node, "ForStatement");
	}
	
	// Parse a `for`/`in` and `for`/`of` loop, which are almost
	// same from parser's perspective.
	
	function parseForIn(node, init) {
	  var type = this.match(_types.types._in) ? "ForInStatement" : "ForOfStatement";
	  this.next();
	  this.assign(node, "left", init);
	  this.assign(node, "right", this.parseExpression());
	  this.assign(node, "body", this.parseStatementBody());
	  return this.finishNode(node, type);
	}
	
	// We overload the if keyword, so this intermediary parser is required until we
	// figure out what it is.
	function parseIfStatementOrConditionalExpression(node) {
	  var start = this.state.cur;
	  this.next();
	  if (this.match(_types.types.excl)) {
	    node = this.parseExpressionStatement(node, this.parseConditionalExpression(start));
	  } else {
	    node = this.parseIfStatement(node);
	  }
	  return node;
	}
	
	function parseIfStatement(node) {
	  this.assign(node, "test", this.parseExpression());
	  this.assign(node, "consequent", this.parseStatementBody());
	  this.assign(node, "alternate", this.eat(_types.types._else) ? this.parseStatementBody() : null);
	  return this.finishNode(node, "IfStatement");
	}
	
	function parseLabeledStatement(node, maybeName, expr) {
	  this.checkLabelName(maybeName, expr);
	  var kind = this.state.cur.type.isLoop ? "loop" : this.match(_types.types._switch) ? "switch" : null;
	  for (var i = this.state.labels.length - 1; i >= 0; i--) {
	    var label = this.state.labels[i];
	    if (label.statementStart === node.start) {
	      label.statementStart = this.state.cur.start;
	      label.kind = kind;
	    } else break;
	  }
	  this.assign(node, "label", expr);
	  this.state.labels.push({ name: maybeName, kind: kind, statementStart: this.state.cur.start });
	  this.assign(node, "body", this.parseStatement(true));
	  this.state.labels.pop();
	  return this.finishNode(node, "LabeledStatement");
	}
	
	function parseReturnStatement(node) {
	  // TODO: move to validator
	  if (!this.state.inFunction && !this.options.allowReturnOutsideFunction) this.raise(this.start, "'return' outside of function");
	  this.next();
	
	  // TODO: allow indented block-style return statement
	
	  if (this.eatLineTerminator()) {
	    node.argument = null;
	  } else {
	    this.assign(node, "argument", this.parseExpression());
	    this.eatLineTerminator({ allowPrev: true }) || this.unexpected();
	  }
	  return this.finishNode(node, "ReturnStatement");
	}
	
	function parseStatementBody() {
	  var blockContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var forceBlock = !!blockContext.forceBlock;
	  var node = void 0;
	  if (this.match(_types.types.indent)) {
	    node = this.startNode();
	    this.next();
	    this.eat(_types.types.newline);
	    this.parseBlockBody(node, (0, _extends3.default)({}, blockContext, { forceBlock: false }));
	    node = this.finishNode(node, "BlockStatement");
	  } else {
	    var ateThen = this.eat(_types.types._then);
	    if (!ateThen && this.matchLineTerminator()) {
	      node = this.startNode();
	      node = this.initBlockBody(node, {});
	      this.eatLineTerminator();
	      node = this.finishNode(node, "BlockStatement");
	    } else {
	      if (forceBlock) {
	        node = this.parseStatementBlock();
	      } else {
	        node = this.parseStatement();
	      }
	    }
	  }
	  return node;
	}
	
	function parseStatementBlock() {
	  var node = this.startNode();
	  node = this.initBlockBody(node, {});
	  this.add(node, "body", this.parseStatement());
	  return this.finishNode(node, "BlockStatement");
	}
	
	// Parse a switch, as a statement.
	function parseSwitchStatementMaybeSafe(node) {
	  this.next();
	  if (this.eat(_types.types.excl)) {
	    node = this.parseSwitchStatement(node);
	  } else {
	    node = this.parseSafeSwitchStatement(node);
	  }
	  return node;
	}
	
	function parseSwitchStatement(node) {
	  this.assign(node, "discriminant", this.parseExpression());
	  node.cases = [];
	  if (this.eatLineTerminator()) return this.finishNode(node, "SwitchStatement");
	
	  this.eat(_types.types.indent) || this.unexpected();
	  this.eat(_types.types.newline);
	
	  this.state.labels.push(switchLabel);
	
	  // Statements under must be grouped (by label) in SwitchCase
	  // nodes. `cur` is used to keep the node that we are currently
	  // adding statements to.
	
	  var sawDefault = false;
	  while (!this.match(_types.types.dedent)) {
	    var cur = this.startNode();
	    if (this.eat(_types.types._case)) {
	      this.assign(cur, "test", this.parseExpression());
	      cur = this.parseSwitchCaseBody(cur);
	    } else if (this.eat(_types.types._default)) {
	      sawDefault = sawDefault ? this.raise(this.state.prev.start, "Multiple default clauses") : true;
	      cur.test = null;
	      cur = this.parseSwitchCaseBody(cur, true);
	    } else {
	      this.unexpected();
	    }
	    this.add(node, "cases", this.finishNode(cur, "SwitchCase"));
	  }
	  this.next(); // dedent
	  this.state.labels.pop();
	
	  return this.finishNode(node, "SwitchStatement");
	}
	
	function parseSwitchCaseBody(node) {
	  var isDefault = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	  node.consequent = [];
	  var isEmpty = false;
	  if (!this.match(_types.types.indent)) {
	    isEmpty = this.eatLineTerminator() || this.match(_types.types._case);
	    if (!isEmpty) {
	      if (!isDefault) this.eat(_types.types._then) || this.unexpected();
	      this.add(node, "consequent", this.parseStatement(true));
	    }
	  }
	  if (!isEmpty && this.eat(_types.types.indent)) {
	    this.eat(_types.types.newline);
	    while (!this.eat(_types.types.dedent)) {
	      this.add(node, "consequent", this.parseStatement(true));
	    }
	    this.eat(_types.types.newline);
	  }
	  return node;
	}
	
	// should be overridden by safe switch statement plugin
	function parseSafeSwitchStatement() /*node*/{
	  this.raise(this.state.pos, "Raw switch statements require `!` after `switch`. Enable the 'safe switch statement' plugin");
	}
	
	function parseThrowStatement(node) {
	  this.next();
	  var indented = this.eat(_types.types.indent);
	  if (indented) this.eat(_types.types.newline);
	  this.assign(node, "argument", this.parseExpression());
	  if (indented) {
	    this.eat(_types.types.newline);
	    this.eat(_types.types.dedent) || this.unexpected();
	  }
	  this.eatLineTerminator() || this.unexpected();
	  return this.finishNode(node, "ThrowStatement");
	}
	
	function parseTryStatement(node) {
	  this.next();
	  this.assign(node, "block", this.parseStatementBody({ forceBlock: true }));
	  node.handler = null;
	  node.guardedHandlers = []; // always empty in js
	  if (this.match(_types.types._catch)) {
	    var clause = this.startNode();
	    this.next();
	    this.assign(clause, "param", this.parseBindingAtomic());
	    this.checkAssignable(clause.param, { isBinding: true });
	    this.assign(clause, "body", this.parseStatementBody({ forceBlock: true }));
	    this.assign(node, "handler", this.finishNode(clause, "CatchClause"));
	  }
	  this.assign(node, "finalizer", this.eat(_types.types._finally) ? this.parseStatementBody({ forceBlock: true }) : null);
	  this.checkTryStatement(node);
	  return this.finishNode(node, "TryStatement");
	}
	
	function parseWhileStatement(node) {
	  this.next();
	  this.assign(node, "test", this.parseExpression());
	  this.state.labels.push(loopLabel);
	  this.assign(node, "body", this.parseStatementBody());
	  this.state.labels.pop();
	  return this.finishNode(node, "WhileStatement");
	}
	
	function parseWithStatementMaybeAlt(node) {
	  var start = this.state.cur;
	  this.next();
	  if (this.eat(_types.types.excl)) {
	    node = this.parseWithStatement(node);
	  } else {
	    node = this.parseExpressionStatement(node, this.parseWithExpression(start));
	  }
	  return node;
	}
	
	function parseWithStatement(node) {
	  this.checkWithStatementAllowed();
	  this.assign(node, "object", this.parseExpression());
	  this.assign(node, "body", this.parseStatementBody());
	  return this.finishNode(node, "WithStatement");
	}
	
	// Parse a list of variable declarations, as a statement. Equivalent to `parseVarStatement`
	function parseDeclarationStatement(node, kindToken) {
	  this.next();
	  node = this.parseDeclaration(node, kindToken);
	  this.eatLineTerminator({ allowPrev: true }) || this.unexpected();
	  return this.finishNode(node, "VariableDeclaration");
	}
	
	// Parse a list of variable declarations. Equivalent to `parseVar`
	function parseDeclaration(node, kindToken) {
	  var _this = this;
	
	  var declarationContext = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  node.declarations = [];
	  var kind = kindToken.type.keyword;
	  this.assign(node, "kind", kind, { token: kindToken });
	  this.parseIndentableList(null, { noTerminator: declarationContext.isFor }, function () {
	    var decl = _this.startNode();
	    decl = _this.parseDeclarationAssignable(decl);
	    if (_this.eat(_types.types.eq)) {
	      _this.assign(decl, "init", _this.parseExpression(declarationContext));
	    } else {
	      decl.init = null;
	    }
	    _this.checkDeclaration(decl, kind, declarationContext);
	    _this.add(node, "declarations", _this.finishNode(decl, "VariableDeclarator"));
	  });
	  if (node.declarations.length === 0) this.unexpected();
	  return node;
	}
	
	// keep this at the bottom.
	// If we're not parsing a statement, it's an ExpressionStatement!
	function parseExpressionStatement(node, expr) {
	  this.assign(node, "expression", expr);
	  if (expr.type === "ObjectExpression" && !(expr.extra != null && expr.extra.parenthesized)) {
	    this.addExtra(expr, "parenthesized", true);
	    this.addExtra(expr, "fakeParens", true);
	  }
	  this.eatLineTerminator({ allowPrev: true }) || this.unexpected();
	  return this.finishNode(node, "ExpressionStatement");
	}

/***/ },

/***/ 497:
/*!**********************************************************!*\
  !*** ./~/horchata/lib/parser/types/template-literals.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.parseTemplate = parseTemplate;
	exports.parseTemplateElement = parseTemplateElement;
	
	var _types = __webpack_require__(/*! ../../lexer/types */ 444);
	
	// Parse template expression.
	
	function parseTemplate() {
	  var node = this.startNode();
	  this.next();
	  node.expressions = [];
	  var cur = this.parseTemplateElement();
	  this.add(node, "quasis", cur);
	  while (!cur.tail) {
	    this.eat(_types.types.dollarBraceL) || this.unexpected();
	    this.add(node, "expressions", this.parseExpression());
	    this.eat(_types.types.braceR) || this.unexpected();
	    cur = this.parseTemplateElement();
	    this.add(node, "quasis", cur);
	  }
	  this.next();
	  return this.finishNode(node, "TemplateLiteral");
	} /*
	   * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	   * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	   *
	   * See LICENSE for full license text
	   */
	
	function parseTemplateElement() {
	  var elem = this.startNode();
	  this.assignRaw(elem, "value", {
	    raw: this.input.slice(this.state.cur.start, this.state.cur.end).replace(/\r\n?/g, "\n"),
	    cooked: this.state.cur.value
	  }, { noExtra: true });
	  this.next();
	  elem.tail = this.match(_types.types.backQuote);
	  return this.finishNode(elem, "TemplateElement");
	}

/***/ },

/***/ 498:
/*!***********************************************!*\
  !*** ./~/horchata/lib/lexer/serialization.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 468);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	exports.added = added;
	
	var _forOwn = __webpack_require__(/*! lodash/forOwn */ 499);
	
	var _forOwn2 = _interopRequireDefault(_forOwn);
	
	var _includes = __webpack_require__(/*! lodash/includes */ 609);
	
	var _includes2 = _interopRequireDefault(_includes);
	
	var _types = __webpack_require__(/*! ./types */ 444);
	
	var _identifier = __webpack_require__(/*! ../util/identifier */ 447);
	
	var _repeating = __webpack_require__(/*! repeating */ 619);
	
	var _repeating2 = _interopRequireDefault(_repeating);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// helper for looking up token types
	// export const key = new Symbol("TokenTypeKey");
	//
	// update the lookup helper
	function added() {
	  (0, _forOwn2.default)(_types.types, function (tokType, keyStr) {
	    tokType.key = keyStr;
	    if (!tokType.babylonName) {
	      tokType.babylonName = keyStr;
	    }
	  });
	}
	
	// set up serialization
	
	// Data that generators (tacotruck) uses to turn tacoscript tokens into source
	// code.
	
	_types.types.eof.code = "";
	_types.types.newline.code = "\n";
	_types.types.bracketL.code = "[";
	_types.types.bracketR.code = "]";
	_types.types.braceL.code = "{";
	_types.types.braceR.code = "}";
	_types.types.parenL.code = "(";
	_types.types.parenR.code = ")";
	_types.types.comma.code = ",";
	_types.types.semi.code = ";";
	_types.types.doublesemi.code = ";;";
	_types.types.colon.code = ":";
	_types.types.doubleColon.code = "::";
	_types.types.dot.code = ".";
	_types.types.question.code = "?";
	_types.types.soak.code = "?.";
	_types.types.ellipsis.code = "...";
	_types.types.backQuote.code = "`";
	_types.types.dollarBraceL.code = "${";
	_types.types.at.code = "@";
	_types.types.excl.code = "!";
	_types.types.eq.code = "=";
	_types.types.bitwiseNOT.code = "~";
	_types.types.bitwiseOR.code = "|";
	_types.types.bitwiseXOR.code = "^";
	_types.types.bitwiseAND.code = "&";
	_types.types.modulo.code = "%";
	_types.types.star.code = "*";
	_types.types.slash.code = "/";
	_types.types.exponent.code = "*";
	
	_types.types.blockCommentStart.code = "#*";
	_types.types.blockCommentEnd.code = "*#";
	_types.types.lineCommentStart.toCode = function (token) {
	  return token.value.code || "#";
	};
	
	_types.types.whitespace.toCode = function (token) {
	  return token.value.code;
	};
	_types.types.num.toCode = function (token) {
	  return token.value.code || token.value.raw || "" + token.value.value;
	};
	_types.types.regexp.toCode = function (token) {
	  return token.value.code || token.value.raw || '/' + token.value.pattern + '/' + token.value.flags;
	};
	_types.types.string.toCode = function (token) {
	  return token.value.code || token.value.raw || (0, _stringify2.default)(token.value.value);
	};
	_types.types.template.toCode = function (token) {
	  return token.value.raw;
	};
	_types.types.name.toCode = function (token, state) {
	  // TODO: allow bare keywords when allowed, i.e. object keys
	  var code = token.value.code || token.value.raw || token.value.value;
	  if ((_types.keywords.hasOwnProperty(code) || (0, _includes2.default)(_identifier.reservedWords.strict, code)) && token.value.standalone) code = "\\$" + code;
	  return code;
	};
	_types.types.tab.toCode = function (token, state) {
	  return token.value ? (0, _repeating2.default)(state.format.indent.indent, token.value) : "";
	};
	_types.types.indent.toCode = function () {
	  // marker to parser that indentation has increased
	  return "";
	};
	_types.types.dedent.toCode = function () {
	  // marker to parser that indentation has decreased
	  return "";
	};
	
	_types.types.lineCommentBody.toCode = function (token) {
	  return token.value.code;
	};
	_types.types.blockCommentBody.toCode = function (token) {
	  return token.value.code;
	};
	
	// NOTE: proper serialization of an invalid stream of tokens is not guaranteed.
	
	// spacing required for proper parsing
	
	(0, _forOwn2.default)(_types.keywords, function (keywordType) {
	  keywordType.forceSpaceWhenAfter.keyword = true;
	  keywordType.forceSpaceWhenAfter.name = true;
	  keywordType.forceSpaceWhenAfter.num = true;
	  keywordType.forceSpaceWhenAfter.string = true;
	});
	_types.types.incDec.forceSpaceWhenAfter.plusMin = function (left, right) {
	  return left.value === "+" && right.value === "++" || left.value === "-" && right.value === "--";
	};
	_types.types.name.forceSpaceWhenAfter.keyword = true;
	_types.types.name.forceSpaceWhenAfter.name = true;
	_types.types.num.forceSpaceWhenAfter.keyword = true;
	_types.types.plusMin.forceSpaceWhenAfter.plusMin = function (left, right) {
	  return left.value === "+" && right.value === "++" || left.value === "-" && right.value === "--" || left.value === "+" && right.value === "+" || left.value === "-" && right.value === "-" || false;
	};
	_types.types.relational.forceSpaceWhenAfter.incDec = function (left, right) {
	  // http://javascript.spec.whatwg.org/#comment-syntax
	  // TODO: not necessary if generating for module mode
	  return left.value === "--" && right.value === ">";
	};
	_types.types.incDec.forceSpaceWhenAfter.excl = function (left, right) {
	  // TODO: not necessary if generating for module mode
	  return right.value === "--";
	};
	_types.types.string.forceSpaceWhenAfter.keyword = true;
	
	// formatting : todo: move to plugin
	
	(0, _forOwn2.default)(_types.keywords, function (keywordType) {
	  keywordType.formattingSpaceWhenAfter.bracketR = true;
	  keywordType.formattingSpaceWhenAfter.braceR = true;
	  keywordType.formattingSpaceWhenAfter.comma = true;
	  keywordType.formattingSpaceWhenAfter.incDec = true;
	  keywordType.formattingSpaceWhenAfter.parenR = true;
	});
	
	_types.types.plusMin.formattingSpaceAfter = function (left) {
	  return !left.meta.unary;
	};
	_types.types.plusMin.formattingSpaceWhenAfter.name = true;
	_types.types.plusMin.formattingSpaceWhenAfter.num = true;
	_types.types.plusMin.formattingSpaceWhenAfter.parenR = true;
	_types.types.plusMin.formattingSpaceWhenAfter.string = true;
	_types.types.plusMin.formattingSpaceWhenAfter.backQuote = true;
	_types.types.star.formattingSpaceWhenAfter._export = true;
	_types.types.star.formattingSpaceWhenAfter._import = true;
	_types.types.star.formattingSpaceWhenAfter.name = true;
	_types.types.star.formattingSpaceWhenAfter.num = true;
	_types.types.star.formattingSpaceWhenAfter.parenR = true;
	_types.types.star.formattingSpaceWhenAfter.bracketR = true;
	_types.types.star.formattingSpaceWhenAfter.string = true;
	_types.types.star.formattingSpaceWhenAfter.backQuote = true;
	_types.types.star.formattingSpaceAfter = function (left, right) {
	  return right.type !== _types.types.arrow;
	};
	var _arr = [_types.types.slash, _types.types.modulo, _types.types.assign, _types.types.bitShift, _types.types.bitwiseAND, _types.types.bitwiseOR, _types.types.bitwiseXOR, _types.types.equality, _types.types.relational];
	for (var _i = 0; _i < _arr.length; _i++) {
	  var tokenType = _arr[_i];
	  tokenType.formattingSpaceWhenAfter.name = true;
	  tokenType.formattingSpaceWhenAfter.num = true;
	  tokenType.formattingSpaceWhenAfter.parenR = true;
	  tokenType.formattingSpaceWhenAfter.string = true;
	  tokenType.formattingSpaceAfter = true;
	}
	
	_types.types._from.formattingSpaceWhenAfter.braceR = true;
	_types.types._of.formattingSpaceWhenAfter.braceR = true;
	_types.types.arrow.formattingSpaceAfter = function (left, right) {
	  return right.type !== _types.types.parenR && right.type !== _types.types.newline && right.type !== _types.types.comma && true;
	};
	_types.types.arrow.formattingSpaceWhenAfter.parenR = true;
	_types.types.bracketL.formattingSpaceWhenAfter.arrow = true;
	_types.types.bracketL.formattingSpaceWhenAfter.comma = true;
	_types.types.bracketL.formattingSpaceWhenAfter.eq = true;
	_types.types.bracketL.formattingSpaceWhenAfter.keyword = function (left) {
	  return left.type !== _types.types._super && left.type !== _types.types._this && true;
	};
	_types.types.braceL.formattingSpaceWhenAfter.arrow = true;
	_types.types.braceL.formattingSpaceWhenAfter.comma = true;
	_types.types.braceL.formattingSpaceWhenAfter.keyword = true;
	_types.types.colon.formattingSpaceAfter = true;
	// tt.comma.formattingSpaceAfter = true;
	_types.types.incDec.formattingSpaceWhenAfter.keyword = true;
	_types.types.ellipsis.formattingSpaceWhenAfter.comma = true;
	_types.types.doublesemi.formattingSpaceWhenAfter.doublesemi = true;
	_types.types.doublesemi.formattingSpaceWhenAfter._then = true;
	_types.types.doublesemi.formattingSpaceAfter = true;
	_types.types.eq.formattingSpaceAfter = true;
	_types.types.eq.formattingSpaceWhenAfter.name = true;
	_types.types.eq.formattingSpaceWhenAfter.braceR = true;
	_types.types.eq.formattingSpaceWhenAfter.bracketR = true;
	_types.types.name.formattingSpaceWhenAfter.arrow = true;
	_types.types.name.formattingSpaceWhenAfter.backQuote = true;
	_types.types.name.formattingSpaceWhenAfter.comma = true;
	_types.types.name.formattingSpaceWhenAfter.excl = true;
	_types.types.num.formattingSpaceWhenAfter.arrow = true;
	_types.types.num.formattingSpaceWhenAfter.comma = true;
	_types.types.num.formattingSpaceWhenAfter.excl = true;
	_types.types.parenL.formattingSpaceWhenAfter.arrow = true;
	_types.types.parenL.formattingSpaceWhenAfter.comma = true;
	_types.types.parenL.formattingSpaceWhenAfter.excl = true;
	_types.types.parenL.formattingSpaceWhenAfter.keyword = function (left) {
	  return left.type !== _types.types._super;
	};
	_types.types.regexp.formattingSpaceWhenAfter.keyword = true;
	_types.types.semi.formattingSpaceAfter = true;
	_types.types.star.formattingSpaceWhenAfter.comma = true;
	_types.types.string.formattingSpaceWhenAfter.arrow = true;
	_types.types.string.formattingSpaceWhenAfter.comma = true;
	
	added();

/***/ },

/***/ 499:
/*!****************************!*\
  !*** ./~/lodash/forOwn.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(/*! ./_baseForOwn */ 500),
	    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ 523);
	
	/**
	 * Iterates over own enumerable string keyed properties of an object and
	 * invokes `iteratee` for each property. The iteratee is invoked with three
	 * arguments: (value, key, object). Iteratee functions may exit iteration
	 * early by explicitly returning `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.3.0
	 * @category Object
	 * @param {Object} object The object to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 * @see _.forOwnRight
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.forOwn(new Foo, function(value, key) {
	 *   console.log(key);
	 * });
	 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
	 */
	function forOwn(object, iteratee) {
	  return object && baseForOwn(object, baseIteratee(iteratee, 3));
	}
	
	module.exports = forOwn;


/***/ },

/***/ 619:
/*!*****************************************!*\
  !*** ./~/horchata/~/repeating/index.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var isFinite = __webpack_require__(/*! is-finite */ 620);
	
	module.exports = function (str, n) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected `input` to be a string');
		}
	
		if (n < 0 || !isFinite(n)) {
			throw new TypeError('Expected `count` to be a positive finite number');
		}
	
		var ret = '';
	
		do {
			if (n & 1) {
				ret += str;
			}
	
			str += str;
		} while ((n >>= 1));
	
		return ret;
	};


/***/ },

/***/ 622:
/*!*****************************************!*\
  !*** ./~/horchata/lib/lexer/context.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.types = exports.TokContext = undefined;
	
	var _index = __webpack_require__(/*! ./index */ 450);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _state = __webpack_require__(/*! ./state */ 452);
	
	var _state2 = _interopRequireDefault(_state);
	
	var _types = __webpack_require__(/*! ./types */ 444);
	
	var _contextTypes = __webpack_require__(/*! ./context-types */ 446);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * Copyright (C) 2012-2014 by various contributors (see doc/ACORN_AUTHORS)
	 * Copyright (C) 2015 Jordan Klassen <forivall@gmail.com>
	 *
	 * See LICENSE for full license text
	 */
	
	// The algorithm used to determine whether a regexp can appear at a
	// given point in the program is loosely based on sweet.js' approach.
	// See https://github.com/mozilla/sweet.js/wiki/design
	
	exports.TokContext = _contextTypes.TokContext;
	exports.types = _contextTypes.types;
	
	
	var sp = _state2.default.prototype;
	
	sp.initialContext = function () {
	  return [_contextTypes.types.stmt];
	};
	
	var lp = _index2.default.prototype;
	
	// called in `finishToken()`
	lp.updateContext = function updateContext(type, prevType) {
	  var update = void 0;
	  if (type.keyword && prevType == _types.types.dot) {
	    // meta property
	    this.state.exprAllowed = false;
	  } else if (update = type.updateContext) {
	    update.call(this, type, prevType);
	  } else {
	    this.state.exprAllowed = type.beforeExpr;
	  }
	};
	
	lp.curContext = function () {
	  return this.state.context[this.state.context.length - 1];
	};
	
	// Token-specific context update code
	
	_types.types.indent.updateContext = function (type, prevType) {
	  // we need to check if the indent introduces a block, or continues a
	  // * call expression's arguments
	  // * function declaration/expression's arguments
	  // * array
	  // * object
	  // * statement header (like the conditional in an if or for, etc.)
	  if (prevType === _types.types._let || prevType === _types.types._const || prevType === _types.types._var) {
	    this.state.context.push(_contextTypes.types.decl_expr);
	    // } else if (prevType === tt.indent) {
	    //   // double indent for keyword head
	    //   this.state.context.push(types.stmt_head);
	  } else if (prevType === _types.types._return) {
	      this.state.context.push(_contextTypes.types.return_expr);
	    } else {
	      if (this.curContext() === _contextTypes.types.stmt_head) {
	        this.state.inForHeaderInit = false;
	        this.state.context.pop();
	      }
	      this.state.exprAllowed = false;
	      this.state.context.push(_contextTypes.types.stmt);
	    }
	};
	
	_types.types._then.updateContext = function (type) {
	  if (this.curContext() === _contextTypes.types.stmt_head) {
	    this.state.context.pop();
	  }
	  this.state.inForHeaderInit = false;
	  this.state.exprAllowed = type.beforeExpr;
	};
	
	_types.types.braceL.updateContext = function (type) {
	  this.state.context.push(_contextTypes.types.obj_expr);
	  this.state.exprAllowed = type.beforeExpr;
	};
	
	_types.types.dollarBraceL.updateContext = function (type) {
	  this.state.context.push(_contextTypes.types.tmpl_expr);
	  this.state.exprAllowed = type.beforeExpr;
	};
	
	var blockStatementUpdateContext = function blockStatementUpdateContext(type) {
	  // TODO: don't push stmt_head for `if` when it's an implicit conditional
	  this.state.context.push(_contextTypes.types.stmt_head);
	  this.state.exprAllowed = type.beforeExpr;
	};
	_types.types._if.updateContext = blockStatementUpdateContext;
	
	_types.types._for.updateContext = function (type) {
	  this.state.inForHeaderInit = true;
	  this.state.context.push(_contextTypes.types.stmt_head);
	  this.state.exprAllowed = type.beforeExpr;
	};
	
	_types.types._while.updateContext = function (type) {
	  if (this.state.inForHeaderInit) {
	    this.state.inForHeaderInit = false;
	  } else {
	    this.state.context.push(_contextTypes.types.stmt_head);
	  }
	  this.state.exprAllowed = type.beforeExpr;
	};
	
	_types.types.excl.updateContext = function (type, prevType) {
	  if (prevType === _types.types._if) {
	    this.state.context.pop();
	  }
	  this.state.exprAllowed = true;
	};
	
	// TODO: do we need to detect if this is a list of parameters
	_types.types.parenL.updateContext = function (type) {
	  this.state.context.push(_contextTypes.types.paren_expr);
	  this.state.exprAllowed = type.beforeExpr;
	};
	
	_types.types.incDec.updateContext = function () {
	  // keep `this.state.exprAllowed` unchanged
	};
	
	_types.types._function.updateContext = function (type) {
	  if (this.curContext() !== _contextTypes.types.stmt) {
	    this.state.context.push(_contextTypes.types.func_expr);
	  }
	  this.exprAllowed = type.beforeExpr;
	};
	
	_types.types.backQuote.updateContext = function (type) {
	  if (this.curContext() === _contextTypes.types.tmpl_str) {
	    this.state.context.pop();
	  } else {
	    this.state.context.push(_contextTypes.types.tmpl_str);
	  }
	  this.exprAllowed = type.beforeExpr;
	};
	
	_types.types.braceR.updateContext = function () {
	  if (this.state.context.length === 1) {
	    this.state.exprAllowed = true;
	    return;
	  }
	  var out = this.state.context.pop();
	  if (out === _contextTypes.types.tmpl_expr) {
	    this.state.exprAllowed = true;
	  } else {
	    this.state.exprAllowed = !out.isExpr;
	  }
	};
	
	_types.types.parenR.updateContext = function (type) {
	  if (this.state.context.length === 1) {
	    this.state.exprAllowed = true;
	    return;
	  }
	  this.state.context.pop();
	  this.state.exprAllowed = type.beforeExpr;
	};
	
	_types.types.dedent.updateContext = function () {
	  if (this.state.context.length === 1) {
	    this.state.exprAllowed = true;
	    return;
	  }
	  var out = this.state.context.pop();
	  if (out === _contextTypes.types.stmt && this.curContext() === _contextTypes.types.func_expr) {
	    this.state.context.pop();
	    this.state.exprAllowed = false;
	  } else {
	    this.state.exprAllowed = !out.isExpr;
	  }
	};

/***/ },

/***/ 623:
/*!*********************************************!*\
  !*** ./~/horchata/lib/lexer/indentation.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _whitespace = __webpack_require__(/*! ../util/whitespace */ 451);
	
	var _types = __webpack_require__(/*! ./types */ 444);
	
	var _token = __webpack_require__(/*! ./token */ 458);
	
	var _token2 = _interopRequireDefault(_token);
	
	var _index = __webpack_require__(/*! ./index */ 450);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var lp = _index2.default.prototype;
	
	lp.skipIndentation = function skipIndentation() {
	  if (this.state.indentStart > this.state.pos) {
	    this.skipNonTokens(this.state.indentStart);
	  }
	  if (this.state.indentEnd > this.state.indentStart) {
	    this.endNonToken(new _token2.default(_types.types.tab, this.state.indentation, this.state.indentStart, this.state.indentEnd));
	  }
	  if (this.state.indentEnd > this.state.pos) {
	    this.state.pos = this.state.indentEnd;
	  }
	  this.state.eol = false;
	};
	
	// Maybe read indentation. If this is the first indentation found,
	// sets the indentation settings. `expectedLevels` is only used when detecting
	// indentation, otherwise, it's ignored and the aprser should return errors
	// according to the amount of indents it expects.
	// the only case where more than one level of indentation is expected is when
	// we are in the header of a statement, then two levels of indentation is expected.
	
	// TODO: skip comments
	
	// IF YOU ARE READING THIS, FEEL FREE TO SUBMIT A PULL REQUEST TO CLEAN THIS UP
	lp.hasIndentationChanged = function hasIndentationChanged(newlineCode) {
	  var expectedLevels = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
	
	  this.state.eol = true;
	  this.state.eolPos = this.state.pos;
	  this.state.indentStart = this.state.pos + 1;
	  if (newlineCode === 13 && this.input.charCodeAt(this.state.indentStart) === 10) {
	    this.state.indentStart++;
	  }
	  // First time encountering an indent, try to detect what indent is supposed to be, with condextual information
	  if (this.state.indentCharCode === -1) {
	    // detect indent
	    var pos = this.state.indentStart;
	    var indentLen = 0;
	    var indentEnd = -1;
	    var indentCharCode = -1;
	    var inconsistentIndentation = false;
	    while (pos < this.input.length) {
	      var ch = this.input.charCodeAt(pos);
	      // TODO: this should be overhauled at some point
	      // TODO: look at cpython's code, or just for + use detect-indnet
	      if ((0, _whitespace.isNewline)(ch)) {
	        ++pos;
	        if (ch === 13 && this.input.charCodeAt(pos) === 10) ++pos;
	        this.state.indentStart = pos;
	        indentLen = 0;
	        indentEnd = -1;
	        indentCharCode = -1;
	        inconsistentIndentation = false;
	        // TODO: also restart check when there's comments.
	      } else if (ch === indentCharCode) {
	          ++pos;++indentLen;
	        } else if (ch === 32 || ch === 160 || ch > 8 && ch < 14 || ch >= 5760 && _whitespace.nonASCIIwhitespace.test(String.fromCharCode(ch)) && ch !== 8232 && ch !== 8233) {
	          if (indentCharCode !== -1) {
	            inconsistentIndentation = true;
	            ++pos;++indentLen;
	            continue;
	          }
	          indentCharCode = ch;
	          ++pos;++indentLen;
	        } else if (this._isCommentStart(ch, pos)) {
	          if (indentEnd === -1) indentEnd = pos;
	          pos = this._findCommentEnd(ch, pos);
	          ch = this.input.charCodeAt(pos);
	          if (!(0, _whitespace.isNewline)(ch) && (ch === 32 || ch === 160 || ch > 8 && ch < 14 || ch >= 5760 && _whitespace.nonASCIIwhitespace.test(String.fromCharCode(ch)) && ch !== 8232 && ch !== 8233)) {
	            break;
	          }
	        } else {
	          break;
	        }
	    }
	    if (inconsistentIndentation) this.raise(this.state.pos, "Inconsistent Indentation");
	
	    this.state.indentEnd = indentEnd === -1 ? pos : indentEnd;
	
	    if (indentLen === 0) {
	      // No indent yet, just return.
	      return false;
	    } else {
	      var indentRepeat = indentLen / expectedLevels;
	      if (Math.floor(indentRepeat) !== indentRepeat) this.raise(this.state.pos, "Invalid Indentation");
	      this.state.indentString = this.input.slice(this.state.indentStart, this.state.indentStart + indentRepeat);
	      this.state.indentCharCode = indentCharCode;
	      this.state.indentRepeat = indentRepeat;
	      this.state.nextIndentation = expectedLevels;
	      this.file.format.indent = {
	        amount: indentRepeat,
	        type: indentCharCode === 9 ? 'tab' : 'space',
	        indent: this.state.indentString
	      };
	      return true;
	    }
	  } else {
	    // we have already detected the indentation settings, see if the level of indentation is different.
	    var _pos = this.state.indentStart;
	    var _indentLen = 0;
	    var _indentEnd = -1;
	    var _indentCharCode = this.state.indentCharCode;
	    var _inconsistentIndentation = false;
	    while (_pos < this.input.length) {
	      var _ch = this.input.charCodeAt(_pos);
	      // TODO: this should be overhauled at some point
	      // TODO: look at cpython's code, or just use detect-indnet
	      if ((0, _whitespace.isNewline)(_ch)) {
	        ++_pos;
	        if (_ch === 13 && this.input.charCodeAt(_pos) === 10) ++_pos;
	        this.state.indentStart = _pos;
	        _indentLen = 0;
	        _indentEnd = -1;
	        _inconsistentIndentation = false;
	      } else if (_ch === _indentCharCode && _indentEnd === -1) {
	        ++_pos;++_indentLen;
	      } else if (_ch === 32 || _ch === 160 || _ch > 8 && _ch < 14 || _ch >= 5760 && _whitespace.nonASCIIwhitespace.test(String.fromCharCode(_ch))) {
	        if (_indentEnd === -1) {
	          _inconsistentIndentation = true;
	        } else {
	          ++_pos;
	        }
	      } else if (this._isCommentStart(_ch, _pos)) {
	        if (_indentEnd === -1) _indentEnd = _pos;
	        _pos = this._findCommentEnd(_ch, _pos);
	        _ch = this.input.charCodeAt(_pos);
	        if (!(0, _whitespace.isNewline)(_ch) && (_ch === 32 || _ch === 160 || _ch > 8 && _ch < 14 || _ch >= 5760 && _whitespace.nonASCIIwhitespace.test(String.fromCharCode(_ch)) && _ch !== 8232 && _ch !== 8233)) {
	          break;
	        }
	      } else {
	        break;
	      }
	
	      if (_inconsistentIndentation) this.raise(this.state.pos, "Inconsistent Indentation");
	    }
	
	    this.state.indentEnd = _indentEnd === -1 ? _pos : _indentEnd;
	
	    var indentCount = _indentLen / this.state.indentRepeat;
	    if (Math.floor(indentCount) !== indentCount) this.raise(this.state.pos, "Invalid Indentation");
	    this.state.nextIndentation = indentCount;
	    return this.state.nextIndentation !== this.state.indentation;
	  }
	};
	
	lp.readIndentationDirective = function readIndentationDirective(code) {
	  throw new Error("Not Implemented");
	};

/***/ }

});
//# sourceMappingURL=6.bundle.js.map