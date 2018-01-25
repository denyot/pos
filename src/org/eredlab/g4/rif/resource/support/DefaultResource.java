package org.eredlab.g4.rif.resource.support;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import org.eredlab.g4.rif.resource.Resource;

public class DefaultResource implements Resource {
	private static final long serialVersionUID = 1L;
	private String mimeType;
	private String charset;
	private long lastModified;
	private final String uri;
	private boolean gzip = false;
	private final byte[] data;
	private byte[] treatedData;
	private String resourceCode = null;

	private static MessageDigest md = null;

	private static final char[] hexDigits = { '0', '1', '2', '3', '4', '5',
			'6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };

	static {
		try {
			md = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException("不支持MD5算法!", e);
		}
	}

	public DefaultResource(String pUri, byte[] pData) {
		this.uri = pUri;
		this.data = pData;
		this.treatedData = new byte[pData.length];
		for (int i = 0; i < pData.length; i++) {
			this.treatedData[i] = pData[i];
		}
		this.resourceCode = null;
	}

	public String getCharset() {
		return this.charset;
	}

	public void setCharset(String charset) {
		this.charset = charset;
	}

	public String getMimeType() {
		return this.mimeType;
	}

	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}

	private static String bytesToHex(byte[] bytes) {
		StringBuffer sb = new StringBuffer();

		for (int i = 0; i < 16; i++) {
			int t = bytes[i];
			if (t < 0)
				t += 256;
			sb.append(hexDigits[(t >>> 4)]);
			sb.append(hexDigits[(t % 16)]);
		}
		return sb.toString();
	}

	private String getMD5Code(byte[] pDatas) {
		if (pDatas == null) {
			return null;
		}
		byte[] messageDigest = md.digest(pDatas);
		BigInteger number = new BigInteger(1, messageDigest);

		StringBuffer sb = new StringBuffer(48);
		sb.append(number.toString(16));
		return sb.toString();
	}

	public String getResourceCode() {
		if (this.resourceCode == null) {
			this.resourceCode = getMD5Code(this.treatedData);
		}

		return this.resourceCode;
	}

	public String getUri() {
		return this.uri;
	}

	public byte[] getData() {
		return this.data;
	}

	public long getLastModified() {
		return this.lastModified;
	}

	public void setLastModified(long pLastModified) {
		this.lastModified = pLastModified;
	}

	public boolean isGzip() {
		return this.gzip;
	}

	public void setGzip(boolean gzip) {
		this.gzip = gzip;
	}

	public byte[] getTreatedData() {
		return this.treatedData;
	}

	public void setTreatedData(byte[] treatedData) {
		this.treatedData = treatedData;
		this.resourceCode = null;
	}
}