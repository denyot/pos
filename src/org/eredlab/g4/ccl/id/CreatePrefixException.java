package org.eredlab.g4.ccl.id;

public class CreatePrefixException extends IDException
{
  private static final long serialVersionUID = 1L;

  public CreatePrefixException()
  {
  }

  public CreatePrefixException(String message, Throwable cause)
  {
    super(message, cause);
  }

  public CreatePrefixException(String message) {
    super(message);
  }

  public CreatePrefixException(Throwable cause) {
    super(cause);
  }
}