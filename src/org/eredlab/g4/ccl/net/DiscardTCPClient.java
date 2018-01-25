package org.eredlab.g4.ccl.net;

import java.io.OutputStream;

public class DiscardTCPClient extends SocketClient
{
  public static final int DEFAULT_PORT = 9;

  public DiscardTCPClient()
  {
    setDefaultPort(9);
  }

  public OutputStream getOutputStream()
  {
    return this._output_;
  }
}