package org.eredlab.g4.ccl.net.util;

import java.io.Serializable;
import java.util.Enumeration;
import java.util.EventListener;
import java.util.Vector;

public class ListenerList
  implements Serializable
{
  private Vector __listeners;

  public ListenerList()
  {
    this.__listeners = new Vector();
  }

  public synchronized void addListener(EventListener listener)
  {
    this.__listeners.addElement(listener);
  }

  public synchronized void removeListener(EventListener listener)
  {
    this.__listeners.removeElement(listener);
  }

  public synchronized Enumeration getListeners()
  {
    return ((Vector)this.__listeners.clone()).elements();
  }

  public int getListenerCount()
  {
    return this.__listeners.size();
  }
}