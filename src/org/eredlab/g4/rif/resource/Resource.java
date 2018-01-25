package org.eredlab.g4.rif.resource;

import java.io.Serializable;

public abstract interface Resource extends Serializable {
	public abstract String getCharset();

	public abstract String getMimeType();

	public abstract String getUri();

	public abstract byte[] getData();

	public abstract byte[] getTreatedData();

	public abstract void setTreatedData(byte[] paramArrayOfByte);

	public abstract long getLastModified();

	public abstract String getResourceCode();

	public abstract boolean isGzip();

	public abstract void setGzip(boolean paramBoolean);
}