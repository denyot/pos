package org.eredlab.g4.ccl.id;

public abstract interface SequenceFormater
{
  public abstract String format(long paramLong)
    throws FormatSequenceExcepiton;
}