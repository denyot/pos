package org.eredlab.g4.ccl.net.ftp;

import java.util.List;

/** @deprecated */
public class FTPFileIterator
{
  private List rawlines;
  private FTPFileEntryParser parser;
  private static final int UNINIT = -1;
  private static final int DIREMPTY = -2;
  private int itemptr = 0;

  private int firstGoodEntry = -1;

  private static final FTPFile[] EMPTY = new FTPFile[0];

  FTPFileIterator(FTPFileList rawlist)
  {
    this(rawlist, rawlist.getParser());
  }

  FTPFileIterator(FTPFileList rawlist, FTPFileEntryParser parser)
  {
    this.rawlines = rawlist.getLines();
    this.parser = parser;
  }

  private FTPFile parseFTPEntry(String entry)
  {
    return this.parser.parseFTPEntry(entry);
  }

  private int getFirstGoodEntry()
  {
    FTPFile entry = null;
    for (int iter = 0; iter < this.rawlines.size(); iter++)
    {
      String line = (String)this.rawlines.get(iter);
      entry = parseFTPEntry(line);
      if (entry != null)
      {
        return iter;
      }
    }
    return -2;
  }

  private void init()
  {
    this.itemptr = 0;
    this.firstGoodEntry = -1;
  }

  public FTPFile[] getFiles()
  {
    if (this.itemptr != -2)
    {
      init();
    }
    return getNext(0);
  }

  public FTPFile[] getNext(int quantityRequested)
  {
    if (this.firstGoodEntry == -1)
    {
      this.firstGoodEntry = getFirstGoodEntry();
    }
    if (this.firstGoodEntry == -2)
    {
      return EMPTY;
    }

    int max = this.rawlines.size() - this.firstGoodEntry;

    int howMany = quantityRequested == 0 ? max : quantityRequested;
    howMany = howMany + this.itemptr < this.rawlines.size() ? 
      howMany : 
      this.rawlines.size() - this.itemptr;

    FTPFile[] output = new FTPFile[howMany];

    int i = 0; for (int e = this.firstGoodEntry + this.itemptr; 
      i < howMany; e++)
    {
      output[i] = parseFTPEntry((String)this.rawlines.get(e));
      this.itemptr += 1;

      i++;
    }

    return output;
  }

  public boolean hasNext()
  {
    int fge = this.firstGoodEntry;
    if (fge == -2)
    {
      return false;
    }
    if (fge < 0)
    {
      fge = getFirstGoodEntry();
    }
    return fge + this.itemptr < this.rawlines.size();
  }

  public FTPFile next()
  {
    FTPFile[] file = getNext(1);
    if (file.length > 0)
    {
      return file[0];
    }

    return null;
  }

  public FTPFile[] getPrevious(int quantityRequested)
  {
    int howMany = quantityRequested;

    if (howMany > this.itemptr)
    {
      howMany = this.itemptr;
    }
    FTPFile[] output = new FTPFile[howMany];
    int i = howMany; for (int e = this.firstGoodEntry + this.itemptr; i > 0; )
    {
      output[(--i)] = parseFTPEntry((String)this.rawlines.get(--e));
      this.itemptr -= 1;
    }
    return output;
  }

  public boolean hasPrevious()
  {
    int fge = this.firstGoodEntry;
    if (fge == -2)
    {
      return false;
    }
    if (fge < 0)
    {
      fge = getFirstGoodEntry();
    }

    return this.itemptr > fge;
  }

  public FTPFile previous()
  {
    FTPFile[] file = getPrevious(1);
    if (file.length > 0)
    {
      return file[0];
    }

    return null;
  }
}