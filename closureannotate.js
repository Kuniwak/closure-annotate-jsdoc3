/**
 * @overview This is a plugin to adapt Google Closure Library style annotation.
 * @module plugins/closureAnnotate
 * @author orga chem <orga.chem.job@gmail.com>
 */

var Token = Packages.org.mozilla.javascript.Token;


/**
 * Current parser.
 * @type {jsdoc.src.Parser}
 */
var currentParser = null;


/**
 * Provided name map. {@code providedMap['foo']} is {@code true} if
 * {@code goog.provide('foo')} exists.
 * @type {Object}
 */
var providedMap = {};


/**
 * Provided global method name map. {@code providedMap['exampleGlobalMethod']}
 * is {@code true} if {@code goog.provide('exampleGlobalMethod')} exists.
 * @type {Object}
 */
var globalMethodMap = {};

exports.handlers = {
  newDoclet: function(e) {
    var doclet = e.doclet, longname;
    // The doclet is a provided global method, if the doclet was provided by
    // goog.provide and its kind is function.
    if (providedMap[longname = doclet.longname]) {
      if (doclet.kind === "function") {
        globalMethodMap[longname] = true;
      }
    }
  },
  fileComplete: function() {
    // @suppress {accessControl}
    // Removes false namespaces are provided by goog.provide.
    var i = 0;
    var newResultBuffer = [];
    currentParser._resultBuffer.forEach(function(result, index) {
      if (!globalMethodMap[result.longname] || result.kind !== 'namespace') {
        newResultBuffer[i++] = result;
      }
    });
    currentParser._resultBuffer = newResultBuffer;
    currentParser = null;
  }
};

exports.nodeVisitor = {
  visitNode: function(node, e, parser, currentSourceName) {
    if (!currentParser) currentParser = parser;
    var lineno = node.getLineno();
    if (isGoogProvideCall(node)) {
      var nameNode = node.arguments.get(0);
      var longname = String((nameNode.type == Token.STRING) ?
          nameNode.value : nameNode.toSource());
      // This test can not discern a global method from a namespace.
      // So false namespaces should be removed when a file complete.
      if (!longname.match(/\.[A-Z][^.]*$/)) {
        providedMap[longname] = true;
        e.comment = '@namespace ' + longname + '\n';
        e.lineno = node.getLineno();
        e.filename = currentSourceName;
        e.event = "jsdocCommentFound";   
      }
    }
  }
};


/**
 * Whether a node is goog.provide call.
 * @param {Packages.org.mozilla.javascript.Node} node The node to test.
 * @return {boolean} Whether a node is goog.provide call.
 */
function isGoogProvideCall(node) {
  var target, left, right;
  if (node.getType() === Token.CALL && (target = node.getTarget()) &&
      (left = target.left) && (right = target.right) &&
      String(left.toSource()) === 'goog' &&
      String(right.toSource()) === 'provide') {
    return true;
  }
  return false;
}
