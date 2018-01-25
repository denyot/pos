package org.eredlab.g4.ccl.net;

import java.io.IOException;

public class MalformedServerReplyException extends IOException
{
  public MalformedServerReplyException()
  {
  }

  public MalformedServerReplyException(String message)
  {
    super(message);
  }
}