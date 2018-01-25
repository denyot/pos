package org.eredlab.g4.ccl.net.examples;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintStream;
import java.io.Reader;
import org.eredlab.g4.ccl.net.pop3.POP3Client;
import org.eredlab.g4.ccl.net.pop3.POP3MessageInfo;

public final class messages {
	public static final void printMessageInfo(BufferedReader reader, int id)
			throws IOException {
		String from = "";
		String subject = "";
		String line;
		while ((line = reader.readLine()) != null) {
			String lower = line.toLowerCase();
			if (lower.startsWith("from: "))
				from = line.substring(6).trim();
			else if (lower.startsWith("subject: ")) {
				subject = line.substring(9).trim();
			}
		}
		System.out.println(Integer.toString(id) + " From: " + from
				+ "  Subject: " + subject);
	}

	public static final void main(String[] args) {
		if (args.length < 3) {
			System.err
					.println("Usage: messages <pop3 server hostname> <username> <password>");
			System.exit(1);
		}

		String server = args[0];
		String username = args[1];
		String password = args[2];

		POP3Client pop3 = new POP3Client();

		pop3.setDefaultTimeout(60000);
		try {
			pop3.connect(server);
		} catch (IOException e) {
			System.err.println("Could not connect to server.");
			e.printStackTrace();
			System.exit(1);
		}

		try {
			if (!pop3.login(username, password)) {
				System.err
						.println("Could not login to server.  Check password.");
				pop3.disconnect();
				System.exit(1);
			}

			POP3MessageInfo[] messages = pop3.listMessages();

			if (messages == null) {
				System.err.println("Could not retrieve message list.");
				pop3.disconnect();
				System.exit(1);
			} else if (messages.length == 0) {
				System.out.println("No messages");
				pop3.logout();
				pop3.disconnect();
				System.exit(1);
			}

			for (int message = 0; message < messages.length; message++) {
				Reader reader = pop3.retrieveMessageTop(
						messages[message].number, 0);

				if (reader == null) {
					System.err.println("Could not retrieve message header.");
					pop3.disconnect();
					System.exit(1);
				}

				printMessageInfo(new BufferedReader(reader),
						messages[message].number);
			}

			pop3.logout();
			pop3.disconnect();
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(1);
		}
	}
}