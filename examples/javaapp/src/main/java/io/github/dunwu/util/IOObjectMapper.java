package io.github.dunwu.util;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public class IOObjectMapper extends ObjectMapper {

	public IOObjectMapper() {
		this.setSerializationInclusion(Include.NON_EMPTY);
		this.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
	}

}
