package org.eredlab.g4.ccl.net.ftp.parser;

import java.text.DateFormatSymbols;
import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import org.eredlab.g4.ccl.net.ftp.Configurable;
import org.eredlab.g4.ccl.net.ftp.FTPClientConfig;

public class FTPTimestampParserImpl
  implements FTPTimestampParser, Configurable
{
  private SimpleDateFormat defaultDateFormat;
  private SimpleDateFormat recentDateFormat;

  public FTPTimestampParserImpl()
  {
    setDefaultDateFormat("MMM d yyyy");
    setRecentDateFormat("MMM d HH:mm");
  }

  public Calendar parseTimestamp(String timestampStr)
    throws ParseException
  {
    Calendar now = Calendar.getInstance();
    now.setTimeZone(getServerTimeZone());

    Calendar working = Calendar.getInstance();
    working.setTimeZone(getServerTimeZone());
    ParsePosition pp = new ParsePosition(0);

    Date parsed = null;
    if (this.recentDateFormat != null) {
      parsed = this.recentDateFormat.parse(timestampStr, pp);
    }
    if ((parsed != null) && (pp.getIndex() == timestampStr.length()))
    {
      working.setTime(parsed);
      working.set(1, now.get(1));
      if (working.after(now))
        working.add(1, -1);
    }
    else {
      pp = new ParsePosition(0);
      parsed = this.defaultDateFormat.parse(timestampStr, pp);

      if ((parsed != null) && (pp.getIndex() == timestampStr.length()))
        working.setTime(parsed);
      else {
        throw new ParseException(
          "Timestamp could not be parsed with older or recent DateFormat", 
          pp.getIndex());
      }
    }
    return working;
  }

  public SimpleDateFormat getDefaultDateFormat()
  {
    return this.defaultDateFormat;
  }

  public String getDefaultDateFormatString()
  {
    return this.defaultDateFormat.toPattern();
  }

  private void setDefaultDateFormat(String format)
  {
    if (format != null) {
      this.defaultDateFormat = new SimpleDateFormat(format);
      this.defaultDateFormat.setLenient(false);
    }
  }

  public SimpleDateFormat getRecentDateFormat()
  {
    return this.recentDateFormat;
  }

  public String getRecentDateFormatString()
  {
    return this.recentDateFormat.toPattern();
  }

  private void setRecentDateFormat(String format)
  {
    if (format != null) {
      this.recentDateFormat = new SimpleDateFormat(format);
      this.recentDateFormat.setLenient(false);
    }
  }

  public String[] getShortMonths()
  {
    return this.defaultDateFormat.getDateFormatSymbols().getShortMonths();
  }

  public TimeZone getServerTimeZone()
  {
    return this.defaultDateFormat.getTimeZone();
  }

  private void setServerTimeZone(String serverTimeZoneId)
  {
    TimeZone serverTimeZone = TimeZone.getDefault();
    if (serverTimeZoneId != null) {
      serverTimeZone = TimeZone.getTimeZone(serverTimeZoneId);
    }
    this.defaultDateFormat.setTimeZone(serverTimeZone);
    if (this.recentDateFormat != null)
      this.recentDateFormat.setTimeZone(serverTimeZone);
  }

  public void configure(FTPClientConfig config)
  {
    DateFormatSymbols dfs = null;

    String languageCode = config.getServerLanguageCode();
    String shortmonths = config.getShortMonthNames();
    if (shortmonths != null)
      dfs = FTPClientConfig.getDateFormatSymbols(shortmonths);
    else if (languageCode != null)
      dfs = FTPClientConfig.lookupDateFormatSymbols(languageCode);
    else {
      dfs = FTPClientConfig.lookupDateFormatSymbols("en");
    }

    String recentFormatString = config.getRecentDateFormatStr();
    if (recentFormatString == null) {
      this.recentDateFormat = null;
    } else {
      this.recentDateFormat = new SimpleDateFormat(recentFormatString, dfs);
      this.recentDateFormat.setLenient(false);
    }

    String defaultFormatString = config.getDefaultDateFormatStr();
    if (defaultFormatString == null) {
      throw new IllegalArgumentException("defaultFormatString cannot be null");
    }
    this.defaultDateFormat = new SimpleDateFormat(defaultFormatString, dfs);
    this.defaultDateFormat.setLenient(false);

    setServerTimeZone(config.getServerTimeZoneId());
  }
}