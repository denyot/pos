package org.eredlab.g4.ccl.net.telnet;

public class InvalidTelnetOptionException extends Exception
{
  private int optionCode = -1;
  private String msg;

  public InvalidTelnetOptionException(String message, int optcode)
  {
    this.optionCode = optcode;
    this.msg = message;
  }

  public String getMessage()
  {
    return this.msg + ": " + this.optionCode;
  }
}