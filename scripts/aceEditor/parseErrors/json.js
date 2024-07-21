const parseValueForJSON = (function () {
	const parse = (function () {
		var at, // The index of the current character
			ch, // The current character
			escapee = {
				'"': '"',
				'\\': '\\',
				'/': '/',
				b: '\b',
				f: '\f',
				n: '\n',
				r: '\r',
				t: '\t',
			},
			text,
			error = function (m) {
				throw {
					name: 'SyntaxError',
					message: m,
					at: at,
					text: text,
				};
			},
			next = function (c) {
				if (c && c !== ch) {
					error("Expected '" + c + "' instead of '" + ch + "'");
				}

				ch = text.charAt(at);
				at += 1;
				return ch;
			},
			number = function () {
				var number,
					string = '';

				if (ch === '-') {
					string = '-';
					next('-');
				}
				while (ch >= '0' && ch <= '9') {
					string += ch;
					next();
				}
				if (ch === '.') {
					string += '.';
					while (next() && ch >= '0' && ch <= '9') {
						string += ch;
					}
				}
				if (ch === 'e' || ch === 'E') {
					string += ch;
					next();
					if (ch === '-' || ch === '+') {
						string += ch;
						next();
					}
					while (ch >= '0' && ch <= '9') {
						string += ch;
						next();
					}
				}
				number = +string;
				if (isNaN(number)) {
					error('Bad number');
				} else {
					return number;
				}
			},
			string = function () {
				var hex,
					i,
					string = '',
					uffff;

				if (ch === '"') {
					while (next()) {
						if (ch === '"') {
							next();
							return string;
						} else if (ch === '\\') {
							next();
							if (ch === 'u') {
								uffff = 0;
								for (i = 0; i < 4; i += 1) {
									hex = parseInt(next(), 16);
									if (!isFinite(hex)) {
										break;
									}
									uffff = uffff * 16 + hex;
								}
								string += String.fromCharCode(uffff);
							} else if (typeof escapee[ch] === 'string') {
								string += escapee[ch];
							} else {
								break;
							}
						} else if (ch == '\n' || ch == '\r') {
							break;
						} else {
							string += ch;
						}
					}
				}
				error('Bad string');
			},
			white = function () {
				while (ch && ch <= ' ') {
					next();
				}
			},
			word = function () {
				switch (ch) {
					case 't':
						next('t');
						next('r');
						next('u');
						next('e');
						return true;
					case 'f':
						next('f');
						next('a');
						next('l');
						next('s');
						next('e');
						return false;
					case 'n':
						next('n');
						next('u');
						next('l');
						next('l');
						return null;
				}
				error("Unexpected '" + ch + "'");
			},
			value, // Place holder for the value function.
			array = function () {
				var array = [];

				if (ch === '[') {
					next('[');
					white();
					if (ch === ']') {
						next(']');
						return array; // empty array
					}
					while (ch) {
						array.push(value());
						white();
						if (ch === ']') {
							next(']');
							return array;
						}
						next(',');
						white();
					}
				}
				error('Bad array');
			},
			object = function () {
				var key,
					object = {};

				if (ch === '{') {
					next('{');
					white();
					if (ch === '}') {
						next('}');
						return object; // empty object
					}
					while (ch) {
						key = string();
						white();
						next(':');
						if (Object.hasOwnProperty.call(object, key)) {
							error('Duplicate key "' + key + '"');
						}
						object[key] = value();
						white();
						if (ch === '}') {
							next('}');
							return object;
						}
						next(',');
						white();
					}
				}
				error('Bad object');
			};

		value = function () {
			white();
			switch (ch) {
				case '{':
					return object();
				case '[':
					return array();
				case '"':
					return string();
				case '-':
					return number();
				default:
					return ch >= '0' && ch <= '9' ? number() : word();
			}
		};

		return function (source) {
			var result;

			text = source;
			at = 0;
			ch = ' ';
			result = value();
			white();
			if (ch) {
				error('Syntax error');
			}

			return result;
		};
	})();

	const newLineCharacter = '\n';
    
	const indexToPosition = function (index, lines) {
		const newlineLength = newLineCharacter.length;
		for (const i = 0, l = lines.length; i < l; i++) {
			index -= lines[i].length + newlineLength;
			if (index < 0) return { row: i, column: index + lines[i].length + newlineLength };
		}
		return { row: l - 1, column: index + lines[l - 1].length + newlineLength };
	};

	function checkError(value) {
        const lines = value.split('\n');

		const errors = [];
		try {
			if (value) parse(value);
		} catch (e) {
			const pos = indexToPosition(e.at - 1, lines);
			errors.push({
				row: pos.row,
				column: pos.column,
				text: e.message,
				type: 'error',
			});
		}

		return errors;
	}
	return checkError;
})();