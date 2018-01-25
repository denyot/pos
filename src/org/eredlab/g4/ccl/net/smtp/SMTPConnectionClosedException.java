package org.eredlab.g4.ccl.net.smtp;

import java.io.IOException;

public final class SMTPConnectionClosedException extends IOException
{
  public SMTPConnectionClosedException()
  {
  }

  public SMTPConnectionClosedException(String message)
  {
    super(message);
  }
}