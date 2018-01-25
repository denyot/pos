package org.eredlab.g4.ccl.net.examples;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import org.eredlab.g4.ccl.net.io.Util;

public final class IOUtil {
	public static final void readWrite(InputStream remoteInput, final OutputStream remoteOutput,
			InputStream localInput, final OutputStream localOutput) {
		Thread reader = new Thread() {
			public void run() {
//				try {
//					int ch;
//					do {
//						remoteOutput.write(ch);
//						remoteOutput.flush();
//
//						if (interrupted())
//							break;
//					} while ((ch = IOUtil.this.read()) != -1);
//				} catch (IOException localIOException) {
//				}
			}
		};
		Thread writer = new Thread() {
			public void run() {
//				try {
//					Util.copyStream(IOUtil.this, localOutput);
//				} catch (IOException e) {
//					e.printStackTrace();
//					System.exit(1);
//				}
			}
		};
		writer.setPriority(Thread.currentThread().getPriority() + 1);

		writer.start();
		reader.setDaemon(true);
		reader.start();
		try {
			writer.join();
			reader.interrupt();
		} catch (InterruptedException localInterruptedException) {
		}
	}
}