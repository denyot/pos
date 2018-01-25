package org.eredlab.g4.ccl.id.loader;

import org.eredlab.g4.ccl.id.IDException;

public class LoadResourcesException extends IDException
{
  public LoadResourcesException()
  {
  }

  public LoadResourcesException(String message, Throwable cause)
  {
    super(message, cause);
  }

  public LoadResourcesException(String message) {
    super(message);
  }

  public LoadResourcesException(Throwable cause) {
    super(cause);
  }
}