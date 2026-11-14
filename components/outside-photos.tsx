const photos = [
  { src: '/photos/bali-lane.jpg', caption: 'Taking the quieter route.', place: 'BALI', alt: 'A palm-lined lane in Bali, with bicycles and flowering trees.', position: '50% 58%' },
  { src: '/photos/kuala-lumpur.jpg', caption: 'Remembering to look up.', place: 'KUALA LUMPUR', alt: 'Looking up at the steel and glass towers in Kuala Lumpur.', position: '50% 35%' },
  { src: '/photos/volcanic-sunset.jpg', caption: 'Worth the pause.', place: 'SOMEWHERE ALONG THE WAY', alt: 'A volcanic mountain silhouetted above the sea beneath a vivid orange sunset.', position: '50% 50%' },
];
export function OutsidePhotos() {
  return <div className="outside-photos">{photos.map((photo, index) => <figure key={photo.src} className={`travel-photo travel-photo-${index + 1}`}><a href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`View photo: ${photo.alt} (opens in a new tab)`}><img src={photo.src} alt={photo.alt} width={index === 2 ? 2554 : 1438} height="1916" loading="lazy" decoding="async" style={{ objectPosition: photo.position }} /><span className="photo-expand" aria-hidden="true">↗</span></a><figcaption><span>{photo.place}</span><p>{photo.caption}</p></figcaption></figure>)}</div>;
}
