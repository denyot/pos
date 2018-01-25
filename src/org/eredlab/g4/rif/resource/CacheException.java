package org.eredlab.g4.rif.resource;

public class CacheException extends ResourceException {
	private static final long serialVersionUID = 1L;

	public CacheException() {
		super("cache异常!");
	}

	public CacheException(String message, Throwable cause) {
		super(message, cause);
	}

	public CacheException(String message) {
		super(message);
	}

	public CacheException(Throwable cause) {
		super(cause);
	}
}