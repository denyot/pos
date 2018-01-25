package cn.longhaul.job.expression;

import java.io.PrintStream;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;

public class ExpressionUtil
{
  static IReader g4Reader;

  public ExpressionUtil()
  {
    if (g4Reader == null)
      g4Reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
  }

  public List<String> getWerks()
  {
    return g4Reader.queryForList("express.getWerks");
  }

  public List<Date> getToday()
  {
    List dateList = new ArrayList();
    dateList.add(new Date());
    return dateList;
  }

  public List<Date> getDateBt(String fromDate, String toDate) throws ParseException
  {
    DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
    List list = new ArrayList();
    Date begin = format.parse(fromDate);
    Date end = format.parse(toDate);

    Calendar cal = Calendar.getInstance();
    cal.setTime(begin);

    System.out.println(5);
    while (cal.getTime().before(end)) {
      cal.add(5, 1);
      list.add(cal.getTime());
    }

    return list;
  }

  public Integer pageCountgetMemberNos() throws SQLException
  {
    Integer dataCount = (Integer)g4Reader.queryForObject("express.getMemberNosPageCount");

    return dataCount;
  }

  public List<?> getMemberNos(Dto dto) throws SQLException
  {
    List members = g4Reader.queryForPage("express.getMemberNos", dto);

    System.out.println(members.size());

    return members;
  }
}