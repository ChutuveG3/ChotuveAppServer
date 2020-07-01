exports.getVideosSerializer = videos =>
  videos.map(video => ({
    owner: video.owner,
    url: video.download_url,
    title: video.title,
    description: video.description,
    datetime: video.datetime,
    visibility: video.visibility,
    latitude: video.latitude,
    longitude: video.longitude
  }));
