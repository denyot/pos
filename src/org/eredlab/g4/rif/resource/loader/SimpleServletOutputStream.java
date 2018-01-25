package org.eredlab.g4.rif.resource.loader;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.servlet.ServletOutputStream;

public class SimpleServletOutputStream extends ServletOutputStream {
	ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

	public String toString() {
		return this.outputStream.toString();
	}

	public byte[] getDatas() {
		return this.outputStream.toByteArray();
	}

	public void reset() {
		this.outputStream.reset();
	}

	public void write(byte[] b, int off, int len) throws IOException {
		this.outputStream.write(b, off, len);
	}

	public void write(byte[] b) throws IOException {
		this.outputStream.write(b);
	}

	public void write(int b) throws IOException {
		this.outputStream.write(b);
	}
}