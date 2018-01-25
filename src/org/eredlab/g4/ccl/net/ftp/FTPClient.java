package org.eredlab.g4.ccl.net.ftp;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Vector;
import org.eredlab.g4.ccl.net.MalformedServerReplyException;
import org.eredlab.g4.ccl.net.SocketFactory;
import org.eredlab.g4.ccl.net.ftp.parser.DefaultFTPFileEntryParserFactory;
import org.eredlab.g4.ccl.net.ftp.parser.FTPFileEntryParserFactory;
import org.eredlab.g4.ccl.net.io.FromNetASCIIInputStream;
import org.eredlab.g4.ccl.net.io.SocketInputStream;
import org.eredlab.g4.ccl.net.io.SocketOutputStream;
import org.eredlab.g4.ccl.net.io.ToNetASCIIOutputStream;
import org.eredlab.g4.ccl.net.io.Util;

public class FTPClient extends FTP implements Configurable {
	public static final int ACTIVE_LOCAL_DATA_CONNECTION_MODE = 0;
	public static final int ACTIVE_REMOTE_DATA_CONNECTION_MODE = 1;
	public static final int PASSIVE_LOCAL_DATA_CONNECTION_MODE = 2;
	public static final int PASSIVE_REMOTE_DATA_CONNECTION_MODE = 3;
	private int __dataConnectionMode;
	private int __dataTimeout;
	private int __passivePort;
	private String __passiveHost;
	private int __fileType;
	private int __fileFormat;
	private int __fileStructure;
	private int __fileTransferMode;
	private boolean __remoteVerificationEnabled;
	private long __restartOffset;
	private FTPFileEntryParserFactory __parserFactory;
	private int __bufferSize;
	private String __systemName;
	private FTPFileEntryParser __entryParser;
	private FTPClientConfig __configuration;

	public FTPClient() {
		__initDefaults();
		this.__dataTimeout = -1;
		this.__remoteVerificationEnabled = true;
		this.__parserFactory = new DefaultFTPFileEntryParserFactory();
		this.__configuration = null;
	}

	private void __initDefaults() {
		this.__dataConnectionMode = 0;
		this.__passiveHost = null;
		this.__passivePort = -1;
		this.__fileType = 0;
		this.__fileStructure = 7;
		this.__fileFormat = 4;
		this.__fileTransferMode = 10;
		this.__restartOffset = 0L;
		this.__systemName = null;
		this.__entryParser = null;
		this.__bufferSize = 1024;
	}

	private String __parsePathname(String reply) {
		int begin = reply.indexOf('"') + 1;
		int end = reply.indexOf('"', begin);

		return reply.substring(begin, end);
	}

	private void __parsePassiveModeReply(String reply)
			throws MalformedServerReplyException {
		reply = reply.substring(reply.indexOf('(') + 1, reply.indexOf(')'))
				.trim();

		StringBuffer host = new StringBuffer(24);
		int lastIndex = 0;
		int index = reply.indexOf(',');
		host.append(reply.substring(lastIndex, index));

		for (int i = 0; i < 3; i++) {
			host.append('.');
			lastIndex = index + 1;
			index = reply.indexOf(',', lastIndex);
			host.append(reply.substring(lastIndex, index));
		}

		lastIndex = index + 1;
		index = reply.indexOf(',', lastIndex);

		String octet1 = reply.substring(lastIndex, index);
		String octet2 = reply.substring(index + 1);
		try {
			index = Integer.parseInt(octet1);
			lastIndex = Integer.parseInt(octet2);
		} catch (NumberFormatException e) {
			throw new MalformedServerReplyException(
					"Could not parse passive host information.\nServer Reply: "
							+ reply);
		}

		index <<= 8;
		index |= lastIndex;

		this.__passiveHost = host.toString();
		this.__passivePort = index;
	}

	private boolean __storeFile(int command, String remote, InputStream local)
			throws IOException {
		Socket socket;
		if ((socket = _openDataConnection_(command, remote)) == null) {
			return false;
		}
		OutputStream output = new BufferedOutputStream(
				socket.getOutputStream(), getBufferSize());

		if (this.__fileType == 0) {
			output = new ToNetASCIIOutputStream(output);
		}
		try {
			Util.copyStream(local, output, getBufferSize(), -1L, null, false);
		} catch (IOException e) {
			try {
				socket.close();
			} catch (IOException localIOException1) {
			}
			throw e;
		}
		output.close();
		socket.close();
		return completePendingCommand();
	}

	private OutputStream __storeFileStream(int command, String remote)
			throws IOException {
		Socket socket;
		if ((socket = _openDataConnection_(command, remote)) == null) {
			return null;
		}
		OutputStream output = socket.getOutputStream();
		if (this.__fileType == 0) {
			output = new BufferedOutputStream(output, getBufferSize());
			output = new ToNetASCIIOutputStream(output);
		}

		return new SocketOutputStream(socket, output);
	}

	protected Socket _openDataConnection_(int command, String arg)
			throws IOException {
		if ((this.__dataConnectionMode != 0)
				&& (this.__dataConnectionMode != 2))
			return null;
		Socket socket;
		if (this.__dataConnectionMode == 0) {
			ServerSocket server = this._socketFactory_.createServerSocket(0, 1,
					getLocalAddress());

			if (!FTPReply.isPositiveCompletion(port(getLocalAddress(), server
					.getLocalPort()))) {
				server.close();
				return null;
			}

			if ((this.__restartOffset > 0L) && (!restart(this.__restartOffset))) {
				server.close();
				return null;
			}

			if (!FTPReply.isPositivePreliminary(sendCommand(command, arg))) {
				server.close();
				return null;
			}

			if (this.__dataTimeout >= 0)
				server.setSoTimeout(this.__dataTimeout);
			socket = server.accept();
			server.close();
		} else {
			if (pasv() != 227) {
				return null;
			}
			__parsePassiveModeReply((String) this._replyLines.elementAt(0));

			socket = this._socketFactory_.createSocket(this.__passiveHost,
					this.__passivePort);
			if ((this.__restartOffset > 0L) && (!restart(this.__restartOffset))) {
				socket.close();
				return null;
			}

			if (!FTPReply.isPositivePreliminary(sendCommand(command, arg))) {
				socket.close();
				return null;
			}
		}

		if ((this.__remoteVerificationEnabled) && (!verifyRemote(socket))) {
			InetAddress host1 = socket.getInetAddress();
			InetAddress host2 = getRemoteAddress();

			socket.close();

			throw new IOException("Host attempting data connection "
					+ host1.getHostAddress() + " is not same as server "
					+ host2.getHostAddress());
		}

		if (this.__dataTimeout >= 0) {
			socket.setSoTimeout(this.__dataTimeout);
		}
		return socket;
	}

	protected void _connectAction_() throws IOException {
		super._connectAction_();
		__initDefaults();
	}

	public void setDataTimeout(int timeout) {
		this.__dataTimeout = timeout;
	}

	public void setParserFactory(FTPFileEntryParserFactory parserFactory) {
		this.__parserFactory = parserFactory;
	}

	public void disconnect() throws IOException {
		super.disconnect();
		__initDefaults();
	}

	public void setRemoteVerificationEnabled(boolean enable) {
		this.__remoteVerificationEnabled = enable;
	}

	public boolean isRemoteVerificationEnabled() {
		return this.__remoteVerificationEnabled;
	}

	public boolean login(String username, String password) throws IOException {
		user(username);

		if (FTPReply.isPositiveCompletion(this._replyCode)) {
			return true;
		}

		if (!FTPReply.isPositiveIntermediate(this._replyCode)) {
			return false;
		}
		return FTPReply.isPositiveCompletion(pass(password));
	}

	public boolean login(String username, String password, String account)
			throws IOException {
		user(username);

		if (FTPReply.isPositiveCompletion(this._replyCode)) {
			return true;
		}

		if (!FTPReply.isPositiveIntermediate(this._replyCode)) {
			return false;
		}
		pass(password);

		if (FTPReply.isPositiveCompletion(this._replyCode)) {
			return true;
		}
		if (!FTPReply.isPositiveIntermediate(this._replyCode)) {
			return false;
		}
		return FTPReply.isPositiveCompletion(acct(account));
	}

	public boolean logout() throws IOException {
		return FTPReply.isPositiveCompletion(quit());
	}

	public boolean changeWorkingDirectory(String pathname) throws IOException {
		return FTPReply.isPositiveCompletion(cwd(pathname));
	}

	public boolean changeToParentDirectory() throws IOException {
		return FTPReply.isPositiveCompletion(cdup());
	}

	public boolean structureMount(String pathname) throws IOException {
		return FTPReply.isPositiveCompletion(smnt(pathname));
	}

	boolean reinitialize() throws IOException {
		rein();

		if ((FTPReply.isPositiveCompletion(this._replyCode))
				|| ((FTPReply.isPositivePreliminary(this._replyCode)) && (FTPReply
						.isPositiveCompletion(getReply())))) {
			__initDefaults();

			return true;
		}

		return false;
	}

	public void enterLocalActiveMode() {
		this.__dataConnectionMode = 0;
		this.__passiveHost = null;
		this.__passivePort = -1;
	}

	public void enterLocalPassiveMode() {
		this.__dataConnectionMode = 2;

		this.__passiveHost = null;
		this.__passivePort = -1;
	}

	public boolean enterRemoteActiveMode(InetAddress host, int port)
			throws IOException {
		if (FTPReply.isPositiveCompletion(port(host, port))) {
			this.__dataConnectionMode = 1;
			this.__passiveHost = null;
			this.__passivePort = -1;
			return true;
		}
		return false;
	}

	public boolean enterRemotePassiveMode() throws IOException {
		if (pasv() != 227) {
			return false;
		}
		this.__dataConnectionMode = 3;
		__parsePassiveModeReply((String) this._replyLines.elementAt(0));

		return true;
	}

	public String getPassiveHost() {
		return this.__passiveHost;
	}

	public int getPassivePort() {
		return this.__passivePort;
	}

	public int getDataConnectionMode() {
		return this.__dataConnectionMode;
	}

	public boolean setFileType(int fileType) throws IOException {
		if (FTPReply.isPositiveCompletion(type(fileType))) {
			this.__fileType = fileType;
			this.__fileFormat = 4;
			return true;
		}
		return false;
	}

	public boolean setFileType(int fileType, int formatOrByteSize)
			throws IOException {
		if (FTPReply.isPositiveCompletion(type(fileType, formatOrByteSize))) {
			this.__fileType = fileType;
			this.__fileFormat = formatOrByteSize;
			return true;
		}
		return false;
	}

	public boolean setFileStructure(int structure) throws IOException {
		if (FTPReply.isPositiveCompletion(stru(structure))) {
			this.__fileStructure = structure;
			return true;
		}
		return false;
	}

	public boolean setFileTransferMode(int mode) throws IOException {
		if (FTPReply.isPositiveCompletion(mode(mode))) {
			this.__fileTransferMode = mode;
			return true;
		}
		return false;
	}

	public boolean remoteRetrieve(String filename) throws IOException {
		if ((this.__dataConnectionMode == 1)
				|| (this.__dataConnectionMode == 3))
			return FTPReply.isPositivePreliminary(retr(filename));
		return false;
	}

	public boolean remoteStore(String filename) throws IOException {
		if ((this.__dataConnectionMode == 1)
				|| (this.__dataConnectionMode == 3))
			return FTPReply.isPositivePreliminary(stor(filename));
		return false;
	}

	public boolean remoteStoreUnique(String filename) throws IOException {
		if ((this.__dataConnectionMode == 1)
				|| (this.__dataConnectionMode == 3))
			return FTPReply.isPositivePreliminary(stou(filename));
		return false;
	}

	public boolean remoteStoreUnique() throws IOException {
		if ((this.__dataConnectionMode == 1)
				|| (this.__dataConnectionMode == 3))
			return FTPReply.isPositivePreliminary(stou());
		return false;
	}

	public boolean remoteAppend(String filename) throws IOException {
		if ((this.__dataConnectionMode == 1)
				|| (this.__dataConnectionMode == 3))
			return FTPReply.isPositivePreliminary(stor(filename));
		return false;
	}

	public boolean completePendingCommand() throws IOException {
		return FTPReply.isPositiveCompletion(getReply());
	}

	public boolean retrieveFile(String remote, OutputStream local)
			throws IOException {
		Socket socket;
		if ((socket = _openDataConnection_(13, remote)) == null) {
			return false;
		}
		InputStream input = new BufferedInputStream(socket.getInputStream(),
				getBufferSize());
		if (this.__fileType == 0) {
			input = new FromNetASCIIInputStream(input);
		}
		try {
			Util.copyStream(input, local, getBufferSize(), -1L, null, false);
		} catch (IOException e) {
			try {
				socket.close();
			} catch (IOException localIOException1) {
			}
			throw e;
		}
		socket.close();
		return completePendingCommand();
	}

	public InputStream retrieveFileStream(String remote) throws IOException {
		Socket socket;
		if ((socket = _openDataConnection_(13, remote)) == null) {
			return null;
		}
		InputStream input = socket.getInputStream();
		if (this.__fileType == 0) {
			input = new BufferedInputStream(input, getBufferSize());
			input = new FromNetASCIIInputStream(input);
		}
		return new SocketInputStream(socket, input);
	}

	public boolean storeFile(String remote, InputStream local)
			throws IOException {
		return __storeFile(14, remote, local);
	}

	public OutputStream storeFileStream(String remote) throws IOException {
		return __storeFileStream(14, remote);
	}

	public boolean appendFile(String remote, InputStream local)
			throws IOException {
		return __storeFile(16, remote, local);
	}

	public OutputStream appendFileStream(String remote) throws IOException {
		return __storeFileStream(16, remote);
	}

	public boolean storeUniqueFile(String remote, InputStream local)
			throws IOException {
		return __storeFile(15, remote, local);
	}

	public OutputStream storeUniqueFileStream(String remote) throws IOException {
		return __storeFileStream(15, remote);
	}

	public boolean storeUniqueFile(InputStream local) throws IOException {
		return __storeFile(15, null, local);
	}

	public OutputStream storeUniqueFileStream() throws IOException {
		return __storeFileStream(15, null);
	}

	public boolean allocate(int bytes) throws IOException {
		return FTPReply.isPositiveCompletion(allo(bytes));
	}

	public boolean allocate(int bytes, int recordSize) throws IOException {
		return FTPReply.isPositiveCompletion(allo(bytes, recordSize));
	}

	private boolean restart(long offset) throws IOException {
		this.__restartOffset = 0L;
		return FTPReply.isPositiveIntermediate(rest(Long.toString(offset)));
	}

	public void setRestartOffset(long offset) {
		if (offset >= 0L)
			this.__restartOffset = offset;
	}

	public long getRestartOffset() {
		return this.__restartOffset;
	}

	public boolean rename(String from, String to) throws IOException {
		if (!FTPReply.isPositiveIntermediate(rnfr(from))) {
			return false;
		}
		return FTPReply.isPositiveCompletion(rnto(to));
	}

	public boolean abort() throws IOException {
		return FTPReply.isPositiveCompletion(abor());
	}

	public boolean deleteFile(String pathname) throws IOException {
		return FTPReply.isPositiveCompletion(dele(pathname));
	}

	public boolean removeDirectory(String pathname) throws IOException {
		return FTPReply.isPositiveCompletion(rmd(pathname));
	}

	public boolean makeDirectory(String pathname) throws IOException {
		return FTPReply.isPositiveCompletion(mkd(pathname));
	}

	public String printWorkingDirectory() throws IOException {
		if (pwd() != 257) {
			return null;
		}
		return __parsePathname((String) this._replyLines.elementAt(0));
	}

	public boolean sendSiteCommand(String arguments) throws IOException {
		return FTPReply.isPositiveCompletion(site(arguments));
	}

	public String getSystemName() throws IOException {
		if ((this.__systemName == null)
				&& (FTPReply.isPositiveCompletion(syst()))) {
			this.__systemName = ((String) this._replyLines.elementAt(0))
					.substring(4);
		}
		return this.__systemName;
	}

	public String listHelp() throws IOException {
		if (FTPReply.isPositiveCompletion(help()))
			return getReplyString();
		return null;
	}

	public String listHelp(String command) throws IOException {
		if (FTPReply.isPositiveCompletion(help(command)))
			return getReplyString();
		return null;
	}

	public boolean sendNoOp() throws IOException {
		return FTPReply.isPositiveCompletion(noop());
	}

	public String[] listNames(String pathname) throws IOException {
		Socket socket;
		if ((socket = _openDataConnection_(27, pathname)) == null) {
			return null;
		}
		BufferedReader reader = new BufferedReader(new InputStreamReader(socket
				.getInputStream(), getControlEncoding()));

		Vector results = new Vector();
		String line;
		while ((line = reader.readLine()) != null) {
			results.addElement(line);
		}
		reader.close();
		socket.close();

		if (completePendingCommand()) {
			String[] result = new String[results.size()];
			results.copyInto(result);
			return result;
		}

		return null;
	}

	public String[] listNames() throws IOException {
		return listNames(null);
	}

	/** @deprecated */
	public FTPFile[] listFiles(String parserKey, String pathname)
			throws IOException {
		FTPListParseEngine engine = initiateListParsing(parserKey, pathname);
		return engine.getFiles();
	}

	public FTPFile[] listFiles(String pathname) throws IOException {
		String key = null;
		FTPListParseEngine engine = initiateListParsing(key, pathname);
		return engine.getFiles();
	}

	public FTPFile[] listFiles() throws IOException {
		return this.listFiles("");
	}

	public FTPListParseEngine initiateListParsing() throws IOException {
		return initiateListParsing(null);
	}

	public FTPListParseEngine initiateListParsing(String pathname)
			throws IOException {
		String key = null;
		return initiateListParsing(key, pathname);
	}

	public FTPListParseEngine initiateListParsing(String parserKey,
			String pathname) throws IOException {
		if (this.__entryParser == null) {
			if (parserKey != null) {
				this.__entryParser = this.__parserFactory
						.createFileEntryParser(parserKey);
			} else if (this.__configuration != null) {
				this.__entryParser = this.__parserFactory
						.createFileEntryParser(this.__configuration);
			} else {
				this.__entryParser = this.__parserFactory
						.createFileEntryParser(getSystemName());
			}

		}

		return initiateListParsing(this.__entryParser, pathname);
	}

	private FTPListParseEngine initiateListParsing(FTPFileEntryParser parser,
			String pathname) throws IOException {
		FTPListParseEngine engine = new FTPListParseEngine(parser);
		Socket socket;
		if ((socket = _openDataConnection_(26, pathname)) == null) {
			return engine;
		}

		engine.readServerList(socket.getInputStream(), getControlEncoding());

		socket.close();

		completePendingCommand();
		return engine;
	}

	public String getStatus() throws IOException {
		if (FTPReply.isPositiveCompletion(stat()))
			return getReplyString();
		return null;
	}

	public String getStatus(String pathname) throws IOException {
		if (FTPReply.isPositiveCompletion(stat(pathname)))
			return getReplyString();
		return null;
	}

	/** @deprecated */
	public FTPFile[] listFiles(FTPFileListParser parser, String pathname)
			throws IOException {
		Socket socket;
		if ((socket = _openDataConnection_(26, pathname)) == null) {
			return new FTPFile[0];
		}
		FTPFile[] results = parser.parseFileList(socket.getInputStream(),
				getControlEncoding());

		socket.close();

		completePendingCommand();

		return results;
	}

	/** @deprecated */
	public FTPFile[] listFiles(FTPFileListParser parser) throws IOException {
		return listFiles(parser, null);
	}

	/** @deprecated */
	public FTPFileList createFileList(FTPFileEntryParser parser)
			throws IOException {
		return createFileList(null, parser);
	}

	/** @deprecated */
	public FTPFileList createFileList(String pathname, FTPFileEntryParser parser)
			throws IOException {
		Socket socket;
		if ((socket = _openDataConnection_(26, pathname)) == null) {
			return null;
		}

		FTPFileList list = FTPFileList.create(socket.getInputStream(), parser);

		socket.close();

		completePendingCommand();
		return list;
	}

	public void setBufferSize(int bufSize) {
		this.__bufferSize = bufSize;
	}

	public int getBufferSize() {
		return this.__bufferSize;
	}

	public void configure(FTPClientConfig config) {
		this.__configuration = config;
	}
}