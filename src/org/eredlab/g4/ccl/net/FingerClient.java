package org.eredlab.g4.ccl.net;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class FingerClient extends SocketClient
{
  public static final int DEFAULT_PORT = 79;
  private static final String __LONG_FLAG = "/W ";
  private transient StringBuffer __query = new StringBuffer(64);
  private transient char[] __buffer = new char[1024];

  public FingerClient()
  {
    setDefaultPort(79);
  }

  public String query(boolean longOutput, String username)
    throws IOException
  {
    StringBuffer result = new StringBuffer(this.__buffer.length);

    BufferedReader input = 
      new BufferedReader(new InputStreamReader(getInputStream(longOutput, 
      username)));
    while (true)
    {
      int read = input.read(this.__buffer, 0, this.__buffer.length);
      if (read <= 0)
        break;
      result.append(this.__buffer, 0, read);
    }
    int read;
    input.close();

    return result.toString();
  }

  public String query(boolean longOutput)
    throws IOException
  {
    return query(longOutput, "");
  }

  public InputStream getInputStream(boolean longOutput, String username)
    throws IOException
  {
    this.__query.setLength(0);
    if (longOutput)
      this.__query.append("/W ");
    this.__query.append(username);
    this.__query.append("\r\n");

    DataOutputStream output = 
      new DataOutputStream(new BufferedOutputStream(this._output_, 1024));
    output.writeBytes(this.__query.toString());
    output.flush();

    return this._input_;
  }

  public InputStream getInputStream(boolean longOutput)
    throws IOException
  {
    return getInputStream(longOutput, "");
  }
}