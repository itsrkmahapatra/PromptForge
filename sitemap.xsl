<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
    <xsl:template match="/">
        <html>
            <head><title>Sitemap</title></head>
            <body>
                <h1>Sitemap</h1>
                <table border="1">
                    <tr><th>Location</th><th>Last Modified</th></tr>
                    <xsl:for-each select="sitemap:urlset/sitemap:url">
                        <tr>
                            <td><xsl:value-of select="sitemap:loc"/></td>
                            <td><xsl:value-of select="sitemap:lastmod"/></td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
