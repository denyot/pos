package org.eredlab.g4.ccl.util;

public abstract interface G4Constants
{
  public static final String XML_Attribute = "0";
  public static final String XML_Node = "1";
  public static final String S_STYLE_N = "number";
  public static final String S_STYLE_L = "letter";
  public static final String S_STYLE_NL = "numberletter";
  public static final String FORMAT_DateTime = "yyyy-MM-dd HH:mm:ss";
  public static final String FORMAT_DateTime_12 = "yyyy-MM-dd hh:mm:ss";
  public static final String FORMAT_Date = "yyyy-MM-dd";
  public static final String FORMAT_Time = "HH:mm:ss";
  public static final String FORMAT_Time_12 = "hh:mm:ss";
  public static final String ENTER = "\n";
  public static final String Exception_Head = "\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n";
  public static final String EXT_GRID_FIRSTLOAD = "first";
  public static final String ExcelTPL_DataType_Number = "number";
  public static final String ExcelTPL_DataType_Label = "label";
  public static final String PostType_Nude = "1";
  public static final String PostType_Normal = "0";
  public static final int Ajax_Timeout = 999;
  public static final int Ajax_Session_Unavaliable = 998;
  public static final Boolean TRUE = new Boolean(true);

  public static final Boolean FALSE = new Boolean(false);
  public static final String SUCCESS = "1";
  public static final String FAILURE = "0";
  public static final String ERR_MSG_QUERYFORPAGE_STRING = "您正在使用分页查询,但是你传递的分页参数缺失!如果不需要分页操作,您可以尝试使用普通查询:queryForList()方法";
  public static final String[] CHART_COLORS = { "AFD8F8", "F6BD0F", "8BBA00", "008E8E", "D64646", "8E468E", "588526", "B3AA00", "008ED6", "9D080D", "A186BE", "1EBE38" };
}