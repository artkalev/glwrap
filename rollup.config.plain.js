import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default{
    input: 'src/index.js',
    output: {
        file: 'build/glwrap.js',
        format: 'iife',
        name:'glwrap'
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};