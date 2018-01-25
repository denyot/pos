package org.eredlab.g4.ccl.net;

import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;

public abstract interface SocketFactory
{
  public abstract Socket createSocket(String paramString, int paramInt)
    throws UnknownHostException, IOException;

  public abstract Socket createSocket(InetAddress paramInetAddress, int paramInt)
    throws IOException;

  public abstract Socket createSocket(String paramString, int paramInt1, InetAddress paramInetAddress, int paramInt2)
    throws UnknownHostException, IOException;

  public abstract Socket createSocket(InetAddress paramInetAddress1, int paramInt1, InetAddress paramInetAddress2, int paramInt2)
    throws IOException;

  public abstract ServerSocket createServerSocket(int paramInt)
    throws IOException;

  public abstract ServerSocket createServerSocket(int paramInt1, int paramInt2)
    throws IOException;

  public abstract ServerSocket createServerSocket(int paramInt1, int paramInt2, InetAddress paramInetAddress)
    throws IOException;
}