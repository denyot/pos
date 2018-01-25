package org.eredlab.g4.ccl.net.io;

import java.io.FilterOutputStream;
import java.io.IOException;
import java.io.OutputStream;

public final class ToNetASCIIOutputStream extends FilterOutputStream
{
  private boolean __lastWasCR;

  public ToNetASCIIOutputStream(OutputStream output)
  {
    super(output);
    this.__lastWasCR = false;
  }

  public synchronized void write(int ch)
    throws IOException
  {
    switch (ch)
    {
    case 13:
      this.__lastWasCR = true;
      this.out.write(13);
      return;
    case 10:
      if (!this.__lastWasCR)
        this.out.write(13); break;
    case 11:
    case 12:
    }this.__lastWasCR = false;
    this.out.write(ch);
  }

  public synchronized void write(byte[] buffer)
    throws IOException
  {
    write(buffer, 0, buffer.length);
  }

  public synchronized void write(byte[] buffer, int offset, int length)
    throws IOException
  {
    while (length-- > 0)
      write(buffer[(offset++)]);
  }
}