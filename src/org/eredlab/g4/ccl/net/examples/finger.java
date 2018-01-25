package org.eredlab.g4.ccl.net.examples;

import java.io.IOException;
import java.io.PrintStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import org.eredlab.g4.ccl.net.FingerClient;

public final class finger {
	public static final void main(String[] args) {
		boolean longOutput = false;
		int arg = 0;

		InetAddress address = null;

		while ((arg < args.length) && (args[arg].startsWith("-"))) {
			if (args[arg].equals("-l")) {
				longOutput = true;
			} else {
				System.err
						.println("usage: finger [-l] [[[handle][@<server>]] ...]");
				System.exit(1);
			}
			arg++;
		}

		FingerClient finger = new FingerClient();

		finger.setDefaultTimeout(60000);

		if (arg >= args.length) {
			try {
				address = InetAddress.getLocalHost();
			} catch (UnknownHostException e) {
				System.err.println("Error unknown host: " + e.getMessage());
				System.exit(1);
			}

			try {
				finger.connect(address);
				System.out.print(finger.query(longOutput));
				finger.disconnect();
			} catch (IOException e) {
				System.err.println("Error I/O exception: " + e.getMessage());
				System.exit(1);
			}

			return;
		}

		while (arg < args.length) {
			int index = args[arg].lastIndexOf("@");
			String handle;
			if (index == -1) {
				handle = args[arg];
				try {
					address = InetAddress.getLocalHost();
				} catch (UnknownHostException e) {
					System.err.println("Error unknown host: " + e.getMessage());
					System.exit(1);
				}
			} else {
				handle = args[arg].substring(0, index);
				String host = args[arg].substring(index + 1);
				try {
					address = InetAddress.getByName(host);
				} catch (UnknownHostException e) {
					System.err.println("Error unknown host: " + e.getMessage());
					System.exit(1);
				}
			}

			System.out.println("[" + address.getHostName() + "]");
			try {
				finger.connect(address);
				System.out.print(finger.query(longOutput, handle));
				finger.disconnect();
			} catch (IOException e) {
				System.err.println("Error I/O exception: " + e.getMessage());
				System.exit(1);
			}

			arg++;
			if (arg != args.length)
				System.out.print("\n");
		}
	}
}