package org.eredlab.g4.ccl.net.io;

import java.io.IOException;
import java.io.Writer;

public final class DotTerminatedMessageWriter extends Writer
{
  private static final int __NOTHING_SPECIAL_STATE = 0;
  private static final int __LAST_WAS_CR_STATE = 1;
  private static final int __LAST_WAS_NL_STATE = 2;
  private int __state;
  private Writer __output;

  public DotTerminatedMessageWriter(Writer output)
  {
    super(output);
    this.__output = output;
    this.__state = 0;
  }

  public void write(int ch)
    throws IOException
  {
    synchronized (this.lock)
    {
      switch (ch)
      {
      case 13:
        this.__state = 1;
        this.__output.write(13);
        return;
      case 10:
        if (this.__state != 1)
          this.__output.write(13);
        this.__output.write(10);
        this.__state = 2;
        return;
      case 46:
        if (this.__state == 2)
          this.__output.write(46);
        break;
      }
      this.__state = 0;
      this.__output.write(ch);
      return;
    }
  }

  public void write(char[] buffer, int offset, int length)
    throws IOException
  {
    synchronized (this.lock)
    {
      while (length-- > 0)
        write(buffer[(offset++)]);
    }
  }

  public void write(char[] buffer)
    throws IOException
  {
    write(buffer, 0, buffer.length);
  }

  public void write(String string)
    throws IOException
  {
    write(string.toCharArray());
  }

  public void write(String string, int offset, int length)
    throws IOException
  {
    write(string.toCharArray(), offset, length);
  }

  public void flush()
    throws IOException
  {
    synchronized (this.lock)
    {
      this.__output.flush();
    }
  }

  public void close()
    throws IOException
  {
    synchronized (this.lock)
    {
      if (this.__output == null) {
        return;
      }
      if (this.__state == 1)
        this.__output.write(10);
      else if (this.__state != 2) {
        this.__output.write("\r\n");
      }
      this.__output.write(".\r\n");

      this.__output.flush();
      this.__output = null;
    }
  }
}