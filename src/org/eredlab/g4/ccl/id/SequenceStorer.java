package org.eredlab.g4.ccl.id;

public abstract interface SequenceStorer
{
  public abstract void updateMaxValueByFieldName(long paramLong, String paramString)
    throws StoreSequenceException;

  public abstract long load(String paramString)
    throws StoreSequenceException;
}