package org.eredlab.g4.ccl.net.telnet;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InterruptedIOException;

final class TelnetInputStream extends BufferedInputStream
  implements Runnable
{
  static final int _STATE_DATA = 0;
  static final int _STATE_IAC = 1;
  static final int _STATE_WILL = 2;
  static final int _STATE_WONT = 3;
  static final int _STATE_DO = 4;
  static final int _STATE_DONT = 5;
  static final int _STATE_SB = 6;
  static final int _STATE_SE = 7;
  static final int _STATE_CR = 8;
  static final int _STATE_IAC_SB = 9;
  private boolean __hasReachedEOF;
  private boolean __isClosed;
  private boolean __readIsWaiting;
  private int __receiveState;
  private int __queueHead;
  private int __queueTail;
  private int __bytesAvailable;
  private int[] __queue;
  private TelnetClient __client;
  private Thread __thread;
  private IOException __ioException;
  private int[] __suboption = new int[256];
  private int __suboption_count = 0;
  private boolean __threaded;

  TelnetInputStream(InputStream input, TelnetClient client, boolean readerThread)
  {
    super(input);
    this.__client = client;
    this.__receiveState = 0;
    this.__isClosed = true;
    this.__hasReachedEOF = false;

    this.__queue = new int[2049];
    this.__queueHead = 0;
    this.__queueTail = 0;
    this.__bytesAvailable = 0;
    this.__ioException = null;
    this.__readIsWaiting = false;
    this.__threaded = false;
    if (readerThread)
      this.__thread = new Thread(this);
    else
      this.__thread = null;
  }

  TelnetInputStream(InputStream input, TelnetClient client) {
    this(input, client, true);
  }

  void _start()
  {
    if (this.__thread == null) {
      return;
    }

    this.__isClosed = false;

    int priority = Thread.currentThread().getPriority() + 1;
    if (priority > 10)
      priority = 10;
    this.__thread.setPriority(priority);
    this.__thread.setDaemon(true);
    this.__thread.start();
    this.__threaded = true;
  }

  private int __read()
    throws IOException
  {
    int ch;
    while (true)
    {
      if ((ch = super.read()) < 0) {
        return -1;
      }
      ch &= 255;

      synchronized (this.__client)
      {
        this.__client._processAYTResponse();
      }

      this.__client._spyRead(ch);

      switch (this.__receiveState)
      {
      case 8:
        if (ch == 0);
        break;
      case 0:
        if (ch == 255)
        {
          this.__receiveState = 1;
        }
        else
        {
          if (ch == 13)
          {
            synchronized (this.__client)
            {
              if (this.__client._requestedDont(TelnetOption.BINARY))
                this.__receiveState = 8;
              else {
                this.__receiveState = 0;
              }
            }
          }
          this.__receiveState = 0;
        }break;
      case 1:
        switch (ch)
        {
        case 251:
          this.__receiveState = 2;
          break;
        case 252:
          this.__receiveState = 3;
          break;
        case 253:
          this.__receiveState = 4;
          break;
        case 254:
          this.__receiveState = 5;
          break;
        case 250:
          this.__suboption_count = 0;
          this.__receiveState = 6;
          break;
        case 255:
          this.__receiveState = 0;
          break;
        }

        this.__receiveState = 0;
        break;
      case 2:
        synchronized (this.__client)
        {
          this.__client._processWill(ch);
          this.__client._flushOutputStream();
        }
        this.__receiveState = 0;
        break;
      case 3:
        synchronized (this.__client)
        {
          this.__client._processWont(ch);
          this.__client._flushOutputStream();
        }
        this.__receiveState = 0;
        break;
      case 4:
        synchronized (this.__client)
        {
          this.__client._processDo(ch);
          this.__client._flushOutputStream();
        }
        this.__receiveState = 0;
        break;
      case 5:
        synchronized (this.__client)
        {
          this.__client._processDont(ch);
          this.__client._flushOutputStream();
        }
        this.__receiveState = 0;
        break;
      case 6:
        switch (ch)
        {
        case 255:
          this.__receiveState = 9;
          break;
        }

        this.__suboption[(this.__suboption_count++)] = ch;

        this.__receiveState = 6;
        break;
      case 9:
        switch (ch)
        {
        case 240:
          synchronized (this.__client)
          {
            this.__client._processSuboption(this.__suboption, this.__suboption_count);
            this.__client._flushOutputStream();
          }
          this.__receiveState = 0;
          break;
        }
        this.__receiveState = 6;

        this.__receiveState = 0;
      case 7:
      }

    }
  }

  private void __processChar(int ch)
    throws InterruptedException
  {
    synchronized (this.__queue)
    {
      while (this.__bytesAvailable >= this.__queue.length - 1)
      {
        if (this.__threaded)
        {
          this.__queue.notify();
          try
          {
            this.__queue.wait();
          }
          catch (InterruptedException e)
          {
            throw e;
          }
        }

      }

      if ((this.__readIsWaiting) && (this.__threaded))
      {
        this.__queue.notify();
      }

      this.__queue[this.__queueTail] = ch;
      this.__bytesAvailable += 1;

      if (++this.__queueTail >= this.__queue.length)
        this.__queueTail = 0;
    }
  }

  public int read()
    throws IOException
  {
    synchronized (this.__queue)
    {
      while (true)
      {
        if (this.__ioException != null)
        {
          IOException e = this.__ioException;
          this.__ioException = null;
          throw e;
        }

        if (this.__bytesAvailable != 0) {
          break;
        }
        if (this.__hasReachedEOF) {
          return -1;
        }

        if (this.__threaded)
        {
          this.__queue.notify();
          try
          {
            this.__readIsWaiting = true;
            this.__queue.wait();
            this.__readIsWaiting = false;
          }
          catch (InterruptedException e)
          {
            throw new IOException("Fatal thread interruption during read.");
          }

        }
        else
        {
          this.__readIsWaiting = true;
          do
          {
            try
            {
              int ch;
              if (((ch = __read()) < 0) && 
                (ch != -2))
                return ch;
            }
            catch (InterruptedIOException e)
            {
              synchronized (this.__queue)
              {
                this.__ioException = e;
                this.__queue.notifyAll();
                try
                {
                  this.__queue.wait(100L);
                }
                catch (InterruptedException localInterruptedException1)
                {
                }
              }
              return -1;
            }
            try
            {
              int ch = 0;
              if (ch != -2)
              {
                __processChar(ch);
              }
            }
            catch (InterruptedException e)
            {
              if (this.__isClosed)
                return -1;
            }
          }
          while (super.available() > 0);

          this.__readIsWaiting = false;
        }

      }

      int ch = this.__queue[this.__queueHead];

      if (++this.__queueHead >= this.__queue.length) {
        this.__queueHead = 0;
      }
      this.__bytesAvailable -= 1;

      if ((this.__bytesAvailable == 0) && (this.__threaded)) {
        this.__queue.notify();
      }

      return ch;
    }
  }

  public int read(byte[] buffer)
    throws IOException
  {
    return read(buffer, 0, buffer.length);
  }

  public int read(byte[] buffer, int offset, int length)
    throws IOException
  {
    if (length < 1) {
      return 0;
    }

    synchronized (this.__queue)
    {
      if (length > this.__bytesAvailable)
        length = this.__bytesAvailable;
    }
    int ch;
    if ((ch = read()) == -1) {
      return -1;
    }
    int off = offset;
    do
    {
      buffer[(offset++)] = ((byte)ch);

      length--; } while ((length > 0) && ((ch = read()) != -1));

    return offset - off;
  }

  public boolean markSupported()
  {
    return false;
  }

  public int available()
    throws IOException
  {
    synchronized (this.__queue)
    {
      return this.__bytesAvailable;
    }
  }

  public void close()
    throws IOException
  {
    super.close();

    synchronized (this.__queue)
    {
      this.__hasReachedEOF = true;
      this.__isClosed = true;

      if ((this.__thread != null) && (this.__thread.isAlive()))
      {
        this.__thread.interrupt();
      }

      this.__queue.notifyAll();
    }

    this.__threaded = false;
  }

  public void run()
  {
    try
    {
      while (!this.__isClosed)
      {
        try
        {
          int ch;
          if ((ch = __read()) >= 0);
        }
        catch (InterruptedIOException e) {
          synchronized (this.__queue)
          {
            this.__ioException = e;
            this.__queue.notifyAll();
            try
            {
              this.__queue.wait(100L);
            }
            catch (InterruptedException interrupted)
            {
              if (this.__isClosed) {
                break;
              }
            }
          }

        }
        catch (RuntimeException re)
        {
          super.close();
        }
        try
        {
          int ch = 0;
          __processChar(ch);
        }
        catch (InterruptedException e)
        {
          if (!this.__isClosed) continue; 
        }break;
      }

    }
    catch (IOException ioe)
    {
      synchronized (this.__queue)
      {
        this.__ioException = ioe;
      }
    }

    synchronized (this.__queue)
    {
      this.__isClosed = true;
      this.__hasReachedEOF = true;
      this.__queue.notify();
    }

    this.__threaded = false;
  }
}