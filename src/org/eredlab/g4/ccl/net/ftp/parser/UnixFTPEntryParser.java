package org.eredlab.g4.ccl.net.ftp.parser;

import java.text.ParseException;
import org.eredlab.g4.ccl.net.ftp.FTPClientConfig;
import org.eredlab.g4.ccl.net.ftp.FTPFile;

public class UnixFTPEntryParser extends ConfigurableFTPFileEntryParserImpl {
	private static final String DEFAULT_MONTHS = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)";
	static final String DEFAULT_DATE_FORMAT = "MMM d yyyy";
	static final String DEFAULT_RECENT_DATE_FORMAT = "MMM d HH:mm";
	static final String NUMERIC_DATE_FORMAT = "yyyy-MM-dd HH:mm";
	public static final FTPClientConfig NUMERIC_DATE_CONFIG = new FTPClientConfig(
			"UNIX", "yyyy-MM-dd HH:mm", null, null, null, null);
	private static final String REGEX = "([bcdlfmpSs-])(((r|-)(w|-)([xsStTL-]))((r|-)(w|-)([xsStTL-]))((r|-)(w|-)([xsStTL-])))\\+?\\s+(\\d+)\\s+(\\S+)\\s+(?:(\\S+)\\s+)?(\\d+)\\s+((?:\\d+[-/]\\d+[-/]\\d+)|(?:\\S+\\s+\\S+))\\s+(\\d+(?::\\d+)?)\\s+(\\S*)(\\s*.*)";

	public UnixFTPEntryParser() {
		this(null);
	}

	public UnixFTPEntryParser(FTPClientConfig config) {
		super(
				"([bcdlfmpSs-])(((r|-)(w|-)([xsStTL-]))((r|-)(w|-)([xsStTL-]))((r|-)(w|-)([xsStTL-])))\\+?\\s+(\\d+)\\s+(\\S+)\\s+(?:(\\S+)\\s+)?(\\d+)\\s+((?:\\d+[-/]\\d+[-/]\\d+)|(?:\\S+\\s+\\S+))\\s+(\\d+(?::\\d+)?)\\s+(\\S*)(\\s*.*)");
		configure(config);
	}

	public FTPFile parseFTPEntry(String entry) {
		FTPFile file = new FTPFile();
		file.setRawListing(entry);

		boolean isDevice = false;

		if (matches(entry)) {
			String typeStr = group(1);
			String hardLinkCount = group(15);
			String usr = group(16);
			String grp = group(17);
			String filesize = group(18);
			String datestr = group(19) + " " + group(20);
			String name = group(21);
			String endtoken = group(22);
			try {
				file.setTimestamp(super.parseTimestamp(datestr));
			} catch (ParseException e) {
				return null;
			}
			int type;
			switch (typeStr.charAt(0)) {
			case 'd':
				type = 1;
				break;
			case 'l':
				type = 2;
				break;
			case 'b':
			case 'c':
				isDevice = true;
			case '-':
			case 'f':
				type = 0;
				break;
			default:
				type = 3;
			}

			file.setType(type);

			int g = 4;
			for (int access = 0; access < 3; g += 4) {
				file.setPermission(access, 0, !group(g).equals("-"));
				file.setPermission(access, 1, !group(g + 1).equals("-"));

				String execPerm = group(g + 2);
				if ((!execPerm.equals("-"))
						&& (!Character.isUpperCase(execPerm.charAt(0)))) {
					file.setPermission(access, 2, true);
				} else {
					file.setPermission(access, 2, false);
				}
				access++;
			}

			if (!isDevice) {
				try {
					file.setHardLinkCount(Integer.parseInt(hardLinkCount));
				} catch (NumberFormatException localNumberFormatException) {
				}

			}

			file.setUser(usr);
			file.setGroup(grp);
			try {
				file.setSize(Long.parseLong(filesize));
			} catch (NumberFormatException localNumberFormatException1) {
			}

			if (endtoken == null) {
				file.setName(name);
			} else {
				name = name + endtoken;
				if (type == 2) {
					int end = name.indexOf(" -> ");

					if (end == -1) {
						file.setName(name);
					} else {
						file.setName(name.substring(0, end));
						file.setLink(name.substring(end + 4));
					}

				} else {
					file.setName(name);
				}
			}
			return file;
		}
		return null;
	}

	protected FTPClientConfig getDefaultConfiguration() {
		return new FTPClientConfig("UNIX", "MMM d yyyy", "MMM d HH:mm", null,
				null, null);
	}
}