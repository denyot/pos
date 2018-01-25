package org.eredlab.g4.ccl.net.pop3;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.EOFException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Enumeration;
import java.util.Vector;
import org.eredlab.g4.ccl.net.MalformedServerReplyException;
import org.eredlab.g4.ccl.net.ProtocolCommandListener;
import org.eredlab.g4.ccl.net.ProtocolCommandSupport;
import org.eredlab.g4.ccl.net.SocketClient;

public class POP3 extends SocketClient
{
  public static final int DEFAULT_PORT = 110;
  public static final int DISCONNECTED_STATE = -1;
  public static final int AUTHORIZATION_STATE = 0;
  public static final int TRANSACTION_STATE = 1;
  public static final int UPDATE_STATE = 2;
  static final String _OK = "+OK";
  static final String _ERROR = "-ERR";
  private static final String __DEFAULT_ENCODING = "ISO-8859-1";
  private int __popState;
  private BufferedWriter __writer;
  private StringBuffer __commandBuffer;
  BufferedReader _reader;
  int _replyCode;
  String _lastReplyLine;
  Vector _replyLines;
  protected ProtocolCommandSupport _commandSupport_;

  public POP3()
  {
    setDefaultPort(110);
    this.__commandBuffer = new StringBuffer();
    this.__popState = -1;
    this._reader = null;
    this.__writer = null;
    this._replyLines = new Vector();
    this._commandSupport_ = new ProtocolCommandSupport(this);
  }

  private void __getReply()
    throws IOException
  {
    this._replyLines.setSize(0);
    String line = this._reader.readLine();

    if (line == null) {
      throw new EOFException("Connection closed without indication.");
    }
    if (line.startsWith("+OK"))
      this._replyCode = POP3Reply.OK;
    else if (line.startsWith("-ERR"))
      this._replyCode = POP3Reply.ERROR;
    else {
      throw 
        new MalformedServerReplyException(
        "Received invalid POP3 protocol response from server.");
    }
    this._replyLines.addElement(line);
    this._lastReplyLine = line;

    if (this._commandSupport_.getListenerCount() > 0)
      this._commandSupport_.fireReplyReceived(this._replyCode, getReplyString());
  }

  protected void _connectAction_()
    throws IOException
  {
    super._connectAction_();
    this._reader = 
      new BufferedReader(new InputStreamReader(this._input_, 
      "ISO-8859-1"));
    this.__writer = 
      new BufferedWriter(new OutputStreamWriter(this._output_, 
      "ISO-8859-1"));
    __getReply();
    setState(0);
  }

  public void addProtocolCommandListener(ProtocolCommandListener listener)
  {
    this._commandSupport_.addProtocolCommandListener(listener);
  }

  public void removeProtocolCommandistener(ProtocolCommandListener listener)
  {
    this._commandSupport_.removeProtocolCommandListener(listener);
  }

  public void setState(int state)
  {
    this.__popState = state;
  }

  public int getState()
  {
    return this.__popState;
  }

  public void getAdditionalReply()
    throws IOException
  {
    String line = this._reader.readLine();
    while (line != null)
    {
      this._replyLines.addElement(line);
      if (line.equals("."))
        break;
      line = this._reader.readLine();
    }
  }

  public void disconnect()
    throws IOException
  {
    super.disconnect();
    this._reader = null;
    this.__writer = null;
    this._lastReplyLine = null;
    this._replyLines.setSize(0);
    setState(-1);
  }

  public int sendCommand(String command, String args)
    throws IOException
  {
    this.__commandBuffer.setLength(0);
    this.__commandBuffer.append(command);

    if (args != null)
    {
      this.__commandBuffer.append(' ');
      this.__commandBuffer.append(args);
    }
    this.__commandBuffer.append("\r\n");
    String message;
    this.__writer.write(message = this.__commandBuffer.toString());
    this.__writer.flush();

    if (this._commandSupport_.getListenerCount() > 0) {
      this._commandSupport_.fireCommandSent(command, message);
    }
    __getReply();
    return this._replyCode;
  }

  public int sendCommand(String command)
    throws IOException
  {
    return sendCommand(command, null);
  }

  public int sendCommand(int command, String args)
    throws IOException
  {
    return sendCommand(POP3Command._commands[command], args);
  }

  public int sendCommand(int command)
    throws IOException
  {
    return sendCommand(POP3Command._commands[command], null);
  }

  public String[] getReplyStrings()
  {
    String[] lines = new String[this._replyLines.size()];
    this._replyLines.copyInto(lines);
    return lines;
  }

  public String getReplyString()
  {
    StringBuffer buffer = new StringBuffer(256);

    Enumeration en = this._replyLines.elements();
    while (en.hasMoreElements())
    {
      buffer.append((String)en.nextElement());
      buffer.append("\r\n");
    }

    return buffer.toString();
  }
}