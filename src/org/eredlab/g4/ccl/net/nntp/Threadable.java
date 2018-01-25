package org.eredlab.g4.ccl.net.nntp;

public abstract interface Threadable
{
  public abstract boolean isDummy();

  public abstract String messageThreadId();

  public abstract String[] messageThreadReferences();

  public abstract String simplifiedSubject();

  public abstract boolean subjectIsReply();

  public abstract void setChild(Threadable paramThreadable);

  public abstract void setNext(Threadable paramThreadable);

  public abstract Threadable makeDummy();
}