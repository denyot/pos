package org.eredlab.g4.ccl.net.examples.nntp;

import java.io.IOException;
import java.io.PrintStream;
import org.eredlab.g4.ccl.net.nntp.NNTPClient;
import org.eredlab.g4.ccl.net.nntp.NewsgroupInfo;

public final class newsgroups {
	public static final void main(String[] args) {
		if (args.length < 1) {
			System.err.println("Usage: newsgroups newsserver");
			System.exit(1);
		}

		NNTPClient client = new NNTPClient();
		try {
			client.connect(args[0]);

			NewsgroupInfo[] list = client.listNewsgroups();

			if (list != null) {
				for (int i = 0; i < list.length; i++)
					System.out.println(list[i].getNewsgroup());
			} else {
				System.err.println("LIST command failed.");
				System.err.println("Server reply: " + client.getReplyString());
			}
		} catch (IOException e) {
			e.printStackTrace();
			try {
				if (client.isConnected())
					client.disconnect();
			} catch (IOException e1) {
				System.err.println("Error disconnecting from server.");
				e1.printStackTrace();
				System.exit(1);
			}
		} finally {
			try {
				if (client.isConnected())
					client.disconnect();
			} catch (IOException e) {
				System.err.println("Error disconnecting from server.");
				e.printStackTrace();
				System.exit(1);
			}
		}
	}
}