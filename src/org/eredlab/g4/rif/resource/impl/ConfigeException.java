package org.eredlab.g4.rif.resource.impl;

import org.eredlab.g4.rif.resource.ResourceException;

public class ConfigeException extends ResourceException {
	private static final long serialVersionUID = 1L;

	public ConfigeException() {
	}

	public ConfigeException(String message, Throwable cause) {
		super(message, cause);
	}

	public ConfigeException(String message) {
		super(message);
	}

	public ConfigeException(Throwable cause) {
		super(cause);
	}
}