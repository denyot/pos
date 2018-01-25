package org.eredlab.g4.ccl.net.ntp;

import java.net.DatagramPacket;

public class NtpV3Impl
  implements NtpV3Packet
{
  private static final int MODE_INDEX = 0;
  private static final int MODE_SHIFT = 0;
  private static final int VERSION_INDEX = 0;
  private static final int VERSION_SHIFT = 3;
  private static final int LI_INDEX = 0;
  private static final int LI_SHIFT = 6;
  private static final int STRATUM_INDEX = 1;
  private static final int POLL_INDEX = 2;
  private static final int PRECISION_INDEX = 3;
  private static final int ROOT_DELAY_INDEX = 4;
  private static final int ROOT_DISPERSION_INDEX = 8;
  private static final int REFERENCE_ID_INDEX = 12;
  private static final int REFERENCE_TIMESTAMP_INDEX = 16;
  private static final int ORIGINATE_TIMESTAMP_INDEX = 24;
  private static final int RECEIVE_TIMESTAMP_INDEX = 32;
  private static final int TRANSMIT_TIMESTAMP_INDEX = 40;
  private static final int KEY_IDENTIFIER_INDEX = 48;
  private static final int MESSAGE_DIGEST = 54;
  private byte[] buf = new byte[48];
  private DatagramPacket dp;

  public int getMode()
  {
    return ui(this.buf[0]) >> 0 & 0x7;
  }

  public String getModeName()
  {
    return NtpUtils.getModeName(getMode());
  }

  public void setMode(int mode)
  {
    this.buf[0] = ((byte)(this.buf[0] & 0xF8 | mode & 0x7));
  }

  public int getLeapIndicator()
  {
    return ui(this.buf[0]) >> 6 & 0x3;
  }

  public void setLeapIndicator(int li)
  {
    this.buf[0] = ((byte)(this.buf[0] & 0x3F | (li & 0x3) << 6));
  }

  public int getPoll()
  {
    return this.buf[2];
  }

  public void setPoll(int poll)
  {
    this.buf[2] = ((byte)(poll & 0xFF));
  }

  public int getPrecision()
  {
    return this.buf[3];
  }

  public void setPrecision(int precision)
  {
    this.buf[3] = ((byte)(precision & 0xFF));
  }

  public int getVersion()
  {
    return ui(this.buf[0]) >> 3 & 0x7;
  }

  public void setVersion(int version)
  {
    this.buf[0] = ((byte)(this.buf[0] & 0xC7 | (version & 0x7) << 3));
  }

  public int getStratum()
  {
    return ui(this.buf[1]);
  }

  public void setStratum(int stratum)
  {
    this.buf[1] = ((byte)(stratum & 0xFF));
  }

  public int getRootDelay()
  {
    return getInt(4);
  }

  public double getRootDelayInMillisDouble()
  {
    double l = getRootDelay();
    return l / 65.536000000000001D;
  }

  public int getRootDispersion()
  {
    return getInt(8);
  }

  public long getRootDispersionInMillis()
  {
    long l = getRootDispersion();
    return l * 1000L / 65536L;
  }

  public double getRootDispersionInMillisDouble()
  {
    double l = getRootDispersion();
    return l / 65.536000000000001D;
  }

  public void setReferenceId(int refId)
  {
    for (int i = 3; i >= 0; i--) {
      this.buf[(12 + i)] = ((byte)(refId & 0xFF));
      refId >>>= 8;
    }
  }

  public int getReferenceId()
  {
    return getInt(12);
  }

  public String getReferenceIdString()
  {
    int version = getVersion();
    int stratum = getStratum();
    if ((version == 3) || (version == 4)) {
      if ((stratum == 0) || (stratum == 1)) {
        return idAsString();
      }

      if (version == 4) {
        return idAsHex();
      }

    }

    if (stratum >= 2) {
      return idAsIPAddress();
    }
    return idAsHex();
  }

  private String idAsIPAddress()
  {
    return ui(this.buf[12]) + "." + 
      ui(this.buf[13]) + "." + 
      ui(this.buf[14]) + "." + 
      ui(this.buf[15]);
  }

  private String idAsString()
  {
    String id = "";
    for (int i = 0; i <= 3; i++) {
      char c = (char)this.buf[(12 + i)];
      if (c == 0) break;
      id = id + c;
    }
    return id;
  }

  private String idAsHex()
  {
    return Integer.toHexString(getReferenceId());
  }

  public TimeStamp getTransmitTimeStamp()
  {
    return getTimestamp(40);
  }

  public void setTransmitTime(TimeStamp ts)
  {
    setTimestamp(40, ts);
  }

  public void setOriginateTimeStamp(TimeStamp ts)
  {
    setTimestamp(24, ts);
  }

  public TimeStamp getOriginateTimeStamp()
  {
    return getTimestamp(24);
  }

  public TimeStamp getReferenceTimeStamp()
  {
    return getTimestamp(16);
  }

  public void setReferenceTime(TimeStamp ts)
  {
    setTimestamp(16, ts);
  }

  public TimeStamp getReceiveTimeStamp()
  {
    return getTimestamp(32);
  }

  public void setReceiveTimeStamp(TimeStamp ts)
  {
    setTimestamp(32, ts);
  }

  public String getType()
  {
    return "NTP";
  }

  private int getInt(int index)
  {
    int i = ui(this.buf[index]) << 24 | 
      ui(this.buf[(index + 1)]) << 16 | 
      ui(this.buf[(index + 2)]) << 8 | 
      ui(this.buf[(index + 3)]);

    return i;
  }

  private TimeStamp getTimestamp(int index)
  {
    return new TimeStamp(getLong(index));
  }

  private long getLong(int index)
  {
    long i = ul(this.buf[index]) << 56 | 
      ul(this.buf[(index + 1)]) << 48 | 
      ul(this.buf[(index + 2)]) << 40 | 
      ul(this.buf[(index + 3)]) << 32 | 
      ul(this.buf[(index + 4)]) << 24 | 
      ul(this.buf[(index + 5)]) << 16 | 
      ul(this.buf[(index + 6)]) << 8 | 
      ul(this.buf[(index + 7)]);
    return i;
  }

  private void setTimestamp(int index, TimeStamp t)
  {
    long ntpTime = t == null ? 0L : t.ntpValue();

    for (int i = 7; i >= 0; i--) {
      this.buf[(index + i)] = ((byte)(int)(ntpTime & 0xFF));
      ntpTime >>>= 8;
    }
  }

  public DatagramPacket getDatagramPacket()
  {
    if (this.dp == null)
      synchronized (this) {
        if (this.dp == null) {
          this.dp = new DatagramPacket(this.buf, this.buf.length);
          this.dp.setPort(123);
        }
      }
    return this.dp;
  }

  public void setDatagramPacket(DatagramPacket srcDp)
  {
    byte[] incomingBuf = srcDp.getData();
    int len = srcDp.getLength();
    if (len > this.buf.length) {
      len = this.buf.length;
    }
    System.arraycopy(incomingBuf, 0, this.buf, 0, len);
  }

  protected static final int ui(byte b)
  {
    int i = b & 0xFF;
    return i;
  }

  protected static final long ul(byte b)
  {
    long i = b & 0xFF;
    return i;
  }

  public String toString()
  {
    return "[version:" + 
      getVersion() + 
      ", mode:" + getMode() + 
      ", poll:" + getPoll() + 
      ", precision:" + getPrecision() + 
      ", delay:" + getRootDelay() + 
      ", dispersion(ms):" + getRootDispersionInMillisDouble() + 
      ", id:" + getReferenceIdString() + 
      ", xmitTime:" + getTransmitTimeStamp().toDateString() + 
      " ]";
  }
}