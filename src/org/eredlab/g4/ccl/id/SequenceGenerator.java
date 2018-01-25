package org.eredlab.g4.ccl.id;

public abstract interface SequenceGenerator
{
  public abstract long next()
    throws CreateSequnceException;
}