::: title
Parsing Bencode with C#
:::

::: description
Bencode is the encoding of the BitTorrent Protocol, and parsing it in C# has a
few complications.
:::

Bencode, the format of Torrent files (including legal ones!) is a seemily simple task to
parse in C#.

For more context, read [here](https://blog.jse.li/posts/torrent/) or [here](https://en.wikipedia.org/wiki/Bencode).

When parsing in C#, I found that I was reading past the end of the data, seeing
strings with length 25,000 in a file I thought was about 24K long.

The trick is, *don't read Bencode into strings in C#*. Strings in C# are UTF-8,
and Bencode is supposed to be ASCII. The issue is, in Bencode-d binary blobs,
sometimes the bit that tells UTF-8 to merge two chars is set, and your data ends
up shorter than it should be.

Read the data as a `byte[]`, and convert it to ASCII (you can use `System.Text.Encoding.ASCII`) when you want to read chars.

----

Just a short post, but it might help someone who comes across similar issues.
