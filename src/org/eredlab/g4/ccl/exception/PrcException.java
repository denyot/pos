package org.eredlab.g4.ccl.exception;

public class PrcException extends RuntimeException
{
  private String appCode;
  private String errorMsg;
  private String prcName;

  public PrcException(String prcName, String errorMsg)
  {
    super("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n调用存储过程[" + prcName + 
      "]发生错误,错误原因：[" + errorMsg + "]");
    setErrorMsg(errorMsg);
  }

  public PrcException(String prcName, String appCode, String errorMsg)
  {
    super("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n调用存储过程[" + prcName + 
      "]发生错误,错误编码为：[" + appCode + "] 错误原因：[" + errorMsg + "]");
    setAppCode(appCode);
    setPrcName(prcName);
    setErrorMsg(errorMsg);
  }

  public String getAppCode() {
    return this.appCode;
  }

  public void setAppCode(String appCode) {
    this.appCode = appCode;
  }

  public String getErrorMsg() {
    return this.errorMsg;
  }

  public void setErrorMsg(String errorMsg) {
    this.errorMsg = errorMsg;
  }

  public String getPrcName() {
    return this.prcName;
  }

  public void setPrcName(String prcName) {
    this.prcName = prcName;
  }
}