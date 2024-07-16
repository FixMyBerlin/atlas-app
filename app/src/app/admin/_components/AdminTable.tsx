export const AdminTable = ({
  header,
  children,
}: {
  header: string[]
  children: React.ReactNode
}) => {
  return (
    <table className="overflow-clip rounded bg-white/50">
      <thead>
        <tr className="bg-white/90">
          {header.map((h) => (
            <th key={String(h)}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}
