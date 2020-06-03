exports.getVideosSerializer = videos =>
  videos.map(video => ({
    url: video.download_url,
    title: video.title,
    description: video.description,
    datetime: video.datetime,
    visibility: video.visibility
  }));
