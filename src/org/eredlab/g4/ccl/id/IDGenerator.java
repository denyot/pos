package org.eredlab.g4.ccl.id;

public abstract interface IDGenerator
{
  public abstract String create()
    throws CreateIDException;
}