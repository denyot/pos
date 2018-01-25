package org.eredlab.g4.ccl.net.io;

import java.io.IOException;

public class CopyStreamException extends IOException
{
  private long totalBytesTransferred;
  private IOException ioException;

  public CopyStreamException(String message, long bytesTransferred, IOException exception)
  {
    super(message);
    this.totalBytesTransferred = bytesTransferred;
    this.ioException = exception;
  }

  public long getTotalBytesTransferred()
  {
    return this.totalBytesTransferred;
  }

  public IOException getIOException()
  {
    return this.ioException;
  }
}