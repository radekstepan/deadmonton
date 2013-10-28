build:
	bower install
	grunt

watch:
	watch --color -n 1 make build

serve:
	python -m SimpleHTTPServer 1892

fetch:
	npm install
	./node_modules/.bin/coffee fetch.coffee

.PHONY: build fetch