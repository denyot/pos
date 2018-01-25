package cn.longhaul.exception;

import cn.longhaul.sap.system.connection.SapConnection;
import java.io.PrintStream;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class LonghaulException extends Exception
{
  private static Log log = LogFactory.getLog(SapConnection.class);

  public LonghaulException()
  {
    log.error("错误处理1!");
    System.out.println("错误处理1!");
  }

  public LonghaulException(String message)
  {
    super(message);
    System.out.println("错误处理2!");
    log.error("错误处理2:!" + message);
  }

  public LonghaulException(Throwable cause)
  {
    super(cause);
    cause.printStackTrace();
    log.error("错误处理3:!" + cause.toString());
    System.out.println("错误处理3!");
  }

  public LonghaulException(String message, Throwable cause)
  {
    super(message, cause);
    System.out.println("错误处理4!");
    log.error("错误处理4:!" + message + ":" + cause.toString());
  }

  public LonghaulException(int message, Throwable cause) {
    super(cause);
    System.out.println("错误处理5!");
    log.error("错误处理4:!" + message + ":" + cause.toString());
  }

  public LonghaulException(int message, String messageString)
  {
    super(messageString);
    log.error("错误处理4:!" + message + ":" + messageString);
  }
}