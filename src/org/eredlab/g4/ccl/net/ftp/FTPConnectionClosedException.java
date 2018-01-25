package org.eredlab.g4.ccl.net.ftp;

import java.io.IOException;

public class FTPConnectionClosedException extends IOException
{
  public FTPConnectionClosedException()
  {
  }

  public FTPConnectionClosedException(String message)
  {
    super(message);
  }
}