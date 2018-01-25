package org.eredlab.g4.ccl.util;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.security.CodeSource;
import java.security.MessageDigest;
import java.security.ProtectionDomain;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collection;
import java.util.Map;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.assistant.TypeCaseHelper;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

public class G4Utils
{
  private static Log log = LogFactory.getLog(G4Utils.class);

  private static final byte[] DES_KEY = { 21, 1, -110, 82, -32, -85, -128, -65 };

  private static String[] HanDigiStr = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" };

  private static String[] HanDiviStr = { "", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟", "万", 
    "拾", "佰", "仟", "亿", "拾", "佰", "仟", "万", "拾", "佰", "仟" };

  private static PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper("g4");

  public static boolean isEmpty(Object pObj)
  {
    if (pObj == null)
      return true;
    if (pObj == "")
      return true;
    if (pObj == "null")
      return true;
    if ((pObj instanceof String)) {
      if (((String)pObj).length() == 0)
        return true;
    }
    else if ((pObj instanceof Collection)) {
      if (((Collection)pObj).size() == 0)
        return true;
    }
    else if (((pObj instanceof Map)) && 
      (((Map)pObj).size() == 0)) {
      return true;
    }

    return false;
  }

  public static boolean isNotEmpty(Object pObj)
  {
    if (pObj == null)
      return false;
    if (pObj == "")
      return false;
    if (pObj == "null")
      return false;
    if ((pObj instanceof String)) {
      if (((String)pObj).length() == 0)
        return false;
    }
    else if ((pObj instanceof Collection)) {
      if (((Collection)pObj).size() == 0)
        return false;
    }
    else if (((pObj instanceof Map)) && 
      (((Map)pObj).size() == 0)) {
      return false;
    }

    return true;
  }

  public static boolean isTheStyle(String pStr, String pStyle)
  {
    for (int i = 0; i < pStr.length(); i++) {
      char c = pStr.charAt(i);
      if (pStyle.equals("number")) {
        if (!Character.isDigit(c))
          return false;
      } else if (pStyle.equals("letter")) {
        if (!Character.isLetter(c))
          return false;
      } else if ((pStyle.equals("numberletter")) && 
        (Character.isLetterOrDigit(c))) {
        return false;
      }
    }
    return true;
  }

  public static void copyPropBetweenBeans(Object pFromObj, Object pToObj)
  {
    if (pToObj != null)
      try {
        BeanUtils.copyProperties(pToObj, pFromObj);
      } catch (Exception e) {
        log.error("==开发人员请注意:==\n JavaBean之间的属性值拷贝发生错误啦!\n详细错误信息如下:");
        e.printStackTrace();
      }
  }

  public static void copyPropFromBean2Dto(Object pFromObj, Dto pToDto)
  {
    if (pToDto != null)
      try {
        pToDto.putAll(BeanUtils.describe(pFromObj));

        pToDto.remove("class");
      } catch (Exception e) {
        log.error("==开发人员请注意:==\n 将JavaBean属性值拷贝到Dto对象发生错误啦!\n详细错误信息如下:");
        e.printStackTrace();
      }
  }

  public static String getFixedPersonIDCode(String personIDCode)
    throws Exception
  {
    if (personIDCode == null) {
      throw new Exception("输入的身份证号无效，请检查");
    }
    if (personIDCode.length() == 18) {
      if (isIdentity(personIDCode)) {
        return personIDCode;
      }
      throw new Exception("输入的身份证号无效，请检查");
    }if (personIDCode.length() == 15) {
      return fixPersonIDCodeWithCheck(personIDCode);
    }
    throw new Exception("输入的身份证号无效，请检查");
  }

  public static String fixPersonIDCodeWithCheck(String personIDCode)
    throws Exception
  {
    if ((personIDCode == null) || (personIDCode.trim().length() != 15)) {
      throw new Exception("输入的身份证号不足15位，请检查");
    }
    if (!isIdentity(personIDCode)) {
      throw new Exception("输入的身份证号无效，请检查");
    }
    return fixPersonIDCodeWithoutCheck(personIDCode);
  }

  public static String fixPersonIDCodeWithoutCheck(String personIDCode)
    throws Exception
  {
    if ((personIDCode == null) || (personIDCode.trim().length() != 15)) {
      throw new Exception("输入的身份证号不足15位，请检查");
    }
    String id17 = personIDCode.substring(0, 6) + "19" + personIDCode.substring(6, 15);

    char[] code = { '1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2' };
    int[] factor = { 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 };
    int[] idcd = new int[18];

    for (int i = 0; i < 17; i++) {
      idcd[i] = Integer.parseInt(id17.substring(i, i + 1));
    }
    int sum = 0;
    for (int i = 0; i < 17; i++) {
      sum += idcd[i] * factor[i];
    }
    int remainder = sum % 11;
    String lastCheckBit = String.valueOf(code[remainder]);
    return id17 + lastCheckBit;
  }

  public static boolean isIdentity(String identity)
  {
    if (identity == null)
      return false;
    if ((identity.length() == 18) || (identity.length() == 15)) {
      String id15 = null;
      if (identity.length() == 18)
        id15 = identity.substring(0, 6) + identity.substring(8, 17);
      else
        id15 = identity;
      try {
        Long.parseLong(id15);

        String birthday = "19" + id15.substring(6, 12);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        sdf.parse(birthday);
        if ((identity.length() == 18) && (!fixPersonIDCodeWithoutCheck(id15).equals(identity)))
          return false;
      } catch (Exception e) {
        return false;
      }
      return true;
    }
    return false;
  }

  public static Timestamp getBirthdayFromPersonIDCode(String identity)
    throws Exception
  {
    String id = getFixedPersonIDCode(identity);
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
    try {
      return new Timestamp(sdf.parse(id.substring(6, 14)).getTime());
    } catch (ParseException e) {
    }
    throw new Exception("不是有效的身份证号，请检查");
  }

  public static String getGenderFromPersonIDCode(String identity)
    throws Exception
  {
    String id = getFixedPersonIDCode(identity);
    char sex = id.charAt(16);
    return sex % '\002' == 0 ? "2" : "1";
  }

  private static String PositiveIntegerToHanStr(String NumStr)
  {
    String RMBStr = "";
    boolean lastzero = false;
    boolean hasvalue = false;

    int len = NumStr.length();
    if (len > 15)
      return "数值过大!";
    for (int i = len - 1; i >= 0; i--) {
      if (NumStr.charAt(len - i - 1) != ' ')
      {
        int n = NumStr.charAt(len - i - 1) - '0';
        if ((n < 0) || (n > 9)) {
          return "输入含非数字字符!";
        }
        if (n != 0) {
          if (lastzero) {
            RMBStr = RMBStr + HanDigiStr[0];
          }

          if ((n != 1) || (i % 4 != 1) || (i != len - 1))
            RMBStr = RMBStr + HanDigiStr[n];
          RMBStr = RMBStr + HanDiviStr[i];
          hasvalue = true;
        }
        else if ((i % 8 == 0) || ((i % 8 == 4) && (hasvalue))) {
          RMBStr = RMBStr + HanDiviStr[i];
        }
        if (i % 8 == 0)
          hasvalue = false;
        lastzero = (n == 0) && (i % 4 != 0);
      }
    }
    if (RMBStr.length() == 0)
      return HanDigiStr[0];
    return RMBStr;
  }

  public static String numToRMBStr(double val)
  {
    String SignStr = "";
    String TailStr = "";

    if (val < 0.0D) {
      val = -val;
      SignStr = "负";
    }
    if ((val > 100000000000000.0D) || (val < -100000000000000.0D)) {
      return "数值位数过大!";
    }
    long temp = Math.round(val * 100.0D);
    long integer = temp / 100L;
    long fraction = temp % 100L;
    int jiao = (int)fraction / 10;
    int fen = (int)fraction % 10;
    if ((jiao == 0) && (fen == 0)) {
      TailStr = "整";
    } else {
      TailStr = HanDigiStr[jiao];
      if (jiao != 0) {
        TailStr = TailStr + "角";
      }
      if ((integer == 0L) && (jiao == 0))
        TailStr = "";
      if (fen != 0) {
        TailStr = TailStr + HanDigiStr[fen] + "分";
      }
    }

    return SignStr + PositiveIntegerToHanStr(String.valueOf(integer)) + "元" + TailStr;
  }

  public static int getDaysInMonth(int year, int month)
  {
    if ((month == 1) || (month == 3) || (month == 5) || (month == 7) || (month == 8) || (month == 10) || 
      (month == 12))
      return 31;
    if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
      return 30;
    }
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
      return 29;
    }
    return 28;
  }

  public static int getIntervalDays(java.sql.Date startDate, java.sql.Date endDate)
  {
    long startdate = startDate.getTime();
    long enddate = endDate.getTime();
    long interval = enddate - startdate;
    int intervalday = (int)(interval / 86400000L);
    return intervalday;
  }

  public static int getIntervalMonths(java.sql.Date startDate, java.sql.Date endDate)
  {
    Calendar startCal = Calendar.getInstance();
    startCal.setTime(startDate);
    Calendar endCal = Calendar.getInstance();
    endCal.setTime(endDate);
    int startDateM = 2;
    int startDateY = 1;
    int enddatem = 2;
    int enddatey = 1;
    int interval = enddatey * 12 + enddatem - (startDateY * 12 + startDateM);
    return interval;
  }

  public static String getCurrentTime()
  {
    String returnStr = null;
    SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    java.util.Date date = new java.util.Date();
    returnStr = f.format(date);
    return returnStr;
  }

  public static String getCurrentTime(String format)
  {
    String returnStr = null;
    SimpleDateFormat f = new SimpleDateFormat(format);
    java.util.Date date = new java.util.Date();
    returnStr = f.format(date);
    return returnStr;
  }

  public static String getCurDate()
  {
    Calendar calendar = Calendar.getInstance();
    SimpleDateFormat simpledateformat = new SimpleDateFormat("yyyy-MM-dd");
    String strDate = simpledateformat.format(calendar.getTime());
    return strDate;
  }

  public static Timestamp getCurrentTimestamp()
  {
    Object obj = TypeCaseHelper.convert(getCurrentTime(), "Timestamp", "yyyy-MM-dd HH:mm:ss");
    if (obj != null) {
      return (Timestamp)obj;
    }
    return null;
  }

  public static java.util.Date stringToDate(String strDate, String srcDateFormat, String dstDateFormat)
  {
    java.util.Date rtDate = null;
    java.util.Date tmpDate = new SimpleDateFormat(srcDateFormat).parse(strDate, new ParsePosition(0));
    String tmpString = null;
    if (tmpDate != null)
      tmpString = new SimpleDateFormat(dstDateFormat).format(tmpDate);
    if (tmpString != null)
      rtDate = new SimpleDateFormat(dstDateFormat).parse(tmpString, new ParsePosition(0));
    return rtDate;
  }

  public static String[] mergeStringArray(String[] a, String[] b)
  {
    if ((a.length == 0) || (isEmpty(a)))
      return b;
    if ((b.length == 0) || (isEmpty(b)))
      return a;
    String[] c = new String[a.length + b.length];
    for (int m = 0; m < a.length; m++) {
      c[m] = a[m];
    }
    for (int i = 0; i < b.length; i++) {
      c[(a.length + i)] = b[i];
    }
    return c;
  }

  public static String encodeChineseDownloadFileName(HttpServletRequest request, String pFileName)
  {
    String agent = request.getHeader("USER-AGENT");
    try {
      if ((agent != null) && (-1 != agent.indexOf("MSIE")))
        pFileName = URLEncoder.encode(pFileName, "utf-8");
      else
        pFileName = new String(pFileName.getBytes("utf-8"), "iso8859-1");
    }
    catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
    return pFileName;
  }

  public static String getWeekDayByDate(String strdate)
  {
    String[] dayNames = { "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" };
    SimpleDateFormat sdfInput = new SimpleDateFormat("yyyy-MM-dd");
    Calendar calendar = Calendar.getInstance();
    java.util.Date date = new java.util.Date();
    try {
      date = sdfInput.parse(strdate);
    } catch (ParseException e) {
      e.printStackTrace();
    }
    calendar.setTime(date);
    int dayOfWeek = calendar.get(7) - 1;
    if (dayOfWeek < 0)
      dayOfWeek = 0;
    return dayNames[dayOfWeek];
  }

  public static boolean isIE(HttpServletRequest request)
  {
    String userAgent = request.getHeader("USER-AGENT").toLowerCase();
    boolean isIe = true;
    int index = userAgent.indexOf("msie");
    if (index == -1) {
      isIe = false;
    }
    return isIe;
  }

  public static boolean isChrome(HttpServletRequest request)
  {
    String userAgent = request.getHeader("USER-AGENT").toLowerCase();
    boolean isChrome = true;
    int index = userAgent.indexOf("chrome");
    if (index == -1) {
      isChrome = false;
    }
    return isChrome;
  }

  public static boolean isFirefox(HttpServletRequest request)
  {
    String userAgent = request.getHeader("USER-AGENT").toLowerCase();
    boolean isFirefox = true;
    int index = userAgent.indexOf("firefox");
    if (index == -1) {
      isFirefox = false;
    }
    return isFirefox;
  }

  public static String getClientExplorerType(HttpServletRequest request)
  {
    String userAgent = request.getHeader("USER-AGENT").toLowerCase();
    String explorer = "非主流浏览器";
    if (isIE(request)) {
      int index = userAgent.indexOf("msie");
      explorer = userAgent.substring(index, index + 8);
    } else if (isChrome(request)) {
      int index = userAgent.indexOf("chrome");
      explorer = userAgent.substring(index, index + 12);
    } else if (isFirefox(request)) {
      int index = userAgent.indexOf("firefox");
      explorer = userAgent.substring(index, index + 11);
    }
    return explorer.toUpperCase();
  }

  public static String encryptBasedMd5(String strSrc)
  {
    String outString = null;
    try {
      MessageDigest md5 = MessageDigest.getInstance("MD5");
      byte[] outByte = md5.digest(strSrc.getBytes("UTF-8"));
      outString = outByte.toString();
    } catch (Exception e) {
      e.printStackTrace();
    }
    return outString;
  }

  public static String encryptBasedDes(String data)
  {
    String encryptedData = null;
    try
    {
      SecureRandom sr = new SecureRandom();
      DESKeySpec deskey = new DESKeySpec(DES_KEY);

      SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
      SecretKey key = keyFactory.generateSecret(deskey);

      Cipher cipher = Cipher.getInstance("DES");
      cipher.init(1, key, sr);

      encryptedData = new BASE64Encoder().encode(cipher.doFinal(data.getBytes()));
    } catch (Exception e) {
      log.error("加密错误，错误信息：", e);
      throw new RuntimeException("加密错误，错误信息：", e);
    }
    return encryptedData;
  }

  public static String decryptBasedDes(String cryptData)
  {
    String decryptedData = null;
    try
    {
      SecureRandom sr = new SecureRandom();
      DESKeySpec deskey = new DESKeySpec(DES_KEY);

      SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
      SecretKey key = keyFactory.generateSecret(deskey);

      Cipher cipher = Cipher.getInstance("DES");
      cipher.init(2, key, sr);

      decryptedData = new String(cipher.doFinal(new BASE64Decoder().decodeBuffer(cryptData)));
    } catch (Exception e) {
      log.error("解密错误，错误信息：", e);
      throw new RuntimeException("解密错误，错误信息：", e);
    }
    return decryptedData;
  }

  public static boolean defaultJdbcTypeOracle()
  {
    boolean out = false;
    String jdbcType = System.getProperty("g4.JdbcType");
    if (jdbcType.equalsIgnoreCase("oracle")) {
      out = true;
    }
    return out;
  }

  public static boolean defaultJdbcTypeMysql()
  {
    boolean out = false;
    String jdbcType = System.getProperty("g4.JdbcType");
    if (jdbcType.equalsIgnoreCase("mysql")) {
      out = true;
    }
    return out;
  }

  public static String replace4JsOutput(String pStr)
  {
    pStr = pStr.replace("\r\n", "<br/>&nbsp;&nbsp;");
    pStr = pStr.replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
    pStr = pStr.replace(" ", "&nbsp;");
    return pStr;
  }

  public static String getPathFromClass(Class cls)
  {
    String path = null;
    if (cls == null) {
      throw new NullPointerException();
    }
    URL url = getClassLocationURL(cls);
    if (url != null) {
      path = url.getPath();
      if ("jar".equalsIgnoreCase(url.getProtocol())) {
        try {
          path = new URL(path).getPath();
        } catch (MalformedURLException localMalformedURLException) {
        }
        int location = path.indexOf("!/");
        if (location != -1) {
          path = path.substring(0, location);
        }
      }
      File file = new File(path);
      try {
        path = file.getCanonicalPath();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    return path;
  }

  public static String getFullPathRelateClass(String relatedPath, Class cls)
  {
    String path = null;
    if (relatedPath == null) {
      throw new NullPointerException();
    }
    String clsPath = getPathFromClass(cls);
    File clsFile = new File(clsPath);
    String tempPath = clsFile.getParent() + File.separator + relatedPath;
    File file = new File(tempPath);
    try {
      path = file.getCanonicalPath();
    } catch (IOException e) {
      e.printStackTrace();
    }
    return path;
  }

  private static URL getClassLocationURL(Class cls)
  {
    if (cls == null)
      throw new IllegalArgumentException("null input: cls");
    URL result = null;
    String clsAsResource = cls.getName().replace('.', '/').concat(".class");
    ProtectionDomain pd = cls.getProtectionDomain();
    if (pd != null) {
      CodeSource cs = pd.getCodeSource();
      if (cs != null)
        result = cs.getLocation();
      if ((result != null) && 
        ("file".equals(result.getProtocol())))
        try {
          if ((result.toExternalForm().endsWith(".jar")) || (result.toExternalForm().endsWith(".zip")))
            result = new URL("jar:".concat(result.toExternalForm()).concat("!/").concat(clsAsResource));
          else if (new File(result.getFile()).isDirectory())
            result = new URL(result, clsAsResource);
        }
        catch (MalformedURLException localMalformedURLException)
        {
        }
    }
    if (result == null) {
      ClassLoader clsLoader = cls.getClassLoader();
      result = clsLoader != null ? clsLoader.getResource(clsAsResource) : 
        ClassLoader.getSystemResource(clsAsResource);
    }
    return result;
  }

  public static BigDecimal getRandom(int start, int end)
  {
    return new BigDecimal(start + Math.random() * end);
  }
}