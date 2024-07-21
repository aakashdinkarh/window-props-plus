!function() {
    window = this.window = this;
}.call(this)

// var JSHINT = (function() {
//   "use strict";

//   var api, // Extension API
//     bang = {
//       "<"  : true,
//       "<=" : true,
//       "==" : true,
//       "===": true,
//       "!==": true,
//       "!=" : true,
//       ">"  : true,
//       ">=" : true,
//       "+"  : true,
//       "-"  : true,
//       "*"  : true,
//       "/"  : true,
//       "%"  : true
//     },

//     declared, // Globals that were declared using /*global ... */ syntax.

//     functions, // All of the functions

//     inblock,
//     indent,
//     lookahead,
//     lex,
//     member,
//     membersOnly,
//     predefined,    // Global variables defined by option

//     extraModules = [],
//     emitter = new events.EventEmitter();

//   function checkOption(name, isStable, t) {
//     var type, validNames;

//     if (isStable) {
//       type = "";
//       validNames = options.validNames;
//     } else {
//       type = "unstable ";
//       validNames = options.unstableNames;
//     }

//     name = name.trim();

//     if (/^[+-]W\d{3}$/g.test(name)) {
//       return true;
//     }

//     if (validNames.indexOf(name) === -1) {
//       if (t.type !== "jslint" && !_.has(options.removed, name)) {
//         error("E001", t, type, name);
//         return false;
//       }
//     }

//     return true;
//   }

//   function isString(obj) {
//     return Object.prototype.toString.call(obj) === "[object String]";
//   }

//   function isIdentifier(tkn, value) {
//     if (!tkn)
//       return false;

//     if (!tkn.identifier || tkn.value !== value)
//       return false;

//     return true;
//   }
//   function isReserved(context, token) {
//     if (!token.reserved) {
//       return false;
//     }
//     var meta = token.meta;

//     if (meta && meta.isFutureReservedWord) {
//       if (state.inES5()) {
//         if (!meta.es5) {
//           return false;
//         }

//         if (token.isProperty) {
//           return false;
//         }
//       }
//     } else if (meta && meta.es5 && !state.inES5()) {
//       return false;
//     }
//     if (meta && meta.strictOnly && state.inES5()) {
//       if (!state.option.strict && !state.isStrict()) {
//         return false;
//       }
//     }

//     if (token.id === "await" && (!(context & prodParams.async) && !state.option.module)) {
//       return false;
//     }

//     if (token.id === "yield" && (!(context & prodParams.yield))) {
//       return state.isStrict();
//     }

//     return true;
//   }

//   function supplant(str, data) {
//     return str.replace(/\{([^{}]*)\}/g, function(a, b) {
//       var r = data[b];
//       return typeof r === "string" || typeof r === "number" ? r : a;
//     });
//   }

//   function combine(dest, src) {
//     Object.keys(src).forEach(function(name) {
//       if (_.has(JSHINT.blacklist, name)) return;
//       dest[name] = src[name];
//     });
//   }

//   function processenforceall() {
//     if (state.option.enforceall) {
//       for (var enforceopt in options.bool.enforcing) {
//         if (state.option[enforceopt] === undefined &&
//             !options.noenforceall[enforceopt]) {
//           state.option[enforceopt] = true;
//         }
//       }
//       for (var relaxopt in options.bool.relaxing) {
//         if (state.option[relaxopt] === undefined) {
//           state.option[relaxopt] = false;
//         }
//       }
//     }
//   }
//   function applyOptions() {
//     var badESOpt = null;
//     processenforceall();
//     badESOpt = state.inferEsVersion();
//     if (badESOpt) {
//       quit("E059", state.tokens.next, "esversion", badESOpt);
//     }

//     if (state.inES5()) {
//       combine(predefined, vars.ecmaIdentifiers[5]);
//     }

//     if (state.inES6()) {
//       combine(predefined, vars.ecmaIdentifiers[6]);
//     }

//     if (state.inES8()) {
//       combine(predefined, vars.ecmaIdentifiers[8]);
//     }

//     if (state.inES11()) {
//       combine(predefined, vars.ecmaIdentifiers[11]);
//     }
//     if (state.option.strict === "global" && "globalstrict" in state.option) {
//       quit("E059", state.tokens.next, "strict", "globalstrict");
//     }

//     if (state.option.module) {
//       if (!state.inES6()) {
//         warning("W134", state.tokens.next, "module", 6);
//       }
//     }

//     if (state.option.regexpu) {
//       if (!state.inES6()) {
//         warning("W134", state.tokens.next, "regexpu", 6);
//       }
//     }

//     if (state.option.couch) {
//       combine(predefined, vars.couch);
//     }

//     if (state.option.qunit) {
//       combine(predefined, vars.qunit);
//     }

//     if (state.option.rhino) {
//       combine(predefined, vars.rhino);
//     }

//     if (state.option.shelljs) {
//       combine(predefined, vars.shelljs);
//       combine(predefined, vars.node);
//     }
//     if (state.option.typed) {
//       combine(predefined, vars.typed);
//     }

//     if (state.option.phantom) {
//       combine(predefined, vars.phantom);
//     }

//     if (state.option.prototypejs) {
//       combine(predefined, vars.prototypejs);
//     }

//     if (state.option.node) {
//       combine(predefined, vars.node);
//       combine(predefined, vars.typed);
//     }

//     if (state.option.devel) {
//       combine(predefined, vars.devel);
//     }

//     if (state.option.dojo) {
//       combine(predefined, vars.dojo);
//     }

//     if (state.option.browser) {
//       combine(predefined, vars.browser);
//       combine(predefined, vars.typed);
//     }

//     if (state.option.browserify) {
//       combine(predefined, vars.browser);
//       combine(predefined, vars.typed);
//       combine(predefined, vars.browserify);
//     }

//     if (state.option.nonstandard) {
//       combine(predefined, vars.nonstandard);
//     }

//     if (state.option.jasmine) {
//       combine(predefined, vars.jasmine);
//     }

//     if (state.option.jquery) {
//       combine(predefined, vars.jquery);
//     }

//     if (state.option.mootools) {
//       combine(predefined, vars.mootools);
//     }

//     if (state.option.worker) {
//       combine(predefined, vars.worker);
//     }

//     if (state.option.wsh) {
//       combine(predefined, vars.wsh);
//     }

//     if (state.option.yui) {
//       combine(predefined, vars.yui);
//     }

//     if (state.option.mocha) {
//       combine(predefined, vars.mocha);
//     }
//   }
//   function quit(code, token, a, b) {
//     var percentage = Math.floor((token.line / state.lines.length) * 100);
//     var message = messages.errors[code].desc;

//     var exception = {
//       name: "JSHintError",
//       line: token.line,
//       character: token.from,
//       message: message + " (" + percentage + "% scanned).",
//       raw: message,
//       code: code,
//       a: a,
//       b: b
//     };

//     exception.reason = supplant(message, exception) + " (" + percentage +
//       "% scanned).";

//     throw exception;
//   }

//   function removeIgnoredMessages() {
//     var ignored = state.ignoredLines;

//     if (_.isEmpty(ignored)) return;
//     JSHINT.errors = _.reject(JSHINT.errors, function(err) { return ignored[err.line] });
//   }

//   function warning(code, t, a, b, c, d) {
//     var ch, l, w, msg;

//     if (/^W\d{3}$/.test(code)) {
//       if (state.ignored[code])
//         return;

//       msg = messages.warnings[code];
//     } else if (/E\d{3}/.test(code)) {
//       msg = messages.errors[code];
//     } else if (/I\d{3}/.test(code)) {
//       msg = messages.info[code];
//     }

//     t = t || state.tokens.next || {};
//     if (t.id === "(end)") {  // `~
//       t = state.tokens.curr;
//     }

//     l = t.line;
//     ch = t.from;

//     w = {
//       id: "(error)",
//       raw: msg.desc,
//       code: msg.code,
//       evidence: state.lines[l - 1] || "",
//       line: l,
//       character: ch,
//       scope: JSHINT.scope,
//       a: a,
//       b: b,
//       c: c,
//       d: d
//     };

//     w.reason = supplant(msg.desc, w);
//     JSHINT.errors.push(w);

//     removeIgnoredMessages();

//     var errors = JSHINT.errors.filter(function(e) { return /E\d{3}/.test(e.code); });
//     if (errors.length >= state.option.maxerr) {
//       quit("E043", t);
//     }
//     return w;
//   }

//   function warningAt(m, l, ch, a, b, c, d) {
//     return warning(m, {
//       line: l,
//       from: ch
//     }, a, b, c, d);
//   }

//   function error(m, t, a, b, c, d) {
//     warning(m, t, a, b, c, d);
//   }

//   function errorAt(m, l, ch, a, b, c, d) {
//     return error(m, {
//       line: l,
//       from: ch
//     }, a, b, c, d);
//   }
//   function addEvalCode(elem, token) {
//     JSHINT.internals.push({
//       id: "(internal)",
//       elem: elem,
//       token: token,
//       code: token.value.replace(/([^\\])(\\*)\2\\n/g, "$1\n")
//     });
//   }
//   function lintingDirective(directiveToken, previous) {
//     var body = directiveToken.body.split(",")
//       .map(function(s) { return s.trim(); });
//     var predef = {};

//     if (directiveToken.type === "falls through") {
//       previous.caseFallsThrough = true;
//       return;
//     }

//     if (directiveToken.type === "globals") {
//       body.forEach(function(item, idx) {
//         var parts = item.split(":");
//         var key = parts[0].trim();

//         if (key === "-" || !key.length) {
//           if (idx > 0 && idx === body.length - 1) {
//             return;
//           }
//           error("E002", directiveToken);
//           return;
//         }

//         if (key.charAt(0) === "-") {
//           key = key.slice(1);

//           JSHINT.blacklist[key] = key;
//           delete predefined[key];
//         } else {
//           predef[key] = parts.length > 1 && parts[1].trim() === "true";
//         }
//       });

//       combine(predefined, predef);

//       for (var key in predef) {
//         if (_.has(predef, key)) {
//           declared[key] = directiveToken;
//         }
//       }
//     }

//     if (directiveToken.type === "exported") {
//       body.forEach(function(e, idx) {
//         if (!e.length) {
//           if (idx > 0 && idx === body.length - 1) {
//             return;
//           }
//           error("E002", directiveToken);
//           return;
//         }

//         state.funct["(scope)"].addExported(e);
//       });
//     }

//     if (directiveToken.type === "members") {
//       membersOnly = membersOnly || {};

//       body.forEach(function(m) {
//         var ch1 = m.charAt(0);
//         var ch2 = m.charAt(m.length - 1);

//         if (ch1 === ch2 && (ch1 === "\"" || ch1 === "'")) {
//           m = m
//             .substr(1, m.length - 2)
//             .replace("\\\"", "\"");
//         }

//         membersOnly[m] = false;
//       });
//     }

//     var numvals = [
//       "maxstatements",
//       "maxparams",
//       "maxdepth",
//       "maxcomplexity",
//       "maxerr",
//       "maxlen",
//       "indent"
//     ];

//     if (directiveToken.type === "jshint" || directiveToken.type === "jslint" ||
//       directiveToken.type === "jshint.unstable") {
//       body.forEach(function(item) {
//         var parts = item.split(":");
//         var key = parts[0].trim();
//         var val = parts.length > 1 ? parts[1].trim() : "";
//         var numberVal;

//         if (!checkOption(key, directiveToken.type !== "jshint.unstable", directiveToken)) {
//           return;
//         }

//         if (numvals.indexOf(key) >= 0) {
//           if (val !== "false") {
//             numberVal = +val;

//             if (typeof numberVal !== "number" || !isFinite(numberVal) ||
//               numberVal <= 0 || Math.floor(numberVal) !== numberVal) {
//               error("E032", directiveToken, val);
//               return;
//             }

//             state.option[key] = numberVal;
//           } else {
//             state.option[key] = key === "indent" ? 4 : false;
//           }

//           return;
//         }

//         if (key === "validthis") {

//           if (state.funct["(global)"])
//             return void error("E009");

//           if (val !== "true" && val !== "false")
//             return void error("E002", directiveToken);

//           state.option.validthis = (val === "true");
//           return;
//         }

//         if (key === "quotmark") {
//           switch (val) {
//           case "true":
//           case "false":
//             state.option.quotmark = (val === "true");
//             break;
//           case "double":
//           case "single":
//             state.option.quotmark = val;
//             break;
//           default:
//             error("E002", directiveToken);
//           }
//           return;
//         }

//         if (key === "shadow") {
//           switch (val) {
//           case "true":
//             state.option.shadow = true;
//             break;
//           case "outer":
//             state.option.shadow = "outer";
//             break;
//           case "false":
//           case "inner":
//             state.option.shadow = "inner";
//             break;
//           default:
//             error("E002", directiveToken);
//           }
//           return;
//         }

//         if (key === "unused") {
//           switch (val) {
//           case "true":
//             state.option.unused = true;
//             break;
//           case "false":
//             state.option.unused = false;
//             break;
//           case "vars":
//           case "strict":
//             state.option.unused = val;
//             break;
//           default:
//             error("E002", directiveToken);
//           }
//           return;
//         }

//         if (key === "latedef") {
//           switch (val) {
//           case "true":
//             state.option.latedef = true;
//             break;
//           case "false":
//             state.option.latedef = false;
//             break;
//           case "nofunc":
//             state.option.latedef = "nofunc";
//             break;
//           default:
//             error("E002", directiveToken);
//           }
//           return;
//         }

//         if (key === "ignore") {
//           switch (val) {
//           case "line":
//             state.ignoredLines[directiveToken.line] = true;
//             removeIgnoredMessages();
//             break;
//           default:
//             error("E002", directiveToken);
//           }
//           return;
//         }

//         if (key === "strict") {
//           switch (val) {
//           case "true":
//             state.option.strict = true;
//             break;
//           case "false":
//             state.option.strict = false;
//             break;
//           case "global":
//           case "implied":
//             state.option.strict = val;
//             break;
//           default:
//             error("E002", directiveToken);
//           }
//           return;
//         }

//         if (key === "module") {
//           if (!hasParsedCode(state.funct)) {
//             error("E055", directiveToken, "module");
//           }
//         }

//         if (key === "esversion") {
//           switch (val) {
//           case "3":
//           case "5":
//           case "6":
//           case "7":
//           case "8":
//           case "9":
//           case "10":
//           case "11":
//             state.option.moz = false;
//             state.option.esversion = +val;
//             break;
//           case "2015":
//           case "2016":
//           case "2017":
//           case "2018":
//           case "2019":
//           case "2020":
//             state.option.moz = false;
//             state.option.esversion = +val - 2009;
//             break;
//           default:
//             error("E002", directiveToken);
//           }
//           if (!hasParsedCode(state.funct)) {
//             error("E055", directiveToken, "esversion");
//           }
//           return;
//         }

//         var match = /^([+-])(W\d{3})$/g.exec(key);
//         if (match) {
//           state.ignored[match[2]] = (match[1] === "-");
//           return;
//         }

//         var tn;
//         if (val === "true" || val === "false") {
//           if (directiveToken.type === "jslint") {
//             tn = options.renamed[key] || key;
//             state.option[tn] = (val === "true");

//             if (options.inverted[tn] !== undefined) {
//               state.option[tn] = !state.option[tn];
//             }
//           } else if (directiveToken.type === "jshint.unstable") {
//             state.option.unstable[key] = (val === "true");
//           } else {
//             state.option[key] = (val === "true");
//           }

//           return;
//         }

//         error("E002", directiveToken);
//       });

//       applyOptions();
//     }
//   }
//   function peek(p) {
//     var i = p || 0, j = lookahead.length, t;

//     if (i < j) {
//       return lookahead[i];
//     }

//     while (j <= i) {
//       t = lex.token();
//       if (!t) {
//         if (!lookahead.length) {
//           return state.tokens.next;
//         }

//         return lookahead[j - 1];
//       }

//       lookahead[j] = t;
//       j += 1;
//     }

//     return t;
//   }

//   function peekIgnoreEOL() {
//     var i = 0;
//     var t;
//     do {
//       t = peek(i++);
//     } while (t.id === "(endline)");
//     return t;
//   }
//   function advance(expected, relatedToken) {
//     var nextToken = state.tokens.next;

//     if (expected && nextToken.id !== expected) {
//       if (relatedToken) {
//         if (nextToken.id === "(end)") {
//           error("E019", relatedToken, relatedToken.id);
//         } else {
//           error("E020", nextToken, expected, relatedToken.id,
//             relatedToken.line, nextToken.value);
//         }
//       } else if (nextToken.type !== "(identifier)" || nextToken.value !== expected) {
//         error("E021", nextToken, expected, nextToken.value);
//       }
//     }

//     state.tokens.prev = state.tokens.curr;
//     state.tokens.curr = state.tokens.next;
//     for (;;) {
//       state.tokens.next = lookahead.shift() || lex.token();

//       if (!state.tokens.next) { // No more tokens left, give up
//         quit("E041", state.tokens.curr);
//       }

//       if (state.tokens.next.id === "(end)" || state.tokens.next.id === "(error)") {
//         return;
//       }

//       if (state.tokens.next.check) {
//         state.tokens.next.check();
//       }

//       if (state.tokens.next.isSpecial) {
//         lintingDirective(state.tokens.next, state.tokens.curr);
//       } else {
//         if (state.tokens.next.id !== "(endline)") {
//           break;
//         }
//       }
//     }
//   }
//   function isOperator(token) {
//     return token.first || token.right || token.left || token.id === "yield" || token.id === "await";
//   }

//   function isEndOfExpr(context, curr, next) {
//     if (arguments.length <= 1) {
//       curr = state.tokens.curr;
//       next = state.tokens.next;
//     }

//     if (next.id === "in" && context & prodParams.noin) {
//       return true;
//     }

//     if (next.id === ";" || next.id === "}" || next.id === ":") {
//       return true;
//     }

//     if (next.infix === curr.infix ||
//       (curr.id === "yield" && curr.rbp < next.rbp)) {
//       return !sameLine(curr, next);
//     }

//     return false;
//   }
//   function expression(context, rbp) {
//     var left, isArray = false, isObject = false;
//     var initial = context & prodParams.initial;
//     var curr;

//     context &= ~prodParams.initial;

//     state.nameStack.push();

//     if (state.tokens.next.id === "(end)")
//       error("E006", state.tokens.curr);

//     advance();

//     if (initial) {
//       state.funct["(verb)"] = state.tokens.curr.value;
//       state.tokens.curr.beginsStmt = true;
//     }

//     curr = state.tokens.curr;

//     if (initial && curr.fud && (!curr.useFud || curr.useFud(context))) {
//       left = state.tokens.curr.fud(context);
//     } else {
//       if (state.tokens.curr.nud) {
//         left = state.tokens.curr.nud(context, rbp);
//       } else {
//         error("E030", state.tokens.curr, state.tokens.curr.id);
//       }

//       while (rbp < state.tokens.next.lbp && !isEndOfExpr(context)) {
//         isArray = state.tokens.curr.value === "Array";
//         isObject = state.tokens.curr.value === "Object";
//         if (left && (left.value || (left.first && left.first.value))) {
//           if (left.value !== "new" ||
//             (left.first && left.first.value && left.first.value === ".")) {
//             isArray = false;
//             if (left.value !== state.tokens.curr.value) {
//               isObject = false;
//             }
//           }
//         }

//         advance();

//         if (isArray && state.tokens.curr.id === "(" && state.tokens.next.id === ")") {
//           warning("W009", state.tokens.curr);
//         }

//         if (isObject && state.tokens.curr.id === "(" && state.tokens.next.id === ")") {
//           warning("W010", state.tokens.curr);
//         }

//         if (left && state.tokens.curr.led) {
//           left = state.tokens.curr.led(context, left);
//         } else {
//           error("E033", state.tokens.curr, state.tokens.curr.id);
//         }
//       }
//     }

//     state.nameStack.pop();

//     return left;
//   }

//   function sameLine(first, second) {
//     return first.line === (second.startLine || second.line);
//   }

//   function nobreaknonadjacent(left, right) {
//     if (!state.option.laxbreak && !sameLine(left, right)) {
//       warning("W014", right, right.value);
//     }
//   }

//   function nolinebreak(t) {
//     if (!sameLine(t, state.tokens.next)) {
//       warning("E022", t, t.value);
//     }
//   }
//   function checkComma(opts) {
//     var prev = state.tokens.prev;
//     var curr = state.tokens.curr;
//     opts = opts || {};

//     if (!sameLine(prev, curr)) {
//       if (!state.option.laxcomma) {
//         if (checkComma.first) {
//           warning("I001", curr);
//           checkComma.first = false;
//         }
//         warning("W014", prev, curr.value);
//       }
//     }

//     if (state.tokens.next.identifier && !(opts.property && state.inES5())) {
//       switch (state.tokens.next.value) {
//       case "break":
//       case "case":
//       case "catch":
//       case "continue":
//       case "default":
//       case "do":
//       case "else":
//       case "finally":
//       case "for":
//       case "if":
//       case "in":
//       case "instanceof":
//       case "return":
//       case "switch":
//       case "throw":
//       case "try":
//       case "var":
//       case "let":
//       case "while":
//       case "with":
//         error("E024", state.tokens.next, state.tokens.next.value);
//         return false;
//       }
//     }

//     if (state.tokens.next.type === "(punctuator)") {
//       switch (state.tokens.next.value) {
//       case "}":
//       case "]":
//       case ",":
//       case ")":
//         if (opts.allowTrailing) {
//           return true;
//         }

//         error("E024", state.tokens.next, state.tokens.next.value);
//         return false;
//       }
//     }
//     return true;
//   }
//   function symbol(s, p) {
//     var x = state.syntax[s];
//     if (!x || typeof x !== "object") {
//       state.syntax[s] = x = {
//         id: s,
//         lbp: p,
//         rbp: p,
//         value: s
//       };
//     }
//     return x;
//   }
//   function delim(s) {
//     var x = symbol(s, 0);
//     x.delim = true;
//     return x;
//   }
//   function stmt(s, f) {
//     var x = delim(s);
//     x.identifier = x.reserved = true;
//     x.fud = f;
//     return x;
//   }
//   function blockstmt(s, f) {
//     var x = stmt(s, f);
//     x.block = true;
//     return x;
//   }
//   function reserveName(x) {
//     var c = x.id.charAt(0);
//     if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
//       x.identifier = x.reserved = true;
//     }
//     return x;
//   }
//   function prefix(s, f) {
//     var x = symbol(s, 150);
//     reserveName(x);

//     x.nud = (typeof f === "function") ? f : function(context) {
//       this.arity = "unary";
//       this.right = expression(context, 150);

//       if (this.id === "++" || this.id === "--") {
//         if (state.option.plusplus) {
//           warning("W016", this, this.id);
//         }

//         if (this.right) {
//           checkLeftSideAssign(context, this.right, this);
//         }
//       }

//       return this;
//     };

//     return x;
//   }
//   function type(s, f) {
//     var x = symbol(s, 0);
//     x.type = s;
//     x.nud = f;
//     return x;
//   }
//   function reserve(name, func) {
//     var x = type(name, func);
//     x.identifier = true;
//     x.reserved = true;
//     return x;
//   }
//   function FutureReservedWord(name, meta) {
//     var x = type(name, state.syntax["(identifier)"].nud);

//     meta = meta || {};
//     meta.isFutureReservedWord = true;

//     x.value = name;
//     x.identifier = true;
//     x.reserved = true;
//     x.meta = meta;

//     return x;
//   }
//   function infix(s, f, p, w) {
//     var x = symbol(s, p);
//     reserveName(x);
//     x.infix = true;
//     x.led = function(context, left) {
//       if (!w) {
//         nobreaknonadjacent(state.tokens.prev, state.tokens.curr);
//       }
//       if ((s === "in" || s === "instanceof") && left.id === "!") {
//         warning("W018", left, "!");
//       }
//       if (typeof f === "function") {
//         return f(context, left, this);
//       } else {
//         this.left = left;
//         this.right = expression(context, p);
//         return this;
//       }
//     };
//     return x;
//   }
//   function application(s) {
//     var x = symbol(s, 42);

//     x.infix = true;
//     x.led = function(context, left) {
//       nobreaknonadjacent(state.tokens.prev, state.tokens.curr);

//       this.left = left;
//       this.right = doFunction(context, { type: "arrow", loneArg: left });
//       return this;
//     };
//     return x;
//   }
//   function relation(s, f) {
//     var x = symbol(s, 100);

//     x.infix = true;
//     x.led = function(context, left) {
//       nobreaknonadjacent(state.tokens.prev, state.tokens.curr);
//       this.left = left;
//       var right = this.right = expression(context, 100);

//       if (isIdentifier(left, "NaN") || isIdentifier(right, "NaN")) {
//         warning("W019", this);
//       } else if (f) {
//         f.apply(this, [context, left, right]);
//       }

//       if (!left || !right) {
//         quit("E041", state.tokens.curr);
//       }

//       if (left.id === "!") {
//         warning("W018", left, "!");
//       }

//       if (right.id === "!") {
//         warning("W018", right, "!");
//       }

//       return this;
//     };
//     return x;
//   }
//   function beginsUnaryExpression(token) {
//     return token.arity === "unary" && token.id !== "++" && token.id !== "--";
//   }

//   var typeofValues = {};
//   typeofValues.legacy = [
//     "xml",
//     "unknown"
//   ];
//   typeofValues.es3 = [
//     "undefined", "boolean", "number", "string", "function", "object",
//   ];
//   typeofValues.es3 = typeofValues.es3.concat(typeofValues.legacy);
//   typeofValues.es6 = typeofValues.es3.concat("symbol", "bigint");
//   function isTypoTypeof(left, right, state) {
//     var values;

//     if (state.option.notypeof)
//       return false;

//     if (!left || !right)
//       return false;

//     values = state.inES6() ? typeofValues.es6 : typeofValues.es3;

//     if (right.type === "(identifier)" && right.value === "typeof" && left.type === "(string)") {
//       if (left.value === "bigint") {
//         if (!state.inES11()) {
//           warning("W119", left, "BigInt", "11");
//         }

//         return false;
//       }

//       return !_.includes(values, left.value);
//     }

//     return false;
//   }
//   function isGlobalEval(left, state) {
//     var isGlobal = false;
//     if (left.type === "this" && state.funct["(context)"] === null) {
//       isGlobal = true;
//     }
//     else if (left.type === "(identifier)") {
//       if (state.option.node && left.value === "global") {
//         isGlobal = true;
//       }

//       else if (state.option.browser && (left.value === "window" || left.value === "document")) {
//         isGlobal = true;
//       }
//     }

//     return isGlobal;
//   }
//   function findNativePrototype(left) {
//     var natives = [
//       "Array", "ArrayBuffer", "Boolean", "Collator", "DataView", "Date",
//       "DateTimeFormat", "Error", "EvalError", "Float32Array", "Float64Array",
//       "Function", "Infinity", "Intl", "Int16Array", "Int32Array", "Int8Array",
//       "Iterator", "Number", "NumberFormat", "Object", "RangeError",
//       "ReferenceError", "RegExp", "StopIteration", "String", "SyntaxError",
//       "TypeError", "Uint16Array", "Uint32Array", "Uint8Array", "Uint8ClampedArray",
//       "URIError"
//     ];

//     function walkPrototype(obj) {
//       if (typeof obj !== "object") return;
//       return obj.right === "prototype" ? obj : walkPrototype(obj.left);
//     }

//     function walkNative(obj) {
//       while (!obj.identifier && typeof obj.left === "object")
//         obj = obj.left;

//       if (obj.identifier && natives.indexOf(obj.value) >= 0 &&
//           state.funct["(scope)"].isPredefined(obj.value)) {
//         return obj.value;
//       }
//     }

//     var prototype = walkPrototype(left);
//     if (prototype) return walkNative(prototype);
//   }
//   function checkLeftSideAssign(context, left, assignToken, options) {

//     var allowDestructuring = options && options.allowDestructuring;

//     assignToken = assignToken || left;

//     if (state.option.freeze) {
//       var nativeObject = findNativePrototype(left);
//       if (nativeObject)
//         warning("W121", left, nativeObject);
//     }

//     if (left.identifier && !left.isMetaProperty) {
//       state.funct["(scope)"].block.reassign(left.value, left);
//     }

//     if (left.id === ".") {
//       if (!left.left || left.left.value === "arguments" && !state.isStrict()) {
//         warning("W143", assignToken);
//       }

//       state.nameStack.set(state.tokens.prev);
//       return true;
//     } else if (left.id === "{" || left.id === "[") {
//       if (!allowDestructuring || !left.destructAssign) {
//         if (left.id === "{" || !left.left) {
//           warning("E031", assignToken);
//         } else if (left.left.value === "arguments" && !state.isStrict()) {
//           warning("W143", assignToken);
//         }
//       }

//       if (left.id === "[") {
//         state.nameStack.set(left.right);
//       }

//       return true;
//     } else if (left.identifier && !isReserved(context, left) && !left.isMetaProperty) {
//       if (state.funct["(scope)"].bindingtype(left.value) === "exception") {
//         warning("W022", left);
//       }

//       if (left.value === "eval" && state.isStrict()) {
//         error("E031", assignToken);
//         return false;
//       } else if (left.value === "arguments") {
//         if (!state.isStrict()) {
//           warning("W143", assignToken);
//         } else {
//           error("E031", assignToken);
//           return false;
//         }
//       }
//       state.nameStack.set(left);
//       return true;
//     }

//     error("E031", assignToken);

//     return false;
//   }
//   function assignop(s, f) {
//     var x = infix(s, typeof f === "function" ? f : function(context, left, that) {
//       that.left = left;

//       checkLeftSideAssign(context, left, that, { allowDestructuring: true });

//       that.right = expression(context, 10);

//       return that;
//     }, 20);

//     x.exps = true;
//     x.assign = true;

//     return x;
//   }
//   function bitwise(s, f, p) {
//     var x = symbol(s, p);
//     reserveName(x);
//     x.infix = true;
//     x.led = (typeof f === "function") ? f : function(context, left) {
//       if (state.option.bitwise) {
//         warning("W016", this, this.id);
//       }
//       this.left = left;
//       this.right = expression(context, p);
//       return this;
//     };
//     return x;
//   }
//   function bitwiseassignop(s) {
//     symbol(s, 20).exps = true;
//     return infix(s, function(context, left, that) {
//       if (state.option.bitwise) {
//         warning("W016", that, that.id);
//       }

//       checkLeftSideAssign(context, left, that);

//       that.right = expression(context, 10);

//       return that;
//     }, 20);
//   }
//   function suffix(s) {
//     var x = symbol(s, 150);

//     x.led = function(context, left) {
//       if (state.option.plusplus) {
//         warning("W016", this, this.id);
//       }

//       checkLeftSideAssign(context, left, this);

//       this.left = left;
//       return this;
//     };
//     return x;
//   }
//   function optionalidentifier(context, isName, preserve) {
//     if (!state.tokens.next.identifier) {
//       return;
//     }

//     if (!preserve) {
//       advance();
//     }

//     var curr = state.tokens.curr;

//     if (isReserved(context, curr) && !(isName && state.inES5())) {
//       warning("W024", state.tokens.curr, state.tokens.curr.id);
//     }

//     return curr.value;
//   }
//   function spreadrest(operation) {
//     if (!checkPunctuator(state.tokens.next, "...")) {
//       return false;
//     }

//     if (!state.inES6(true)) {
//       warning("W119", state.tokens.next, operation + " operator", "6");
//     }
//     advance();

//     if (checkPunctuator(state.tokens.next, "...")) {
//       warning("E024", state.tokens.next, "...");
//       while (checkPunctuator(state.tokens.next, "...")) {
//         advance();
//       }
//     }

//     return true;
//   }
//   function identifier(context, isName) {
//     var i = optionalidentifier(context, isName, false);
//     if (i) {
//       return i;
//     }

//     error("E030", state.tokens.next, state.tokens.next.value);
//     if (state.tokens.next.id !== ";") {
//       advance();
//     }
//   }
//   function reachable(controlToken) {
//     var i = 0, t;
//     if (state.tokens.next.id !== ";" || controlToken.inBracelessBlock) {
//       return;
//     }
//     for (;;) {
//       do {
//         t = peek(i);
//         i += 1;
//       } while (t.id !== "(end)" && t.id === "(comment)");

//       if (t.reach) {
//         return;
//       }

//       if (t.id !== "(endline)") {
//         if (isFunction(t, i)) {
//           if (state.option.latedef === true) {
//             warning("W026", t);
//           }
//           break;
//         }

//         warning("W027", t, t.value, controlToken.value);
//         break;
//       }
//     }

//     function isFunction(t, i) {
//       if (t.id === "function") {
//         return true;
//       }
//       if (t.id === "async") {
//         t = peek(i);
//         return t.id === "function";
//       }
//     }
//   }
//   function parseFinalSemicolon(stmt) {
//     if (state.tokens.next.id !== ";") {
//       if (state.tokens.next.isUnclosed) return advance();

//       var isSameLine = sameLine(state.tokens.curr, state.tokens.next) &&
//                        state.tokens.next.id !== "(end)";
//       var blockEnd = checkPunctuator(state.tokens.next, "}");

//       if (isSameLine && !blockEnd && !(stmt.id === "do" && state.inES6(true))) {
//         errorAt("E058", state.tokens.curr.line, state.tokens.curr.character);
//       } else if (!state.option.asi) {
//         if (!(blockEnd && isSameLine && state.option.lastsemic)) {
//           warningAt("W033", state.tokens.curr.line, state.tokens.curr.character);
//         }
//       }
//     } else {
//       advance(";");
//     }
//   }
//   function statement(context) {
//     var i = indent, r, t = state.tokens.next, hasOwnScope = false;

//     context |= prodParams.initial;

//     if (t.id === ";") {
//       advance(";");
//       return;
//     }
//     var res = isReserved(context, t);

//     if (res && t.meta && t.meta.isFutureReservedWord && !t.fud) {
//       warning("W024", t, t.id);
//       res = false;
//     }

//     if (t.identifier && !res && peek().id === ":") {
//       advance();
//       advance(":");

//       hasOwnScope = true;
//       state.funct["(scope)"].stack();
//       state.funct["(scope)"].block.addLabel(t.value, { token: state.tokens.curr });

//       if (!state.tokens.next.labelled && state.tokens.next.value !== "{") {
//         warning("W028", state.tokens.next, t.value, state.tokens.next.value);
//       }

//       t = state.tokens.next;
//     }

//     if (t.id === "{") {
//       var iscase = (state.funct["(verb)"] === "case" && state.tokens.curr.value === ":");
//       block(context, true, true, false, false, iscase);

//       if (hasOwnScope) {
//         state.funct["(scope)"].unstack();
//       }

//       return;
//     }

//     r = expression(context, 0);

//     if (r && !(r.identifier && r.value === "function") &&
//         !(r.type === "(punctuator)" && r.left &&
//           r.left.identifier && r.left.value === "function")) {
//       if (!state.isStrict() && state.stmtMissingStrict()) {
//         warning("E007");
//       }
//     }

//     if (!t.block) {
//       if (!state.option.expr && (!r || !r.exps)) {
//         warning("W030", state.tokens.curr);
//       } else if (state.option.nonew && r && r.left && r.id === "(" && r.left.id === "new") {
//         warning("W031", t);
//       }

//       parseFinalSemicolon(t);
//     }

//     indent = i;
//     if (hasOwnScope) {
//       state.funct["(scope)"].unstack();
//     }
//     return r;
//   }
//   function statements(context) {
//     var a = [], p;

//     while (!state.tokens.next.reach && state.tokens.next.id !== "(end)") {
//       if (state.tokens.next.id === ";") {
//         p = peek();

//         if (!p || (p.id !== "(" && p.id !== "[")) {
//           warning("W032");
//         }

//         advance(";");
//       } else {
//         a.push(statement(context));
//       }
//     }
//     return a;
//   }
//   function directives() {
//     var current = state.tokens.next;
//     while (state.tokens.next.id === "(string)") {
//       var next = peekIgnoreEOL();
//       if (!isEndOfExpr(0, current, next)) {
//         break;
//       }
//       current = next;

//       advance();
//       var directive = state.tokens.curr.value;
//       if (state.directive[directive] ||
//           (directive === "use strict" && state.option.strict === "implied")) {
//         warning("W034", state.tokens.curr, directive);
//       }
//       if (directive === "use strict" && state.inES7() &&
//         !state.funct["(global)"] && state.funct["(hasSimpleParams)"] === false) {
//         error("E065", state.tokens.curr);
//       }

//       state.directive[directive] = state.tokens.curr;

//       parseFinalSemicolon(current);
//     }

//     if (state.isStrict()) {
//       state.option.undef = true;
//     }
//   }
//   function block(context, ordinary, stmt, isfunc, isfatarrow, iscase) {
//     var a,
//       b = inblock,
//       old_indent = indent,
//       m,
//       t,
//       d;

//     inblock = ordinary;

//     t = state.tokens.next;

//     var metrics = state.funct["(metrics)"];
//     metrics.nestedBlockDepth += 1;
//     metrics.verifyMaxNestedBlockDepthPerFunction();

//     if (state.tokens.next.id === "{") {
//       advance("{");
//       state.funct["(scope)"].stack();

//       if (state.tokens.next.id !== "}") {
//         indent += state.option.indent;
//         while (!ordinary && state.tokens.next.from > indent) {
//           indent += state.option.indent;
//         }

//         if (isfunc) {
//           m = {};
//           for (d in state.directive) {
//             m[d] = state.directive[d];
//           }
//           directives();

//           state.funct["(isStrict)"] = state.isStrict();

//           if (state.option.strict && state.funct["(context)"]["(global)"]) {
//             if (!m["use strict"] && !state.isStrict()) {
//               warning("E007");
//             }
//           }
//         }

//         a = statements(context);

//         metrics.statementCount += a.length;

//         indent -= state.option.indent;
//       } else if (isfunc) {
//         state.funct["(isStrict)"] = state.isStrict();
//       }

//       advance("}", t);

//       if (isfunc) {
//         state.funct["(scope)"].validateParams(isfatarrow);
//         if (m) {
//           state.directive = m;
//         }
//       }

//       state.funct["(scope)"].unstack();

//       indent = old_indent;
//     } else if (!ordinary) {
//       if (isfunc) {
//         state.funct["(scope)"].stack();

//         if (stmt && !isfatarrow && !state.inMoz()) {
//           error("W118", state.tokens.curr, "function closure expressions");
//         }

//         if (isfatarrow) {
//           state.funct["(scope)"].validateParams(true);
//         }

//         var expr = expression(context, 10);

//         if (state.option.noreturnawait && context & prodParams.async &&
//             expr.identifier && expr.value === "await") {
//           warning("W146", expr);
//         }

//         if (state.option.strict && state.funct["(context)"]["(global)"]) {
//           if (!state.isStrict()) {
//             warning("E007");
//           }
//         }

//         state.funct["(scope)"].unstack();
//       } else {
//         error("E021", state.tokens.next, "{", state.tokens.next.value);
//       }
//     } else {

//       state.funct["(scope)"].stack();

//       if (!stmt || state.option.curly) {
//         warning("W116", state.tokens.next, "{", state.tokens.next.value);
//       }
//       var supportsFnDecl = state.funct["(verb)"] === "if" ||
//         state.tokens.curr.id === "else";

//       state.tokens.next.inBracelessBlock = true;
//       indent += state.option.indent;
//       a = [statement(context)];
//       indent -= state.option.indent;

//       if (a[0] && a[0].declaration &&
//         !(supportsFnDecl && a[0].id === "function")) {
//         error("E048", a[0], a[0].id[0].toUpperCase() + a[0].id.slice(1));
//       }

//       state.funct["(scope)"].unstack();
//     }
//     switch (state.funct["(verb)"]) {
//     case "break":
//     case "continue":
//     case "return":
//     case "throw":
//       if (iscase) {
//         break;
//       }
//     default:
//       state.funct["(verb)"] = null;
//     }

//     inblock = b;
//     if (ordinary && state.option.noempty && (!a || a.length === 0)) {
//       warning("W035", state.tokens.prev);
//     }
//     metrics.nestedBlockDepth -= 1;
//     return a;
//   }
//   function countMember(m) {
//     if (membersOnly && typeof membersOnly[m] !== "boolean") {
//       warning("W036", state.tokens.curr, m);
//     }
//     if (typeof member[m] === "number") {
//       member[m] += 1;
//     } else {
//       member[m] = 1;
//     }
//   }

//   type("(number)", function() {
//     if (state.tokens.next.id === ".") {
//       warning("W005", this);
//     }

//     return this;
//   });

//   type("(string)", function() {
//     return this;
//   });

//   state.syntax["(identifier)"] = {
//     type: "(identifier)",
//     lbp: 0,
//     identifier: true,

//     nud: function(context) {
//       var v = this.value;
//       var isLoneArrowParam = state.tokens.next.id === "=>";

//       if (isReserved(context, this)) {
//         warning("W024", this, v);
//       } else if (!isLoneArrowParam && !state.funct["(comparray)"].check(v)) {
//         state.funct["(scope)"].block.use(v, state.tokens.curr);
//       }

//       return this;
//     },

//     led: function() {
//       error("E033", state.tokens.next, state.tokens.next.value);
//     }
//   };

//   var baseTemplateSyntax = {
//     identifier: false,
//     template: true,
//   };
//   state.syntax["(template)"] = _.extend({
//     lbp: 155,
//     type: "(template)",
//     nud: doTemplateLiteral,
//     led: doTemplateLiteral,
//     noSubst: false
//   }, baseTemplateSyntax);

//   state.syntax["(template middle)"] = _.extend({
//     lbp: 0,
//     type: "(template middle)",
//     noSubst: false
//   }, baseTemplateSyntax);

//   state.syntax["(template tail)"] = _.extend({
//     lbp: 0,
//     type: "(template tail)",
//     tail: true,
//     noSubst: false
//   }, baseTemplateSyntax);

//   state.syntax["(no subst template)"] = _.extend({
//     lbp: 155,
//     type: "(template)",
//     nud: doTemplateLiteral,
//     led: doTemplateLiteral,
//     noSubst: true,
//     tail: true // mark as tail, since it's always the last component
//   }, baseTemplateSyntax);

//   type("(regexp)", function() {
//     return this;
//   });

//   delim("(endline)");
//   (function(x) {
//     x.line = x.from = 0;
//   })(delim("(begin)"));
//   delim("(end)").reach = true;
//   delim("(error)").reach = true;
//   delim("}").reach = true;
//   delim(")");
//   delim("]");
//   delim("\"").reach = true;
//   delim("'").reach = true;
//   delim(";");
//   delim(":").reach = true;
//   delim("#");

//   reserve("else");
//   reserve("case").reach = true;
//   reserve("catch");
//   reserve("default").reach = true;
//   reserve("finally");
//   reserve("true", function() { return this; });
//   reserve("false", function() { return this; });
//   reserve("null", function() { return this; });
//   reserve("this", function() {
//     if (state.isStrict() && !isMethod() &&
//         !state.option.validthis && ((state.funct["(statement)"] &&
//         state.funct["(name)"].charAt(0) > "Z") || state.funct["(global)"])) {
//       warning("W040", this);
//     }

//     return this;
//   });

//   (function(superSymbol) {
//     superSymbol.rbp = 161;
//   })(reserve("super", function() {
//     superNud.call(state.tokens.curr, this);

//     return this;
//   }));

//   assignop("=", "assign");
//   assignop("+=", "assignadd");
//   assignop("-=", "assignsub");
//   assignop("*=", "assignmult");
//   assignop("/=", "assigndiv").nud = function() {
//     error("E014");
//   };
//   assignop("%=", "assignmod");
//   assignop("**=", function(context, left, that) {
//     if (!state.inES7()) {
//       warning("W119", that, "Exponentiation operator", "7");
//     }

//     that.left = left;

//     checkLeftSideAssign(context, left, that);

//     that.right = expression(context, 10);

//     return that;
//   });

//   bitwiseassignop("&=");
//   bitwiseassignop("|=");
//   bitwiseassignop("^=");
//   bitwiseassignop("<<=");
//   bitwiseassignop(">>=");
//   bitwiseassignop(">>>=");
//   infix(",", function(context, left, that) {
//     if (state.option.nocomma) {
//       warning("W127", that);
//     }

//     that.left = left;

//     if (checkComma()) {
//       that.right = expression(context, 10);
//     } else {
//       that.right = null;
//     }

//     return that;
//   }, 10, true);

//   infix("?", function(context, left, that) {
//     increaseComplexityCount();
//     that.left = left;
//     that.right = expression(context & ~prodParams.noin, 10);
//     advance(":");
//     expression(context, 10);
//     return that;
//   }, 30);

//   infix("||", function(context, left, that) {
//     increaseComplexityCount();
//     that.left = left;
//     that.right = expression(context, 40);
//     return that;
//   }, 40);

//   var andPrecedence = 50;
//   infix("&&", function(context, left, that) {
//     increaseComplexityCount();
//     that.left = left;
//     that.right = expression(context, andPrecedence);
//     return that;
//   }, andPrecedence);

//   infix("??", function(context, left, that) {
//     if (!left.paren && (left.id === "||" || left.id === "&&")) {
//       error("E024", that, "??");
//     }

//     if (!state.inES11()) {
//       warning("W119", that, "nullish coalescing", "11");
//     }

//     increaseComplexityCount();
//     that.left = left;
//     var right = that.right = expression(context, 39);

//     if (!right) {
//       error("E024", state.tokens.next, state.tokens.next.id);
//     } else if (!right.paren && (right.id === "||" || right.id === "&&")) {
//       error("E024", that.right, that.right.id);
//     }

//     return that;
//   }, 39);
//   infix("**", function(context, left, that) {
//     if (!state.inES7()) {
//       warning("W119", that, "Exponentiation operator", "7");
//     }
//     if (!left.paren && beginsUnaryExpression(left)) {
//       error("E024", that, "**");
//     }

//     that.left = left;
//     that.right = expression(context, that.rbp);
//     return that;
//   }, 150);
//   state.syntax["**"].rbp = 140;
//   bitwise("|", "bitor", 70);
//   bitwise("^", "bitxor", 80);
//   bitwise("&", "bitand", 90);
//   relation("==", function(context, left, right) {
//     var eqnull = state.option.eqnull &&
//       ((left && left.value) === "null" || (right && right.value) === "null");

//     switch (true) {
//       case !eqnull && state.option.eqeqeq:
//         this.from = this.character;
//         warning("W116", this, "===", "==");
//         break;
//       case isTypoTypeof(right, left, state):
//         warning("W122", this, right.value);
//         break;
//       case isTypoTypeof(left, right, state):
//         warning("W122", this, left.value);
//         break;
//     }

//     return this;
//   });
//   relation("===", function(context, left, right) {
//     if (isTypoTypeof(right, left, state)) {
//       warning("W122", this, right.value);
//     } else if (isTypoTypeof(left, right, state)) {
//       warning("W122", this, left.value);
//     }
//     return this;
//   });
//   relation("!=", function(context, left, right) {
//     var eqnull = state.option.eqnull &&
//         ((left && left.value) === "null" || (right && right.value) === "null");

//     if (!eqnull && state.option.eqeqeq) {
//       this.from = this.character;
//       warning("W116", this, "!==", "!=");
//     } else if (isTypoTypeof(right, left, state)) {
//       warning("W122", this, right.value);
//     } else if (isTypoTypeof(left, right, state)) {
//       warning("W122", this, left.value);
//     }
//     return this;
//   });
//   relation("!==", function(context, left, right) {
//     if (isTypoTypeof(right, left, state)) {
//       warning("W122", this, right.value);
//     } else if (isTypoTypeof(left, right, state)) {
//       warning("W122", this, left.value);
//     }
//     return this;
//   });
//   relation("<");
//   relation(">");
//   relation("<=");
//   relation(">=");
//   bitwise("<<", "shiftleft", 120);
//   bitwise(">>", "shiftright", 120);
//   bitwise(">>>", "shiftrightunsigned", 120);
//   infix("in", "in", 120);
//   infix("instanceof", function(context, left, token) {
//     var right;
//     var scope = state.funct["(scope)"];
//     token.left = left;
//     token.right = right = expression(context, 120);
//     if (!right) {
//       return token;
//     }

//     if (right.id === "(number)" ||
//         right.id === "(string)" ||
//         right.value === "null" ||
//         (right.value === "undefined" && !scope.has("undefined")) ||
//         right.arity === "unary" ||
//         right.id === "{" ||
//         (right.id === "[" && !right.right) ||
//         right.id === "(regexp)" ||
//         (right.id === "(template)" && !right.tag)) {
//       error("E060");
//     }

//     if (right.id === "function") {
//       warning("W139");
//     }

//     return token;
//   }, 120);
//   infix("+", function(context, left, that) {
//     var next = state.tokens.next;
//     var right;
//     that.left = left;
//     that.right = right = expression(context, 130);

//     if (left && right && left.id === "(string)" && right.id === "(string)") {
//       left.value += right.value;
//       left.character = right.character;
//       if (!state.option.scripturl && reg.javascriptURL.test(left.value)) {
//         warning("W050", left);
//       }
//       return left;
//     }

//     if (next.id === "+" || next.id === "++") {
//       warning("W007", that.right);
//     }

//     return that;
//   }, 130);
//   prefix("+", function(context) {
//     var next = state.tokens.next;
//     this.arity = "unary";
//     this.right = expression(context, 150);

//     if (next.id === "+" || next.id === "++") {
//       warning("W007", this.right);
//     }

//     return this;
//   });
//   infix("-", function(context, left, that) {
//     var next = state.tokens.next;
//     that.left = left;
//     that.right = expression(context, 130);

//     if (next.id === "-" || next.id === "--") {
//       warning("W006", that.right);
//     }

//     return that;
//   }, 130);
//   prefix("-", function(context) {
//     var next = state.tokens.next;
//     this.arity = "unary";
//     this.right = expression(context, 150);

//     if (next.id === "-" || next.id === "--") {
//       warning("W006", this.right);
//     }

//     return this;
//   });
//   infix("*", "mult", 140);
//   infix("/", "div", 140);
//   infix("%", "mod", 140);

//   suffix("++");
//   prefix("++", "preinc");
//   state.syntax["++"].exps = true;

//   suffix("--");
//   prefix("--", "predec");
//   state.syntax["--"].exps = true;

//   prefix("delete", function(context) {
//     this.arity = "unary";
//     var p = expression(context, 150);
//     if (!p) {
//       return this;
//     }

//     if (p.id !== "." && p.id !== "[") {
//       warning("W051");
//     }
//     this.first = p;
//     if (p.identifier && !state.isStrict()) {
//       p.forgiveUndef = true;
//     }
//     return this;
//   }).exps = true;

//   prefix("~", function(context) {
//     if (state.option.bitwise) {
//       warning("W016", this, "~");
//     }
//     this.arity = "unary";
//     this.right = expression(context, 150);
//     return this;
//   });

//   infix("...");

//   prefix("!", function(context) {
//     this.arity = "unary";
//     this.right = expression(context, 150);

//     if (!this.right) { // '!' followed by nothing? Give up.
//       quit("E041", this);
//     }

//     if (bang[this.right.id] === true) {
//       warning("W018", this, "!");
//     }
//     return this;
//   });

//   prefix("typeof", function(context) {
//     this.arity = "unary";
//     var p = expression(context, 150);
//     this.first = this.right = p;

//     if (!p) { // 'typeof' followed by nothing? Give up.
//       quit("E041", this);
//     }
//     if (p.identifier) {
//       p.forgiveUndef = true;
//     }
//     return this;
//   });
//   prefix("new", function(context) {
//     var mp = metaProperty(context, "target", function() {
//       if (!state.inES6(true)) {
//         warning("W119", state.tokens.prev, "new.target", "6");
//       }
//       var inFunction, c = state.funct;
//       while (c) {
//         inFunction = !c["(global)"];
//         if (!c["(arrow)"]) { break; }
//         c = c["(context)"];
//       }
//       if (!inFunction) {
//         warning("W136", state.tokens.prev, "new.target");
//       }
//     });
//     if (mp) { return mp; }

//     var opening = state.tokens.next;
//     var c = expression(context, 155), i;

//     if (!c) {
//       return this;
//     }

//     if (!c.paren && c.rbp > 160) {
//       error("E024", opening, opening.value);
//     }

//     if (c.id !== "function") {
//       if (c.identifier) {
//         switch (c.value) {
//         case "Number":
//         case "String":
//         case "Boolean":
//         case "Math":
//         case "JSON":
//           warning("W053", state.tokens.prev, c.value);
//           break;
//         case "Symbol":
//           if (state.inES6()) {
//             warning("W053", state.tokens.prev, c.value);
//           }
//           break;
//         case "Function":
//           if (!state.option.evil) {
//             warning("W054");
//           }
//           break;
//         case "Date":
//         case "RegExp":
//         case "this":
//           break;
//         default:
//           i = c.value.substr(0, 1);
//           if (state.option.newcap && (i < "A" || i > "Z") &&
//             !state.funct["(scope)"].isPredefined(c.value)) {
//             warning("W055", state.tokens.curr);
//           }
//         }
//       } else {
//         if (c.id === "?." && !c.paren) {
//           error("E024", c, "?.");
//         } else if (c.id !== "." && c.id !== "[" && c.id !== "(") {
//           warning("W056", state.tokens.curr);
//         }
//       }
//     } else {
//       if (!state.option.supernew)
//         warning("W057", this);
//     }
//     if (state.tokens.next.id !== "(" && !state.option.supernew) {
//       warning("W058", state.tokens.curr, state.tokens.curr.value);
//     }
//     this.first = this.right = c;
//     return this;
//   });
//   state.syntax["new"].exps = true;


//   var classDeclaration = blockstmt("class", function(context) {
//     var className, classNameToken;

//     if (!state.inES6()) {
//       warning("W104", state.tokens.curr, "class", "6");
//     }
//     state.inClassBody = true;
//     if (state.tokens.next.identifier && state.tokens.next.value !== "extends") {
//       classNameToken = state.tokens.next;
//       className = classNameToken.value;
//       identifier(context);
//       state.funct["(scope)"].addbinding(className, {
//         type: "class",
//         initialized: false,
//         token: classNameToken
//       });
//     }
//     if (state.tokens.next.value === "extends") {
//       advance("extends");
//       expression(context, 0);
//     }

//     if (classNameToken) {
//       this.name = classNameToken;
//       state.funct["(scope)"].initialize(className);
//     } else {
//       this.name = null;
//     }

//     state.funct["(scope)"].stack();
//     classBody(this, context);
//     return this;
//   });
//   classDeclaration.exps = true;
//   classDeclaration.declaration = true;
//   prefix("class", function(context) {
//     var className, classNameToken;

//     if (!state.inES6()) {
//       warning("W104", state.tokens.curr, "class", "6");
//     }
//     state.inClassBody = true;
//     if (state.tokens.next.identifier && state.tokens.next.value !== "extends") {
//       classNameToken = state.tokens.next;
//       className = classNameToken.value;
//       identifier(context);
//     }
//     if (state.tokens.next.value === "extends") {
//       advance("extends");
//       expression(context, 0);
//     }

//     state.funct["(scope)"].stack();
//     if (classNameToken) {
//       this.name = classNameToken;
//       state.funct["(scope)"].addbinding(className, {
//         type: "class",
//         initialized: true,
//         token: classNameToken
//       });
//       state.funct["(scope)"].block.use(className, classNameToken);
//     } else {
//       this.name = null;
//     }

//     classBody(this, context);
//     return this;
//   });

//   function classBody(classToken, context) {
//     var props = Object.create(null);
//     var name, accessorType, token, isStatic, inGenerator, hasConstructor;
//     if (state.tokens.next.value === "{") {
//       advance("{");
//     } else {
//       warning("W116", state.tokens.curr, "identifier", state.tokens.next.type); //?
//       advance();
//     }

//     while (state.tokens.next.value !== "}") {
//       isStatic = false;
//       inGenerator = false;
//       context &= ~prodParams.preAsync;

//       if (state.tokens.next.value === "static" &&
//         !checkPunctuator(peek(), "(")) {
//         isStatic = true;
//         advance();
//       }

//       if (state.tokens.next.value === "async") {
//         if (!checkPunctuator(peek(), "(")) {
//           context |= prodParams.preAsync;
//           advance();

//           nolinebreak(state.tokens.curr);

//           if (checkPunctuator(state.tokens.next, "*")) {
//             inGenerator = true;
//             advance("*");

//             if (!state.inES9()) {
//               warning("W119", state.tokens.next, "async generators", "9");
//             }
//           }

//           if (!state.inES8()) {
//             warning("W119", state.tokens.curr, "async functions", "8");
//           }
//         }
//       }

//       if (state.tokens.next.value === "*") {
//         inGenerator = true;
//         advance();
//       }

//       token = state.tokens.next;

//       if ((token.value === "set" || token.value === "get") && !checkPunctuator(peek(), "(")) {
//         if (inGenerator) {
//           error("E024", token, token.value);
//         }
//         accessorType = token.value;
//         advance();
//         token = state.tokens.next;

//         if (!isStatic && token.value === "constructor") {
//           error("E049", token, "class " + accessorType + "ter method", token.value);
//         } else if (isStatic && token.value === "prototype") {
//           error("E049", token, "static class " + accessorType + "ter method", token.value);
//         }
//       } else {
//         accessorType = null;
//       }

//       switch (token.value) {
//         case ";":
//           warning("W032", token);
//           advance();
//           break;
//         case "constructor":
//           if (isStatic) {
//             name = propertyName(context);
//             saveProperty(props, name, token, true, isStatic);
//             doMethod(classToken, context, name, inGenerator);
//           } else {
//             if (inGenerator || context & prodParams.preAsync) {
//               error("E024", token, token.value);
//             } else if (hasConstructor) {
//               error("E024", token, token.value);
//             } else {
//               hasConstructor = !accessorType && !isStatic;
//             }
//             advance();
//             doMethod(classToken, context, state.nameStack.infer());
//           }
//           break;
//         case "[":
//           name = computedPropertyName(context);
//           doMethod(classToken, context, name, inGenerator);
//           break;
//         default:
//           name = propertyName(context);
//           if (name === undefined) {
//             error("E024", token, token.value);
//             advance();
//             break;
//           }

//           if (accessorType) {
//             saveAccessor(accessorType, props, name, token, true, isStatic);
//             name = state.nameStack.infer();
//           } else {
//             if (isStatic && name === "prototype") {
//               error("E049", token, "static class method", name);
//             }

//             saveProperty(props, name, token, true, isStatic);
//           }

//           doMethod(classToken, context, name, inGenerator);
//           break;
//       }
//     }
//     advance("}");
//     checkProperties(props);

//     state.inClassBody = false;
//     state.funct["(scope)"].unstack();
//   }

//   function doMethod(classToken, context, name, generator) {
//     if (generator) {
//       if (!state.inES6()) {
//         warning("W119", state.tokens.curr, "function*", "6");
//       }
//     }

//     if (state.tokens.next.value !== "(") {
//       error("E054", state.tokens.next, state.tokens.next.value);
//       advance();
//       if (state.tokens.next.value === "{") {
//         advance();
//         if (state.tokens.next.value === "}") {
//           warning("W116", state.tokens.next, "(", state.tokens.next.value);
//           advance();
//           identifier(context);
//           advance();
//         }
//         return;
//       } else {
//         while (state.tokens.next.value !== "(") {
//           advance();
//         }
//       }
//     }

//     doFunction(context, { name: name,
//         type: generator ? "generator" : null,
//         isMethod: true,
//         statement: classToken });
//   }

//   prefix("void").exps = true;

//   infix(".", function(context, left, that) {
//     var m = identifier(context, true);

//     if (typeof m === "string") {
//       countMember(m);
//     }

//     that.left = left;
//     that.right = m;

//     if (m && m === "hasOwnProperty" && state.tokens.next.value === "=") {
//       warning("W001");
//     }

//     if (left && left.value === "arguments" && (m === "callee" || m === "caller")) {
//       if (state.option.noarg)
//         warning("W059", left, m);
//       else if (state.isStrict())
//         error("E008");
//     } else if (!state.option.evil && left && left.value === "document" &&
//         (m === "write" || m === "writeln")) {
//       warning("W060", left);
//     }

//     if (!state.option.evil && (m === "eval" || m === "execScript")) {
//       if (isGlobalEval(left, state)) {
//         warning("W061");
//       }
//     }

//     return that;
//   }, 160, true);

//   infix("?.", function(context, left, that) {
//     if (!state.inES11()) {
//       warning("W119", state.tokens.curr, "Optional chaining", "11");
//     }


//     if (checkPunctuator(state.tokens.next, "[")) {
//       that.left = left;
//       advance();
//       that.right = state.tokens.curr.led(context, left);
//     } else if (checkPunctuator(state.tokens.next, "(")) {
//       that.left = left;
//       advance();
//       that.right = state.tokens.curr.led(context, left);
//       that.exps = true;
//     } else {
//       state.syntax["."].led.call(that, context, left);
//     }

//     if (state.tokens.next.type === "(template)") {
//       error("E024", state.tokens.next, "`");
//     }

//     return that;
//   }, 160, true);
//   function isTypicalCallExpression(token) {
//     return token.identifier || token.id === "." || token.id === "[" ||
//       token.id === "=>" || token.id === "(" || token.id === "&&" ||
//       token.id === "||" || token.id === "?" || token.id === "async" ||
//       token.id === "?." || (state.inES6() && token["(name)"]);
//   }

//   infix("(", function(context, left, that) {
//     if (state.option.immed && left && !left.immed && left.id === "function") {
//       warning("W062");
//     }

//     if (state.option.asi && checkPunctuators(state.tokens.prev, [")", "]"]) &&
//       !sameLine(state.tokens.prev, state.tokens.curr)) {
//       warning("W014", state.tokens.curr, state.tokens.curr.id);
//     }

//     var n = 0;
//     var p = [];

//     if (left) {
//       if (left.type === "(identifier)") {
//         var newcapRe = /^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/;
//         var newcapIgnore = [
//           "Array", "Boolean", "Date", "Error", "Function", "Number",
//           "Object", "RegExp", "String", "Symbol"
//         ];
//         if (newcapRe.test(left.value) && newcapIgnore.indexOf(left.value) === -1) {
//           if (left.value === "Math") {
//             warning("W063", left);
//           } else if (state.option.newcap) {
//             warning("W064", left);
//           }
//         }
//       }
//     }

//     if (state.tokens.next.id !== ")") {
//       for (;;) {
//         spreadrest("spread");

//         p[p.length] = expression(context, 10);
//         n += 1;
//         if (state.tokens.next.id !== ",") {
//           break;
//         }
//         advance(",");
//         checkComma({ allowTrailing: true });

//         if (state.tokens.next.id === ")") {
//           if (!state.inES8()) {
//             warning("W119", state.tokens.curr, "Trailing comma in arguments lists", "8");
//           }

//           break;
//         }
//       }
//     }

//     advance(")");

//     if (typeof left === "object") {
//       if (!state.inES5() && left.value === "parseInt" && n === 1) {
//         warning("W065", state.tokens.curr);
//       }
//       if (!state.option.evil) {
//         if (left.value === "eval" || left.value === "Function" ||
//             left.value === "execScript") {
//           warning("W061", left);
//         } else if (p[0] && p[0].id === "(string)" &&
//              (left.value === "setTimeout" ||
//             left.value === "setInterval")) {
//           warning("W066", left);
//           addEvalCode(left, p[0]);
//         } else if (p[0] && p[0].id === "(string)" &&
//              left.value === "." &&
//              left.left.value === "window" &&
//              (left.right === "setTimeout" ||
//             left.right === "setInterval")) {
//           warning("W066", left);
//           addEvalCode(left, p[0]);
//         }
//       }
//       if (!isTypicalCallExpression(left)) {
//         warning("W067", that);
//       }
//     }

//     that.left = left;
//     return that;
//   }, 155, true).exps = true;

//   function peekThroughParens(parens) {
//     var pn = state.tokens.next;
//     var i = -1;
//     var pn1;

//     do {
//       if (pn.value === "(") {
//         parens += 1;
//       } else if (pn.value === ")") {
//         parens -= 1;
//       }

//       i += 1;
//       pn1 = pn;
//       pn = peek(i);
//     } while (!(parens === 0 && pn1.value === ")") && pn.type !== "(end)");

//     return pn;
//   }

//   prefix("(", function(context, rbp) {
//     var ret, triggerFnExpr, first, last;
//     var opening = state.tokens.curr;
//     var preceeding = state.tokens.prev;
//     var isNecessary = !state.option.singleGroups;
//     var pn = peekThroughParens(1);

//     if (state.tokens.next.id === "function") {
//       triggerFnExpr = state.tokens.next.immed = true;
//     }
//     if (pn.value === "=>") {
//       pn.funct = doFunction(context, { type: "arrow", parsedOpening: true });
//       return pn;
//     }
//     if (state.tokens.next.id === ")") {
//       advance(")");
//       return;
//     }

//     ret = expression(context, 0);

//     advance(")", this);

//     if (!ret) {
//       return;
//     }

//     ret.paren = true;

//     if (state.option.immed && ret && ret.id === "function") {
//       if (state.tokens.next.id !== "(" &&
//         state.tokens.next.id !== "." && state.tokens.next.id !== "[") {
//         warning("W068", this);
//       }
//     }

//     if (ret.id === ",") {
//       first = ret.left;
//       while (first.id === ",") {
//         first = first.left;
//       }

//       last = ret.right;
//     } else {
//       first = last = ret;

//       if (!isNecessary) {
//         if (!triggerFnExpr) {
//           triggerFnExpr = ret.id === "async";
//         }

//         isNecessary =
//           (opening.beginsStmt && (ret.id === "{" || triggerFnExpr)) ||
//           (triggerFnExpr &&
//             (!isEndOfExpr() || state.tokens.prev.id !== "}")) ||
//           (ret.id === "=>" && !isEndOfExpr()) ||
//           (ret.id === "{" && preceeding.id === "=>") ||
//           (beginsUnaryExpression(ret) && state.tokens.next.id === "**") ||
//           (preceeding.id === "??" && (ret.id === "&&" || ret.id === "||")) ||
//           (ret.type === "(number)" &&
//             checkPunctuator(pn, ".") && /^\d+$/.test(ret.value)) ||
//           (opening.beginsStmt && ret.id === "=" && ret.left.id === "{") ||
//           (ret.id === "?." &&
//               (preceeding.id === "new" || state.tokens.next.type === "(template)"));
//       }
//     }
//     if (!isNecessary && (isOperator(first) || first !== last)) {
//       isNecessary =
//         (rbp > first.lbp) ||
//         (rbp > 0 && rbp === first.lbp) ||
//         (!isEndOfExpr() && last.rbp < state.tokens.next.lbp);
//     }

//     if (!isNecessary) {
//       warning("W126", opening);
//     }

//     return ret;
//   });

//   application("=>").rbp = 161;

//   infix("[", function(context, left, that) {
//     var e, s, canUseDot;

//     if (state.option.asi && checkPunctuators(state.tokens.prev, [")", "]"]) &&
//       !sameLine(state.tokens.prev, state.tokens.curr)) {
//       warning("W014", state.tokens.curr, state.tokens.curr.id);
//     }

//     e = expression(context & ~prodParams.noin, 0);

//     if (e && e.type === "(string)") {
//       if (!state.option.evil && (e.value === "eval" || e.value === "execScript")) {
//         if (isGlobalEval(left, state)) {
//           warning("W061");
//         }
//       }

//       countMember(e.value);
//       if (!state.option.sub && reg.identifier.test(e.value)) {
//         s = state.syntax[e.value];

//         if (s) {
//           canUseDot = !isReserved(context, s);
//         } else {
//           canUseDot = e.value !== "eval" && e.value !== "arguments";
//         }

//         if (canUseDot) {
//           warning("W069", state.tokens.prev, e.value);
//         }
//       }
//     }
//     advance("]", that);

//     if (e && e.value === "hasOwnProperty" && state.tokens.next.value === "=") {
//       warning("W001");
//     }

//     that.left = left;
//     that.right = e;
//     return that;
//   }, 160, true);

//   function comprehensiveArrayExpression(context) {
//     var res = {};
//     res.exps = true;
//     state.funct["(comparray)"].stack();
//     var reversed = false;
//     if (state.tokens.next.value !== "for") {
//       reversed = true;
//       if (!state.inMoz()) {
//         warning("W116", state.tokens.next, "for", state.tokens.next.value);
//       }
//       state.funct["(comparray)"].setState("use");
//       res.right = expression(context, 10);
//     }

//     advance("for");
//     if (state.tokens.next.value === "each") {
//       advance("each");
//       if (!state.inMoz()) {
//         warning("W118", state.tokens.curr, "for each");
//       }
//     }
//     advance("(");
//     state.funct["(comparray)"].setState("define");
//     res.left = expression(context, 130);
//     if (_.includes(["in", "of"], state.tokens.next.value)) {
//       advance();
//     } else {
//       error("E045", state.tokens.curr);
//     }
//     state.funct["(comparray)"].setState("generate");
//     expression(context, 10);

//     advance(")");
//     if (state.tokens.next.value === "if") {
//       advance("if");
//       advance("(");
//       state.funct["(comparray)"].setState("filter");
//       expression(context, 10);
//       advance(")");
//     }

//     if (!reversed) {
//       state.funct["(comparray)"].setState("use");
//       res.right = expression(context, 10);
//     }

//     advance("]");
//     state.funct["(comparray)"].unstack();
//     return res;
//   }

//   prefix("[", function(context) {
//     var blocktype = lookupBlockType();
//     if (blocktype.isCompArray) {
//       if (!state.option.esnext && !state.inMoz()) {
//         warning("W118", state.tokens.curr, "array comprehension");
//       }
//       return comprehensiveArrayExpression(context);
//     } else if (blocktype.isDestAssign) {
//       this.destructAssign = destructuringPattern(context, {
//           openingParsed: true,
//           assignment: true
//         });
//       return this;
//     }
//     var b = !sameLine(state.tokens.curr, state.tokens.next);
//     this.first = [];
//     if (b) {
//       indent += state.option.indent;
//       if (state.tokens.next.from === indent + state.option.indent) {
//         indent += state.option.indent;
//       }
//     }
//     while (state.tokens.next.id !== "(end)") {
//       while (state.tokens.next.id === ",") {
//         if (!state.option.elision) {
//           if (!state.inES5()) {
//             warning("W070");
//           } else {
//             warning("W128");
//             do {
//               advance(",");
//             } while (state.tokens.next.id === ",");
//             continue;
//           }
//         }
//         advance(",");
//       }

//       if (state.tokens.next.id === "]") {
//         break;
//       }

//       spreadrest("spread");

//       this.first.push(expression(context, 10));
//       if (state.tokens.next.id === ",") {
//         advance(",");
//         checkComma({ allowTrailing: true });
//         if (state.tokens.next.id === "]" && !state.inES5()) {
//           warning("W070", state.tokens.curr);
//           break;
//         }
//       } else {
//         if (state.option.trailingcomma && state.inES5()) {
//           warningAt("W140", state.tokens.curr.line, state.tokens.curr.character);
//         }
//         break;
//       }
//     }
//     if (b) {
//       indent -= state.option.indent;
//     }
//     advance("]", this);
//     return this;
//   });


//   function isMethod() {
//     return !!state.funct["(method)"];
//   }
//   function propertyName(context) {
//     var id = optionalidentifier(context, true);

//     if (!id) {
//       if (state.tokens.next.id === "(string)") {
//         id = state.tokens.next.value;
//         advance();
//       } else if (state.tokens.next.id === "(number)") {
//         id = state.tokens.next.value.toString();
//         advance();
//       }
//     }

//     if (id === "hasOwnProperty") {
//       warning("W001");
//     }

//     return id;
//   }
//   function functionparams(context, options) {
//     var next;
//     var paramsIds = [];
//     var ident;
//     var tokens = [];
//     var t;
//     var pastDefault = false;
//     var pastRest = false;
//     var arity = 0;
//     var loneArg = options && options.loneArg;
//     var hasDestructuring = false;

//     if (loneArg && loneArg.identifier === true) {
//       state.funct["(scope)"].addParam(loneArg.value, loneArg);
//       return { arity: 1, params: [ loneArg.value ], isSimple: true };
//     }

//     next = state.tokens.next;

//     if (!options || !options.parsedOpening) {
//       advance("(");
//     }

//     if (state.tokens.next.id === ")") {
//       advance(")");
//       return;
//     }

//     function addParam(addParamArgs) {
//       state.funct["(scope)"].addParam.apply(state.funct["(scope)"], addParamArgs);
//     }

//     for (;;) {
//       arity++;
//       var currentParams = [];

//       pastRest = spreadrest("rest");

//       if (_.includes(["{", "["], state.tokens.next.id)) {
//         hasDestructuring = true;
//         tokens = destructuringPattern(context);
//         for (t in tokens) {
//           t = tokens[t];
//           if (t.id) {
//             paramsIds.push(t.id);
//             currentParams.push([t.id, t.token]);
//           }
//         }
//       } else {
//         ident = identifier(context);

//         if (ident) {
//           paramsIds.push(ident);
//           currentParams.push([ident, state.tokens.curr]);
//         } else {
//           while (!checkPunctuators(state.tokens.next, [",", ")"])) advance();
//         }
//       }
//       if (pastDefault) {
//         if (state.tokens.next.id !== "=") {
//           error("W138", state.tokens.curr);
//         }
//       }
//       if (state.tokens.next.id === "=") {
//         if (!state.inES6()) {
//           warning("W119", state.tokens.next, "default parameters", "6");
//         }

//         if (pastRest) {
//           error("E062", state.tokens.next);
//         }

//         advance("=");
//         pastDefault = true;
//         expression(context, 10);
//       }
//       currentParams.forEach(addParam);
//       if (state.tokens.next.id === ",") {
//         if (pastRest) {
//           warning("W131", state.tokens.next);
//         }
//         advance(",");
//         checkComma({ allowTrailing: true });
//       }

//       if (state.tokens.next.id === ")") {
//         if (state.tokens.curr.id === "," && !state.inES8()) {
//           warning("W119", state.tokens.curr, "Trailing comma in function parameters", "8");
//         }

//         advance(")", next);
//         return {
//           arity: arity,
//           params: paramsIds,
//           isSimple: !hasDestructuring && !pastRest && !pastDefault
//         };
//       }
//     }
//   }
//   function functor(name, token, overwrites) {
//     var funct = {
//       "(name)"      : name,
//       "(breakage)"  : 0,
//       "(loopage)"   : 0,
//       "(isStrict)"  : "unknown",

//       "(global)"    : false,

//       "(line)"      : null,
//       "(character)" : null,
//       "(metrics)"   : null,
//       "(statement)" : null,
//       "(context)"   : null,
//       "(scope)"     : null,
//       "(comparray)" : null,
//       "(yielded)"   : null,
//       "(arrow)"     : null,
//       "(async)"     : null,
//       "(params)"    : null
//     };

//     if (token) {
//       _.extend(funct, {
//         "(line)"     : token.line,
//         "(character)": token.character,
//         "(metrics)"  : createMetrics(token)
//       });
//     }

//     _.extend(funct, overwrites);

//     if (funct["(context)"]) {
//       funct["(scope)"] = funct["(context)"]["(scope)"];
//       funct["(comparray)"]  = funct["(context)"]["(comparray)"];
//     }

//     return funct;
//   }
//   function hasParsedCode(funct) {
//     return funct["(global)"] && !funct["(verb)"];
//   }
//   function doTemplateLiteral(context, leftOrRbp) {
//     var ctx = this.context;
//     var noSubst = this.noSubst;
//     var depth = this.depth;
//     var left = typeof leftOrRbp === "number" ? null : leftOrRbp;

//     if (!noSubst) {
//       while (!end()) {
//         if (!state.tokens.next.template || state.tokens.next.depth > depth) {
//           expression(context, 0); // should probably have different rbp?
//         } else {
//           advance();
//         }
//       }
//     }

//     return {
//       id: "(template)",
//       type: "(template)",
//       tag: left
//     };

//     function end() {
//       if (state.tokens.curr.template && state.tokens.curr.tail &&
//           state.tokens.curr.context === ctx) {
//         return true;
//       }
//       var complete = (state.tokens.next.template && state.tokens.next.tail &&
//                       state.tokens.next.context === ctx);
//       if (complete) advance();
//       return complete || state.tokens.next.isUnclosed;
//     }
//   }
//   function doFunction(context, options) {
//     var f, token, name, statement, classExprBinding, isGenerator, isArrow,
//       isMethod, ignoreLoopFunc;
//     var oldOption = state.option;
//     var oldIgnored = state.ignored;
//     var isAsync = context & prodParams.preAsync;

//     if (options) {
//       name = options.name;
//       statement = options.statement;
//       classExprBinding = options.classExprBinding;
//       isGenerator = options.type === "generator";
//       isArrow = options.type === "arrow";
//       isMethod = options.isMethod;
//       ignoreLoopFunc = options.ignoreLoopFunc;
//     }

//     context &= ~prodParams.noin;
//     context &= ~prodParams.tryClause;

//     if (isAsync) {
//       context |= prodParams.async;
//     } else {
//       context &= ~prodParams.async;
//     }

//     if (isGenerator) {
//       context |= prodParams.yield;
//     } else if (!isArrow) {
//       context &= ~prodParams.yield;
//     }
//     context &= ~prodParams.preAsync;

//     state.option = Object.create(state.option);
//     state.ignored = Object.create(state.ignored);

//     state.funct = functor(name || state.nameStack.infer(), state.tokens.next, {
//       "(statement)": statement,
//       "(context)":   state.funct,
//       "(arrow)":     isArrow,
//       "(method)":    isMethod,
//       "(async)":     isAsync
//     });

//     f = state.funct;
//     token = state.tokens.curr;

//     functions.push(state.funct);
//     state.funct["(scope)"].stack("functionouter");
//     var internallyAccessibleName = !isMethod && (name || classExprBinding);
//     if (internallyAccessibleName) {
//       state.funct["(scope)"].block.add(internallyAccessibleName,
//         classExprBinding ? "class" : "function", state.tokens.curr, false);
//     }

//     if (!isArrow) {
//       state.funct["(scope)"].funct.add("arguments", "var", token, false);
//     }
//     state.funct["(scope)"].stack("functionparams");

//     var paramsInfo = functionparams(context, options);

//     if (paramsInfo) {
//       state.funct["(params)"] = paramsInfo.params;
//       state.funct["(hasSimpleParams)"] = paramsInfo.isSimple;
//       state.funct["(metrics)"].arity = paramsInfo.arity;
//       state.funct["(metrics)"].verifyMaxParametersPerFunction();
//     } else {
//       state.funct["(params)"] = [];
//       state.funct["(metrics)"].arity = 0;
//       state.funct["(hasSimpleParams)"] = true;
//     }

//     if (isArrow) {
//       context &= ~prodParams.yield;

//       if (!state.inES6(true)) {
//         warning("W119", state.tokens.curr, "arrow function syntax (=>)", "6");
//       }

//       if (!options.loneArg) {
//         advance("=>");
//       }
//     }

//     block(context, false, true, true, isArrow);

//     if (!state.option.noyield && isGenerator && !state.funct["(yielded)"]) {
//       warning("W124", state.tokens.curr);
//     }

//     state.funct["(metrics)"].verifyMaxStatementsPerFunction();
//     state.funct["(metrics)"].verifyMaxComplexityPerFunction();
//     state.funct["(unusedOption)"] = state.option.unused;
//     state.option = oldOption;
//     state.ignored = oldIgnored;
//     state.funct["(last)"] = state.tokens.curr.line;
//     state.funct["(lastcharacter)"] = state.tokens.curr.character;
//     state.funct["(scope)"].unstack(); // also does usage and label checks
//     state.funct["(scope)"].unstack();

//     state.funct = state.funct["(context)"];

//     if (!ignoreLoopFunc && !state.option.loopfunc && state.funct["(loopage)"]) {
//       if (f["(outerMutables)"]) {
//         warning("W083", token, f["(outerMutables)"].join(", "));
//       }
//     }

//     return f;
//   }

//   function createMetrics(functionStartToken) {
//     return {
//       statementCount: 0,
//       nestedBlockDepth: -1,
//       ComplexityCount: 1,
//       arity: 0,

//       verifyMaxStatementsPerFunction: function() {
//         if (state.option.maxstatements &&
//           this.statementCount > state.option.maxstatements) {
//           warning("W071", functionStartToken, this.statementCount);
//         }
//       },

//       verifyMaxParametersPerFunction: function() {
//         if (_.isNumber(state.option.maxparams) &&
//           this.arity > state.option.maxparams) {
//           warning("W072", functionStartToken, this.arity);
//         }
//       },

//       verifyMaxNestedBlockDepthPerFunction: function() {
//         if (state.option.maxdepth &&
//           this.nestedBlockDepth > 0 &&
//           this.nestedBlockDepth === state.option.maxdepth + 1) {
//           warning("W073", null, this.nestedBlockDepth);
//         }
//       },

//       verifyMaxComplexityPerFunction: function() {
//         var max = state.option.maxcomplexity;
//         var cc = this.ComplexityCount;
//         if (max && cc > max) {
//           warning("W074", functionStartToken, cc);
//         }
//       }
//     };
//   }

//   function increaseComplexityCount() {
//     state.funct["(metrics)"].ComplexityCount += 1;
//   }

//   function checkCondAssignment(token) {
//     if (!token || token.paren) {
//       return;
//     }

//     if (token.id === ",") {
//       checkCondAssignment(token.right);
//       return;
//     }

//     switch (token.id) {
//     case "=":
//     case "+=":
//     case "-=":
//     case "*=":
//     case "%=":
//     case "&=":
//     case "|=":
//     case "^=":
//     case "/=":
//       if (!state.option.boss) {
//         warning("W084", token);
//       }
//     }
//   }
//   function checkProperties(props) {
//     if (state.inES5()) {
//       for (var name in props) {
//         if (props[name] && props[name].setterToken && !props[name].getterToken &&
//           !props[name].static) {
//           warning("W078", props[name].setterToken);
//         }
//       }
//     }
//   }

//   function metaProperty(context, name, c) {
//     if (checkPunctuator(state.tokens.next, ".")) {
//       var left = state.tokens.curr.id;
//       advance(".");
//       var id = identifier(context);
//       state.tokens.curr.isMetaProperty = true;
//       if (name !== id) {
//         error("E057", state.tokens.prev, left, id);
//       } else {
//         c();
//       }
//       return state.tokens.curr;
//     }
//   }
//   (function(x) {
//     x.nud = function(context) {
//       var b, f, i, params, t, isGeneratorMethod = false, nextVal;
//       var props = Object.create(null); // All properties, including accessors
//       var isAsyncMethod = false;

//       b = !sameLine(state.tokens.curr, state.tokens.next);
//       if (b) {
//         indent += state.option.indent;
//         if (state.tokens.next.from === indent + state.option.indent) {
//           indent += state.option.indent;
//         }
//       }

//       var blocktype = lookupBlockType();
//       if (blocktype.isDestAssign) {
//         this.destructAssign = destructuringPattern(context, {
//             openingParsed: true,
//             assignment: true
//           });
//         return this;
//       }
//       state.inObjectBody = true;
//       for (;;) {
//         if (state.tokens.next.id === "}") {
//           break;
//         }

//         nextVal = state.tokens.next.value;
//         if (state.tokens.next.identifier &&
//             (peekIgnoreEOL().id === "," || peekIgnoreEOL().id === "}")) {
//           if (!state.inES6()) {
//             warning("W104", state.tokens.next, "object short notation", "6");
//           }
//           t = expression(context, 10);
//           i = t && t.value;
//           if (t) {
//             saveProperty(props, i, t);
//           }

//         } else if (peek().id !== ":" && (nextVal === "get" || nextVal === "set")) {
//           advance(nextVal);

//           if (!state.inES5()) {
//             error("E034");
//           }

//           if (state.tokens.next.id === "[") {
//             i = computedPropertyName(context);
//           } else {
//             i = propertyName(context);
//             if (!i && !state.inES6()) {
//               error("E035");
//             }
//           }
//           if (i) {
//             saveAccessor(nextVal, props, i, state.tokens.curr);
//           }

//           t = state.tokens.next;
//           f = doFunction(context, { isMethod: true });
//           params = f["(params)"];
//           if (nextVal === "get" && i && params.length) {
//             warning("W076", t, params[0], i);
//           } else if (nextVal === "set" && i && f["(metrics)"].arity !== 1) {
//             warning("W077", t, i);
//           }

//         } else if (spreadrest("spread")) {
//           if (!state.inES9()) {
//             warning("W119", state.tokens.next, "object spread property", "9");
//           }

//           expression(context, 10);
//         } else {
//           if (state.tokens.next.id === "async" && !checkPunctuators(peek(), ["(", ":"])) {
//             if (!state.inES8()) {
//               warning("W119", state.tokens.next, "async functions", "8");
//             }

//             isAsyncMethod = true;
//             advance();

//             nolinebreak(state.tokens.curr);
//           } else {
//             isAsyncMethod = false;
//           }

//           if (state.tokens.next.value === "*" && state.tokens.next.type === "(punctuator)") {
//             if (isAsyncMethod && !state.inES9()) {
//               warning("W119", state.tokens.next, "async generators", "9");
//             } else if (!state.inES6()) {
//               warning("W104", state.tokens.next, "generator functions", "6");
//             }

//             advance("*");
//             isGeneratorMethod = true;
//           } else {
//             isGeneratorMethod = false;
//           }

//           if (state.tokens.next.id === "[") {
//             i = computedPropertyName(context);
//             state.nameStack.set(i);
//           } else {
//             state.nameStack.set(state.tokens.next);
//             i = propertyName(context);
//             saveProperty(props, i, state.tokens.next);

//             if (typeof i !== "string") {
//               break;
//             }
//           }

//           if (state.tokens.next.value === "(") {
//             if (!state.inES6()) {
//               warning("W104", state.tokens.curr, "concise methods", "6");
//             }

//             doFunction(isAsyncMethod ? context | prodParams.preAsync : context, {
//               isMethod: true,
//               type: isGeneratorMethod ? "generator" : null
//             });
//           } else {
//             advance(":");
//             expression(context, 10);
//           }
//         }

//         countMember(i);

//         if (state.tokens.next.id === ",") {
//           advance(",");
//           checkComma({ allowTrailing: true, property: true });
//           if (state.tokens.next.id === ",") {
//             warning("W070", state.tokens.curr);
//           } else if (state.tokens.next.id === "}" && !state.inES5()) {
//             warning("W070", state.tokens.curr);
//           }
//         } else {
//           if (state.option.trailingcomma && state.inES5()) {
//             warningAt("W140", state.tokens.curr.line, state.tokens.curr.character);
//           }
//           break;
//         }
//       }
//       if (b) {
//         indent -= state.option.indent;
//       }
//       advance("}", this);

//       checkProperties(props);
//       state.inObjectBody = false;

//       return this;
//     };
//     x.fud = function() {
//       error("E036", state.tokens.curr);
//     };
//   }(delim("{")));

//   function destructuringPattern(context, options) {
//     var isAssignment = options && options.assignment;

//     context &= ~prodParams.noin;

//     if (!state.inES6()) {
//       warning("W104", state.tokens.curr,
//         isAssignment ? "destructuring assignment" : "destructuring binding", "6");
//     }

//     return destructuringPatternRecursive(context, options);
//   }

//   function destructuringPatternRecursive(context, options) {
//     var ids, idx;
//     var identifiers = [];
//     var openingParsed = options && options.openingParsed;
//     var isAssignment = options && options.assignment;
//     var recursiveOptions = isAssignment ? { assignment: isAssignment } : null;
//     var firstToken = openingParsed ? state.tokens.curr : state.tokens.next;

//     var nextInnerDE = function() {
//       var ident;
//       if (checkPunctuators(state.tokens.next, ["[", "{"])) {
//         ids = destructuringPatternRecursive(context, recursiveOptions);
//         for (idx = 0; idx < ids.length; idx++) {
//           identifiers.push({ id: ids[idx].id, token: ids[idx].token });
//         }
//       } else if (checkPunctuator(state.tokens.next, ",")) {
//         identifiers.push({ id: null, token: state.tokens.curr });
//       } else if (checkPunctuator(state.tokens.next, "(")) {
//         advance("(");
//         nextInnerDE();
//         advance(")");
//       } else {
//         if (isAssignment) {
//           var assignTarget = expression(context, 20);
//           if (assignTarget) {
//             checkLeftSideAssign(context, assignTarget);
//             if (assignTarget.identifier) {
//               ident = assignTarget.value;
//             }
//           }
//         } else {
//           ident = identifier(context);
//         }
//         if (ident) {
//           identifiers.push({ id: ident, token: state.tokens.curr });
//         }
//       }
//     };

//     var assignmentProperty = function(context) {
//       var id, expr;

//       if (checkPunctuator(state.tokens.next, "[")) {
//         advance("[");
//         expression(context, 10);
//         advance("]");
//         advance(":");
//         nextInnerDE();
//       } else if (state.tokens.next.id === "(string)" ||
//                  state.tokens.next.id === "(number)") {
//         advance();
//         advance(":");
//         nextInnerDE();
//       } else {
//         var isRest = spreadrest("rest");

//         if (isRest) {
//           if (!state.inES9()) {
//             warning("W119", state.tokens.next, "object rest property", "9");
//           }
//           if (state.tokens.next.type === "(identifier)") {
//             id = identifier(context);
//           } else {
//             expr = expression(context, 10);
//             error("E030", expr, expr.value);
//           }
//         } else {
//           id = identifier(context);
//         }

//         if (!isRest && checkPunctuator(state.tokens.next, ":")) {
//           advance(":");
//           nextInnerDE();
//         } else if (id) {
//           if (isAssignment) {
//             checkLeftSideAssign(context, state.tokens.curr);
//           }
//           identifiers.push({ id: id, token: state.tokens.curr });
//         }

//         if (isRest && checkPunctuator(state.tokens.next, ",")) {
//           warning("W130", state.tokens.next);
//         }
//       }
//     };

//     var id, value;
//     if (checkPunctuator(firstToken, "[")) {
//       if (!openingParsed) {
//         advance("[");
//       }
//       if (checkPunctuator(state.tokens.next, "]")) {
//         warning("W137", state.tokens.curr);
//       }
//       var element_after_rest = false;
//       while (!checkPunctuator(state.tokens.next, "]")) {
//         var isRest = spreadrest("rest");

//         nextInnerDE();

//         if (isRest && !element_after_rest &&
//             checkPunctuator(state.tokens.next, ",")) {
//           warning("W130", state.tokens.next);
//           element_after_rest = true;
//         }
//         if (!isRest && checkPunctuator(state.tokens.next, "=")) {
//           if (checkPunctuator(state.tokens.prev, "...")) {
//             advance("]");
//           } else {
//             advance("=");
//           }
//           id = state.tokens.prev;
//           value = expression(context, 10);
//           if (value && value.identifier && value.value === "undefined") {
//             warning("W080", id, id.value);
//           }
//         }
//         if (!checkPunctuator(state.tokens.next, "]")) {
//           advance(",");
//         }
//       }
//       advance("]");
//     } else if (checkPunctuator(firstToken, "{")) {

//       if (!openingParsed) {
//         advance("{");
//       }
//       if (checkPunctuator(state.tokens.next, "}")) {
//         warning("W137", state.tokens.curr);
//       }
//       while (!checkPunctuator(state.tokens.next, "}")) {
//         assignmentProperty(context);
//         if (checkPunctuator(state.tokens.next, "=")) {
//           advance("=");
//           id = state.tokens.prev;
//           value = expression(context, 10);
//           if (value && value.identifier && value.value === "undefined") {
//             warning("W080", id, id.value);
//           }
//         }
//         if (!checkPunctuator(state.tokens.next, "}")) {
//           advance(",");
//           if (checkPunctuator(state.tokens.next, "}")) {
//             break;
//           }
//         }
//       }
//       advance("}");
//     }
//     return identifiers;
//   }

//   function destructuringPatternMatch(tokens, value) {
//     var first = value.first;

//     if (!first)
//       return;

//     _.zip(tokens, Array.isArray(first) ? first : [ first ]).forEach(function(val) {
//       var token = val[0];
//       var value = val[1];

//       if (token && value)
//         token.first = value;
//       else if (token && token.first && !value)
//         warning("W080", token.first, token.first.value);
//     });
//   }

//   function blockVariableStatement(type, statement, context) {

//     var noin = context & prodParams.noin;
//     var isLet = type === "let";
//     var isConst = type === "const";
//     var tokens, lone, value, letblock;

//     if (!state.inES6()) {
//       warning("W104", state.tokens.curr, type, "6");
//     }

//     if (isLet && isMozillaLet()) {
//       advance("(");
//       state.funct["(scope)"].stack();
//       letblock = true;
//       statement.declaration = false;
//     }

//     statement.first = [];
//     for (;;) {
//       var names = [];
//       if (_.includes(["{", "["], state.tokens.next.value)) {
//         tokens = destructuringPattern(context);
//         lone = false;
//       } else {
//         tokens = [ { id: identifier(context), token: state.tokens.curr } ];
//         lone = true;
//       }
//       if (!noin && isConst && state.tokens.next.id !== "=") {
//         warning("E012", state.tokens.curr, state.tokens.curr.value);
//       }

//       for (var t in tokens) {
//         if (tokens.hasOwnProperty(t)) {
//           t = tokens[t];
//           if (t.id === "let") {
//             warning("W024", t.token, t.id);
//           }

//           if (state.funct["(scope)"].block.isGlobal()) {
//             if (predefined[t.id] === false) {
//               warning("W079", t.token, t.id);
//             }
//           }
//           if (t.id) {
//             state.funct["(scope)"].addbinding(t.id, {
//               type: type,
//               token: t.token });
//             names.push(t.token);
//           }
//         }
//       }

//       if (state.tokens.next.id === "=") {
//         statement.hasInitializer = true;

//         advance("=");
//         if (!noin && peek(0).id === "=" && state.tokens.next.identifier) {
//           warning("W120", state.tokens.next, state.tokens.next.value);
//         }
//         var id = state.tokens.prev;
//         value = expression(context, 10);
//         if (value) {
//           if (!isConst && value.identifier && value.value === "undefined") {
//             warning("W080", id, id.value);
//           }
//           if (!lone) {
//             destructuringPatternMatch(names, value);
//           }
//         }
//       }
//       if (state.tokens.next.value !== "in" && state.tokens.next.value !== "of") {
//         for (t in tokens) {
//           if (tokens.hasOwnProperty(t)) {
//             t = tokens[t];
//             state.funct["(scope)"].initialize(t.id);
//           }
//         }
//       }

//       statement.first = statement.first.concat(names);

//       if (state.tokens.next.id !== ",") {
//         break;
//       }

//       statement.hasComma = true;
//       advance(",");
//       checkComma();
//     }
//     if (letblock) {
//       advance(")");
//       block(context, true, true);
//       statement.block = true;
//       state.funct["(scope)"].unstack();
//     }

//     return statement;
//   }

//   var conststatement = stmt("const", function(context) {
//     return blockVariableStatement("const", this, context);
//   });
//   conststatement.exps = true;
//   conststatement.declaration = true;
//   function isMozillaLet() {
//     return state.tokens.next.id === "(" && state.inMoz();
//   }
//   var letstatement = stmt("let", function(context) {
//     return blockVariableStatement("let", this, context);
//   });
//   letstatement.nud = function(context, rbp) {
//     if (isMozillaLet()) {
//       state.funct["(scope)"].stack();
//       advance("(");
//       state.tokens.prev.fud(context);
//       advance(")");
//       expression(context, rbp);
//       state.funct["(scope)"].unstack();
//     } else {
//       this.exps = false;
//       return state.syntax["(identifier)"].nud.apply(this, arguments);
//     }
//   };
//   letstatement.meta = { es5: true, isFutureReservedWord: false, strictOnly: true };
//   letstatement.exps = true;
//   letstatement.declaration = true;
//   letstatement.useFud = function(context) {
//     var next = state.tokens.next;
//     var nextIsBindingName;

//     if (this.line !== next.line && !state.inES6()) {
//       return false;
//     }
//     nextIsBindingName = next.identifier && (!isReserved(context, next) ||
//       next.id === "let");

//     return nextIsBindingName || checkPunctuators(next, ["{", "["]) ||
//       isMozillaLet();
//   };

//   var varstatement = stmt("var", function(context) {
//     var noin = context & prodParams.noin;
//     var tokens, lone, value, id;

//     this.first = [];
//     for (;;) {
//       var names = [];
//       if (_.includes(["{", "["], state.tokens.next.value)) {
//         tokens = destructuringPattern(context);
//         lone = false;
//       } else {
//         tokens = [];
//         id = identifier(context);

//         if (id) {
//           tokens.push({ id: id, token: state.tokens.curr });
//         }

//         lone = true;
//       }

//       if (state.option.varstmt) {
//         warning("W132", this);
//       }


//       for (var t in tokens) {
//         if (tokens.hasOwnProperty(t)) {
//           t = tokens[t];
//           if (state.funct["(global)"] && !state.impliedClosure()) {
//             if (predefined[t.id] === false) {
//               warning("W079", t.token, t.id);
//             } else if (state.option.futurehostile === false) {
//               if ((!state.inES5() && vars.ecmaIdentifiers[5][t.id] === false) ||
//                 (!state.inES6() && vars.ecmaIdentifiers[6][t.id] === false)) {
//                 warning("W129", t.token, t.id);
//               }
//             }
//           }
//           if (t.id) {
//             state.funct["(scope)"].addbinding(t.id, {
//               type: "var",
//               token: t.token });

//             names.push(t.token);
//           }
//         }
//       }

//       if (state.tokens.next.id === "=") {
//         this.hasInitializer = true;

//         state.nameStack.set(state.tokens.curr);

//         advance("=");
//         if (peek(0).id === "=" && state.tokens.next.identifier) {
//           if (!noin &&
//               !state.funct["(params)"] ||
//               state.funct["(params)"].indexOf(state.tokens.next.value) === -1) {
//             warning("W120", state.tokens.next, state.tokens.next.value);
//           }
//         }
//         id = state.tokens.prev;
//         value = expression(context, 10);
//         if (value) {
//           if (!state.funct["(loopage)"] && value.identifier &&
//             value.value === "undefined") {
//             warning("W080", id, id.value);
//           }
//           if (!lone) {
//             destructuringPatternMatch(names, value);
//           }
//         }
//       }

//       this.first = this.first.concat(names);

//       if (state.tokens.next.id !== ",") {
//         break;
//       }
//       this.hasComma = true;
//       advance(",");
//       checkComma();
//     }

//     return this;
//   });
//   varstatement.exps = true;

//   blockstmt("function", function(context) {
//     var inexport = context & prodParams.export;
//     var generator = false;
//     var isAsync = context & prodParams.preAsync;
//     var labelType = "";

//     if (isAsync) {
//       labelType = "async ";
//     }

//     if (state.tokens.next.value === "*") {
//       if (isAsync && !state.inES9()) {
//         warning("W119", state.tokens.prev, "async generators", "9");
//       } else if (!isAsync && !state.inES6(true)) {
//         warning("W119", state.tokens.next, "function*", "6");
//       }

//       advance("*");
//       labelType += "generator ";
//       generator = true;
//     }

//     labelType += "function";

//     if (inblock) {
//       warning("W082", state.tokens.curr);
//     }
//     this.name = optionalidentifier(context) ? state.tokens.curr : null;

//     if (!this.name) {
//       if (!inexport) {
//         warning("W025");
//       }
//     } else {
//       state.funct["(scope)"].addbinding(this.name.value, {
//         type: labelType,
//         token: state.tokens.curr,
//         initialized: true });
//     }

//     var f = doFunction(context, {
//       name: this.name && this.name.value,
//       statement: this,
//       type: generator ? "generator" : null,
//       ignoreLoopFunc: inblock // a declaration may already have warned
//     });
//     var enablesStrictMode = f["(isStrict)"] && !state.isStrict();
//     if (this.name && (f["(name)"] === "arguments" || f["(name)"] === "eval") &&
//       enablesStrictMode) {
//       error("E008", this.name);
//     }
//     if (state.tokens.next.id === "(" && peek().id === ")" && peek(1).id !== "=>" &&
//       state.tokens.next.line === state.tokens.curr.line) {
//       error("E039");
//     }
//     return this;
//   }).declaration = true;

//   prefix("function", function(context) {
//     var generator = false;
//     var isAsync = context & prodParams.preAsync;

//     if (state.tokens.next.value === "*") {
//       if (isAsync && !state.inES9()) {
//         warning("W119", state.tokens.prev, "async generators", "9");
//       } else if (!isAsync && !state.inES6(true)) {
//         warning("W119", state.tokens.curr, "function*", "6");
//       }

//       advance("*");
//       generator = true;
//     }
//     this.name = optionalidentifier(isAsync ? context | prodParams.async : context) ?
//       state.tokens.curr : null;

//     var f = doFunction(context, {
//       name: this.name && this.name.value,
//       type: generator ? "generator" : null
//     });

//     if (generator && this.name && this.name.value === "yield") {
//       error("E024", this.name, "yield");
//     }

//     if (this.name && (f["(name)"] === "arguments" || f["(name)"] === "eval") &&
//       f["(isStrict)"]) {
//       error("E008", this.name);
//     }

//     return this;
//   });

//   blockstmt("if", function(context) {
//     var t = state.tokens.next;
//     increaseComplexityCount();
//     advance("(");
//     var expr = expression(context, 0);

//     if (!expr) {
//       quit("E041", this);
//     }

//     checkCondAssignment(expr);
//     var forinifcheck = null;
//     if (state.option.forin && state.forinifcheckneeded) {
//       state.forinifcheckneeded = false; // We only need to analyze the first if inside the loop
//       forinifcheck = state.forinifchecks[state.forinifchecks.length - 1];
//       if (expr.type === "(punctuator)" && expr.value === "!") {
//         forinifcheck.type = "(negative)";
//       } else {
//         forinifcheck.type = "(positive)";
//       }
//     }

//     advance(")", t);
//     var s = block(context, true, true);
//     if (forinifcheck && forinifcheck.type === "(negative)") {
//       if (s && s[0] && s[0].type === "(identifier)" && s[0].value === "continue") {
//         forinifcheck.type = "(negative-with-continue)";
//       }
//     }

//     if (state.tokens.next.id === "else") {
//       advance("else");
//       if (state.tokens.next.id === "if" || state.tokens.next.id === "switch") {
//         statement(context);
//       } else {
//         block(context, true, true);
//       }
//     }
//     return this;
//   });

//   blockstmt("try", function(context) {
//     var b;
//     var hasParameter = false;

//     function catchParameter() {
//       advance("(");

//       if (checkPunctuators(state.tokens.next, ["[", "{"])) {
//         var tokens = destructuringPattern(context);
//         _.each(tokens, function(token) {
//           if (token.id) {
//             state.funct["(scope)"].addParam(token.id, token.token, "exception");
//           }
//         });
//       } else if (state.tokens.next.type !== "(identifier)") {
//         warning("E030", state.tokens.next, state.tokens.next.value);
//       } else {
//         state.funct["(scope)"].addParam(identifier(context), state.tokens.curr, "exception");
//       }

//       if (state.tokens.next.value === "if") {
//         if (!state.inMoz()) {
//           warning("W118", state.tokens.curr, "catch filter");
//         }
//         advance("if");
//         expression(context, 0);
//       }

//       advance(")");
//     }

//     block(context | prodParams.tryClause, true);

//     while (state.tokens.next.id === "catch") {
//       increaseComplexityCount();
//       if (b && (!state.inMoz())) {
//         warning("W118", state.tokens.next, "multiple catch blocks");
//       }
//       advance("catch");
//       if (state.tokens.next.id !== "{") {
//         state.funct["(scope)"].stack("catchparams");
//         hasParameter = true;
//         catchParameter();
//       } else if (!state.inES10()) {
//         warning("W119", state.tokens.curr, "optional catch binding", "10");
//       }
//       block(context, false);

//       if (hasParameter) {
//         state.funct["(scope)"].unstack();
//         hasParameter = false;
//       }
//       b = true;
//     }

//     if (state.tokens.next.id === "finally") {
//       advance("finally");
//       block(context, true);
//       return;
//     }

//     if (!b) {
//       error("E021", state.tokens.next, "catch", state.tokens.next.value);
//     }

//     return this;
//   });

//   blockstmt("while", function(context) {
//     var t = state.tokens.next;
//     state.funct["(breakage)"] += 1;
//     state.funct["(loopage)"] += 1;
//     increaseComplexityCount();
//     advance("(");
//     checkCondAssignment(expression(context, 0));
//     advance(")", t);
//     block(context, true, true);
//     state.funct["(breakage)"] -= 1;
//     state.funct["(loopage)"] -= 1;
//     return this;
//   }).labelled = true;

//   blockstmt("with", function(context) {
//     var t = state.tokens.next;
//     if (state.isStrict()) {
//       error("E010", state.tokens.curr);
//     } else if (!state.option.withstmt) {
//       warning("W085", state.tokens.curr);
//     }

//     advance("(");
//     expression(context, 0);
//     advance(")", t);
//     block(context, true, true);

//     return this;
//   });

//   blockstmt("switch", function(context) {
//     var t = state.tokens.next;
//     var g = false;
//     var noindent = false;
//     var seenCase = false;

//     state.funct["(breakage)"] += 1;
//     advance("(");
//     checkCondAssignment(expression(context, 0));
//     advance(")", t);
//     t = state.tokens.next;
//     advance("{");
//     state.funct["(scope)"].stack();

//     if (state.tokens.next.from === indent)
//       noindent = true;

//     if (!noindent)
//       indent += state.option.indent;

//     for (;;) {
//       switch (state.tokens.next.id) {
//       case "case":
//         switch (state.funct["(verb)"]) {
//         case "yield":
//         case "break":
//         case "case":
//         case "continue":
//         case "return":
//         case "switch":
//         case "throw":
//           break;
//         case "default":
//           if (state.option.leanswitch) {
//             warning("W145", state.tokens.next);
//           }

//           break;
//         default:
//           if (!state.tokens.curr.caseFallsThrough) {
//             warning("W086", state.tokens.curr, "case");
//           }
//         }

//         advance("case");
//         expression(context, 0);
//         seenCase = true;
//         increaseComplexityCount();
//         g = true;
//         advance(":");
//         state.funct["(verb)"] = "case";
//         break;
//       case "default":
//         switch (state.funct["(verb)"]) {
//         case "yield":
//         case "break":
//         case "continue":
//         case "return":
//         case "throw":
//           break;
//         case "case":
//           if (state.option.leanswitch) {
//             warning("W145", state.tokens.curr);
//           }

//           break;
//         default:
//           if (seenCase && !state.tokens.curr.caseFallsThrough) {
//             warning("W086", state.tokens.curr, "default");
//           }
//         }

//         advance("default");
//         g = true;
//         advance(":");
//         state.funct["(verb)"] = "default";
//         break;
//       case "}":
//         if (!noindent)
//           indent -= state.option.indent;

//         advance("}", t);
//         state.funct["(scope)"].unstack();
//         state.funct["(breakage)"] -= 1;
//         state.funct["(verb)"] = undefined;
//         return;
//       case "(end)":
//         error("E023", state.tokens.next, "}");
//         return;
//       default:
//         indent += state.option.indent;
//         if (g) {
//           switch (state.tokens.curr.id) {
//           case ",":
//             error("E040");
//             return;
//           case ":":
//             g = false;
//             statements(context);
//             break;
//           default:
//             error("E025", state.tokens.curr);
//             return;
//           }
//         } else {
//           if (state.tokens.curr.id === ":") {
//             advance(":");
//             error("E024", state.tokens.curr, ":");
//             statements(context);
//           } else {
//             error("E021", state.tokens.next, "case", state.tokens.next.value);
//             return;
//           }
//         }
//         indent -= state.option.indent;
//       }
//     }
//   }).labelled = true;

//   stmt("debugger", function() {
//     if (!state.option.debug) {
//       warning("W087", this);
//     }
//     return this;
//   }).exps = true;

//   (function() {
//     var x = stmt("do", function(context) {
//       state.funct["(breakage)"] += 1;
//       state.funct["(loopage)"] += 1;
//       increaseComplexityCount();

//       this.first = block(context, true, true);
//       advance("while");
//       var t = state.tokens.next;
//       advance("(");
//       checkCondAssignment(expression(context, 0));
//       advance(")", t);
//       state.funct["(breakage)"] -= 1;
//       state.funct["(loopage)"] -= 1;
//       return this;
//     });
//     x.labelled = true;
//     x.exps = true;
//   }());

//   blockstmt("for", function(context) {
//     var s, t = state.tokens.next;
//     var letscope = false;
//     var isAsync = false;
//     var foreachtok = null;

//     if (t.value === "each") {
//       foreachtok = t;
//       advance("each");
//       if (!state.inMoz()) {
//         warning("W118", state.tokens.curr, "for each");
//       }
//     }

//     if (state.tokens.next.identifier && state.tokens.next.value === "await") {
//       advance("await");
//       isAsync = true;

//       if (!(context & prodParams.async)) {
//         error("E024", state.tokens.curr, "await");
//       } else if (!state.inES9()) {
//         warning("W119", state.tokens.curr, "asynchronous iteration", "9");
//       }
//     }

//     increaseComplexityCount();
//     advance("(");
//     var nextop; // contains the token of the "in" or "of" operator
//     var comma; // First comma punctuator at level 0
//     var initializer; // First initializer at level 0
//     var bindingPower;
//     var targets;
//     var target;
//     var decl;
//     var afterNext = peek();

//     var headContext = context | prodParams.noin;

//     if (state.tokens.next.id === "var") {
//       advance("var");
//       decl = state.tokens.curr.fud(headContext);
//       comma = decl.hasComma ? decl : null;
//       initializer = decl.hasInitializer ? decl : null;
//     } else if (state.tokens.next.id === "const" ||
//       (state.tokens.next.id === "let" &&
//         ((afterNext.identifier && afterNext.id !== "in") ||
//          checkPunctuators(afterNext, ["{", "["])))) {
//       advance(state.tokens.next.id);
//       letscope = true;
//       state.funct["(scope)"].stack();
//       decl = state.tokens.curr.fud(headContext);
//       comma = decl.hasComma ? decl : null;
//       initializer = decl.hasInitializer ? decl : null;
//     } else if (!checkPunctuator(state.tokens.next, ";")) {
//       targets = [];

//       while (state.tokens.next.value !== "in" &&
//         state.tokens.next.value !== "of" &&
//         !checkPunctuator(state.tokens.next, ";")) {

//         if (checkPunctuators(state.tokens.next, ["{", "["])) {
//           destructuringPattern(headContext, { assignment: true })
//             .forEach(function(elem) {
//               this.push(elem.token);
//             }, targets);
//           if (checkPunctuator(state.tokens.next, "=")) {
//             advance("=");
//             initializer = state.tokens.curr;
//             expression(headContext, 10);
//           }
//         } else {
//           target = expression(headContext, 10);

//           if (target) {
//             if (target.type === "(identifier)") {
//               targets.push(target);
//             } else if (checkPunctuator(target, "=")) {
//               initializer = target;
//               targets.push(target);
//             }
//           }
//         }

//         if (checkPunctuator(state.tokens.next, ",")) {
//           advance(",");

//           if (!comma) {
//             comma = state.tokens.curr;
//           }
//         }
//       }
//       if (!initializer && !comma) {
//         targets.forEach(function(token) {
//           if (!state.funct["(scope)"].has(token.value)) {
//             warning("W088", token, token.value);
//           }
//         });
//       }
//     }

//     nextop = state.tokens.next;

//     if (isAsync && nextop.value !== "of") {
//       error("E066", nextop);
//     }
//     if (_.includes(["in", "of"], nextop.value)) {
//       if (nextop.value === "of") {
//         bindingPower = 20;

//         if (!state.inES6()) {
//           warning("W104", nextop, "for of", "6");
//         }
//       } else {
//         bindingPower = 0;
//       }
//       if (comma) {
//         error("W133", comma, nextop.value, "more than one ForBinding");
//       }
//       if (initializer) {
//         error("W133", initializer, nextop.value, "initializer is forbidden");
//       }
//       if (target && !comma && !initializer) {
//         checkLeftSideAssign(context, target, nextop);
//       }

//       advance(nextop.value);
//       expression(context, bindingPower);
//       advance(")", t);

//       if (nextop.value === "in" && state.option.forin) {
//         state.forinifcheckneeded = true;

//         if (state.forinifchecks === undefined) {
//           state.forinifchecks = [];
//         }
//         state.forinifchecks.push({
//           type: "(none)"
//         });
//       }

//       state.funct["(breakage)"] += 1;
//       state.funct["(loopage)"] += 1;

//       s = block(context, true, true);

//       if (nextop.value === "in" && state.option.forin) {
//         if (state.forinifchecks && state.forinifchecks.length > 0) {
//           var check = state.forinifchecks.pop();

//           if (// No if statement or not the first statement in loop body
//               s && s.length > 0 && (typeof s[0] !== "object" || s[0].value !== "if") ||
//               check.type === "(positive)" && s.length > 1 ||
//               check.type === "(negative)") {
//             warning("W089", this);
//           }
//         }
//         state.forinifcheckneeded = false;
//       }

//       state.funct["(breakage)"] -= 1;
//       state.funct["(loopage)"] -= 1;

//     } else {
//       if (foreachtok) {
//         error("E045", foreachtok);
//       }

//       advance(";");
//       if (decl && decl.first && decl.first[0]) {
//         if (decl.value === "const"  && !decl.hasInitializer) {
//           warning("E012", decl, decl.first[0].value);
//         }

//         decl.first.forEach(function(token) {
//           state.funct["(scope)"].initialize(token.value);
//         });
//       }
//       state.funct["(loopage)"] += 1;
//       if (state.tokens.next.id !== ";") {
//         checkCondAssignment(expression(context, 0));
//       }

//       advance(";");
//       if (state.tokens.next.id === ";") {
//         error("E021", state.tokens.next, ")", ";");
//       }
//       if (state.tokens.next.id !== ")") {
//         for (;;) {
//           expression(context, 0);
//           if (state.tokens.next.id !== ",") {
//             break;
//           }
//           advance(",");
//           checkComma();
//         }
//       }
//       advance(")", t);
//       state.funct["(breakage)"] += 1;
//       block(context, true, true);
//       state.funct["(breakage)"] -= 1;
//       state.funct["(loopage)"] -= 1;
//     }
//     if (letscope) {
//       state.funct["(scope)"].unstack();
//     }
//     return this;
//   }).labelled = true;


//   stmt("break", function() {
//     var v = state.tokens.next.value;

//     if (state.tokens.next.identifier &&
//         sameLine(state.tokens.curr, state.tokens.next)) {
//       if (!state.funct["(scope)"].funct.hasLabel(v)) {
//         warning("W090", state.tokens.next, v);
//       }
//       this.first = state.tokens.next;
//       advance();
//     } else {
//       if (state.funct["(breakage)"] === 0)
//         warning("W052", state.tokens.next, this.value);
//     }

//     reachable(this);

//     return this;
//   }).exps = true;


//   stmt("continue", function() {
//     var v = state.tokens.next.value;

//     if (state.funct["(breakage)"] === 0 || !state.funct["(loopage)"]) {
//       warning("W052", state.tokens.next, this.value);
//     }

//     if (state.tokens.next.identifier) {
//       if (sameLine(state.tokens.curr, state.tokens.next)) {
//         if (!state.funct["(scope)"].funct.hasLabel(v)) {
//           warning("W090", state.tokens.next, v);
//         }
//         this.first = state.tokens.next;
//         advance();
//       }
//     }

//     reachable(this);

//     return this;
//   }).exps = true;


//   stmt("return", function(context) {
//     if (sameLine(this, state.tokens.next)) {
//       if (state.tokens.next.id !== ";" && !state.tokens.next.reach) {
//         this.first = expression(context, 0);

//         if (this.first &&
//             this.first.type === "(punctuator)" && this.first.value === "=" &&
//             !this.first.paren && !state.option.boss) {
//           warning("W093", this.first);
//         }

//         if (state.option.noreturnawait && context & prodParams.async &&
//             !(context & prodParams.tryClause) &&
//             this.first.identifier && this.first.value === "await") {
//           warning("W146", this.first);
//         }
//       }
//     } else {
//       if (state.tokens.next.type === "(punctuator)" &&
//         ["[", "{", "+", "-"].indexOf(state.tokens.next.value) > -1) {
//         nolinebreak(this); // always warn (Line breaking error)
//       }
//     }

//     reachable(this);

//     return this;
//   }).exps = true;

//   prefix("await", function(context) {
//     if (context & prodParams.async) {
//       if (!state.funct["(params)"]) {
//         error("E024", this, "await");
//       }

//       expression(context, 10);
//       return this;
//     } else {
//       this.exps = false;
//       return state.syntax["(identifier)"].nud.apply(this, arguments);
//     }
//   }).exps = true;

//   (function(asyncSymbol) {
//     asyncSymbol.meta = { es5: true, isFutureReservedWord: true, strictOnly: true };
//     asyncSymbol.isFunc = function() {
//       var next = state.tokens.next;
//       var afterParens;

//       if (this.line !== next.line) {
//         return false;
//       }

//       if (next.id === "function") {
//         return true;
//       }

//       if (next.id === "(") {
//         afterParens = peekThroughParens(0);

//         return afterParens.id === "=>";
//       }

//       if (next.identifier) {
//         return peek().id === "=>";
//       }

//       return false;
//     };
//     asyncSymbol.useFud = asyncSymbol.isFunc;
//     asyncSymbol.fud = function(context) {
//       if (!state.inES8()) {
//         warning("W119", this, "async functions", "8");
//       }
//       context |= prodParams.preAsync;
//       context |= prodParams.initial;
//       this.func = expression(context, 0);
//       this.block = this.func.block;
//       this.exps = this.func.exps;
//       return this;
//     };
//     asyncSymbol.exps = true;
//     delete asyncSymbol.reserved;
//   }(prefix("async", function(context, rbp) {
//     if (this.isFunc(context)) {
//       if (!state.inES8()) {
//         warning("W119", this, "async functions", "8");
//       }

//       context |= prodParams.preAsync;
//       this.func = expression(context, rbp);
//       this.identifier = false;
//       return this;
//     }

//     this.exps = false;
//     return state.syntax["(identifier)"].nud.apply(this, arguments);
//   })));

//   (function(yieldSymbol) {
//     yieldSymbol.rbp = yieldSymbol.lbp = 25;
//     yieldSymbol.exps = true;
//   })(prefix("yield", function(context) {
//     if (state.inMoz()) {
//       return mozYield.call(this, context);
//     }

//     if (!(context & prodParams.yield)) {
//       this.exps = false;
//       return state.syntax["(identifier)"].nud.apply(this, arguments);
//     }

//     var prev = state.tokens.prev;
//     if (!state.funct["(params)"]) {
//       error("E024", this, "yield");
//     }

//     if (!this.beginsStmt && prev.lbp > 30 && !checkPunctuators(prev, ["("])) {
//       error("E061", this);
//     }

//     if (!state.inES6()) {
//       warning("W104", state.tokens.curr, "yield", "6");
//     }
//     state.funct["(yielded)"] = true;

//     if (state.tokens.next.value === "*") {
//       advance("*");
//     }
//     if (state.tokens.curr.value === "*" || sameLine(state.tokens.curr, state.tokens.next)) {
//       if (state.tokens.next.nud) {

//         nobreaknonadjacent(state.tokens.curr, state.tokens.next);
//         this.first = expression(context, 10);

//         if (this.first.type === "(punctuator)" && this.first.value === "=" &&
//             !this.first.paren && !state.option.boss) {
//           warning("W093", this.first);
//         }
//       } else if (state.tokens.next.led) {
//         if (state.tokens.next.id !== ",") {
//           error("W017", state.tokens.next);
//         }
//       }
//     }

//     return this;
//   }));
//   var mozYield = function(context) {
//     var prev = state.tokens.prev;
//     if (state.inES6(true) && !(context & prodParams.yield)) {
//       error("E046", state.tokens.curr, "yield");
//     }
//     state.funct["(yielded)"] = true;
//     var delegatingYield = false;

//     if (state.tokens.next.value === "*") {
//       delegatingYield = true;
//       advance("*");
//     }

//     if (sameLine(this, state.tokens.next)) {
//       if (delegatingYield ||
//           (state.tokens.next.id !== ";" && !state.option.asi &&
//            !state.tokens.next.reach && state.tokens.next.nud)) {

//         nobreaknonadjacent(state.tokens.curr, state.tokens.next);
//         this.first = expression(context, 10);

//         if (this.first.type === "(punctuator)" && this.first.value === "=" &&
//             !this.first.paren && !state.option.boss) {
//           warning("W093", this.first);
//         }
//       }
//       if (state.tokens.next.id !== ")" &&
//           (prev.lbp > 30 || (!prev.assign && !isEndOfExpr()))) {
//         error("E050", this);
//       }
//     } else if (!state.option.asi) {
//       nolinebreak(this); // always warn (Line breaking error)
//     }
//     return this;
//   };

//   stmt("throw", function(context) {
//     nolinebreak(this);
//     this.first = expression(context, 20);

//     reachable(this);

//     return this;
//   }).exps = true;

//   prefix("import", function(context) {
//     var mp = metaProperty(context, "meta", function() {
//       if (!state.inES11(true)) {
//         warning("W119", state.tokens.prev, "import.meta", "11");
//       }
//       if (!state.option.module) {
//         error("E070", state.tokens.prev);
//       }
//     });

//     if (mp) {
//       return mp;
//     }

//     if (!checkPunctuator(state.tokens.next, "(")) {
//       return state.syntax["(identifier)"].nud.call(this, context);
//     }

//     if (!state.inES11()) {
//       warning("W119", state.tokens.curr, "dynamic import", "11");
//     }

//     advance("(");
//     expression(context, 10);
//     advance(")");
//     return this;
//   });

//   var importSymbol = stmt("import", function(context) {
//     if (!state.funct["(scope)"].block.isGlobal()) {
//       error("E053", state.tokens.curr, "Import");
//     }

//     if (!state.inES6()) {
//       warning("W119", state.tokens.curr, "import", "6");
//     }

//     if (state.tokens.next.type === "(string)") {
//       advance("(string)");
//       return this;
//     }

//     if (state.tokens.next.identifier) {
//       this.name = identifier(context);
//       state.funct["(scope)"].addbinding(this.name, {
//         type: "import",
//         initialized: true,
//         token: state.tokens.curr });

//       if (state.tokens.next.value === ",") {
//         advance(",");
//       } else {
//         advance("from");
//         advance("(string)");
//         return this;
//       }
//     }

//     if (state.tokens.next.id === "*") {
//       advance("*");
//       advance("as");
//       if (state.tokens.next.identifier) {
//         this.name = identifier(context);
//         state.funct["(scope)"].addbinding(this.name, {
//           type: "import",
//           initialized: true,
//           token: state.tokens.curr });
//       }
//     } else {
//       advance("{");
//       for (;;) {
//         if (state.tokens.next.value === "}") {
//           advance("}");
//           break;
//         }
//         var importName;
//         if (peek().value === "as") {
//           identifier(context, true);
//           advance("as");
//           importName = identifier(context);
//         } else {
//           importName = identifier(context);
//         }
//         state.funct["(scope)"].addbinding(importName, {
//           type: "import",
//           initialized: true,
//           token: state.tokens.curr });

//         if (state.tokens.next.value === ",") {
//           advance(",");
//         } else if (state.tokens.next.value === "}") {
//           advance("}");
//           break;
//         } else {
//           error("E024", state.tokens.next, state.tokens.next.value);
//           break;
//         }
//       }
//     }
//     advance("from");
//     advance("(string)");

//     return this;
//   });
//   importSymbol.exps = true;
//   importSymbol.reserved = true;
//   importSymbol.meta = { isFutureReservedWord: true, es5: true };
//   importSymbol.useFud = function() {
//     return !(checkPunctuators(state.tokens.next, [".", "("]));
//   };
//   importSymbol.rbp = 161;

//   stmt("export", function(context) {
//     var ok = true;
//     var token;
//     var moduleSpecifier;
//     context = context | prodParams.export;

//     if (!state.inES6()) {
//       warning("W119", state.tokens.curr, "export", "6");
//       ok = false;
//     }

//     if (!state.funct["(scope)"].block.isGlobal()) {
//       error("E053", state.tokens.curr, "Export");
//       ok = false;
//     }

//     if (state.tokens.next.value === "*") {
//       advance("*");

//       if (state.tokens.next.value === "as") {
//         if (!state.inES11()) {
//           warning("W119", state.tokens.curr, "export * as ns from", "11");
//         }
//         advance("as");
//         identifier(context, true);
//         state.funct["(scope)"].setExported(null, state.tokens.curr);
//       }

//       advance("from");
//       advance("(string)");
//       return this;
//     }

//     if (state.tokens.next.type === "default") {
//       state.nameStack.set(state.tokens.next);

//       advance("default");
//       var def = state.tokens.curr;
//       var exportType = state.tokens.next.id;
//       if (exportType === "function") {
//         this.block = true;
//         advance("function");
//         token = state.syntax["function"].fud(context);
//         state.funct["(scope)"].setExported(token.name, def);
//       } else if (exportType === "async" && peek().id === "function") {
//         this.block = true;
//         advance("async");
//         advance("function");
//         token = state.syntax["function"].fud(context | prodParams.preAsync);
//         state.funct["(scope)"].setExported(token.name, def);
//       } else if (exportType === "class") {
//         this.block = true;
//         advance("class");
//         token = state.syntax["class"].fud(context);
//         state.funct["(scope)"].setExported(token.name, def);
//       } else {
//         expression(context, 10);
//         state.funct["(scope)"].setExported(null, def);
//       }
//       return this;
//     }
//     if (state.tokens.next.value === "{") {
//       advance("{");
//       var exportedTokens = [];
//       while (!checkPunctuator(state.tokens.next, "}")) {
//         if (!state.tokens.next.identifier) {
//           error("E030", state.tokens.next, state.tokens.next.value);
//         }
//         advance();

//         if (state.tokens.next.value === "as") {
//           advance("as");
//           if (!state.tokens.next.identifier) {
//             error("E030", state.tokens.next, state.tokens.next.value);
//           }
//           exportedTokens.push({
//             local: state.tokens.prev,
//             export: state.tokens.next
//           });
//           advance();
//         } else {
//           exportedTokens.push({
//             local: state.tokens.curr,
//             export: state.tokens.curr
//           });
//         }

//         if (!checkPunctuator(state.tokens.next, "}")) {
//           advance(",");
//         }
//       }
//       advance("}");
//       if (state.tokens.next.value === "from") {
//         advance("from");
//         moduleSpecifier = state.tokens.next;
//         advance("(string)");
//       } else if (ok) {
//         exportedTokens.forEach(function(x) {
//           state.funct["(scope)"].setExported(x.local, x.export);
//         });
//       }

//       if (exportedTokens.length === 0) {
//         if (moduleSpecifier) {
//           warning("W142", this, "export", moduleSpecifier.value);
//         } else {
//           warning("W141", this, "export");
//         }
//       }

//       return this;
//     } else if (state.tokens.next.id === "var") {
//       advance("var");
//       token = state.tokens.curr.fud(context);
//       token.first.forEach(function(binding) {
//         state.funct["(scope)"].setExported(binding, binding);
//       });
//     } else if (state.tokens.next.id === "let") {
//       advance("let");
//       token = state.tokens.curr.fud(context);
//       token.first.forEach(function(binding) {
//         state.funct["(scope)"].setExported(binding, binding);
//       });
//     } else if (state.tokens.next.id === "const") {
//       advance("const");
//       token = state.tokens.curr.fud(context);
//       token.first.forEach(function(binding) {
//         state.funct["(scope)"].setExported(binding, binding);
//       });
//     } else if (state.tokens.next.id === "function") {
//       this.block = true;
//       advance("function");
//       token = state.syntax["function"].fud(context);
//       state.funct["(scope)"].setExported(token.name, token.name);
//     } else if (state.tokens.next.id === "async" && peek().id === "function") {
//       this.block = true;
//       advance("async");
//       advance("function");
//       token = state.syntax["function"].fud(context | prodParams.preAsync);
//       state.funct["(scope)"].setExported(token.name, token.name);
//     } else if (state.tokens.next.id === "class") {
//       this.block = true;
//       advance("class");
//       token = state.syntax["class"].fud(context);
//       state.funct["(scope)"].setExported(token.name, token.name);
//     } else {
//       error("E024", state.tokens.next, state.tokens.next.value);
//     }

//     return this;
//   }).exps = true;
//   function supportsSuper(type, funct) {
//     if (type === "call" && funct["(async)"]) {
//       return false;
//     }

//     if (type === "property" && funct["(method)"]) {
//       return true;
//     }

//     if (type === "call" && funct["(statement)"] &&
//       funct["(statement)"].id === "class") {
//       return true;
//     }

//     if (funct["(arrow)"]) {
//       return supportsSuper(type, funct["(context)"]);
//     }

//     return false;
//   }

//   var superNud = function() {
//     var next = state.tokens.next;

//     if (checkPunctuators(next, ["[", "."])) {
//       if (!supportsSuper("property", state.funct)) {
//         error("E063", this);
//       }
//     } else if (checkPunctuator(next, "(")) {
//       if (!supportsSuper("call", state.funct)) {
//         error("E064", this);
//       }
//     } else {
//       error("E024", next, next.value || next.id);
//     }

//     return this;
//   };

//   FutureReservedWord("abstract");
//   FutureReservedWord("boolean");
//   FutureReservedWord("byte");
//   FutureReservedWord("char");
//   FutureReservedWord("double");
//   FutureReservedWord("enum", { es5: true });
//   FutureReservedWord("export", { es5: true });
//   FutureReservedWord("extends", { es5: true });
//   FutureReservedWord("final");
//   FutureReservedWord("float");
//   FutureReservedWord("goto");
//   FutureReservedWord("implements", { es5: true, strictOnly: true });
//   FutureReservedWord("int");
//   FutureReservedWord("interface", { es5: true, strictOnly: true });
//   FutureReservedWord("long");
//   FutureReservedWord("native");
//   FutureReservedWord("package", { es5: true, strictOnly: true });
//   FutureReservedWord("private", { es5: true, strictOnly: true });
//   FutureReservedWord("protected", { es5: true, strictOnly: true });
//   FutureReservedWord("public", { es5: true, strictOnly: true });
//   FutureReservedWord("short");
//   FutureReservedWord("static", { es5: true, strictOnly: true });
//   FutureReservedWord("synchronized");
//   FutureReservedWord("transient");
//   FutureReservedWord("volatile");

//   var lookupBlockType = function() {
//     var pn, pn1, prev;
//     var i = -1;
//     var bracketStack = 0;
//     var ret = {};
//     if (checkPunctuators(state.tokens.curr, ["[", "{"])) {
//       bracketStack += 1;
//     }
//     do {
//       prev = i === -1 ? state.tokens.curr : pn;
//       pn = i === -1 ? state.tokens.next : peek(i);
//       pn1 = peek(i + 1);
//       i = i + 1;
//       if (checkPunctuators(pn, ["[", "{"])) {
//         bracketStack += 1;
//       } else if (checkPunctuators(pn, ["]", "}"])) {
//         bracketStack -= 1;
//       }
//       if (bracketStack === 1 && pn.identifier && pn.value === "for" &&
//           !checkPunctuator(prev, ".")) {
//         ret.isCompArray = true;
//         ret.notJson = true;
//         break;
//       }
//       if (bracketStack === 0 && checkPunctuators(pn, ["}", "]"])) {
//         if (pn1.value === "=") {
//           ret.isDestAssign = true;
//           ret.notJson = true;
//           break;
//         } else if (pn1.value === ".") {
//           ret.notJson = true;
//           break;
//         }
//       }
//       if (checkPunctuator(pn, ";")) {
//         ret.notJson = true;
//       }
//     } while (bracketStack > 0 && pn.id !== "(end)");
//     return ret;
//   };
//   function saveProperty(props, name, tkn, isClass, isStatic, isComputed) {
//     if (tkn.identifier) {
//       name = tkn.value;
//     }
//     var key = name;
//     if (isClass && isStatic) {
//       key = "static " + name;
//     }

//     if (props[key] && name !== "__proto__" && !isComputed) {
//       var msg = ["key", "class method", "static class method"];
//       msg = msg[(isClass || false) + (isStatic || false)];
//       warning("W075", state.tokens.next, msg, name);
//     } else {
//       props[key] = Object.create(null);
//     }

//     props[key].basic = true;
//     props[key].basictkn = tkn;
//   }
//   function saveAccessor(accessorType, props, name, tkn, isClass, isStatic) {
//     var flagName = accessorType === "get" ? "getterToken" : "setterToken";
//     var key = name;
//     state.tokens.curr.accessorType = accessorType;
//     state.nameStack.set(tkn);
//     if (isClass && isStatic) {
//       key = "static " + name;
//     }

//     if (props[key]) {
//       if ((props[key].basic || props[key][flagName]) && name !== "__proto__") {
//         var msg = "";
//         if (isClass) {
//           if (isStatic) {
//             msg += "static ";
//           }
//           msg += accessorType + "ter method";
//         } else {
//           msg = "key";
//         }
//         warning("W075", state.tokens.next, msg, name);
//       }
//     } else {
//       props[key] = Object.create(null);
//     }

//     props[key][flagName] = tkn;
//     if (isStatic) {
//       props[key].static = true;
//     }
//   }
//   function computedPropertyName(context) {
//     advance("[");
//     state.tokens.curr.delim = true;
//     state.tokens.curr.lbp = 0;

//     if (!state.inES6()) {
//       warning("W119", state.tokens.curr, "computed property names", "6");
//     }
//     var value = expression(context & ~prodParams.noin, 10);
//     advance("]");
//     return value;
//   }
//   function checkPunctuators(token, values) {
//     if (token.type === "(punctuator)") {
//       return _.includes(values, token.value);
//     }
//     return false;
//   }
//   function checkPunctuator(token, value) {
//     return token.type === "(punctuator)" && token.value === value;
//   }
//   function destructuringAssignOrJsonValue(context) {

//     var block = lookupBlockType();
//     if (block.notJson) {
//       if (!state.inES6() && block.isDestAssign) {
//         warning("W104", state.tokens.curr, "destructuring assignment", "6");
//       }
//       statements(context);
//     } else {
//       state.option.laxbreak = true;
//       state.jsonMode = true;
//       jsonValue();
//     }
//   }
//   var arrayComprehension = function() {
//     var CompArray = function() {
//       this.mode = "use";
//       this.variables = [];
//     };
//     var _carrays = [];
//     var _current;
//     function declare(v) {
//       var l = _current.variables.filter(function(elt) {
//         if (elt.value === v) {
//           elt.undef = false;
//           return v;
//         }
//       }).length;
//       return l !== 0;
//     }
//     function use(v) {
//       var l = _current.variables.filter(function(elt) {
//         if (elt.value === v && !elt.undef) {
//           if (elt.unused === true) {
//             elt.unused = false;
//           }
//           return v;
//         }
//       }).length;
//       return (l === 0);
//     }
//     return { stack: function() {
//           _current = new CompArray();
//           _carrays.push(_current);
//         },
//         unstack: function() {
//           _current.variables.filter(function(v) {
//             if (v.unused)
//               warning("W098", v.token, v.token.raw_text || v.value);
//             if (v.undef)
//               state.funct["(scope)"].block.use(v.value, v.token);
//           });
//           _carrays.splice(-1, 1);
//           _current = _carrays[_carrays.length - 1];
//         },
//         setState: function(s) {
//           if (_.includes(["use", "define", "generate", "filter"], s))
//             _current.mode = s;
//         },
//         check: function(v) {
//           if (!_current) {
//             return;
//           }
//           if (_current && _current.mode === "use") {
//             if (use(v)) {
//               _current.variables.push({
//                 token: state.tokens.curr,
//                 value: v,
//                 undef: true,
//                 unused: false
//               });
//             }
//             return true;
//           } else if (_current && _current.mode === "define") {
//             if (!declare(v)) {
//               _current.variables.push({
//                 token: state.tokens.curr,
//                 value: v,
//                 undef: false,
//                 unused: true
//               });
//             }
//             return true;
//           } else if (_current && _current.mode === "generate") {
//             state.funct["(scope)"].block.use(v, state.tokens.curr);
//             return true;
//           } else if (_current && _current.mode === "filter") {
//             if (use(v)) {
//               state.funct["(scope)"].block.use(v, state.tokens.curr);
//             }
//             return true;
//           }
//           return false;
//         }
//         };
//   };
//   function jsonValue() {
//     function jsonObject() {
//       var o = {}, t = state.tokens.next;
//       advance("{");
//       if (state.tokens.next.id !== "}") {
//         for (;;) {
//           if (state.tokens.next.id === "(end)") {
//             error("E026", state.tokens.next, t.line);
//           } else if (state.tokens.next.id === "}") {
//             warning("W094", state.tokens.curr);
//             break;
//           } else if (state.tokens.next.id === ",") {
//             error("E028", state.tokens.next);
//           } else if (state.tokens.next.id !== "(string)") {
//             warning("W095", state.tokens.next, state.tokens.next.value);
//           }
//           if (o[state.tokens.next.value] === true) {
//             warning("W075", state.tokens.next, "key", state.tokens.next.value);
//           } else if ((state.tokens.next.value === "__proto__" &&
//             !state.option.proto) || (state.tokens.next.value === "__iterator__" &&
//             !state.option.iterator)) {
//             warning("W096", state.tokens.next, state.tokens.next.value);
//           } else {
//             o[state.tokens.next.value] = true;
//           }
//           advance();
//           advance(":");
//           jsonValue();
//           if (state.tokens.next.id !== ",") {
//             break;
//           }
//           advance(",");
//         }
//       }
//       advance("}");
//     }

//     function jsonArray() {
//       var t = state.tokens.next;
//       advance("[");
//       if (state.tokens.next.id !== "]") {
//         for (;;) {
//           if (state.tokens.next.id === "(end)") {
//             error("E027", state.tokens.next, t.line);
//           } else if (state.tokens.next.id === "]") {
//             warning("W094", state.tokens.curr);
//             break;
//           } else if (state.tokens.next.id === ",") {
//             error("E028", state.tokens.next);
//           }
//           jsonValue();
//           if (state.tokens.next.id !== ",") {
//             break;
//           }
//           advance(",");
//         }
//       }
//       advance("]");
//     }

//     switch (state.tokens.next.id) {
//     case "{":
//       jsonObject();
//       break;
//     case "[":
//       jsonArray();
//       break;
//     case "true":
//     case "false":
//     case "null":
//     case "(number)":
//     case "(string)":
//       advance();
//       break;
//     case "-":
//       advance("-");
//       advance("(number)");
//       break;
//     default:
//       error("E003", state.tokens.next);
//     }
//   }
//   function lintEvalCode(internals, options, globals) {
//     var priorErrorCount, idx, jdx, internal;

//     for (idx = 0; idx < internals.length; idx += 1) {
//       internal = internals[idx];
//       options.scope = internal.elem;
//       priorErrorCount = JSHINT.errors.length;

//       itself(internal.code, options, globals);

//       for (jdx = priorErrorCount; jdx < JSHINT.errors.length; jdx += 1) {
//         JSHINT.errors[jdx].line += internal.token.line - 1;
//       }
//     }
//   }

//   var escapeRegex = function(str) {
//     return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
//   };
//   var itself = function(s, o, g) {
//     var x, reIgnoreStr, reIgnore;
//     var optionKeys, newOptionObj, newIgnoredObj;

//     o = _.clone(o);
//     state.reset();
//     newOptionObj = state.option;
//     newIgnoredObj = state.ignored;

//     if (o && o.scope) {
//       JSHINT.scope = o.scope;
//     } else {
//       JSHINT.errors = [];
//       JSHINT.internals = [];
//       JSHINT.blacklist = {};
//       JSHINT.scope = "(main)";
//     }

//     predefined = Object.create(null);
//     combine(predefined, vars.ecmaIdentifiers[3]);
//     combine(predefined, vars.reservedVars);

//     declared = Object.create(null);
//     var exported = Object.create(null); // Variables that live outside the current file

//     function each(obj, cb) {
//       if (!obj)
//         return;

//       if (!Array.isArray(obj) && typeof obj === "object")
//         obj = Object.keys(obj);

//       obj.forEach(cb);
//     }

//     if (o) {

//       each([o.predef, o.globals], function(dict) {
//         each(dict, function(item) {
//           var slice, prop;

//           if (item[0] === "-") {
//             slice = item.slice(1);
//             JSHINT.blacklist[slice] = slice;
//             delete predefined[slice];
//           } else {
//             prop = Object.getOwnPropertyDescriptor(dict, item);
//             predefined[item] = prop ? prop.value : false;
//           }
//         });
//       });

//       each(o.exported || null, function(item) {
//         exported[item] = true;
//       });

//       delete o.predef;
//       delete o.exported;

//       optionKeys = Object.keys(o);
//       for (x = 0; x < optionKeys.length; x++) {
//         if (/^-W\d{3}$/g.test(optionKeys[x])) {
//           newIgnoredObj[optionKeys[x].slice(1)] = true;
//         } else {
//           var optionKey = optionKeys[x];
//           newOptionObj[optionKey] = o[optionKey];
//         }
//       }
//     }

//     state.option = newOptionObj;
//     state.ignored = newIgnoredObj;

//     state.option.indent = state.option.indent || 4;
//     state.option.maxerr = state.option.maxerr || 50;

//     indent = 1;

//     var scopeManagerInst = scopeManager(state, predefined, exported, declared);
//     scopeManagerInst.on("warning", function(ev) {
//       warning.apply(null, [ ev.code, ev.token].concat(ev.data));
//     });

//     scopeManagerInst.on("error", function(ev) {
//       error.apply(null, [ ev.code, ev.token ].concat(ev.data));
//     });

//     state.funct = functor("(global)", null, {
//       "(global)"    : true,
//       "(scope)"     : scopeManagerInst,
//       "(comparray)" : arrayComprehension(),
//       "(metrics)"   : createMetrics(state.tokens.next)
//     });

//     functions = [state.funct];
//     member = {};
//     membersOnly = null;
//     inblock = false;
//     lookahead = [];

//     if (!isString(s) && !Array.isArray(s)) {
//       errorAt("E004", 0);
//       return false;
//     }

//     api = {
//       get isJSON() {
//         return state.jsonMode;
//       },

//       getOption: function(name) {
//         return state.option[name] || null;
//       },

//       getCache: function(name) {
//         return state.cache[name];
//       },

//       setCache: function(name, value) {
//         state.cache[name] = value;
//       },

//       warn: function(code, data) {
//         warningAt.apply(null, [ code, data.line, data.char ].concat(data.data));
//       },

//       on: function(names, listener) {
//         names.split(" ").forEach(function(name) {
//           emitter.on(name, listener);
//         }.bind(this));
//       }
//     };

//     emitter.removeAllListeners();
//     (extraModules || []).forEach(function(func) {
//       func(api);
//     });

//     state.tokens.prev = state.tokens.curr = state.tokens.next = state.syntax["(begin)"];
//     if (o && o.ignoreDelimiters) {

//       if (!Array.isArray(o.ignoreDelimiters)) {
//         o.ignoreDelimiters = [o.ignoreDelimiters];
//       }

//       o.ignoreDelimiters.forEach(function(delimiterPair) {
//         if (!delimiterPair.start || !delimiterPair.end)
//             return;

//         reIgnoreStr = escapeRegex(delimiterPair.start) +
//                       "[\\s\\S]*?" +
//                       escapeRegex(delimiterPair.end);

//         reIgnore = new RegExp(reIgnoreStr, "ig");

//         s = s.replace(reIgnore, function(match) {
//           return match.replace(/./g, " ");
//         });
//       });
//     }

//     lex = new Lexer(s);

//     lex.on("warning", function(ev) {
//       warningAt.apply(null, [ ev.code, ev.line, ev.character].concat(ev.data));
//     });

//     lex.on("error", function(ev) {
//       errorAt.apply(null, [ ev.code, ev.line, ev.character ].concat(ev.data));
//     });

//     lex.on("fatal", function(ev) {
//       quit("E041", ev);
//     });

//     lex.on("Identifier", function(ev) {
//       emitter.emit("Identifier", ev);
//     });

//     lex.on("String", function(ev) {
//       emitter.emit("String", ev);
//     });

//     lex.on("Number", function(ev) {
//       emitter.emit("Number", ev);
//     });
//     var name;
//     for (name in o) {
//       if (_.has(o, name)) {
//         checkOption(name, true, state.tokens.curr);
//       }
//     }
//     if (o) {
//       for (name in o.unstable) {
//         if (_.has(o.unstable, name)) {
//           checkOption(name, false, state.tokens.curr);
//         }
//       }
//     }

//     try {
//       applyOptions();
//       combine(predefined, g || {});
//       checkComma.first = true;

//       advance();
//       switch (state.tokens.next.id) {
//       case "{":
//       case "[":
//         destructuringAssignOrJsonValue(0);
//         break;
//       default:
//         directives();

//         if (state.directive["use strict"]) {
//           if (!state.allowsGlobalUsd()) {
//             warning("W097", state.directive["use strict"]);
//           }
//         }

//         statements(0);
//       }

//       if (state.tokens.next.id !== "(end)") {
//         quit("E041", state.tokens.curr);
//       }

//       state.funct["(scope)"].unstack();

//     } catch (err) {
//       if (err && err.name === "JSHintError") {
//         var nt = state.tokens.next || {};
//         JSHINT.errors.push({
//           scope     : "(main)",
//           raw       : err.raw,
//           code      : err.code,
//           reason    : err.reason,
//           line      : err.line || nt.line,
//           character : err.character || nt.from
//         });
//       } else {
//         throw err;
//       }
//     }
//     if (JSHINT.scope === "(main)") {
//       lintEvalCode(JSHINT.internals, o || {}, g);
//     }

//     return JSHINT.errors.length === 0;
//   };
//   itself.addModule = function(func) {
//     extraModules.push(func);
//   };

//   itself.addModule(style.register);
//   itself.data = function() {
//     var data = {
//       functions: [],
//       options: state.option
//     };

//     var fu, f, i, n, globals;

//     if (itself.errors.length) {
//       data.errors = itself.errors;
//     }

//     if (state.jsonMode) {
//       data.json = true;
//     }

//     var impliedGlobals = state.funct["(scope)"].getImpliedGlobals();
//     if (impliedGlobals.length > 0) {
//       data.implieds = impliedGlobals;
//     }

//     globals = state.funct["(scope)"].getUsedOrDefinedGlobals();
//     if (globals.length > 0) {
//       data.globals = globals;
//     }

//     for (i = 1; i < functions.length; i += 1) {
//       f = functions[i];
//       fu = {};

//       fu.name = f["(name)"];
//       fu.param = f["(params)"];
//       fu.line = f["(line)"];
//       fu.character = f["(character)"];
//       fu.last = f["(last)"];
//       fu.lastcharacter = f["(lastcharacter)"];

//       fu.metrics = {
//         complexity: f["(metrics)"].ComplexityCount,
//         parameters: f["(metrics)"].arity,
//         statements: f["(metrics)"].statementCount
//       };

//       data.functions.push(fu);
//     }

//     var unuseds = state.funct["(scope)"].getUnuseds();
//     if (unuseds.length > 0) {
//       data.unused = unuseds;
//     }

//     for (n in member) {
//       if (typeof member[n] === "number") {
//         data.member = member;
//         break;
//       }
//     }

//     return data;
//   };

//   itself.jshint = itself;

//   return itself;
// }());

var javaScriptWorker = (function() {
    // var oop = require("../lib/oop");
    // var Mirror = require("../worker/mirror").Mirror;
    // var lint = require("./javascript/jshint").JSHINT;

    function startRegex(arr) {
        return RegExp("^(" + arr.join("|") + ")");
    }

    var disabledWarningsRe = startRegex([
        "Bad for in variable '(.+)'.",
        'Missing "use strict"'
    ]);
    var errorsRe = startRegex([
        "Unexpected",
        "Expected ",
        "Confusing (plus|minus)",
        "\\{a\\} unterminated regular expression",
        "Unclosed ",
        "Unmatched ",
        "Unbegun comment",
        "Bad invocation",
        "Missing space after",
        "Missing operator at"
    ]);
    var infoRe = startRegex([
        "Expected an assignment",
        "Bad escapement of EOL",
        "Unexpected comma",
        "Unexpected space",
        "Missing radix parameter.",
        "A leading decimal point can",
        "\\['{a}'\\] is better written in dot notation.",
        "'{a}' used out of scope"
    ]);

    var JsWorker = function() {};
    // oop.inherits(JavaScriptWorker, Mirror);

    !function() {
        this.emit = function(event, data) {
            console.log('emit')
            try {
                if (data) {
                    window.postMessage({ event, data });
                }
            }
            catch(ex) {
                console.error(ex.stack);
            }
        };

        this.options = {
            esversion: 11,
            moz: true,
            devel: true,
            browser: true,
            node: true,
            laxcomma: true,
            laxbreak: true,
            lastsemic: true,
            onevar: false,
            passfail: false,
            maxerr: 100,
            expr: true,
            multistr: true,
            globalstrict: true
        }

        this.onUpdate = function(value) {
            console.log('onUpdate', value)
            return this.emit("annotate", []);
            value = value.replace(/^#!.*\n/, "\n");
            if (!value)
                return this.emit("annotate", []);

            var errors = [];
            lint(value, this.options, this.options.globals);
            var results = lint.errors;

            var errorAdded = false;
            for (var i = 0; i < results.length; i++) {
                var error = results[i];
                if (!error)
                    continue;
                var raw = error.raw;
                var type = "warning";

                if (raw == "Missing semicolon.") {
                    var str = error.evidence.substr(error.character);
                    str = str.charAt(str.search(/\S/));
                    if (str && /[\w\d{(['"]/.test(str)) {
                        error.reason = 'Missing ";" before statement';
                        type = "error";
                    } else {
                        type = "info";
                    }
                }
                else if (disabledWarningsRe.test(raw)) {
                    continue;
                }
                else if (infoRe.test(raw)) {
                    type = "info";
                }
                else if (errorsRe.test(raw)) {
                    errorAdded  = true;
                    type = "error";
                }
                else if (raw == "'{a}' is not defined.") {
                    type = "warning";
                }
                else if (raw == "'{a}' is defined but never used.") {
                    type = "info";
                }

                errors.push({
                    row: error.line-1,
                    column: error.character-1,
                    text: error.reason,
                    type: type,
                    raw: raw
                });

                if (errorAdded) {
                }
            }

            this.emit("annotate", errors);
        };
    }.call(JsWorker.prototype);

    return new JsWorker();
})();

window.onmessage = function(e) {
    const { editorValue, event } = e.data || {};

    if (event === 'change' || event === 'initial') {
        console.log('Worker received:', editorValue); // Debugging log
        javaScriptWorker.onUpdate(editorValue);
    }
    // console.log('Worker received:', editorValue); // Debugging log
    // const isValid = validateSyntax(editorValue);
    // self.postMessage({ isValid: false });
};