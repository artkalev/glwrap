'use strict';

/**
 * Ignore part of code which can fail your
 *
 * @module jsdoc-ignore-code
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 * @version 1.0.0
 */

var config = env.conf.ignoreCode || {};

exports.handlers = {
	beforeParse: function(e) {
		// ignore dynamic import()
		if (config.dynamicImports !== false) {
			// change import() to _import()
			e.source = e.source.replace(/(^|\n)(\s|\t)*(import)(\s|\t)*\(/, function(str) {
				return str.replace(/import/, '_import');
			});
		}
	}
};
