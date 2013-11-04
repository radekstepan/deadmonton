install:
	npm install
	bower install

build:
	grunt

minify:
	grunt minify

watch:
	watch --color -n 1 make build

serve:
	cd public; python -m SimpleHTTPServer 1892

fetch:
	npm install
	./node_modules/.bin/coffee fetch.coffee

publish:
	git checkout gh-pages
	git show master:data/crime.json.lzma > crime.json.lzma
	git add .
	@status=$$(git status --porcelain); \
	if ! test "x$${status}" = x; then \
		git commit -m 'publish latest data to gh-pages'; \
		git push -u origin gh-pages; \
	fi
	git checkout master

.PHONY: build fetch