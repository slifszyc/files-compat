/**
 * Module Dependencies
 */

var relative = require('path').relative;
var Package = require('duo-package');
var filedeps = require('file-deps');
var fmt = require('util').format;
var join = require('path').join;
var main = require('duo-main');

/**
 * Export `compat`
 */

module.exports = compat;

/**
 * Add "styles" compatibility
 *
 * @param {Object} opts
 * @return {Function}
 * @api public
 */

function compat(opts) {
  opts = opts || {};

  return function *(file, entry) {
    if ('css' != entry.type) return;
    if ('css' != file.type) return;
    var path = join(file.root, 'component.json');
    var dir = join(entry.root, 'components');
    var obj = json(path);
    var deps = obj.dependencies;

    // Add imports
    for (var pkg in deps) {
      file.src = fmt('@import "%s@%s";\n%s', pkg, deps[pkg], file.src);
    }
  }
}

/**
 * Fetch the packages
 *
 * @param {Array} pkgs
 * @return {Array}
 */

function fetch(pkgs) {
  return pkgs
    .map(function(pkg) {
      return pkg.fetch();
    });
}

/**
 * Load JSON
 *
 * @param {String} path
 * @return {Object}
 */

function json(path) {
  try {
    return require(path);
  } catch (e) {
    return {};
  }
}