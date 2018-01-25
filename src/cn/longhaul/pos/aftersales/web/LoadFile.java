package cn.longhaul.pos.aftersales.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoadFile extends HttpServlet
{
  private static final long serialVersionUID = 1L;

  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws IOException, ServletException
  {
    OutputStream o = response.getOutputStream();
    byte[] b = new byte[1024];

    File fileLoad = new File("d:/temp", "test.rar");

    response.setHeader("Content-disposition", "attachment;filename=test.rar");

    response.setContentType("application/x-tar");

    long fileLength = fileLoad.length();
    String length = String.valueOf(fileLength);
    response.setHeader("Content_Length", length);

    FileInputStream in = new FileInputStream(fileLoad);
    int n = 0;
    while ((n = in.read(b)) != -1)
      o.write(b, 0, n);
  }

  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
  {
    doGet(request, response);
  }
}