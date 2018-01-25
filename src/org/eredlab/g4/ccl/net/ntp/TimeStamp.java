package org.eredlab.g4.ccl.net.ntp;

import java.io.Serializable;
import java.lang.ref.SoftReference;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class TimeStamp
  implements Serializable, Comparable
{
  protected static final long msb0baseTime = 2085978496000L;
  protected static final long msb1baseTime = -2208988800000L;
  public static final String NTP_DATE_FORMAT = "EEE, MMM dd yyyy HH:mm:ss.SSS";
  private static SoftReference simpleFormatter = null;
  private static SoftReference utcFormatter = null;
  private long ntpTime;
  private static final long serialVersionUID = 8139806907588338737L;

  public TimeStamp(long ntpTime)
  {
    this.ntpTime = ntpTime;
  }

  public TimeStamp(String s)
    throws NumberFormatException
  {
    this.ntpTime = decodeNtpHexString(s);
  }

  public TimeStamp(Date d)
  {
    this.ntpTime = (d == null ? 0L : toNtpTime(d.getTime()));
  }

  public long ntpValue()
  {
    return this.ntpTime;
  }

  public long getSeconds()
  {
    return this.ntpTime >>> 32 & 0xFFFFFFFF;
  }

  public long getFraction()
  {
    return this.ntpTime & 0xFFFFFFFF;
  }

  public long getTime()
  {
    return getTime(this.ntpTime);
  }

  public Date getDate()
  {
    long time = getTime(this.ntpTime);
    return new Date(time);
  }

  public static long getTime(long ntpTimeValue)
  {
    long seconds = ntpTimeValue >>> 32 & 0xFFFFFFFF;
    long fraction = ntpTimeValue & 0xFFFFFFFF;

    fraction = Math.round(1000.0D * fraction / 4294967296.0D);

    long msb = seconds & 0x80000000;
    if (msb == 0L)
    {
      return 2085978496000L + seconds * 1000L + fraction;
    }

    return -2208988800000L + seconds * 1000L + fraction;
  }

  public static TimeStamp getNtpTime(long date)
  {
    return new TimeStamp(toNtpTime(date));
  }

  public static TimeStamp getCurrentTime()
  {
    return getNtpTime(System.currentTimeMillis());
  }

  protected static long decodeNtpHexString(String s)
    throws NumberFormatException
  {
    if (s == null) {
      throw new NumberFormatException("null");
    }
    int ind = s.indexOf('.');
    if (ind == -1) {
      if (s.length() == 0) return 0L;
      return Long.parseLong(s, 16) << 32;
    }

    return Long.parseLong(s.substring(0, ind), 16) << 32 | 
      Long.parseLong(s.substring(ind + 1), 16);
  }

  public static TimeStamp parseNtpString(String s)
    throws NumberFormatException
  {
    return new TimeStamp(decodeNtpHexString(s));
  }

  protected static long toNtpTime(long t)
  {
    boolean useBase1 = t < 2085978496000L;
    long baseTime;
    //long baseTime;
    if (useBase1) {
      baseTime = t - -2208988800000L;
    }
    else {
      baseTime = t - 2085978496000L;
    }

    long seconds = baseTime / 1000L;
    long fraction = baseTime % 1000L * 4294967296L / 1000L;

    if (useBase1) {
      seconds |= 2147483648L;
    }

    long time = seconds << 32 | fraction;
    return time;
  }

  public int hashCode()
  {
    return (int)(this.ntpTime ^ this.ntpTime >>> 32);
  }

  public boolean equals(Object obj)
  {
    if ((obj instanceof TimeStamp)) {
      return this.ntpTime == ((TimeStamp)obj).ntpValue();
    }
    return false;
  }

  public String toString()
  {
    return toString(this.ntpTime);
  }

  private static void appendHexString(StringBuffer buf, long l)
  {
    String s = Long.toHexString(l);
    for (int i = s.length(); i < 8; i++)
      buf.append('0');
    buf.append(s);
  }

  public static String toString(long ntpTime)
  {
    StringBuffer buf = new StringBuffer();

    appendHexString(buf, ntpTime >>> 32 & 0xFFFFFFFF);

    buf.append('.');
    appendHexString(buf, ntpTime & 0xFFFFFFFF);

    return buf.toString();
  }

  public String toDateString()
  {
    DateFormat formatter = null;
    if (simpleFormatter != null) {
      formatter = (DateFormat)simpleFormatter.get();
    }
    if (formatter == null)
    {
      formatter = new SimpleDateFormat("EEE, MMM dd yyyy HH:mm:ss.SSS", Locale.US);
      formatter.setTimeZone(TimeZone.getDefault());
      simpleFormatter = new SoftReference(formatter);
    }
    Date ntpDate = getDate();
    synchronized (formatter) {
      return formatter.format(ntpDate);
    }
  }

  public String toUTCString()
  {
    DateFormat formatter = null;
    if (utcFormatter != null)
      formatter = (DateFormat)utcFormatter.get();
    if (formatter == null)
    {
      formatter = new SimpleDateFormat("EEE, MMM dd yyyy HH:mm:ss.SSS 'UTC'", 
        Locale.US);
      formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
      utcFormatter = new SoftReference(formatter);
    }
    Date ntpDate = getDate();
    synchronized (formatter) {
      return formatter.format(ntpDate);
    }
  }

  public int compareTo(TimeStamp anotherTimeStamp)
  {
    long thisVal = this.ntpTime;
    long anotherVal = anotherTimeStamp.ntpTime;
    return thisVal == anotherVal ? 0 : thisVal < anotherVal ? -1 : 1;
  }

  public int compareTo(Object o)
  {
    return compareTo((TimeStamp)o);
  }
}