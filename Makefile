BUILD := .build
BIN := zsnapper node_modules
SMF := zsnapper.xml
ETC := zsnapper.json.sample

smartos-zsnapper.tar.gz: $(BIN) $(SMF) $(ETC) $(BUILD)/opt/local/bin $(BUILD)/opt/local/etc $(BUILD)/opt/custom/smf
	cp -r $(BIN) $(BUILD)/opt/local/bin
	cp -r $(ETC) $(BUILD)/opt/local/etc
	cp -r $(SMF) $(BUILD)/opt/custom/smf
	tar -C $(BUILD) -zcf $@ opt

node_modules:
	npm install

$(BUILD)/opt/local/bin:
	mkdir -p $@
$(BUILD)/opt/local/etc:
	mkdir -p $@
$(BUILD)/opt/custom/smf:
	mkdir -p $@
