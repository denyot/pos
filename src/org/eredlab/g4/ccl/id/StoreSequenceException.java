package org.eredlab.g4.ccl.id;

public class StoreSequenceException extends IDException
{
  private static final long serialVersionUID = 1L;

  public StoreSequenceException()
  {
  }

  public StoreSequenceException(String message, Throwable cause)
  {
    super(message, cause);
  }

  public StoreSequenceException(String message) {
    super(message);
  }

  public StoreSequenceException(Throwable cause) {
    super(cause);
  }
}