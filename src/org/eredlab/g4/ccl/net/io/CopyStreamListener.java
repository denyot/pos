package org.eredlab.g4.ccl.net.io;

import java.util.EventListener;

public abstract interface CopyStreamListener extends EventListener
{
  public abstract void bytesTransferred(CopyStreamEvent paramCopyStreamEvent);

  public abstract void bytesTransferred(long paramLong1, int paramInt, long paramLong2);
}