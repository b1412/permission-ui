default:
	@awk -F\: '/^[a-z_]+:/ && !/default/ {printf "- %-20s %s\n", $$1, $$2}' Makefile
help:
	@echo "make dist: build dist"
dist:
	yarn install && yarn dll && yarn build
