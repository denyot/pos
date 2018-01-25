package org.eredlab.g4.ccl.net.smtp;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Enumeration;
import java.util.Vector;
import org.eredlab.g4.ccl.net.MalformedServerReplyException;
import org.eredlab.g4.ccl.net.ProtocolCommandListener;
import org.eredlab.g4.ccl.net.ProtocolCommandSupport;
import org.eredlab.g4.ccl.net.SocketClient;

public class SMTP extends SocketClient
{
  public static final int DEFAULT_PORT = 25;
  private static final String __DEFAULT_ENCODING = "ISO-8859-1";
  private StringBuffer __commandBuffer;
  BufferedReader _reader;
  BufferedWriter _writer;
  int _replyCode;
  Vector _replyLines;
  boolean _newReplyString;
  String _replyString;
  protected ProtocolCommandSupport _commandSupport_;

  public SMTP()
  {
    setDefaultPort(25);
    this.__commandBuffer = new StringBuffer();
    this._replyLines = new Vector();
    this._newReplyString = false;
    this._replyString = null;
    this._commandSupport_ = new ProtocolCommandSupport(this);
  }

  private int __sendCommand(String command, String args, boolean includeSpace)
    throws IOException
  {
    this.__commandBuffer.setLength(0);
    this.__commandBuffer.append(command);

    if (args != null)
    {
      if (includeSpace)
        this.__commandBuffer.append(' ');
      this.__commandBuffer.append(args);
    }

    this.__commandBuffer.append("\r\n");
    String message;
    this._writer.write(message = this.__commandBuffer.toString());
    this._writer.flush();

    if (this._commandSupport_.getListenerCount() > 0) {
      this._commandSupport_.fireCommandSent(command, message);
    }
    __getReply();
    return this._replyCode;
  }

  private int __sendCommand(int command, String args, boolean includeSpace)
    throws IOException
  {
    return __sendCommand(SMTPCommand._commands[command], args, includeSpace);
  }

  private void __getReply()
    throws IOException
  {
    this._newReplyString = true;
    this._replyLines.setSize(0);

    String line = this._reader.readLine();

    if (line == null) {
      throw new SMTPConnectionClosedException(
        "Connection closed without indication.");
    }

    int length = line.length();
    if (length < 3) {
      throw new MalformedServerReplyException(
        "Truncated server reply: " + line);
    }
    try
    {
      String code = line.substring(0, 3);
      this._replyCode = Integer.parseInt(code);
    }
    catch (NumberFormatException e)
    {
      throw new MalformedServerReplyException(
        "Could not parse response code.\nServer Reply: " + line);
    }

    this._replyLines.addElement(line);

    if ((length > 3) && (line.charAt(3) == '-'))
    {
      do
      {
        line = this._reader.readLine();

        if (line == null) {
          throw new SMTPConnectionClosedException(
            "Connection closed without indication.");
        }
        this._replyLines.addElement(line);
      }

      while ((line.length() < 4) || (line.charAt(3) == '-') || (!
        Character.isDigit(line.charAt(0))));
    }

    if (this._commandSupport_.getListenerCount() > 0) {
      this._commandSupport_.fireReplyReceived(this._replyCode, getReplyString());
    }
    if (this._replyCode == 421)
      throw new SMTPConnectionClosedException(
        "SMTP response 421 received.  Server closed connection.");
  }

  protected void _connectAction_()
    throws IOException
  {
    super._connectAction_();
    this._reader = 
      new BufferedReader(new InputStreamReader(this._input_, 
      "ISO-8859-1"));
    this._writer = 
      new BufferedWriter(new OutputStreamWriter(this._output_, 
      "ISO-8859-1"));
    __getReply();
  }

  public void addProtocolCommandListener(ProtocolCommandListener listener)
  {
    this._commandSupport_.addProtocolCommandListener(listener);
  }

  public void removeProtocolCommandistener(ProtocolCommandListener listener)
  {
    this._commandSupport_.removeProtocolCommandListener(listener);
  }

  public void disconnect()
    throws IOException
  {
    super.disconnect();
    this._reader = null;
    this._writer = null;
    this._replyString = null;
    this._replyLines.setSize(0);
    this._newReplyString = false;
  }

  public int sendCommand(String command, String args)
    throws IOException
  {
    return __sendCommand(command, args, true);
  }

  public int sendCommand(int command, String args)
    throws IOException
  {
    return sendCommand(SMTPCommand._commands[command], args);
  }

  public int sendCommand(String command)
    throws IOException
  {
    return sendCommand(command, null);
  }

  public int sendCommand(int command)
    throws IOException
  {
    return sendCommand(command, null);
  }

  public int getReplyCode()
  {
    return this._replyCode;
  }

  public int getReply()
    throws IOException
  {
    __getReply();
    return this._replyCode;
  }

  public String[] getReplyStrings()
  {
    String[] lines = new String[this._replyLines.size()];
    this._replyLines.copyInto(lines);
    return lines;
  }

  public String getReplyString()
  {
    if (!this._newReplyString) {
      return this._replyString;
    }
    StringBuffer buffer = new StringBuffer(256);
    Enumeration en = this._replyLines.elements();
    while (en.hasMoreElements())
    {
      buffer.append((String)en.nextElement());
      buffer.append("\r\n");
    }

    this._newReplyString = false;

    return this._replyString = buffer.toString();
  }

  public int helo(String hostname)
    throws IOException
  {
    return sendCommand(0, hostname);
  }

  public int mail(String reversePath)
    throws IOException
  {
    return __sendCommand(1, reversePath, false);
  }

  public int rcpt(String forwardPath)
    throws IOException
  {
    return __sendCommand(2, forwardPath, false);
  }

  public int data()
    throws IOException
  {
    return sendCommand(3);
  }

  public int send(String reversePath)
    throws IOException
  {
    return sendCommand(4, reversePath);
  }

  public int soml(String reversePath)
    throws IOException
  {
    return sendCommand(5, reversePath);
  }

  public int saml(String reversePath)
    throws IOException
  {
    return sendCommand(6, reversePath);
  }

  public int rset()
    throws IOException
  {
    return sendCommand(7);
  }

  public int vrfy(String user)
    throws IOException
  {
    return sendCommand(8, user);
  }

  public int expn(String name)
    throws IOException
  {
    return sendCommand(9, name);
  }

  public int help()
    throws IOException
  {
    return sendCommand(10);
  }

  public int help(String command)
    throws IOException
  {
    return sendCommand(10, command);
  }

  public int noop()
    throws IOException
  {
    return sendCommand(11);
  }

  public int turn()
    throws IOException
  {
    return sendCommand(12);
  }

  public int quit()
    throws IOException
  {
    return sendCommand(13);
  }
}