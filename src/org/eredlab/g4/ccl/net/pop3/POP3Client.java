package org.eredlab.g4.ccl.net.pop3;

import java.io.IOException;
import java.io.Reader;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Enumeration;
import java.util.StringTokenizer;
import java.util.Vector;
import org.eredlab.g4.ccl.net.io.DotTerminatedMessageReader;

public class POP3Client extends POP3
{
  private static POP3MessageInfo __parseStatus(String line)
  {
    StringTokenizer tokenizer = new StringTokenizer(line);

    if (!tokenizer.hasMoreElements())
      return null;
    int size;
    int num = size = 0;
    try
    {
      num = Integer.parseInt(tokenizer.nextToken());

      if (!tokenizer.hasMoreElements()) {
        return null;
      }
      size = Integer.parseInt(tokenizer.nextToken());
    }
    catch (NumberFormatException e)
    {
      return null;
    }

    return new POP3MessageInfo(num, size);
  }

  private static POP3MessageInfo __parseUID(String line)
  {
    StringTokenizer tokenizer = new StringTokenizer(line);

    if (!tokenizer.hasMoreElements()) {
      return null;
    }
    int num = 0;
    try
    {
      num = Integer.parseInt(tokenizer.nextToken());

      if (!tokenizer.hasMoreElements()) {
        return null;
      }
      line = tokenizer.nextToken();
    }
    catch (NumberFormatException e)
    {
      return null;
    }

    return new POP3MessageInfo(num, line);
  }

  public boolean login(String username, String password)
    throws IOException
  {
    if (getState() != 0) {
      return false;
    }
    if (sendCommand(0, username) != POP3Reply.OK) {
      return false;
    }
    if (sendCommand(1, password) != POP3Reply.OK) {
      return false;
    }
    setState(1);

    return true;
  }

  public boolean login(String username, String timestamp, String secret)
    throws IOException, NoSuchAlgorithmException
  {
    if (getState() != 0) {
      return false;
    }
    MessageDigest md5 = MessageDigest.getInstance("MD5");
    timestamp = timestamp + secret;
    byte[] digest = md5.digest(timestamp.getBytes());
    StringBuffer digestBuffer = new StringBuffer(128);

    for (int i = 0; i < digest.length; i++) {
      digestBuffer.append(Integer.toHexString(digest[i] & 0xFF));
    }
    StringBuffer buffer = new StringBuffer(256);
    buffer.append(username);
    buffer.append(' ');
    buffer.append(digestBuffer.toString());

    if (sendCommand(9, buffer.toString()) != POP3Reply.OK) {
      return false;
    }
    setState(1);

    return true;
  }

  public boolean logout()
    throws IOException
  {
    if (getState() == 1)
      setState(2);
    sendCommand(2);
    return this._replyCode == POP3Reply.OK;
  }

  public boolean noop()
    throws IOException
  {
    if (getState() == 1)
      return sendCommand(7) == POP3Reply.OK;
    return false;
  }

  public boolean deleteMessage(int messageId)
    throws IOException
  {
    if (getState() == 1)
      return sendCommand(6, Integer.toString(messageId)) == 
        POP3Reply.OK;
    return false;
  }

  public boolean reset()
    throws IOException
  {
    if (getState() == 1)
      return sendCommand(8) == POP3Reply.OK;
    return false;
  }

  public POP3MessageInfo status()
    throws IOException
  {
    if (getState() != 1)
      return null;
    if (sendCommand(3) != POP3Reply.OK)
      return null;
    return __parseStatus(this._lastReplyLine.substring(3));
  }

  public POP3MessageInfo listMessage(int messageId)
    throws IOException
  {
    if (getState() != 1)
      return null;
    if (sendCommand(4, Integer.toString(messageId)) != 
      POP3Reply.OK)
      return null;
    return __parseStatus(this._lastReplyLine.substring(3));
  }

  public POP3MessageInfo[] listMessages()
    throws IOException
  {
    if (getState() != 1)
      return null;
    if (sendCommand(4) != POP3Reply.OK)
      return null;
    getAdditionalReply();

    POP3MessageInfo[] messages = new POP3MessageInfo[this._replyLines.size() - 2];
    Enumeration en = this._replyLines.elements();

    en.nextElement();

    for (int line = 0; line < messages.length; line++) {
      messages[line] = __parseStatus((String)en.nextElement());
    }
    return messages;
  }

  public POP3MessageInfo listUniqueIdentifier(int messageId)
    throws IOException
  {
    if (getState() != 1)
      return null;
    if (sendCommand(11, Integer.toString(messageId)) != 
      POP3Reply.OK)
      return null;
    return __parseUID(this._lastReplyLine.substring(3));
  }

  public POP3MessageInfo[] listUniqueIdentifiers()
    throws IOException
  {
    if (getState() != 1)
      return null;
    if (sendCommand(11) != POP3Reply.OK)
      return null;
    getAdditionalReply();

    POP3MessageInfo[] messages = new POP3MessageInfo[this._replyLines.size() - 2];
    Enumeration en = this._replyLines.elements();

    en.nextElement();

    for (int line = 0; line < messages.length; line++) {
      messages[line] = __parseUID((String)en.nextElement());
    }
    return messages;
  }

  public Reader retrieveMessage(int messageId)
    throws IOException
  {
    if (getState() != 1)
      return null;
    if (sendCommand(5, Integer.toString(messageId)) != 
      POP3Reply.OK) {
      return null;
    }
    return new DotTerminatedMessageReader(this._reader);
  }

  public Reader retrieveMessageTop(int messageId, int numLines)
    throws IOException
  {
    if ((numLines < 0) || (getState() != 1))
      return null;
    if (sendCommand(10, Integer.toString(messageId) + " " + 
      Integer.toString(numLines)) != POP3Reply.OK) {
      return null;
    }
    return new DotTerminatedMessageReader(this._reader);
  }
}