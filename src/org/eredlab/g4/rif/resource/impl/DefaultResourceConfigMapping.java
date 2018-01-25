package org.eredlab.g4.rif.resource.impl;

import org.eredlab.g4.rif.resource.ResourceException;
import org.eredlab.g4.rif.resource.support.ResourceConfig;
import org.eredlab.g4.rif.resource.support.ResourceConfigMapping;
import org.eredlab.g4.rif.resource.util.AntPathMatcher;
import org.eredlab.g4.rif.resource.util.StringUtils;

public class DefaultResourceConfigMapping implements ResourceConfigMapping {
	private UriMapping[] uriMappings = null;

	private AntPathMatcher pathMatcher = new AntPathMatcher();

	public UriMapping[] getUriMappings() {
		return this.uriMappings;
	}

	public void setUriMappings(UriMapping[] uriMappings) {
		this.uriMappings = uriMappings;
	}

	public ResourceConfig mapping(String pUri) throws ResourceException {
		if (this.uriMappings == null) {
			return null;
		}
		for (int i = 0; i < this.uriMappings.length; i++) {
			UriMapping uriMapping = this.uriMappings[i];
			if (isMatch(uriMapping, pUri)) {
				String loaderName = uriMapping.getLoader();
				String handlerNames = uriMapping.getHandlers();
				String charset = uriMapping.getCharset();
				String mimeType = uriMapping.getMimeType();
				String oldPrefix = uriMapping.getOldPrefix();
				String newPrefix = uriMapping.getNewPrefix();
				boolean cache = uriMapping.isCache();
				String[] hanlderNameArray = StringUtils.tokenizeToStringArray(
						handlerNames, ";,");
				ResourceConfig result = new ResourceConfig(loaderName,
						hanlderNameArray, charset, mimeType, oldPrefix,
						newPrefix, cache);
				return result;
			}
		}

		return null;
	}

	protected boolean isMatch(UriMapping pUriMapping, String pUri) {
		String includes = pUriMapping.getIncludes();
		String excludes = pUriMapping.getExcludes();
		if (includes == null) {
			return false;
		}
		if (pUri == null) {
			return false;
		}
		String[] includeArray = StringUtils.tokenizeToStringArray(includes,
				";,");
		boolean match = false;
		for (int i = 0; i < includeArray.length; i++) {
			String include = includeArray[i];
			if (this.pathMatcher.match(include, pUri)) {
				match = true;
				break;
			}
		}
		if (match) {
			String[] excludeArray = StringUtils.tokenizeToStringArray(excludes,
					";,");
			for (int i = 0; i < excludeArray.length; i++) {
				String exclude = excludeArray[i];
				if (this.pathMatcher.match(exclude, pUri)) {
					match = false;
					break;
				}
			}
		}

		return match;
	}
}