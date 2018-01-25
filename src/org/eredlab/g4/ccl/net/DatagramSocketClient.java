package org.eredlab.g4.ccl.net;

import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;

public abstract class DatagramSocketClient
{
  private static final DatagramSocketFactory __DEFAULT_SOCKET_FACTORY = new DefaultDatagramSocketFactory();
  protected int _timeout_;
  protected DatagramSocket _socket_;
  protected boolean _isOpen_;
  protected DatagramSocketFactory _socketFactory_;

  public DatagramSocketClient()
  {
    this._socket_ = null;
    this._timeout_ = 0;
    this._isOpen_ = false;
    this._socketFactory_ = __DEFAULT_SOCKET_FACTORY;
  }

  public void open()
    throws SocketException
  {
    this._socket_ = this._socketFactory_.createDatagramSocket();
    this._socket_.setSoTimeout(this._timeout_);
    this._isOpen_ = true;
  }

  public void open(int port)
    throws SocketException
  {
    this._socket_ = this._socketFactory_.createDatagramSocket(port);
    this._socket_.setSoTimeout(this._timeout_);
    this._isOpen_ = true;
  }

  public void open(int port, InetAddress laddr)
    throws SocketException
  {
    this._socket_ = this._socketFactory_.createDatagramSocket(port, laddr);
    this._socket_.setSoTimeout(this._timeout_);
    this._isOpen_ = true;
  }

  public void close()
  {
    this._socket_.close();
    this._socket_ = null;
    this._isOpen_ = false;
  }

  public boolean isOpen()
  {
    return this._isOpen_;
  }

  public void setDefaultTimeout(int timeout)
  {
    this._timeout_ = timeout;
  }

  public int getDefaultTimeout()
  {
    return this._timeout_;
  }

  public void setSoTimeout(int timeout)
    throws SocketException
  {
    this._socket_.setSoTimeout(timeout);
  }

  public int getSoTimeout()
    throws SocketException
  {
    return this._socket_.getSoTimeout();
  }

  public int getLocalPort()
  {
    return this._socket_.getLocalPort();
  }

  public InetAddress getLocalAddress()
  {
    return this._socket_.getLocalAddress();
  }

  public void setDatagramSocketFactory(DatagramSocketFactory factory)
  {
    if (factory == null)
      this._socketFactory_ = __DEFAULT_SOCKET_FACTORY;
    else
      this._socketFactory_ = factory;
  }
}