package org.eredlab.g4.ccl.net.bsd;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.BindException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import org.eredlab.g4.ccl.net.SocketFactory;
import org.eredlab.g4.ccl.net.io.SocketInputStream;

public class RCommandClient extends RExecClient
{
  public static final int DEFAULT_PORT = 514;
  public static final int MIN_CLIENT_PORT = 512;
  public static final int MAX_CLIENT_PORT = 1023;

  InputStream _createErrorStream()
    throws IOException
  {
    int localPort = 1023;
    ServerSocket server = null;

    for (localPort = 1023; localPort >= 512; localPort--)
    {
      try
      {
        server = this._socketFactory_.createServerSocket(localPort, 1, 
          getLocalAddress());
      }
      catch (SocketException localSocketException)
      {
      }

    }

    if (localPort < 512) {
      throw new BindException("All ports in use.");
    }
    this._output_.write(Integer.toString(server.getLocalPort()).getBytes());
    this._output_.write(0);
    this._output_.flush();

    Socket socket = server.accept();
    server.close();

    if ((isRemoteVerificationEnabled()) && (!verifyRemote(socket)))
    {
      socket.close();
      throw new IOException(
        "Security violation: unexpected connection attempt by " + 
        socket.getInetAddress().getHostAddress());
    }

    return new SocketInputStream(socket, socket.getInputStream());
  }

  public RCommandClient()
  {
    setDefaultPort(514);
  }

  public void connect(InetAddress host, int port, InetAddress localAddr)
    throws SocketException, BindException, IOException
  {
    int localPort = 1023;

    for (localPort = 1023; localPort >= 512; localPort--)
    {
      try
      {
        this._socket_ = 
          this._socketFactory_.createSocket(host, port, localAddr, localPort);
      }
      catch (SocketException localSocketException)
      {
      }

    }

    if (localPort < 512) {
      throw new BindException("All ports in use or insufficient permssion.");
    }
    _connectAction_();
  }

  public void connect(InetAddress host, int port)
    throws SocketException, IOException
  {
    connect(host, port, InetAddress.getLocalHost());
  }

  public void connect(String hostname, int port)
    throws SocketException, IOException
  {
    connect(InetAddress.getByName(hostname), port, InetAddress.getLocalHost());
  }

  public void connect(String hostname, int port, InetAddress localAddr)
    throws SocketException, IOException
  {
    connect(InetAddress.getByName(hostname), port, localAddr);
  }

  public void connect(InetAddress host, int port, InetAddress localAddr, int localPort)
    throws SocketException, IOException, IllegalArgumentException
  {
    if ((localPort < 512) || (localPort > 1023))
      throw new IllegalArgumentException("Invalid port number " + localPort);
    super.connect(host, port, localAddr, localPort);
  }

  public void connect(String hostname, int port, InetAddress localAddr, int localPort)
    throws SocketException, IOException, IllegalArgumentException
  {
    if ((localPort < 512) || (localPort > 1023))
      throw new IllegalArgumentException("Invalid port number " + localPort);
    super.connect(hostname, port, localAddr, localPort);
  }

  public void rcommand(String localUsername, String remoteUsername, String command, boolean separateErrorStream)
    throws IOException
  {
    rexec(localUsername, remoteUsername, command, separateErrorStream);
  }

  public void rcommand(String localUsername, String remoteUsername, String command)
    throws IOException
  {
    rcommand(localUsername, remoteUsername, command, false);
  }
}