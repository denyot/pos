package org.eredlab.g4.ccl.net.ftp.parser;

public class ParserInitializationException extends RuntimeException
{
  private final Throwable rootCause;

  public ParserInitializationException(String message)
  {
    super(message);
    this.rootCause = null;
  }

  public ParserInitializationException(String message, Throwable rootCause)
  {
    super(message);
    this.rootCause = rootCause;
  }

  public Throwable getRootCause()
  {
    return this.rootCause;
  }
}