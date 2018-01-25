package org.eredlab.g4.ccl.net.examples;

import java.io.PrintWriter;
import org.eredlab.g4.ccl.net.ProtocolCommandEvent;
import org.eredlab.g4.ccl.net.ProtocolCommandListener;

public class PrintCommandListener
  implements ProtocolCommandListener
{
  private PrintWriter __writer;

  public PrintCommandListener(PrintWriter writer)
  {
    this.__writer = writer;
  }

  public void protocolCommandSent(ProtocolCommandEvent event)
  {
    this.__writer.print(event.getMessage());
    this.__writer.flush();
  }

  public void protocolReplyReceived(ProtocolCommandEvent event)
  {
    this.__writer.print(event.getMessage());
    this.__writer.flush();
  }
}