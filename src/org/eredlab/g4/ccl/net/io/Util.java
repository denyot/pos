package org.eredlab.g4.ccl.net.io;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;

public final class Util {
	public static final int DEFAULT_COPY_BUFFER_SIZE = 1024;

	public static final long copyStream(InputStream source, OutputStream dest,
			int bufferSize, long streamSize, CopyStreamListener listener,
			boolean flush) throws CopyStreamException {
		byte[] buffer = new byte[bufferSize];
		long total = 0L;
		try {
			int bytes;
			while ((bytes = source.read(buffer)) != -1) {
				// int bytes;
				if (bytes == 0) {
					bytes = source.read();
					if (bytes < 0)
						break;
					dest.write(bytes);
					if (flush)
						dest.flush();
					total += 1L;
					if (listener != null)
						listener.bytesTransferred(total, 1, streamSize);
				} else {
					dest.write(buffer, 0, bytes);
					if (flush)
						dest.flush();
					total += bytes;
					if (listener != null)
						listener.bytesTransferred(total, bytes, streamSize);
				}
			}
		} catch (IOException e) {
			throw new CopyStreamException("IOException caught while copying.",
					total, e);
		}
		return total;
	}

	public static final long copyStream(InputStream source, OutputStream dest,
			int bufferSize, long streamSize, CopyStreamListener listener)
			throws CopyStreamException {
		return copyStream(source, dest, bufferSize, streamSize, listener, true);
	}

	public static final long copyStream(InputStream source, OutputStream dest,
			int bufferSize) throws CopyStreamException {
		return copyStream(source, dest, bufferSize, -1L, null);
	}

	public static final long copyStream(InputStream source, OutputStream dest)
			throws CopyStreamException {
		return copyStream(source, dest, 1024);
	}

	public static final long copyReader(Reader source, Writer dest,
			int bufferSize, long streamSize, CopyStreamListener listener)
			throws CopyStreamException {
		char[] buffer = new char[bufferSize];
		long total = 0L;
		try {
			int chars;
			while ((chars = source.read(buffer)) != -1) {
				// int chars;
				if (chars == 0) {
					chars = source.read();
					if (chars < 0)
						break;
					dest.write(chars);
					dest.flush();
					total += 1L;
					if (listener != null)
						listener.bytesTransferred(total, chars, streamSize);
				} else {
					dest.write(buffer, 0, chars);
					dest.flush();
					total += chars;
					if (listener != null)
						listener.bytesTransferred(total, chars, streamSize);
				}
			}
		} catch (IOException e) {
			throw new CopyStreamException("IOException caught while copying.",
					total, e);
		}
		return total;
	}

	public static final long copyReader(Reader source, Writer dest,
			int bufferSize) throws CopyStreamException {
		return copyReader(source, dest, bufferSize, -1L, null);
	}

	public static final long copyReader(Reader source, Writer dest)
			throws CopyStreamException {
		return copyReader(source, dest, 1024);
	}
}