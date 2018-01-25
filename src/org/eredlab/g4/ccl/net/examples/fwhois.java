package org.eredlab.g4.ccl.net.examples;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

import org.eredlab.g4.ccl.net.WhoisClient;

public final class fwhois {
	public static final void main(String[] args) {
		InetAddress address = null;

		if (args.length != 1) {
			System.err.println("usage: fwhois handle[@<server>]");
			System.exit(1);
		}

		int index = args[0].lastIndexOf("@");

		WhoisClient whois = new WhoisClient();

		whois.setDefaultTimeout(60000);
		String host;
		String handle;
		if (index == -1) {
			handle = args[0];
			host = "whois.internic.net";
		} else {
			handle = args[0].substring(0, index);
			host = args[0].substring(index + 1);
		}

		try {
			address = InetAddress.getByName(host);
		} catch (UnknownHostException e) {
			System.err.println("Error unknown host: " + e.getMessage());
			System.exit(1);
		}

		System.out.println("[" + address.getHostName() + "]");
		try {
			whois.connect(address);
			System.out.print(whois.query(handle));
			whois.disconnect();
		} catch (IOException e) {
			System.err.println("Error I/O exception: " + e.getMessage());
			System.exit(1);
		}
	}
}