package org.eredlab.g4.ccl.net.ftp.parser;

import java.text.ParseException;
import org.eredlab.g4.ccl.net.ftp.FTPClientConfig;
import org.eredlab.g4.ccl.net.ftp.FTPFile;

public class OS400FTPEntryParser extends ConfigurableFTPFileEntryParserImpl {
	private static final String DEFAULT_DATE_FORMAT = "yy/MM/dd HH:mm:ss";
	private static final String REGEX = "(\\S+)\\s+(\\d+)\\s+(\\S+)\\s+(\\S+)\\s+(\\*\\S+)\\s+(\\S+/?)\\s*";

	public OS400FTPEntryParser() {
		this(null);
	}

	public OS400FTPEntryParser(FTPClientConfig config) {
		super(
				"(\\S+)\\s+(\\d+)\\s+(\\S+)\\s+(\\S+)\\s+(\\*\\S+)\\s+(\\S+/?)\\s*");
		configure(config);
	}

	public FTPFile parseFTPEntry(String entry) {
		FTPFile file = new FTPFile();
		file.setRawListing(entry);

		if (matches(entry)) {
			String usr = group(1);
			String filesize = group(2);
			String datestr = group(3) + " " + group(4);
			String typeStr = group(5);
			String name = group(6);
			try {
				file.setTimestamp(super.parseTimestamp(datestr));
			} catch (ParseException e) {
				return null;
			}
			int type;
			if (typeStr.equalsIgnoreCase("*STMF")) {
				type = 0;
			} else {
				if (typeStr.equalsIgnoreCase("*DIR")) {
					type = 1;
				} else {
					type = 3;
				}
			}
			file.setType(type);

			file.setUser(usr);
			try {
				file.setSize(Long.parseLong(filesize));
			} catch (NumberFormatException localNumberFormatException) {
			}

			if (name.endsWith("/")) {
				name = name.substring(0, name.length() - 1);
			}
			int pos = name.lastIndexOf('/');
			if (pos > -1) {
				name = name.substring(pos + 1);
			}

			file.setName(name);

			return file;
		}
		return null;
	}

	protected FTPClientConfig getDefaultConfiguration() {
		return new FTPClientConfig("OS/400", "yy/MM/dd HH:mm:ss", null, null,
				null, null);
	}
}