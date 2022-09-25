# Return
# The Artful Dodger

A Next.js site to host an art gallery using Google Spreadsheets and Google
Drive as a backend.

## Setup

### Data Backend

The project can be powered by using a Google Spreadsheet that is viewable
publicly. The demo site for this project is powered by the Google Sheet
[here](https://docs.google.com/spreadsheets/d/134_5I84cpDHYFCfCgr1V7p8ArxeNPlOMcS1-D5E3jxk/). You
can setup a similar document and make it "readable" by everyone with the link.

The example document uses images from the web (freely available on
Pexels.com). But, you can use a Google Drive to upload the images. You can then
either use a CDN like Cloudinary to [automatically serve the
images](https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_resources)
from Google Drive. Or download the images onto your web server into the
directory from where you are serving the "built" site.

### Configuration

To configure your site, copy the `.env.local.default` file to `.env.local` and
edit it to point to your Google Spreadsheet and your CDN, if you are using one.

You can either use a free service like opensheet.vercel.app to convert the
spreadsheet to a JSON end-point, or use the `scripts/download-images` script to
download the metadata as a json file to `public/metadata.json`. You need to
remove the `METADATA_URL` configuration from the `.env.local` file if you with
to use the `metadata.json` file from your `public/` directory.

Set `IMAGE_CDN_PREFIX=""` if you are using locally downloaded images on your
server. Configure the thumbnails in the metadata document so that your images
can be found at the location -- `${IMAGE_CDN_PREFIX}/image/${thumbnail}`. You
can use a `../` prefix on your thumbnails, if thumbnails don't live in an
`image` directory.

ALso, remove the `FORCE_CDN` configuration, if you wish to not use CDN when
developing locally.

## Build & Deploy

`yarn build` builds the site. And `yarn export` would export the site to a
static site.

See sample deploy scripts in the `scripts/` directory to see how to deploy this
site. You can see a demo site [here](https://punchagan.github.io/artful-dodger/).
