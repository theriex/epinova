import flask

INDEXHTML = """
<!doctype html>
<html itemscope="itemscope" itemtype="https://schema.org/WebPage"
      xmlns="https://www.w3.org/1999/xhtml" dir="ltr" lang="en-US">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="robots" content="noodp" />
  <meta name="description" content="epinova work in progress" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="mobile-web-app-capable" content="yes"/>
  <link rel="icon" href="https://epinova.com/img/logo.png" />
  <link rel="image_src" href="https://epinova.com/img/logo.png" />
  <meta property="og:image" content="https://epinova.com/img/logo.png" />
  <meta property="twitter:image" content="https://epinova.com/img/logo.png" />
  <meta itemprop="image" content="https://epinova.com/img/logo.png" />
  <title>epinova work in progress</title>
</head>
<body id="bodyid">

<h3>No interim conversion work, all sites live.  See <a href="https://epinova.com">epinova.com</a> for ogoing projects. </h3>

</body>
</html>
"""

def startpage():
    resp = flask.make_response(INDEXHTML)
    resp.mimetype = "text/html"
    return resp
