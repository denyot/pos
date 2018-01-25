package org.eredlab.g4.ccl.net.tftp;

import java.net.DatagramPacket;
import java.net.InetAddress;

import org.apache.commons.net.tftp.TFTPPacketException;

public final class TFTPReadRequestPacket extends TFTPRequestPacket {
	private static DatagramPacket datagram;

	public TFTPReadRequestPacket(InetAddress destination, int port,
			String filename, int mode) {
		super(destination, port, 1, filename, mode);
	}

	TFTPReadRequestPacket() throws TFTPPacketException {
		super(1, datagram);
	}
}