package cn.longhaul.sap.system.model;

public class SapAppSystem
  implements Cloneable
{
  private final String name;
  private final String host;
  private final String client;
  private final String systemNumber;
  private final String user;
  private final String password;
  private final String language;
  private final String pool_capacity;
  private final String peak_limit;
  private final String saprouter;

  public SapAppSystem(String name, String host, String client, String systemNumber, String user, String password, String language)
  {
    this.name = name;
    this.client = client;
    this.user = user;
    this.password = password;
    this.host = host;
    this.systemNumber = systemNumber;
    this.language = language;
    this.peak_limit = "";
    this.pool_capacity = "";
    this.saprouter = "";
  }

  public SapAppSystem(String name, String host, String client, String systemNumber, String user, String password, String language, String saprouter) {
    this.name = name;
    this.client = client;
    this.user = user;
    this.password = password;
    this.host = host;
    this.systemNumber = systemNumber;
    this.language = language;
    this.peak_limit = "";
    this.pool_capacity = "";
    this.saprouter = saprouter;
  }

  public SapAppSystem(String name, String host, String client, String systemNumber, String user, String password, String language, String pool_capacity, String peak_limit)
  {
    this.name = name;
    this.client = client;
    this.user = user;
    this.password = password;
    this.host = host;
    this.systemNumber = systemNumber;
    this.language = language;
    this.pool_capacity = pool_capacity;
    this.peak_limit = peak_limit;
    this.saprouter = "";
  }

  public SapAppSystem(String name, String host, String client, String systemNumber, String user, String password, String language, String pool_capacity, String peak_limit, String saprouter)
  {
    this.name = name;
    this.client = client;
    this.user = user;
    this.password = password;
    this.host = host;
    this.systemNumber = systemNumber;
    this.language = language;
    this.pool_capacity = pool_capacity;
    this.peak_limit = peak_limit;
    this.saprouter = saprouter;
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

  public String getHost() {
    return this.host;
  }

  public String getSystemNumber() {
    return this.systemNumber;
  }

  public String getPool_capacity() {
    return this.pool_capacity;
  }

  public String getPeak_limit() {
    return this.peak_limit;
  }
  public String getSaprouter() {
    return this.saprouter;
  }

  public String toString()
  {
    return "Client " + this.client + " User " + this.user + " PW " + this.password + 
      " Language " + this.language + " Host " + this.host + " SysID " + 
      this.systemNumber;
  }

  public int hashCode()
  {
    int prime = 31;
    int result = 1;
    result = 31 * result + (this.client == null ? 0 : this.client.hashCode());
    result = 31 * result + (this.host == null ? 0 : this.host.hashCode());
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
    SapAppSystem other = (SapAppSystem)obj;
    if (this.client == null) {
      if (other.client != null)
        return false;
    } else if (!this.client.equals(other.client))
      return false;
    if (this.host == null) {
      if (other.host != null)
        return false;
    } else if (!this.host.equals(other.host))
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