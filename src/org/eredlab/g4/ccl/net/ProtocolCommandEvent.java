package org.eredlab.g4.ccl.net;

import java.util.EventObject;

public class ProtocolCommandEvent extends EventObject
{
  private int __replyCode;
  private boolean __isCommand;
  private String __message;
  private String __command;

  public ProtocolCommandEvent(Object source, String command, String message)
  {
    super(source);
    this.__replyCode = 0;
    this.__message = message;
    this.__isCommand = true;
    this.__command = command;
  }

  public ProtocolCommandEvent(Object source, int replyCode, String message)
  {
    super(source);
    this.__replyCode = replyCode;
    this.__message = message;
    this.__isCommand = false;
    this.__command = null;
  }

  public String getCommand()
  {
    return this.__command;
  }

  public int getReplyCode()
  {
    return this.__replyCode;
  }

  public boolean isCommand()
  {
    return this.__isCommand;
  }

  public boolean isReply()
  {
    return !isCommand();
  }

  public String getMessage()
  {
    return this.__message;
  }
}