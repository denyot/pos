package org.eredlab.g4.ccl.net;

import java.io.IOException;
import java.io.InputStream;

public final class WhoisClient extends FingerClient
{
  public static final String DEFAULT_HOST = "whois.internic.net";
  public static final int DEFAULT_PORT = 43;

  public WhoisClient()
  {
    setDefaultPort(43);
  }

  public String query(String handle)
    throws IOException
  {
    return query(false, handle);
  }

  public InputStream getInputStream(String handle)
    throws IOException
  {
    return getInputStream(false, handle);
  }
}