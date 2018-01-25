package org.eredlab.g4.ccl.id;

public class FormatSequenceExcepiton extends IDException
{
  public FormatSequenceExcepiton()
  {
    super("格式化序号异常!");
  }

  public FormatSequenceExcepiton(String message, Throwable cause) {
    super(message, cause);
  }

  public FormatSequenceExcepiton(String message) {
    super(message);
  }

  public FormatSequenceExcepiton(Throwable cause) {
    super(cause);
  }
}