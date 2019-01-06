'use strict';

var fs = require('fs');
var path = require('path');

exports.defineTags = function (dictionary) {
	dictionary.defineTag('sourcecode', {
		onTagged: function (doclet, tag) {
			var code = doclet.meta.code;
			var filepath = path.join(doclet.meta.path, doclet.meta.filename);
			var content = fs.readFileSync(filepath).toString();
			var lineno = doclet.meta.lineno;

			var range = doclet.meta.range;
			if (range === undefined && tag && tag.value) {
				var val = content.split('\n').slice(doclet.meta.lineno).join('\n');
				var pos = /\*(\s)?\//.exec(val);
				if (pos !== null) {
					var start = content.split('\n').slice(0, doclet.meta.lineno).join('\n').length;
					var end = val.slice(0, pos.index).length;
					range = [start, start + end];
				}
			}
			if (!Array.isArray(range)) {
				return;
			}

			var codeValue = content.slice(range[0], range[1]);
			var lastLineBefore = content.slice(0, range[0]).split('\n').pop();
			var contentAfter = content.slice(range[1]).split('\n');
			var addContentAfter = [contentAfter.shift()];

			var linesAfter = 1;
			tag.value = tag.value || '0';

			var clearSelf = /\|/.test(tag.value);
			if (clearSelf) {
				lineno += codeValue.split('\n').length;
				lastLineBefore = codeValue = '';
				tag.value = tag.value.replace(/\|/, '');
				addContentAfter = [];
			}

			var addMore = parseInt(tag.value || 1);
			if (tag.value && (addMore > 1 || clearSelf)) {
				linesAfter = addMore;
				addContentAfter = addContentAfter.concat(contentAfter.splice(0, linesAfter));
			}

			doclet.sourceCode = {
				lineno: lineno,
				type: code.type,
				value: lastLineBefore + codeValue + addContentAfter.join('\n')
			};
		}
	});
};
