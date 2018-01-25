package org.eredlab.g4.ccl.id;

public abstract interface PrefixGenerator
{
  public abstract String create()
    throws CreatePrefixException;
}