import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import {uglify} from 'rollup-plugin-uglify';
import banner from 'rollup-plugin-banner';
import json from '@rollup/plugin-json'
import pkg from './package.json';
import merge from 'webpack-merge';

let year = new Date().getFullYear(),
    version = pkg.version;

let bannerText = `@axmine/helper v${version}
(c) 2019-${year} yocss https://github.com/yocss/helper.git
License: MIT
Released on: Aug 21, 2020`;

let config = {
  input: 'src/index.ts',
  output: {
    name:'helper',
    file: 'dist/helper.js',
    format: 'umd',
    // sourceMap: true,
    // compact: true,
  },
  plugins: [
    resolve(),
    commonjs({
      include: /node_modules/
    }),
    json(),
    typescript(),
    banner(bannerText),
    // uglify()
  ]
};

let [min, es, cjs] = [merge({}, config), merge({}, config), merge({}, config)];

min.output.file = 'dist/helper.min.js';
min.output.compact = true
// min.plugins.unshift(uglify());

es.output.file = 'dist/helper.es.js';
es.output.format = 'es';

cjs.output.file = 'dist/helper.cjs.js';
cjs.output.format = 'cjs';

export default [config, min, es, cjs];