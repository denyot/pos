package org.eredlab.g4.ccl.net.ftp.parser;

import java.text.ParseException;
import java.util.Calendar;

public abstract interface FTPTimestampParser
{
  public static final String DEFAULT_SDF = "MMM d yyyy";
  public static final String DEFAULT_RECENT_SDF = "MMM d HH:mm";

  public abstract Calendar parseTimestamp(String paramString)
    throws ParseException;
}