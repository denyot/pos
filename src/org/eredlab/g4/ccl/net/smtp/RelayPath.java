package org.eredlab.g4.ccl.net.smtp;

import java.util.Enumeration;
import java.util.Vector;

public final class RelayPath
{
  Vector _path;
  String _emailAddress;

  public RelayPath(String emailAddress)
  {
    this._path = new Vector();
    this._emailAddress = emailAddress;
  }

  public void addRelay(String hostname)
  {
    this._path.addElement(hostname);
  }

  public String toString()
  {
    StringBuffer buffer = new StringBuffer();

    buffer.append('<');

    Enumeration hosts = this._path.elements();

    if (hosts.hasMoreElements())
    {
      buffer.append('@');
      buffer.append((String)hosts.nextElement());

      while (hosts.hasMoreElements())
      {
        buffer.append(",@");
        buffer.append((String)hosts.nextElement());
      }
      buffer.append(':');
    }

    buffer.append(this._emailAddress);
    buffer.append('>');

    return buffer.toString();
  }
}