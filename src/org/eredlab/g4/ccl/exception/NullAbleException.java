package org.eredlab.g4.ccl.exception;

public class NullAbleException extends RuntimeException
{
  private String nullField;

  public NullAbleException()
  {
    super("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n对象不能为空,请检查.");
  }

  public NullAbleException(Class cs)
  {
    super("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n对象不能为空,请检查.[" + cs + "]");
  }

  public NullAbleException(String pNullField)
  {
    super("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n对象属性[" + pNullField + "]不能为空,请检查.");
    setNullField(pNullField);
  }

  public String getNullField() {
    return this.nullField;
  }

  public void setNullField(String nullField) {
    this.nullField = nullField;
  }
}