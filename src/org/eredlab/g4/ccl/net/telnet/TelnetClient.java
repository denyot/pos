package org.eredlab.g4.ccl.net.telnet;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import org.eredlab.g4.ccl.net.io.FromNetASCIIInputStream;
import org.eredlab.g4.ccl.net.io.ToNetASCIIOutputStream;

public class TelnetClient extends Telnet
{
  private InputStream __input;
  private OutputStream __output;
  protected boolean readerThread = true;

  public TelnetClient()
  {
    super("VT100");

    this.__input = null;
    this.__output = null;
  }

  public TelnetClient(String termtype)
  {
    super(termtype);
    this.__input = null;
    this.__output = null;
  }

  void _flushOutputStream()
    throws IOException
  {
    this._output_.flush();
  }

  void _closeOutputStream() throws IOException {
    this._output_.close();
  }

  protected void _connectAction_()
    throws IOException
  {
    super._connectAction_();
    InputStream input;
    //InputStream input;
    if (FromNetASCIIInputStream.isConversionRequired())
      input = new FromNetASCIIInputStream(this._input_);
    else {
      input = this._input_;
    }

    TelnetInputStream tmp = new TelnetInputStream(input, this, this.readerThread);
    if (this.readerThread)
    {
      tmp._start();
    }

    this.__input = new BufferedInputStream(tmp);
    this.__output = new ToNetASCIIOutputStream(new TelnetOutputStream(this));
  }

  public void disconnect()
    throws IOException
  {
    this.__input.close();
    this.__output.close();
    super.disconnect();
  }

  public OutputStream getOutputStream()
  {
    return this.__output;
  }

  public InputStream getInputStream()
  {
    return this.__input;
  }

  public boolean getLocalOptionState(int option)
  {
    return (_stateIsWill(option)) && (_requestedWill(option));
  }

  public boolean getRemoteOptionState(int option)
  {
    return (_stateIsDo(option)) && (_requestedDo(option));
  }

  public boolean sendAYT(long timeout)
    throws IOException, IllegalArgumentException, InterruptedException
  {
    return _sendAYT(timeout);
  }

  public void addOptionHandler(TelnetOptionHandler opthand)
    throws InvalidTelnetOptionException
  {
    super.addOptionHandler(opthand);
  }

  public void deleteOptionHandler(int optcode)
    throws InvalidTelnetOptionException
  {
    super.deleteOptionHandler(optcode);
  }

  public void registerSpyStream(OutputStream spystream)
  {
    super._registerSpyStream(spystream);
  }

  public void stopSpyStream()
  {
    super._stopSpyStream();
  }

  public void registerNotifHandler(TelnetNotificationHandler notifhand)
  {
    super.registerNotifHandler(notifhand);
  }

  public void unregisterNotifHandler()
  {
    super.unregisterNotifHandler();
  }

  public void setReaderThread(boolean flag)
  {
    this.readerThread = flag;
  }

  public boolean getReaderThread()
  {
    return this.readerThread;
  }
}