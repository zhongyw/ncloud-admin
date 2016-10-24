MOCHA_ARGS=--compilers js:babel-core/register  --require co-mocha app/tests/setup.js -R spec
SRC_FILES=$(wildcard app/src/*.js) webpack.config.js
TEST_FILES=$(wildcard app/tests/*.js)
NODE_BIN=$(PWD)/node_modules/.bin

all: dist/app.bundle.js dist/tests.bundle.js

dist/app.bundle.js: $(SRC_FILES)
	$(NODE_BIN)/webpack

dist/tests.bundle.js: $(SRC_FILES) $(TEST_FILES)
	$(NODE_BIN)/webpack

test:
	$(NODE_BIN)/mocha $(MOCHA_ARGS) $(TEST_FILES)

test-watch:
	$(NODE_BIN)/mocha $(MOCHA_ARGS) --watch $(TEST_FILES)

serve:
	$(NODE_BIN)/webpack-dev-server --hot --quiet

clean:
	rm -rf dist
