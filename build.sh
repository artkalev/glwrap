reset
./node_modules/.bin/rollup -c rollup.config.plain.js
./node_modules/.bin/rollup -c rollup.config.module.js
./node_modules/.bin/jsdoc -c jsdoc.config.json
echo "build complete"