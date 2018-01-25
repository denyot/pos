package org.eredlab.g4.ccl.net.io;

import java.io.IOException;
import java.io.PushbackReader;
import java.io.Reader;

public final class DotTerminatedMessageReader extends Reader
{
  private static final String LS = System.getProperty("line.separator");
  private static final char[] LS_CHARS = LS.toCharArray();
  private boolean atBeginning;
  private boolean eof;
  private int pos;
  private char[] internalBuffer;
  private PushbackReader internalReader;

  public DotTerminatedMessageReader(Reader reader)
  {
    super(reader);
    this.internalBuffer = new char[LS_CHARS.length + 3];
    this.pos = this.internalBuffer.length;

    this.atBeginning = true;
    this.eof = false;
    this.internalReader = new PushbackReader(reader);
  }

  public int read()
    throws IOException
  {
    synchronized (this.lock)
    {
      if (this.pos < this.internalBuffer.length)
      {
        return this.internalBuffer[(this.pos++)];
      }

      if (this.eof)
      {
        return -1;
      }
      int ch;
      if ((ch = this.internalReader.read()) == -1)
      {
        this.eof = true;
        return -1;
      }

      if (this.atBeginning)
      {
        this.atBeginning = false;
        if (ch == 46)
        {
          ch = this.internalReader.read();

          if (ch != 46)
          {
            this.eof = true;
            this.internalReader.read();
            return -1;
          }

          return 46;
        }

      }

      if (ch == 13)
      {
        ch = this.internalReader.read();

        if (ch == 10)
        {
          ch = this.internalReader.read();

          if (ch == 46)
          {
            ch = this.internalReader.read();

            if (ch != 46)
            {
              this.internalReader.read();
              this.eof = true;
            }
            else
            {
              this.internalBuffer[(--this.pos)] = ((char)ch);
            }
          }
          else
          {
            this.internalReader.unread(ch);
          }

          this.pos -= LS_CHARS.length;
          System.arraycopy(LS_CHARS, 0, this.internalBuffer, this.pos, 
            LS_CHARS.length);
          ch = this.internalBuffer[(this.pos++)];
        }
        else
        {
          this.internalBuffer[(--this.pos)] = ((char)ch);
          return 13;
        }
      }

      return ch;
    }
  }

  public int read(char[] buffer)
    throws IOException
  {
    return read(buffer, 0, buffer.length);
  }

  public int read(char[] buffer, int offset, int length)
    throws IOException
  {
    synchronized (this.lock)
    {
      if (length < 1)
      {
        return 0;
      }
      int ch;
      if ((ch = read()) == -1)
      {
        return -1;
      }
      int off = offset;
      do
      {
        buffer[(offset++)] = ((char)ch);

        length--; } while ((length > 0) && ((ch = read()) != -1));

      return offset - off;
    }
  }

  public boolean ready()
    throws IOException
  {
    synchronized (this.lock)
    {
      return (this.pos < this.internalBuffer.length) || (this.internalReader.ready());
    }
  }

  public void close()
    throws IOException
  {
    synchronized (this.lock)
    {
      if (this.internalReader == null)
      {
        return;
      }

      while ((!this.eof) && 
        (read() != -1));
      this.eof = true;
      this.atBeginning = false;
      this.pos = this.internalBuffer.length;
      this.internalReader = null;
    }
  }
}