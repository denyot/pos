package cn.longhaul.sap.system.esb.hesssion;

import javax.servlet.ServletRequest;

public class HessianContext
{
  private ServletRequest _request;
  private static final ThreadLocal<HessianContext> _localContext = new ThreadLocal()
  {
    public HessianContext initialValue() {
      return new HessianContext();
    }
  };

  public static void setRequest(ServletRequest request)
  {
    ((HessianContext)_localContext.get())._request = request;
  }

  public static ServletRequest getRequest() {
    return ((HessianContext)_localContext.get())._request;
  }

  public static void clear() {
    ((HessianContext)_localContext.get())._request = null;
  }
}