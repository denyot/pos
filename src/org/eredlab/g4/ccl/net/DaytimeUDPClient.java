package org.eredlab.g4.ccl.net;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public final class DaytimeUDPClient extends DatagramSocketClient
{
  public static final int DEFAULT_PORT = 13;
  private byte[] __dummyData = new byte[1];

  private byte[] __timeData = new byte[256];

  public String getTime(InetAddress host, int port)
    throws IOException
  {
    DatagramPacket sendPacket = 
      new DatagramPacket(this.__dummyData, this.__dummyData.length, host, port);
    DatagramPacket receivePacket = new DatagramPacket(this.__timeData, this.__timeData.length);

    this._socket_.send(sendPacket);
    this._socket_.receive(receivePacket);

    return new String(receivePacket.getData(), 0, receivePacket.getLength());
  }

  public String getTime(InetAddress host)
    throws IOException
  {
    return getTime(host, 13);
  }
}