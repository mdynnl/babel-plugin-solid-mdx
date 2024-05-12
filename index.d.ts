type Predicate =
  | (string | RegExp)[]
  | RegExp
  | string
  | ((id: string) => boolean);

export interface Options {
  /**
   * @default /[.]mdx?$/
   */
  extensions?: Predicate;
}

export interface State extends babel.PluginPass {
  opts: Options;
}

export default function babelPluginSolidMdx(): import('@babel/core').PluginObj<State>;
