package org.eredlab.g4.ccl.net.examples;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.net.SocketException;
import java.net.UnknownHostException;
import org.eredlab.g4.ccl.net.tftp.TFTPClient;

public final class tftp {
	static final String USAGE = "Usage: tftp [options] hostname localfile remotefile\n\nhostname   - The name of the remote host\nlocalfile  - The name of the local file to send or the name to use for\n\tthe received file\nremotefile - The name of the remote file to receive or the name for\n\tthe remote server to use to name the local file being sent.\n\noptions: (The default is to assume -r -b)\n\t-s Send a local file\n\t-r Receive a remote file\n\t-a Use ASCII transfer mode\n\t-b Use binary transfer mode\n";

}