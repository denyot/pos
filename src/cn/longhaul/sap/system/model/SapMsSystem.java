package cn.longhaul.sap.system.model;

public class SapMsSystem
  implements Cloneable
{
  private final String name;
  private final String mhost;
  private final String group;
  private final String r3name;
  private final String client;
  private final String systemNumber;
  private final String user;
  private final String password;
  private final String language;
  private final String pool_capacity;
  private final String peak_limit;
  private final String saprouter;

  public SapMsSystem(String name, String mhost, String r3name, String group, String client, String systemNumber, String user, String password, String language)
  {
    this.name = name;
    this.client = client;
    this.user = user;
    this.password = password;
    this.mhost = mhost;
    this.systemNumber = systemNumber;
    this.language = language;
    this.group = group;
    this.peak_limit = "";
    this.pool_capacity = "";
    this.r3name = r3name;
    this.saprouter = "";
  }

  public SapMsSystem(String name, String mhost, String r3name, String group, String client, String systemNumber, String user, String password, String language, String saprouter) {
    this.name = name;
    this.client = client;
    this.user = user;
    this.password = password;
    this.mhost = mhost;
    this.systemNumber = systemNumber;
    this.language = language;
    this.group = group;
    this.peak_limit = "";
    this.pool_capacity = "";
    this.r3name = r3name;
    this.saprouter = saprouter;
  }

  public SapMsSystem(String name, String mhost, String r3name, String group, String client, String systemNumber, String user, String password, String language, String pool_capacity, String peak_limit)
  {
    this.name = name;
    this.client = client;
    this.user = user;
    this.password = password;
    this.mhost = mhost;
    this.systemNumber = systemNumber;
    this.language = language;
    this.pool_capacity = pool_capacity;
    this.peak_limit = peak_limit;
    this.saprouter = "";
    this.group = group;
    this.r3name = r3name;
  }

  public SapMsSystem(String name, String mhost, String r3name, String group, String client, String systemNumber, String user, String password, String language, String pool_capacity, String peak_limit, String saprouter)
  {
    this.name = name;
    this.client = client;
    this.user = user;
    this.password = password;
    this.mhost = mhost;
    this.systemNumber = systemNumber;
    this.language = language;
    this.pool_capacity = pool_capacity;
    this.peak_limit = peak_limit;
    this.saprouter = saprouter;
    this.group = group;
    this.r3name = r3name;
  }

  public String getName() {
    return this.name;
  }

  public String getClient() {
    return this.client;
  }

  public String getUser() {
    return this.user;
  }

  public String getPassword() {
    return this.password;
  }

  public String getLanguage() {
    return this.language;
  }

  public String getSystemNumber()
  {
    return this.systemNumber;
  }

  public String getPool_capacity() {
    return this.pool_capacity;
  }

  public String getPeak_limit()
  {
    return this.peak_limit;
  }
  public String getSaprouter() {
    return this.saprouter;
  }
  public String getMhost() {
    return this.mhost;
  }
  public String getGroup() {
    return this.group;
  }
  public String getR3name() {
    return this.r3name;
  }

  public String toString()
  {
    return "Client " + this.client + " User " + this.user + " PW " + this.password + 
      " Language " + this.language + " mHost " + this.mhost + " SysID " + 
      this.systemNumber;
  }

  public int hashCode()
  {
    int prime = 31;
    int result = 1;
    result = 31 * result + (this.client == null ? 0 : this.client.hashCode());
    result = 31 * result + (this.mhost == null ? 0 : this.mhost.hashCode());
    result = 31 * result + (
      this.language == null ? 0 : this.language.hashCode());
    result = 31 * result + (this.name == null ? 0 : this.name.hashCode());
    result = 31 * result + (
      this.password == null ? 0 : this.password.hashCode());
    result = 31 * result + (
      this.systemNumber == null ? 0 : this.systemNumber.hashCode());
    result = 31 * result + (this.user == null ? 0 : this.user.hashCode());
    return result;
  }

  public boolean equals(Object obj)
  {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    SapMsSystem other = (SapMsSystem)obj;
    if (this.client == null) {
      if (other.client != null)
        return false;
    } else if (!this.client.equals(other.client))
      return false;
    if (this.mhost == null) {
      if (other.mhost != null)
        return false;
    } else if (!this.mhost.equals(other.mhost))
      return false;
    if (this.language == null) {
      if (other.language != null)
        return false;
    } else if (!this.language.equals(other.language))
      return false;
    if (this.name == null) {
      if (other.name != null)
        return false;
    } else if (!this.name.equals(other.name))
      return false;
    if (this.password == null) {
      if (other.password != null)
        return false;
    } else if (!this.password.equals(other.password))
      return false;
    if (this.systemNumber == null) {
      if (other.systemNumber != null)
        return false;
    } else if (!this.systemNumber.equals(other.systemNumber))
      return false;
    if (this.user == null) {
      if (other.user != null)
        return false;
    } else if (!this.user.equals(other.user))
      return false;
    return true;
  }

  public Object clone()
  {
    try {
      return super.clone();
    } catch (CloneNotSupportedException e) {
      e.printStackTrace();
    }
    return null;
  }
}