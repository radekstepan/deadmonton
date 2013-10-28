build:
	bower install
	grunt

watch:
	watch --color -n 1 make build

serve:
	python -m SimpleHTTPServer 1892

.PHONY: build