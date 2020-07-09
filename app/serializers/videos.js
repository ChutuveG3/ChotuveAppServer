exports.getVideosSerializer = videos =>
  videos.map(video => ({
    owner: video.owner,
    url: video.download_url,
    title: video.title,
    datetime: video.datetime,
    id: video.id
  }));

exports.getVideoSerializer = ({ video, requesterUsername }) => {
  let reaction = null;
  if (video.likes.includes(requesterUsername)) {
    reaction = 'like';
  } else if (video.dislikes.includes(requesterUsername)) {
    reaction = 'dislike';
  }

  return {
    owner: video.owner,
    url: video.download_url,
    title: video.title,
    description: video.description,
    datetime: video.datetime,
    visibility: video.visibility,
    latitude: video.latitude,
    longitude: video.longitude,
    id: video.id,
    likes: video.likes.length,
    dislikes: video.dislikes.length,
    comments: video.comments,
    reaction
  };
};
