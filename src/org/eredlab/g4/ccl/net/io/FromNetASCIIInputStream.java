package org.eredlab.g4.ccl.net.io;

import java.io.IOException;
import java.io.InputStream;
import java.io.PushbackInputStream;

public final class FromNetASCIIInputStream extends PushbackInputStream {

	static final String _lineSeparator = System.getProperty("line.separator");
	
	static final boolean _noConversionRequired = _lineSeparator.equals("\r\n");

	static final byte[] _lineSeparatorBytes = _lineSeparator.getBytes();

	private int __length = 0;

	public static final boolean isConversionRequired() {
		return !_noConversionRequired;
	}

	public FromNetASCIIInputStream(InputStream input) {
		super(input, _lineSeparatorBytes.length + 1);
	}

	private int __read() throws IOException {
		int ch = super.read();

		if (ch == 13) {
			ch = super.read();
			if (ch == 10) {
				unread(_lineSeparatorBytes);
				ch = super.read();

				this.__length -= 1;
			} else {
				if (ch != -1)
					unread(ch);
				return 13;
			}
		}

		return ch;
	}

	public int read() throws IOException {
		if (_noConversionRequired) {
			return super.read();
		}
		return __read();
	}

	public int read(byte[] buffer) throws IOException {
		return read(buffer, 0, buffer.length);
	}

	public int read(byte[] buffer, int offset, int length) throws IOException {
		if (length < 1) {
			return 0;
		}
		int ch = available();

		this.__length = (length > ch ? ch : length);

		if (this.__length < 1) {
			this.__length = 1;
		}
		if (_noConversionRequired) {
			return super.read(buffer, offset, this.__length);
		}
		if ((ch = __read()) == -1) {
			return -1;
		}
		int off = offset;
		do {
			buffer[(offset++)] = ((byte) ch);
		} while ((--this.__length > 0) && ((ch = __read()) != -1));

		return offset - off;
	}

	public int available() throws IOException {
		return this.buf.length - this.pos + this.in.available();
	}
}