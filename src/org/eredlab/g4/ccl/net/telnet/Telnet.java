package org.eredlab.g4.ccl.net.telnet;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import org.eredlab.g4.ccl.net.SocketClient;

class Telnet extends SocketClient
{
  static final boolean debug = false;
  static final boolean debugoptions = false;
  static final byte[] _COMMAND_DO = { 
    -1, -3 };

  static final byte[] _COMMAND_DONT = { 
    -1, -2 };

  static final byte[] _COMMAND_WILL = { 
    -1, -5 };

  static final byte[] _COMMAND_WONT = { 
    -1, -4 };

  static final byte[] _COMMAND_SB = { 
    -1, -6 };

  static final byte[] _COMMAND_SE = { 
    -1, -16 };
  static final int _WILL_MASK = 1;
  static final int _DO_MASK = 2;
  static final int _REQUESTED_WILL_MASK = 4;
  static final int _REQUESTED_DO_MASK = 8;
  static final int DEFAULT_PORT = 23;
  int[] _doResponse;
  int[] _willResponse;
  int[] _options;
  protected static final int TERMINAL_TYPE = 24;
  protected static final int TERMINAL_TYPE_SEND = 1;
  protected static final int TERMINAL_TYPE_IS = 0;
  static final byte[] _COMMAND_IS = { 
    24 };

  private String terminalType = null;
  private TelnetOptionHandler[] optionHandlers;
  static final byte[] _COMMAND_AYT = { 
    -1, -10 };

  private Object aytMonitor = new Object();

  private boolean aytFlag = true;

  private OutputStream spyStream = null;

  private TelnetNotificationHandler __notifhand = null;

  Telnet()
  {
    setDefaultPort(23);
    this._doResponse = new int[256];
    this._willResponse = new int[256];
    this._options = new int[256];
    this.optionHandlers = 
      new TelnetOptionHandler[256];
  }

  Telnet(String termtype)
  {
    setDefaultPort(23);
    this._doResponse = new int[256];
    this._willResponse = new int[256];
    this._options = new int[256];
    this.terminalType = termtype;
    this.optionHandlers = 
      new TelnetOptionHandler[256];
  }

  boolean _stateIsWill(int option)
  {
    return (this._options[option] & 0x1) != 0;
  }

  boolean _stateIsWont(int option)
  {
    return !_stateIsWill(option);
  }

  boolean _stateIsDo(int option)
  {
    return (this._options[option] & 0x2) != 0;
  }

  boolean _stateIsDont(int option)
  {
    return !_stateIsDo(option);
  }

  boolean _requestedWill(int option)
  {
    return (this._options[option] & 0x4) != 0;
  }

  boolean _requestedWont(int option)
  {
    return !_requestedWill(option);
  }

  boolean _requestedDo(int option)
  {
    return (this._options[option] & 0x8) != 0;
  }

  boolean _requestedDont(int option)
  {
    return !_requestedDo(option);
  }

  void _setWill(int option)
  {
    this._options[option] |= 1;

    if (_requestedWill(option))
    {
      if (this.optionHandlers[option] != null)
      {
        this.optionHandlers[option].setWill(true);

        int[] subneg = 
          this.optionHandlers[option].startSubnegotiationLocal();

        if (subneg != null)
        {
          try
          {
            _sendSubnegotiation(subneg);
          }
          catch (Exception e)
          {
            System.err.println(
              "Exception in option subnegotiation" + 
              e.getMessage());
          }
        }
      }
    }
  }

  void _setDo(int option)
  {
    this._options[option] |= 2;

    if (_requestedDo(option))
    {
      if (this.optionHandlers[option] != null)
      {
        this.optionHandlers[option].setDo(true);

        int[] subneg = 
          this.optionHandlers[option].startSubnegotiationRemote();

        if (subneg != null)
        {
          try
          {
            _sendSubnegotiation(subneg);
          }
          catch (Exception e)
          {
            System.err.println("Exception in option subnegotiation" + 
              e.getMessage());
          }
        }
      }
    }
  }

  void _setWantWill(int option)
  {
    this._options[option] |= 4;
  }

  void _setWantDo(int option)
  {
    this._options[option] |= 8;
  }

  void _setWont(int option)
  {
    this._options[option] &= -2;

    if (this.optionHandlers[option] != null)
    {
      this.optionHandlers[option].setWill(false);
    }
  }

  void _setDont(int option)
  {
    this._options[option] &= -3;

    if (this.optionHandlers[option] != null)
    {
      this.optionHandlers[option].setDo(false);
    }
  }

  void _setWantWont(int option)
  {
    this._options[option] &= -5;
  }

  void _setWantDont(int option)
  {
    this._options[option] &= -9;
  }

  void _processDo(int option)
    throws IOException
  {
    if (this.__notifhand != null)
    {
      this.__notifhand.receivedNegotiation(
        1, 
        option);
    }

    boolean acceptNewState = false;

    if (this.optionHandlers[option] != null)
    {
      acceptNewState = this.optionHandlers[option].getAcceptLocal();
    }
    else if (option == 24)
    {
      if ((this.terminalType != null) && (this.terminalType.length() > 0))
      {
        acceptNewState = true;
      }

    }

    if (this._willResponse[option] > 0)
    {
      this._willResponse[option] -= 1;
      if ((this._willResponse[option] > 0) && (_stateIsWill(option)))
      {
        this._willResponse[option] -= 1;
      }
    }

    if (this._willResponse[option] == 0)
    {
      if (_requestedWont(option))
      {
        if (acceptNewState)
        {
          _setWantWill(option);
          _sendWill(option);
        }
        else
        {
          this._willResponse[option] += 1;
          _sendWont(option);
        }

      }

    }

    _setWill(option);
  }

  void _processDont(int option)
    throws IOException
  {
    if (this.__notifhand != null)
    {
      this.__notifhand.receivedNegotiation(
        2, 
        option);
    }
    if (this._willResponse[option] > 0)
    {
      this._willResponse[option] -= 1;
      if ((this._willResponse[option] > 0) && (_stateIsWont(option)))
      {
        this._willResponse[option] -= 1;
      }
    }

    if ((this._willResponse[option] == 0) && (_requestedWill(option)))
    {
      if ((_stateIsWill(option)) || (_requestedWill(option)))
      {
        _sendWont(option);
      }

      _setWantWont(option);
    }

    _setWont(option);
  }

  void _processWill(int option)
    throws IOException
  {
    if (this.__notifhand != null)
    {
      this.__notifhand.receivedNegotiation(
        3, 
        option);
    }

    boolean acceptNewState = false;

    if (this.optionHandlers[option] != null)
    {
      acceptNewState = this.optionHandlers[option].getAcceptRemote();
    }

    if (this._doResponse[option] > 0)
    {
      this._doResponse[option] -= 1;
      if ((this._doResponse[option] > 0) && (_stateIsDo(option)))
      {
        this._doResponse[option] -= 1;
      }
    }

    if ((this._doResponse[option] == 0) && (_requestedDont(option)))
    {
      if (acceptNewState)
      {
        _setWantDo(option);
        _sendDo(option);
      }
      else
      {
        this._doResponse[option] += 1;
        _sendDont(option);
      }
    }

    _setDo(option);
  }

  void _processWont(int option)
    throws IOException
  {
    if (this.__notifhand != null)
    {
      this.__notifhand.receivedNegotiation(
        4, 
        option);
    }

    if (this._doResponse[option] > 0)
    {
      this._doResponse[option] -= 1;
      if ((this._doResponse[option] > 0) && (_stateIsDont(option)))
      {
        this._doResponse[option] -= 1;
      }
    }

    if ((this._doResponse[option] == 0) && (_requestedDo(option)))
    {
      if ((_stateIsDo(option)) || (_requestedDo(option)))
      {
        _sendDont(option);
      }

      _setWantDont(option);
    }

    _setDont(option);
  }

  void _processSuboption(int[] suboption, int suboptionLength)
    throws IOException
  {
    if (suboptionLength > 0)
    {
      if (this.optionHandlers[suboption[0]] != null)
      {
        int[] responseSuboption = 
          this.optionHandlers[suboption[0]].answerSubnegotiation(suboption, 
          suboptionLength);
        _sendSubnegotiation(responseSuboption);
      }
      else if (suboptionLength > 1)
      {
        if ((suboption[0] == 24) && 
          (suboption[1] == 1))
        {
          _sendTerminalType();
        }
      }
    }
  }

  final synchronized void _sendTerminalType()
    throws IOException
  {
    if (this.terminalType != null)
    {
      this._output_.write(_COMMAND_SB);
      this._output_.write(_COMMAND_IS);
      this._output_.write(this.terminalType.getBytes());
      this._output_.write(_COMMAND_SE);
      this._output_.flush();
    }
  }

  final synchronized void _sendSubnegotiation(int[] subn)
    throws IOException
  {
    if (subn != null)
    {
      byte[] byteresp = new byte[subn.length];
      for (int ii = 0; ii < subn.length; ii++)
      {
        byteresp[ii] = ((byte)subn[ii]);
      }

      this._output_.write(_COMMAND_SB);
      this._output_.write(byteresp);
      this._output_.write(_COMMAND_SE);

      this._output_.flush();
    }
  }

  final synchronized void _processAYTResponse()
  {
    if (!this.aytFlag)
    {
      synchronized (this.aytMonitor)
      {
        this.aytFlag = true;
        try
        {
          this.aytMonitor.notifyAll();
        }
        catch (Exception e)
        {
          System.err.println("Exception notifying:" + e.getMessage());
        }
      }
    }
  }

  protected void _connectAction_()
    throws IOException
  {
    for (int ii = 0; ii < 256; ii++)
    {
      this._doResponse[ii] = 0;
      this._willResponse[ii] = 0;
      this._options[ii] = 0;
      if (this.optionHandlers[ii] != null)
      {
        this.optionHandlers[ii].setDo(false);
        this.optionHandlers[ii].setWill(false);
      }

    }

    super._connectAction_();
    this._input_ = new BufferedInputStream(this._input_);
    this._output_ = new BufferedOutputStream(this._output_);

    for (int ii = 0; ii < 256; ii++)
    {
      if (this.optionHandlers[ii] != null)
      {
        if (this.optionHandlers[ii].getInitLocal())
        {
          try
          {
            _requestWill(this.optionHandlers[ii].getOptionCode());
          }
          catch (IOException e)
          {
            System.err.println(
              "Exception while initializing option: " + 
              e.getMessage());
          }
        }

        if (this.optionHandlers[ii].getInitRemote())
        {
          try
          {
            _requestDo(this.optionHandlers[ii].getOptionCode());
          }
          catch (IOException e)
          {
            System.err.println(
              "Exception while initializing option: " + 
              e.getMessage());
          }
        }
      }
    }
  }

  final synchronized void _sendDo(int option)
    throws IOException
  {
    this._output_.write(_COMMAND_DO);
    this._output_.write(option);

    this._output_.flush();
  }

  final synchronized void _requestDo(int option)
    throws IOException
  {
    if (((this._doResponse[option] == 0) && (_stateIsDo(option))) || 
      (_requestedDo(option)))
    {
      return;
    }
    _setWantDo(option);
    this._doResponse[option] += 1;
    _sendDo(option);
  }

  final synchronized void _sendDont(int option)
    throws IOException
  {
    this._output_.write(_COMMAND_DONT);
    this._output_.write(option);

    this._output_.flush();
  }

  final synchronized void _requestDont(int option)
    throws IOException
  {
    if (((this._doResponse[option] == 0) && (_stateIsDont(option))) || 
      (_requestedDont(option)))
    {
      return;
    }
    _setWantDont(option);
    this._doResponse[option] += 1;
    _sendDont(option);
  }

  final synchronized void _sendWill(int option)
    throws IOException
  {
    this._output_.write(_COMMAND_WILL);
    this._output_.write(option);

    this._output_.flush();
  }

  final synchronized void _requestWill(int option)
    throws IOException
  {
    if (((this._willResponse[option] == 0) && (_stateIsWill(option))) || 
      (_requestedWill(option)))
    {
      return;
    }
    _setWantWill(option);
    this._doResponse[option] += 1;
    _sendWill(option);
  }

  final synchronized void _sendWont(int option)
    throws IOException
  {
    this._output_.write(_COMMAND_WONT);
    this._output_.write(option);

    this._output_.flush();
  }

  final synchronized void _requestWont(int option)
    throws IOException
  {
    if (((this._willResponse[option] == 0) && (_stateIsWont(option))) || 
      (_requestedWont(option)))
    {
      return;
    }
    _setWantWont(option);
    this._doResponse[option] += 1;
    _sendWont(option);
  }

  final synchronized void _sendByte(int b)
    throws IOException
  {
    this._output_.write(b);

    _spyWrite(b);
  }

  final boolean _sendAYT(long timeout)
    throws IOException, IllegalArgumentException, InterruptedException
  {
    boolean retValue = false;
    synchronized (this.aytMonitor)
    {
      synchronized (this)
      {
        this.aytFlag = false;
        this._output_.write(_COMMAND_AYT);
        this._output_.flush();
      }

      try
      {
        this.aytMonitor.wait(timeout);
        if (!this.aytFlag)
        {
          retValue = false;
          this.aytFlag = true;
        }
        else
        {
          retValue = true;
        }
      }
      catch (IllegalMonitorStateException e)
      {
        System.err.println("Exception processing AYT:" + 
          e.getMessage());
      }
    }

    return retValue;
  }

  void addOptionHandler(TelnetOptionHandler opthand)
    throws InvalidTelnetOptionException
  {
    int optcode = opthand.getOptionCode();
    if (TelnetOption.isValidOption(optcode))
    {
      if (this.optionHandlers[optcode] == null)
      {
        this.optionHandlers[optcode] = opthand;
        if (isConnected())
        {
          if (opthand.getInitLocal())
          {
            try
            {
              _requestWill(optcode);
            }
            catch (IOException e)
            {
              System.err.println(
                "Exception while initializing option: " + 
                e.getMessage());
            }
          }

          if (opthand.getInitRemote())
          {
            try
            {
              _requestDo(optcode);
            }
            catch (IOException e)
            {
              System.err.println(
                "Exception while initializing option: " + 
                e.getMessage());
            }
          }
        }
      }
      else
      {
        throw new InvalidTelnetOptionException(
          "Already registered option", optcode);
      }
    }
    else
    {
      throw new InvalidTelnetOptionException(
        "Invalid Option Code", optcode);
    }
  }

  void deleteOptionHandler(int optcode)
    throws InvalidTelnetOptionException
  {
    if (TelnetOption.isValidOption(optcode))
    {
      if (this.optionHandlers[optcode] == null)
      {
        throw new InvalidTelnetOptionException(
          "Unregistered option", optcode);
      }

      TelnetOptionHandler opthand = this.optionHandlers[optcode];
      this.optionHandlers[optcode] = null;

      if (opthand.getWill())
      {
        try
        {
          _requestWont(optcode);
        }
        catch (IOException e)
        {
          System.err.println(
            "Exception while turning off option: " + 
            e.getMessage());
        }
      }

      if (opthand.getDo())
      {
        try
        {
          _requestDont(optcode);
        }
        catch (IOException e)
        {
          System.err.println(
            "Exception while turning off option: " + 
            e.getMessage());
        }
      }

    }
    else
    {
      throw new InvalidTelnetOptionException(
        "Invalid Option Code", optcode);
    }
  }

  void _registerSpyStream(OutputStream spystream)
  {
    this.spyStream = spystream;
  }

  void _stopSpyStream()
  {
    this.spyStream = null;
  }

  void _spyRead(int ch)
  {
    if (this.spyStream != null)
    {
      try
      {
        if (ch != 13)
        {
          this.spyStream.write(ch);
          if (ch == 10)
          {
            this.spyStream.write(13);
          }
          this.spyStream.flush();
        }
      }
      catch (Exception e)
      {
        this.spyStream = null;
      }
    }
  }

  void _spyWrite(int ch)
  {
    if ((!_stateIsDo(TelnetOption.ECHO)) || 
      (!_requestedDo(TelnetOption.ECHO)))
    {
      if (this.spyStream != null)
      {
        try
        {
          this.spyStream.write(ch);
          this.spyStream.flush();
        }
        catch (Exception e)
        {
          this.spyStream = null;
        }
      }
    }
  }

  public void registerNotifHandler(TelnetNotificationHandler notifhand)
  {
    this.__notifhand = notifhand;
  }

  public void unregisterNotifHandler()
  {
    this.__notifhand = null;
  }
}