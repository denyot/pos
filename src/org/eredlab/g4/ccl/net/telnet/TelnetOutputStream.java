package org.eredlab.g4.ccl.net.telnet;

import java.io.IOException;
import java.io.OutputStream;

final class TelnetOutputStream extends OutputStream
{
  private TelnetClient __client;
  private boolean __convertCRtoCRLF = true;
  private boolean __lastWasCR = false;

  TelnetOutputStream(TelnetClient client)
  {
    this.__client = client;
  }

  public void write(int ch)
    throws IOException
  {
    synchronized (this.__client)
    {
      ch &= 255;

      if (this.__client._requestedWont(TelnetOption.BINARY))
      {
        if (this.__lastWasCR)
        {
          if (this.__convertCRtoCRLF)
          {
            this.__client._sendByte(10);
            if (ch == 10)
            {
              this.__lastWasCR = false;
            }

          }
          else if (ch != 10) {
            this.__client._sendByte(0);
          }
        }
        this.__lastWasCR = false;

        switch (ch)
        {
        case 13:
          this.__client._sendByte(13);
          this.__lastWasCR = true;
          break;
        case 255:
          this.__client._sendByte(255);
          this.__client._sendByte(255);
          break;
        default:
          this.__client._sendByte(ch);
          break;
        }
      }
      else if (ch == 255)
      {
        this.__client._sendByte(ch);
        this.__client._sendByte(255);
      }
      else {
        this.__client._sendByte(ch);
      }
    }
  }

  public void write(byte[] buffer)
    throws IOException
  {
    write(buffer, 0, buffer.length);
  }

  public void write(byte[] buffer, int offset, int length)
    throws IOException
  {
    synchronized (this.__client)
    {
      while (length-- > 0)
        write(buffer[(offset++)]);
    }
  }

  public void flush()
    throws IOException
  {
    this.__client._flushOutputStream();
  }

  public void close()
    throws IOException
  {
    this.__client._closeOutputStream();
  }
}