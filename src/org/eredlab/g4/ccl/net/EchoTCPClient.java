package org.eredlab.g4.ccl.net;

import java.io.InputStream;

public final class EchoTCPClient extends DiscardTCPClient
{
  public static final int DEFAULT_PORT = 7;

  public EchoTCPClient()
  {
    setDefaultPort(7);
  }

  public InputStream getInputStream()
  {
    return this._input_;
  }
}