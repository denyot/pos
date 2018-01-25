package org.eredlab.g4.ccl.id.sequence;

import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeRollingSequenceGenerator extends AbstractRollingSequenceGenerator
{
  private String time = null;
  private final String pattern;

  private TimeRollingSequenceGenerator(String pPattern)
  {
    this.pattern = pPattern;
    Date now = new Date();
    SimpleDateFormat sdf = new SimpleDateFormat(this.pattern);
    this.time = sdf.format(now);
  }

  public static TimeRollingSequenceGenerator getDayRollingSequenceGenerator()
  {
    TimeRollingSequenceGenerator result = new TimeRollingSequenceGenerator(
      "dd");
    return result;
  }

  public static TimeRollingSequenceGenerator getMonthRollingSequenceGenerator()
  {
    TimeRollingSequenceGenerator result = new TimeRollingSequenceGenerator(
      "MM");
    return result;
  }

  public static TimeRollingSequenceGenerator getYearRollingSequenceGenerator()
  {
    TimeRollingSequenceGenerator result = new TimeRollingSequenceGenerator(
      "yyyy");
    return result;
  }

  public static TimeRollingSequenceGenerator getHourRollingSequenceGenerator()
  {
    TimeRollingSequenceGenerator result = new TimeRollingSequenceGenerator(
      "HH");
    return result;
  }

  protected boolean isResetCount() {
    Date currDate = new Date();
    SimpleDateFormat sdf = new SimpleDateFormat(this.pattern);
    String nowTime = sdf.format(currDate);
    if (!this.time.equals(nowTime)) {
      this.time = nowTime;
      return true;
    }
    return false;
  }

  public String getPattern()
  {
    return this.pattern;
  }
}