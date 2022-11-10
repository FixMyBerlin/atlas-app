// Those URL helper where used in the first prototype.
// ATM we don't have URLs in our UI, yet.
// But we should …
// So let's keep this file around until we re-added the links to the Inspector

export const osmLink = (id: string) => {
  const pathWithId = id.includes('/') ? id : `way/${id}`
  return (
    <a
      href={`https://www.openstreetmap.org/${pathWithId}`}
      target="_blank"
      className="underline hover:text-blue-500"
      rel="noreferrer"
    >
      OSM
    </a>
  )
}

export const addLink = (maybeLink: string, label: React.ReactNode | string) => {
  if (typeof maybeLink !== 'string') return label
  return maybeLink.startsWith('http') ? (
    <a
      href={maybeLink}
      target="_blank"
      className="underline hover:text-blue-500"
      rel="noreferrer"
    >
      {label}
    </a>
  ) : (
    label
  )
}
