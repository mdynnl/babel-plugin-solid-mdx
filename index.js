/**
 * @typedef {import('./index.js').Predicate} Predicate
 * @typedef {import('@babel/core').types} types
 * @typedef {import('@babel/core').types.MemberExpression} MemberExpression
 * @typedef {import('@babel/core').types.JSXMemberExpression} JSXMemberExpression
 * @typedef {import('@babel/core').types.JSXIdentifier} JSXIdentifier
 */

/**
 * @type {import('./index.js').default}
 */
export default function babelPluginSolidMdx(ctx) {
  const t = /** @type {types} */ (ctx.types);

  return {
    visitor: {
      Program(path, state) {
        const extensions = /** @type {Predicate[]} */ (
          'extensions' in state.opts ? state.opts.extensions : /[.]mdx?$/
        );

        if (!state.filename || !predicate(state.filename, extensions)) {
          return;
        }

        path.traverse({
          JSXOpeningElement(path) {
            const { node } = path;
            if (t.isJSXMemberExpression(node.name)) {
              const component = t.jsxAttribute(
                t.jsxIdentifier('component'),
                t.jsxExpressionContainer(toMemberExpression(node.name)),
              );

              const attributes = [component, ...node.attributes];

              const dynamic = t.jsxOpeningElement(
                t.jsxIdentifier('Dynamic'),
                attributes,
              );

              path.replaceWith(dynamic);
            }
          },
        });
      },
    },
  };

  /**
   * @param {JSXMemberExpression} expr
   * @returns {MemberExpression}
   */
  function toMemberExpression(expr) {
    return t.memberExpression(
      expr.object.type === 'JSXIdentifier'
        ? toIdentifier(expr.object)
        : toMemberExpression(expr.object),
      toIdentifier(expr.property),
    );
  }

  /**
   * @param {JSXIdentifier} expr
   */
  function toIdentifier(expr) {
    return t.identifier(expr.name);
  }
}

/**
 * @param {string} filename
 * @param {Predicate} pred
 */
function predicate(filename, pred) {
  if (typeof pred === 'function') {
    return pred(filename);
  } else if (Array.isArray(pred)) {
    return pred.some((pred) => predicate(filename, pred));
  } else if (pred instanceof RegExp) {
    return pred.test(filename);
  } else {
    return filename.endsWith(String(pred));
  }
}
