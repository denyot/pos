package org.eredlab.g4.ccl.id;

public class CreateIDException extends IDException
{
  private static final long serialVersionUID = 1L;

  public CreateIDException()
  {
  }

  public CreateIDException(String message, Throwable cause)
  {
    super(message, cause);
  }

  public CreateIDException(String message) {
    super(message);
  }

  public CreateIDException(Throwable cause) {
    super(cause);
  }
}