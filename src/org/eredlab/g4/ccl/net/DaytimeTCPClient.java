package org.eredlab.g4.ccl.net;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public final class DaytimeTCPClient extends SocketClient
{
  public static final int DEFAULT_PORT = 13;
  private char[] __buffer = new char[64];

  public DaytimeTCPClient()
  {
    setDefaultPort(13);
  }

  public String getTime()
    throws IOException
  {
    StringBuffer result = new StringBuffer(this.__buffer.length);

    BufferedReader reader = new BufferedReader(new InputStreamReader(this._input_));
    while (true)
    {
      int read = reader.read(this.__buffer, 0, this.__buffer.length);
      if (read <= 0)
        break;
      result.append(this.__buffer, 0, read);
    }
    int read;
    return result.toString();
  }
}