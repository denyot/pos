package org.eredlab.g4.rif.resource.impl;

import java.io.Serializable;

public class UriMapping implements Serializable {
	private static final long serialVersionUID = 1L;
	private String charset;
	private boolean cache = true;
	private String mimeType;
	private String loader = "file";
	private String handlers;
	private String includes;
	private String excludes;
	private String oldPrefix;
	private String newPrefix;

	public String getCharset() {
		return this.charset;
	}

	public void setCharset(String charset) {
		this.charset = charset;
	}

	public String getHandlers() {
		return this.handlers;
	}

	public void setHandlers(String handlers) {
		this.handlers = handlers;
	}

	public String getLoader() {
		return this.loader;
	}

	public void setLoader(String loader) {
		this.loader = loader;
	}

	public String getMimeType() {
		return this.mimeType;
	}

	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}

	/** @deprecated */
	public String getUriPattern() {
		return this.includes;
	}

	/** @deprecated */
	public void setUriPattern(String uriPattern) {
		this.includes = uriPattern;
	}

	public String getIncludes() {
		return this.includes;
	}

	public void setIncludes(String includes) {
		this.includes = includes;
	}

	public String getExcludes() {
		return this.excludes;
	}

	public void setExcludes(String excludes) {
		this.excludes = excludes;
	}

	public boolean isCache() {
		return this.cache;
	}

	public void setCache(boolean cache) {
		this.cache = cache;
	}

	public String getOldPrefix() {
		return this.oldPrefix;
	}

	public void setOldPrefix(String oldPrefix) {
		this.oldPrefix = oldPrefix;
	}

	public String getNewPrefix() {
		return this.newPrefix;
	}

	public void setNewPrefix(String newPrefix) {
		this.newPrefix = newPrefix;
	}
}