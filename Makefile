# `dist` has no recipe, but it depends on all of the files we expect to find in
# /dist, causing it to run their corresponding recipes below.
dist: $(patsubst root/%.txt,dist/%.html,$(shell ./find_sources.sh)) \
      $(patsubst root/%,dist/%,$(shell ./find_assets.sh))

dist/%.html: root/%.txt
	mkdir -p $(dir $@)
	tw < $< > $@

dist/%: root/%
	mkdir -p dist
	cp $< $@

serve:
	python -m http.server -d dist 8080

watch:
	find root | entr make dist

publish:
	git worktree add public gh-pages
	cp -rf dist/* public
	cd public && \
		git add --all && \
		git commit -m "Publish to GitHub pages" && \
		git push origin gh-pages
	git worktree remove public

.PHONY: clean
clean:
	rm -rf dist
