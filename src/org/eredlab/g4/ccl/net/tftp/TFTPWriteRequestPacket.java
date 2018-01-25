package org.eredlab.g4.ccl.net.tftp;

import java.net.DatagramPacket;
import java.net.InetAddress;

import org.apache.commons.net.tftp.TFTPPacketException;

public final class TFTPWriteRequestPacket extends TFTPRequestPacket
{
  private static DatagramPacket datagram;

public TFTPWriteRequestPacket(InetAddress destination, int port, String filename, int mode)
  {
    super(destination, port, 2, filename, mode);
  }

  TFTPWriteRequestPacket()
    throws TFTPPacketException
  {
    super(2, datagram);
  }
}