package org.eredlab.g4.rif.resource.loader;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

public class BufferResponseWrapper extends HttpServletResponseWrapper {
	private SimpleServletOutputStream wrappedOut;
	private PrintWriter wrappedWriter;

	public BufferResponseWrapper(HttpServletResponse response) {
		super(response);
		this.wrappedOut = new SimpleServletOutputStream();
	}

	public ServletOutputStream getOutputStream() throws IOException {
		return this.wrappedOut;
	}

	public PrintWriter getWriter() throws IOException {
		if (this.wrappedWriter == null) {
			String encoding = getCharacterEncoding();
			if (encoding != null)
				this.wrappedWriter = new PrintWriter(new OutputStreamWriter(
						getOutputStream(), encoding));
			else {
				this.wrappedWriter = new PrintWriter(new OutputStreamWriter(
						getOutputStream()));
			}
		}

		return this.wrappedWriter;
	}

	public byte[] getDatas() {
		return this.wrappedOut.getDatas();
	}

	public void flushBuffer() throws IOException {
		flush();
	}

	public void flush() throws IOException {
		if (this.wrappedWriter != null) {
			this.wrappedWriter.flush();
		}
		this.wrappedOut.flush();
	}
}