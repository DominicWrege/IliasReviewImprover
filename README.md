Improve ILIAS answer grading review process. Currently only works on the
FH-Dortmund and the TH-Koeln ILIAS E-Learning platform. It replaces the the
answer links and replaces theme with the answer text.

[Download for Firefox](https://addons.mozilla.org/en-GB/firefox/addon/iliasreviewimprover/)  
[Download for Chrome](https://chrome.google.com/webstore/detail/ilias-review-improver/jciddffbbmhjgfhgahffiejmiakbghdg?utm_source=chrome-ntp-icon)

Functions:

- Inserts all answers into the table

Tools

- [bun](bun.sh)
- [web-ext](https://github.com/mozilla/web-ext)

## install

```
bun i
```

## build

```
bun run build
```

The compiled zip files are the the `./build` folder.  
example: `./build/ilias_review_improver-1.0.5.zip`

## run

```
bun run start
```

## Test

Use this [test link](https://test7.ilias.de/ilias.php?ref_id=50190&cmd=infoScreen&cmdClass=ilobjtestgui&cmdNode=2e:tk&baseClass=ilRepositoryGUI&ref_id=50190)