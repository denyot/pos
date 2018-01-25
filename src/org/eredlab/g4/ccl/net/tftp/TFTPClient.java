package org.eredlab.g4.ccl.net.tftp;

import java.io.IOException;
import java.io.InputStream;
import java.io.InterruptedIOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

import org.apache.commons.net.tftp.TFTPPacketException;
import org.eredlab.g4.ccl.net.io.FromNetASCIIOutputStream;
import org.eredlab.g4.ccl.net.io.ToNetASCIIInputStream;

public class TFTPClient extends TFTP {
	public static final int DEFAULT_MAX_TIMEOUTS = 5;
	private int __maxTimeouts;

	public TFTPClient() {
		this.__maxTimeouts = 5;
	}

	public void setMaxTimeouts(int numTimeouts) {
		if (numTimeouts < 1)
			this.__maxTimeouts = 1;
		else
			this.__maxTimeouts = numTimeouts;
	}

	public int getMaxTimeouts() {
		return this.__maxTimeouts;
	}

	public int receiveFile(String filename, int mode, OutputStream output,
			InetAddress host, int port) throws IOException {
		TFTPPacket received = null;

		TFTPAckPacket ack = new TFTPAckPacket(host, port, 0);

		beginBufferedOps();
		int bytesRead;
		int hostPort;
		int lastBlock;
		int dataLength = lastBlock = hostPort = bytesRead = 0;
		int block = 1;

		if (mode == 0) {
			output = new FromNetASCIIOutputStream(output);
		}

		TFTPPacket sent = new TFTPReadRequestPacket(host, port, filename, mode);
		label489: do {
			bufferedSend(sent);
			do {
				int timeouts = 0;
				while (timeouts < this.__maxTimeouts) {
					try {
						received = bufferedReceive();
					} catch (SocketException e) {
						timeouts++;
						if (timeouts >= this.__maxTimeouts) {
							endBufferedOps();
							throw new IOException("Connection timed out.");
						}

					} catch (InterruptedIOException e) {
						timeouts++;
						if (timeouts >= this.__maxTimeouts) {
							endBufferedOps();
							throw new IOException("Connection timed out.");
						}

					} catch (TFTPPacketException e) {
						endBufferedOps();
						throw new IOException("Bad packet: " + e.getMessage());
					}

				}

				if (lastBlock == 0) {
					hostPort = received.getPort();
					ack.setPort(hostPort);
					if (!host.equals(received.getAddress())) {
						host = received.getAddress();
						ack.setAddress(host);
						sent.setAddress(host);
					}

				}

				if ((!host.equals(received.getAddress()))
						|| (received.getPort() != hostPort)) {
					break;
				}
				switch (received.getType()) {
				case 5:
					TFTPErrorPacket error = (TFTPErrorPacket) received;
					endBufferedOps();
					throw new IOException("Error code " + error.getError()
							+ " received: " + error.getMessage());
				case 3:
					TFTPDataPacket data = (TFTPDataPacket) received;
					dataLength = data.getDataLength();

					lastBlock = data.getBlockNumber();

					if (lastBlock == block) {
						try {
							output.write(data.getData(), data.getDataOffset(),
									dataLength);
						} catch (IOException e) {
							TFTPErrorPacket error1 = new TFTPErrorPacket(host,
									hostPort, 3, "File write failed.");
							bufferedSend(error1);
							endBufferedOps();
							throw e;
						}
						block++;
						break label489;
					}

					discardPackets();
				case 4:
				}
			} while (lastBlock != block - 1);
			continue;

//		    endBufferedOps();
//			throw new IOException("Received unexpected packet type.");
//
//			TFTPErrorPacket error = new TFTPErrorPacket(received.getAddress(),
//					received.getPort(), 5, "Unexpected host or port.");
//			bufferedSend(error);
//			continue;
//			TFTPDataPacket data;
//			ack.setBlockNumber(lastBlock);
//			sent = ack;
//			bytesRead += dataLength;
		}

		while (dataLength == 512);

		bufferedSend(sent);
		endBufferedOps();

		return bytesRead;
	}

	public int receiveFile(String filename, int mode, OutputStream output,
			String hostname, int port) throws UnknownHostException, IOException {
		return receiveFile(filename, mode, output, InetAddress
				.getByName(hostname), port);
	}

	public int receiveFile(String filename, int mode, OutputStream output,
			InetAddress host) throws IOException {
		return receiveFile(filename, mode, output, host, 69);
	}

	public int receiveFile(String filename, int mode, OutputStream output,
			String hostname) throws UnknownHostException, IOException {
		return receiveFile(filename, mode, output, InetAddress
				.getByName(hostname), 69);
	}

	public void sendFile(String filename, int mode, InputStream input,
			InetAddress host, int port) throws IOException {
		TFTPPacket received = null;

		TFTPDataPacket data = new TFTPDataPacket(host, port, 0,
				this._sendBuffer, 4, 0);

		beginBufferedOps();
		int bytesRead;
		int hostPort;
		int lastBlock;
		int dataLength = lastBlock = hostPort = bytesRead = 0;
		int block = 0;
		boolean lastAckWait = false;

		if (mode == 0) {
			input = new ToNetASCIIInputStream(input);
		}

		TFTPPacket sent = new TFTPWriteRequestPacket(host, port, filename, mode);
		label441: do {
			bufferedSend(sent);
			do {
				int timeouts = 0;
				while (timeouts < this.__maxTimeouts) {
					try {
						received = bufferedReceive();
					} catch (SocketException e) {
						timeouts++;
						if (timeouts >= this.__maxTimeouts) {
							endBufferedOps();
							throw new IOException("Connection timed out.");
						}

					} catch (InterruptedIOException e) {
						timeouts++;
						if (timeouts >= this.__maxTimeouts) {
							endBufferedOps();
							throw new IOException("Connection timed out.");
						}

					} catch (TFTPPacketException e) {
						endBufferedOps();
						throw new IOException("Bad packet: " + e.getMessage());
					}

				}

				if (lastBlock == 0) {
					hostPort = received.getPort();
					data.setPort(hostPort);
					if (!host.equals(received.getAddress())) {
						host = received.getAddress();
						data.setAddress(host);
						sent.setAddress(host);
					}

				}

				if ((!host.equals(received.getAddress()))
						|| (received.getPort() != hostPort)) {
					break;
				}
				switch (received.getType()) {
				case 5:
					TFTPErrorPacket error = (TFTPErrorPacket) received;
					endBufferedOps();
					throw new IOException("Error code " + error.getError()
							+ " received: " + error.getMessage());
				case 4:
					TFTPAckPacket ack = (TFTPAckPacket) received;

					lastBlock = ack.getBlockNumber();

					if (lastBlock == block) {
						block++;
						if (!lastAckWait)
							break label441;
					}

					discardPackets();
				}
			} while (lastBlock != block - 1);
			continue;

//			endBufferedOps();
//			throw new IOException("Received unexpected packet type.");
//
//			TFTPErrorPacket error = new TFTPErrorPacket(received.getAddress(),
//					received.getPort(), 5, "Unexpected host or port.");
//			bufferedSend(error);
//			continue;
//			TFTPAckPacket ack;
//			dataLength = 512;
//			int offset = 4;
//			while ((dataLength > 0)
//					&& ((bytesRead = input.read(this._sendBuffer, offset,
//							dataLength)) > 0)) {
//				offset += bytesRead;
//				dataLength -= bytesRead;
//			}

			//data.setBlockNumber(block);
			//data.setData(this._sendBuffer, 4, offset - 4);
			//sent = data;
		} while ((dataLength == 0) || (lastAckWait));

		label524: endBufferedOps();
	}

	public void sendFile(String filename, int mode, InputStream input,
			String hostname, int port) throws UnknownHostException, IOException {
		sendFile(filename, mode, input, InetAddress.getByName(hostname), port);
	}

	public void sendFile(String filename, int mode, InputStream input,
			InetAddress host) throws IOException {
		sendFile(filename, mode, input, host, 69);
	}

	public void sendFile(String filename, int mode, InputStream input,
			String hostname) throws UnknownHostException, IOException {
		sendFile(filename, mode, input, InetAddress.getByName(hostname), 69);
	}
}