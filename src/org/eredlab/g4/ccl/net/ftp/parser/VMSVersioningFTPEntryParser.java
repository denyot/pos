package org.eredlab.g4.ccl.net.ftp.parser;

import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import org.apache.oro.text.regex.MalformedPatternException;
import org.apache.oro.text.regex.MatchResult;
import org.apache.oro.text.regex.Pattern;
import org.apache.oro.text.regex.Perl5Compiler;
import org.apache.oro.text.regex.Perl5Matcher;
import org.eredlab.g4.ccl.net.ftp.FTPClientConfig;

public class VMSVersioningFTPEntryParser extends VMSFTPEntryParser
{
  private Perl5Matcher _preparse_matcher_;
  private Pattern _preparse_pattern_;
  private static final String PRE_PARSE_REGEX = "(.*);([0-9]+)\\s*.*";

  public VMSVersioningFTPEntryParser()
  {
    this(null);
  }

  public VMSVersioningFTPEntryParser(FTPClientConfig config)
  {
    configure(config);
    try
    {
      this._preparse_matcher_ = new Perl5Matcher();
      this._preparse_pattern_ = new Perl5Compiler().compile("(.*);([0-9]+)\\s*.*");
    }
    catch (MalformedPatternException e)
    {
      throw new IllegalArgumentException(
        "Unparseable regex supplied:  (.*);([0-9]+)\\s*.*");
    }
  }

  public List preParse(List original)
  {
    original = super.preParse(original);
    HashMap existingEntries = new HashMap();
    ListIterator iter = original.listIterator();
    while (iter.hasNext()) {
      String entry = ((String)iter.next()).trim();
      MatchResult result = null;
      if (this._preparse_matcher_.matches(entry, this._preparse_pattern_)) {
        result = this._preparse_matcher_.getMatch();
        String name = result.group(1);
        String version = result.group(2);
        NameVersion nv = new NameVersion(name, version);
        NameVersion existing = (NameVersion)existingEntries.get(name);
        if ((existing != null) && 
          (nv.versionNumber < existing.versionNumber)) {
          iter.remove();
        }
        else
        {
          existingEntries.put(name, nv);
        }

      }

    }

    while (iter.hasPrevious()) {
      String entry = ((String)iter.previous()).trim();
      MatchResult result = null;
      if (this._preparse_matcher_.matches(entry, this._preparse_pattern_)) {
        result = this._preparse_matcher_.getMatch();
        String name = result.group(1);
        String version = result.group(2);
        NameVersion nv = new NameVersion(name, version);
        NameVersion existing = (NameVersion)existingEntries.get(name);
        if ((existing != null) && 
          (nv.versionNumber < existing.versionNumber)) {
          iter.remove();
        }
      }

    }

    return original;
  }

  protected boolean isVersioning() {
    return true;
  }

  private class NameVersion
  {
    String name;
    int versionNumber;

    NameVersion(String name, String vers)
    {
      this.name = name;
      this.versionNumber = Integer.parseInt(vers);
    }
  }
}