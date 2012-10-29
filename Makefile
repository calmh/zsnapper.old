BUILD := .build
BIN := zsnapper node_modules
SMF := zsnapper.xml
ETC := zsnapper.json.sample
TAR := smartos-zsnapper.tar.gz
UID = $(shell id -u)


$(TAR): $(BIN) $(SMF) $(ETC) $(BUILD)/opt/local/bin $(BUILD)/opt/local/etc $(BUILD)/opt/custom/smf
ifneq ($(UID), 0)
	$(error Should run as uid 0 for correct file ownership; consider fakeroot)
endif
	cp -r $(BIN) $(BUILD)/opt/local/bin
	cp -r $(ETC) $(BUILD)/opt/local/etc
	cp -r $(SMF) $(BUILD)/opt/custom/smf
	chown -R 0:0 $(BUILD)
	tar -C $(BUILD) -zcf $@ opt

node_modules:
	npm install

$(BUILD)/opt/local/bin:
	mkdir -p $@
$(BUILD)/opt/local/etc:
	mkdir -p $@
$(BUILD)/opt/custom/smf:
	mkdir -p $@

clean:
	rm -rf .build $(TAR) node_modules
.PHONY: clean
