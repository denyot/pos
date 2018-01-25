package org.eredlab.g4.ccl.net;

import java.io.DataInputStream;
import java.io.IOException;
import java.util.Date;

public final class TimeTCPClient extends SocketClient
{
  public static final int DEFAULT_PORT = 37;
  public static final long SECONDS_1900_TO_1970 = 2208988800L;

  public TimeTCPClient()
  {
    setDefaultPort(37);
  }

  public long getTime()
    throws IOException
  {
    DataInputStream input = new DataInputStream(this._input_);
    return input.readInt() & 0xFFFFFFFF;
  }

  public Date getDate()
    throws IOException
  {
    return new Date((getTime() - 2208988800L) * 1000L);
  }
}