package cn.longhaul.job.test;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class ExpressTest
{
  public static void main(String[] args)
  {
    Date date = new Date();

    SimpleDateFormat format = new SimpleDateFormat("EEE", Locale.CHINA);

    System.out.println(format.format(date));
  }
}