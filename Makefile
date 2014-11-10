VERSION = 0.2.1
BROWSERIFY = node ./node_modules/browserify/bin/cmd.js
MOCHA = ./node_modules/.bin/mocha
UGLIFYJS = ./node_modules/.bin/uglifyjs
BANNER = "/*! angular-resilient - v$(VERSION) - MIT License - https://github.com/h2non/angular-resilient */"
MOCHA_PHANTOM = ./node_modules/.bin/mocha-phantomjs

define release
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	node -e "\
		var j = require('./package.json');\
		j.version = \"$$NEXT_VERSION\";\
		var s = JSON.stringify(j, null, 2);\
		require('fs').writeFileSync('./package.json', s);" && \
	node -e "\
		var j = require('./bower.json');\
		j.version = \"$$NEXT_VERSION\";\
		var s = JSON.stringify(j, null, 2);\
		require('fs').writeFileSync('./bower.json', s);" && \
	git commit -am "release $$NEXT_VERSION" && \
	git tag "$$NEXT_VERSION" -m "Version $$NEXT_VERSION"
endef

default: all
all: test
browser: uglify
test: browser mocha

uglify:
	$(UGLIFYJS) angular-resilient.js --mangle --preamble $(BANNER) --source-map angular-resilient.min.js.map --source-map-url http://cdn.rawgit.com/h2non/angular-resilient/$(VERSION)/angular-resilient.min.js.map> angular-resilient.min.js

mocha:
	$(MOCHA_PHANTOM) --reporter spec --ui bdd test/runner.html

loc:
	wc -l angular-resilient.js

gzip:
	gzip -c resilient.min.js | wc -c

release:
	@$(call release, patch)

release-minor:
	@$(call release, minor)

publish: browser release
	git push --tags origin HEAD:master
	npm publish
